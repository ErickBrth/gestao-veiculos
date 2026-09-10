package com.montadora.gestao.integration.viacep;

import com.montadora.gestao.shared.exception.BusinessException;
import com.montadora.gestao.shared.exception.NotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;

@Service
public class AddressLookupService {

    private static final Logger log = LoggerFactory.getLogger(AddressLookupService.class);

    private final ViaCepClient client;

    public AddressLookupService(ViaCepClient client) {
        this.client = client;
    }

    public AddressLookupResponse findByZipCode(String rawZipCode) {
        String zipCode = rawZipCode == null ? "" : rawZipCode.replaceAll("\\D", "");
        if (zipCode.length() != 8) {
            throw new BusinessException("CEP deve conter 8 dígitos");
        }

        ViaCepResponse response;
        try {
            response = client.findByCep(zipCode);
        }
        catch (RestClientException ex) {
            log.warn("ViaCEP lookup failed for zipCode={}", zipCode, ex);
            throw new BusinessException("Serviço de consulta de CEP indisponível. Preencha o endereço manualmente.");
        }

        if (response == null || response.notFound()) {
            throw new NotFoundException("CEP " + zipCode + " não encontrado");
        }

        log.info("ViaCEP lookup succeeded for zipCode={}", zipCode);
        return new AddressLookupResponse(
                zipCode,
                response.logradouro(),
                response.complemento(),
                response.bairro(),
                response.localidade(),
                response.uf());
    }
}
