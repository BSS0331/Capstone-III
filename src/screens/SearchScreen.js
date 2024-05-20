import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, StatusBar, SafeAreaView, Platform } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';

const SearchScreen = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
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
 
  const fetchRecipes = async () => {
    if (!searchQuery.trim()) return;
    setIsLoading(true);
    try {
      const response = await fetch(`https://openapi.foodsafetykorea.go.kr/api/7bd588b749bc4deca9f5/COOKRCP01/json/1/1000?RCP_NM=${searchQuery}`);
      const json = await response.json();
      let filteredRecipes = json.COOKRCP01.row;

      // 필터링 로직
      if (searchQuery.startsWith('#')) {
        const tag = searchQuery.slice(1).toLowerCase();
        filteredRecipes = filteredRecipes.filter(recipe => recipe.HASH_TAG.toLowerCase().includes(tag));
      } else if (searchQuery.startsWith('@')) {
        const ingredient = searchQuery.slice(1).toLowerCase();
        filteredRecipes = filteredRecipes.filter(recipe => recipe.RCP_PARTS_DTLS.toLowerCase().includes(ingredient));
      } else {
        filteredRecipes = filteredRecipes.filter(recipe => recipe.RCP_NM.toLowerCase().includes(searchQuery.toLowerCase()));
      }

      setRecipes(filteredRecipes);
    } catch (error) {
      console.error('레시피 불러오기 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    fetchRecipes();
  };
  
  const handleGoBack = () => {
    navigation.goBack(); // 뒤로가기 기능을 수행합니다.
  };


  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />
    <View style={styles.container}>
      <View style={styles.searchContainer}>
      <TouchableOpacity onPress={handleGoBack} style={styles.goBackButton}>
          <AntDesign name="arrowleft" size={24} color="black" />
        </TouchableOpacity>
        <TextInput
          style={styles.searchInput}
          placeholder="요리, 재료 검색..."
          placeholderTextColor="black"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity onPress={handleSearch} style={styles.iconButton}>
          <AntDesign name="search1" size={24} color="black" />
        </TouchableOpacity>
      </View>
      {isLoading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={recipes}
          keyExtractor={item => item.RCP_SEQ.toString()}
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
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0, // 안드로이드일 경우 스테이터스 바 높이만큼 상단 패딩을 추가합니다.
    backgroundColor: '#FFFFFF', // 안전 영역의 배경색을 설정합니다.
  },
  container: {
    flex: 1,
    padding: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'gray',
    backgroundColor: 'white',
    borderRadius: 25,
    paddingLeft: 15,
    paddingVertical: 10,
    marginRight: 5,
    marginLeft: 5,
  },
  iconButton: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recipeItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  recipeTitle: {
    fontSize: 18,
  },
});

export default SearchScreen;