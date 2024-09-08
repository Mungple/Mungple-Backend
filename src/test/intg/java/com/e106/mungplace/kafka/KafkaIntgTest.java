package com.e106.mungplace.kafka;

import com.e106.mungplace.domain.event.dto.type.OperationType;
import com.e106.mungplace.domain.event.dto.type.TopicType;
import com.e106.mungplace.domain.event.entity.Event;
import com.e106.mungplace.domain.event.repository.EventRepository;
import com.e106.mungplace.domain.temp.entity.Temp;
import com.e106.mungplace.domain.temp.repository.TempRepository;
import com.e106.mungplace.web.temp.dto.TempCreateRequest;
import com.e106.mungplace.web.temp.service.TempService;
import org.apache.kafka.clients.consumer.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.test.context.ActiveProfiles;

import java.time.Duration;
import java.util.*;

import static org.assertj.core.api.Assertions.assertThat;


@ActiveProfiles("intg")
@SpringBootTest
public class KafkaIntgTest {

    @Autowired
    TempService tempService;

    @Autowired
    TempRepository tempRepository;

    @Autowired
    EventRepository eventRepository;

    private KafkaConsumer<String, String> consumer;

    @BeforeEach
    void setUp() {
        User principal = new User("1", "", List.of());
        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities());

        SecurityContext securityContext = SecurityContextHolder.createEmptyContext();
        securityContext.setAuthentication(authentication);
        SecurityContextHolder.setContext(securityContext);

        Properties props = new Properties();
        props.put("bootstrap.servers", "localhost:9092");
        props.put("group.id", "test-group");
        props.put("key.deserializer", "org.apache.kafka.common.serialization.StringDeserializer");
        props.put("value.deserializer", "org.apache.kafka.common.serialization.StringDeserializer");
        props.put("auto.offset.reset", "latest");

        consumer = new KafkaConsumer<>(props);
        consumer.subscribe(Collections.singletonList("temp"));
    }

    @Test
    void testCreateTempAndProduce() {
        // given
        TempCreateRequest request = new TempCreateRequest(null, "Test Title", "Test Message");
        // ConsumerRecord<String, String> record = consumer.poll(Duration.ofMillis(3000)).iterator().next();

        // when
        Temp tempResult = tempService.createTempProcess(request);

        // then
        // entity 저장
        assertThat(tempResult).isNotNull();
        assertThat(request.getTitle()).isEqualTo(tempResult.getTitle());
        assertThat(request.getData()).isEqualTo(tempResult.getData());

        // entity 기반 event 저장 검증
        Event eventResult = eventRepository.findEventByEntityId(tempResult.getTempId()).get();
        assertThat(eventResult).isNotNull();
        assertThat(eventResult.getEntityData()).isEqualTo(request.getData());
        assertThat(eventResult.getTopicType()).isEqualTo(TopicType.TEMP);
        assertThat(eventResult.getOperationType()).isEqualTo(OperationType.CREATE);

        // consume, produce
        // assertThat(record).isNotNull();
        // assertThat(record.value()).contains("Test Title");
    }
}
