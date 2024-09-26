package com.e106.mungplace.common.transaction;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;

import com.e106.mungplace.config.GlobalTransactionAspectTestConfig;
import com.e106.mungplace.spy.GlobalTransactionNestedTestService;
import com.e106.mungplace.spy.GlobalTransactionTestService;

@SpringBootTest
@ActiveProfiles("intg")
@Import(GlobalTransactionAspectTestConfig.class)
class GlobalTransactionAspectIntgTest {

	@Autowired
	private GlobalTransactionAspectTestConfig config;

	@Autowired
	private GlobalTransactionTestService testService;

	@Autowired
	private GlobalTransactionNestedTestService nestedTestService;

	@Autowired
	private KeyRollbackable<String> keyRollbackable;

	@BeforeEach
	void resetMocks() {
		config.removedKey.clear();
		Mockito.reset(keyRollbackable);
	}

	@DisplayName("@GlobalTransactional이 달린 서비스가 성공하면 commit이 호출된다.")
	@Test
	void When_ServiceSuccess_Then_Commit() {
		// when
		testService.processWithTransaction();

		// then
		verify(keyRollbackable).callProcess();
		verify(keyRollbackable).commit();
		verify(keyRollbackable, never()).rollback();
	}

	@DisplayName("@GlobalTransactional이 달린 서비스가 실패하면 rollback 호출된다.")
	@Test
	void When_ServiceFailure_Then_Rollback() {
		// when
		try {
			testService.processWithTransactionAndException();
		} catch (Exception ignored) {
			// Expected exception
		}

		// then
		verify(keyRollbackable).callProcess();
		verify(keyRollbackable, never()).commit();
		verify(keyRollbackable).rollback();
	}

	/*@DisplayName("@GlobalTransactional이 중첩으로 달린 서비스에서 자식 메서드가 실패하면 rollbackByKey가 1번 호출된다.")
	@Test
	void When_ChildServiceFailure_Then_RollbackOne() {
		// when
		nestedTestService.childRollbackParentCommit();

		// then
		verify(keyRollbackable, times(2)).callProcess();
		verify(keyRollbackable).commit();
		verify(keyRollbackable, times(2)).rollback();
		verify(keyRollbackable).rollbackByKey(any());
		assertThat(config.removedKey).size().isEqualTo(1);
	}*/

	@DisplayName("@GlobalTransactional이 중첩으로 달린 서비스에서 부모 메서드가 실패하면 rollbackByKey가 1번 호출된다.")
	@Test
	void When_ParentServiceFailure_Then_RollbackOne() {
		// when
		try {
			nestedTestService.childCommitParentRollback();
		} catch (Exception ignored) {
		}

		// then
		verify(keyRollbackable, times(2)).callProcess();
		verify(keyRollbackable, times(1)).commit();
		verify(keyRollbackable).rollback();
		verify(keyRollbackable).rollbackByKey(any());
		assertThat(config.removedKey).size().isEqualTo(1);
	}
}