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

import com.e106.mungplace.common.log.dto.LogAction;
import com.e106.mungplace.common.log.dto.LogLevel;
import com.e106.mungplace.common.log.dto.StompErrorLog;
import com.e106.mungplace.common.log.impl.ApplicationLogger;
import com.e106.mungplace.domain.exploration.impl.ExplorationRecorder;
import com.e106.mungplace.web.exception.ApplicationSocketException;
import com.e106.mungplace.web.exception.dto.ApplicationSocketError;
import com.e106.mungplace.web.exception.dto.ErrorResponse;
import com.e106.mungplace.web.handler.interceptor.WebSocketSessionManager;

import lombok.RequiredArgsConstructor;

@ControllerAdvice
@RequiredArgsConstructor
public class WebSocketErrorControllerAdvice {

	private final WebSocketSessionManager sessionManager;
	private final SimpMessagingTemplate messagingTemplate;
	private final ExplorationRecorder explorationRecorder;
	private final ApplicationLogger logger;

	/* 지정되지 않은 소켓 예외인 경우(ES00) */
	@MessageExceptionHandler(SocketException.class)
	public void handleSocketException(StompHeaderAccessor accessor) throws IOException {
		sendErrorMessage(accessor, UN_RECOGNIZED_SOCKET_EXCEPTION);
		postProcessIfFatalException(accessor);
		sessionManager.closeSession(accessor.getSessionId());

		errorLogging(accessor, UN_RECOGNIZED_SOCKET_EXCEPTION);
	}

	/* 요청 메시지 본문이 잘못된 경우(ES01) */

	@MessageExceptionHandler({MethodArgumentNotValidException.class, IllegalArgumentException.class,
		MessageConversionException.class})
	public void handleInValidMessageBody(StompHeaderAccessor accessor) throws IOException {
		sendErrorMessage(accessor, MESSAGE_BODY_NOT_VALID);
		postProcessIfFatalException(accessor);
		sessionManager.closeSession(accessor.getSessionId());

		errorLogging(accessor, MESSAGE_BODY_NOT_VALID);
	}
	/* 일시적인 네트워크 오류 혹은 URL을 잘못 설정한 경우(ES02) */

	@MessageExceptionHandler(MessageDeliveryException.class)
	public void handleFailedMessageDelivery(StompHeaderAccessor accessor) throws IOException {
		sendErrorMessage(accessor, MESSAGE_DELIVERY_FAILED);
		postProcessIfFatalException(accessor);
		sessionManager.closeSession(accessor.getSessionId());

		errorLogging(accessor, MESSAGE_DELIVERY_FAILED);
	}
	/* 그 외 비즈니스 로직에서 지정할 수 있는 예외인 경우, ES 소켓 유지, FES 소켓 만료(현재 FES 는 산책밖에 없지만 추후 생긴다면 if 분리 ) */

	@MessageExceptionHandler(ApplicationSocketException.class)
	public void handleCustomException(ApplicationSocketException e, StompHeaderAccessor accessor) throws IOException {
		sendErrorMessage(accessor, e.getError());
		if (e.getError().getErrorCode().startsWith("FES")) {
			postProcessIfFatalException(accessor);
		}
		errorLogging(accessor, e.getError());
	}
	private void postProcessIfFatalException(StompHeaderAccessor accessor) throws IOException {
		String userId = accessor.getUser().getName();
		if(accessor.getSessionAttributes().containsKey("explorationId")) {
			String explorationId = accessor.getSessionAttributes().get("explorationId").toString();
			explorationEndProcess(userId, explorationId);
		}
		sessionManager.closeSession(accessor.getSessionId());
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

	private void errorLogging(StompHeaderAccessor accessor, ApplicationSocketError error) {
		StompErrorLog log = new StompErrorLog(accessor.getUser().getName(), error);
		logger.log(LogLevel.ERROR, LogAction.FAIL, log, getClass());
	}
}
