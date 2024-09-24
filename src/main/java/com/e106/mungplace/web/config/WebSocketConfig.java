package com.e106.mungplace.web.config;

import com.e106.mungplace.web.handler.interceptor.CustomWebSocketHandlerDecorator;
import com.e106.mungplace.web.handler.interceptor.StompExceptionHandler;
import com.e106.mungplace.web.handler.interceptor.StompInterceptor;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

import lombok.RequiredArgsConstructor;
import org.springframework.web.socket.config.annotation.WebSocketTransportRegistration;

@RequiredArgsConstructor
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

	private final StompInterceptor stompInterceptor;
	private final StompExceptionHandler stompExceptionHandler;

	@Override
	public void configureWebSocketTransport(WebSocketTransportRegistration registry) {
		registry.addDecoratorFactory(this::customWebSocketHandlerDecorator);
	}

	@Override
	public void configureMessageBroker(MessageBrokerRegistry registry) {
		registry.enableSimpleBroker("/sub");
		registry.setApplicationDestinationPrefixes("/pub");
	}

	@Override
	public void registerStompEndpoints(StompEndpointRegistry registry) {
		registry.addEndpoint("/ws").setAllowedOriginPatterns("*");
		registry.setErrorHandler(stompExceptionHandler);
	}

	@Override
	public void configureClientInboundChannel(ChannelRegistration registration) {
		registration.interceptors(stompInterceptor);
	}

	@Bean
	public CustomWebSocketHandlerDecorator customWebSocketHandlerDecorator(@Qualifier("subProtocolWebSocketHandler") WebSocketHandler webSocketHandler) {
		return new CustomWebSocketHandlerDecorator(webSocketHandler);
	}
}
