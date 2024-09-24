package com.e106.mungplace.domain.exploration.impl;

import com.e106.mungplace.common.map.dto.Point;
import com.e106.mungplace.domain.user.impl.UserHelper;
import com.e106.mungplace.web.exception.ApplicationSocketException;
import com.e106.mungplace.web.exception.dto.ApplicationSocketError;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.Objects;
import java.util.Set;
import java.util.concurrent.TimeUnit;

@RequiredArgsConstructor
@Component
public class ExplorationRecorder {

    private String lastMungGeoHash;

    private final RedisTemplate<String, String> redisTemplate;
    private final UserHelper userHelper;

    public void initRecord(String userId, String latitude, String longitude) {
        String constantGeoHash = Point.toConstantGeoHash(latitude, longitude); // 일정 공간(30m x 19m) GeoHash

        redisTemplate.opsForSet().add("activeUsers", userId);
        redisTemplate.opsForValue().set("users:" + userId + ":constant", constantGeoHash, 30, TimeUnit.MINUTES);
    }

    public void endRecord(String userId) {
        redisTemplate.opsForSet().remove("activeUsers", userId);
        redisTemplate.opsForSet().remove("users:" + lastMungGeoHash, userId);
        redisTemplate.expire("users:" + userId + ":geohash", 1, TimeUnit.MILLISECONDS);
        redisTemplate.expire("users:" + userId + ":constant", 1, TimeUnit.MILLISECONDS);
    }

    public void recordCurrentUserGeoHash(String userId, String latitude, String longitude) {
        String previousGeoHash = redisTemplate.opsForValue().get("users:" + userId + ":geohash");

        if(previousGeoHash == null) throw new ApplicationSocketException(ApplicationSocketError.DONT_SEND_ANY_REQUEST);

        String userCurrentGeoHash = Point.toUserCurrentGeoHash(latitude, longitude); // 사용자 현재 위치 GeoHash
        String constantGeoHash = Point.toConstantGeoHash(latitude, longitude); // 일정 공간(30m x 19m) GeoHash
        String mungGeoHash = Point.toMungGeoHash(latitude, longitude); // 멍플 후보 GeoHash

        redisTemplate.opsForValue().set("users:" + userId + ":geohash", userCurrentGeoHash, 60, TimeUnit.SECONDS); // 사용자의 현재 GeoHash
        redisTemplate.opsForSet().add("users:" + mungGeoHash, userId);

        updateUserIdWhenGeoHashIsDifference(userId, previousGeoHash, userCurrentGeoHash, mungGeoHash); // 사용자의 현재 위치와, 위치 별 사용자 갱신
        verifyConstantPlace(userId, constantGeoHash); // 장시간 일정공간에 있는지 검증
    }

    private void updateUserIdWhenGeoHashIsDifference(String userId, String preGeoHash, String userCurrentGeoHash, String mungGeoHash) {
        if (preGeoHash == null || Objects.equals(preGeoHash, userCurrentGeoHash)) return;

        String preMungGeoHash = preGeoHash.substring(0, 7);
        if (!Objects.equals(preMungGeoHash, mungGeoHash)) {
            redisTemplate.opsForSet().remove("users:" + preMungGeoHash, userId); // 이전 7자리 GeoHash 에서 사용자 제거
            redisTemplate.opsForSet().add("users:" + mungGeoHash, userId); // 현재 7자리 GeoHash 에 사용자 ID 추가
            lastMungGeoHash = mungGeoHash;
            removeEmptySet(preMungGeoHash);
        }
    }

    private void removeEmptySet(String preMungGeoHash) {
        if(redisTemplate.opsForSet().size("users:" + preMungGeoHash) == 0)
            redisTemplate.delete("users:" + preMungGeoHash);
    }

    private void verifyConstantPlace(String userId, String constantGeoHash) {
        String savedConstantGeoHash = redisTemplate.opsForValue().get("users:" + userId + ":constant");

        if (savedConstantGeoHash == null) {
            throw new ApplicationSocketException(ApplicationSocketError.DONT_MOVE_ANY_PLACE);
        }

        if (!Objects.equals(savedConstantGeoHash, constantGeoHash)) {
            redisTemplate.opsForValue().set("users:" + userId + ":constant", constantGeoHash, 30, TimeUnit.MINUTES);
        }
    }

    @Scheduled(fixedRate = 60000)
    private void verifyActiveUsers() {
        if(userHelper.getAuthenticatedUser() == null) return;
        Set<String> activeUsers = redisTemplate.opsForSet().members("activeUsers");
        String currentUserId = userHelper.getCurrentUserId().toString();

        if (activeUsers == null || activeUsers.isEmpty() || !activeUsers.contains(currentUserId)) return;

        activeUsers.forEach(userId -> {
            if (Objects.equals(userId, currentUserId) && redisTemplate.opsForValue().get("users:" + userId + ":geohash") == null) {
                throw new ApplicationSocketException(ApplicationSocketError.DONT_SEND_ANY_REQUEST);
            }
        });
    }
}
