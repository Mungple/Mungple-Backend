package com.e106.mungplace.config;

import java.util.ArrayList;
import java.util.List;

import org.mockito.Mockito;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;

import com.e106.mungplace.common.transaction.KeyRollbackable;
import com.e106.mungplace.spy.GlobalTransactionNestedTestService;
import com.e106.mungplace.spy.GlobalTransactionTestService;

@TestConfiguration
public class GlobalTransactionAspectTestConfig {

	public final List<String> removedKey = new ArrayList<>();

	@Bean
	public GlobalTransactionTestService testService(KeyRollbackable<String> keyRollbackable) {
		return new GlobalTransactionTestService(keyRollbackable);
	}

	@Bean
	public GlobalTransactionNestedTestService nestedTestService(KeyRollbackable<String> keyRollbackable) {
		return new GlobalTransactionNestedTestService(keyRollbackable, testService(keyRollbackable));
	}

	@Bean
	public KeyRollbackable<String> keyRollbackable() {
		KeyRollbackable<String> original = new KeyRollbackable<>() {
			@Override
			public void rollbackByKey(String key) {
				removedKey.add(key);
			}
		};

		return Mockito.spy(original);
	}
}
