package com.e106.mungplace.common.log;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import com.e106.mungplace.common.log.dto.ControllerLog;
import com.e106.mungplace.common.log.dto.LogAction;
import com.e106.mungplace.common.log.dto.LogLevel;
import com.e106.mungplace.common.log.dto.MethodCallLog;
import com.e106.mungplace.common.log.dto.MethodEndLog;
import com.e106.mungplace.common.log.impl.ApplicationLogger;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Component
@Aspect
public class ControllerLogAspect {

	private final ApplicationLogger logger;

	@Around("within(*..*Controller)")
	public Object aroundController(ProceedingJoinPoint joinPoint) throws Throwable {
		Object result;

		long startTime = System.currentTimeMillis();
		ControllerLog controllerLog = generateControllerLog();
		Class<?> declaringType = joinPoint.getSignature().getDeclaringType();
		String methodName = joinPoint.getSignature().getName();

		try {
			logger.log(LogLevel.TRACE, LogAction.REQUEST, new MethodCallLog(methodName, controllerLog), declaringType);
			result = joinPoint.proceed();
		} finally {
			long elapsedTime = System.currentTimeMillis() - startTime;
			logger.log(LogLevel.TRACE, LogAction.RESPONSE, new MethodEndLog(methodName, controllerLog, elapsedTime),
				declaringType);
		}
		return result;
	}

	private ControllerLog generateControllerLog() {
		HttpServletRequest request = getCurrentHttpRequest();
		if (request == null) {
			return null;
		}

		String remoteAddr = request.getRemoteAddr();
		String method = request.getMethod();
		String uri = request.getRequestURI();
		String params = request.getQueryString() != null ? request.getQueryString() : "";

		return new ControllerLog(remoteAddr, method, uri, params);
	}

	private HttpServletRequest getCurrentHttpRequest() {
		ServletRequestAttributes attributes =
			(ServletRequestAttributes)RequestContextHolder.getRequestAttributes();
		return attributes != null ? attributes.getRequest() : null;
	}
}
