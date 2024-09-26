import React from 'react';
import styled from 'styled-components/native';
import CustomCard from '../common/CustomCard';
import {colors} from '@/constants';

const DogInfoBox = () => {
  return (
    <Container>
      <Col>
        <Header>반려견 정보</Header>
      </Col>
      <Col>
        <Row>
          <Title>성별</Title>
          <Context>남아</Context>
        </Row>
        <Row>
          <Title>나이</Title>
          <Context>36개월</Context>
        </Row>
        <Row>
          <Title>몸무게</Title>
          <Context>2kg</Context>
        </Row>
      </Col>
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
  margin-bottom: 20px;
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
