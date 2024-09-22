package com.e106.mungplace.web.exception.advice;

import com.e106.mungplace.web.exception.ApplicationSocketException;
import com.e106.mungplace.web.exception.dto.ErrorResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageDeliveryException;
import org.springframework.messaging.converter.MessageConversionException;
import org.springframework.messaging.handler.annotation.MessageExceptionHandler;
import org.springframework.messaging.handler.annotation.support.MethodArgumentNotValidException;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.web.bind.annotation.ControllerAdvice;

import java.io.IOException;
import java.net.SocketException;

import static com.e106.mungplace.web.exception.dto.ApplicationSocketError.*;

@Slf4j
@ControllerAdvice
@RequiredArgsConstructor
public class WebSocketErrorControllerAdvice {

    /* 지정되지 않은 소켓 예외인 경우(ES00) */
    @MessageExceptionHandler(SocketException.class)
    @SendToUser("/sub/errors")
    public ErrorResponse handleSocketException(Message<?> message) throws IOException {
        // TODO <이현수> : 세션 삭제하기
        return new ErrorResponse(UN_RECOGNIZED_SOCKET_EXCEPTION.getErrorCode(), UN_RECOGNIZED_SOCKET_EXCEPTION.getMessage());
    }

    /* 요청 메시지 본문이 잘못된 경우(ES01) */
    @MessageExceptionHandler({MethodArgumentNotValidException.class, IllegalArgumentException.class, MessageConversionException.class})
    @SendToUser("/sub/errors")
    public ErrorResponse handleInValidMessageBody() {
        // TODO <이현수> : 세션 삭제하기
        return new ErrorResponse(MESSAGE_BODY_NOT_VALID.getErrorCode(), MESSAGE_BODY_NOT_VALID.getMessage());
    }

    /* 일시적인 네트워크 오류 혹은 URL을 잘못 설정한 경우(ES02) */
    @MessageExceptionHandler(MessageDeliveryException.class)
    @SendToUser("/sub/errors")
    public ErrorResponse handleFailedMessageDelivery() {
        // TODO <이현수> : 세션 삭제하기
        return new ErrorResponse(MESSAGE_DELIVERY_FAILED.getErrorCode(), MESSAGE_DELIVERY_FAILED.getMessage());
    }
    
    /* 그 외 비즈니스 로직에서 지정할 수 있는 예외인 경우 */
    @MessageExceptionHandler(ApplicationSocketException.class)
    @SendToUser("/sub/errors")
    public ErrorResponse handleCustomException(ApplicationSocketException e) {
        return new ErrorResponse(e.getError().getErrorCode(), e.getError().getMessage());
    }

    private void removeSession(Message<?> message) throws IOException {
        StompHeaderAccessor stompHeaderAccessor = StompHeaderAccessor.wrap(message);
        String sessionId = stompHeaderAccessor.getSessionId();
        log.info("session = {}, connection remove", sessionId);
        // TODO <이현수> : 소켓 세션 만료
        // decorator.closeSession(sessionId);
    }
}