import React from 'react';
import { View, TextInput, StyleSheet, Image, Text, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const RecipesScreen = ({ navigation }) => {
  // 더미 데이터
  const recommendedRecipe = {
    title: '오늘의 추천 레시피',
    imageUri: 'https://via.placeholder.com/150',
  };

  const galleryImages = [
    'https://via.placeholder.com/100x150',
    'https://via.placeholder.com/100x150',
    'https://via.placeholder.com/100x150',
    'https://via.placeholder.com/100x150',
    'https://via.placeholder.com/100x150',
    'https://via.placeholder.com/100x150',
     // 세로로 긴 이미지 URL
  ];

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity 
        style={styles.fakeInputContainer} 
        onPress={() => navigation.navigate('SearchScreen')}
      >
        <Ionicons name="search" size={20} color="black" />
        <Text style={styles.fakeInputText}>레시피 검색...</Text>
      </TouchableOpacity>
      <View style={styles.recommendedContainer}>
        <Text style={styles.recommendedTitle}>{recommendedRecipe.title}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('RecipeDetailScreen')}>
          <Image style={styles.recommendedImage} source={{ uri: recommendedRecipe.imageUri }} />
        </TouchableOpacity>
      </View>
      <FlatList
        horizontal
        data={galleryImages}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('RecipeDetailScreen')}>
            <Image
              style={styles.galleryImage}
              source={{ uri: item }}
            />
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index.toString()}
        showsHorizontalScrollIndicator={false}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fakeInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 25,
    justifyContent: 'flex-start',
    backgroundColor: 'white'
  },
  fakeInputText: {
    marginLeft: 10,
    color: 'gray',
  },
  recommendedContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  recommendedTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  recommendedImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 20,
  },
  galleryImage: {
    width: 200,
    height: 150,
    marginRight: 10,
    marginLeft: 10,
    marginTop: 40,
  },
});

export default RecipesScreen;
