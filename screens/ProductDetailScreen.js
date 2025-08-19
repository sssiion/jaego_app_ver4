// screens/ProductDetailScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet,TouchableOpacity } from 'react-native';
import {getBatch} from '../routes/apiClient.js';
import { useFocusEffect } from '@react-navigation/native';
// 샘플용 배치 데이터(mock), 실제 데이터는 API에서 가져와야 함
const mockBatches = [
  { id: '1', expiry: '2025-09-05', quantity: 4 },
  { id: '2', expiry: '2025-08-25', quantity: 2 },
  { id: '3', expiry: '2025-11-03', quantity: 10 },
];

export default function ProductDetailScreen({ route,navigation }) {
  const { product } = route.params;


  // 실제 서비스에서는 product.id로 fetch
  const [batches, setBatches] = useState([]);
  const [sortedBatches, setSortedBatches] = useState();
  useEffect(() => {
    getBatch(product.inventoryId).then(setBatches).catch(console.error);
  }, [product]);

  useFocusEffect(
    React.useCallback(() => {
      getBatch(product.inventoryId).then(setBatches).catch(console.error);
    }, [product])
  );
  useEffect(() => {
    if (batches.length > 0) {
      const sorted = [...batches].sort(
        (a, b) => new Date(a.expiryDate) - new Date(b.expiryDate)
      );
      setSortedBatches(sorted);
    } else {
      setSortedBatches([]);
    }
  }, [batches]);



  return (
    <View style={styles.container}>
      <Text style={styles.productName}>{product.name}</Text>
      <Text style={styles.totalQuantity}>총수량: {product.totalQuantity}개</Text>
      <View style={styles.section}>
        <View style={styles.rowHeader}>
          <Text style={styles.header}>유통기한</Text>
          <Text style={styles.header}>수량</Text>
        </View>
        <FlatList
          data={sortedBatches}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => navigation.navigate('BatchEdit', { batch: item })}>
            <View style={styles.row}>
              <Text style={styles.expiry}>{String(item.expiryDate)}</Text>
              <Text style={styles.qty}>{item.quantity}개</Text>
            </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff', flex: 1 },
  productName: { fontSize: 22, fontWeight: 'bold', marginBottom: 6 },
  totalQuantity: { fontSize: 16, marginBottom: 16, color: '#333' },
  section: { marginTop: 10 },
  rowHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4, borderBottomWidth: 1, borderColor: '#ccc', paddingBottom: 2 },
  header: { fontSize: 15, fontWeight: 'bold', color: '#555' },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 7, borderBottomWidth: 0.5, borderColor: '#eee' },
  expiry: { fontSize: 15, color: '#333' },
  qty: { fontSize: 15, color: '#374' }
});
