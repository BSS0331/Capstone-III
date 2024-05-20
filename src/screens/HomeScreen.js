import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { FAB } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

// HomeScreen 컴포넌트
const HomeScreen = () => {
  // isFabOpen 상태를 사용하여 FAB 그룹의 열림/닫힘 상태를 관리
  const [isFabOpen, setIsFabOpen] = useState(false);

  // useNavigation 훅을 통해 네비게이션 객체를 가져와 화면 전환을 관리
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>메인메뉴 화면</Text>
      <FAB.Group  // FAB 그룹: 다양한 액션을 포함한 플로팅 액션 버튼
        open={isFabOpen}  // FAB 그룹의 열림 상태
        icon={isFabOpen ? 'close' : 'plus'}  // FAB 아이콘 상태에 따라 아이콘 변경
        color= '#4E348B'  // FAB 아이콘 색상 설정
        actions={[  // FAB 그룹에 포함된 각 액션 버튼 설정
          { icon: 'pencil', label: '수동 입력', onPress: () => navigation.navigate('ManualEntry'), small: false },
          { icon: 'receipt', label: '영수증', onPress: () => navigation.navigate('ReceiptCapture'), small: false },
          { icon: 'barcode', label: '바코드', onPress: () => navigation.navigate('Barcode'), small: false },
        ]}
        onStateChange={({ open }) => setIsFabOpen(open)}  // FAB 상태 변경 시 상태 업데이트
        onPress={() => {
          setIsFabOpen(!isFabOpen);  // FAB 버튼 클릭 시 열림/닫힘 상태 토글
        }}
        fabStyle={styles.fab}  // FAB 커스텀 스타일 적용
      />
    </View>
  );
};

// 스타일 시트 정의: 컴포넌트 스타일링에 사용
const styles = StyleSheet.create({
  container: {
    flex: 1,  // 화면 전체를 사용
    justifyContent: 'center',  // 세로 방향에서 중앙 정렬
    alignItems: 'center',  // 가로 방향에서 중앙 정렬
    backgroundColor: '#f5f5f5',  // 배경색 설정
  },
  text: {
    fontSize: 18,  // 텍스트 크기 설정
    marginBottom: 20,  // 텍스트 하단 여백 설정
  },
  fab: {
    backgroundColor: '#EEE8F4',  // FAB 배경색 설정
    borderRadius: 28,  // FAB 모서리 둥글기 설정
  },
});

export default HomeScreen;  // HomeScreen 컴포넌트를 기본값으로 내보냄
