package com.e106.mungplace.web.handler.interceptor;

import java.util.Map;
import java.util.Objects;

import com.e106.mungplace.domain.exploration.entity.Exploration;
import com.e106.mungplace.domain.exploration.impl.ExplorationHelper;
import com.e106.mungplace.domain.exploration.impl.ExplorationReader;
import com.e106.mungplace.web.util.JwtAuthenticationHelper;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import com.e106.mungplace.web.exception.ApplicationException;
import com.e106.mungplace.web.exception.dto.ApplicationError;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RequiredArgsConstructor
@Slf4j
@Component
public class StompInterceptor implements ChannelInterceptor {

	private final JwtAuthenticationHelper jwtAuthenticationHelper;
	private final ExplorationReader explorationReader;
	private final ExplorationHelper explorationHelper;

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
			case DISCONNECT -> handleDisconnect(accessor);
		}

		return message;
	}

	private void handleConnect(StompHeaderAccessor accessor) {
		// TODO <fosong98> Log 포맷 정책 수립하기
		log.debug("--- SOCKET CONNECT ---");
		log.debug("CONNECT username: {}", accessor.getUser());
		log.debug("CONNECT attr: {}", accessor.getSessionAttributes());

		String token = accessor.getNativeHeader("Authorization").get(0);

		if (token != null && token.startsWith("Bearer ")) {
			token = token.substring(7);
			jwtAuthenticationHelper.storeAuthenticationInContext(token);
		}
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

		putSessionMap(accessor, "destination", accessor.getDestination());
	}

	private void handleDisconnect(StompHeaderAccessor accessor) {
		log.debug("--- SOCKET DISCONNECT ---");
		log.info("DISCONNECT username: {}", accessor.getUser());
		log.info("DISCONNECT ID: {}", accessor.getSessionId());
		log.info("DISCONNECT destination: {}", accessor.getDestination());

		String[] parts = getSessionMapValue(accessor, "destination").toString().split("/");
		if (Objects.equals(parts[1], "exploration")) {
			endExplorationProcess(Long.parseLong(parts[2]));
		}
	}

	private void putSessionMap(StompHeaderAccessor accessor, String key, String value) {
		validateAndGetSession(accessor).put(key, value);
	}

	private Object getSessionMapValue(StompHeaderAccessor accessor, String key) {
		return validateAndGetSession(accessor).get(key);
	}

	private Map<String, Object> validateAndGetSession(StompHeaderAccessor accessor) {
		Map<String, Object> sessionAttributes = accessor.getSessionAttributes();
		if (Objects.isNull(sessionAttributes)) {
			throw new ApplicationException(ApplicationError.SOCKET_SESSION_NOT_FOUND);
		}
		return sessionAttributes;
	}

	private void endExplorationProcess(Long explorationId) {
		Exploration exploration = explorationReader.get(explorationId);
		if(exploration.isEnded()) return;
		explorationHelper.updateExplorationIsEnded(exploration);
	}
}
