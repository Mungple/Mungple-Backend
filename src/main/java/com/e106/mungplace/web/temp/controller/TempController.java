package com.e106.mungplace.web.temp.controller;

import com.e106.mungplace.web.temp.dto.TempCreateRequest;
import com.e106.mungplace.web.temp.service.TempService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/temp")
public class TempController {

    private final TempService tempService;

    @ResponseStatus(value = HttpStatus.CREATED)
    @PostMapping
    public void createMessage(@RequestBody TempCreateRequest request) {
        tempService.createTempProcess(request);
    }
}
