package com.montadora.gestao.vehicle.domain;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

import com.montadora.gestao.dealer.domain.Dealer;

@Entity
@Table(name = "vehicle")
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "brand", nullable = false, length = 80)
    private String brand;

    @Column(name = "model", nullable = false, length = 80)
    private String model;

    @Enumerated(EnumType.STRING)
    @Column(name = "fuel_type", nullable = false, length = 20)
    private FuelType fuelType;

    @Column(name = "color", nullable = false, length = 40)
    private String color;

    @Column(name = "manufacture_year")
    private Short manufactureYear;

    @Column(name = "chassis", length = 17, unique = true)
    private String chassis;

    @Column(name = "price", precision = 12, scale = 2)
    private BigDecimal price;

    @Column(name = "external_color", length = 40)
    private String externalColor;

    /**
     * LAZY on purpose: listing vehicles must not drag every dealer along.
     * No cascade: the vehicle lifecycle must never affect the dealer.
     * Nullable: a vehicle may sit in stock without a dealer.
     */
    @ManyToOne(fetch = FetchType.LAZY, optional = true)
    @JoinColumn(name = "dealer_id")
    private Dealer dealer;

    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;

    protected Vehicle() {
        // required by JPA
    }

    public Vehicle(String brand, String model, FuelType fuelType, String color, Short manufactureYear,
                   String chassis, BigDecimal price, String externalColor, Dealer dealer) {
        this.brand = brand;
        this.model = model;
        this.fuelType = fuelType;
        this.color = color;
        this.manufactureYear = manufactureYear;
        this.chassis = chassis;
        this.price = price;
        this.externalColor = externalColor;
        this.dealer = dealer;
    }

    public void update(String brand, String model, FuelType fuelType, String color, Short manufactureYear,
                       String chassis, BigDecimal price, String externalColor, Dealer dealer) {
        this.brand = brand;
        this.model = model;
        this.fuelType = fuelType;
        this.color = color;
        this.manufactureYear = manufactureYear;
        this.chassis = chassis;
        this.price = price;
        this.externalColor = externalColor;
        this.dealer = dealer;
    }

    /** Passing null detaches the vehicle from its current dealer. */
    public void assignDealer(Dealer dealer) {
        this.dealer = dealer;
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

    public String getBrand() {
        return brand;
    }

    public String getModel() {
        return model;
    }

    public FuelType getFuelType() {
        return fuelType;
    }

    public String getColor() {
        return color;
    }

    public Short getManufactureYear() {
        return manufactureYear;
    }

    public String getChassis() {
        return chassis;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public String getExternalColor() {
        return externalColor;
    }

    public Dealer getDealer() {
        return dealer;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public OffsetDateTime getUpdatedAt() {
        return updatedAt;
    }
}
