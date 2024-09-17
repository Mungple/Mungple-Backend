package com.e106.mungplace.web.manager.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.e106.mungplace.web.manager.dto.ManagerExplorePointCreateRequest;
import com.e106.mungplace.web.manager.service.ManagerExplorePointService;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RequestMapping("/manager/explorations")
@RestController
public class ExplorePointBulkController {

	private final ManagerExplorePointService explorePointService;

	@ResponseStatus(HttpStatus.CREATED)
	@PostMapping
	public void insertBulkExplorePoint(@RequestBody ManagerExplorePointCreateRequest request) {
		explorePointService.bulkInsertProcess(request.managerName(), request.points());
	}
}
