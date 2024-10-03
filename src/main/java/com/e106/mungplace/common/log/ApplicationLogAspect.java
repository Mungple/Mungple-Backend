package com.e106.mungplace.common.log;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;

import com.e106.mungplace.common.log.dto.LogAction;
import com.e106.mungplace.common.log.dto.LogLevel;
import com.e106.mungplace.common.log.impl.ApplicationLogger;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Aspect
@Component
public class ApplicationLogAspect {

	private final ApplicationLogger logger;

	@Around("@annotation(loggable)")
	public Object logMethodExecution(ProceedingJoinPoint joinPoint, Loggable loggable) throws Throwable {
		LogAction action = loggable.action();
		LogLevel level = loggable.level();
		String message = loggable.message();

		long startTime = System.currentTimeMillis();
		Object result;
		try {
			result = joinPoint.proceed();  // 메서드 실행
		} finally {
			long elapsedTime = System.currentTimeMillis() - startTime;
			logger.log(level, action, message, elapsedTime, joinPoint.getSignature().getDeclaringType());
		}

		return result;
	}
}
