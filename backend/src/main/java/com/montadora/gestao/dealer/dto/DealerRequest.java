package com.montadora.gestao.dealer.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record DealerRequest(
        @NotBlank(message = "Razão social é obrigatória")
        @Size(max = 150, message = "Razão social deve ter no máximo 150 caracteres")
        String corporateName,

        @NotBlank(message = "CNPJ é obrigatório")
        String cnpj,

        @NotNull(message = "Endereço é obrigatório")
        @Valid
        AddressRequest address
) { }