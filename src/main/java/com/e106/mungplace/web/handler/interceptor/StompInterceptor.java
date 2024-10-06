package com.e106.mungplace.web.handler.interceptor;

import java.util.Objects;

import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.stereotype.Component;

import com.e106.mungplace.common.log.dto.LogAction;
import com.e106.mungplace.common.log.dto.LogLevel;
import com.e106.mungplace.common.log.dto.StompLog;
import com.e106.mungplace.common.log.impl.ApplicationLogger;
import com.e106.mungplace.web.exception.ApplicationException;
import com.e106.mungplace.web.exception.dto.ApplicationError;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RequiredArgsConstructor
@Slf4j
@Component
public class StompInterceptor implements ChannelInterceptor {

	private final ApplicationLogger logger;

	@Override
	public Message<?> preSend(Message<?> message, MessageChannel channel) {
		StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);

		StompCommand command = accessor.getCommand();

		if (Objects.isNull(command)) {
			throw new ApplicationException(ApplicationError.STOMP_COMMAND_NOT_VALID);
		}

		StompLog log = new StompLog(accessor.getHost(), accessor.getSessionId(), accessor.getCommand(),
			accessor.getDestination(),
			message.getPayload());

		logger.log(LogLevel.TRACE, LogAction.SOCKET, log, getClass());

		if (command == StompCommand.SEND) {
			parsingDestination(accessor);
		}

		return message;
	}

	private static void parsingDestination(StompHeaderAccessor accessor) {
		String[] parts = accessor.getDestination().split("/");
		if (Objects.equals(parts[2], "exploration")) {
			accessor.getSessionAttributes().put("explorationId", accessor.getDestination().split("/")[3]);
		}
	}
}
