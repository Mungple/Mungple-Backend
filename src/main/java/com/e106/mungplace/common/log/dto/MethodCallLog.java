package com.e106.mungplace.common.log.dto;

import lombok.Builder;

@Builder
public record MethodCallLog(
	LogAction action,
	String methodName,
	Object content
) {
}
