import React, { useEffect, useState, useCallback } from 'react';
import { Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, SafeAreaView, StatusBar, Platform } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Recipes_Data } from '@env';

const RecipesListScreen = ({ route }) => {
  const selectedTag = route.params?.selectedTag; // selectedTag가 없을 경우에 대비하여 route.params.selectedTag를 사용
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  // 레시피 데이터를 fetch하는 useEffect 훅
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch(Recipes_Data); // Recipes_Data에서 데이터를 fetch
        const json = await response.json(); // JSON 형식으로 변환
        let filteredRecipes = json.COOKRCP01.row; // 기본적으로 모든 레시피를 가져옴

        if (selectedTag) {
          // selectedTag가 있는 경우 해당 태그가 포함된 레시피만 필터링
          filteredRecipes = filteredRecipes.filter(recipe => recipe.HASH_TAG.includes(selectedTag));
        }

        setRecipes(filteredRecipes); // 필터링된 레시피를 상태에 저장
        setLoading(false); // 로딩 상태 해제
      } catch (error) {
        console.error(error); // 에러 발생 시 콘솔에 출력
      }
    };

    fetchRecipes(); // 데이터 fetch 함수 호출
  }, [selectedTag]);

  // 화면에 집중되었을 때 실행되는 useFocusEffect 훅
  useFocusEffect(
    useCallback(() => {
      const parent = navigation.getParent();
      parent.setOptions({
        tabBarStyle: { display: 'none' }, // 하단 탭 바 숨김
        headerShown: false, // 헤더 숨김
      });

      return () => parent.setOptions({
        tabBarStyle: { display: 'none' }, // 하단 탭 바 숨김
        headerShown: false, // 헤더 숨김
      });
    }, [navigation])
  );

  // 뒤로 가기 버튼 핸들러
  const handleGoBack = () => {
    if (origin === 'HomeScreen') {
      navigation.navigate('HomeStack', { screen: 'HomeScreen' });
    } else if (origin === 'RecipesScreen') {
      navigation.navigate('Recipes', { screen: 'RecipesHome' });
    } else {
      navigation.goBack();
    }
  };

  // 각 레시피 항목을 렌더링하는 함수
  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.recipeCard} onPress={() => navigation.navigate('RecipeDetailScreen', { recipeId: item.RCP_SEQ })}>
      <Text style={styles.recipeTitle}>{item.RCP_NM}</Text>
    </TouchableOpacity>
  );

  // 메인 화면 렌더링
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />
      {loading ? (
        // 로딩 상태일 때 ActivityIndicator를 표시
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        // 로딩이 끝나면 FlatList로 레시피 목록을 표시
        <FlatList
          data={recipes}
          renderItem={renderItem}
          keyExtractor={item => item.RCP_SEQ.toString()} // 레시피 ID를 키로 사용
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    backgroundColor: '#FFFFFF',
  },
  recipeCard: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    backgroundColor: 'gray',
    borderRadius: 10,
  },
  recipeTitle: {
    fontSize: 18,
  },
});

export default RecipesListScreen;