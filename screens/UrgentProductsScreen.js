// screens/UrgentProductsScreen.js
import React, {  useState } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, Button } from 'react-native';
import RemainingTime from './RemainingTime.js';
import { getUrgent } from '../routes/apiClient.js';



export default function UrgentProductsScreen() {
  const[products, setProducts] = useState([]);
  const [search, setSearch] = useState('');

  const [days, setDays] = useState('7');

  const fetchUrgent = () => {
    getUrgent(Number(days)).then(setProducts).catch(console.error);
  };
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
        data={products}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemRow}>
            <Text style={styles.itemName}>{item.inventoryName}</Text>
            <Text style={styles.itemDetail}>
              남은 수량: {item.quantity != null ? item.quantity.toString() : '-'}{' '}
              <RemainingTime expiryDate={item.expiryDate ? item.expiryDate.toString() : ''}/>
            </Text>
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
