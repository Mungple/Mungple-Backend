package com.e106.mungplace.web.heatmap.service;

import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.TimeUnit;

import org.apache.kafka.clients.admin.NewTopic;
import org.apache.tomcat.util.threads.ThreadPoolExecutor;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.Acknowledgment;
import org.springframework.stereotype.Component;

import com.e106.mungplace.common.map.dto.Point;
import com.e106.mungplace.domain.heatmap.dto.HeatmapCell;
import com.e106.mungplace.domain.heatmap.dto.HeatmapChunk;
import com.e106.mungplace.domain.heatmap.dto.HeatmapSearchCondition;
import com.e106.mungplace.domain.heatmap.event.HeatmapQueryEvent;
import com.e106.mungplace.domain.heatmap.event.HeatmapQueryType;
import com.e106.mungplace.domain.heatmap.impl.HeatmapChunkConsumer;
import com.e106.mungplace.domain.heatmap.impl.HeatmapChunkPublisher;
import com.e106.mungplace.domain.heatmap.impl.HeatmapSearcher;
import com.e106.mungplace.domain.util.GeoUtils;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class HeatmapQueryExecutorService {

	private static final double CHUNK_SIZE_THRESHOLD = 125;

	public final String topic;
	private final HeatmapSearcher heatmapSearcher;
	private final HeatmapChunkPublisher heatmapChunkPublisher;
	private final KafkaTemplate<String, Object> kafkaTemplate;
	private final ExecutorService executorService;
	private final HeatmapChunkConsumer heatmapChunkConsumer;

	public HeatmapQueryExecutorService(NewTopic heatMapTopic, HeatmapSearcher heatmapSearcher,
		HeatmapChunkPublisher heatmapChunkPublisher, KafkaTemplate<String, Object> kafkaTemplate,
		HeatmapChunkConsumer heatmapChunkConsumer) {
		this.topic = heatMapTopic.name();
		this.heatmapSearcher = heatmapSearcher;
		this.heatmapChunkPublisher = heatmapChunkPublisher;
		this.kafkaTemplate = kafkaTemplate;
		this.executorService = new ThreadPoolExecutor(300, 500, 30, TimeUnit.SECONDS,
			new LinkedBlockingQueue<Runnable>());
		this.heatmapChunkConsumer = heatmapChunkConsumer;
	}

	@KafkaListener(topics = "#{__listener.topic}", groupId = "#{__listener.topic}-executor", concurrency = "6")
	public void handleHeatmapQueryEventProcess(HeatmapQueryEvent event, Acknowledgment ack) {
		executorService.submit(() -> {
			Long userId = event.userId();
			HeatmapSearchCondition condition = new HeatmapSearchCondition(event.leftTop(), event.rightBottom(),
				event.from(), event.to());

			List<HeatmapCell> heatmapCells = searchHeatmapCells(userId, condition, event.queryType());
			heatmapChunkPublisher.publish(userId, event.queryType(), new HeatmapChunk(heatmapCells));
			heatmapChunkConsumer.consume(userId, event.queryType());
			ack.acknowledge();

			/*double sideLength = calculateSideLength(condition);

			if (isTooLarge(sideLength)) {
				splitChunks(event.requestId(), userId, condition, event.queryType());
			} else {
				List<HeatmapCell> heatmapCells = searchHeatmapCells(userId, condition, event.queryType());
				heatmapChunkPublisher.publish(userId, event.queryType(), new HeatmapChunk(heatmapCells));
				ack.acknowledge();
			}*/

		});
	}

	private List<HeatmapCell> searchHeatmapCells(Long userId, HeatmapSearchCondition condition, HeatmapQueryType queryType) {
		return switch (queryType) {
			case USER_BLUEZONE -> heatmapSearcher.findBluezone(userId, condition);
			case BLUEZONE -> heatmapSearcher.findBluezone(condition);
			case REDZONE -> heatmapSearcher.findRedzone(condition);
		};
	}

	private void splitChunks(String requestId, Long userId, HeatmapSearchCondition condition, HeatmapQueryType queryType) {
		Point centerPoint = calculateCenterPoint(condition.nw(), condition.se());

		// 한국 위도, 경도에서의 3.39m
		double diagonalLatOffset = 0.0000304527;
		double diagonalLonOffset = 0.0000386451;

		// 한국 위도, 경도에서의 4.8m
		double sideLatOffset = 0.0000432;
		double sideLonOffset = 0.0000548;

		// 4개의 사분면으로 나누기
		HeatmapSearchCondition quadrant1 = new HeatmapSearchCondition(condition.nw(), centerPoint, condition.start(), condition.end());
		HeatmapSearchCondition quadrant2 = new HeatmapSearchCondition(new Point(condition.nw().lat(), centerPoint.lon() + sideLonOffset), new Point(centerPoint.lat(), condition.se().lon()), condition.start(), condition.end());
		HeatmapSearchCondition quadrant3 = new HeatmapSearchCondition(new Point(centerPoint.lat() - sideLatOffset, condition.nw().lon()), new Point(condition.se().lat(), centerPoint.lon()), condition.start(), condition.end());
		HeatmapSearchCondition quadrant4 = new HeatmapSearchCondition(new Point(centerPoint.lat() - diagonalLatOffset, centerPoint.lon() + diagonalLonOffset), condition.se(), condition.start(), condition.end());

		publishChunk(requestId, userId, quadrant1, queryType);
		publishChunk(requestId, userId, quadrant2, queryType);
		publishChunk(requestId, userId, quadrant3, queryType);
		publishChunk(requestId, userId, quadrant4, queryType);
	}

	private void publishChunk(String requestId, Long userId, HeatmapSearchCondition condition, HeatmapQueryType queryType) {
		kafkaTemplate.send(topic, HeatmapQueryEvent.of(condition, requestId, userId, queryType)).whenComplete((result, throwable) -> {
			if (throwable == null) {
			} else {
				log.error("Kafka Event 발행 실패: {}", throwable.getMessage(), throwable);
			}
		});
	}

	private Point calculateCenterPoint(Point nw, Point se) {
		double centerLat = (nw.lat() + se.lat()) / 2;
		double centerLon = (nw.lon() + se.lon()) / 2;
		return new Point(centerLat, centerLon);
	}

	private double calculateSideLength(HeatmapSearchCondition condition) {
		double diagonalDistance = GeoUtils.calculateDistance(condition.nw(), condition.se());
		return diagonalDistance / Math.sqrt(2);
	}

	private boolean isTooLarge(double sideLength) {
		return sideLength > CHUNK_SIZE_THRESHOLD;
	}
}