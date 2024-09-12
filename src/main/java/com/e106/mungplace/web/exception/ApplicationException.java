package com.e106.mungplace.web.exception;

import com.e106.mungplace.web.exception.dto.ApplicationError;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ApplicationException extends RuntimeException {

	private ApplicationError error;

	public ApplicationException(Throwable cause, ApplicationError error) {
		super(cause);
		this.error = error;
	}
}
