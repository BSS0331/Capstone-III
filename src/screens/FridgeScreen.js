import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';  // 환경 변수에서 API URL 가져오기

const FridgeScreen = ({ navigation }) => {
  const [items, setItems] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      const parent = navigation.getParent();
      parent.setOptions({
        tabBarStyle: { display: 'none' },
        headerShown: false,
      });

      return () => parent.setOptions({
        tabBarStyle: { display: 'flex' },
        headerShown: false,
      });
    }, [navigation])
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        if (!token) {
          console.error('No access token found');
          return;
        }

        const response = await fetch(`${API_URL}/food/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          console.error('Failed to fetch data');
          return;
        }

        const data = await response.json();
        console.log('Fetched data:', data);  // 응답 데이터 로그 출력

        if (!Array.isArray(data)) {
          console.error('Expected an array but received:', data);
          setItems([]);  // 배열이 아닌 경우 빈 배열로 초기화
          return;
        }

        const sortedItems = data.sort((a, b) => {
          const daysLeftA = (new Date(a.expiration_date) - new Date()) / (1000 * 60 * 60 * 24);
          const daysLeftB = (new Date(b.expiration_date) - new Date()) / (1000 * 60 * 60 * 24);
          return daysLeftA - daysLeftB;
        });

        setItems(sortedItems);
        await AsyncStorage.setItem('foodData', JSON.stringify(data));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const filterItemsByCondition = (condition) => {
    return items.filter(item => item.storage_condition === condition);
  };

  const renderMainItems = (condition) => {
    const filteredItems = filterItemsByCondition(condition);
    const mainItems = filteredItems.slice(0, 3);

    return (
      <View>
        {mainItems.map((item, index) => (
          <View key={index} style={styles.item}>
            <Text>{item.food_name} - {item.expiration_date} (남은 기간: {Math.ceil((new Date(item.expiration_date) - new Date()) / (1000 * 60 * 60 * 24))}일)</Text>
          </View>
        ))}
        {filteredItems.length > 3 && (
          <TouchableOpacity onPress={() => navigation.navigate('StorageDetail', { condition })}>
            <Text style={styles.moreText}>더 보기</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.sectionHeader}>냉장 보관</Text>
      {renderMainItems('냉장 보관')}
      <View style={styles.divider} />

      <Text style={styles.sectionHeader}>냉동 보관</Text>
      {renderMainItems('냉동 보관')}
      <View style={styles.divider} />

      <Text style={styles.sectionHeader}>실온 보관</Text>
      {renderMainItems('실온 보관')}
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
