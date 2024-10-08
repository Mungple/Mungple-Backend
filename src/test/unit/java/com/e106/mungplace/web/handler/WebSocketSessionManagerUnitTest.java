package com.e106.mungplace.web.handler;

import static org.mockito.Mockito.*;

import java.security.Principal;
import java.util.concurrent.ConcurrentHashMap;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.SetOperations;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.WebSocketSession;

import com.e106.mungplace.web.handler.interceptor.WebSocketSessionManager;

class WebSocketSessionManagerUnitTest {

	private WebSocketSessionManager sessionManager;

	private WebSocketHandler mockHandler;
	private WebSocketSession mockSession;
	private Principal mockPrincipal;
	private RedisTemplate<String, String> redisTemplate;

	@BeforeEach
	public void setUp() {
		redisTemplate = mock(RedisTemplate.class);
		SetOperations<String, String> setOperations = mock(SetOperations.class);

		mockHandler = mock(WebSocketHandler.class);
		mockSession = mock(WebSocketSession.class);
		mockPrincipal = mock(Principal.class);

		when(mockSession.getId()).thenReturn("test-session");
		when(mockSession.getPrincipal()).thenReturn(mockPrincipal);
		when(mockSession.getPrincipal().getName()).thenReturn("test-user");
		when(redisTemplate.opsForSet()).thenReturn(setOperations);

		sessionManager = new WebSocketSessionManager(mockHandler, redisTemplate);
	}

	@AfterEach
	public void tearDown() throws Exception {
		sessionManager.afterConnectionClosed(mockSession, CloseStatus.NORMAL);
	}

	@Test
	@DisplayName("소켓 연결이 완료된 후 map 에 세션이 저장되어야 한다.")
	void Test_After_Connection_Established() throws Exception {
		// given

		// when
		sessionManager.afterConnectionEstablished(mockSession);

		// then
		ConcurrentHashMap<String, WebSocketSession> sessionStore = sessionManager.getSessionStore();
		assert (sessionStore.containsKey("test-session")); // 세션이 저장되어 있는지 확인
		verify(mockHandler).afterConnectionEstablished(mockSession);
	}

	@Test
	@DisplayName("소켓 연결이 끊길때 map 에 세션이 삭제되어야 한다.")
	void Test_After_Connection_Closed() throws Exception {
		// given
		sessionManager.afterConnectionEstablished(mockSession);

		// when
		sessionManager.afterConnectionClosed(mockSession, CloseStatus.NORMAL);

		// then
		ConcurrentHashMap<String, WebSocketSession> sessionStore = sessionManager.getSessionStore();
		assert (!sessionStore.containsKey("test-session")); // 세션이 삭제되어 있는지 확인
		verify(mockHandler).afterConnectionClosed(mockSession, CloseStatus.NORMAL);
	}

	@Test
	@DisplayName("close 메서드를 통해 map 에 들어있는 세션이 삭제되어야 한다.")
	void Test_Close_Session() throws Exception {
		// given
		when(mockSession.isOpen()).thenReturn(true);
		sessionManager.afterConnectionEstablished(mockSession);

		// when
		sessionManager.closeSession("test-session");

		// then
		verify(mockSession).close(); // 세션이 닫혀야 함
	}
}
