package com.e106.mungplace.common.log.dto;

public record MethodEndLog(
	LogAction action,
	String methodName,
	Object content,
	Long elapsedTime
) {
}
