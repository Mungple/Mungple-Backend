package com.e106.mungplace.web.exception.dto;

import static org.springframework.http.HttpStatus.*;

import org.springframework.http.HttpStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ApplicationError {

	// common
	UN_RECOGNIZED_ERROR("E000", INTERNAL_SERVER_ERROR, "알 수 없는 오류가 발생하였습니다."),
	JSON_PROCESS_FAILED("E001", BAD_REQUEST, "JSON 변환 과정 중 문제가 생겼습니다. 요청 데이터를 확인해주세요."),
	EVENT_PRODUCE_FAILED("E002", INTERNAL_SERVER_ERROR, "일시적인 오류가 발생했습니다. 다시 시도해주세요."),
	RECORD_IS_TOO_LARGE("E003", BAD_REQUEST, "처리할 수 없는 크기의 데이터입니다."),

	// auth
	AUTHENTICATION_ERROR("E101", UNAUTHORIZED, "권한이 없습니다."),
	ACCESS_TOKEN_NOT_FOUND("E102", UNAUTHORIZED, "액세스 토큰을 찾을 수 없습니다."),
	ACCESS_TOKEN_NOT_VALID("E103", UNAUTHORIZED, "액세스 토큰이 유효하지 않습니다."),
	OAUTH_LOGIN_FAIL("E104", BAD_REQUEST, "소셜 로그인에 실패했습니다."),

	// user
	USER_NOT_FOUND("E102", BAD_REQUEST, "사용자가 존재하지 않습니다."),

	// dog
	DOG_NOT_OWNER("E301", FORBIDDEN, "애견의 주인이 아닙니다."),
	DOG_NOT_FOUND("E302", BAD_REQUEST, "애견이 존재하지 않습니다."),
	EXCEED_DOG_CAPACITY("E303", BAD_REQUEST, "A user cannot own more than 5 dogs."),

	// exploration
	EXPLORATION_NOT_OWNED("E401", FORBIDDEN, "다른 사용자의 산책입니다."),
	EXPLORATION_NOT_FOUND("E402",BAD_REQUEST, "산책이 존재하지 않습니다."),
	ALREADY_ON_EXPLORATION("E403",BAD_REQUEST, "산책이 진행되고 있습니다."),
	EXPLORATION_NOT_WITH_DOGS("E404", BAD_REQUEST, "동반하는 애견이 없습니다."),

	// marker
	MARKER_NOT_FOUND("E401", BAD_REQUEST, "마커가 존재하지 않습니다."),
	MARKER_REQUEST_NOT_VALID("E402", BAD_REQUEST, "유효하지 않은 마커 요청 형식입니다."),

	// socket
	SOCKET_SESSION_NOT_FOUND("E802", FORBIDDEN, "소켓 세션이 존재하지 않습니다."),
	STOMP_COMMAND_NOT_VALID("E803", BAD_REQUEST, "STOMP 커맨드가 올바르지 않습니다."),

	// image
	IMAGE_SAVE_ERROR("E901", INTERNAL_SERVER_ERROR, "이미지 저장에 실패했습니다."),
	IMAGE_DELETE_ERROR("E902", INTERNAL_SERVER_ERROR, "이미지 삭제에 실패했습니다."),
	IMAGE_FORWARDING_ERROR("E903", INTERNAL_SERVER_ERROR, "이미지 주소 생성에 실패했습니다."),
	TRANSACTION_NOT_START("E904", INTERNAL_SERVER_ERROR, "트랜잭션이 시작하지 않았습니다."),
	IMAGE_NOT_SUPPORTED("E903", BAD_REQUEST, "유효하지 않은 이미지 타입 입니다."),
	IMAGE_COUNT_EXCEEDS_LIMIT("E905", BAD_REQUEST, "이미지는 3개이하여야 합니다.");

	private String errorCode;
	private HttpStatus status;
	private String message;
}
