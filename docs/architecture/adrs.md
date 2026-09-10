# Registros de Decisões de Arquitetura (ADRs)

Este documento registra as decisões técnicas fundamentais tomadas ao longo do desenvolvimento do projeto.

---

## ADR 001: Alinhamento Estrito com Spring Boot 4.1.1
- **Status**: Aprovado e Implementado
- **Contexto**: O projeto utiliza a versão mais recente do Spring Boot (4.1.1) e Spring Framework (7.0.9).
- **Decisão**: 
  - Utilizar `spring-boot-starter-webmvc` em vez de `spring-boot-starter-web` (descontinuado).
  - Utilizar `@MockitoBean` em vez do legado `@MockBean`.
  - Configurar clientes HTTP via `@ImportHttpServices` e `@GetExchange`.
  - Utilizar Jackson 3 (`tools.jackson..`).
- **Consequências**: Elimina dívidas técnicas legadas e adota os padrões oficiais e modernos da plataforma.

---

## ADR 002: Formato de Erro Padronizado (RFC 7807)
- **Status**: Aprovado e Implementado
- **Contexto**: Necessidade de fornecer contratos previsíveis para clientes HTTP e formulários com validação.
- **Decisão**: Todas as respostas de erro HTTP (4xx e 5xx) utilizam o padrão RFC 7807 (`ProblemDetail`) com um campo `errors` estruturado para falhas de validação (`Map<String, String>`).
- **Consequências**: Facilita integração direta com `react-hook-form` (`setError`) no frontend, sem necessidade de parsers complexos de erro.

---

## ADR 003: Proteção contra SSRF na Integração ViaCEP
- **Status**: Aprovado e Implementado
- **Contexto**: O CEP é fornecido pelo usuário e utilizado como parâmetro em requisições de saída para serviço externo.
- **Decisão**: Registrar um `RestClientCustomizer` aplicando `InetAddressFilter.externalAddresses()` para bloquear chamadas direcionadas a endereços de loopback, redes privadas ou metadados de nuvem.
- **Consequências**: Mitigação completa de vulnerabilidades de SSRF (Server-Side Request Forgery).

---

## ADR 004: Desassociação Suave na Exclusão de Concessionária
- **Status**: Aprovado e Implementado
- **Contexto**: O que deve acontecer com os veículos quando uma concessionária é excluída?
- **Decisão**: Os veículos permanecem no estoque central da montadora com `dealer_id = NULL` (`ON DELETE SET NULL`), em vez de serem excluídos em cascata.
- **Consequências**: Preserva o inventário físico de veículos fabricados, permitindo posterior realocação para outra concessionária.

---

## ADR 005: Gestão de Esquema Baseada em Migrações com Flyway
- **Status**: Aprovado e Implementado
- **Contexto**: Manutenção e versionamento do banco de dados em múltiplos ambientes.
- **Decisão**: O Flyway gerencia todas as migrações DDL e DML versionadas (`V1`, `V2`, `V3`), enquanto o Hibernate atua estritamente no modo `hibernate.ddl-auto: validate`.
- **Consequências**: Garante reprodutibilidade do schema e impede divergências silenciosas entre o modelo JPA e as tabelas reais.
