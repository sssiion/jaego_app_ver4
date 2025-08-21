// screens/UrgentProductsScreen.js
import React, {  useState,useEffect ,useLayoutEffect  } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, Button, TouchableOpacity } from 'react-native';
import RemainingTime from './RemainingTime.js';
import { getUrgent } from '../routes/apiClient.js';
import Ionicons from 'react-native-vector-icons/Ionicons';



export default function UrgentProductsScreen({navigation}) {
  const[products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [days, setDays] = useState('7');

  const fetchUrgent = () => {
    getUrgent(Number(days))
      .then(data => {
        setProducts(data);
        setFilteredProducts(data);
      })
      .catch(console.error);
  };

  // useLayoutEffect를 사용하면 화면이 렌더링되기 전에 헤더가 설정되어 깜빡임이 없습니다.
  useLayoutEffect(() => {
    navigation.setOptions({
      // headerRight 옵션을 사용하여 오른쪽에 컴포넌트를 추가합니다.
      headerRight: () => (
        <TouchableOpacity
          onPress={() => navigation.navigate('UserSetting')} // 'UserSetting' 화면으로 이동
          style={{ marginRight: 15 }} // 아이콘과 화면 가장자리 사이의 여백
        >
          {/* 톱니바퀴 아이콘 */}
          <Ionicons name="settings-outline" size={24} color="black" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]); // navigation 객체가 변경될 때만 이 효과를 다시 실행
  // 검색어가 바뀔 때 필터링
    useEffect(() => {
      if (!search) {
        setFilteredProducts(products);
      } else {
        const filtered = products.filter(item =>
          item.inventoryName.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredProducts(filtered);
      }
    }, [search, products]);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>임박 상품 모음</Text>
      <TextInput
        style={styles.input}
        placeholder="상품명 검색"
        value={search}
        onChangeText={setSearch}
      />
      {/* 임박일수 입력 */}
      <TextInput
        style={styles.input}
        placeholder="임박 일수 입력"
        keyboardType="numeric"
        value={days}
        onChangeText={setDays}
      />
      {/* 검색 버튼 */}
      <Button title="검색" onPress={fetchUrgent} />
      <FlatList
        data={filteredProducts}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (

          <View style={styles.itemRow}>
            <TouchableOpacity
              onPress={() => navigation.navigate("ProductDetail", { product: item })}>
            <Text style={styles.itemName}>{item.inventoryName}</Text>
            <Text style={styles.itemDetail}>
              남은 수량: {item.quantity != null ? item.quantity.toString() : '-'}{' '}
              <RemainingTime expiryDate={item.expiryDate ? item.expiryDate.toString() : ''}/>
            </Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  input: { height: 40, borderColor: '#CED', borderWidth: 1, marginBottom: 10, paddingHorizontal: 8, borderRadius: 6 },
  itemRow: { marginBottom: 14 },
  itemName: { fontSize: 16, fontWeight: 'bold' },
  itemDetail: { fontSize: 14, color: '#666' }
});
