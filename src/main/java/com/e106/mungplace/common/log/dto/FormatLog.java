package com.e106.mungplace.common.log.dto;

public record FormatLog(
	LogAction action,
	String userId,
	String transactionId,
	String domain,
	LogLayer layer,
	String payload
) {
}
