package com.e106.mungplace.common.log;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import com.e106.mungplace.common.log.dto.ControllerLog;
import com.e106.mungplace.common.log.dto.LogAction;
import com.e106.mungplace.common.log.dto.LogLevel;
import com.e106.mungplace.common.log.impl.ApplicationLogger;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Aspect
@Component
public class ApplicationLogAspect {

	private final ApplicationLogger logger;
	private final ObjectMapper objectMapper;

	@Around("@annotation(loggable)")
	public Object logMethodExecution(ProceedingJoinPoint joinPoint, Loggable loggable) throws Throwable {
		LogAction action = loggable.action();
		LogLevel level = loggable.level();
		String message = loggable.message();
		Class<?> targetClass = joinPoint.getSignature().getDeclaringType();

		long startTime = System.currentTimeMillis();
		Object result;
		try {
			beforeCall(action, level, message, targetClass);
			result = joinPoint.proceed();  // 메서드 실행
		} finally {
			long elapsedTime = System.currentTimeMillis() - startTime;
			logger.log(level, action, message, elapsedTime, );
		}

		return result;
	}

	private String beforeCall(LogAction action, LogLevel level, String message, Class<?> targetClass) {
		switch (action) {
			case CONTROLLER -> handleControllerRequest();
		}
	}

	private String controllerRequestMessage() {
		HttpServletRequest request = getCurrentHttpRequest();
		if (request == null) {
			return "";
		}

		ControllerLog controllerLog = ControllerLog.of(request);

		try {
			return objectMapper.writeValueAsString(controllerLog);
		} catch (JsonProcessingException e) {
			return "";
		}
	}

	private HttpServletRequest getCurrentHttpRequest() {
		ServletRequestAttributes attributes =
			(ServletRequestAttributes)RequestContextHolder.getRequestAttributes();
		return attributes != null ? attributes.getRequest() : null;
	}

	private boolean isController(JoinPoint joinPoint) {
		String className = joinPoint.getTarget().getClass().getSimpleName();
		return className.contains("Controller");
	}
}
