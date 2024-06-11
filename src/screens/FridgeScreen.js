import React, { useCallback, useState, useEffect } from 'react';
import { SafeAreaView, View, Text, StyleSheet, FlatList } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

// Sample data, replace with your database fetch
const sampleData = [
  {
    food_name: "우유",
    category: "유제품",
    quantity: 1,
    purchase_date: "2023-06-01",
    expiration_date: "2023-06-15",
    storage_condition: "냉장 보관",
    notes: "아침에 먹을 우유",
  },
  // Add more sample items with different conditions and dates
];

const FridgeScreen = ({ navigation }) => {
  const [items, setItems] = useState([]);

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
    // Replace this with fetching data from your database
    const fetchedItems = sampleData;
    const sortedItems = fetchedItems.sort((a, b) => {
      const daysLeftA = (new Date(a.expiration_date) - new Date()) / (1000 * 60 * 60 * 24);
      const daysLeftB = (new Date(b.expiration_date) - new Date()) / (1000 * 60 * 60 * 24);
      return daysLeftA - daysLeftB;
    });
    setItems(sortedItems);
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text>{item.food_name} - {item.expiration_date}</Text>
    </View>
  );

  const filterItemsByCondition = (condition) => {
    return items.filter(item => item.storage_condition === condition);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.sectionHeader}>냉장 보관</Text>
      <FlatList
        data={filterItemsByCondition('냉장 보관')}
        renderItem={renderItem}
        keyExtractor={item => item.food_name + item.expiration_date}
      />
      <View style={styles.divider} />
      <Text style={styles.sectionHeader}>냉동 보관</Text>
      <FlatList
        data={filterItemsByCondition('냉동 보관')}
        renderItem={renderItem}
        keyExtractor={item => item.food_name + item.expiration_date}
      />
      <View style={styles.divider} />
      <Text style={styles.sectionHeader}>실온 보관</Text>
      <FlatList
        data={filterItemsByCondition('실온 보관')}
        renderItem={renderItem}
        keyExtractor={item => item.food_name + item.expiration_date}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
  },
  item: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#f9c2ff',
    borderRadius: 5,
  },
  divider: {
    borderBottomColor: '#000',
    borderBottomWidth: 1,
    marginVertical: 10,
  },
});

export default FridgeScreen;
