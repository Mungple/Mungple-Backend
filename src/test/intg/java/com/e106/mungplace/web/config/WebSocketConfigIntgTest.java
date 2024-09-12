package com.e106.mungplace.web.config;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.Optional;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.function.Executable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.messaging.converter.MappingJackson2MessageConverter;
import org.springframework.messaging.simp.stomp.StompSession;
import org.springframework.messaging.simp.stomp.StompSessionHandlerAdapter;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.web.socket.WebSocketHttpHeaders;
import org.springframework.web.socket.client.WebSocketClient;
import org.springframework.web.socket.client.standard.StandardWebSocketClient;
import org.springframework.web.socket.messaging.WebSocketStompClient;

import com.e106.mungplace.domain.user.entity.User;
import com.e106.mungplace.domain.user.repository.UserRepository;
import com.e106.mungplace.web.util.JwtProvider;
import com.fasterxml.jackson.databind.ObjectMapper;

@ActiveProfiles("intg")
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class WebSocketConfigIntgTest {

	private static final String WEBSOCKET_URI = "ws://localhost:%d/ws";

	@LocalServerPort
	private int port;

	private StompSession session;
	private final Long userId = 1L;

	@Autowired
	private JwtProvider jwtProvider;

	@Autowired
	ObjectMapper objectMapper;

	@MockBean
	private UserRepository userRepository;

	@BeforeEach
	void setUp() throws ExecutionException, InterruptedException, TimeoutException {
		when(userRepository.findById(userId)).thenReturn(Optional.of(new User(userId)));

		WebSocketClient webSocketClient = new StandardWebSocketClient();
		WebSocketStompClient stompClient = new WebSocketStompClient(webSocketClient);
		stompClient.setMessageConverter(new MappingJackson2MessageConverter(objectMapper));

		WebSocketHttpHeaders headers = new WebSocketHttpHeaders();
		String accessToken = jwtProvider.createAccessToken(userId);
		headers.set("Authorization", "Bearer " + accessToken);

		session = stompClient.connectAsync(String.format(WEBSOCKET_URI, port), headers,
			new StompSessionHandlerAdapter() {
			}).get(10, TimeUnit.SECONDS);
	}

	@AfterEach
	void tearDown() {
		session.disconnect();
	}

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