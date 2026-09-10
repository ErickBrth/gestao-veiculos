# Especificação de Endpoints da API

Todas as respostas de erro seguem o padrão **RFC 7807 (`ProblemDetail`)**.

---

## 1. Concessionárias (`/dealer`)

| Método | Rota | Descrição | Códigos de Retorno |
|---|---|---|---|
| `GET` | `/dealer` | Lista todas as concessionárias | `200 OK` |
| `GET` | `/dealer/{id}` | Detalhes de uma concessionária | `200 OK`, `404 Not Found` |
| `POST` | `/dealer` | Cadastra concessionária | `201 Created` (`Location`), `409 Conflict`, `422 Unprocessable` |
| `PUT` | `/dealer/{id}` | Atualiza concessionária | `200 OK`, `404 Not Found`, `409 Conflict`, `422 Unprocessable` |
| `DELETE` | `/dealer/{id}` | Exclui concessionária (desassocia veículos) | `204 No Content` |
| `GET` | `/dealer/{id}/vehicles` | Lista veículos da concessionária | `200 OK`, `404 Not Found` |

### Exemplo de Payload - Criar Concessionária (POST `/dealer`)
```json
{
  "corporateName": "Concessionária Oeste LTDA",
  "cnpj": "45.678.901/0001-75",
  "address": {
    "zipCode": "58400000",
    "street": "Rua das Flores",
    "number": "500",
    "neighborhood": "Centro",
    "city": "Campina Grande",
    "state": "PB"
  }
}
```

---

## 2. Veículos (`/vehicles`)

| Método | Rota | Descrição | Códigos de Retorno |
|---|---|---|---|
| `GET` | `/vehicles` | Lista veículos (`?dealerId=` / `?unassigned=true`) | `200 OK` |
| `GET` | `/vehicles/{id}` | Detalhes de um veículo | `200 OK`, `404 Not Found` |
| `POST` | `/vehicles` | Cadastra veículo | `201 Created` (`Location`), `404 Not Found`, `409 Conflict`, `422 Unprocessable` |
| `PUT` | `/vehicles/{id}` | Atualiza veículo | `200 OK`, `404 Not Found`, `409 Conflict`, `422 Unprocessable` |
| `PATCH` | `/vehicles/{id}/dealer` | Associa/desassocia concessionária | `200 OK`, `404 Not Found` |
| `DELETE` | `/vehicles/{id}` | Exclui veículo | `204 No Content` |

### Exemplo de Associação de Concessionária (PATCH `/vehicles/{id}/dealer`)
```json
{
  "dealerId": 1
}
```
*Para desassociar, envie `"dealerId": null`.*

---

## 3. Endereços e CEP (`/addresses`)

| Método | Rota | Descrição | Códigos de Retorno |
|---|---|---|---|
| `GET` | `/addresses/{zipCode}` | Consulta endereço via proxy | `200 OK`, `404 Not Found`, `409 Conflict` |

---

## 4. Estrutura de Resposta de Erro (RFC 7807)

```json
{
  "type": "about:blank",
  "title": "Erro de validação",
  "status": 422,
  "detail": "Um ou mais campos são inválidos",
  "errors": {
    "corporateName": "Razão social é obrigatória",
    "cnpj": "CNPJ inválido"
  }
}
```
