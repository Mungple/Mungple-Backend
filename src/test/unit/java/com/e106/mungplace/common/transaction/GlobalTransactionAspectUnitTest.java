package com.e106.mungplace.common.transaction;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.List;

import org.aspectj.lang.ProceedingJoinPoint;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class GlobalTransactionAspectUnitTest {

	@Mock
	private ProceedingJoinPoint joinPoint;

	@Mock
	private Rollbackable rollbackableService1;

	@Mock
	private Rollbackable rollbackableService2;

	private GlobalTransactionAspect globalTransactionAspect;

	@BeforeEach
	void setUp() {
		globalTransactionAspect = new GlobalTransactionAspect(List.of(rollbackableService1, rollbackableService2));
	}

	@DisplayName("joinPoint에서 예외가 발생하지 않으면 커밋된다.")
	@Test
	void When_JoinPointNotThrow_Then_Commit() throws Throwable {
		// given
		when(joinPoint.proceed()).thenReturn("success");

		// when
		Object result = globalTransactionAspect.manageTransaction(joinPoint);

		// then
		assertEquals("success", result);
		// 각 서비스의 callProcess()가 호출되었는지 확인
		verify(rollbackableService1).callProcess();
		verify(rollbackableService2).callProcess();
		// 각 서비스의 commit()이 호출되었는지 확인
		verify(rollbackableService1).commit();
		verify(rollbackableService2).commit();
	}

	@Test
	void When_JoinPointThrow_Then_Rollback() throws Throwable {
		// given
		when(joinPoint.proceed()).thenThrow(new RuntimeException("Exception occurred"));

		// when & then
		assertThrows(RuntimeException.class, () -> globalTransactionAspect.manageTransaction(joinPoint));
		// 각 서비스의 callProcess()가 호출되었는지 확인
		verify(rollbackableService1).callProcess();
		verify(rollbackableService2).callProcess();
		// 각 서비스의 rollback()이 호출되었는지 확인
		verify(rollbackableService1).rollback();
		verify(rollbackableService2).rollback();
	}
}