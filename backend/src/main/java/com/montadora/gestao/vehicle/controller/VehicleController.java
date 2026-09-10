package com.montadora.gestao.vehicle.controller;

import com.montadora.gestao.vehicle.dto.AssignDealerRequest;
import com.montadora.gestao.vehicle.dto.VehicleRequest;
import com.montadora.gestao.vehicle.dto.VehicleResponse;
import com.montadora.gestao.vehicle.service.VehicleService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.List;

@RestController
@RequestMapping("/vehicles")
public class VehicleController {

    private final VehicleService service;

    public VehicleController(VehicleService service) {
        this.service = service;
    }

    @GetMapping
    public List<VehicleResponse> list(@RequestParam(required = false) Long dealerId,
                                      @RequestParam(required = false) Boolean unassigned) {
        return service.findAll(dealerId, unassigned);
    }

    @GetMapping("/{id}")
    public VehicleResponse get(@PathVariable Long id) {
        return service.findById(id);
    }

    @PostMapping
    public ResponseEntity<VehicleResponse> create(@RequestBody @Valid VehicleRequest request,
                                                  UriComponentsBuilder uriBuilder) {
        VehicleResponse created = service.create(request);
        return ResponseEntity
                .created(uriBuilder.path("/vehicles/{id}").buildAndExpand(created.id()).toUri())
                .body(created);
    }

    @PutMapping("/{id}")
    public VehicleResponse update(@PathVariable Long id, @RequestBody @Valid VehicleRequest request) {
        return service.update(id, request);
    }

    /** PATCH because this changes a single relationship, not the whole resource. */
    @PatchMapping("/{id}/dealer")
    public VehicleResponse assignDealer(@PathVariable Long id,
                                        @RequestBody AssignDealerRequest request) {
        return service.assignDealer(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
