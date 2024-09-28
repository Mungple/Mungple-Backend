package com.e106.mungplace.web.handler.interceptor;

import java.util.Objects;

import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.stereotype.Component;

import com.e106.mungplace.web.exception.ApplicationException;
import com.e106.mungplace.web.exception.dto.ApplicationError;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RequiredArgsConstructor
@Slf4j
@Component
public class StompInterceptor implements ChannelInterceptor {

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

		parsingDestination(accessor);
	}

	private void handleUnsubscribe(StompHeaderAccessor accessor) {
		log.debug("--- SOCKET UNSUBSCRIBE ---");
		log.debug("UNSUBSCRIBE username: {}", accessor.getUser());
		log.debug("UNSUBSCRIBE ID: {}", accessor.getSessionId());
		log.debug("UNSUBSCRIBE destination: {}", accessor.getDestination());
	}

	private void handleDisconnect(StompHeaderAccessor accessor) {
		log.debug("--- SOCKET DISCONNECT ---");
		log.info("DISCONNECT username: {}", accessor.getUser());
		log.info("DISCONNECT ID: {}", accessor.getSessionId());
		log.info("DISCONNECT destination: {}", accessor.getDestination());
	}

	private static void parsingDestination(StompHeaderAccessor accessor) {
		String[] parts = accessor.getDestination().split("/");
		if (Objects.equals(parts[2], "exploration")) {
			accessor.getSessionAttributes().put("explorationId", accessor.getDestination().split("/")[3]);
		}
	}
}
