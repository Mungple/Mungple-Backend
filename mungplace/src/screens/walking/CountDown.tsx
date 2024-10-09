import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import dogfoot from '@/assets/dogfoot.png';
import { mapNavigations } from '@/constants';
import { MapStackParamList } from '@/navigations/stack/MapStackNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const Countdown: React.FC = () => {
  const [pawCount, setPawCount] = useState(3);
  const [animatedValues, setAnimatedValues] = useState<Animated.Value[]>([]);
  const navigation = useNavigation<NativeStackNavigationProp<MapStackParamList>>();

  // 카운트다운 로직
  useEffect(() => {
    // 애니메이션 값 초기화
    const initialValues = Array.from({ length: 3 }, () => new Animated.Value(1));
    setAnimatedValues(initialValues);

    const countdownInterval = setInterval(() => {
      setPawCount((prev) => {
        if (prev > 0) {
          return prev - 1;
        } else {
          clearInterval(countdownInterval);
          return prev;
        }
      });
    }, 1000);

    return () => clearInterval(countdownInterval); // 인터벌 클리어
  }, []);

  // 발바닥 이미지 애니메이션
  useEffect(() => {
    if (pawCount < animatedValues.length) {
      // 애니메이션이 끝난 후 사라지게 하기
      Animated.timing(animatedValues[pawCount], {
        toValue: 0, // opacity를 0으로 설정
        duration: 500, // 사라지는 애니메이션 지속 시간
        useNativeDriver: true,
      }).start(() => {
        // 모든 발바닥 이미지가 사라진 후에만 이동
        if (pawCount === 0) {
          navigation.navigate(mapNavigations.WALKING);
        }
      });
    }
  }, [pawCount, animatedValues, navigation]);

  return (
    <View style={styles.countdownContainer}>
      <View style={styles.pawContainer}>
        {Array.from({ length: 3 }).map((_, index) => (
          <Animated.Image
            key={index}
            source={dogfoot}
            style={[
              styles.pawImage,
              {
                opacity: animatedValues[index],
                transform: [
                  {
                    translateY:
                      animatedValues[index]?.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-30, 0], // 위로 튀는 효과
                      }) || 0,
                  },
                ],
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  countdownContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  pawContainer: {
    flexDirection: 'row', // 이미지를 가로로 배치
    justifyContent: 'center',
    alignItems: 'center',
  },
  pawImage: {
    width: 100, // 이미지 크기 증가
    height: 100, // 이미지 크기 증가
    marginHorizontal: 10, // 이미지 간 간격
  },
});

export default Countdown;
