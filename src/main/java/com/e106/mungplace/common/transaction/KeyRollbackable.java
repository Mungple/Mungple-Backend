package com.e106.mungplace.common.transaction;

import java.util.ArrayList;
import java.util.List;

public abstract class KeyRollbackable<T> implements Rollbackable {

	private int level;
	private boolean isChildRollback;
	private ThreadLocal<List<T>> keys = new ThreadLocal<>();

	/**
	 * 키 별로 롤백 방법을 정의합니다.
	 * @param key 롤백 대상 키
	 */
	public abstract void rollbackByKey(T key);

	/**
	 * 롤백 되어야 하는 키를 등록합니다.
	 * @param key 롤백 대상 키
	 */
	public void addTargetKey(T key) {
		keys.get().add(key);
	}

	@Override
	public void callProcess() {
		if (level == 0) {
			keys.set(new ArrayList<>());
		}
		level++;
	}

	@Override
	public void commit() {
		if (level == 1) {
			if (isChildRollback) {
				rollback();
			} else {
				clearRollbackInfo();
			}
		} else {
			level--;
		}
	}

	@Override
	public void rollback() {
		if (level == 1) {
			for (T key : keys.get()) {
				rollbackByKey(key);
			}
			clearRollbackInfo();
		} else {
			isChildRollback = true;
			level--;
		}
	}

	private void clearRollbackInfo() {
		isChildRollback = false;
		level = 0;
		keys.get().clear();
	}
}
