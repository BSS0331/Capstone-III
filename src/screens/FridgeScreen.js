import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API } from '@env';  // 환경 변수에서 API URL 가져오기

const FridgeScreen = ({ navigation }) => {
  const [items, setItems] = useState([]);
  const [expandedRefrigerated, setExpandedRefrigerated] = useState(false);
  const [expandedFrozen, setExpandedFrozen] = useState(false);
  const [expandedRoomTemp, setExpandedRoomTemp] = useState(false);

  // useFocusEffect를 사용하여 탭 바를 숨기고 보이게 설정
  useFocusEffect(
    React.useCallback(() => {
      const parent = navigation.getParent();
      parent.setOptions({
        tabBarStyle: { display: 'none' },
        headerShown: false,
      });

      // 화면을 떠날 때 탭 바를 다시 보이게 설정
      return () => parent.setOptions({
        tabBarStyle: { display: 'flex' },
        headerShown: false,
      });
    }, [navigation])
  );

  // useEffect를 사용하여 컴포넌트가 마운트될 때 데이터를 가져옴
  useEffect(() => {
    const fetchData = async () => {
      try {
        // AsyncStorage에서 토큰을 가져옴
        const token = await AsyncStorage.getItem('accessToken');
        if (!token) {
          console.error('토큰을 찾지못함');
          return;
        }

        // API로부터 음식 데이터를 가져옴
        const response = await fetch(`${API}/food/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          console.error('데이터 불러오기 실패');
          return;
        }

        const data = await response.json();
        console.log('Fetched data:', data);  // 응답 데이터 로그 출력

        // 응답 데이터가 배열이 아니면 빈 배열로 초기화
        if (!data.results || !Array.isArray(data.results)) {
          console.error('Expected an array in the "results" property but received:', data);
          setItems([]);  
          return;
        }

        // 유통기한에 따라 항목을 정렬
        const sortedItems = data.results.sort((a, b) => {
          const daysLeftA = (new Date(a.expiration_date) - new Date()) / (1000 * 60 * 60 * 24);
          const daysLeftB = (new Date(b.expiration_date) - new Date()) / (1000 * 60 * 60 * 24);
          return daysLeftA - daysLeftB;
        });

        setItems(sortedItems);
        await AsyncStorage.setItem('foodData', JSON.stringify(data.results));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // 저장 조건에 따라 항목을 필터링하는 함수
  const filterItemsByCondition = (condition) => {
    return items.filter(item => item.storage_condition === condition);
  };

  // 주어진 조건에 따라 메인 항목을 렌더링하는 함수
  const renderMainItems = (condition) => {
    const filteredItems = filterItemsByCondition(condition);
    const maxToShow = 3; // Initially show only 3 items

    const toggleFunction = () => {
      switch (condition) {
        case '냉장':
          setExpandedRefrigerated(!expandedRefrigerated);
          break;
        case '냉동':
          setExpandedFrozen(!expandedFrozen);
          break;
        case '상온':
          setExpandedRoomTemp(!expandedRoomTemp);
          break;
        default:
          break;
      }
    };

    return (
      <View>
        {filteredItems.slice(0, expandedRefrigerated || expandedFrozen || expandedRoomTemp ? filteredItems.length : maxToShow).map((item, index) => (
          <View key={index} style={styles.item}>
            <Text>{item.food_name} - {item.expiration_date} (남은 기간: {Math.ceil((new Date(item.expiration_date) - new Date()) / (1000 * 60 * 60 * 24))}일)</Text>
          </View>
        ))}
        {filteredItems.length > maxToShow && (
          <TouchableOpacity onPress={toggleFunction}>
            <Text style={styles.moreText}>{expandedRefrigerated || expandedFrozen || expandedRoomTemp ? '접기' : '더 보기'}</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.sectionHeader}>냉장 보관</Text>
        {renderMainItems('냉장')}
        <View style={styles.divider} />

        <Text style={styles.sectionHeader}>냉동 보관</Text>
        {renderMainItems('냉동')}
        <View style={styles.divider} />

        <Text style={styles.sectionHeader}>실온 보관</Text>
        {renderMainItems('상온')}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
  },
  item: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#f9c2ff',
    borderRadius: 5,
  },
  moreText: {
    color: 'blue',
    textAlign: 'center',
    marginVertical: 10,
  },
  divider: {
    borderBottomColor: '#000',
    borderBottomWidth: 1,
    marginVertical: 10,
  },
});

export default FridgeScreen;
