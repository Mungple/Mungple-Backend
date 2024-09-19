package com.e106.mungplace;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class MungplaceApplication {

	public static void main(String[] args) {
		SpringApplication.run(MungplaceApplication.class, args);
	}

}
