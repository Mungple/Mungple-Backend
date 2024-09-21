package com.e106.mungplace.web.heatmap.service;

import java.util.List;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.Acknowledgment;
import org.springframework.stereotype.Component;

import com.e106.mungplace.domain.heatmap.dto.HeatmapCell;
import com.e106.mungplace.domain.heatmap.dto.HeatmapSearchCondition;
import com.e106.mungplace.domain.heatmap.event.HeatmapQueryEvent;
import com.e106.mungplace.domain.heatmap.impl.HeatmapSearcher;

@Component
public class HeatmapQueryExecutorService {

	public final String topic;

	private final HeatmapSearcher heatmapSearcher;

	public HeatmapQueryExecutorService(NewTopic heatMapTopic, HeatmapSearcher heatmapSearcher) {
		this.topic = heatMapTopic.name();
		this.heatmapSearcher = heatmapSearcher;
	}

	@KafkaListener(topics = "#{__listener.topic}", groupId = "#{__listener.topic}-executor")
	public void handleHeatmapQueryEventProcess(HeatmapQueryEvent event, Acknowledgment ack) {
		Long userId = event.userId();
		HeatmapSearchCondition condition = new HeatmapSearchCondition(event.leftTop(), event.rightBottom(),
			event.from(), event.to());

		List<HeatmapCell> heatmapCells = switch (event.queryType()) {
			case USER_BLUEZONE -> heatmapSearcher.findBluezone(userId, condition);
			case BLUEZONE -> heatmapSearcher.findBluezone(condition);
			case REDZONE -> heatmapSearcher.findRedzone(condition);
		};

		// TODO <fosong98> redis에 넣기
		ack.acknowledge();
	}
}
