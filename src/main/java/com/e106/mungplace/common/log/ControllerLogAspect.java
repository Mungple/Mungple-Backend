package com.e106.mungplace.common.log;

import java.io.BufferedReader;
import java.io.IOException;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.http.MediaType;
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

		String body = "";
		String contentType = request.getContentType();
		if (contentType != null) {
			MediaType mediaType = MediaType.parseMediaType(contentType);
			if (MediaType.MULTIPART_FORM_DATA.includes(mediaType)) {
				body = "multipart/form-data";
			} else {
				try {
					body = getBody(request);
				} catch (IOException e) {
					body = "";
				}
			}
		}
		return new ControllerLog(remoteAddr, method, uri, params, body);
	}

	private HttpServletRequest getCurrentHttpRequest() {
		ServletRequestAttributes attributes =
			(ServletRequestAttributes)RequestContextHolder.getRequestAttributes();
		return attributes != null ? attributes.getRequest() : null;
	}

	// HttpServletRequest의 body를 읽어오는 헬퍼 메서드
	private String getBody(HttpServletRequest request) throws IOException {
		StringBuilder stringBuilder = new StringBuilder();
		BufferedReader reader = request.getReader();
		String line;
		while ((line = reader.readLine()) != null) {
			stringBuilder.append(line);
		}
		return stringBuilder.toString();
	}
}
