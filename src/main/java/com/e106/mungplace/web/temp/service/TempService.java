package com.e106.mungplace.web.temp.service;

import com.e106.mungplace.domain.event.dto.Payload;
import com.e106.mungplace.domain.event.dto.type.OperationType;
import com.e106.mungplace.domain.event.dto.type.TopicType;
import com.e106.mungplace.domain.temp.entity.Temp;
import com.e106.mungplace.domain.temp.repository.TempRepository;
import com.e106.mungplace.domain.user.impl.UserHelper;
import com.e106.mungplace.web.event.service.EventService;
import com.e106.mungplace.web.temp.dto.TempCreateRequest;
import com.e106.mungplace.web.temp.dto.TempPayload;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@RequiredArgsConstructor
@Service
public class TempService {

    private final UserHelper helper;
    private final EventService eventService;
    private final TempRepository tempRepository;

    @Transactional
    public Temp createTempProcess(TempCreateRequest request) {
        UserDetails currentUser = helper.getAuthenticatedUser();
        Long userId = Long.valueOf(currentUser.getUsername());

        Temp temp = tempRepository.save(Temp
                .builder()
                .userId(userId)
                .title(request.getTitle())
                .data(request.getData())
                .build()
        );

        Payload payload = TempPayload
                .builder()
                .id(temp.getTempId())
                .userId(temp.getUserId())
                .data(temp.getData())
                .timestamp(temp.getCreatedDate())
                .build();

        eventService.publishEventProcess(payload, TopicType.TEMP, OperationType.CREATE);

        return temp;
    }
}
