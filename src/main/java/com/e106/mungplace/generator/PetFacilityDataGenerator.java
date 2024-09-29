package com.e106.mungplace.generator;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Profile;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.data.elasticsearch.core.geo.GeoPoint;
import org.springframework.stereotype.Component;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.TransactionStatus;
import org.springframework.transaction.support.DefaultTransactionDefinition;

import com.e106.mungplace.domain.facility.entity.PetFacility;
import com.e106.mungplace.domain.facility.entity.PetFacilityPoint;
import com.e106.mungplace.domain.facility.repository.PetFacilityPointRepository;
import com.e106.mungplace.domain.facility.repository.PetFacilityRepository;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Profile("data")
@Component
public class PetFacilityDataGenerator implements CommandLineRunner {

	private final ResourceLoader resourceLoader;
	private final ApplicationContext applicationContext;
	private final PetFacilityRepository petFacilityRepository;
	private final PetFacilityPointRepository petFacilityPointRepository;
	private final PlatformTransactionManager transactionManager;

	@Override
	public void run(String... args) throws Exception {
		String filename = "data/petFriendlyFacilityData.csv";
		Resource resource = resourceLoader.getResource("classpath:" + filename);

		BufferedReader reader = new BufferedReader(new InputStreamReader(resource.getInputStream()));

		TransactionStatus transaction = transactionManager.getTransaction(new DefaultTransactionDefinition());

		List<PetFacilityPoint> petFacilityPoints = reader.lines()
			.skip(1)
			.map(String::trim)
			.map(this::lineToPetFacility)
			.peek(petFacilityRepository::save)
			.map(this::mapToPoint)
			.toList();

		transactionManager.commit(transaction);

		petFacilityPointRepository.saveAll(petFacilityPoints);

		SpringApplication.exit(applicationContext, () -> 0);
	}

	private PetFacility lineToPetFacility(String line) {
		List<String> parts = parseCustomCSV(line);

		return PetFacility.builder()
			.name(parts.get(0))
			.lat(Double.parseDouble(parts.get(11)))
			.lon(Double.parseDouble(parts.get(12)))
			.address(parts.get(14))
			.phone(parts.get(16))
			.homepage(parts.get(17))
			.closedDays(parts.get(18))
			.businessHours(parts.get(19))
			.description(parts.get(28))
			.build();
	}

	private List<String> parseCustomCSV(String input) {
		List<String> dataList = new ArrayList<>();

		Pattern pattern = Pattern.compile("\"([^\"]*)\"");
		Matcher matcher = pattern.matcher(input);

		// 매칭된 데이터를 리스트에 추가
		while (matcher.find()) {
			dataList.add(matcher.group(1));
		}

		return dataList;
	}

	private PetFacilityPoint mapToPoint(PetFacility facility) {
		return new PetFacilityPoint(facility.getId(), new GeoPoint(facility.getLat(), facility.getLon()));
	}
}
