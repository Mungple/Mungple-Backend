package com.e106.mungplace.domain.marker.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.e106.mungplace.domain.marker.entity.MarkerEvent;
import com.e106.mungplace.domain.marker.entity.PublishStatus;

import jakarta.persistence.LockModeType;

public interface MarkerOutboxRepository extends JpaRepository<MarkerEvent, Long> {

	List<MarkerEvent> findByStatus(PublishStatus status);

	@Lock(LockModeType.PESSIMISTIC_WRITE)
	@Query("SELECT o FROM MarkerEvent o WHERE o.status = :status")
	List<MarkerEvent> findByStatusWithLock(@Param("status") PublishStatus status);
}