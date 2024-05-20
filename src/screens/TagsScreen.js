import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, SafeAreaView, Platform } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Recipes_Data } from '@env';

const TagsScreen = () => {
  const [recipes, setRecipes] = useState([]);
  const [typeTags, setTypeTags] = useState([]);
  const [selectedTypeTag, setSelectedTypeTag] = useState(null);
  const [displayedTags, setDisplayedTags] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch(Recipes_Data);
        const json = await response.json();
        setRecipes(json.COOKRCP01.row);
        const uniqueTypeTags = Array.from(new Set(json.COOKRCP01.row.map(item => item.RCP_PAT2)));
        setTypeTags(uniqueTypeTags);
      } catch (error) {
        console.error(error);
      }
    };

    fetchRecipes();
  }, []);

  const handleTypeTagSelect = (tag) => {
    setSelectedTypeTag(tag);
    updateDisplayedTags(tag);
  };

  const updateDisplayedTags = (tag) => {
    const filteredTags = recipes.filter(item => item.RCP_PAT2 === tag).map(item => item.HASH_TAG);
    const uniqueTags = Array.from(new Set(filteredTags));
    const randomTags = uniqueTags.sort(() => 0.5 - Math.random()).slice(0, 6);
    setDisplayedTags(randomTags);
  };

  const handleResetTags = () => {
    setSelectedTypeTag(null);
    setDisplayedTags([]);
  };

  const refreshTags = () => {
    if (selectedTypeTag) {
      const newTags = recipes.filter(item => item.RCP_PAT2 === selectedTypeTag).map(item => item.HASH_TAG);
      const uniqueTags = Array.from(new Set(newTags));
      const randomNewTags = uniqueTags.sort(() => 0.5 - Math.random()).slice(0, 6);
      setDisplayedTags(randomNewTags);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const parent = navigation.getParent();
      if (parent) {
        parent.setOptions({
          tabBarStyle: { display: 'none' },
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

  const renderTypeTag = (tag) => {
    return (
      <TouchableOpacity key={tag} onPress={() => handleTypeTagSelect(tag)}>
        <View style={styles.tag}>
          <Text style={styles.tagText}>{tag}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderIngredientTag = (tag, index) => {
    return (
      <TouchableOpacity key={`${tag}-${index}`} onPress={() => navigation.navigate('RecipesListScreen', { selectedTag: tag })}>
        <View style={styles.tag}>
          <Text style={styles.tagText}>{tag}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={[styles.tagContainer, selectedTypeTag && styles.tagContainerSelected]}>
          {selectedTypeTag ? (
            <View style={styles.tagRows}>
              {displayedTags.map((tag, index) => renderIngredientTag(tag, index))}
            </View>
          ) : (
            <>
              <View style={styles.tagRow}>
                {typeTags.slice(0, 3).map(tag => renderTypeTag(tag))}
              </View>
              <View style={styles.tagRow}>
                {typeTags.slice(3, 6).map(tag => renderTypeTag(tag))}
              </View>
            </>
          )}
        </View>
        {selectedTypeTag && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.refreshButton} onPress={refreshTags}>
              <Ionicons name="refresh" size={20} color="#000" />
              <Text style={styles.buttonText}> 새 요리 재료 불러오기</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.resetButton} onPress={handleResetTags}>
              <Text style={styles.resetButtonText}>태그 리셋하기</Text>
            </TouchableOpacity>
          </View>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  tagContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  tagContainerSelected: {
    position: 'absolute',
    top: '50%', // 중앙에 고정
    transform: [{ translateY: -145 }], // 중앙 정렬
  },
  tagRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 5, // 줄 간격을 고정
  },
  tagRows: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginBottom: 5, // 줄 간격을 고정
  },
  tag: {
    backgroundColor: '#ddd',
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    borderRadius: 20,
  },
  tagText: {
    color: '#000',
    fontSize: 16,
    textAlign: 'center',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20, // 하단에 고정
    alignItems: 'center',
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#eee', // 박스 색 설정
    borderRadius: 20,
  },
  resetButton: {
    marginVertical: 10,
  },
  buttonText: {
    marginLeft: 5,
    fontSize: 16,
    color: '#000',
  },
  resetButtonText: {
    fontSize: 16,
    color: 'green',
    textDecorationLine: 'underline', // 밑줄 추가
  },
});

export default TagsScreen;
