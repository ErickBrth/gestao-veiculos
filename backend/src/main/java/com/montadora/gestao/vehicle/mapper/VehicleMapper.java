package com.montadora.gestao.vehicle.mapper;

import com.montadora.gestao.dealer.domain.Dealer;
import com.montadora.gestao.vehicle.domain.Vehicle;
import com.montadora.gestao.vehicle.dto.DealerSummary;
import com.montadora.gestao.vehicle.dto.VehicleResponse;

public final class VehicleMapper {

    private VehicleMapper() {
    }

    public static VehicleResponse toResponse(Vehicle vehicle) {
        return new VehicleResponse(
                vehicle.getId(),
                vehicle.getBrand(),
                vehicle.getModel(),
                vehicle.getFuelType(),
                vehicle.getColor(),
                vehicle.getManufactureYear(),
                vehicle.getChassis(),
                vehicle.getPrice(),
                vehicle.getExternalColor(),
                toDealerSummary(vehicle.getDealer()));
    }

    private static DealerSummary toDealerSummary(Dealer dealer) {
        if (dealer == null) {
            return null;
        }
        return new DealerSummary(dealer.getId(), dealer.getCorporateName());
    }
}
