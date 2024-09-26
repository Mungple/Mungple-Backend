package com.e106.mungplace.web.handler.interceptor;

import java.util.Map;
import java.util.Objects;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.MessageDeliveryException;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.e106.mungplace.domain.exploration.entity.Exploration;
import com.e106.mungplace.domain.exploration.impl.ExplorationHelper;
import com.e106.mungplace.domain.exploration.impl.ExplorationReader;
import com.e106.mungplace.domain.exploration.impl.ExplorationRecorder;
import com.e106.mungplace.web.exception.ApplicationException;
import com.e106.mungplace.web.exception.dto.ApplicationError;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RequiredArgsConstructor
@Slf4j
@Component
public class StompInterceptor implements ChannelInterceptor {

	private final ExplorationReader explorationReader;
	private final ExplorationHelper explorationHelper;
	private final ExplorationRecorder recorder;

	private final Map<String, String> userSessions = new ConcurrentHashMap<>();

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
			case UNSUBSCRIBE -> handleUnsubscribe(accessor);
			case DISCONNECT -> handleDisconnect(accessor);
		}

		return message;
	}

	private void handleConnect(StompHeaderAccessor accessor) {
		// TODO <fosong98> Log 포맷 정책 수립하기
		log.debug("--- SOCKET CONNECT ---");
		log.debug("CONNECT username: {}", accessor.getUser());
		log.debug("CONNECT attr: {}", accessor.getSessionAttributes());

		String userId = accessor.getUser() != null ? accessor.getUser().getName() : null;
		if (userId != null)
			userSessions.put(accessor.getSessionId(), userId);
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

	private void handleUnsubscribe(StompHeaderAccessor accessor) {
		log.debug("--- SOCKET UNSUBSCRIBE ---");
		log.debug("UNSUBSCRIBE username: {}", accessor.getUser());
		log.debug("UNSUBSCRIBE ID: {}", accessor.getSessionId());
		log.debug("UNSUBSCRIBE destination: {}", accessor.getDestination());

		postProcess(accessor);
	}

	private void handleDisconnect(StompHeaderAccessor accessor) {
		log.debug("--- SOCKET DISCONNECT ---");
		log.info("DISCONNECT username: {}", accessor.getUser());
		log.info("DISCONNECT ID: {}", accessor.getSessionId());
		log.info("DISCONNECT destination: {}", accessor.getDestination());
		String sessionId = accessor.getSessionId();
		if (sessionId != null)
			userSessions.remove(sessionId);

		postProcess(accessor);
	}

	private void postProcess(StompHeaderAccessor accessor) {
		String[] parts = getSessionMapValue(accessor, "destination").toString().split("/");
		if (parts.length != 0 && Objects.equals(parts[2], "exploration")) {
			endExplorationProcess(Long.parseLong(parts[3]));
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
		try {
			return sessionAttributes;
		} catch (MessageDeliveryException e) {
			log.debug("이미 종료된 세션입니다.");
		}
		return Map.of();
	}

	private void endExplorationProcess(Long explorationId) {
		Exploration exploration = explorationReader.get(explorationId);
		Long userId = exploration.getUser().getUserId();
		if (exploration.isEnded())
			return;
		explorationHelper.updateWhenExplorationEnded(userId, exploration);
	}

	@Scheduled(fixedRate = 60000)
	private void scheduler() {
		userSessions.forEach((sessionId, userId) -> {
			recorder.validateActiveUsers(userId);
		});
	}
}
