import React, { useState, useEffect, use } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import {getProduct} from '../routes/apiClient.js';
// 화면상 상품 예시 데이터 (실제 API에서 category별 상품 조회해서 대체 가능)
const mockProducts = {
    유제품: [
        { id: '1', name: '우유', quantity: 20, expiryDaysLeft: 3 },
        { id: '2', name: '치즈', quantity: 5, expiryDaysLeft: 1 },
        { id: '3', name: '요거트', quantity: 10, expiryDaysLeft: 7 },
    ],
    과자류: [
        { id: '4', name: '초코칩 쿠키', quantity: 15, expiryDaysLeft: 30 },
        { id: '5', name: '감자칩', quantity: 25, expiryDaysLeft: 25 },
    ],
    // 기타 카테고리 데이터도 추가 가능
};

export default function CategoryProductsScreen({ route, navigation }) {
    const {  category } = route.params;
    const [categoryName, setName] = (category.category);
    const [searchText, setSearchText] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [product, setProduct] = useState([]);


    useEffect(() => {
        const products = mockProducts[categoryName] || [];
        setFilteredProducts(products);
    }, [categoryName]);

    useEffect(() => {
        const products = mockProducts[categoryName] || [];
        const filtered = products.filter(p => p.name.includes(searchText));
        const sorted = filtered.sort((a, b) => a.expiryDaysLeft - b.expiryDaysLeft);
        setFilteredProducts(sorted);
    }, [searchText, categoryName]);
    useEffect(() => {
        getProduct(category.categoryId).then(setProduct).catch(console.error);
    }, [category]);

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.searchInput}
                placeholder="상품명으로 검색"
                value={searchText}
                onChangeText={setSearchText}
            />
            <FlatList
                data={product}
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
