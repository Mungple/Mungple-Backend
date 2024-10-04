import React from 'react';
import styled from 'styled-components/native';

import { colors } from '@/constants';
import CustomCard from '../common/CustomCard';
import { ResponsePetProfile } from '@/types';

type PetInfoBoxProps = {
  defaultPet?: ResponsePetProfile;
  age?: number;
};

const PetInfoBox = ({ defaultPet, age }: PetInfoBoxProps) => {
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
  margin: 20px;
  padding: 30px;
  flex-direction: row;
  align-items: center;
  background-color: ${colors.BEIGE.LIGHTER};
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

export default PetInfoBox;
