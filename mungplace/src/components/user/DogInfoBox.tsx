import React from 'react';
import styled from 'styled-components/native';
import CustomCard from '../common/CustomCard';
import {colors} from '@/constants';
import {useUserStore} from '@/state/useUserStore';
import {calculateAge} from '@/hooks/usePetAge';

const DogInfoBox = () => {
  const {petData} = useUserStore.getState();
  const defaultPet = petData.find(pet => pet.isDefault === true);
  const age = defaultPet ? calculateAge(defaultPet.birth) : undefined

  return (
    <Container>
      {defaultPet ? (
        <>
          <Col>
            <Header>반려견 정보</Header>
          </Col>
          <Col>
            <Row>
              <Title>이름</Title>
              <Context>{defaultPet.name}</Context>
            </Row>
            <Row>
              <Title>성별</Title>
              <Context>{defaultPet.gender === 'MALE' ? '남아' : '여아'}</Context>
            </Row>
            <Row>
              <Title>나이</Title>
              <Context>{age}개월</Context>
            </Row>
            <Row>
              <Title>몸무게</Title>
              <Context>{defaultPet.weight}kg</Context>
            </Row>
          </Col>
        </>
      ) : (
        <Col>
          <Title>반려견을 등록해주세요</Title>
        </Col>
      )}
    </Container>
  );
};

const Container = styled(CustomCard)`
  flex: 1;
  background-color: ${colors.BEIGE.LIGHTER};
  padding: 30px;
  flex-direction: row;
  align-items: center;
`;

const Col = styled.View`
  flex: 1;
`;

const Row = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin: 10px 0;
`;

const Header = styled.Text`
  font-size: 20px;
  color: ${colors.BLACK};
`;

const Title = styled.Text`
  font-size: 20px;
  color: ${colors.BLACK};
`;

const Context = styled(Title)`
  font-weight: bold;
  text-align: right;
`;

export default DogInfoBox;
