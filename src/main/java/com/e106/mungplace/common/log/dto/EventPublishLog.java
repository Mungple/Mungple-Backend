package com.e106.mungplace.common.log.dto;

public record EventPublishLog(
	String topic,
	String key,
	Object value
) {
}