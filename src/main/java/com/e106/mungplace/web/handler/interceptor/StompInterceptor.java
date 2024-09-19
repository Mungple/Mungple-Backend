package com.e106.mungplace.web.handler.interceptor;

import java.util.Map;
import java.util.Objects;

import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.stereotype.Component;

import com.e106.mungplace.web.exception.ApplicationException;
import com.e106.mungplace.web.exception.dto.ApplicationError;
import com.e106.mungplace.web.util.JwtProvider;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RequiredArgsConstructor
@Slf4j
@Component
public class StompInterceptor implements ChannelInterceptor {

	private final JwtProvider jwtProvider;

	@Override
	public Message<?> preSend(Message<?> message, MessageChannel channel) {
		StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);

		if (Objects.isNull(accessor.getCommand())) {
			throw new ApplicationException(ApplicationError.STOMP_COMMAND_NOT_VALID);
		}

		switch (accessor.getCommand()) {
			case CONNECT -> handleConnect(accessor);
			case SUBSCRIBE -> handleSubscribe(accessor);
			case SEND -> handleSend(accessor);
		}

		return message;
	}

	private void handleConnect(StompHeaderAccessor accessor) {
		// TODO <fosong98> Log 포맷 정책 수립하기
		log.debug("--- SOCKET CONNECT ---");
		log.debug("CONNECT username: {}", accessor.getUser());
		log.debug("CONNECT attr: {}", accessor.getSessionAttributes());
	}

	private void handleSubscribe(StompHeaderAccessor accessor) {
		log.debug("--- SOCKET SUBSCRIBE ---");
		log.debug("SUBSCRIBE username: {}", accessor.getUser());
		log.debug("SUBSCRIBE ID: {}", accessor.getSessionId());
		log.debug("SUBSCRIBE destination: {}", accessor.getDestination());
	}

	private void handleSend(StompHeaderAccessor accessor) {
		log.debug("--- SOCKET SEND ---");
		log.info("SEND username: {}", accessor.getUser());
		log.info("SEND ID: {}", accessor.getSessionId());
		log.info("SEND destination: {}", accessor.getDestination());
	}

	private Map<String, Object> validateAndGetSession(StompHeaderAccessor accessor) {
		Map<String, Object> sessionAttributes = accessor.getSessionAttributes();
		if (Objects.isNull(sessionAttributes)) {
			throw new ApplicationException(ApplicationError.SOCKET_SESSION_NOT_FOUND);
		}
		return sessionAttributes;
	}
}
