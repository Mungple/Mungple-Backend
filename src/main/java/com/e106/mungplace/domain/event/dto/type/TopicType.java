package com.e106.mungplace.domain.event.dto.type;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum TopicType {

    TEMP("temp"),
    MARKER("marker"),
    EXPLORATION("exploration");

    private final String type;
}
