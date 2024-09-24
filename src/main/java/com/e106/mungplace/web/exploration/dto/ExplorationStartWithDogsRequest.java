package com.e106.mungplace.web.exploration.dto;

import com.e106.mungplace.domain.dogs.entity.Dog;
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

    List<Dog> dogs = new ArrayList<>();
}