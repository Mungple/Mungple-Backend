package com.e106.mungplace.web.exception.dto;

public record ErrorResponse(
	String errorCode,
	String message
) {

	public static ErrorResponse of(ApplicationError error) {
		return new ErrorResponse(error.getErrorCode(), error.getMessage());
	}
}
