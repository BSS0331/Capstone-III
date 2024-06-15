import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, ActivityIndicator, StatusBar, SafeAreaView, Platform } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Recipes_Data } from '@env';

const RecipeDetailScreen = ({ route }) => {
  const [recipe, setRecipe] = useState(null); // 레시피 데이터를 저장할 상태 변수
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태를 나타내는 상태 변수
  const [error, setError] = useState(''); // 에러 메시지를 저장할 상태 변수
  const navigation = useNavigation();
  const recipeId = route.params?.recipeId; // 전달받은 레시피 ID

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      if (!recipeId) {
        setError('레시피 불러오기 실패'); // 레시피 ID가 없을 경우 에러 설정
        setIsLoading(false); // 로딩 상태 해제
        return;
      }

      try {
        const url = Recipes_Data;
        const response = await fetch(url); // 레시피 데이터를 가져오기 위해 fetch 호출
        const json = await response.json();
        const detail = json.COOKRCP01.row.find(recipe => recipe.RCP_SEQ === recipeId); // 전달받은 레시피 ID로 레시피 찾기
        if (detail) {
          setRecipe(cleanRecipeSteps(detail)); // 레시피 데이터를 클리닝한 후 상태에 저장
        } else {
          setError('레시피 찾기 오류'); // 레시피를 찾지 못했을 경우 에러 설정
          setIsLoading(false); // 로딩 상태 해제
          return;
        }
      } catch (e) {
        setError('레시피 불러오기 실패'); // fetch 호출 중 에러 발생 시 에러 설정
        console.error(e);
      } finally {
        setIsLoading(false); // 로딩 상태 해제
      }
    };

    fetchRecipeDetails();
  }, [recipeId]);

  const cleanRecipeSteps = (recipe) => {
    const cleanedSteps = []; // 클리닝된 단계를 저장할 배열
    
     // 1부터 20까지의 숫자로 반복하여 각 단계와 해당 이미지 키를 생성
     for (let i = 1; i <= 20; i++) {
      const stepKey = `MANUAL${i.toString().padStart(2, '0')}`; // 예: MANUAL01, MANUAL02, ...
      const stepImgKey = `MANUAL_IMG${i.toString().padStart(2, '0')}`; // 예: MANUAL_IMG01, MANUAL_IMG02, ...
  
      const stepDesc = recipe[stepKey]; // 단계 설명
      if (stepDesc) {
        // 영문자를 제거하고 트림하여 클리닝된 설명을 생성
        const cleanedDesc = stepDesc.replace(/[a-zA-Z]+/g, '').trim(); // 영문자 제거

        // 클리닝된 설명과 해당 이미지를 배열에 추가
        cleanedSteps.push({
          desc: cleanedDesc,
          img: recipe[stepImgKey]
        });
      }
    }
    // 원본 레시피 객체에 클리닝된 단계를 추가하여 반환
    return {...recipe, cleanedSteps};
  };

  useFocusEffect(
    useCallback(() => {
      const parent = navigation.getParent();
      if (parent) {
        parent.setOptions({
          tabBarStyle: { display: 'none' },
          headerShown: false,  // 헤더를 숨김
        });
      }

      return () => {
        if (parent) {
          parent.setOptions({
            tabBarStyle: { display: 'none' },
            headerShown: false,  // 헤더를 계속 숨김
          });
        }
      };
    }, [navigation])
  );

  // 로딩 상태일 때 보여줄 화면
  if (isLoading) {
    return <View style={styles.centered}><ActivityIndicator size="large" /></View>;
  }

  // 에러가 있을 때 보여줄 화면
  if (error) {
    return <View style={styles.centered}><Text>{error}</Text></View>;
  }

  // 레시피가 없을 때 보여줄 화면
  if (!recipe) {
    return <View style={styles.centered}><Text>불러오기 오류</Text></View>;
  }

  // 실제 화면 구성
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* 상태바 설정 */}
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />

       {/* 스크롤 가능한 뷰 */}
      <ScrollView style={styles.container}>

        {/* 이미지 터치 가능 영역 */}
        <TouchableOpacity onPress={() => {}}>
          <Image source={{ uri: recipe.ATT_FILE_NO_MAIN }} style={styles.image} />
        </TouchableOpacity>

        {/* 레시피 이름 */}
        <Text style={styles.title}>{recipe.RCP_NM}</Text>

        {/* 레시피 상세 설명 */}
        <Text style={styles.description}>{recipe.RCP_PARTS_DTLS}</Text>

        {/* 클리닝된 단계들을 반복하여 보여줌 */}
        {recipe.cleanedSteps.map((step, index) => (
          <View key={index} style={styles.stepContainer}>
            {/* 단계 이미지가 있을 경우에만 보여줌 */}
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