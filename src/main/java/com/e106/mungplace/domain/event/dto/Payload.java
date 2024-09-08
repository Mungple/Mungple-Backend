package com.e106.mungplace.domain.event.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Payload {

    private Long id;
    private Long userId;
    private String data;
    private LocalDateTime timestamp;
}
