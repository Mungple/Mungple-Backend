package com.e106.mungplace.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import com.e106.mungplace.web.marker.producer.MarkerProducer;

@Configuration
@Profile("intg")
public class TestSchedulerConfig {

	@Bean
	public MarkerProducer markerProducer() {
		return null;
	}
}