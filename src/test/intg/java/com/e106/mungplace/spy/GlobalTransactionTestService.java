package com.e106.mungplace.spy;

import com.e106.mungplace.common.transaction.GlobalTransactional;
import com.e106.mungplace.common.transaction.KeyRollbackable;

public class GlobalTransactionTestService {

	private final KeyRollbackable<String> keyRollbackable;

	public GlobalTransactionTestService(KeyRollbackable<String> keyRollbackable) {
		this.keyRollbackable = keyRollbackable;
	}

	@GlobalTransactional
	public void processWithTransaction() {
		keyRollbackable.addTargetKey("testKey");
	}

	@GlobalTransactional
	public void processWithTransactionAndException() {
		keyRollbackable.addTargetKey("testKey");
		throw new RuntimeException("Test exception");
	}
}
