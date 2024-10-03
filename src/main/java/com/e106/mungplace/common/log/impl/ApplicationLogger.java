package com.e106.mungplace.common.log.impl;

import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.transaction.interceptor.TransactionAspectSupport;

import com.e106.mungplace.common.log.dto.ApplicationLog;
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
		logging(level, toMessage(action, message, 0L), clazz);
	}

	public void log(LogLevel level, LogAction action, String message, Class<?> clazz) {
		logging(level, toMessage(action, message, 0L), clazz);
	}

	public void log(LogLevel level, LogAction action, Exception exception, Class<?> clazz) {
		logging(level, toMessage(action, exception.getMessage(), 0L), clazz);
	}

	public void log(LogLevel level, LogAction action, Object payload, Long elapseTime, Class<?> clazz) {
		String message;
		try {
			message = objectMapper.writeValueAsString(payload);
		} catch (JsonProcessingException e) {
			message = payload.toString();
		}
		logging(level, toMessage(action, message, elapseTime), clazz);
	}

	public void log(LogLevel level, LogAction action, String message, Long elapseTime, Class<?> clazz) {
		logging(level, toMessage(action, message, elapseTime), clazz);
	}

	public void log(LogLevel level, LogAction action, Exception exception, Long elapseTime, Class<?> clazz) {
		logging(level, toMessage(action, exception.getMessage(), elapseTime), clazz);
	}

	private String toMessage(LogAction action, String message, Long elapseTime) {
		String transactionId = Integer.toHexString(TransactionAspectSupport.currentTransactionStatus().hashCode());
		String userId = Optional.ofNullable(SecurityContextHolder.getContext().getAuthentication())
			.map(Authentication::getPrincipal)
			.map(UserDetails.class::cast)
			.map(UserDetails::getUsername)
			.orElse(null);

		ApplicationLog applicationLog = new ApplicationLog(userId, transactionId, action, message, elapseTime);

		try {
			return objectMapper.writeValueAsString(applicationLog);
		} catch (JsonProcessingException e) {
			return "";
		}
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
