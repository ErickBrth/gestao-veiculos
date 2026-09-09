package com.montadora.gestao.dealer.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.montadora.gestao.dealer.domain.Dealer;

public interface DealerRepository extends JpaRepository<Dealer, Long> {
    boolean existsByCnpj(String cnpj);

    boolean existsByCnpjAndIdNot(String cnpj, Long id);
}
