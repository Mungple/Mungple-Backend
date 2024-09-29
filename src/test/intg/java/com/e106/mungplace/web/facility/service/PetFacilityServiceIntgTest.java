package com.e106.mungplace.web.facility.service;

import static org.assertj.core.api.Assertions.*;

import java.util.List;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.elasticsearch.core.geo.GeoPoint;
import org.springframework.test.context.ActiveProfiles;

import com.e106.mungplace.common.map.dto.Point;
import com.e106.mungplace.domain.facility.entity.PetFacilityPoint;
import com.e106.mungplace.domain.facility.repository.PetFacilityPointRepository;
import com.e106.mungplace.domain.util.GeoUtils;
import com.e106.mungplace.web.facility.dto.PetFacilityPointResponse;
import com.e106.mungplace.web.facility.dto.PetFacilityResponse;
import com.e106.mungplace.web.facility.dto.PetFacilitySearchResponse;

@ActiveProfiles("intg")
@SpringBootTest
class PetFacilityServiceIntgTest {

	@Autowired
	private PetFacilityService petFacilityService;

	@Autowired
	private PetFacilityPointRepository pointRepository;

	private PetFacilityPoint petFacilityPoint;

	@BeforeEach
	void setUp() {
		petFacilityPoint = new PetFacilityPoint(1L, new GeoPoint(37.56655, 126.97805));
		pointRepository.save(petFacilityPoint);
	}

	@AfterEach
	void teardown() {
		pointRepository.delete(petFacilityPoint);
	}

	@DisplayName("반경 조회한 시설은 모두 반경 이내에 존재해야 한다.")
	@Test
	void When_SearchPetFacilityPointsByRadius_Then_AllPointsInRadius() {
		// given
		Point centerPoint = new Point(37.5665, 126.9780);
		int radius = 10000000;

		// when
		PetFacilitySearchResponse response = petFacilityService.searchNearbyPetFacilityProcess(centerPoint, radius);

		// then
		List<PetFacilityPointResponse> facilities = response.facilityPoints();

		assertThat(facilities).isNotEmpty();
		assertThat(facilities).map(PetFacilityPointResponse::id).contains(1L);
		assertThat(facilities)
			.map(PetFacilityPointResponse::point)
			.map(point -> GeoUtils.calculateDistance(centerPoint, point))
			.allMatch(distance -> distance <= radius);
	}
}