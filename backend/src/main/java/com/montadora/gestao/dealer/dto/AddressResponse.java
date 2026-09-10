package com.montadora.gestao.dealer.dto;

public record AddressResponse(
        String zipCode,
        String street,
        String number,
        String complement,
        String neighborhood,
        String city,
        String state
) { }
