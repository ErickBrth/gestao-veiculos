# Sistema de Gestão de Veículos e Concessionárias

Sistema completo para gestão comercial de veículos e concessionárias de montadora automobilística. Inclui backend construído em **Java 21 / Spring Boot 4.1.1**, frontend responsivo em **React + TypeScript (Vite + Tailwind)** e containerização com **Docker & Docker Compose**.

---

## 🛠️ Stack Tecnológica

### Backend
- **Java 21** & **Spring Boot 4.1.1**
- **Spring Data JPA / Hibernate 7**
- **Flyway** (gerenciamento de migrações de banco)
- **PostgreSQL 17**
- **Bean Validation** (com validador customizado `@Cnpj` via Módulo 11)
- **Spring Boot Actuator** (health, info, flyway)
- **Testes**: JUnit 5, Mockito, Testcontainers, ArchUnit

### Frontend
- **React 19** + **TypeScript** + **Vite**
- **Tailwind CSS** + **Lucide Icons**
- **TanStack Query** (gerenciamento de estado assíncrono e cache)
- **React Hook Form** + **Zod** (validação client-side)
- **Axios** (cliente HTTP com interceptors para RFC 7807)
- **Sonner** (feedbacks e notificações toast)
- **Vitest** + **Testing Library** (suíte de testes unitários e de integração)

---

## 🚀 Como Executar

### 1. Via Docker Compose (Recomendado)

Suba toda a aplicação (Postgres, Backend e Frontend/Nginx) com um único comando:

```bash
docker compose up --build
```

- **Frontend**: [http://localhost](http://localhost) (porta 80)
- **Backend API**: [http://localhost:8080](http://localhost:8080)
- **Health Check**: [http://localhost:8080/actuator/health](http://localhost:8080/actuator/health)

Para derrubar os containers:
```bash
docker compose down -v
```

---

### 2. Desenvolvimento Local

#### Pré-requisitos
- Docker (para o banco de dados)
- JDK 21+
- Node.js 22+

#### Backend
```powershell
cd backend
# O plugin spring-boot-docker-compose inicia automaticamente o PostgreSQL em compose.yaml
.\mvnw.cmd spring-boot:run
```

Para rodar os testes do backend:
```powershell
.\mvnw.cmd clean test
```

#### Frontend
```powershell
cd frontend
npm install
npm run dev
```

Para rodar os testes e lint do frontend:
```powershell
npm test
npm run lint
```

---

## 📡 Endpoints da API

Todas as respostas de erro seguem o padrão **RFC 7807 (`ProblemDetail`)**.

| Método | Endpoint | Descrição | Status de Sucesso |
|---|---|---|---|
| `GET` | `/dealer` | Lista todas as concessionárias | `200 OK` |
| `GET` | `/dealer/{id}` | Busca concessionária por ID | `200 OK` (ou `404`) |
| `POST` | `/dealer` | Cadastra nova concessionária | `201 Created` + `Location` |
| `PUT` | `/dealer/{id}` | Atualiza dados da concessionária | `200 OK` |
| `DELETE` | `/dealer/{id}` | Remove concessionária (desassocia veículos) | `204 No Content` |
| `GET` | `/dealer/{id}/vehicles` | Lista veículos de uma concessionária | `200 OK` |
| `GET` | `/vehicles` | Lista veículos (`?dealerId=` / `?unassigned=true`) | `200 OK` |
| `GET` | `/vehicles/{id}` | Busca veículo por ID | `200 OK` (ou `404`) |
| `POST` | `/vehicles` | Cadastra novo veículo | `201 Created` + `Location` |
| `PUT` | `/vehicles/{id}` | Atualiza dados do veículo | `200 OK` |
| `PATCH` | `/vehicles/{id}/dealer` | Associa/desassocia veículo a concessionária (`{"dealerId": id}`) | `200 OK` |
| `DELETE` | `/vehicles/{id}` | Remove veículo | `204 No Content` |
| `GET` | `/addresses/{zipCode}` | Consulta endereço via proxy ViaCEP | `200 OK` (ou `404` / `409`) |
| `GET` | `/actuator/health` | Status de saúde da aplicação e conexões | `200 OK` |

Uma coleção completa de requisições executáveis está disponível no arquivo [`backend/http/api.http`](file:///backend/http/api.http), e a especificação detalhada de contratos está em [`docs/api/endpoints.md`](file:///docs/api/endpoints.md).

---

## 🏛️ Padrões de Projeto e Qualidade

- **SOLID & Clean Code**: Responsabilidades segregadas, métodos curtos e intencionais.
- **Camada de Serviço & Transações**: `@Transactional(readOnly = true)` nas leituras e controle transacional nas mutações.
- **DTOs & Mappers Puros**: Conversões explícitas sem bibliotecas de reflexão/geração
- **Tratamento de Exceções Centralizado**: `GlobalExceptionHandler` mapeia exceções de domínio para RFC 7807.
- **Segurança de Rede**: Filtro SSRF (`InetAddressFilter.externalAddresses()`) no consumo da API ViaCEP.
- **Testes Arquiteturais**: ArchUnit garantindo que dependências apontem apenas para baixo no fluxo em camadas.

---

## 📄 Documentação Adicional

- [`backend/http/api.http`](backend/http/api.http)
- [Arquitetura e ADRs](docs/architecture.md)

