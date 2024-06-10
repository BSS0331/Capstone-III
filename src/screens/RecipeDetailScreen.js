import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, ActivityIndicator, StatusBar, SafeAreaView, Platform } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Recipes_Data } from '@env';

const RecipeDetailScreen = ({ route }) => {
  const [recipe, setRecipe] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigation = useNavigation();
  const recipeId = route.params?.recipeId;

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      if (!recipeId) {
        setError('레시피 불러오기 실패');
        setIsLoading(false);
        return;
      }

      try {
        const url = Recipes_Data;
        const response = await fetch(url);
        const json = await response.json();
        const detail = json.COOKRCP01.row.find(recipe => recipe.RCP_SEQ === recipeId);
        if (detail) {
          setRecipe(cleanRecipeSteps(detail));
        } else {
          setError('레시피 찾기 오류');
          setIsLoading(false);
          return;
        }
      } catch (e) {
        setError('레시피 불러오기 실패');
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipeDetails();
  }, [recipeId]);

  const cleanRecipeSteps = (recipe) => {
    const cleanedSteps = [];
    for (let i = 1; i <= 20; i++) {
      const stepKey = `MANUAL${i.toString().padStart(2, '0')}`;
      const stepImgKey = `MANUAL_IMG${i.toString().padStart(2, '0')}`;
      const stepDesc = recipe[stepKey];
      if (stepDesc) {
        const cleanedDesc = stepDesc.replace(/[a-zA-Z]+/g, '').trim(); // 영문자 제거
        cleanedSteps.push({
          desc: cleanedDesc,
          img: recipe[stepImgKey]
        });
      }
    }
    return {...recipe, cleanedSteps};
  };

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

  if (isLoading) {
    return <View style={styles.centered}><ActivityIndicator size="large" /></View>;
  }

  if (error) {
    return <View style={styles.centered}><Text>{error}</Text></View>;
  }

  if (!recipe) {
    return <View style={styles.centered}><Text>불러오기 오류</Text></View>;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />
      <ScrollView style={styles.container}>
        <TouchableOpacity onPress={() => {}}>
          <Image source={{ uri: recipe.ATT_FILE_NO_MAIN }} style={styles.image} />
        </TouchableOpacity>
        <Text style={styles.title}>{recipe.RCP_NM}</Text>
        <Text style={styles.description}>{recipe.RCP_PARTS_DTLS}</Text>
        {recipe.cleanedSteps.map((step, index) => (
          <View key={index} style={styles.stepContainer}>
            {step.img && <Image source={{ uri: step.img }} style={styles.stepImage} />}
            <Text style={styles.stepText}>{step.desc}</Text>
          </View>
        ))}
      </ScrollView>
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
    padding: 20
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: 'grey',
    textAlign: 'center'
  },
  stepContainer: {
    marginBottom: 20,
  },
  stepImage: {
    width: '100%',
    height: 250,
    borderRadius: 10,
    marginBottom: 10,
  },
  stepText: {
    fontSize: 16,
    color: 'black',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default RecipeDetailScreen;