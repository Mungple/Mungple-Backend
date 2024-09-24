package com.e106.mungplace.web.exploration;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.e106.mungplace.domain.dogs.entity.Dog;
import com.e106.mungplace.domain.exploration.impl.ExplorationHelper;
import com.e106.mungplace.domain.exploration.repository.ExplorationRepository;
import com.e106.mungplace.web.exception.ApplicationException;

import com.e106.mungplace.web.exception.ApplicationSocketException;
import com.e106.mungplace.web.exception.dto.ApplicationSocketError;
import com.e106.mungplace.web.exploration.dto.ExplorationEventRequest;
import com.e106.mungplace.web.exploration.dto.ExplorationStartWithDogsRequest;
import com.e106.mungplace.web.exploration.service.producer.ExplorationProducer;
import com.fasterxml.jackson.core.JsonProcessingException;
import org.assertj.core.api.Assertions;
import org.assertj.core.api.ThrowableAssert;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.e106.mungplace.domain.exploration.entity.Exploration;
import com.e106.mungplace.domain.exploration.impl.ExplorationReader;
import com.e106.mungplace.domain.user.entity.User;
import com.e106.mungplace.domain.user.impl.UserHelper;
import com.e106.mungplace.web.exception.dto.ApplicationError;
import com.e106.mungplace.web.exploration.service.ExplorationService;

@ExtendWith(MockitoExtension.class)
class ExplorationServiceUnitTest {

	@Mock
	private UserHelper userHelper;

	@Mock
	private ExplorationReader explorationReader;

	@Mock
	private ExplorationHelper explorationHelper;

	@Mock
	private ExplorationRepository explorationRepository;

	@Mock
	private ExplorationProducer producer;

	@InjectMocks
	private ExplorationService explorationService;

	private ExplorationStartWithDogsRequest dogs = new ExplorationStartWithDogsRequest();

	private static final Long CURRENT_USER_ID = 1L;

	@BeforeEach
	void setUp() {
		when(userHelper.getCurrentUserId()).thenReturn(CURRENT_USER_ID);

		List<Dog> dogList = new ArrayList<>();
		dogList.add(Dog.builder().id(1L).build());
		dogs.setDogs(dogList);
	}

	@DisplayName("산책 생성 시 사용자가 이미 산책 중이면 예외가 발생한다.")
	@Test
	void When_UserIsExploring_Then_ThrowException() {
		// given
		when(explorationHelper.validateIsEndedExploration(any())).thenThrow(new ApplicationException(ApplicationError.ALREADY_ON_EXPLORATION));

		// when
		ThrowableAssert.ThrowingCallable expectThrow = () -> explorationService.startExplorationProcess(dogs);

		// then
		Assertions.assertThatThrownBy(expectThrow).isInstanceOf(RuntimeException.class);
	}

	@DisplayName("산책 생성 시 사용자가 애견을 선택하지 않으면 예외가 발생한다.")
	@Test
	void When_UserIsNotWithDogs_Then_ThrowException() {
		// given
		when(explorationHelper.validateExplorationWithDogs(any(ExplorationStartWithDogsRequest.class)))
				.thenThrow(new ApplicationException(ApplicationError.EXPLORATION_NOT_WITH_DOGS));

		// when
		ThrowableAssert.ThrowingCallable expectThrow = () -> explorationService.startExplorationProcess(dogs);

		// then
		Assertions.assertThatThrownBy(expectThrow).isInstanceOf(ApplicationException.class);
	}

	@DisplayName("산책 종료 시 산책이 존재하지 않는다면 예외가 발생한다.")
	@Test
	void When_EndExplorationNotExists_Then_ThrowException() {
		// given
		when(explorationReader.get(any())).thenThrow(new ApplicationException(ApplicationError.EXPLORATION_NOT_FOUND));

		// when
		ThrowableAssert.ThrowingCallable expectThrow = () -> explorationService.endExplorationProcess(1L);

		// then
		Assertions.assertThatThrownBy(expectThrow).isInstanceOf(ApplicationException.class);
	}

	@DisplayName("다른 사용자의 산책을 종료하려 하면 예외가 발생한다.")
	@Test
	void When_EndOtherUserExploration_Then_ThrowException() {
		// given
		User otherUser = new User(2L);
		Exploration exploration = new Exploration(otherUser, LocalDateTime.now());
		when(explorationReader.get(any())).thenReturn(exploration);

		when(explorationHelper.validateIsUsersExploration(any(), any()))
				.thenThrow(new ApplicationException(ApplicationError.EXPLORATION_NOT_OWNED));

		// when
		ThrowableAssert.ThrowingCallable expectThrow = () -> explorationService.endExplorationProcess(1L);

		// then
		Assertions.assertThatThrownBy(expectThrow).isInstanceOf(ApplicationException.class);
	}

	@DisplayName("종료 된 산책에 기록을 보낼 경우 예외가 발생한다.")
	@Test
	void When_Send_WebSocket_With_Ended_Exploration_Then_Fail() {
		// given
		Exploration exploration = new Exploration(new User(userHelper.getCurrentUserId()), LocalDateTime.now());
		exploration.updateId(1L);

		ExplorationEventRequest request = ExplorationEventRequest.builder()
				.userId(1L)
				.latitude("37.5665")
				.longitude("126.978")
				.recordedAt(LocalDateTime.now())
				.build();

		when(explorationReader.getDuringExploring(any())).thenThrow(new ApplicationSocketException(ApplicationSocketError.IS_ENDED_EXPLORATION));

		// when
		ThrowableAssert.ThrowingCallable expectThrow = () -> explorationService.createExplorationEventProcess(request, exploration.getId());

		// then
		Assertions.assertThatThrownBy(expectThrow).isInstanceOf(ApplicationSocketException.class);
	}

	@DisplayName("없는 산책에 기록을 보낼 경우 예외가 발생한다.")
	@Test
	void When_Send_WebSocket_With_NOT_FOUND_Exploration_Then_Fail() {
		// given
		Exploration exploration = new Exploration(new User(userHelper.getCurrentUserId()), LocalDateTime.now());
		exploration.updateId(1L);

		ExplorationEventRequest request = ExplorationEventRequest.builder()
				.userId(1L)
				.latitude("37.5665")
				.longitude("126.978")
				.recordedAt(LocalDateTime.now())
				.build();

		when(explorationReader.getDuringExploring(any())).thenThrow(new ApplicationSocketException(ApplicationSocketError.EXPLORATION_NOT_FOUND));

		// when
		ThrowableAssert.ThrowingCallable expectThrow = () -> explorationService.createExplorationEventProcess(request, exploration.getId());

		// then
		Assertions.assertThatThrownBy(expectThrow).isInstanceOf(ApplicationSocketException.class);
	}
}