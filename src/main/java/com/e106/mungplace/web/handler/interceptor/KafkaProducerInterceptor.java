package com.e106.mungplace.web.handler.interceptor;

import java.util.Map;

import org.apache.kafka.clients.producer.ProducerInterceptor;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.apache.kafka.clients.producer.RecordMetadata;
import org.apache.kafka.common.errors.RecordTooLargeException;
import org.springframework.stereotype.Component;

import com.e106.mungplace.common.log.dto.EventAckLog;
import com.e106.mungplace.common.log.dto.EventPublishLog;
import com.e106.mungplace.common.log.dto.LogAction;
import com.e106.mungplace.common.log.dto.LogLevel;
import com.e106.mungplace.common.log.impl.ApplicationLogger;
import com.e106.mungplace.web.exception.ApplicationException;
import com.e106.mungplace.web.exception.dto.ApplicationError;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Component
public class KafkaProducerInterceptor implements ProducerInterceptor<String, Object> {

	private final ApplicationLogger logger;

	@Override
	public ProducerRecord<String, Object> onSend(ProducerRecord<String, Object> producerRecord) {
		EventPublishLog log = new EventPublishLog(producerRecord.topic(), producerRecord.key(), producerRecord.value());
		logger.log(LogLevel.TRACE, LogAction.PUBLISH, log, getClass());
		return producerRecord;
	}

	@Override
	public void onAcknowledgement(RecordMetadata recordMetadata, Exception e) {
		EventAckLog log = new EventAckLog(recordMetadata.topic(), recordMetadata.partition(),
			recordMetadata.offset());
		if (e == null) {
			logger.log(LogLevel.TRACE, LogAction.ACK, log, getClass());
		} else {
			logger.log(LogLevel.ERROR, LogAction.FAIL, log, getClass());
			handleException(e);
		}
	}

	private void handleException(Exception e) {
		if (e instanceof RecordTooLargeException) {
			throw new ApplicationException(ApplicationError.RECORD_IS_TOO_LARGE);
		} else {
			throw new ApplicationException(ApplicationError.EVENT_PRODUCE_FAILED);
		}
	}

	@Override
	public void close() {

	}

	@Override
	public void configure(Map<String, ?> map) {

	}
}
