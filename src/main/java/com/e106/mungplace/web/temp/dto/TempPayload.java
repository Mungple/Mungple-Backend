package com.e106.mungplace.web.temp.dto;

import com.e106.mungplace.domain.event.dto.Payload;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class TempPayload extends Payload {

    private Long id;
    private Long userId;
    private String data;
    private LocalDateTime timestamp;
}
