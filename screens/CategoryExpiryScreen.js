import {React,useState,useEffect} from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { fetchProductsByCategory } from '../routes/apiClient.js';
import {getCategory} from '../routes/apiClient.js';


export default function CategoryExpiryScreen({ navigation }) { //소비
  const [category, setCategory] = useState([]);
  useEffect(() => {
     getCategory().then(setCategory).catch(console.error);

  }, []);
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>소비기한별 상품 분류</Text>
      <View style={styles.grid}>
        {category.filter(cat => cat.categoryType === "소비")   // "소비"인 것만 필터링
          .map((cat,idx) => (
          <TouchableOpacity
            style={styles.button}
            key={idx}
            onPress={() => navigation.navigate('CategoryProducts', { category: cat })}
          >
            <Text style={styles.btnText}>{cat.category}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  button: { width: '48%', aspectRatio: 1, backgroundColor: '#EFEFFF', alignItems: 'center', justifyContent: 'center', marginBottom: 12, borderRadius: 8 },
  btnText: { fontSize: 16, fontWeight: 'bold' }
});
