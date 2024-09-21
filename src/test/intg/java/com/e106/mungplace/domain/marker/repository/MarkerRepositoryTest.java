package com.e106.mungplace.domain.marker.repository;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import com.e106.mungplace.domain.exploration.entity.Exploration;
import com.e106.mungplace.domain.marker.entity.Marker;
import com.e106.mungplace.domain.user.entity.ProviderName;
import com.e106.mungplace.domain.user.entity.User;

@DataJpaTest
class MarkerRepositoryTest {

	@Autowired
	private TestEntityManager entityManager;

	@Autowired
	private MarkerRepository markerRepository;

	private User user;

	@BeforeEach
	public void setUp() {
		user = User.builder()
			.imageName("testImage.jpg")
			.nickname("Tester")
			.providerName(ProviderName.GOOGLE)
			.providerId("testProviderId123")
			.build();
		entityManager.persist(user);
		entityManager.flush();
	}

	@Test
	void testSaveMarkerWithoutExploration() {
		Marker marker = Marker.builder()
			.user(user)
			.exploration(null)
			.title("TestTitle")
			.content("TestContent")
			.lat(36.9369)
			.lon(-90.9369)
			.build();

		Marker savedMarker = markerRepository.save(marker);

		assertNotNull(savedMarker);
		assertNotNull(savedMarker.getId());
		assertNull(savedMarker.getExploration());
	}

	@Test
	void testSaveMarkerWithExploration() {
		Exploration exploration = new Exploration();
		Marker marker = Marker.builder()
			.user(user)
			.exploration(exploration)
			.title("TestTitle")
			.content("TestContent")
			.lat(36.9369)
			.lon(-90.9369)
			.build();

		Marker savedMarker = markerRepository.save(marker);

		assertNotNull(savedMarker);
		assertNotNull(savedMarker.getId());
		assertNotNull(savedMarker.getExploration());
		assertEquals(exploration.getId(), savedMarker.getExploration().getId());
	}
}
