package com.e106.mungplace.web.exploration;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import java.time.LocalDateTime;

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
import com.e106.mungplace.web.exception.ApplicationException;
import com.e106.mungplace.web.exception.dto.ApplicationError;
import com.e106.mungplace.web.exploration.service.ExplorationService;

@ExtendWith(MockitoExtension.class)
class ExplorationServiceUnitTest {

	@Mock
	private UserHelper userHelper;

	@Mock
	private ExplorationReader explorationReader;

	@InjectMocks
	private ExplorationService explorationService;

	private static final Long CURRENT_USER_ID = 1L;

	@BeforeEach
	void setUp() {
		when(userHelper.getCurrentUserId()).thenReturn(CURRENT_USER_ID);
	}

	@DisplayName("산책 생성 시 사용자가 이미 산책 중이면 예외가 발생한다.")
	@Test
	void When_UserIsExploring_Then_ThrowException() {
		// given
		when(explorationReader.isExploring(any())).thenReturn(true);

		// when
		ThrowableAssert.ThrowingCallable expectThrow = () -> explorationService.startExplorationProcess();

		// then
		Assertions.assertThatThrownBy(expectThrow).isInstanceOf(RuntimeException.class);
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

		// when
		ThrowableAssert.ThrowingCallable expectThrow = () -> explorationService.endExplorationProcess(1L);

		// then
		Assertions.assertThatThrownBy(expectThrow).isInstanceOf(RuntimeException.class);
	}
}