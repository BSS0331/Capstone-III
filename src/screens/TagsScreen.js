import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, SafeAreaView, Platform } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Recipes_Data } from '@env';

/**
 * 화면 상단에 태그들을 표시하는 컴포넌트
 * 각 태그를 누를 경우 해당 태그에 속하는 재료 태그들을 불러옴
 */
const TagsScreen = () => {
  const [recipes, setRecipes] = useState([]); // 모든 레시피 데이터
  const [typeTags, setTypeTags] = useState([]); // 레시피 타입 태그들
  const [selectedTypeTag, setSelectedTypeTag] = useState(null); // 선택된 타입 태그
  const [displayedTags, setDisplayedTags] = useState([]); // 표시될 재료 태그들
  const navigation = useNavigation(); // 네비게이션 객체 사용

  // 화면 진입 시 레시피 데이터를 가져오는 함수
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch(Recipes_Data); // Recipes_Data를 통해 레시피 데이터 가져오기
        const json = await response.json();
        setRecipes(json.COOKRCP01.row); // 레시피 데이터 설정
        const uniqueTypeTags = Array.from(new Set(json.COOKRCP01.row.map(item => item.RCP_PAT2))); // 중복 제거한 타입 태그 배열 생성
        setTypeTags(uniqueTypeTags); // 타입 태그 설정
      } catch (error) {
        console.error(error); // 에러 발생 시 콘솔에 출력
      }
    };

    fetchRecipes(); // 레시피 데이터 가져오기 호출
  }, []);

  // 타입 태그 선택 시 호출되는 함수
  const handleTypeTagSelect = (tag) => {
    setSelectedTypeTag(tag); // 선택된 타입 태그 설정
    updateDisplayedTags(tag); // 선택된 타입 태그에 따른 재료 태그 업데이트
  };

  // 선택된 타입 태그에 따른 재료 태그 업데이트 함수
  const updateDisplayedTags = (tag) => {
    const filteredTags = recipes.filter(item => item.RCP_PAT2 === tag).map(item => item.HASH_TAG); // 선택된 타입 태그에 해당하는 재료 태그 필터링
    const uniqueTags = Array.from(new Set(filteredTags)); // 중복 제거
    const randomTags = uniqueTags.sort(() => 0.5 - Math.random()).slice(0, 6); // 임의로 6개의 재료 태그 선택
    setDisplayedTags(randomTags); // 표시될 재료 태그 설정
  };

  // 태그 리셋 버튼 클릭 시 호출되는 함수
  const handleResetTags = () => {
    setSelectedTypeTag(null); // 선택된 타입 태그 초기화
    setDisplayedTags([]); // 표시될 재료 태그 초기화
  };

  // 새로고침 버튼 클릭 시 호출되는 함수
  const refreshTags = () => {
    if (selectedTypeTag) {
      const newTags = recipes.filter(item => item.RCP_PAT2 === selectedTypeTag).map(item => item.HASH_TAG); // 선택된 타입 태그에 따른 새로운 재료 태그 추출
      const uniqueTags = Array.from(new Set(newTags)); // 중복 제거
      const randomNewTags = uniqueTags.sort(() => 0.5 - Math.random()).slice(0, 6); // 임의로 6개의 재료 태그 선택
      setDisplayedTags(randomNewTags); // 표시될 재료 태그 업데이트
    }
  };

  // 화면 포커스 이펙트 설정
  useFocusEffect(
    useCallback(() => {
      const parent = navigation.getParent(); // 부모 네비게이션 객체 가져오기
      if (parent) {
        parent.setOptions({
          tabBarStyle: { display: 'none' }, // 하단 탭바 숨기기
          headerShown: false, // 헤더 숨기기
        });
      }

      return () => {
        if (parent) {
          parent.setOptions({
            tabBarStyle: { display: 'none' }, // 하단 탭바 계속 숨기기
            headerShown: false, // 헤더 계속 숨기기
          });
        }
      };
    }, [navigation])
  );

  // 타입 태그 렌더링 함수
  const renderTypeTag = (tag) => {
    return (
      <TouchableOpacity key={tag} onPress={() => handleTypeTagSelect(tag)}>
        <View style={styles.tag}>
          <Text style={styles.tagText}>{tag}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  // 재료 태그 렌더링 함수
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
      {/* 전체 컨테이너 */}
      <View style={styles.container}>
        {/* 태그 컨테이너 */}
        <View style={[styles.tagContainer, selectedTypeTag && styles.tagContainerSelected]}>
          {/* 선택된 타입 태그가 있을 경우 */}
          {selectedTypeTag ? (
            <View style={styles.tagRows}>
              {/* 표시되는 태그들 렌더링 */}
              {displayedTags.map((tag, index) => renderIngredientTag(tag, index))}
            </View>
          ) : (
            /* 선택된 타입 태그가 없을 경우 */
            <>
              {/* 첫 번째 줄의 태그 렌더링 */}
              <View style={styles.tagRow}>
                {typeTags.slice(0, 3).map(tag => renderTypeTag(tag))}
              </View>
              {/* 두 번째 줄의 태그 렌더링 */}
              <View style={styles.tagRow}>
                {typeTags.slice(3, 6).map(tag => renderTypeTag(tag))}
              </View>
            </>
          )}
        </View>
        {/* 선택된 타입 태그가 있을 경우 */}
        {selectedTypeTag && (
          <View style={styles.buttonContainer}>
            {/* 태그 새로고침 버튼 */}
            <TouchableOpacity style={styles.refreshButton} onPress={refreshTags}>
              <Ionicons name="refresh" size={20} color="#000" />
              <Text style={styles.buttonText}> 새 요리 재료 불러오기</Text>
            </TouchableOpacity>
            {/* 태그 리셋 버튼 */}
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
    top: '50%', // 화면 상단 중앙에 위치
    transform: [{ translateY: -145 }], // 중앙 정렬
  },
  tagRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 5, // 줄 간격
  },
  tagRows: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginBottom: 5, // 줄 간격
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
    bottom: 20, // 화면 하단에 위치
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