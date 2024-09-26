package com.e106.mungplace.common.transaction;

import static org.assertj.core.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.*;

import java.util.HashMap;
import java.util.Map;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class KeyRollbackableUnitTest {

	static class TestKeyRollbackable extends KeyRollbackable<String> {

		public Map<String, String> repository = new HashMap<>();
		public int rollbackCallCount = 0;

		public void addData(String key, String data) {
			repository.put(key, data);
			addTargetKey(key);
		}

		@Override
		public void rollbackByKey(String key) {
			repository.remove(key);
		}

		@Override
		public void rollback() {
			super.rollback();
			rollbackCallCount++;
		}
	}

	private TestKeyRollbackable service;

	@BeforeEach
	void setUp() {
		service = new TestKeyRollbackable();
	}

	@DisplayName("서비스가 롤백되면 저장된 키가 삭제된다.")
	@Test
	void When_Rollback_Then_DeleteSavedKey() {
		// given
		service.callProcess();
		service.addData("key1", "value1");
		service.addData("key2", "value2");

		// when
		service.rollback();

		// then
		assertThat(service.repository).doesNotContainKeys("key1", "key2");
		assertDoesNotThrow(() -> service.rollback());
	}

	@DisplayName("커밋 이후 롤백되더라도 저장된 키는 삭제되지 않는다.")
	@Test
	void commitClearsKeys() {
		// given
		service.callProcess();
		service.addData("key", "value");

		// when
		service.commit();
		service.rollback();

		// then
		assertThat(service.repository).containsKeys("key");
	}

	@DisplayName("서비스가 롤백 후 커밋되면, 첫 번째는 영향을 미치지 않는다.")
	@Test
	void testLevelManagement() {
		// given
		service.callProcess();
		service.addData("key1", "value1");
		service.callProcess();
		service.addData("key2", "value2");

		// when
		service.rollback();

		// then
		assertThat(service.repository).containsKeys("key1", "key2");
		service.commit();
		assertThat(service.repository).doesNotContainKeys("key1", "key2");
	}
}