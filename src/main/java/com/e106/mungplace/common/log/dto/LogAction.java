package com.e106.mungplace.common.log.dto;

public enum LogAction {

	// event
	CONSUME, PUBLISH, COMMIT, FAIL,
	// socket
	CONNECT, SUBSCRIBE, SEND, MESSAGE, DISCONNECT,
	// controller
	CONTROLLER,
	// crud
	CREATE, SELECT, UPDATE, DELETE,
}
