import styled from 'styled-components/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {PropsWithChildren, ReactNode, createContext, useContext} from 'react';
import {GestureResponderEvent, Modal, ModalProps, PressableProps,} from 'react-native';

import {colors} from '@/constants';

// 모달 외부를 클릭했을 때 이벤트를 처리하기 위한 context 타입 정의
interface OptionContextValue {
  onClickOutSide?: (event: GestureResponderEvent) => void;
}

// 모달의 props를 정의하는 인터페이스
interface OptionMainProps extends ModalProps {
  children: ReactNode;
  isVisible: boolean;
  hideOption: () => void;
  animationType?: ModalProps['animationType'];
}

// 버튼에 대한 props를 정의하는 인터페이스
interface ButtonProps extends PressableProps {
  children: ReactNode;
  isDanger?: boolean;
  isChecked?: boolean;
}

// 체크박스에 대한 props를 정의하는 인터페이스
interface CheckBoxProps extends PressableProps {
  children: ReactNode;
  icon?: ReactNode;
  isChecked?: boolean;
}

// 필터 버튼에 대한 props를 정의하는 인터페이스
interface FilterProps extends PressableProps {
  children: ReactNode;
  isSelected?: boolean;
}

// 모달 외부를 클릭했을 때 닫히는 기능 처리
const OptionContext = createContext<OptionContextValue | undefined>(undefined);

// 모달을 렌더링하는 메인 컴포넌트
function OptionMain({
  children,
  isVisible,
  hideOption,
  animationType = 'slide',
  ...props
}: OptionMainProps) {
  const onClickOutSide = (event: GestureResponderEvent) => {
    if (event.target === event.currentTarget) {
      hideOption();
    }
  };

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType={animationType}
      onRequestClose={hideOption}
      {...props}>
      <OptionContext.Provider value={{onClickOutSide}}>
        {children}
      </OptionContext.Provider>
    </Modal>
  );
}

// 모달 배경을 구성하는 컴포넌트
function Background({children}: PropsWithChildren) {
  const optionContext = useContext(OptionContext);

  return (
    <OptionBackground onTouchEnd={optionContext?.onClickOutSide}>
      {children}
    </OptionBackground>
  );
}

// 모달 내부에 콘텐츠를 담는 컨테이너
function Container({children}: PropsWithChildren) {
  return <OptionContainer>{children}</OptionContainer>;
}

// 모달 내에서 사용되는 버튼 컴포넌트
function Button({
  children,
  isDanger = false,
  isChecked = false,
  ...props
}: ButtonProps) {
  return (
    <StyledPressable {...props}>
      <OptionText isDanger={isDanger}>{children}</OptionText>
      {isChecked && (
        <Ionicons name="checkmark" size={20} color={colors.BLUE.DARKER} />
      )}
    </StyledPressable>
  );
}

// 모달의 제목을 렌더링하는 컴포넌트
function Title({children}: PropsWithChildren) {
  return (
    <TitleContainer>
      <TitleText>{children}</TitleText>
    </TitleContainer>
  );
}

// 모달 내의 구분선 컴포넌트
function Divider() {
  return <Border />;
}

// 체크박스를 렌더링하는 컴포넌트
function CheckBox({
  children,
  icon,
  isChecked = false,
  ...props
}: CheckBoxProps) {
  return (
    <StyledCheckBox {...props}>
      <Ionicons
        name={`checkmark-circle${isChecked ? '' : '-outline'}`}
        size={22}
        color={colors.BLUE.DARKER}
      />
      {icon}
      <CheckBoxText>{children}</CheckBoxText>
    </StyledCheckBox>
  );
}

// 필터 버튼을 렌더링하는 컴포넌트
function Filter({children, isSelected = false, ...props}: FilterProps) {
  return (
    <FilterContainer {...props}>
      <FilterText isSelected={isSelected}>{children}</FilterText>
      <MaterialIcons
        name="keyboard-arrow-down"
        size={22}
        color={isSelected ? colors.BLUE.DARKER : colors.GRAY_300}
      />
    </FilterContainer>
  );
}

const OptionBackground = styled.SafeAreaView`
  flex: 1;
  justify-content: flex-end;
  background-color: rgba(0, 0, 0, 0.5);
`;

const OptionContainer = styled.View`
  border-radius: 8px;
  margin-horizontal: 10px;
  margin-bottom: 10px;
  background-color: ${colors.WHITE};
  overflow: hidden;
`;

const StyledPressable = styled.Pressable`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 50px;
  gap: 5px;

  &:pressed {
    background-color: ${colors.GRAY_200};
  }
`;

const OptionText = styled.Text<{isDanger: boolean}>`
  font-size: 17px;
  color: ${({isDanger}) => (isDanger ? colors.RED.DARKER : colors.BLUE.DARKER)};
  font-weight: 500;
`;

const TitleContainer = styled.View`
  align-items: center;
  padding: 15px;
`;

const TitleText = styled.Text`
  font-size: 16px;
  font-weight: 500;
  color: ${colors.BLACK};
`;

const Border = styled.View`
  border-bottom-color: ${colors.GRAY_200};
  border-bottom-width: 1px;
`;

const StyledCheckBox = styled.Pressable`
  flex-direction: row;
  align-items: center;
  padding-vertical: 10px;
  padding-horizontal: 30px;
  gap: 10px;

  &:pressed {
    background-color: ${colors.GRAY_200};
  }
`;

const CheckBoxText = styled.Text`
  color: ${colors.BLACK};
  font-size: 15px;
`;

const FilterContainer = styled.Pressable`
  flex-direction: row;
  align-items: center;
  padding: 10px;
  gap: 5px;
`;

const FilterText = styled.Text<{isSelected: boolean}>`
  color: ${({isSelected}) =>
    isSelected ? colors.BLUE.DARKER : colors.GRAY_300};
  font-size: 15px;
  font-weight: 500;
`;

export const CompoundOption = Object.assign(OptionMain, {
  Container,
  Background,
  Button,
  Title,
  Divider,
  CheckBox,
  Filter,
});
