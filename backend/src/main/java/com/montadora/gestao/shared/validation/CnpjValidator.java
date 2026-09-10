package com.montadora.gestao.shared.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

/**

 */
public class CnpjValidator implements ConstraintValidator<Cnpj, String> {

    private static final int[] FIRST_DIGIT_WEIGHTS  = { 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2 };
    private static final int[] SECOND_DIGIT_WEIGHTS = { 6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2 };

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null || value.isBlank()) {
            return true;
        }

        String digits = value.replaceAll("\\D", "");

        if (digits.length() != 14) {
            return false;
        }

        if (digits.chars().distinct().count() == 1) {
            return false;
        }

        int firstDigit = verificationDigit(digits, FIRST_DIGIT_WEIGHTS);
        if (firstDigit != Character.getNumericValue(digits.charAt(12))) {
            return false;
        }

        int secondDigit = verificationDigit(digits, SECOND_DIGIT_WEIGHTS);
        return secondDigit == Character.getNumericValue(digits.charAt(13));
    }

    private int verificationDigit(String digits, int[] weights) {
        int sum = 0;
        for (int i = 0; i < weights.length; i++) {
            sum += Character.getNumericValue(digits.charAt(i)) * weights[i];
        }
        int remainder = sum % 11;
        return remainder < 2 ? 0 : 11 - remainder;
    }
}
