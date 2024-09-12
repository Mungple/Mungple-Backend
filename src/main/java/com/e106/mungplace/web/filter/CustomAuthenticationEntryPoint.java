package com.e106.mungplace.web.filter;

import java.io.IOException;

import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import com.e106.mungplace.web.exception.dto.ApplicationError;
import com.e106.mungplace.web.exception.dto.ErrorResponse;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Component
public class CustomAuthenticationEntryPoint implements AuthenticationEntryPoint {

	private final ObjectMapper objectMapper;

	@Override
	public void commence(HttpServletRequest request, HttpServletResponse response,
		AuthenticationException authException) throws IOException, ServletException {

		response.setContentType("application/json");
		response.setStatus(ApplicationError.AUTHENTICATION_ERROR.getStatus().value());
		response.getWriter().write(objectMapper.writeValueAsString(ErrorResponse.of(ApplicationError.AUTHENTICATION_ERROR)));
	}
}