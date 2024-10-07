package com.e106.mungplace.common.log.impl;

import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.NoTransactionException;
import org.springframework.transaction.interceptor.TransactionAspectSupport;

import com.e106.mungplace.common.log.dto.FormatLog;
import com.e106.mungplace.common.log.dto.LogAction;
import com.e106.mungplace.common.log.dto.LogLayer;
import com.e106.mungplace.common.log.dto.LogLevel;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Component
public class ApplicationLogger {

	private final ObjectMapper objectMapper;

	public void log(LogLevel level, LogAction action, Object payload, Class<?> clazz) {
		logging(level, toFormattedMessage(action, payload, clazz), clazz);
	}

	private String toFormattedMessage(LogAction action, Object message, Class<?> clazz) {
		Object userId = Optional.ofNullable(SecurityContextHolder.getContext().getAuthentication())
			.map(Authentication::getPrincipal)
			.orElse(null);

		String packageName = clazz.getPackageName();
		String domain = extractDomain(packageName);
		LogLayer layer = extractLayerType(packageName);
		String transactionId;

		try {
			transactionId = Integer.toHexString(TransactionAspectSupport.currentTransactionStatus().hashCode());
		} catch (NoTransactionException e) {
			transactionId = "";
		}

		FormatLog applicationLog = new FormatLog(action, userId, transactionId, domain, layer, message);

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

	private static String extractDomain(String packageName) {
		Pattern domainPattern = Pattern.compile("(?:domain|web)\\.([a-zA-Z]+)\\.");
		Matcher matcher = domainPattern.matcher(packageName);

		if (matcher.find()) {
			return matcher.group(1);
		}
		return "unknown";
	}

	private static LogLayer extractLayerType(String packageName) {
		if (packageName.contains(".controller")) {
			return LogLayer.CONTROLLER;
		} else if (packageName.contains(".service")) {
			return LogLayer.SERVICE;
		} else if (packageName.contains(".repository")) {
			return LogLayer.REPOSITORY;
		}

		return LogLayer.UNKNOWN;
	}
}
