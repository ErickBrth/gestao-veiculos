package com.montadora.gestao;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.service.registry.ImportHttpServices;

import com.montadora.gestao.integration.viacep.ViaCepClient;

@SpringBootApplication
@ImportHttpServices(group = "viacep", types = ViaCepClient.class)
public class GestaoVeiculosApplication {

	public static void main(String[] args) {
		SpringApplication.run(GestaoVeiculosApplication.class, args);
	}

}
