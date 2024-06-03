import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, SafeAreaView, StatusBar, Platform } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Recipes_Data } from '@env';

const RecipesListScreen = ({ route }) => {
  const { selectedTag } = route.params;
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch(Recipes_Data);
        const json = await response.json();
        const filteredRecipes = json.COOKRCP01.row.filter(recipe => recipe.HASH_TAG.includes(selectedTag));
        setRecipes(filteredRecipes);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchRecipes();
  }, [selectedTag]);

  useFocusEffect(
    useCallback(() => {
      const parent = navigation.getParent();
      if (parent) {
        parent.setOptions({
          tabBarStyle: { display: 'none'},
          headerShown: false,
        });

        return () => {
          parent.setOptions({
            tabBarStyle: { display: 'flex' },
            headerShown: false,
          });
        };
      }
    }, [navigation])
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.recipeCard} onPress={() => navigation.navigate('RecipeDetailScreen', { recipeId: item.RCP_SEQ })}>
      <Text style={styles.recipeTitle}>{item.RCP_NM}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={recipes}
          renderItem={renderItem}
          keyExtractor={item => item.RCP_SEQ.toString()}
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
    backgroundColor: '#f9c2ff',
    borderRadius: 10,
  },
  recipeTitle: {
    fontSize: 18,
  },
});

export default RecipesListScreen;