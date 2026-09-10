# Estratégia e Padrões de Testes

A suíte de testes do projeto foi construída seguindo a clássica **Pirâmide de Testes**, priorizando testes rápidos e determinísticos com mocks e isolamento de camadas, complementados por testes de arquitetura e integração.

---

## 1. Pirâmide de Testes

```
             / \
            /   \      Testes de Integração & Schema
           /  ▲  \     (SpringBootTest, Testcontainers)
          /───────\
         /         \     Testes de Controladores & Arquitetura
        /     ▲     \    (@WebMvcTest, ArchUnit)
       /─────────────\
      /               \    Testes Unitários & Regras de Negócio
     /        ▲        \   (JUnit 5 + Mockito, Vitest + Factories)
    /───────────────────\
```

---

## 2. Testes do Backend (Java / Spring Boot)

| Camada | Escopo | Ferramentas |
|---|---|---|
| **Regras de Serviço** | Testes unitários puros das regras de negócio (sem contexto Spring) | JUnit 5 + Mockito |
| **Validações** | Validador de CNPJ (Módulo 11) com casos parametrizados | `@ParameterizedTest` |
| **Controladores** | Testes de contratos HTTP, status codes, Location headers e RFC 7807 | `@WebMvcTest` + `@MockitoBean` |
| **Integração Externa** | Cliente ViaCEP com tratamento de 404 e timeouts de rede | `MockRestServiceServer` |
| **Arquitetura** | Verificação estrita de regras de dependência entre camadas | ArchUnit (`ArchitectureTest`) |
| **Schema Smoke Test** | Validação de migrações Flyway e mapeamento JPA com banco real | `@SpringBootTest` + Testcontainers |

### Executando os Testes do Backend
```powershell
cd backend
.\mvnw.cmd clean test
```

---

## 3. Testes do Frontend (React + TypeScript / Vitest)

O frontend possui **99 testes automatizados** divididos em:

- **Schemas Zod (`dealerSchema`, `vehicleSchema`)**:
  - Testes parametrizados com `describe.each` e `it.each` usando fixtures centralizadas.
  - Validação de casos válidos e inválidos de CNPJ, Chassi (VIN 17 caracteres), tipos de combustível e faixas de preço/ano.
- **Cliente HTTP & Interceptors (`client.test.ts`)**:
  - Interceptação de respostas e conversão para instâncias de `ApiError` estruturadas.
  - Tratamento de códigos RFC 7807 (404, 409, 422) e fallbacks para falhas de rede (500).
- **Serviços & Hooks (`addressService.test.ts`)**:
  - `useAddressLookup`: normalização de CEP, debounce/guard clauses, toasts de feedback e tratamento de erros.
- **Componentes de Interface (`uiComponents.test.tsx`)**:
  - Testes de acessibilidade e renderização de `Badge`, `FuelBadge` (todos os 7 combustíveis), `Button`, `Input` e `DeleteConfirmModal`.

### Executando os Testes do Frontend
```powershell
cd frontend
npm test
npm run lint
```
