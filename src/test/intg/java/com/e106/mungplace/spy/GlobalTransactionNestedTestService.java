package com.e106.mungplace.spy;

import com.e106.mungplace.common.transaction.GlobalTransactional;
import com.e106.mungplace.common.transaction.KeyRollbackable;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class GlobalTransactionNestedTestService {

	private final KeyRollbackable<String> keyRollbackable;
	private final GlobalTransactionTestService child;

	@GlobalTransactional
	public void childCommitParentRollback() {
		child.processWithTransaction();
		throw new RuntimeException();
	}

	@GlobalTransactional
	public void childRollbackParentCommit() {
		try {
			child.processWithTransactionAndException();
		} catch (RuntimeException e) {
			// child 예외 무시
		}
	}

}
