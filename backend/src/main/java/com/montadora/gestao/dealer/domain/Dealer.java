package com.montadora.gestao.dealer.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

import java.time.OffsetDateTime;

@Entity
@Table(name = "dealer")
public class Dealer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "corporate_name", nullable = false, length = 150)
    private String corporateName;

    @Column(name = "cnpj", nullable = false, length = 14, unique = true)
    private String cnpj;

    @Embedded
    private Address address;

    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;

    protected Dealer() {
    }

    public Dealer(String corporateName, String cnpj, Address address) {
        this.corporateName = corporateName;
        this.cnpj = cnpj;
        this.address = address;
    }

    /** Applies changes through the entity so it stays in control of its own state. */
    public void update(String corporateName, String cnpj, Address address) {
        this.corporateName = corporateName;
        this.cnpj = cnpj;
        this.address = address;
    }

    @PrePersist
    void onCreate() {
        this.createdAt = OffsetDateTime.now();
        this.updatedAt = this.createdAt;
    }

    @PreUpdate
    void onUpdate() {
        this.updatedAt = OffsetDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public String getCorporateName() {
        return corporateName;
    }

    public String getCnpj() {
        return cnpj;
    }

    public Address getAddress() {
        return address;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public OffsetDateTime getUpdatedAt() {
        return updatedAt;
    }
}
