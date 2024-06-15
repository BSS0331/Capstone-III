import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity, FlatList, StatusBar, SafeAreaView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { FAB } from 'react-native-paper';  // FAB 가져오기
import { Recipes_Data } from '@env';

const RecipesScreen = () => {
  const [recipes, setRecipes] = useState([]);
  const [mainRecipe, setMainRecipe] = useState(null);
  const [isFabOpen, setIsFabOpen] = useState(false);  // FAB 상태 관리
  const navigation = useNavigation();

  // 레시피 데이터를 가져오는 비동기 함수
  const fetchRecipes = async () => {
    try {
      const response = await fetch(Recipes_Data); // Recipes_Data에서 데이터를 가져옴
      const json = await response.json(); // 응답을 JSON 형식으로 변환
      if (json.COOKRCP01.row.length > 0) {
        setMainRecipe(json.COOKRCP01.row[0]); // 첫 번째 레시피를 메인 레시피로 설정
        setRecipes(json.COOKRCP01.row.slice(1)); // 나머지 레시피를 목록에 설정
      }
    } catch (error) {
      console.error(error); // 에러 발생 시 콘솔에 출력
    }
  };

  // 컴포넌트가 마운트될 때 fetchRecipes 호출
  useEffect(() => {
    fetchRecipes();
  }, []);

  // 화면에 집중될 때와 집중이 해제될 때 실행되는 useFocusEffect 훅
  useFocusEffect(
    useCallback(() => {
      const parent = navigation.getParent(); // 상위 네비게이션 객체 가져오기
      if (parent) {
        parent.setOptions({
          tabBarStyle: { display: 'flex' }, // 하단 탭 바 표시
          headerShown: false,  // 헤더를 숨김
        });
      }

      return () => {
        if (parent) {
          parent.setOptions({
            tabBarStyle: { display: 'none' }, // 하단 탭 바 숨김
            headerShown: false,  // 헤더를 계속 숨겨둠
          });
        }
      };
    }, [navigation])
  );

  // 리스트 헤더를 렌더링하는 함수
  const renderHeader = () => (
    <View>
      {/* 검색 컨테이너 */}
      <TouchableOpacity
        style={styles.searchContainer}
        onPress={() => navigation.navigate('SearchScreen', { origin: 'RecipesScreen' })}
      >
        <Ionicons name="search" size={20} color="black" />
        <Text style={styles.searchText}>레시피 검색...</Text>
      </TouchableOpacity>

      {/* 추천 레시피 섹션 */}
      {mainRecipe && (
        <View style={styles.featuredRecipeContainer}>
          <Text style={styles.featuredRecipeText}>오늘의 추천 레시피</Text>
          <TouchableOpacity onPress={() => navigation.navigate('RecipeDetailScreen', { recipeId: mainRecipe.RCP_SEQ })}>
            <Image style={styles.featuredRecipeImage} source={{ uri: mainRecipe.ATT_FILE_NO_MAIN }} />
          </TouchableOpacity>
          <Text style={styles.mainRecipeTitle}>{mainRecipe.RCP_NM}</Text>
        </View>
      )}

      {/* 섹션 헤더 */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>알면 좋은 레시피</Text>
        <TouchableOpacity onPress={() => navigation.navigate('RecipesListScreen')}>
          <Text style={styles.moreText}>더보기</Text>
        </TouchableOpacity> 
      </View>
    </View>
  );

  // 메인 화면 렌더링
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />
      <FlatList
        ListHeaderComponent={renderHeader} // 리스트의 헤더 컴포넌트 설정
        data={recipes.slice(0, 8)} // 최대 8개의 레시피를 표시
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.recipeCard} onPress={() => navigation.navigate('RecipeDetailScreen', { recipeId: item.RCP_SEQ })}>
            <Image source={{ uri: item.ATT_FILE_NO_MAIN }} style={styles.recipeImage} />
            <Text style={styles.recipeName}>{item.RCP_NM}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.RCP_SEQ.toString()} // 레시피 ID를 키로 사용
        numColumns={2} // 2열로 배열
        columnWrapperStyle={styles.row} // 열 스타일 설정
        showsVerticalScrollIndicator={false} // 스크롤바 숨김
      />
      <FAB.Group  // FAB 그룹: 다양한 액션을 포함한 플로팅 액션 버튼
        open={isFabOpen}  // FAB 그룹의 열림 상태
        icon={isFabOpen ? 'close' : 'plus'}  // FAB 아이콘 상태에 따라 아이콘 변경
        color='#4E348B'  // FAB 아이콘 색상 설정
        actions={[  // FAB 그룹에 포함된 각 액션 버튼 설정
          { icon: 'tag', label: '태그검색', onPress: () => navigation.navigate('TagsScreen'), small: false },
          { icon: 'fridge', label: '내 냉장고', onPress: () => navigation.navigate('FridgeScreen'), small: false },
        ]}
        onStateChange={({ open }) => setIsFabOpen(open)}  // FAB 상태 변경 시 상태 업데이트
        onPress={() => {
          setIsFabOpen(!isFabOpen);  // FAB 버튼 클릭 시 열림/닫힘 상태 토글
        }}
        fabStyle={styles.fab}  // FAB 커스텀 스타일 적용
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    backgroundColor: '#FFFFFF', // 배경색을 흰색으로 설정
  },
  container: {
    flex: 1,
  },
  row: {
    flex: 1,
    justifyContent: 'space-around' // 요소들을 공간 사이에 동일하게 정렬
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 25,
    justifyContent: 'flex-start', // 요소들을 왼쪽 정렬
    backgroundColor: 'white', // 배경색을 흰색으로 설정
  },
  featuredRecipeContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  featuredRecipeText: {
    fontSize: 25,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    marginTop: 10,
  },
  featuredRecipeImage: {
    width: 250,
    height: 250,
    borderRadius: 150,
    marginTop: 60,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between', // 요소들을 공간 사이에 동일하게 정렬
    alignItems: 'center',
    paddingHorizontal: 10,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
  },
  moreText: {
    fontSize: 16,
    color: 'gray',
    marginTop: 15,
  },
  recipeCard: {
    alignItems: 'center',
    marginBottom: 25,
    flex: 1 / 2,
    padding: 5,
  },
  recipeImage: {
    width: 150,
    height: 150,
    borderRadius: 40,
  },
  recipeName: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 5,
    flexWrap: 'wrap', // 줄바꿈 설정
  },
  fab: {
    backgroundColor: '#EEE8F4',  // FAB 배경색 설정
    borderRadius: 28,  // FAB 모서리 둥글기 설정
  },
});

export default RecipesScreen;