package com.montadora.gestao.dealer.mapper;

import com.montadora.gestao.dealer.domain.Address;
import com.montadora.gestao.dealer.domain.Dealer;
import com.montadora.gestao.dealer.dto.AddressRequest;
import com.montadora.gestao.dealer.dto.AddressResponse;
import com.montadora.gestao.dealer.dto.DealerResponse;

/** Manual mapping between entities and DTOs. Stateless, hence the private constructor. */
public final class DealerMapper {

    private DealerMapper() {
    }

    public static Address toAddress(AddressRequest request) {
        if (request == null) {
            return null;
        }
        return new Address(digitsOnly(request.zipCode()), request.street(), request.number(),
                request.complement(), request.neighborhood(), request.city(), request.state());
    }

    public static AddressResponse toAddressResponse(Address address) {
        if (address == null) {
            return null;
        }
        return new AddressResponse(address.getZipCode(), address.getStreet(), address.getNumber(),
                address.getComplement(), address.getNeighborhood(), address.getCity(), address.getState());
    }

    public static DealerResponse toResponse(Dealer dealer) {
        return new DealerResponse(dealer.getId(), dealer.getCorporateName(), dealer.getCnpj(),
                toAddressResponse(dealer.getAddress()));
    }

    private static String digitsOnly(String value) {
        return value == null ? null : value.replaceAll("\\D", "");
    }
}
