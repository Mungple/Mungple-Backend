package com.e106.mungplace.common.transaction;

public abstract class RollbackableRepository<K, T> extends KeyRollbackable<K> {

	public void save(K key, T value) {
		addTargetKey(key);
		saveWithKey(key, value);
	}

	protected abstract void saveWithKey(K key, T value);
}
