package com.e106.mungplace.domain.heatmap.impl;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;
import java.util.stream.Stream;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.elasticsearch.client.elc.Aggregation;
import org.springframework.data.elasticsearch.client.elc.ElasticsearchAggregation;
import org.springframework.data.elasticsearch.client.elc.ElasticsearchAggregations;
import org.springframework.data.elasticsearch.core.AggregationsContainer;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.data.elasticsearch.core.SearchHits;
import org.springframework.data.elasticsearch.core.query.Query;

import net.bytebuddy.utility.RandomString;

import com.e106.mungplace.common.map.dto.Point;
import com.e106.mungplace.domain.exploration.entity.ExplorePoint;
import com.e106.mungplace.domain.heatmap.dto.HeatmapCell;
import com.e106.mungplace.domain.heatmap.dto.HeatmapSearchCondition;

import co.elastic.clients.elasticsearch._types.aggregations.Aggregate;
import co.elastic.clients.elasticsearch._types.aggregations.Buckets;
import co.elastic.clients.elasticsearch._types.aggregations.GeoHashGridAggregate;
import co.elastic.clients.elasticsearch._types.aggregations.GeoHashGridBucket;

@ExtendWith(MockitoExtension.class)
class HeatmapSearcherUnitTest {

	@Mock
	private ElasticsearchOperations operations;

	@InjectMocks
	private HeatmapSearcher heatmapSearcher;

	@DisplayName("사용자 아이디와 함께 블루존을 조회하면 히트맵 데이터를 응답한다.")
	@Test
	void when_FindBluezoneWithValidUserId_Then_ReturnHeatmapCells() {
		// Given
		Long userId = 1L;
		Point nw = new Point(37.7749, -122.4194);
		Point se = new Point(37.0, -123.0);
		LocalDateTime start = LocalDateTime.now().minusDays(1);
		LocalDateTime now = LocalDateTime.now();
		HeatmapSearchCondition condition = new HeatmapSearchCondition(nw, se, start, now);

		SearchHits<ExplorePoint> searchHits = mock(SearchHits.class);
		when(operations.search(any(Query.class), eq(ExplorePoint.class))).thenReturn(searchHits);

		AggregationsContainer aggregations = mockAggregations();
		when(searchHits.getAggregations()).thenReturn(aggregations);

		// When
		List<HeatmapCell> result = heatmapSearcher.findBluezone(userId, condition);

		// Then
		assertThat(result).isNotNull().isNotEmpty();
	}

	private ElasticsearchAggregations mockAggregations() {
		ElasticsearchAggregations aggregations = mock(ElasticsearchAggregations.class);

		ElasticsearchAggregation elasticsearchAggregation = mock(ElasticsearchAggregation.class);
		when(aggregations.get("geohash_grid")).thenReturn(elasticsearchAggregation);

		Aggregation mockAggregation = mock(Aggregation.class);
		when(elasticsearchAggregation.aggregation()).thenReturn(mockAggregation);

		Aggregate mockAggregate = mock(Aggregate.class);
		when(mockAggregation.getAggregate()).thenReturn(mockAggregate);

		GeoHashGridAggregate mockGeoHashGridAggregate = mock(GeoHashGridAggregate.class);
		when(mockAggregate.geohashGrid()).thenReturn(mockGeoHashGridAggregate);

		Buckets mockBuckets = mock(Buckets.class);
		when(mockGeoHashGridAggregate.buckets()).thenReturn(mockBuckets);

		Random random = new Random();
		List<GeoHashGridBucket> mockGeoHashGridBuckets = mockGeoHashGridBuckets(random.nextInt(100));
		when(mockBuckets.array()).thenReturn(mockGeoHashGridBuckets);

		return aggregations;
	}

	private List<GeoHashGridBucket> mockGeoHashGridBuckets(int size) {
		return Stream.generate(this::mockGeoHashGridBucket).limit(size).toList();
	}

	private GeoHashGridBucket mockGeoHashGridBucket() {
		Random random = new Random();
		GeoHashGridBucket bucket = mock(GeoHashGridBucket.class);
		when(bucket.key()).thenReturn(RandomString.make(9));
		when(bucket.docCount()).thenReturn(random.nextLong(1_000_000_000));
		return bucket;
	}
}