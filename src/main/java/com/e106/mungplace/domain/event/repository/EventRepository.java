package com.e106.mungplace.domain.event.repository;

import com.e106.mungplace.domain.event.entity.Event;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface EventRepository extends CrudRepository<Event, Long> {

    Optional<Event> findEventByEntityId(Long entityId);
}
