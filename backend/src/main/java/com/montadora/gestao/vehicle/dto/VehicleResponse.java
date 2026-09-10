package com.montadora.gestao.vehicle.dto;

import java.math.BigDecimal;

import com.montadora.gestao.vehicle.domain.FuelType;

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
