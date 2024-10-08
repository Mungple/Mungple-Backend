package com.e106.mungplace.web.handler.interceptor;

import java.io.IOException;
import java.security.Principal;
import java.util.Objects;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.WebSocketHandlerDecorator;

import lombok.Getter;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Getter
@Component
public class WebSocketSessionManager extends WebSocketHandlerDecorator {

	private static final String SESSION_SET_KEY = "websocket:sessions";
	private static final String USER_SET_KEY = "websocket:users";
	private ConcurrentHashMap<String, WebSocketSession> sessionStore = new ConcurrentHashMap<>();
	private final RedisTemplate<String, String> redisTemplate;

	public WebSocketSessionManager(@Qualifier("subProtocolWebSocketHandler") WebSocketHandler delegate, RedisTemplate<String, String> redisTemplate) {
		super(delegate);
		this.redisTemplate = redisTemplate;
	}

	@Override
	public void afterConnectionEstablished(WebSocketSession session) throws Exception {
		String sessionId = session.getId();
		String userId = session.getPrincipal().getName();
		sessionStore.put(sessionId, session);
		createSessionReferenceInfo(sessionId, userId);

		super.afterConnectionEstablished(session);
	}

	@Override
	public void afterConnectionClosed(WebSocketSession session, CloseStatus closeStatus) throws Exception {
		String sessionId = session.getId();
		String userId = session.getPrincipal().getName();
		sessionStore.remove(sessionId);
		removeSessionReferenceInfo(sessionId, userId);

		super.afterConnectionClosed(session, closeStatus);
	}

	public void closeSession(String sessionId) throws IOException {
		WebSocketSession session = sessionStore.get(sessionId);
		if (session != null && session.isOpen()) {
			session.close();
		}
	}

	public Set<String> getConnectedUserIds() {
		return redisTemplate.opsForSet().members(USER_SET_KEY);
	}

	private void createSessionReferenceInfo(String sessionId, String userId) {
		redisTemplate.opsForSet().add(SESSION_SET_KEY, sessionId);
		redisTemplate.opsForSet().add(USER_SET_KEY, userId);
	}

	private void removeSessionReferenceInfo(String sessionId, String userId) {
		redisTemplate.opsForSet().remove(SESSION_SET_KEY, sessionId);
		redisTemplate.opsForSet().remove(USER_SET_KEY, userId);
	}
}
