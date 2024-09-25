package com.e106.mungplace.web.exploration.dto;

import com.e106.mungplace.domain.dogs.entity.Dog;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ExplorationStartWithDogsRequest {

    @NotNull
    String latitude;

    @NotNull
    String longitude;

    @NotNull
    List<Long> dogIds = new ArrayList<>();
}
