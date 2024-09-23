package com.e106.mungplace.domain.heatmap.dto;

import java.util.List;

public record HeatmapChunk(
	List<HeatmapCell> cells
) {
}
