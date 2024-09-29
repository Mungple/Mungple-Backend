package com.e106.mungplace.domain.exploration.impl;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.e106.mungplace.domain.dogs.entity.Dog;
import com.e106.mungplace.domain.dogs.repository.DogRepository;
import com.e106.mungplace.domain.exploration.entity.DogExploration;
import com.e106.mungplace.domain.exploration.entity.Exploration;
import com.e106.mungplace.domain.exploration.entity.ExplorePoint;
import com.e106.mungplace.domain.exploration.repository.DogExplorationRepository;
import com.e106.mungplace.domain.exploration.repository.ExplorationRepository;
import com.e106.mungplace.domain.exploration.repository.ExplorePointRepository;
import com.e106.mungplace.domain.user.entity.User;
import com.e106.mungplace.web.exploration.dto.ExplorationEventRequest;
import com.e106.mungplace.web.exploration.dto.ExplorationPayload;
import com.e106.mungplace.web.exploration.dto.ExplorationPoint;
import com.e106.mungplace.web.exploration.dto.ExplorationStartWithDogsRequest;
import com.e106.mungplace.web.exception.ApplicationException;

@ExtendWith(MockitoExtension.class)
public class ExplorationHelperUnitTest {

	@Mock
	private ExplorePointRepository explorePointRepository;

	@Mock
	private DogRepository dogRepository;

	@Mock
	private DogExplorationRepository dogExplorationRepository;

	@Mock
	private ExplorationRepository explorationRepository;

	@InjectMocks
	private ExplorationHelper explorationHelper;

	private List<ExplorePoint> explorePoints;
	private List<DogExploration> dogExplorations;

	@BeforeEach
	void setUp() {
		explorePoints = new ArrayList<>();
		explorePoints.add(ExplorePoint.builder()
			.explorationId(1L)
			.userId(100L)
			.point(new com.e106.mungplace.common.map.dto.Point(35.166668, 129.066666))  // GeoPoint 데이터
			.build());

		dogExplorations = new ArrayList<>();
		Dog dog = Dog.builder().id(1L).build();
		dogExplorations.add(DogExploration.builder().dog(dog).isEnded(false).build());
	}

	@Test
	@DisplayName("ExplorationPath 조회 - 산책 경로가 정상적으로 반환되는지 테스트")
	void testGetExplorationPath() {
		// given
		when(explorePointRepository.findByExplorationId(anyLong())).thenReturn(explorePoints);

		// when
		List<ExplorationPoint> result = explorationHelper.getExplorationPath(1L);

		// then
		assertNotNull(result);
		assertEquals(1, result.size());
		assertEquals(35.166668, result.get(0).lat());
		assertEquals(129.066666, result.get(0).lon());
		verify(explorePointRepository, times(1)).findByExplorationId(anyLong());
	}

	@Test
	@DisplayName("강아지들을 산책에 등록 - Exploration에 강아지들을 정상적으로 추가하는지 테스트")
	void testCreateDogsInExploration() {
		// given
		Exploration exploration = mock(Exploration.class);
		ExplorationStartWithDogsRequest request = new ExplorationStartWithDogsRequest(
			"35.166668",
			"129.066666",
			List.of(1L, 2L)
		);

		when(dogRepository.findById(anyLong())).thenReturn(Optional.of(mock(Dog.class)));

		// when
		explorationHelper.createDogsInExploration(request, exploration);

		// then
		verify(dogExplorationRepository, times(2)).save(any(DogExploration.class));
	}

	@Test
	@DisplayName("사용자의 산책 검증 - 사용자의 산책이 맞는지 검증 테스트")
	void testValidateIsUsersExploration() {
		// given
		User user = new User(1L);
		Exploration exploration = new Exploration(user, LocalDateTime.now());

		// when
		boolean result = explorationHelper.validateIsUsersExploration(1L, exploration);

		// then
		assertTrue(result);
	}

	@Test
	@DisplayName("사용자의 산책 검증 - 사용자의 산책이 아닌 경우 예외 발생 테스트")
	void testValidateIsUsersExplorationThrowsException() {
		// given
		User user = new User(2L);
		Exploration exploration = new Exploration(user, LocalDateTime.now());

		// when / then
		assertThrows(ApplicationException.class, () -> explorationHelper.validateIsUsersExploration(1L, exploration));
	}

	@Test
	@DisplayName("산책 시작 시 강아지 검증 - 강아지가 포함된 산책인지 검증 테스트")
	void testValidateExplorationWithDogs() {
		// given
		ExplorationStartWithDogsRequest request = new ExplorationStartWithDogsRequest(
			"35.166668",
			"129.066666",
			List.of(1L, 2L)
		);

		// when
		boolean result = explorationHelper.validateExplorationWithDogs(request);

		// then
		assertTrue(result);
	}

	@Test
	@DisplayName("산책 시작 시 강아지 검증 - 강아지가 없는 경우 예외 발생 테스트")
	void testValidateExplorationWithDogsThrowsException() {
		// given
		ExplorationStartWithDogsRequest request = new ExplorationStartWithDogsRequest(
			"35.166668",
			"129.066666",
			List.of()
		);

		// when / then
		assertThrows(ApplicationException.class, () -> explorationHelper.validateExplorationWithDogs(request));
	}

	@Test
	@DisplayName("진행 중인 산책 검증 - 진행 중인 산책이 없는 경우 정상 동작 테스트")
	void testValidateIsEndedExploration() {
		// given
		when(explorationRepository.existsByUserAndEndAtIsNull(any(User.class))).thenReturn(false);

		// when
		boolean result = explorationHelper.validateIsEndedExploration(1L);

		// then
		assertTrue(result);
	}

	@Test
	@DisplayName("진행 중인 산책 검증 - 진행 중인 산책이 있는 경우 예외 발생 테스트")
	void testValidateIsEndedExplorationThrowsException() {
		// given
		when(explorationRepository.existsByUserAndEndAtIsNull(any(User.class))).thenReturn(true);

		// when / then
		assertThrows(ApplicationException.class, () -> explorationHelper.validateIsEndedExploration(1L));
	}

	@Test
	@DisplayName("산책 이벤트 데이터 생성 - 산책 이벤트 데이터를 정상적으로 생성하는지 테스트")
	void testCreateExplorationEventPayload() {
		// given
		ExplorationEventRequest request = ExplorationEventRequest.builder()
			.lat("35.166668")
			.lon("129.066666")
			.recordedAt(LocalDateTime.now())
			.build();

		// when
		ExplorationPayload result = explorationHelper.createExplorationEventPayload(request);

		// then
		assertNotNull(result);
		assertEquals(35.166668, result.point().lat());
		assertEquals(129.066666, result.point().lon());
	}
}
