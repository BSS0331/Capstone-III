import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, StatusBar, SafeAreaView, Platform, ScrollView } from 'react-native';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import { Recipes_Data } from '@env'; // API_URL 가져오기

const SearchScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { origin } = route.params || {}; // 네비게이션 경로에서 origin 파라미터 가져오기
  const [searchQuery, setSearchQuery] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [nearExpiryFoods, setNearExpiryFoods] = useState([]); // 유통기한 임박 식품 상태 관리
  const [fridgeFoods, setFridgeFoods] = useState([]); // 냉장고 식품 상태 관리

  useFocusEffect(
    useCallback(() => {
      const parent = navigation.getParent();
      parent.setOptions({
        tabBarStyle: { display: 'none' }, // 하단 탭바 숨기기
        headerShown: false, // 헤더 숨기기
      });

      return () => parent.setOptions({
        tabBarStyle: { display: 'none' }, // 하단 탭바 계속 숨기기
        headerShown: false, // 헤더 계속 숨기기
      });
    }, [navigation])
  );

  useEffect(() => {
    // 더미 데이터 설정
    const dummyNearExpiryFoods = [
      {
        food_name: "우유",
        purchase_date: "2023-06-01",
        expiration_date: "2023-06-15",
        quantity: 1,
        unit: "개"
      },
      {
        food_name: "치즈",
        purchase_date: "2023-06-05",
        expiration_date: "2023-06-12",
        quantity: 2,
        unit: "개"
      }
    ];

    const dummyFridgeFoods = [
      {
        food_name: "우유",
        purchase_date: "2023-06-01",
        expiration_date: "2023-06-15",
        quantity: 1,
        unit: "개"
      },
      {
        food_name: "달걀",
        purchase_date: "2023-06-03",
        expiration_date: "2023-06-20",
        quantity: 12,
        unit: "개"
      }
    ];

    setNearExpiryFoods(dummyNearExpiryFoods); // 더미 데이터 설정
    setFridgeFoods(dummyFridgeFoods); // 더미 데이터 설정
  }, []);

  // 레시피를 검색하여 가져오는 함수
  const fetchRecipes = async () => {
    if (!searchQuery.trim()) return; // 검색어가 비어있을 경우 반환
    setIsLoading(true); // 로딩 상태 시작
    try {
      const response = await fetch(`${Recipes_Data}?RCP_NM=${searchQuery}`); // API 호출
      const json = await response.json();
      let filteredRecipes = json.COOKRCP01.row;

      // 검색어에 따라 필터링
      if (searchQuery.startsWith('#')) {
        const tag = searchQuery.slice(1).toLowerCase();
        filteredRecipes = filteredRecipes.filter(recipe => recipe.HASH_TAG.toLowerCase().includes(tag));
      } else if (searchQuery.startsWith('@')) {
        const ingredient = searchQuery.slice(1).toLowerCase();
        filteredRecipes = filteredRecipes.filter(recipe => recipe.RCP_PARTS_DTLS.toLowerCase().includes(ingredient));
      } else {
        filteredRecipes = filteredRecipes.filter(recipe => recipe.RCP_NM.toLowerCase().includes(searchQuery.toLowerCase()));
      }

      setRecipes(filteredRecipes); // 필터링된 레시피 설정
    } catch (error) {
      console.error('레시피 불러오기 실패:', error); // 에러 발생 시 콘솔에 출력
    } finally {
      setIsLoading(false); // 로딩 상태 종료
    }
  };

  // 검색 버튼을 눌렀을 때 호출되는 함수
  const handleSearch = () => {
    fetchRecipes();
  };

  // 뒤로가기 버튼을 눌렀을 때 호출되는 함수
  const handleGoBack = () => {
    if (origin === 'HomeScreen') {
      navigation.navigate('HomeStack', { screen: 'HomeScreen' });
    } else if (origin === 'RecipesScreen') {
      navigation.navigate('Recipes', { screen: 'RecipesHome' });
    } else {
      navigation.goBack(); // 이전 화면으로 돌아가기
    }
  };

  // 태그를 눌렀을 때 호출되는 함수
  const handleTagPress = (tag) => {
    setSearchQuery(tag); // 검색어 설정
    fetchRecipes(); // 레시피 검색
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* 안전 영역을 설정하고, 상태 표시줄을 투명하게 설정 */}
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />
      <View style={styles.container}>
        {/* 검색 컨테이너 */}
        <View style={styles.searchContainer}>
          {/* 뒤로 가기 버튼 */}
          <TouchableOpacity onPress={handleGoBack} style={styles.goBackButton}>
            <AntDesign name="arrowleft" size={24} color="black" />
          </TouchableOpacity>
          {/* 검색 입력창 */}
          <TextInput
            style={styles.searchInput}
            placeholder="요리, 재료 검색..."
            placeholderTextColor="black"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch} // 입력 완료 시 검색 실행
          />
          {/* 검색 버튼 */}
          <TouchableOpacity onPress={handleSearch} style={styles.iconButton}>
            <AntDesign name="search1" size={24} color="black" />
          </TouchableOpacity>
        </View>

        {/* 로딩 중이 아니고 검색 결과가 없는 경우 */}
        {!isLoading && recipes.length === 0 && (
          <>
            {/* 유통기한 임박 제품 섹션 */}
            <Text style={styles.sectionTitle}>유통기한 임박 제품</Text>
            <View style={styles.tagsContainer}>
              {/* 가로 스크롤 가능한 태그 목록 */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {nearExpiryFoods.map((food, index) => (
                  <TouchableOpacity key={index} style={styles.tag} onPress={() => handleTagPress(food.food_name)}>
                    <Text style={styles.tagText}>{food.food_name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* 내 냉장고 재료 섹션 */}
            <Text style={styles.sectionTitle}>내 냉장고 재료</Text>
            <View style={styles.tagsContainer}>
              {/* 가로 스크롤 가능한 태그 목록 */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {fridgeFoods.map((food, index) => (
                  <TouchableOpacity key={index} style={styles.tag} onPress={() => handleTagPress(food.food_name)}>
                    <Text style={styles.tagText}>{food.food_name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </>
        )}

        {/* 로딩 중일 때 */}
        {isLoading ? (
          <ActivityIndicator size="large" /> // 로딩 중일 때 로딩 인디케이터 표시
        ) : (
          /* 검색 결과 목록 */
          <FlatList
            data={recipes}
            keyExtractor={item => item.RCP_SEQ.toString()} // 레시피 ID를 키로 사용
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.recipeItem} onPress={() => navigation.navigate('RecipeDetailScreen', { recipeId: item.RCP_SEQ })}>
                <Text style={styles.recipeTitle}>{item.RCP_NM}</Text>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0, // 안드로이드에서는 상태 표시줄 높이만큼 패딩 추가
    backgroundColor: '#FFFFFF', // 배경색을 흰색으로 설정
  },
  container: {
    flex: 1,
    padding: 10, // 전체 컨테이너 패딩 설정
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center', // 가로 정렬 및 아이템들을 세로 정렬
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'gray', // 테두리 색상 설정
    backgroundColor: 'white', // 배경색을 흰색으로 설정
    borderRadius: 25, // 테두리 모서리를 둥글게 설정
    paddingLeft: 15, // 왼쪽 패딩 설정
    paddingVertical: 10, // 세로 패딩 설정
    marginRight: 5,
    marginLeft: 5,
  },
  iconButton: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center', // 아이콘 버튼을 가운데 정렬
  },
  goBackButton: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center', // 뒤로 가기 버튼을 가운데 정렬
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10, // 섹션 타이틀 위아래 여백 설정
    textAlign: 'center', // 가운데 정렬
  },
  tagsContainer: {
    marginBottom: 20, // 태그 컨테이너 아래 여백 설정
    justifyContent: 'center', // 태그들을 가운데 정렬
  },
  tag: {
    backgroundColor: '#eee', // 태그 배경색 설정
    borderRadius: 20, // 태그 모서리를 둥글게 설정
    paddingVertical: 5,
    paddingHorizontal: 15, // 태그 안쪽 패딩 설정
    marginRight: 10, // 태그 사이 여백 설정
    justifyContent: 'center', // 가운데 정렬
  },
  tagText: {
    fontSize: 14,
    color: '#333', // 태그 텍스트 색상 설정
  },
  recipeItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc', // 레시피 아이템의 하단 테두리 설정
  },
  recipeTitle: {
    fontSize: 18, // 레시피 제목 폰트 크기 설정
  },
});

export default SearchScreen;