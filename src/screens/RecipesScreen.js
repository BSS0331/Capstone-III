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

  const fetchRecipes = async () => {
    try {
      const response = await fetch(Recipes_Data);
      const json = await response.json();
      if (json.COOKRCP01.row.length > 0) {
        setMainRecipe(json.COOKRCP01.row[0]);
        setRecipes(json.COOKRCP01.row.slice(1));
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  useFocusEffect(
    useCallback(() => {
      const parent = navigation.getParent();
      if (parent) {
        parent.setOptions({
          tabBarStyle: { display: 'flex' },
          headerShown: false,  // 헤더를 숨깁니다.
        });
      }

      return () => {
        if (parent) {
          parent.setOptions({
            tabBarStyle: { display: 'none' },
            headerShown: false,  // 헤더를 계속 숨겨둡니다.
          });
        }
      };
    }, [navigation])
  );

  const renderHeader = () => (
    <View>
      <TouchableOpacity
        style={styles.searchContainer}
        onPress={() => navigation.navigate('SearchScreen', { origin: 'RecipesScreen' })}
      >
        <Ionicons name="search" size={20} color="black" />
        <Text style={styles.searchText}>레시피 검색...</Text>
      </TouchableOpacity>

      {mainRecipe && (
        <View style={styles.featuredRecipeContainer}>
          <Text style={styles.featuredRecipeText}>오늘의 추천 레시피</Text>
          <TouchableOpacity onPress={() => navigation.navigate('RecipeDetailScreen', { recipeId: mainRecipe.RCP_SEQ })}>
            <Image style={styles.featuredRecipeImage} source={{ uri: mainRecipe.ATT_FILE_NO_MAIN }} />
          </TouchableOpacity>
          <Text style={styles.mainRecipeTitle}>{mainRecipe.RCP_NM}</Text>
        </View>
      )}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>알면 좋은 레시피</Text>
        <TouchableOpacity onPress={() => navigation.navigate('TagsScreen')}>
          <Text style={styles.moreText}>더보기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />
      <FlatList
        ListHeaderComponent={renderHeader}
        data={recipes.slice(0, 8)}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.recipeCard} onPress={() => navigation.navigate('RecipeDetailScreen', { recipeId: item.RCP_SEQ })}>
            <Image source={{ uri: item.ATT_FILE_NO_MAIN }} style={styles.recipeImage} />
            <Text style={styles.recipeName}>{item.RCP_NM}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.RCP_SEQ.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
      />
      <FAB.Group  // FAB 그룹: 다양한 액션을 포함한 플로팅 액션 버튼
        open={isFabOpen}  // FAB 그룹의 열림 상태
        icon={isFabOpen ? 'close' : 'plus'}  // FAB 아이콘 상태에 따라 아이콘 변경
        color='#4E348B'  // FAB 아이콘 색상 설정
        actions={[  // FAB 그룹에 포함된 각 액션 버튼 설정
          { icon: 'fridge', label: '내 냉장고', onPress: () => navigation.navigate('FridgeScreen'), small: false },
          { icon: 'tag', label: '태그검색', onPress: () => navigation.navigate('TagsScreen'), small: false },
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
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
  },
  row: {
    flex: 1,
    justifyContent: 'space-around'
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 25,
    justifyContent: 'flex-start',
    backgroundColor: 'white',
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
    justifyContent: 'space-between',
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
    flexWrap: 'wrap',
  },
  fab: {
    backgroundColor: '#EEE8F4',  // FAB 배경색 설정
    borderRadius: 28,  // FAB 모서리 둥글기 설정
  },
});

export default RecipesScreen;
