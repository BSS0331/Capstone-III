import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Dimensions, TouchableOpacity, SafeAreaView, StatusBar, Platform } from 'react-native';
import { FAB } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

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

  useEffect(() => {
    startAutoSlide();
    return () => {
      clearInterval(intervalRef.current);
      clearTimeout(timeoutRef.current);
    };
  }, []);

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
        <View style={styles.imageBox}>
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
        </View>
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
    zIndex: 1,  // 검색창을 가장 위에 위치하게 설정
  },
  searchText: {
    marginLeft: 0,
  },
  fab: {
    backgroundColor: '#EEE8F4',
    borderRadius: 28,
  },
  scrollView: {
    width: width,
    height: 300, 
  },
  scrollViewContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageBox: {
    marginTop: 0,
    marginBottom: 350,
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
    fontsize: 0,
  },
});

export default HomeScreen;
