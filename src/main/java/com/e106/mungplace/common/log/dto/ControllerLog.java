package com.e106.mungplace.common.log.dto;

public record ControllerLog(
	String ip,
	String method,
	String uri,
	String params,
	String body
) {
}
