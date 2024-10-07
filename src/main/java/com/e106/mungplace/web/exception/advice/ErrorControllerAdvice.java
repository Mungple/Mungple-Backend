package com.e106.mungplace.web.exception.advice;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.e106.mungplace.common.log.dto.LogAction;
import com.e106.mungplace.common.log.dto.LogLevel;
import com.e106.mungplace.common.log.impl.ApplicationLogger;
import com.e106.mungplace.web.exception.ApplicationException;
import com.e106.mungplace.web.exception.dto.ApplicationError;
import com.e106.mungplace.web.exception.dto.ErrorResponse;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestControllerAdvice
public class ErrorControllerAdvice {

	private final ApplicationLogger logger;

	@ExceptionHandler(ApplicationException.class)
	public ResponseEntity<ErrorResponse> handleApplicationException(ApplicationException e) {
		ApplicationError error = e.getError();
		logger.log(LogLevel.ERROR, LogAction.FAIL, error, getClass());

		return ResponseEntity.status(error.getStatus()).body(ErrorResponse.of(error));
	}
}