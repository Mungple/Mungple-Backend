import React from 'react';
import styled from 'styled-components/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { colors } from '@/constants';
import { ResponsePetProfile } from '@/types';
import CustomCard from '../common/CustomCard';
import CustomText from '../common/CustomText';
import LoadingSpinner from '../common/LoadingSpinner';

type PetInfoBoxProps = {
  defaultPet?: ResponsePetProfile;
  age?: number;
  isLoading?: boolean;
};

const makeGtoKg = (g: number) => {
  const kg = g / 1000;
  return kg.toFixed(2);
};

const PetInfoBox = ({ defaultPet, age, isLoading }: PetInfoBoxProps) => {

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <Container>
      {defaultPet ? (
        <>
          <Header>
            <CustomText fontSize={22} fontWeight="bold">
              대표 반려견
            </CustomText>
          </Header>
          <Col>
            <Row>
              <TextIconWrapper>
                <CustomText fontSize={18} style={{ marginRight: 10 }}>
                  이름
                </CustomText>
                <MaterialIcons name="pets" size={20} color={colors.ORANGE.BASE} />
              </TextIconWrapper>
              <CustomText fontWeight="bold" fontSize={20}>
                {defaultPet.name}
              </CustomText>
            </Row>
            <Row>
              <TextIconWrapper>
                <CustomText fontSize={18} style={{ marginRight: 10 }}>
                  성별
                </CustomText>
                {defaultPet.gender === 'MALE' ? (
                  <MaterialIcons name="male" size={24} color={colors.BLUE.DARKER} />
                ) : (
                  <MaterialIcons name="female" size={24} color={colors.RED.LIGHTER} />
                )}
              </TextIconWrapper>
              <CustomText fontWeight="bold" fontSize={20}>
                {defaultPet.gender === 'MALE' ? '남아' : '여아'}
              </CustomText>
            </Row>
            <Row>
              <TextIconWrapper>
                <CustomText fontSize={18} style={{ marginRight: 10 }}>
                  나이
                </CustomText>
                <MaterialIcons name="cake" size={20} color={colors.ORANGE.BASE} />
              </TextIconWrapper>
              <CustomText fontWeight="bold" fontSize={20}>
                {age}개월
              </CustomText>
            </Row>
            <Row>
              <TextIconWrapper>
                <CustomText fontSize={18} style={{ marginRight: 10 }}>
                  몸무게
                </CustomText>
                <MaterialIcons name="fitness-center" size={20} color={colors.BLACK} />
              </TextIconWrapper>
              <CustomText fontWeight="bold" fontSize={20}>
                {makeGtoKg(defaultPet.weight)}kg
              </CustomText>
            </Row>
          </Col>
        </>
      ) : (
        <Col>
          <CustomText fontWeight="bold">반려견을 등록해주세요</CustomText>
        </Col>
      )}
    </Container>
  );
};

const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const Container = styled(CustomCard)`
  flex: 1;
  margin: 15px;
  padding: 25px;
  flex-direction: column;
  background-color: ${colors.BEIGE.LIGHTER};
  overflow: hidden;
`;

const Col = styled.View`
  flex-direction: column;
  justify-content: space-between;
  gap: 18px;
`;

const Row = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

const TextIconWrapper = styled.View`
  flex-direction: row;
`;

export default PetInfoBox;
