package com.montadora.gestao.dealer.controller;

import com.montadora.gestao.dealer.dto.DealerRequest;
import com.montadora.gestao.dealer.dto.DealerResponse;
import com.montadora.gestao.dealer.service.DealerService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.List;

@RestController
@RequestMapping("/dealer")
public class DealerController {

    private final DealerService service;

    public DealerController(DealerService service) {
        this.service = service;
    }

    @GetMapping
    public List<DealerResponse> list() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public DealerResponse get(@PathVariable Long id) {
        return service.findById(id);
    }

    @PostMapping
    public ResponseEntity<DealerResponse> create(@RequestBody @Valid DealerRequest request,
                                                 UriComponentsBuilder uriBuilder) {
        DealerResponse created = service.create(request);
        return ResponseEntity
                .created(uriBuilder.path("/dealer/{id}").buildAndExpand(created.id()).toUri())
                .body(created);
    }

    @PutMapping("/{id}")
    public DealerResponse update(@PathVariable Long id, @RequestBody @Valid DealerRequest request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
