package com.montadora.gestao.dealer.dto;

public record DealerResponse(
        Long id,
        String corporateName,
        String cnpj,
        AddressResponse address
) {
}
