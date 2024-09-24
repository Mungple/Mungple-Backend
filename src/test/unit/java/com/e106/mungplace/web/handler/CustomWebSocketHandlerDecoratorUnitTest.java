package com.e106.mungplace.web.handler;

import com.e106.mungplace.web.handler.interceptor.CustomWebSocketHandlerDecorator;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.WebSocketSession;

import java.util.concurrent.ConcurrentHashMap;

import static org.mockito.Mockito.*;

class CustomWebSocketHandlerDecoratorUnitTest {

    private CustomWebSocketHandlerDecorator decorator;

    private WebSocketHandler mockHandler;
    private WebSocketSession mockSession;

    @BeforeEach
    public void setUp() {
        mockHandler = mock(WebSocketHandler.class);
        mockSession = mock(WebSocketSession.class);
        decorator = new CustomWebSocketHandlerDecorator(mockHandler);

        when(mockSession.getId()).thenReturn("test-session");
    }

    @AfterEach
    public void tearDown() throws Exception {
        decorator.afterConnectionClosed(mockSession, CloseStatus.NORMAL);
    }

    @Test
    @DisplayName("소켓 연결이 완료된 후 map 에 세션이 저장되어야 한다.")
    void Test_After_Connection_Established() throws Exception {
        // given

        // when
        decorator.afterConnectionEstablished(mockSession);

        // then
        ConcurrentHashMap<String, WebSocketSession> sessionStore = decorator.getSessionStore();
        assert(sessionStore.containsKey("test-session")); // 세션이 저장되어 있는지 확인
        verify(mockHandler).afterConnectionEstablished(mockSession);
    }

    @Test
    @DisplayName("소켓 연결이 끊길때 map 에 세션이 삭제되어야 한다.")
    void Test_After_Connection_Closed() throws Exception {
        // given
        decorator.afterConnectionEstablished(mockSession);

        // when
        decorator.afterConnectionClosed(mockSession, CloseStatus.NORMAL);

        // then
        ConcurrentHashMap<String, WebSocketSession> sessionStore = decorator.getSessionStore();
        assert(!sessionStore.containsKey("test-session")); // 세션이 삭제되어 있는지 확인
        verify(mockHandler).afterConnectionClosed(mockSession, CloseStatus.NORMAL);
    }

    @Test
    @DisplayName("close 메서드를 통해 map 에 들어있는 세션이 삭제되어야 한다.")
    void Test_Close_Session() throws Exception {
        // given
        when(mockSession.isOpen()).thenReturn(true);
        decorator.afterConnectionEstablished(mockSession);

        // when
        decorator.closeSession("test-session");

        // then
        verify(mockSession).close(); // 세션이 닫혀야 함
    }
}
