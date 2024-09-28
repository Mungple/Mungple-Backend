package com.e106.mungplace.web.exception.advice;

import static com.e106.mungplace.web.exception.dto.ApplicationSocketError.*;

import java.io.IOException;
import java.net.SocketException;

import org.springframework.messaging.MessageDeliveryException;
import org.springframework.messaging.converter.MessageConversionException;
import org.springframework.messaging.handler.annotation.MessageExceptionHandler;
import org.springframework.messaging.handler.annotation.support.MethodArgumentNotValidException;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.web.bind.annotation.ControllerAdvice;

import com.e106.mungplace.domain.exploration.impl.ExplorationRecorder;
import com.e106.mungplace.web.exception.ApplicationSocketException;
import com.e106.mungplace.web.exception.dto.ApplicationSocketError;
import com.e106.mungplace.web.exception.dto.ErrorResponse;
import com.e106.mungplace.web.handler.interceptor.WebSocketSessionManager;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@ControllerAdvice
@RequiredArgsConstructor
public class WebSocketErrorControllerAdvice {

	private final WebSocketSessionManager sessionManager;
	private final SimpMessagingTemplate messagingTemplate;
	private final ExplorationRecorder explorationRecorder;

	/* 지정되지 않은 소켓 예외인 경우(ES00) */
	@MessageExceptionHandler(SocketException.class)
	public void handleSocketException(StompHeaderAccessor accessor) throws IOException {
		sendErrorMessage(accessor, UN_RECOGNIZED_SOCKET_EXCEPTION);
		postProcessIfFatalException(accessor);
		sessionManager.closeSession(accessor.getSessionId());
	}

	/* 요청 메시지 본문이 잘못된 경우(ES01) */
	@MessageExceptionHandler({MethodArgumentNotValidException.class, IllegalArgumentException.class,
		MessageConversionException.class})
	public void handleInValidMessageBody(StompHeaderAccessor accessor) throws IOException {
		sendErrorMessage(accessor, MESSAGE_BODY_NOT_VALID);
		postProcessIfFatalException(accessor);
		sessionManager.closeSession(accessor.getSessionId());
	}

	/* 일시적인 네트워크 오류 혹은 URL을 잘못 설정한 경우(ES02) */
	@MessageExceptionHandler(MessageDeliveryException.class)
	public void handleFailedMessageDelivery(StompHeaderAccessor accessor) throws IOException {
		sendErrorMessage(accessor, MESSAGE_DELIVERY_FAILED);
		postProcessIfFatalException(accessor);
		sessionManager.closeSession(accessor.getSessionId());
	}

	/* 그 외 비즈니스 로직에서 지정할 수 있는 예외인 경우, ES 소켓 유지, FES 소켓 만료(현재 FES 는 산책밖에 없지만 추후 생긴다면 if 분리 ) */
	@MessageExceptionHandler(ApplicationSocketException.class)
	public void handleCustomException(ApplicationSocketException e, StompHeaderAccessor accessor) throws IOException {
		sendErrorMessage(accessor, e.getError());
		if (e.getError().getErrorCode().startsWith("FES")) {
			postProcessIfFatalException(accessor);
		}
		log.error("예외 발생. [CODE] : {}, [MESSAGE] : {}", e.getError().getErrorCode(), e.getError().getMessage());
	}

	private void postProcessIfFatalException(StompHeaderAccessor accessor) throws IOException {
		String userId = accessor.getUser().getName();
		String explorationId = accessor.getSessionAttributes().get("explorationId").toString();
		sessionManager.closeSession(accessor.getSessionId());
		explorationEndProcess(userId, explorationId);
	}

	private void explorationEndProcess(String userId, String explorationId) {
		explorationRecorder.endRecord(userId, explorationId);
	}

	private void sendErrorMessage(StompHeaderAccessor accessor, ApplicationSocketError error) {
		String sessionId = accessor.getSessionId();
		String destination = "/sub/errors-user" + sessionId;
		messagingTemplate.convertAndSend(destination, new ErrorResponse(error.getErrorCode(), error.getMessage()));

		try {
			Thread.sleep(200);
		} catch (InterruptedException e) {
			throw new RuntimeException(e);
		}
	}
}
