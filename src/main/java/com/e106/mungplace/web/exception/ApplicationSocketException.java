package com.e106.mungplace.web.exception;

import com.e106.mungplace.web.exception.dto.ApplicationSocketError;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ApplicationSocketException extends RuntimeException {

    private ApplicationSocketError error;

    public ApplicationSocketException(Throwable cause, ApplicationSocketError error) {
        super(cause);
        this.error = error;
    }
}
