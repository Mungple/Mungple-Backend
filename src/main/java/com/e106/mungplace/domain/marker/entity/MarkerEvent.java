package com.e106.mungplace.domain.marker.entity;

import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class MarkerEvent {

	@Column(updatable = false, nullable = false)
	@GeneratedValue(generator = "UUID")
	@Id
	private UUID uuid;

	@Column(nullable = false)
	private LocalDateTime createdAt;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private PublishStatus status;

	@Column(nullable = false, columnDefinition = "json")
	private String payload;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private OperationType operationType;

	@Column(nullable = false)
	private String entityType;

	@Column(nullable = false)
	private Long entityId;

	public void updateStatus(PublishStatus status) {
		this.status = status;
	}
}