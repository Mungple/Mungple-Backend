package com.e106.mungplace.web.handler.filter;

import java.io.IOException;

import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
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
public class OAuth2FailureHandler implements AuthenticationFailureHandler {

	private final ObjectMapper mapper;

	@Override
	public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response,
		AuthenticationException exception) throws IOException, ServletException {
		response.setContentType("application/json");
		response.setStatus(ApplicationError.OAUTH_LOGIN_FAIL.getStatus().value());
		response.getWriter().write(mapper.writeValueAsString(ErrorResponse.of(ApplicationError.OAUTH_LOGIN_FAIL)));
	}
}