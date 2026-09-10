package com.montadora.gestao.integration.viacep;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.service.annotation.GetExchange;

/**
 * Declarative HTTP Service interface client.
 */
public interface ViaCepClient {

    @GetExchange("/{cep}/json")
    ViaCepResponse findByCep(@PathVariable String cep);
}
