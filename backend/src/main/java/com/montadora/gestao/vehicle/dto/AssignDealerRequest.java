package com.montadora.gestao.vehicle.dto;

/**
 * Payload for the association endpoint.
 * A null dealerId is valid and means "detach from the current dealer".
 */
public record AssignDealerRequest(Long dealerId) {
}
