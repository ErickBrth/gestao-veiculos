package com.montadora.gestao.dealer.controller;

import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.is;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.montadora.gestao.dealer.dto.AddressResponse;
import com.montadora.gestao.dealer.dto.DealerRequest;
import com.montadora.gestao.dealer.dto.DealerResponse;
import com.montadora.gestao.dealer.service.DealerService;
import com.montadora.gestao.shared.exception.BusinessException;
import com.montadora.gestao.shared.exception.GlobalExceptionHandler;
import com.montadora.gestao.shared.exception.NotFoundException;

@WebMvcTest(DealerController.class)
@Import(GlobalExceptionHandler.class)
class DealerControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private DealerService service;

    private DealerResponse sampleResponse(Long id) {
        return new DealerResponse(
                id,
                "Auto Dealer SA",
                "12345678000195",
                new AddressResponse("01001000", "Praça da Sé", "100", "lado ímpar", "Sé", "São Paulo", "SP")
        );
    }

    @Test
    @DisplayName("GET /dealer returns 200 and list of dealers")
    void list_Returns200() throws Exception {
        when(service.findAll()).thenReturn(List.of(sampleResponse(1L)));

        mockMvc.perform(get("/dealer"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id", is(1)))
                .andExpect(jsonPath("$[0].corporateName", is("Auto Dealer SA")));
    }

    @Test
    @DisplayName("GET /dealer/{id} returns 200 when dealer exists")
    void get_Found_Returns200() throws Exception {
        when(service.findById(1L)).thenReturn(sampleResponse(1L));

        mockMvc.perform(get("/dealer/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.cnpj", is("12345678000195")));
    }

    @Test
    @DisplayName("GET /dealer/{id} returns 404 ProblemDetail when dealer not found")
    void get_NotFound_Returns404() throws Exception {
        when(service.findById(99L)).thenThrow(new NotFoundException("Concessionária 99 não encontrada"));

        mockMvc.perform(get("/dealer/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status", is(404)))
                .andExpect(jsonPath("$.detail", is("Concessionária 99 não encontrada")));
    }

    @Test
    @DisplayName("POST /dealer returns 201 with Location header on valid payload")
    void create_Valid_Returns201() throws Exception {
        when(service.create(any(DealerRequest.class))).thenReturn(sampleResponse(1L));

        String requestJson = """
                {
                    "corporateName": "Auto Dealer SA",
                    "cnpj": "12.345.678/0001-95",
                    "address": {
                        "zipCode": "01001000",
                        "street": "Praça da Sé",
                        "number": "100",
                        "complement": "lado ímpar",
                        "neighborhood": "Sé",
                        "city": "São Paulo",
                        "state": "SP"
                    }
                }
                """;

        mockMvc.perform(post("/dealer")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestJson))
                .andExpect(status().isCreated())
                .andExpect(header().string("Location", containsString("/dealer/1")))
                .andExpect(jsonPath("$.id", is(1)));
    }

    @Test
    @DisplayName("POST /dealer returns 422 ProblemDetail with field errors when payload is invalid")
    void create_InvalidPayload_Returns422() throws Exception {
        String invalidJson = """
                {
                    "corporateName": "",
                    "cnpj": "123",
                    "address": null
                }
                """;

        mockMvc.perform(post("/dealer")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(invalidJson))
                .andExpect(status().isUnprocessableContent())
                .andExpect(jsonPath("$.status", is(422)))
                .andExpect(jsonPath("$.errors.corporateName", is("Razão social é obrigatória")))
                .andExpect(jsonPath("$.errors.cnpj", is("CNPJ inválido")))
                .andExpect(jsonPath("$.errors.address", is("Endereço é obrigatório")));
    }

    @Test
    @DisplayName("POST /dealer returns 409 ProblemDetail on duplicate CNPJ")
    void create_DuplicateCnpj_Returns409() throws Exception {
        when(service.create(any(DealerRequest.class)))
                .thenThrow(new BusinessException("Já existe uma concessionária com este CNPJ"));

        String requestJson = """
                {
                    "corporateName": "Auto Dealer SA",
                    "cnpj": "12.345.678/0001-95",
                    "address": {
                        "zipCode": "01001000",
                        "street": "Praça da Sé",
                        "number": "100",
                        "neighborhood": "Sé",
                        "city": "São Paulo",
                        "state": "SP"
                    }
                }
                """;

        mockMvc.perform(post("/dealer")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestJson))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.status", is(409)))
                .andExpect(jsonPath("$.detail", is("Já existe uma concessionária com este CNPJ")));
    }

    @Test
    @DisplayName("PUT /dealer/{id} returns 200 on update")
    void update_Valid_Returns200() throws Exception {
        when(service.update(eq(1L), any(DealerRequest.class))).thenReturn(sampleResponse(1L));

        String requestJson = """
                {
                    "corporateName": "Auto Dealer Atualizado",
                    "cnpj": "12.345.678/0001-95",
                    "address": {
                        "zipCode": "01001000",
                        "street": "Praça da Sé",
                        "number": "100",
                        "neighborhood": "Sé",
                        "city": "São Paulo",
                        "state": "SP"
                    }
                }
                """;

        mockMvc.perform(put("/dealer/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(1)));
    }

    @Test
    @DisplayName("DELETE /dealer/{id} returns 204 No Content")
    void delete_Returns204() throws Exception {
        doNothing().when(service).delete(1L);

        mockMvc.perform(delete("/dealer/1"))
                .andExpect(status().isNoContent());
    }
}
