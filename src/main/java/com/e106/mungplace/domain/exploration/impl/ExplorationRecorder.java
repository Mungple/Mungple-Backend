package com.e106.mungplace.domain.exploration.impl;

import com.e106.mungplace.common.map.dto.Point;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;

import java.util.Objects;
import java.util.concurrent.TimeUnit;

@RequiredArgsConstructor
public class ExplorationRecorder {

    private final RedisTemplate<String, String> redisTemplate;

    public void saveCurrentUser(String userId, String latitude, String longitude) {
        String previousGeoHash = redisTemplate.opsForValue().get("users:" + userId + ":geohash");
        String userCurrentGeoHash = Point.toUserCurrentGeoHash(latitude, longitude);
        String mungGeoHash = userCurrentGeoHash.substring(0, 7);

        redisTemplate.opsForValue().set("users:" + userId + ":geohash", userCurrentGeoHash, 60, TimeUnit.SECONDS); // 사용자의 현재 GeoHash
        redisTemplate.opsForSet().add("users:" + mungGeoHash, userId);
        updateUserIdWhenGeoHashIsDifference(userId, previousGeoHash, userCurrentGeoHash, mungGeoHash);
    }

    private boolean updateUserIdWhenGeoHashIsDifference(String userId, String preGeoHash, String userCurrentGeoHash, String mungGeoHash) {
        if (preGeoHash == null || Objects.equals(preGeoHash, userCurrentGeoHash)) return false;

        String preMungGeoHash = preGeoHash.substring(0, 7);
        if (!Objects.equals(preMungGeoHash, mungGeoHash)) {
            redisTemplate.opsForSet().remove("users:" + preMungGeoHash, userId); // 이전 7자리 GeoHash 에서 사용자 제거
            redisTemplate.opsForSet().add("users:" + mungGeoHash, userId); // 현재 7자리 GeoHash 에 사용자 ID 추가
            removeEmptySet(preMungGeoHash);
            return true;
        }

        return false;
    }

    private void removeEmptySet(String preMungGeoHash) {
        if(redisTemplate.opsForSet().size("users:" + preMungGeoHash) == 0) redisTemplate.delete("users:" + preMungGeoHash);
    }
}
