package com.e106.mungplace.common.transaction;

import java.util.List;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Aspect
@Component
public class GlobalTransactionAspect {

	private final List<Rollbackable> rollbackables;

	@Around("@annotation(com.e106.mungplace.common.transaction.GlobalTransactional)")
	public Object manageTransaction(ProceedingJoinPoint joinPoint) throws Throwable {
		try {
			for (var target : rollbackables) {
				target.callProcess();
			}

			Object result = joinPoint.proceed();

			for (var target : rollbackables) {
				target.commit();
			}

			return result;

		} catch (Exception ex) {
			for (var target : rollbackables) {
				target.rollback();
			}
			throw ex;
		}
	}
}
