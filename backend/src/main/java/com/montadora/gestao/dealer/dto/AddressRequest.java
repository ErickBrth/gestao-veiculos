package com.montadora.gestao.dealer.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record AddressRequest(

        @NotBlank (message = "CEP é obrigatório")
        @Pattern(regexp = "\\d{5}-?\\d{3}", message = "CEP deve conter 8 dígitos")
        String zipCode,

        @NotBlank(message = "Logradouro é obrigatório")
        @Size(max = 150, message = "Logradouro deve ter no máximo 150 caracteres")
        String street,

        @NotBlank(message = "Número é obrigatório")
        @Size(max = 20, message = "Número deve ter no máximo 20 caracteres")
        String number,

        @Size(max = 100, message = "Complemento deve ter no máximo 100 caracteres")
        String complement,

        @NotBlank(message = "Bairro é obrigatório")
        @Size(max = 100, message = "Bairro deve ter no máximo 100 caracteres")
        String neighborhood,

        @NotBlank(message = "Cidade é obrigatória")
        @Size(max = 100, message = "Cidade deve ter no máximo 100 caracteres")
        String city,

        @NotBlank(message = "UF é obrigatória")
        @Pattern(regexp = "[A-Z]{2}", message = "UF inválida")
        String state
) { }
