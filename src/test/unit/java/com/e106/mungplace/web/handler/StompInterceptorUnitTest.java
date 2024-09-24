package com.e106.mungplace.web.handler;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import java.util.HashMap;
import java.util.Map;

import com.e106.mungplace.domain.exploration.entity.Exploration;
import com.e106.mungplace.domain.exploration.impl.ExplorationHelper;
import com.e106.mungplace.domain.exploration.impl.ExplorationReader;
import com.e106.mungplace.web.handler.interceptor.StompInterceptor;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;


class StompInterceptorUnitTest {

    @InjectMocks
    private StompInterceptor stompInterceptor;

    @Mock
    private ExplorationReader explorationReader;

    @Mock
    private ExplorationHelper explorationHelper;

    @Mock
    private MessageChannel messageChannel;

    private StompHeaderAccessor headerAccessor;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        headerAccessor = StompHeaderAccessor.create(StompCommand.DISCONNECT);
    }

    @Test
    @DisplayName("소켓 연결 종료 시 산책을 종료시킨다.")
    void When_Disconnect_Socket_Then_Exploration_Is_End() {
        // given
        Long explorationId = 1L;
        Map<String, Object> sessionAttributes = new HashMap<>();
        sessionAttributes.put("destination", "/exploration/" + explorationId);
        headerAccessor.setSessionAttributes(sessionAttributes);

        Exploration exploration = mock(Exploration.class);
        when(explorationReader.get(explorationId)).thenReturn(exploration);
        when(exploration.isEnded()).thenReturn(false);

        Message<?> message = mock(Message.class);
        when(message.getHeaders()).thenReturn(headerAccessor.toMessageHeaders());

        // when
        stompInterceptor.preSend(message, messageChannel);

        // then
        verify(explorationHelper).updateExplorationIsEnded(exploration);
    }

    @Test
    @DisplayName("소켓 연결 종료 시 이미 종료 된 산책인 경우 아무 일도 일어나지 않는다.")
    void When_Disconnect_Socket_And_Already_Ended_Exploration_Then_No_Action_Performed() {
        // given
        Long explorationId = 1L;
        Map<String, Object> sessionAttributes = new HashMap<>();
        sessionAttributes.put("destination", "/exploration/" + explorationId);
        headerAccessor.setSessionAttributes(sessionAttributes);

        Exploration exploration = mock(Exploration.class);
        when(explorationReader.get(explorationId)).thenReturn(exploration);
        when(exploration.isEnded()).thenReturn(true);

        Message<?> message = mock(Message.class);
        when(message.getHeaders()).thenReturn(headerAccessor.toMessageHeaders());

        // when
        stompInterceptor.preSend(message, messageChannel);

        // then
        verify(explorationHelper, never()).updateExplorationIsEnded(any());
    }
}
