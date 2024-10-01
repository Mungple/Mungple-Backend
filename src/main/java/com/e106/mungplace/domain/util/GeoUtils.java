package com.e106.mungplace.domain.util;

import org.gavaghan.geodesy.Ellipsoid;
import org.gavaghan.geodesy.GeodeticCalculator;
import org.gavaghan.geodesy.GeodeticCurve;
import org.gavaghan.geodesy.GlobalCoordinates;
import org.locationtech.spatial4j.context.SpatialContext;
import org.locationtech.spatial4j.io.GeohashUtils;

import com.e106.mungplace.common.map.dto.Point;

public interface GeoUtils {

	static Point calculateNorthWestPoint(Point point, int sideLength) {
		GlobalCoordinates nw = calculateOffset(new GlobalCoordinates(point.lat(), point.lon()), -45,
			sideLength / Math.sqrt(2));

		return new Point(nw.getLatitude(), nw.getLongitude());
	}

	static Point calculateSouthEastPoint(Point point, int sideLength) {
		GlobalCoordinates nw = calculateOffset(new GlobalCoordinates(point.lat(), point.lon()), 135,
			sideLength / Math.sqrt(2));

		return new Point(nw.getLatitude(), nw.getLongitude());
	}

	static Point calculateNorthEastPoint(Point point, int sideLength) {
		GlobalCoordinates ne = calculateOffset(new GlobalCoordinates(point.lat(), point.lon()), 45,
			sideLength / Math.sqrt(2));
		return new Point(ne.getLatitude(), ne.getLongitude());
	}

	static Point calculateSouthWestPoint(Point point, int sideLength) {
		GlobalCoordinates sw = calculateOffset(new GlobalCoordinates(point.lat(), point.lon()), -135,
			sideLength / Math.sqrt(2));
		return new Point(sw.getLatitude(), sw.getLongitude());
	}

	static Point calculateGeohashCenterPoint(String geoHashString) {
		var center = GeohashUtils.decode(geoHashString, SpatialContext.GEO);
		return new Point(center.getLat(), center.getLon());
	}

	static Double calculateDistance(Point previousPoint, Point currentPoint) {
		GeodeticCalculator calculator = new GeodeticCalculator();

		Ellipsoid reference = Ellipsoid.WGS84;
		GlobalCoordinates start = new GlobalCoordinates(previousPoint.lat(), previousPoint.lon());
		GlobalCoordinates end = new GlobalCoordinates(currentPoint.lat(), currentPoint.lon());

		GeodeticCurve geoCurve = calculator.calculateGeodeticCurve(reference, start, end);

		return geoCurve.getEllipsoidalDistance();
	}

	private static GlobalCoordinates calculateOffset(GlobalCoordinates center, double bearing, double distanceMeters) {
		GeodeticCalculator geoCalc = new GeodeticCalculator();
		Ellipsoid reference = Ellipsoid.WGS84;

		return geoCalc.calculateEndingGlobalCoordinates(reference, center, bearing, distanceMeters);
	}
}
