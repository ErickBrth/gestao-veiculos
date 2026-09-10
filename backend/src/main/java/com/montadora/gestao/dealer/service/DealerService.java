package com.montadora.gestao.dealer.service;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.montadora.gestao.dealer.domain.Dealer;
import com.montadora.gestao.dealer.dto.DealerRequest;
import com.montadora.gestao.dealer.dto.DealerResponse;
import com.montadora.gestao.dealer.mapper.DealerMapper;
import com.montadora.gestao.dealer.repository.DealerRepository;
import com.montadora.gestao.shared.exception.BusinessException;
import com.montadora.gestao.shared.exception.NotFoundException;

@Service
public class DealerService {

    private static final Logger log = LoggerFactory.getLogger(DealerService.class);

    private final DealerRepository repository;

    public DealerService(DealerRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public List<DealerResponse> findAll() {
        return repository.findAll().stream().map(DealerMapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public DealerResponse findById(Long id) {
        return DealerMapper.toResponse(getOrThrow(id));
    }

    @Transactional
    public DealerResponse create(DealerRequest request) {
        String cnpj = unmask(request.cnpj());
        if (repository.existsByCnpj(cnpj)) {
            throw new BusinessException("Já existe uma concessionária com este CNPJ");
        }
        Dealer saved = repository.save(new Dealer(
                request.corporateName(), cnpj, DealerMapper.toAddress(request.address())));
        log.info("Dealer created id={}", saved.getId());
        return DealerMapper.toResponse(saved);
    }

    @Transactional
    public DealerResponse update(Long id, DealerRequest request) {
        Dealer dealer = getOrThrow(id);
        String cnpj = unmask(request.cnpj());
        if (repository.existsByCnpjAndIdNot(cnpj, id)) {
            throw new BusinessException("Já existe outra concessionária com este CNPJ");
        }
        dealer.update(request.corporateName(), cnpj, DealerMapper.toAddress(request.address()));
        log.info("Dealer updated id={}", id);
        return DealerMapper.toResponse(dealer);
    }

    @Transactional
    public void delete(Long id) {
        repository.delete(getOrThrow(id));
        log.info("Dealer deleted id={}", id);
    }

    @Transactional(readOnly = true)
    public Dealer getOrThrow(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Concessionária " + id + " não encontrada"));
    }

    private String unmask(String value) {
        return value == null ? null : value.replaceAll("\\D", "");
    }
}
