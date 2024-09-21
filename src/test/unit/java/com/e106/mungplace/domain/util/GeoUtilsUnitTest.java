package com.e106.mungplace.domain.util;

import static org.assertj.core.api.Assertions.*;

import org.gavaghan.geodesy.Ellipsoid;
import org.gavaghan.geodesy.GeodeticCalculator;
import org.gavaghan.geodesy.GeodeticCurve;
import org.gavaghan.geodesy.GlobalCoordinates;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import com.e106.mungplace.common.map.dto.Point;

class GeoUtilsUnitTest {

	@DisplayName("NW, SE 좌표를 생성하면, 두 좌표 사이의 거리는 side * sqrt(2)이다.")
	@Test
	void When_GenerateNwAndSe_Then_DistanceIsSideXSqrt2() {
		// given
		Point point = new Point(35.555, 128.32034);
		int side = 100;

		// when
		Point nw = GeoUtils.calculateNorthWestPoint(point, side);
		Point se = GeoUtils.calculateSouthEastPoint(point, side);

		// then
		assertThat(calculateDistance(nw, se)).isCloseTo(side * Math.sqrt(2), within(0.001));
	}

	private double calculateDistance(Point p1, Point p2) {
		// GeodeticCalculator 객체 생성
		GeodeticCalculator geoCalc = new GeodeticCalculator();

		// 타원체 설정 (WGS84 기준)
		Ellipsoid reference = Ellipsoid.WGS84;

		// 두 좌표 사이의 거리 계산
		GeodeticCurve geoCurve = geoCalc.calculateGeodeticCurve(reference, new GlobalCoordinates(p1.lat(), p1.lon()),
			new GlobalCoordinates(p2.lat(), p2.lon()));

		return geoCurve.getEllipsoidalDistance();
	}
}