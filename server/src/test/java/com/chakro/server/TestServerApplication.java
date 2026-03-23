package com.chakro.server;

import org.springframework.boot.SpringApplication;

public class TestServerApplication {

	public static void main(String[] args) {
		SpringApplication.from(ServerApplication::main).run(args);
	}

}
