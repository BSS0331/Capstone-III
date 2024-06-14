import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Dimensions, TouchableOpacity, SafeAreaView, StatusBar, Platform, FlatList } from 'react-native';
import { FAB } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Recipes_Data } from '@env';

const { width } = Dimensions.get('window');

const images = [
  { id: 1, src: 'https://via.placeholder.com/300x500.png?text=Image+1' },
  { id: 2, src: 'https://via.placeholder.com/300x500.png?text=Image+2' },
  { id: 3, src: 'https://via.placeholder.com/300x500.png?text=Image+3' },
  { id: 4, src: 'https://via.placeholder.com/300x500.png?text=Image+4' },
  { id: 5, src: 'https://via.placeholder.com/300x500.png?text=Image+5' }
];

const HomeScreen = () => {
  const [isFabOpen, setIsFabOpen] = useState(false);
  const navigation = useNavigation();

  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef(null);
  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);

  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    startAutoSlide();
    fetchSeasonalFruitRecipes();
    return () => {
      clearInterval(intervalRef.current);
      clearTimeout(timeoutRef.current);
    };
  }, []);

  const fetchSeasonalFruitRecipes = async () => {
    try {
      const response = await fetch(Recipes_Data);
      const json = await response.json();
      if (json.COOKRCP01.row.length > 0) {
        // 과일이 포함된 레시피만 필터링
        const fruitRecipes = json.COOKRCP01.row.filter(recipe => recipe.RCP_PARTS_DTLS.includes('과일'));
        setRecipes(fruitRecipes.slice(0, 8)); // 첫 번째 8개의 과일 레시피만 가져옴
      }
    } catch (error) {
      console.error('레시피를 불러오는 중 오류가 발생했습니다:', error);
    }
  };

  const startAutoSlide = () => {
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);
  };

  const stopAutoSlide = () => {
    clearInterval(intervalRef.current);
  };

  const resetAutoSlide = () => {
    clearTimeout(timeoutRef.current);
    stopAutoSlide();
    timeoutRef.current = setTimeout(startAutoSlide, 5000);
  };

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ x: currentIndex * width, animated: true });
    }
  }, [currentIndex]);

  useEffect(() => {
    if (currentIndex === images.length - 1) {
      const timeout = setTimeout(() => {
        setCurrentIndex(0);
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle={Platform.OS === 'android' ? 'light-content' : 'dark-content'} />
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.searchContainer}
          onPress={() => navigation.navigate('SearchScreen', { origin: 'HomeScreen' })}
        >
          <Ionicons name="search" size={20} color="black" />
          <Text style={styles.searchText}>레시피 검색...</Text>
        </TouchableOpacity>

        {/* 이미지 슬라이더 섹션 */}
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          ref={scrollViewRef}
          onMomentumScrollEnd={(event) => {
            const index = Math.floor(event.nativeEvent.contentOffset.x / width);
            setCurrentIndex(index);
            resetAutoSlide();
          }}
          onTouchStart={stopAutoSlide}
          onTouchEnd={resetAutoSlide}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
        >
          {images.map((image) => (
            <View style={styles.imageContainer} key={image.id}>
              <Image source={{ uri: image.src }} style={styles.image} />
              <View style={styles.counter}>
                <Text style={styles.counterText}>{`${currentIndex + 1}/5`}</Text>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* 제철 과일 레시피 추천 섹션 */}
        <View style={styles.recommendationContainer}>
          <Text style={styles.recommendationTitle}>제철 과일 레시피 추천</Text>
          <FlatList
            data={recipes}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.recipeCard}
                onPress={() => navigation.navigate('RecipeDetailScreen', { recipeId: item.RCP_SEQ })}
              >
                <Image source={{ uri: item.ATT_FILE_NO_MAIN }} style={styles.recipeImage} />
                <Text style={styles.recipeName}>{item.RCP_NM}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.RCP_SEQ.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 10 }}
          />
        </View>

        {/* FAB 메뉴 */}
        <FAB.Group
          open={isFabOpen}
          icon={isFabOpen ? 'close' : 'plus'}
          color='#4E348B'
          actions={[
            { icon: 'pencil', label: '수동 입력', onPress: () => navigation.navigate('ManualEntry'), small: false },
            { icon: 'receipt', label: '영수증', onPress: () => navigation.navigate('ReceiptCapture'), small: false },
            { icon: 'barcode', label: '바코드', onPress: () => navigation.navigate('Barcode'), small: false },
            { icon: 'fridge', label: '내 냉장고', onPress: () => navigation.navigate('FridgeScreen'), small: false },
          ]}
          onStateChange={({ open }) => setIsFabOpen(open)}
          onPress={() => {
            setIsFabOpen(!isFabOpen);
          }}
          fabStyle={styles.fab}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1, // 검색창이 다른 요소 위에 있도록 설정
  },
  searchText: {
    marginLeft: 10,
  },
  fab: {
    backgroundColor: '#EEE8F4',
    borderRadius: 28,
    marginBottom: 16,
  },
  scrollView: {
    width: width,
    height: 300,
  },
  scrollViewContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    width: width,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 300,
    height: 120,
    resizeMode: 'cover',
  },
  counter: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(128, 128, 128, 0.5)',
    padding: 5,
    borderRadius: 5,
  },
  counterText: {
    color: 'white',
  },
  recommendationContainer: {
    width: width,
    paddingVertical: 20,
    marginTop: 20, // 여백 추가
  },
  recommendationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },

  recipeCard: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  recipeImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
  },
  recipeName: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 5,
    flexWrap: 'wrap',
  },
});

export default HomeScreen;