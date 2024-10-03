package com.e106.mungplace.common.log.dto;

import java.io.BufferedReader;
import java.io.IOException;

import org.springframework.http.HttpMethod;

import jakarta.servlet.http.HttpServletRequest;

public record ControllerLog(
	HttpMethod method,
	String uri,
	String params,
	String body
) {

	public static ControllerLog of(HttpServletRequest request) {
		String method = request.getMethod();
		String uri = request.getRequestURI();
		String params = request.getQueryString();
		String body = getBody(request);

		return new ControllerLog(HttpMethod.valueOf(method), uri, params, body);
	}

	private static String getBody(HttpServletRequest request) {
		StringBuilder body = new StringBuilder();
		try (BufferedReader reader = request.getReader()) {
			String line;
			while ((line = reader.readLine()) != null) {
				body.append(line);
			}
		} catch (IOException e) {
			return "";
		}
		return body.toString();
	}
}
