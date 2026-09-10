package com.montadora.gestao.vehicle.dto;

/**
 * Flattened dealer view returned inside a vehicle.
 * Returning a summary instead of the entity is what prevents the
 * infinite serialization loop across the association.
 */
public record DealerSummary(Long id, String corporateName) {
}
