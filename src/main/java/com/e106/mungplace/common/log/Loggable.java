package com.e106.mungplace.common.log;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import com.e106.mungplace.common.log.dto.LogAction;
import com.e106.mungplace.common.log.dto.LogLevel;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface Loggable {
	LogLevel level();

	LogAction action();

	String message() default "";
}
