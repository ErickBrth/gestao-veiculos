package com.montadora.gestao.integration.viacep;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.client.RestClientException;

import com.montadora.gestao.shared.exception.BusinessException;
import com.montadora.gestao.shared.exception.NotFoundException;

@ExtendWith(MockitoExtension.class)
class AddressLookupServiceTest {

    @Mock
    private ViaCepClient client;

    private AddressLookupService service;

    @BeforeEach
    void setUp() {
        service = new AddressLookupService(client);
    }

    @Test
    @DisplayName("findByZipCode unmasks CEP and returns translated response on success")
    void findByZipCode_Success() {
        ViaCepResponse viaCepResponse = new ViaCepResponse(
                "01001-000", "Praça da Sé", "lado ímpar", "Sé", "São Paulo", "SP", null);
        when(client.findByCep("01001000")).thenReturn(viaCepResponse);

        AddressLookupResponse result = service.findByZipCode("01001-000");

        assertNotNull(result);
        assertEquals("01001000", result.zipCode());
        assertEquals("Praça da Sé", result.street());
        assertEquals("São Paulo", result.city());
        assertEquals("SP", result.state());
    }

    @Test
    @DisplayName("findByZipCode throws BusinessException when CEP has invalid length")
    void findByZipCode_InvalidLength_ThrowsBusinessException() {
        BusinessException ex = assertThrows(BusinessException.class, () -> service.findByZipCode("123"));
        assertEquals("CEP deve conter 8 dígitos", ex.getMessage());
    }

    @Test
    @DisplayName("findByZipCode throws NotFoundException when provider returns erro=true")
    void findByZipCode_NotFound_ThrowsNotFoundException() {
        ViaCepResponse notFoundResponse = new ViaCepResponse(null, null, null, null, null, null, "true");
        when(client.findByCep("99999999")).thenReturn(notFoundResponse);

        NotFoundException ex = assertThrows(NotFoundException.class, () -> service.findByZipCode("99999999"));
        assertEquals("CEP 99999999 não encontrado", ex.getMessage());
    }

    @Test
    @DisplayName("findByZipCode catches RestClientException and translates to 409 BusinessException")
    void findByZipCode_ProviderUnavailable_ThrowsBusinessException() {
        when(client.findByCep("01001000")).thenThrow(new RestClientException("Connection timed out"));

        BusinessException ex = assertThrows(BusinessException.class, () -> service.findByZipCode("01001000"));
        assertEquals("Serviço de consulta de CEP indisponível. Preencha o endereço manualmente.", ex.getMessage());
    }
}
