package com.montadora.gestao.shared.validation;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

class CnpjValidatorTest {

    private CnpjValidator validator;

    @BeforeEach
    void setUp() {
        validator = new CnpjValidator();
    }

    @ParameterizedTest
    @ValueSource(strings = {
            "12.345.678/0001-95",
            "12345678000195",
            "11.222.333/0001-81",
            "11222333000181",
            "33.000.167/0001-01",
            "33000167000101",
            "60.701.190/0001-04",
            "60701190000104",
            "00.000.000/0001-91",
            "00000000000191"
    })
    @DisplayName("Should validate valid CNPJs, both masked and unmasked")
    void shouldValidateValidCnpj(String cnpj) {
        assertTrue(validator.isValid(cnpj, null));
    }

    @Test
    @DisplayName("Should allow null or blank value (delegating presence check to @NotBlank)")
    void shouldAllowNullOrBlank() {
        assertTrue(validator.isValid(null, null));
        assertTrue(validator.isValid("", null));
        assertTrue(validator.isValid("   ", null));
    }

    @ParameterizedTest
    @ValueSource(strings = {
            "11.111.111/1111-11",
            "22222222222222",
            "00000000000000"
    })
    @DisplayName("Should reject CNPJs with repeated identical digits")
    void shouldRejectRepeatedDigits(String cnpj) {
        assertFalse(validator.isValid(cnpj, null));
    }

    @ParameterizedTest
    @ValueSource(strings = {
            "12.345.678/0001-94", // invalid 2nd check digit
            "12.345.678/0001-85", // invalid 1st check digit
            "33.000.167/0001-99"
    })
    @DisplayName("Should reject CNPJs with invalid verification digits")
    void shouldRejectInvalidCheckDigits(String cnpj) {
        assertFalse(validator.isValid(cnpj, null));
    }

    @ParameterizedTest
    @ValueSource(strings = {
            "123",
            "1234567800019",     // 13 digits
            "1234567800019599"   // 16 digits
    })
    @DisplayName("Should reject CNPJs with invalid length")
    void shouldRejectInvalidLength(String cnpj) {
        assertFalse(validator.isValid(cnpj, null));
    }
}
