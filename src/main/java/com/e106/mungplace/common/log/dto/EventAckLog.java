package com.e106.mungplace.common.log.dto;

public record EventAckLog(
	String topic,
	Integer partition,
	Long offset
) {
}
