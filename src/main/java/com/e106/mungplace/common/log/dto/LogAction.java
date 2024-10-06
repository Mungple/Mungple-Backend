package com.e106.mungplace.common.log.dto;

public enum LogAction {

	// common
	FAIL,
	// event
	PUBLISH, CONSUME, ACK, COMMIT,
	// socket
	SOCKET,
	// controller
	REQUEST, RESPONSE,
	// crud
	CREATE, SELECT, UPDATE, DELETE,
}
