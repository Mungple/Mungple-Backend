package com.e106.mungplace.domain.temp.entity;

import com.e106.mungplace.domain.audit.BaseTime;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity(name = "temps")
public class Temp extends BaseTime {

    @GeneratedValue
    @Id
    private Long tempId;

    private Long userId;
    private String title;
    private String data;
}
