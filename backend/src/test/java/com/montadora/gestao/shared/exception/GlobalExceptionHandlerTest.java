package com.montadora.gestao.shared.exception;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.assertj.MockMvcTester;

import com.montadora.gestao.dealer.controller.DealerController;
import com.montadora.gestao.dealer.service.DealerService;

import static org.assertj.core.api.Assertions.assertThat;


@WebMvcTest(DealerController.class)
class GlobalExceptionHandlerTest {

    @Autowired
    private MockMvcTester mvc;

    @MockitoBean
    private DealerService service;

    @Test
    @DisplayName("non-numeric path variable returns 400, not 500")
    void nonNumericPathVariableReturnsBadRequest() {
        assertThat(mvc.get().uri("/dealer/abc"))
                .hasStatus(400)
                .hasContentTypeCompatibleWith("application/problem+json")
                .bodyJson().extractingPath("$.title").isEqualTo("Parâmetro inválido");
    }

    @Test
    @DisplayName("unsupported method returns 405, not 500")
    void unsupportedMethodReturnsMethodNotAllowed() {
        assertThat(mvc.post().uri("/dealer/1"))
                .hasStatus(405)
                .bodyJson().extractingPath("$.title").isEqualTo("Método não permitido");
    }
}