package com.e106.mungplace.domain.heatmap.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.data.elasticsearch.client.elc.ElasticsearchAggregation;
import org.springframework.data.elasticsearch.client.elc.ElasticsearchAggregations;
import org.springframework.data.elasticsearch.client.elc.NativeQuery;
import org.springframework.data.elasticsearch.client.elc.NativeQueryBuilder;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.data.elasticsearch.core.query.Criteria;
import org.springframework.data.elasticsearch.core.query.CriteriaQuery;
import org.springframework.data.elasticsearch.core.query.Query;
import org.springframework.stereotype.Component;

import com.e106.mungplace.common.map.dto.Point;
import com.e106.mungplace.domain.exploration.entity.ExplorePoint;
import com.e106.mungplace.domain.heatmap.dto.HeatmapCell;
import com.e106.mungplace.domain.heatmap.dto.HeatmapSearchCondition;
import com.e106.mungplace.web.exception.ApplicationSocketException;
import com.e106.mungplace.web.exception.dto.ApplicationSocketError;

import co.elastic.clients.elasticsearch._types.GeoBounds;
import co.elastic.clients.elasticsearch._types.GeoHashPrecision;
import co.elastic.clients.elasticsearch._types.TopLeftBottomRightGeoBounds;
import co.elastic.clients.elasticsearch._types.aggregations.Aggregation;
import co.elastic.clients.elasticsearch._types.aggregations.GeoHashGridAggregate;
import co.elastic.clients.elasticsearch._types.aggregations.GeoHashGridAggregation;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Component
public class HeatmapSearcher {

	private static final String GEO_HASH_AGGREGATION = "geohash_grid";
	private static final int GEO_HASH_PRECISION = 9;

	private static final String RECORDED_AT_FIELD = "recordedAt";
	private static final String USER_ID_FIELD = "userId";
	private static final String GEO_POINT_FIELD = "point";

	private final ElasticsearchOperations operations;

	public List<HeatmapCell> findBluezone(Long userId, HeatmapSearchCondition condition) {
		Criteria criteria = Criteria.where(RECORDED_AT_FIELD).between(condition.start(), condition.end())
			.and(Criteria.where(USER_ID_FIELD).is(userId));
		return searchWithCriteria(criteria, condition.nw(), condition.se());
	}

	public List<HeatmapCell> findBluezone(HeatmapSearchCondition condition) {
		Criteria criteria = Criteria.where(RECORDED_AT_FIELD).between(condition.start(), condition.end());
		return searchWithCriteria(criteria, condition.nw(), condition.se());
	}

	// TODO <fosong98> Redzone 조회 로직 작성 필요
	public List<HeatmapCell> findRedzone(HeatmapSearchCondition condition) {
		return List.of();
	}

	private List<HeatmapCell> searchWithCriteria(Criteria criteria, Point nw, Point se) {
		Aggregation aggregation = heatmapAggregation(nw, se);
		CriteriaQuery criteriaQuery = new CriteriaQuery(criteria);

		NativeQuery query = new NativeQueryBuilder().withQuery(criteriaQuery)
			.withAggregation(GEO_HASH_AGGREGATION, aggregation)
			.build();

		return executeHeatMapQuery(query);
	}

	private List<HeatmapCell> executeHeatMapQuery(Query query) {
		ElasticsearchAggregations aggregations = fetchAggregations(query);
		ElasticsearchAggregation aggregation = aggregations.get(GEO_HASH_AGGREGATION);

		if (aggregation == null) {
			throw new ApplicationSocketException(ApplicationSocketError.COULD_NOT_LOAD_DATA);
		}

		return convertAggregationToHeatmapCells(aggregation);
	}

	private List<HeatmapCell> convertAggregationToHeatmapCells(ElasticsearchAggregation aggregation) {
		GeoHashGridAggregate geoHashGridAggregate = aggregation.aggregation()
			.getAggregate()
			.geohashGrid();

		return geoHashGridAggregate
			.buckets()
			.array()
			.stream()
			.map(HeatmapCell::of)
			.toList();
	}

	// TODO <fosong98> Kafka Consume 에러 처리 구현 필요
	private ElasticsearchAggregations fetchAggregations(Query query) {
		return Optional.ofNullable(operations.search(query, ExplorePoint.class).getAggregations())
			.map(ElasticsearchAggregations.class::cast)
			.orElseThrow(() -> new ApplicationSocketException(ApplicationSocketError.COULD_NOT_LOAD_DATA));
	}

	private Aggregation heatmapAggregation(Point nw, Point se) {
		TopLeftBottomRightGeoBounds tlbr = new TopLeftBottomRightGeoBounds.Builder().topLeft(nw.toGeoLocation())
			.bottomRight(se.toGeoLocation())
			.build();

		return new GeoHashGridAggregation.Builder().bounds(new GeoBounds.Builder().tlbr(tlbr).build())
			.field(GEO_POINT_FIELD)
			.precision(GeoHashPrecision.of(b -> b.geohashLength(GEO_HASH_PRECISION)))
			.build()
			._toAggregation();
	}
}
