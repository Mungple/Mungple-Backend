package com.e106.mungplace.common.log.dto;

import org.springframework.messaging.simp.stomp.StompCommand;

public record StompLog(
	String host,
	String sessionId,
	StompCommand command,
	String destination,
	Object payload
) {
}
