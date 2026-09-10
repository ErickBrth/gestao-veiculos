package com.montadora.gestao.vehicle.service;

import com.montadora.gestao.dealer.domain.Dealer;
import com.montadora.gestao.dealer.service.DealerService;
import com.montadora.gestao.shared.exception.BusinessException;
import com.montadora.gestao.shared.exception.NotFoundException;
import com.montadora.gestao.vehicle.domain.Vehicle;
import com.montadora.gestao.vehicle.dto.AssignDealerRequest;
import com.montadora.gestao.vehicle.dto.VehicleRequest;
import com.montadora.gestao.vehicle.dto.VehicleResponse;
import com.montadora.gestao.vehicle.mapper.VehicleMapper;
import com.montadora.gestao.vehicle.repository.VehicleRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class VehicleService {

    private static final Logger log = LoggerFactory.getLogger(VehicleService.class);

    private final VehicleRepository repository;
    private final DealerService dealerService;

    public VehicleService(VehicleRepository repository, DealerService dealerService) {
        this.repository = repository;
        this.dealerService = dealerService;
    }

    @Transactional(readOnly = true)
    public List<VehicleResponse> findAll(Long dealerId, Boolean unassigned) {
        List<Vehicle> vehicles;
        if (Boolean.TRUE.equals(unassigned)) {
            vehicles = repository.findByDealerIsNull();
        }
        else if (dealerId != null) {
            vehicles = repository.findByDealerId(dealerId);
        }
        else {
            vehicles = repository.findAll();
        }
        return vehicles.stream().map(VehicleMapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<VehicleResponse> findByDealer(Long dealerId) {
        dealerService.getOrThrow(dealerId); // 404 for an unknown dealer instead of an empty list
        return repository.findByDealerId(dealerId).stream().map(VehicleMapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public VehicleResponse findById(Long id) {
        return VehicleMapper.toResponse(getOrThrow(id));
    }

    @Transactional
    public VehicleResponse create(VehicleRequest request) {
        if (request.chassis() != null && repository.existsByChassis(request.chassis())) {
            throw new BusinessException("Já existe um veículo com este chassi");
        }
        Dealer dealer = resolveDealer(request.dealerId());

        Vehicle saved = repository.save(new Vehicle(
                request.brand(), request.model(), request.fuelType(), request.color(),
                request.manufactureYear(), request.chassis(), request.price(),
                request.externalColor(), dealer));

        log.info("Vehicle created id={} dealerId={}", saved.getId(), request.dealerId());
        return VehicleMapper.toResponse(saved);
    }

    @Transactional
    public VehicleResponse update(Long id, VehicleRequest request) {
        Vehicle vehicle = getOrThrow(id);
        if (request.chassis() != null && repository.existsByChassisAndIdNot(request.chassis(), id)) {
            throw new BusinessException("Já existe outro veículo com este chassi");
        }
        Dealer dealer = resolveDealer(request.dealerId());

        vehicle.update(request.brand(), request.model(), request.fuelType(), request.color(),
                request.manufactureYear(), request.chassis(), request.price(),
                request.externalColor(), dealer);

        log.info("Vehicle updated id={}", id);
        return VehicleMapper.toResponse(vehicle);
    }

    /** Associates or detaches a vehicle. A null dealerId detaches it. */
    @Transactional
    public VehicleResponse assignDealer(Long id, AssignDealerRequest request) {
        Vehicle vehicle = getOrThrow(id);
        vehicle.assignDealer(resolveDealer(request.dealerId()));
        log.info("Vehicle id={} assigned to dealerId={}", id, request.dealerId());
        return VehicleMapper.toResponse(vehicle);
    }

    @Transactional
    public void delete(Long id) {
        repository.delete(getOrThrow(id));
        log.info("Vehicle deleted id={}", id);
    }

    private Vehicle getOrThrow(Long id) {
        return repository.findWithDealerById(id)
                .orElseThrow(() -> new NotFoundException("Veículo " + id + " não encontrado"));
    }

    private Dealer resolveDealer(Long dealerId) {
        return dealerId == null ? null : dealerService.getOrThrow(dealerId);
    }
}
