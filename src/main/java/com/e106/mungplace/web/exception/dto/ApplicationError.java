package com.e106.mungplace.web.exception.dto;

import static org.springframework.http.HttpStatus.*;

import org.springframework.http.HttpStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ApplicationError {

	// user
	AUTHENTICATION_ERROR("E101", UNAUTHORIZED, "권한이 없습니다."),
	USER_NOT_FOUND("E102", BAD_REQUEST, "사용자가 존재하지 않습니다."),

	// dog
	DOG_NOT_OWNER("E201", FORBIDDEN, "애견의 주인이 아닙니다."),
	DOG_NOT_FOUND("E202", BAD_REQUEST, "애견이 존재하지 않습니다."),
	EXCEED_DOG_CAPACITY("E203", BAD_REQUEST, "A user cannot own more than 5 dogs."),

	// exploration
	EXPLORATION_NOT_OWNED("E301", FORBIDDEN, "다른 사용자의 산책입니다."),
	EXPLORATION_NOT_FOUND("E302",BAD_REQUEST, "산책이 존재하지 않습니다."),
	ALREADY_ON_EXPLORATION("E303",BAD_REQUEST, "이미 산책 중입니다.");

	private String errorCode;
	private HttpStatus status;
	private String message;
}
