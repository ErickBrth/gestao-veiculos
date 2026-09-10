# Regras de Negócio e Domínio

Este documento especifica as regras de negócio e validações aplicadas aos modelos de Concessionária e Veículo.

---

## 1. Concessionárias (`Dealer`)

- **CNPJ**:
  - Obrigatório, único no sistema.
  - Armazenado sem máscara (`VARCHAR(14)`).
  - Validado via algoritmo oficial **Módulo 11** tanto no backend (`@Cnpj`) quanto no frontend (schema Zod).
  - Rejeita dígitos verificadores incorretos e sequências com todos os dígitos repetidos (ex: `00000000000000`, `11111111111111`).
- **Razão Social (`corporateName`)**:
  - Obrigatória, máximo de 150 caracteres.
- **Endereço (`Address`)**:
  - `zipCode`: CEP obrigatório com 8 dígitos numéricos.
  - `state`: UF obrigatória com exatamente 2 caracteres em maiúsculo (`VARCHAR(2)`).
  - `city`: Município obrigatório.
  - `street`, `number`, `neighborhood`: campos complementares de logradouro.

---

## 2. Veículos (`Vehicle`)

- **Marca (`brand`) & Modelo (`model`)**:
  - Obrigatórios, máximo de 100 caracteres.
- **Tipo de Combustível (`fuelType`)**:
  - Obrigatório, restrito aos valores do enum:
    `FLEX`, `GASOLINA`, `ETANOL`, `DIESEL`, `HIBRIDO`, `ELETRICO`, `GNV`.
- **Cor (`color`)**:
  - Obrigatória, máximo de 50 caracteres.
- **Chassi (`chassis` / VIN)**:
  - Opcional, mas se informado deve ser **único**.
  - Padrão internacional de 17 caracteres alfanuméricos (`/^[A-HJ-NPR-Z0-9]{17}$/`).
  - Caracteres proibidos: letras `I`, `O` e `Q` (para evitar confusão com `1` e `0`).
- **Preço (`price`)**:
  - Opcional, numérico positivo com 2 casas decimais (`NUMERIC(12,2)`).
- **Ano de Fabricação (`manufactureYear`)**:
  - Opcional, numérico entre 1900 e 2100.
- **Associação com Concessionária (`dealerId`)**:
  - Opcional (`nullable`). Se `null`, o veículo está no estoque central da montadora.
  - Ao excluir a concessionária, o relacionamento é desfeito (`ON DELETE SET NULL`), mantendo o veículo no estoque.
