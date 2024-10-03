package com.e106.mungplace.common.log.dto;

public record ApplicationLog(
	String userId,
	String transactionId,
	LogAction action,
	String message,
	Long elapseTime
) {
}
