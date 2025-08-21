// screens/ProductDetailScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet,TouchableOpacity,Modal, Button, ScrollView } from 'react-native';
import {getBatch,getCategory,setCategory } from '../routes/apiClient.js';
import { RadioButton, Title } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
// 샘플용 배치 데이터(mock), 실제 데이터는 API에서 가져와야 함

export default function ProductDetailScreen({ route,navigation }) {
  const { product } = route.params;
  // 실제 서비스에서는 product.id로 fetch
  const [batches, setBatches] = useState([]);
  const [sortedBatches, setSortedBatches] = useState();

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [assignedInventory, setAssignedInventory] = useState(null);

  useEffect(() => {
    getBatch(product.inventoryId).then(setBatches).catch(console.error);
  }, [product]);

  useFocusEffect(
    React.useCallback(() => {
      getBatch(product.inventoryId).then(setBatches).catch(console.error);
    }, [product])
  );

  // 카테고리 리스트 불러오기
  useEffect(() => {
    getCategory().then(data => {
      setCategories(data);
      // 현재 카테고리가 있으면 초깃값 설정
      const currentCategoryId = product.category?.categoryId || product.category?.categoryId; // 혹은 data 중에서 현재 카테고리 ID와 매칭
      setSelectedCategory(currentCategoryId);
    }).catch(console.error);
  }, [product]);

  // 카테고리 지정 API 호출하고 결과 팝업 띄우는 함수
  const handleAssignCategory = async () => {
    if (selectedCategory == null) {
      alert('카테고리를 선택해주세요.');
      return;
    }
    try {

      const result = await setCategory(Number(product.inventoryId), Number(selectedCategory));

      setAssignedInventory(result); // 반환된 인벤토리 정보를 모달에 보여줌
      setModalVisible(true);
    } catch (error) {
      console.error(error);
      alert('카테고리 지정 중 오류가 발생했습니다.');
    }
  };
  return (
    <View style={styles.container}>

      <Text style={styles.productName}>{product.name}</Text>
      <Text style={styles.totalQuantity}>총수량: {product.totalQuantity}개</Text>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>카테고리 선택</Text>
        <ScrollView style={{ maxHeight: 180, borderWidth: 1, borderColor: '#ccc', marginBottom: 10 }}>
          <RadioButton.Group
            onValueChange={value => setSelectedCategory(Number(value))}
            value={selectedCategory ? String(selectedCategory) : null}
          >
            {categories.map(cat => (
              <TouchableOpacity
                key={cat.categoryId}
                style={styles.radioRow}
                onPress={() => setSelectedCategory(cat.categoryId)}
                activeOpacity={0.7}
              >
                <RadioButton value={String(cat.categoryId)} />
                <Text>{cat.category}</Text>
              </TouchableOpacity>
            ))}
          </RadioButton.Group>
        </ScrollView>

        <Button title="확인" onPress={handleAssignCategory} />
      </View>
      <View style={styles.section}>
          <View style={styles.rowHeader}>
          <Text style={styles.header}>유통기한</Text>
          <Text style={styles.header}>수량</Text>
        </View>
        <FlatList
          data={batches}
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
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>카테고리 지정 완료</Text>
            {assignedInventory ? (
              <>
                <Text>상품명: {assignedInventory.name}</Text>
                <Text>카테고리: {assignedInventory.categoryName}</Text>
                <Text>총수량: {assignedInventory.totalQuantity}개</Text>
                <Button title="닫기" onPress={() => setModalVisible(false)} />
              </>
            ) : (
              <Text>데이터를 불러오는 중입니다...</Text>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff', flex: 1 },
  productName: { fontSize: 22, fontWeight: 'bold', marginBottom: 6 },
  totalQuantity: { fontSize: 16, marginBottom: 16, color: '#333' },
  section: { marginTop: 10 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  rowHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4, borderBottomWidth: 1, borderColor: '#ccc', paddingBottom: 2 },
  header: { fontSize: 15, fontWeight: 'bold', color: '#555' },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 7, borderBottomWidth: 0.5, borderColor: '#eee' },
  expiry: { fontSize: 15, color: '#333' },
  qty: { fontSize: 15, color: '#374' },
  radioRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6, paddingHorizontal: 10 },
  modalOverlay: {
    flex:1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent:'center',
    alignItems:'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
});
