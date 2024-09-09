package com.e106.mungplace.common.transaction;

public interface Rollbackable {
	void callProcess();
	void commit();
	void rollback();
}
