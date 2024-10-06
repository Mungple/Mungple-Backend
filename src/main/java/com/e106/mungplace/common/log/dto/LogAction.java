package com.e106.mungplace.common.log.dto;

public enum LogAction {

	// event
	PUBLISH, CONSUME, ACK, COMMIT, FAIL,
	// socket
	SOCKET,
	// controller
	REQUEST, RESPONSE,
	// crud
	CREATE, SELECT, UPDATE, DELETE,
}
