package com.montadora.gestao.vehicle.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import com.montadora.gestao.dealer.domain.Address;
import com.montadora.gestao.dealer.domain.Dealer;
import com.montadora.gestao.dealer.service.DealerService;
import com.montadora.gestao.shared.exception.BusinessException;
import com.montadora.gestao.shared.exception.NotFoundException;
import com.montadora.gestao.vehicle.domain.FuelType;
import com.montadora.gestao.vehicle.domain.Vehicle;
import com.montadora.gestao.vehicle.dto.AssignDealerRequest;
import com.montadora.gestao.vehicle.dto.VehicleRequest;
import com.montadora.gestao.vehicle.dto.VehicleResponse;
import com.montadora.gestao.vehicle.repository.VehicleRepository;

@ExtendWith(MockitoExtension.class)
class VehicleServiceTest {

    @Mock
    private VehicleRepository repository;

    @Mock
    private DealerService dealerService;

    private VehicleService service;

    @BeforeEach
    void setUp() {
        service = new VehicleService(repository, dealerService);
    }

    private Dealer sampleDealer(Long id) {
        Dealer dealer = new Dealer("Auto Dealer SA", "74225864000144",
                new Address("01001000", "Praça da Sé", "100", null, "Sé", "São Paulo", "SP"));
        ReflectionTestUtils.setField(dealer, "id", id);
        return dealer;
    }

    private Vehicle sampleVehicle(Long id, Dealer dealer) {
        Vehicle vehicle = new Vehicle("Toyota", "Corolla", FuelType.FLEX, "Prata",
                (short) 2024, "9BWZZZ377VT004251", new BigDecimal("145000.00"), null, dealer);
        ReflectionTestUtils.setField(vehicle, "id", id);
        return vehicle;
    }

    @Test
    @DisplayName("findAll returns all vehicles when no filter is specified")
    void findAll_NoFilter() {
        when(repository.findAll()).thenReturn(List.of(sampleVehicle(1L, sampleDealer(1L))));

        List<VehicleResponse> result = service.findAll(null, null);

        assertEquals(1, result.size());
        assertEquals("Corolla", result.get(0).model());
    }

    @Test
    @DisplayName("findAll filters unassigned vehicles when unassigned=true")
    void findAll_Unassigned() {
        when(repository.findByDealerIsNull()).thenReturn(List.of(sampleVehicle(2L, null)));

        List<VehicleResponse> result = service.findAll(null, true);

        assertEquals(1, result.size());
        assertNull(result.get(0).dealer());
    }

    @Test
    @DisplayName("findAll filters by dealerId when provided")
    void findAll_ByDealerId() {
        when(repository.findByDealerId(1L)).thenReturn(List.of(sampleVehicle(1L, sampleDealer(1L))));

        List<VehicleResponse> result = service.findAll(1L, false);

        assertEquals(1, result.size());
        assertNotNull(result.get(0).dealer());
        assertEquals(1L, result.get(0).dealer().id());
    }

    @Test
    @DisplayName("findByDealer throws NotFoundException when dealer does not exist")
    void findByDealer_DealerNotFound() {
        when(dealerService.getOrThrow(99L)).thenThrow(new NotFoundException("Concessionária 99 não encontrada"));

        NotFoundException ex = assertThrows(NotFoundException.class, () -> service.findByDealer(99L));
        assertEquals("Concessionária 99 não encontrada", ex.getMessage());
    }

    @Test
    @DisplayName("findById returns vehicle response when found")
    void findById_Success() {
        when(repository.findWithDealerById(1L)).thenReturn(Optional.of(sampleVehicle(1L, sampleDealer(1L))));

        VehicleResponse result = service.findById(1L);

        assertEquals(1L, result.id());
        assertEquals("Corolla", result.model());
    }

    @Test
    @DisplayName("create throws BusinessException on duplicate chassis")
    void create_DuplicateChassis_ThrowsBusinessException() {
        VehicleRequest request = new VehicleRequest("Toyota", "Corolla", FuelType.FLEX, "Prata",
                (short) 2024, "9BWZZZ377VT004251", new BigDecimal("145000.00"), null, null);
        when(repository.existsByChassis("9BWZZZ377VT004251")).thenReturn(true);

        BusinessException ex = assertThrows(BusinessException.class, () -> service.create(request));
        assertEquals("Já existe um veículo com este chassi", ex.getMessage());
    }

    @Test
    @DisplayName("create resolves dealer and saves new vehicle")
    void create_Success() {
        VehicleRequest request = new VehicleRequest("Toyota", "Corolla", FuelType.FLEX, "Prata",
                (short) 2024, "9BWZZZ377VT004251", new BigDecimal("145000.00"), null, 1L);
        Dealer dealer = sampleDealer(1L);

        when(repository.existsByChassis("9BWZZZ377VT004251")).thenReturn(false);
        when(dealerService.getOrThrow(1L)).thenReturn(dealer);
        when(repository.save(any(Vehicle.class))).thenAnswer(invocation -> {
            Vehicle vehicle = invocation.getArgument(0);
            ReflectionTestUtils.setField(vehicle, "id", 10L);
            return vehicle;
        });

        VehicleResponse result = service.create(request);

        assertNotNull(result);
        assertEquals(10L, result.id());
        assertEquals(1L, result.dealer().id());
        verify(repository).save(any(Vehicle.class));
    }

    @Test
    @DisplayName("assignDealer associates vehicle with existing dealer")
    void assignDealer_Success() {
        Vehicle vehicle = sampleVehicle(1L, null);
        Dealer dealer = sampleDealer(2L);
        when(repository.findWithDealerById(1L)).thenReturn(Optional.of(vehicle));
        when(dealerService.getOrThrow(2L)).thenReturn(dealer);

        VehicleResponse result = service.assignDealer(1L, new AssignDealerRequest(2L));

        assertNotNull(result.dealer());
        assertEquals(2L, result.dealer().id());
    }

    @Test
    @DisplayName("assignDealer with null dealerId detaches vehicle")
    void assignDealer_Detach_Success() {
        Vehicle vehicle = sampleVehicle(1L, sampleDealer(2L));
        when(repository.findWithDealerById(1L)).thenReturn(Optional.of(vehicle));

        VehicleResponse result = service.assignDealer(1L, new AssignDealerRequest(null));

        assertNull(result.dealer());
    }

    @Test
    @DisplayName("delete removes vehicle when found")
    void delete_Success() {
        Vehicle vehicle = sampleVehicle(1L, null);
        when(repository.findWithDealerById(1L)).thenReturn(Optional.of(vehicle));

        service.delete(1L);

        verify(repository).delete(vehicle);
    }
}
