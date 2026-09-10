package com.montadora.gestao.dealer.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

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
import com.montadora.gestao.dealer.dto.AddressRequest;
import com.montadora.gestao.dealer.dto.DealerRequest;
import com.montadora.gestao.dealer.dto.DealerResponse;
import com.montadora.gestao.dealer.repository.DealerRepository;
import com.montadora.gestao.shared.exception.BusinessException;
import com.montadora.gestao.shared.exception.NotFoundException;

@ExtendWith(MockitoExtension.class)
class DealerServiceTest {

    @Mock
    private DealerRepository repository;

    private DealerService service;

    @BeforeEach
    void setUp() {
        service = new DealerService(repository);
    }

    private AddressRequest sampleAddressRequest() {
        return new AddressRequest("01001000", "Praça da Sé", "100", "lado ímpar", "Sé", "São Paulo", "SP");
    }

    private Dealer sampleDealer(Long id) {
        Dealer dealer = new Dealer("Auto Dealer SA", "12345678000195",
                new Address("01001000", "Praça da Sé", "100", "lado ímpar", "Sé", "São Paulo", "SP"));
        ReflectionTestUtils.setField(dealer, "id", id);
        return dealer;
    }

    @Test
    @DisplayName("findAll returns mapped responses")
    void findAll_ReturnsList() {
        when(repository.findAll()).thenReturn(List.of(sampleDealer(1L), sampleDealer(2L)));

        List<DealerResponse> result = service.findAll();

        assertEquals(2, result.size());
        assertEquals("Auto Dealer SA", result.get(0).corporateName());
    }

    @Test
    @DisplayName("findById returns response when dealer exists")
    void findById_Success() {
        when(repository.findById(1L)).thenReturn(Optional.of(sampleDealer(1L)));

        DealerResponse result = service.findById(1L);

        assertNotNull(result);
        assertEquals(1L, result.id());
        assertEquals("12345678000195", result.cnpj());
    }

    @Test
    @DisplayName("findById throws NotFoundException when dealer does not exist")
    void findById_NotFound() {
        when(repository.findById(99L)).thenReturn(Optional.empty());

        NotFoundException ex = assertThrows(NotFoundException.class, () -> service.findById(99L));
        assertEquals("Concessionária 99 não encontrada", ex.getMessage());
    }

    @Test
    @DisplayName("create unmasks CNPJ and saves new dealer")
    void create_Success() {
        DealerRequest request = new DealerRequest("Auto Dealer SA", "12.345.678/0001-95", sampleAddressRequest());
        when(repository.existsByCnpj("12345678000195")).thenReturn(false);
        when(repository.save(any(Dealer.class))).thenAnswer(invocation -> {
            Dealer dealer = invocation.getArgument(0);
            ReflectionTestUtils.setField(dealer, "id", 1L);
            return dealer;
        });

        DealerResponse result = service.create(request);

        assertNotNull(result);
        assertEquals(1L, result.id());
        assertEquals("12345678000195", result.cnpj());
        verify(repository).save(any(Dealer.class));
    }

    @Test
    @DisplayName("create throws BusinessException when CNPJ is duplicate")
    void create_DuplicateCnpj_ThrowsBusinessException() {
        DealerRequest request = new DealerRequest("Auto Dealer SA", "12.345.678/0001-95", sampleAddressRequest());
        when(repository.existsByCnpj("12345678000195")).thenReturn(true);

        BusinessException ex = assertThrows(BusinessException.class, () -> service.create(request));
        assertEquals("Já existe uma concessionária com este CNPJ", ex.getMessage());
    }

    @Test
    @DisplayName("update modifies entity and triggers dirty checking without explicit save")
    void update_Success() {
        Dealer dealer = sampleDealer(1L);
        when(repository.findById(1L)).thenReturn(Optional.of(dealer));
        when(repository.existsByCnpjAndIdNot("98765432000110", 1L)).thenReturn(false);

        DealerRequest request = new DealerRequest("Novo Nome LTDA", "98.765.432/0001-10", sampleAddressRequest());
        DealerResponse result = service.update(1L, request);

        assertEquals("Novo Nome LTDA", result.corporateName());
        assertEquals("98765432000110", result.cnpj());
    }

    @Test
    @DisplayName("update throws BusinessException when CNPJ belongs to another dealer")
    void update_DuplicateCnpj_ThrowsBusinessException() {
        Dealer dealer = sampleDealer(1L);
        when(repository.findById(1L)).thenReturn(Optional.of(dealer));
        when(repository.existsByCnpjAndIdNot("98765432000110", 1L)).thenReturn(true);

        DealerRequest request = new DealerRequest("Novo Nome LTDA", "98.765.432/0001-10", sampleAddressRequest());
        BusinessException ex = assertThrows(BusinessException.class, () -> service.update(1L, request));
        assertEquals("Já existe outra concessionária com este CNPJ", ex.getMessage());
    }

    @Test
    @DisplayName("delete removes dealer when found")
    void delete_Success() {
        Dealer dealer = sampleDealer(1L);
        when(repository.findById(1L)).thenReturn(Optional.of(dealer));

        service.delete(1L);

        verify(repository).delete(dealer);
    }
}
