package com.e106.mungplace.web.config;

import static org.junit.jupiter.api.Assertions.*;

import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.function.Executable;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.messaging.simp.stomp.StompSession;
import org.springframework.messaging.simp.stomp.StompSessionHandlerAdapter;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.web.socket.WebSocketHttpHeaders;
import org.springframework.web.socket.client.standard.StandardWebSocketClient;
import org.springframework.web.socket.messaging.WebSocketStompClient;

@ActiveProfiles("intg")
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class WebSocketConfigIntgTest {

	private static final String WEBSOCKET_URI = "ws://localhost:%d/ws";

	@LocalServerPort
	private int port;

	@DisplayName("웹소켓 연결(CONNECT) 시 token이 없으면 예외가 발생한다.")
	@Test
	void When_ConnectWebSocketWithoutToken_Then_Fail() {
		// given
		WebSocketStompClient stompClient = new WebSocketStompClient(new StandardWebSocketClient());

		// when
		Executable expectException = () -> {
			StompSession session = stompClient.connectAsync(String.format(WEBSOCKET_URI, port),
				new WebSocketHttpHeaders(), new StompSessionHandlerAdapter() {
				}).get(1, TimeUnit.SECONDS);
			session.disconnect();
		};

		// then
		assertThrows(ExecutionException.class, expectException);
	}
}