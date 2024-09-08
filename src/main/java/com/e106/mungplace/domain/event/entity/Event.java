package com.e106.mungplace.domain.event.entity;

import com.e106.mungplace.domain.event.dto.type.OperationType;
import com.e106.mungplace.domain.event.dto.type.TopicType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity(name = "events")
public class Event {

    @GeneratedValue
    @Id
    private Long eventId;

    @Enumerated(EnumType.STRING)
    private OperationType operationType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TopicType topicType;

    private Long entityId;
    private String entityData;
    private boolean isPublished;
    private LocalDateTime timestamp;
}
