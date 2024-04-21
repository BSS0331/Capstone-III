import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native'; // 수정된 임포트
import { useCallback } from 'react'; // 수정된 임포트

const SearchScreen = () => {
  const navigation = useNavigation(); // useNavigation 훅을 올바르게 사용한 경우

  useFocusEffect(
    useCallback(() => {
      const parent = navigation.getParent();
      if(parent) { // 부모가 존재하는지 확인
        parent.setOptions({
          tabBarStyle: { display: 'none' },
          headerShown: false,
        });

        return () => parent.setOptions({
          tabBarStyle: undefined,
          headerShown: true,
        });
      }
    }, [navigation])
  );
  // 레시피 재료 데이터
  const recipeIngredients = ['양파', '마늘', '닭가슴살', '파프리카', '올리브 오일', '소금', '후추'];

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.searchContainer} 
        onPress={() => console.log('검색 기능 구현')}
      >
        <TextInput
          style={styles.searchInput}
          placeholder="레시피 검색..."
          placeholderTextColor="gray"
          autoFocus
        />
      </TouchableOpacity>
      <View style={styles.ingredientsContainer}>
        <Text style={styles.ingredientsTitle}>소비기한 임박 재료들</Text>
        <View style={styles.ingredientsList}>
          {recipeIngredients.map((ingredient, index) => (
            <TouchableOpacity key={index} style={styles.ingredientItem}>
              <Text>{ingredient}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  searchContainer: {
    marginBottom: 20,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: 'gray',
    backgroundColor: 'white',
    borderRadius: 25,
    paddingLeft: 15,
    paddingVertical: 10,
  },
  ingredientsContainer: {
    flex: 1,
  },
  ingredientsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  ingredientsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  ingredientItem: {
    backgroundColor: '#e0e0e0',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginRight: 10,
    marginBottom: 10,
  },
});

export default SearchScreen;