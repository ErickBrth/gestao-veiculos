package com.montadora.gestao.vehicle.controller;

import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.is;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.math.BigDecimal;
import java.util.List;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.montadora.gestao.shared.exception.GlobalExceptionHandler;
import com.montadora.gestao.vehicle.domain.FuelType;
import com.montadora.gestao.vehicle.dto.AssignDealerRequest;
import com.montadora.gestao.vehicle.dto.DealerSummary;
import com.montadora.gestao.vehicle.dto.VehicleRequest;
import com.montadora.gestao.vehicle.dto.VehicleResponse;
import com.montadora.gestao.vehicle.service.VehicleService;

@WebMvcTest({VehicleController.class, DealerVehicleController.class})
@Import(GlobalExceptionHandler.class)
class VehicleControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private VehicleService service;

    private VehicleResponse sampleResponse(Long id, Long dealerId) {
        DealerSummary dealerSummary = dealerId == null ? null : new DealerSummary(dealerId, "Auto Dealer SA");
        return new VehicleResponse(
                id, "Toyota", "Corolla", FuelType.FLEX, "Prata",
                (short) 2024, "9BWZZZ377VT004251", new BigDecimal("145000.00"), null, dealerSummary
        );
    }

    @Test
    @DisplayName("GET /vehicles returns 200 with list of vehicles")
    void list_Returns200() throws Exception {
        when(service.findAll(null, null)).thenReturn(List.of(sampleResponse(1L, 1L)));

        mockMvc.perform(get("/vehicles"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id", is(1)))
                .andExpect(jsonPath("$[0].model", is("Corolla")));
    }

    @Test
    @DisplayName("GET /vehicles/{id} returns 200 when vehicle exists")
    void get_Found_Returns200() throws Exception {
        when(service.findById(1L)).thenReturn(sampleResponse(1L, 1L));

        mockMvc.perform(get("/vehicles/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.brand", is("Toyota")));
    }

    @Test
    @DisplayName("POST /vehicles returns 201 with Location header on valid payload")
    void create_Valid_Returns201() throws Exception {
        when(service.create(any(VehicleRequest.class))).thenReturn(sampleResponse(1L, 1L));

        String requestJson = """
                {
                    "brand": "Toyota",
                    "model": "Corolla",
                    "fuelType": "FLEX",
                    "color": "Prata",
                    "manufactureYear": 2024,
                    "chassis": "9BWZZZ377VT004251",
                    "price": 145000.00,
                    "dealerId": 1
                }
                """;

        mockMvc.perform(post("/vehicles")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestJson))
                .andExpect(status().isCreated())
                .andExpect(header().string("Location", containsString("/vehicles/1")))
                .andExpect(jsonPath("$.id", is(1)));
    }

    @Test
    @DisplayName("POST /vehicles returns 422 with field errors when payload is invalid")
    void create_Invalid_Returns422() throws Exception {
        String invalidJson = """
                {
                    "brand": "",
                    "model": "",
                    "fuelType": null,
                    "color": "",
                    "price": -10.0
                }
                """;

        mockMvc.perform(post("/vehicles")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(invalidJson))
                .andExpect(status().isUnprocessableContent())
                .andExpect(jsonPath("$.status", is(422)))
                .andExpect(jsonPath("$.errors.brand", is("Marca é obrigatória")))
                .andExpect(jsonPath("$.errors.fuelType", is("Tipo de combustível é obrigatório")))
                .andExpect(jsonPath("$.errors.price", is("Preço deve ser maior que zero")));
    }

    @Test
    @DisplayName("PATCH /vehicles/{id}/dealer associates or detaches dealer")
    void assignDealer_Returns200() throws Exception {
        when(service.assignDealer(eq(1L), any(AssignDealerRequest.class)))
                .thenReturn(sampleResponse(1L, 2L));

        String requestJson = """
                {
                    "dealerId": 2
                }
                """;

        mockMvc.perform(patch("/vehicles/1/dealer")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.dealer.id", is(2)));
    }

    @Test
    @DisplayName("GET /dealer/{dealerId}/vehicles returns dealer vehicle list")
    void dealerVehicles_Returns200() throws Exception {
        when(service.findByDealer(1L)).thenReturn(List.of(sampleResponse(1L, 1L)));

        mockMvc.perform(get("/dealer/1/vehicles"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id", is(1)));
    }

    @Test
    @DisplayName("DELETE /vehicles/{id} returns 204")
    void delete_Returns204() throws Exception {
        doNothing().when(service).delete(1L);

        mockMvc.perform(delete("/vehicles/1"))
                .andExpect(status().isNoContent());
    }
}
