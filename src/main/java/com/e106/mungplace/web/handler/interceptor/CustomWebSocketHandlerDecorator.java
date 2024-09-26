package com.e106.mungplace.web.handler.interceptor;

import java.io.IOException;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.WebSocketHandlerDecorator;

import lombok.Getter;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Getter // 테스트에서 HashMap 접근하기 위한 Getter
@Component
public class CustomWebSocketHandlerDecorator extends WebSocketHandlerDecorator {

	private ConcurrentHashMap<String, WebSocketSession> sessionStore = new ConcurrentHashMap<>();

	public CustomWebSocketHandlerDecorator(@Qualifier("customWebSocketHandlerDecorator") WebSocketHandler delegate) {
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

		log.info("현재 유지되고 있는 Session 의 수 : {}", sessionStore.size());
	}
}
