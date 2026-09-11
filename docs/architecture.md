# Visão Geral e Camadas

Arquitetura em camadas organizada por feature (vertical slices). Não é hexagonal
nem clean architecture — a justificativa está em [ADR-001](adrs.md).

## Diagrama de containers

```mermaid
flowchart TB
    Browser["Navegador<br/>React 19 + TypeScript"]

    subgraph Stack["docker compose"]
        Nginx["Nginx<br/>serve o SPA e faz proxy da API"]

        subgraph API["Backend — Spring Boot 4.1.1"]
            direction TB
            C["Controllers<br/>DealerController · VehicleController<br/>DealerVehicleController · AddressController"]
            S["Services<br/>DealerService · VehicleService<br/>AddressLookupService"]
            R["Repositories<br/>DealerRepository · VehicleRepository"]
            D["Domain<br/>Dealer · Address · Vehicle · FuelType"]
        end

        DB[("PostgreSQL 17<br/>schema versionado por Flyway")]
    end

    VC["ViaCEP<br/>serviço externo"]

    Browser -->|"HTTP / JSON"| Nginx
    Nginx -->|"proxy /dealer /vehicles /addresses"| C
    C --> S
    S --> R
    R --> DB
    S -->|"cliente declarativo<br/>@ImportHttpServices"| VC
    S --> D
    R --> D
```

## Camadas e responsabilidades

```mermaid
flowchart LR
    subgraph L1["Controller"]
        direction TB
        A1["rotas, status HTTP<br/>header Location<br/>dispara @Valid"]
    end
    subgraph L2["Service"]
        direction TB
        A2["regras de negócio<br/>transações<br/>mapeamento DTO ↔ entidade"]
    end
    subgraph L3["Repository"]
        direction TB
        A3["acesso a dados<br/>Spring Data JPA<br/>@EntityGraph contra N+1"]
    end
    subgraph L4["Domain"]
        direction TB
        A4["estado próprio<br/>update() · assignDealer()"]
    end

    L1 --> L2 --> L3 --> L4

    X["Transversal<br/>GlobalExceptionHandler (RFC 7807)<br/>@Cnpj · CORS · InetAddressFilter"]
    X -.-> L1
```

As dependências apontam **somente para baixo**. Isso não é convenção
documentada: está verificado em
[`ArchitectureTest`](../../backend/src/test/java/com/montadora/gestao/architecture/ArchitectureTest.java),
que quebra o build se um service importar a camada web ou uma entidade importar
um DTO.

## Estrutura de pacotes

```mermaid
flowchart TB
    Root["com.montadora.gestao"]

    Root --> Dealer["dealer/"]
    Root --> Vehicle["vehicle/"]
    Root --> Integration["integration/viacep/"]
    Root --> Shared["shared/"]
    Root --> Config["config/"]

    Dealer --> DSlice["controller · service · repository<br/>domain · dto · mapper"]
    Vehicle --> VSlice["controller · service · repository<br/>domain · dto · mapper"]
    Integration --> ISlice["ViaCepClient · ViaCepResponse<br/>AddressLookupService · AddressController"]
    Shared --> SSlice["exception/ · validation/"]
    Config --> CSlice["WebConfig (CORS)<br/>HttpClientConfig (SSRF)"]
```

Cada feature nova recebe um pacote de primeiro nível com a mesma forma interna.
Pacote por camada (`controllers/`, `services/` na raiz) espalharia uma única
mudança de feature por seis diretórios.

## Modelo de dados

```mermaid
erDiagram
    DEALER ||--o{ VEHICLE : "possui"

    DEALER {
        bigserial id PK
        varchar corporate_name "NOT NULL"
        varchar cnpj UK "NOT NULL, 14 dígitos sem máscara"
        varchar zip_code "Address @Embeddable"
        varchar street
        varchar number
        varchar complement
        varchar neighborhood
        varchar city
        varchar state "VARCHAR(2), não CHAR(2)"
        timestamptz created_at
        timestamptz updated_at
    }

    VEHICLE {
        bigserial id PK
        varchar brand "NOT NULL"
        varchar model "NOT NULL"
        varchar fuel_type "NOT NULL, EnumType.STRING"
        varchar color "NOT NULL"
        smallint manufacture_year
        varchar chassis UK
        numeric price "NUMERIC(12,2)"
        varchar external_color
        bigint dealer_id FK "NULLABLE, ON DELETE SET NULL"
        timestamptz created_at
        timestamptz updated_at
    }
```

Três decisões concentradas nesse diagrama:

**`dealer_id` é nullable.** Um veículo pode existir em estoque sem
concessionária. Isso transforma "associar" em operação explícita
(`PATCH /vehicles/{id}/dealer`) em vez de efeito colateral do cadastro.

**`ON DELETE SET NULL`.** Excluir uma concessionária desvincula os veículos em
vez de destruir o estoque.

**`fuel_type` como `VARCHAR` com `EnumType.STRING`.** Com `ORDINAL`, reordenar
ou inserir uma constante mudaria silenciosamente o significado de toda linha já
gravada.

## Fluxo de uma requisição

`POST /vehicles` com `dealerId: 1`:

```mermaid
sequenceDiagram
    participant B as Navegador
    participant C as VehicleController
    participant V as Bean Validation
    participant S as VehicleService
    participant DS as DealerService
    participant R as VehicleRepository
    participant DB as PostgreSQL
    participant H as GlobalExceptionHandler

    B->>C: POST /vehicles
    C->>V: @Valid VehicleRequest
    alt payload inválido
        V-->>H: MethodArgumentNotValidException
        H-->>B: 422 + errors{campo: mensagem}
    else payload válido
        C->>S: create(request)
        Note over S: abre transação
        S->>R: existsByChassis
        alt chassi duplicado
            S-->>H: BusinessException
            H-->>B: 409
        else
            S->>DS: getOrThrow(dealerId)
            alt concessionária inexistente
                DS-->>H: NotFoundException
                H-->>B: 404
            else
                S->>R: save(vehicle)
                R->>DB: INSERT
                Note over S: commit
                S-->>C: VehicleResponse
                C-->>B: 201 + Location
            end
        end
    end
```

## Fronteiras explícitas

**DTOs na borda.** Entidades nunca saem da camada de service. Três motivos
concretos: evita loop infinito de serialização no `@ManyToOne`, desacopla o
contrato da API do schema do banco, e impede vazamento de campos internos
(`created_at`, `updated_at`). `VehicleResponse` carrega um `DealerSummary`
(id + razão social), nunca a entidade `Dealer`.

**Camada anticorrupção em `integration/viacep`.** `ViaCepResponse` espelha o
JSON do provedor (chaves em português, flag `erro`). `AddressLookupService`
traduz para `AddressLookupResponse`, que é nosso. Nada fora desse pacote —
incluindo o frontend — sabe que o ViaCEP existe. Trocar de provedor mexe em um
pacote. Detalhes em [ViaCEP e SSRF](../api/viacep.md).