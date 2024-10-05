package com.e106.mungplace.common.log.dto;

import lombok.Builder;

@Builder
public record MethodCallLog(
	String methodName,
	Object content
) {
}
