import styled from 'styled-components/native'

import {colors} from '@/constants'
import {Dimensions} from 'react-native'
import PetList from '@/components/user/PetList'
import CustomCard from '@/components/common/CustomCard'

const windowHeight = Dimensions.get('window').height

const Container = styled.SafeAreaView`
  background-color: ${colors.WHITE};
  align-items: center;
`

const ProfileCard = styled(CustomCard)`
  width: 90%;
  padding: 12px 20px;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  border-width: 1px;
  border-color: ${colors.GRAY_300};
`

const MyImage = styled.Image`
  width: 100%;
  height: 100%;
  border-radius: 75px;
`

const ImageContainer = styled.View`
  width: 60px;
  height: 60px;
  border-radius: 30px;
`

const ListContainer = styled.View`
  padding: 0 20px;
  align-items: center;
  flex-direction: row;
  justify-content: center;
`

const CreatePetButton = styled.TouchableOpacity`
  padding: 10px 16px;
  border-radius: 8px;
  background-color: ${colors.ORANGE.BASE};
`

const CreatePetText = styled.Text`
  font-weight: bold;
  color: ${colors.WHITE};
`

const MenuText = styled.Text`
  flex: 1;
  font-size: 18px;
  font-weight: bold;
  color: ${colors.BLACK};
`

const MyPetListContainer = styled.View`
  height: ${windowHeight * 0.7}px;
  width: 100%;
`

const MyPetList = styled(PetList)`
  flex: 1;
  width: 100%;
`

const InfoContainer = styled.View`
  flex-direction: column;
`

const Nickname = styled.Text`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 8px;
  color: ${colors.BLACK};
`

const SecondaryInfo = styled.Text`
  font-size: 14px;
  color: ${colors.GRAY_300};
`

export {
  MyImage,
  Nickname,
  MenuText,
  Container,
  MyPetList,
  ProfileCard,
  ListContainer,
  CreatePetText,
  InfoContainer,
  SecondaryInfo,
  ImageContainer,
  CreatePetButton,
  MyPetListContainer,
}
