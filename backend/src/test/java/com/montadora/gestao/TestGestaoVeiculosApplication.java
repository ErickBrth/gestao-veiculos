package com.montadora.gestao;

import org.springframework.boot.SpringApplication;

public class TestGestaoVeiculosApplication {

	public static void main(String[] args) {
		SpringApplication.from(GestaoVeiculosApplication::main).with(TestcontainersConfiguration.class).run(args);
	}

}
