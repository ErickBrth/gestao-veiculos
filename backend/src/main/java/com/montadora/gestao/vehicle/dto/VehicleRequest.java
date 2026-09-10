package com.montadora.gestao.vehicle.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import com.montadora.gestao.vehicle.domain.FuelType;

public record VehicleRequest(

        @NotBlank(message = "Marca é obrigatória")
        @Size(max = 80) String brand,

        @NotBlank(message = "Modelo é obrigatório")
        @Size(max = 80) String model,

        @NotNull(message = "Tipo de combustível é obrigatório")
        FuelType fuelType,

        @NotBlank(message = "Cor é obrigatória")
        @Size(max = 40) String color,

        @Min(value = 1900, message = "Ano de fabricação inválido")
        @Max(value = 2100, message = "Ano de fabricação inválido")
        Short manufactureYear,

        @Pattern(regexp = "[A-HJ-NPR-Z0-9]{17}", message = "Chassi deve ter 17 caracteres válidos")
        String chassis,

        @DecimalMin(value = "0.0", inclusive = false, message = "Preço deve ser maior que zero")
        BigDecimal price,

        @Size(max = 40) String externalColor,

        /** Optional: a vehicle may be created without a dealer. */
        Long dealerId
) {
}
