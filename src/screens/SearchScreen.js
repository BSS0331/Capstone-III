import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, StatusBar, SafeAreaView, Platform, ScrollView } from 'react-native';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import { Recipes_Data, API } from '@env'; // API_URL는 건들지 않습니다.

const SearchScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { origin } = route.params || {};
  const [searchQuery, setSearchQuery] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [nearExpiryFoods, setNearExpiryFoods] = useState([]);
  const [fridgeFoods, setFridgeFoods] = useState([]);

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

    setNearExpiryFoods(dummyNearExpiryFoods);
    setFridgeFoods(dummyFridgeFoods);
  }, []);

  const fetchRecipes = async () => {
    if (!searchQuery.trim()) return;
    setIsLoading(true);
    try {
      const response = await fetch(`${Recipes_Data}?RCP_NM=${searchQuery}`);
      const json = await response.json();
      let filteredRecipes = json.COOKRCP01.row;

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
    if (origin === 'HomeScreen') {
      navigation.navigate('HomeStack', { screen: 'HomeScreen' });
    } else if (origin === 'RecipesScreen') {
      navigation.navigate('Recipes', { screen: 'RecipesHome' });
    } else {
      navigation.goBack();
    }
  };

  const handleTagPress = (tag) => {
    setSearchQuery(tag);
    fetchRecipes();
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

        {!isLoading && recipes.length === 0 && (
          <>
            <Text style={styles.sectionTitle}>유통기한 임박 제품</Text>
            <View style={styles.tagsContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {nearExpiryFoods.map((food, index) => (
                  <TouchableOpacity key={index} style={styles.tag} onPress={() => navigation.navigate('RecipesListScreen', handleTagPress(food.food_name))}>
                    <Text style={styles.tagText}>{food.food_name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <Text style={styles.sectionTitle}>내 냉장고 재료</Text>
            <View style={styles.tagsContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {fridgeFoods.map((food, index) => (
                  <TouchableOpacity key={index} style={styles.tag} onPress={() => navigation.navigate('RecipesListScreen', handleTagPress(food.food_name))}>
                    <Text style={styles.tagText}>{food.food_name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </>
        )}

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
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    backgroundColor: '#FFFFFF',
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
  goBackButton: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    textAlign: 'center',
  },
  tagsContainer: {
    marginBottom: 20,
    justifyContent: 'center',
  },
  tag: {
    backgroundColor: '#eee',
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 15,
    marginRight: 10,
    justifyContent: 'center',
  },
  tagText: {
    fontSize: 14,
    color: '#333',
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
