package com.montadora.gestao.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;

/**
 * Configures the OpenAPI (Swagger) documentation for the vehicle and dealer management API.
 *
 * <p>UI available at: http://localhost:8080/swagger-ui.html
 * JSON spec at: http://localhost:8080/v3/api-docs
 */
@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI gestaoVeiculosOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("AutoGestão B2B — API Comercial")
                        .version("1.0.0")
                        .description(
                                """
                                API de gestão comercial de veículos e concessionárias da rede autorizada.

                                **Recursos principais:**
                                - CRUD de Concessionárias (`/dealer`)
                                - CRUD de Veículos (`/vehicles`) com filtros por concessionária
                                - Vinculação veículo ↔ concessionária (`PATCH /vehicles/{id}/dealer`)
                                - Auto-preenchimento de endereço via CEP (`/addresses/{zipCode}`)
                                - Actuator em `/actuator/health`, `/actuator/info`, `/actuator/flyway`

                                Erros seguem **RFC 7807** (`application/problem+json`).
                                """)
                        .contact(new Contact()
                                .name("Departamento Comercial — Montadora")
                                .email("comercial@montadora.com.br"))
                        .license(new License()
                                .name("Uso Interno")
                                .url("https://montadora.com.br")))
                .servers(List.of(
                        new Server().url("http://localhost:8080").description("Local (Docker Compose)")));
    }
}
