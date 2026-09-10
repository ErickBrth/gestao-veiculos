package com.montadora.gestao.integration.viacep;


public record AddressLookupResponse(
        String zipCode,
        String street,
        String complement,
        String neighborhood,
        String city,
        String state
) {
}
