package com.e106.mungplace.common.log;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;

import com.e106.mungplace.common.log.dto.LogAction;
import com.e106.mungplace.common.log.dto.LogLevel;
import com.e106.mungplace.common.log.dto.MethodCallLog;
import com.e106.mungplace.common.log.dto.MethodEndLog;
import com.e106.mungplace.common.log.impl.ApplicationLogger;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Component
@Aspect
public class MethodLogAspect {

	private final ApplicationLogger logger;

	@Around("@annotation(methodLoggable)")
	public Object aroundService(ProceedingJoinPoint joinPoint, MethodLoggable methodLoggable) throws Throwable {
		Object result;

		long startTime = System.currentTimeMillis();
		Class<?> declaringType = joinPoint.getSignature().getDeclaringType();
		String methodName = joinPoint.getSignature().getName();
		LogAction action = methodLoggable.action();
		String content = methodLoggable.content();

		try {
			logger.log(LogLevel.TRACE, new MethodCallLog(action, methodName, content), declaringType);
			result = joinPoint.proceed();
		} finally {
			long elapsedTime = System.currentTimeMillis() - startTime;
			logger.log(LogLevel.TRACE, new MethodEndLog(action, methodName, content, elapsedTime),
				declaringType);
		}
		return result;
	}
}
