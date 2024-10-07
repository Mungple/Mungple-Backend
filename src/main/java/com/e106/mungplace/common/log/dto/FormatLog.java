package com.e106.mungplace.common.log.dto;

public record FormatLog(
	LogAction action,
	Object userId,
	String transactionId,
	String domain,
	LogLayer layer,
	String payload
) {
}
