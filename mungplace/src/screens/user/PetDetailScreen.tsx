import React, { useState } from 'react';
import { Alert, Image as RNImage } from 'react-native';
import styled from 'styled-components/native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';

import { colors } from '@/constants';
import PetForm from '@/components/user/PetForm';
import { calculateAge } from '@/hooks/usePetAge';
import DefaultImage from '@/assets/profile-image.png';
import CustomModal from '@/components/common/CustomModal';
import CustomModalHeader from '@/components/common/CustomModalHeader';
import { SettingStackParamList } from '@/navigations/stack/SettingStackNavigator';
import usePet from '@/hooks/queries/usePet';

type PetDetailRouteProp = RouteProp<SettingStackParamList, 'PetDetail'>;

const PetDetailScreen: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const route = useRoute<PetDetailRouteProp>();
  const { deletePetMutation } = usePet();
  const navigation = useNavigation();
  const { petData } = route.params;

  const deletePet = async () => {
    deletePetMutation.mutate(petData.id);
    navigation.goBack();
  };

  const handleDelete = async () => {
    Alert.alert(
      '삭제 확인',
      '정말로 이 반려동물을 삭제하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: deletePet,
        },
      ],
      { cancelable: true },
    );
  };

  return (
    <Container>
      <Image
        source={
          petData.photo
            ? { uri: `http://j11e106.p.ssafy.io:9000/images/${petData.photo}` }
            : DefaultImage
        }
      />
      <Column>
        <Row>
          <Title>이름</Title>
          <Context>{petData.name}</Context>
        </Row>
        <Row>
          <Title>성별</Title>
          <Context>{petData.gender === 'MALE' ? '남아' : '여아'}</Context>
        </Row>
        <Row>
          <Title>나이</Title>
          <Context>{calculateAge(petData.birth)}개월</Context>
        </Row>
        <Row>
          <Title>몸무게</Title>
          <Context>{petData.weight}kg</Context>
        </Row>
      </Column>
      <ButtonContainer>
        <ActionButton onPress={() => setModalVisible(true)}>
          <ButtonText>변경</ButtonText>
        </ActionButton>
        <ActionButton onPress={handleDelete} danger>
          <ButtonText>삭제</ButtonText>
        </ActionButton>
      </ButtonContainer>

      <CustomModal isWide={true} modalVisible={modalVisible} setModalVisible={setModalVisible}>
        <CustomModalHeader title="반려견 정보 변경" closeButton={() => setModalVisible(false)} />
        <PetForm petData={petData} setModalVisible={setModalVisible} />
      </CustomModal>
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
  padding: 20px;
  align-items: center;
  justify-content: center;
  background-color: ${colors.WHITE};
`;

const Column = styled.View`
  flex: 1;
`;

const Row = styled.View`
  gap: 100px;
  margin: 10px 0;
  flex-direction: row;
  justify-content: space-between;
`;

const Title = styled.Text`
  font-size: 20px;
  color: ${colors.BLACK};
`;

const Image = styled(RNImage)`
  width: 160px;
  height: 160px;
  border-radius: 80px;
  margin: 100px 0;
`;

const Context = styled(Title)`
  font-weight: bold;
  text-align: right;
`;

const ButtonContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 20px;
`;

const ActionButton = styled.TouchableOpacity<{ danger?: boolean }>`
  flex: 1;
  padding: 15px;
  margin: 0 5px;
  background-color: ${(props) => (props.danger ? colors.RED.BASE : colors.ORANGE.BASE)};
  border-radius: 8px;
  align-items: center;
`;

const ButtonText = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: ${colors.WHITE};
`;

export default PetDetailScreen;
