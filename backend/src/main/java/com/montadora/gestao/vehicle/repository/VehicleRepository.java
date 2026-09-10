package com.montadora.gestao.vehicle.repository;

import com.montadora.gestao.vehicle.domain.Vehicle;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface VehicleRepository extends JpaRepository<Vehicle, Long> {

    /**
     * The entity graph turns the LAZY dealer association into a single join,
     * which is what prevents the N+1 select problem when listing vehicles.
     */
    @Override
    @EntityGraph(attributePaths = "dealer")
    List<Vehicle> findAll();

    @EntityGraph(attributePaths = "dealer")
    Optional<Vehicle> findWithDealerById(Long id);

    @EntityGraph(attributePaths = "dealer")
    List<Vehicle> findByDealerId(Long dealerId);

    @EntityGraph(attributePaths = "dealer")
    List<Vehicle> findByDealerIsNull();

    boolean existsByChassis(String chassis);

    boolean existsByChassisAndIdNot(String chassis, Long id);
}
