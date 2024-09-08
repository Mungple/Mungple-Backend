package com.e106.mungplace.web.temp.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class TempCreateRequest {

    Long id;
    String title;
    String data;
}
