# Integração ViaCEP & Segurança

O backend atua como um **proxy seguro** para o serviço público do ViaCEP, isolando o frontend de dependências externas diretas e garantindo regras de negócio e proteção contra ataques de rede.

---

## 1. Princípios da Integração

1. **Frontend nunca chama o ViaCEP diretamente**: Todas as consultas passam pelo endpoint `/addresses/{zipCode}` do backend.
2. **Tratamento de CEP inexistente**: O ViaCEP retorna `HTTP 200` com `{ "erro": "true" }` para CEPs válidos no formato mas inexistentes. O backend detecta essa propriedade e converte para `404 Not Found`.
3. **Resiliência a Indisponibilidade**: Se o serviço do ViaCEP estiver fora do ar ou sofrer timeout, a exceção `RestClientException` é convertida em `409 Conflict` com mensagem amigável, impedindo erros `500` genéricos.

---

## 2. Proteção contra SSRF (Server-Side Request Forgery)

Como o CEP provém de input do usuário, o backend aplica um filtro restritivo de endereços IP:

```java
@Bean
RestClientCustomizer viacepSecurityCustomizer() {
    return builder -> builder.requestFactory(
        ClientHttpRequestFactories.get(
            ClientHttpRequestFactorySettings.DEFAULTS
                .withInetAddressFilter(InetAddressFilter.externalAddresses())
        )
    );
}
```

Isso garante que valores manipulados não consigam atingir `localhost`, faixas de rede privada (`10.0.0.0/8`, `192.168.0.0/16`) ou endpoints de metadados de nuvem (`169.254.169.254`).
