package com.montadora.gestao.vehicle.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import com.montadora.gestao.vehicle.domain.FuelType;

public record VehicleRequest(

        @NotBlank(message = "Marca é obrigatória")
        @Size(max = 80, message = "Marca deve ter no máximo 80 caracteres")
        String brand,

        @NotBlank(message = "Modelo é obrigatório")
        @Size(max = 80, message = "Modelo deve ter no máximo 80 caracteres")
        String model,

        @NotNull(message = "Tipo de combustível é obrigatório")
        FuelType fuelType,

        @NotBlank(message = "Cor é obrigatória")
        @Size(max = 40, message = "Cor deve ter no máximo 40 caracteres")
        String color,

        @Min(value = 1900, message = "Ano de fabricação deve ser entre 1900 e 2100")
        @Max(value = 2100, message = "Ano de fabricação deve ser entre 1900 e 2100")
        Short manufactureYear,

        @Pattern(regexp = "[A-HJ-NPR-Z0-9]{17}", message = "Chassi deve ter 17 caracteres válidos")
        String chassis,

        @DecimalMin(value = "0.0", inclusive = false, message = "Preço deve ser maior que zero")
        @Digits(integer = 10, fraction = 2, message = "Preço deve ter no máximo 10 dígitos inteiros e 2 decimais")
        BigDecimal price,

        @Size(max = 40, message = "Cor externa deve ter no máximo 40 caracteres")
        String externalColor,

        /** Optional: a vehicle may be created without a dealer. */
        Long dealerId
) {
}
