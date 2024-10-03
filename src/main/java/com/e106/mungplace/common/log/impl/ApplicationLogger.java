package com.e106.mungplace.common.log.impl;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import com.e106.mungplace.common.log.dto.LogAction;
import com.e106.mungplace.common.log.dto.LogLevel;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Component
public class ApplicationLogger {

	private final ObjectMapper objectMapper;

	public void log(LogLevel level, LogAction action, Object payload, Class<?> clazz) {
		String message;
		try {
			message = objectMapper.writeValueAsString(payload);
		} catch (JsonProcessingException e) {
			message = payload.toString();
		}
		logging(level, toMessage(action, message, ""), clazz);
	}

	public void log(LogLevel level, LogAction action, String message, Class<?> clazz) {
		logging(level, toMessage(action, message, ""), clazz);
	}

	public void log(LogLevel level, LogAction action, Exception exception, Class<?> clazz) {
		logging(level, toMessage(action, exception.getMessage(), ""), clazz);
	}

	public void log(LogLevel level, LogAction action, Object payload, Long elapseTime, Class<?> clazz) {
		String message;
		try {
			message = objectMapper.writeValueAsString(payload);
		} catch (JsonProcessingException e) {
			message = payload.toString();
		}
		logging(level, toMessage(action, message, elapseTime.toString()), clazz);
	}

	public void log(LogLevel level, LogAction action, String message, Long elapseTime, Class<?> clazz) {
		logging(level, toMessage(action, message, elapseTime.toString()), clazz);
	}

	public void log(LogLevel level, LogAction action, Exception exception, Long elapseTime, Class<?> clazz) {
		logging(level, toMessage(action, exception.getMessage(), elapseTime.toString()), clazz);
	}

	private String toMessage(LogAction action, String message, String elapseTime) {
		return String.format("[%s] %s %s", action, message, elapseTime);
	}

	private void logging(LogLevel level, String message, Class<?> clazz) {
		Logger logger = LoggerFactory.getLogger(clazz);

		switch (level) {
			case INFO -> logger.info(message);
			case WARN -> logger.warn(message);
			case ERROR -> logger.error(message);
			case DEBUG -> logger.debug(message);
			case TRACE -> logger.trace(message);
		}
	}
}
