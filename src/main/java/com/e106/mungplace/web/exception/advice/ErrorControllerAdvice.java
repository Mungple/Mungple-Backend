package com.e106.mungplace.web.exception.advice;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.e106.mungplace.web.exception.ApplicationException;
import com.e106.mungplace.web.exception.dto.ApplicationError;
import com.e106.mungplace.web.exception.dto.ErrorResponse;

@RestControllerAdvice
public class ErrorControllerAdvice {

	@ExceptionHandler(ApplicationException.class)
	public ResponseEntity<ErrorResponse> handleApplicationException(ApplicationException e) {
		ApplicationError error = e.getError();
		return ResponseEntity.status(error.getStatus()).body(ErrorResponse.of(error));
	}
}