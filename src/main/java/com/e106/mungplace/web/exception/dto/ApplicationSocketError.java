package com.e106.mungplace.web.exception.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import static org.springframework.http.HttpStatus.BAD_REQUEST;

@Getter
@AllArgsConstructor
public enum ApplicationSocketError {

    // 예외 발생 시 소켓 종료
    UN_RECOGNIZED_SOCKET_EXCEPTION("ES00", "알 수 없는 오류입니다. 소켓 통신을 종료합니다."),
    MESSAGE_BODY_NOT_VALID("ES01", "잘못된 요청입니다. 메시지 본문을 확인해주세요."),
    MESSAGE_DELIVERY_FAILED("ES02", "메시지 전송에 실패하였습니다. 연결 상태 혹은 URL을 확인해주세요."),
    EXPLORATION_NOT_FOUND("ES03", "산책이 존재하지 않습니다. 소켓 통신을 종료합니다."),
    IS_ENDED_EXPLORATION("ES04", "이미 종료된 산책입니다. 소켓 통신을 종료합니다."),
    DONT_SEND_ANY_REQUEST("ES05", "일정 시간 요청이 없습니다. 산책을 종료합니다."),
    TOO_FAST_EXPLORING("ES06", "비정상적인 산책입니다. 산책을 종료합니다."),
    DONT_MOVE_ANY_PLACE("ES07", "장시간 움직임이 없습니다. 산책을 종료합니다."),
    LOCATION_NOT_ALLOWED("ES08", "위치 수집 권한이 비활성화 되어있습니다."),

    // 예외 발생 시 소켓 유지 (히트맵)
    EVENT_REQUEST_NOT_SEND("ES09", "히트맵 조회 요청에 실패하였습니다"),
    COULD_NOT_LOAD_DATA("ES10", "일치하는 히트맵 정보가 없습니다.");

    // 예외 발생 시 소켓 유지 (산책 기록)

    private String errorCode;
    private String message;
}
