package com.e106.mungplace.web.handler.interceptor;

import java.io.IOException;
import java.security.Principal;
import java.util.Objects;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Qualifier;
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

	private ConcurrentHashMap<String, WebSocketSession> sessionStore = new ConcurrentHashMap<>();

	public WebSocketSessionManager(@Qualifier("subProtocolWebSocketHandler") WebSocketHandler delegate) {
		super(delegate);
	}

	@Override
	public void afterConnectionEstablished(WebSocketSession session) throws Exception {
		sessionStore.put(session.getId(), session);
		super.afterConnectionEstablished(session);
	}

	@Override
	public void afterConnectionClosed(WebSocketSession session, CloseStatus closeStatus) throws Exception {
		sessionStore.remove(session.getId());
		super.afterConnectionClosed(session, closeStatus);
	}

	public void closeSession(String sessionId) throws IOException {
		WebSocketSession session = sessionStore.get(sessionId);
		if (session != null && session.isOpen()) {
			session.close();
		}
	}

	public Set<String> getConnectedUserIds() {
		return sessionStore.values().stream()
			.map(WebSocketSession::getPrincipal)
			.filter(Objects::nonNull)
			.map(Principal::getName)
			.collect(Collectors.toSet());
	}
}
