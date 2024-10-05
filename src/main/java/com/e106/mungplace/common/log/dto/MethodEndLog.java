package com.e106.mungplace.common.log.dto;

public record MethodEndLog(
	String methodName,
	Object content,
	Long elapsedTime
) {
}
