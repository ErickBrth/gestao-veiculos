package com.montadora.gestao.dealer.dto;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record AddressRequest(
        @Pattern(regexp = "\\d{8}", message = "CEP deve conter 8 dígitos")
        String zipCode,

        @Size(max = 150) String street,
        @Size(max = 20)  String number,
        @Size(max = 100) String complement,
        @Size(max = 100) String neighborhood,
        @Size(max = 100) String city,

        @Pattern(regexp = "[A-Z]{2}", message = "UF inválida")
        String state
) { }
