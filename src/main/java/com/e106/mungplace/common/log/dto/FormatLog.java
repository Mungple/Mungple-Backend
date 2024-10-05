package com.e106.mungplace.common.log.dto;

public record FormatLog(
	String userId,
	String transactionId,
	String domain,
	LogLayer layer,
	String payload
) {
}
