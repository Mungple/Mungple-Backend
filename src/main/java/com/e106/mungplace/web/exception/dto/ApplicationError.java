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
	ALREADY_ON_EXPLORATION("E303",BAD_REQUEST, "이미 산책 중입니다."),

	// marker
	MARKER_NOT_FOUND("E401", BAD_REQUEST, "마커가 존재하지 않습니다.");

	// image
	IMAGE_SAVE_ERROR("E901", INTERNAL_SERVER_ERROR, "이미지 저장에 실패했습니다."),
	IMAGE_DELETE_ERROR("E902", INTERNAL_SERVER_ERROR, "이미지 삭제에 실패했습니다."),
	IMAGE_FORWARDING_ERROR("E903", INTERNAL_SERVER_ERROR, "이미지 주소 생성에 실패했습니다."),
	TRANSACTION_NOT_START("E904", INTERNAL_SERVER_ERROR, "트랜잭션이 시작하지 않았습니다.");

	private String errorCode;
	private HttpStatus status;
	private String message;
}
