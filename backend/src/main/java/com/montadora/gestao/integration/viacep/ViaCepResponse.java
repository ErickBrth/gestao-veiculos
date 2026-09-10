package com.montadora.gestao.integration.viacep;

public record ViaCepResponse(
        String cep,
        String logradouro,
        String complemento,
        String bairro,
        String localidade,
        String uf,
        String erro
) {

    public boolean notFound() {
        return "true".equalsIgnoreCase(erro) || Boolean.parseBoolean(erro) || cep == null;
    }
}
