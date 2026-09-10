package com.montadora.gestao.vehicle.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.montadora.gestao.vehicle.dto.VehicleResponse;
import com.montadora.gestao.vehicle.service.VehicleService;

/** Exposes the vehicles of a dealer as a sub resource of /dealer. */
@RestController
@RequestMapping("/dealer/{dealerId}/vehicles")
public class DealerVehicleController {

    private final VehicleService service;

    public DealerVehicleController(VehicleService service) {
        this.service = service;
    }

    @GetMapping
    public List<VehicleResponse> list(@PathVariable Long dealerId) {
        return service.findByDealer(dealerId);
    }
}
