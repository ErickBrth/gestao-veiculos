package com.montadora.gestao.integration.viacep;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Server side proxy for the CEP lookup.
 */
@RestController
@RequestMapping("/addresses")
public class AddressController {

    private final AddressLookupService service;

    public AddressController(AddressLookupService service) {
        this.service = service;
    }

    @GetMapping("/{zipCode}")
    public AddressLookupResponse get(@PathVariable String zipCode) {
        return service.findByZipCode(zipCode);
    }
}
