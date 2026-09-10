package com.montadora.gestao.vehicle.domain;

/**
 * Persisted as a string via EnumType.STRING, never ORDINAL:
 * with ORDINAL, reordering or inserting a constant would silently
 * change the meaning of every row already stored.
 */
public enum FuelType {
    FLEX,
    GASOLINA,
    ETANOL,
    DIESEL,
    HIBRIDO,
    ELETRICO,
    GNV
}
