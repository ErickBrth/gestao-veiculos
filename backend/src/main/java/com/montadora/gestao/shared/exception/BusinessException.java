package com.montadora.gestao.shared.exception;

/** Thrown when a business rule is violated. Maps to HTTP 409. */
public class BusinessException extends RuntimeException {

    public BusinessException(String message) {
        super(message);
    }
}
