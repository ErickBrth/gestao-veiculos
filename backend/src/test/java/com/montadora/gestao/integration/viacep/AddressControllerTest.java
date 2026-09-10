package com.montadora.gestao.integration.viacep;

import static org.hamcrest.Matchers.is;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.montadora.gestao.shared.exception.BusinessException;
import com.montadora.gestao.shared.exception.GlobalExceptionHandler;
import com.montadora.gestao.shared.exception.NotFoundException;

@WebMvcTest(AddressController.class)
@Import(GlobalExceptionHandler.class)
class AddressControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private AddressLookupService service;

    @Test
    @DisplayName("GET /addresses/{zipCode} returns 200 with address details")
    void lookup_Success_Returns200() throws Exception {
        AddressLookupResponse response = new AddressLookupResponse(
                "01001000", "Praça da Sé", "lado ímpar", "Sé", "São Paulo", "SP");
        when(service.findByZipCode("01001000")).thenReturn(response);

        mockMvc.perform(get("/addresses/01001000"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.zipCode", is("01001000")))
                .andExpect(jsonPath("$.street", is("Praça da Sé")))
                .andExpect(jsonPath("$.city", is("São Paulo")))
                .andExpect(jsonPath("$.state", is("SP")));
    }

    @Test
    @DisplayName("GET /addresses/{zipCode} returns 404 ProblemDetail when CEP not found")
    void lookup_NotFound_Returns404() throws Exception {
        when(service.findByZipCode("99999999"))
                .thenThrow(new NotFoundException("CEP 99999999 não encontrado"));

        mockMvc.perform(get("/addresses/99999999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status", is(404)))
                .andExpect(jsonPath("$.detail", is("CEP 99999999 não encontrado")));
    }

    @Test
    @DisplayName("GET /addresses/{zipCode} returns 409 ProblemDetail when provider fails or CEP is invalid")
    void lookup_ProviderError_Returns409() throws Exception {
        when(service.findByZipCode("01001000"))
                .thenThrow(new BusinessException("Serviço de consulta de CEP indisponível. Preencha o endereço manualmente."));

        mockMvc.perform(get("/addresses/01001000"))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.status", is(409)))
                .andExpect(jsonPath("$.detail", is("Serviço de consulta de CEP indisponível. Preencha o endereço manualmente.")));
    }
}
