package com.montadora.gestao.vehicle.dto;

import com.montadora.gestao.vehicle.domain.FuelType;

import java.math.BigDecimal;

public record VehicleResponse(
        Long id,
        String brand,
        String model,
        FuelType fuelType,
        String color,
        Short manufactureYear,
        String chassis,
        BigDecimal price,
        String externalColor,
        DealerSummary dealer
) {
}
