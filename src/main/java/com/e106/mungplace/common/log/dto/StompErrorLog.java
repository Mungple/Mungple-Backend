package com.e106.mungplace.common.log.dto;

import com.e106.mungplace.web.exception.dto.ApplicationSocketError;

public record StompErrorLog(
	String userId,
	ApplicationSocketError error
) {
}
