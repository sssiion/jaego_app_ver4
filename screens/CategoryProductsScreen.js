import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import {getProduct} from '../routes/apiClient.js';


export default function CategoryProductsScreen({ route, navigation }) {
    const {  category } = route.params;
    const [searchText, setSearchText] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [product, setProduct] = useState([]);



    useEffect(() => {
        getProduct(category.categoryId).then(data => {
          setProduct(data);
          setFilteredProducts(data); // 초기값으로 전체 상품 세팅
        })
          .catch(console.error);
    }, [category]);
  useEffect(() => {
    if (!searchText) {
      setFilteredProducts(product); // 검색어 없으면 전체 표시
    } else {
      const filtered = product.filter(item =>
        item.name.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchText, product]);
    return (
        <View style={styles.container}>
          <Text style={styles.topbar}>category.category</Text>
            <TextInput
                style={styles.searchInput}
                placeholder="상품명으로 검색"
                value={searchText}
                onChangeText={setSearchText}
            />
            <FlatList
                data={filteredProducts}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => navigation.navigate("ProductDetail", { product: item })}>
                    <View style={styles.productRow}>
                        <Text style={styles.productName}>{item.name}</Text>
                        <Text style={styles.productQuantity}>재고: {item.totalQuantity}개</Text>
                    </View>
                  </TouchableOpacity>
                )}
                ListEmptyComponent={<Text style={styles.emptyText}>해당 상품이 없습니다.</Text>}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  topbar: { fontSize: 22, fontWeight: 'bold', marginBottom: 6 },
    searchInput: {
        borderColor: '#ccc',
        borderWidth: 1,
        height: 40,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 12
    },
    productRow: {
        paddingVertical: 12,
        borderBottomColor: '#eee',
        borderBottomWidth: 1
    },
    productName: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    productQuantity: {
        fontSize: 14,
        color: '#555'
    },
    productExpiry: {
        fontSize: 12,
        color: '#999'
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 20,
        color: '#999'
    }
});
