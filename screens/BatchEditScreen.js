import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Dimensions,
  FlatList,
} from 'react-native';
import { setBatch } from '../routes/apiClient.js';
import { Picker } from '@react-native-picker/picker';

const { width } = Dimensions.get('window');
const itemHeight = 50;
const quantityItemHeight = 50;

const generateRange = (start, end) => {
  const arr = [];
  for (let i = start; i <= end; i++) arr.push(i);
  return arr;
};

export default function BatchEditScreen({ route, navigation, initialDate = new Date() }) {
  const { batch } = route.params;
  const [year] = useState(2025); // 2025년으로 고정
  const [month, setMonth] = useState(initialDate.getMonth() + 1);
  const [day, setDay] = useState(initialDate.getDate());
  const [hour, setHour] = useState(initialDate.getHours());
  const [minute, setMinute] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const months = generateRange(1, 12);
  const days = generateRange(1, 31);
  const hours = generateRange(0, 23);
  const minutes = [0]; // 0 고정
  const quantities = generateRange(0, 100);

  const saveBatch = async () => {

    const pad = (n) => String(n).padStart(2, '0');
    const expiryDateTime = `${year}-${pad(month)}-${pad(day)}T${pad(hour)}:${pad(minute)}:00`;
    try {
      await setBatch(Number(batch.id), expiryDateTime, Number(quantity));
      alert('성공', '배치가 저장되었습니다.');
      if (navigation) navigation.goBack();
    } catch (error) {
      console.error(error);
      alert('오류', '저장 중 문제가 발생했습니다.');
    }
  };

  const renderPicker = (label, data, selectedValue, setSelectedValue) => {
    const onScrollEnd = (e) => {
      const index = Math.round(e.nativeEvent.contentOffset.y / itemHeight);
      const value = data[index];
      if (value !== undefined && value !== selectedValue) {
        setSelectedValue(value);
      }
    };

    const selectedIndex = data.indexOf(selectedValue);
    const getInitialScrollIndex = () => {
      return selectedIndex >= 0 ? selectedIndex : 0;
    };

    return (
      <View style={styles.pickerContainer} key={label}>
        <Text style={styles.pickerLabel}>{label}</Text>
        <View style={styles.pickerWrapper}>
          {/* 선택 영역 표시 */}
          <View style={styles.selectionIndicator} />
          <FlatList
            data={data}
            showsVerticalScrollIndicator={false}
            snapToInterval={itemHeight}
            decelerationRate="fast"
            onMomentumScrollEnd={onScrollEnd}
            initialScrollIndex={getInitialScrollIndex()}
            contentContainerStyle={{ paddingVertical: itemHeight }} // 위아래 패딩으로 중간 정렬
            getItemLayout={(_, index) => ({
              length: itemHeight,
              offset: itemHeight * index,
              index,
            })}
            keyExtractor={(item) => String(item)}
            renderItem={({ item, index }) => {
              const isSelected = item === selectedValue;
              return (
                <View style={[styles.pickerItem, isSelected && styles.selectedItem]}>
                  <Text style={isSelected ? styles.selectedText : styles.itemText}>
                    {item}
                    {label === '월' ? '월' : label === '일' ? '일' : label === '시' ? '시' : '분'}
                  </Text>
                </View>
              );
            }}
            style={styles.flatList}
          />
        </View>
      </View>
    );
  };

  const renderQuantityPicker = () => {
    const onScrollEnd = (e) => {
      const index = Math.round(e.nativeEvent.contentOffset.y / quantityItemHeight);
      const value = quantities[index];
      if (value !== undefined && value !== quantity) {
        setQuantity(value);
      }
    };

    const selectedIndex = quantities.indexOf(quantity);
    const getInitialScrollIndex = () => {
      return selectedIndex >= 0 ? selectedIndex : 0;
    };

    return (
      <View style={styles.quantityContainer}>
        <Text style={styles.quantityLabel}>수량</Text>
        <View style={styles.quantityWrapper}>
          {/* 선택 영역 표시 */}
          <View style={styles.quantitySelectionIndicator} />
          <FlatList
            data={quantities}
            keyExtractor={(item) => String(item)}
            renderItem={({ item }) => {
              const isSelected = item === quantity;
              return (
                <View style={[styles.quantityItem, isSelected && styles.quantityItemSelected]}>
                  <Text style={isSelected ? styles.quantityTextSelected : styles.quantityText}>
                    {item}
                  </Text>
                </View>
              );
            }}
            showsVerticalScrollIndicator={false}
            snapToInterval={quantityItemHeight}
            decelerationRate="fast"
            onMomentumScrollEnd={onScrollEnd}
            initialScrollIndex={getInitialScrollIndex()}
            contentContainerStyle={{ paddingVertical: quantityItemHeight }}
            style={styles.quantityList}
            getItemLayout={(_, index) => ({
              length: quantityItemHeight,
              offset: quantityItemHeight * index,
              index,
            })}
          />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.dateTimeContainer}>
        <View style={styles.dateTimeRow}>
          {renderPicker('월', months, month, setMonth)}
          {renderPicker('일', days, day, setDay)}
          {renderPicker('시', hours, hour, setHour)}
        </View>
      </View>

      {renderQuantityPicker()}

      <TouchableOpacity style={styles.saveButton} onPress={saveBatch}>
        <Text style={styles.saveButtonText}>저장</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },

  dateTimeContainer: {
    marginBottom: 40,
  },

  dateTimeRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },

  pickerContainer: {
    alignItems: 'center',
  },

  pickerLabel: {
    fontSize: 16,
    color: '#333',
    marginBottom: 15,
    fontWeight: '600',
  },

  pickerWrapper: {
    height: itemHeight * 3,
    width: 80,
    position: 'relative',
  },

  selectionIndicator: {
    position: 'absolute',
    top: itemHeight,
    left: 0,
    right: 0,
    height: itemHeight,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#007AFF',
    zIndex: 1,
  },

  flatList: {
    height: itemHeight * 3,
    width: '100%',
  },

  pickerItem: {
    height: itemHeight,
    justifyContent: 'center',
    alignItems: 'center',
  },

  selectedItem: {
    // 스타일은 selectionIndicator로 대체
  },

  itemText: {
    fontSize: 16,
    color: '#888',
  },

  selectedText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
  },

  quantityContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },

  quantityLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },

  quantityWrapper: {
    height: quantityItemHeight * 3,
    width: 100,
    position: 'relative',
  },

  quantitySelectionIndicator: {
    position: 'absolute',
    top: quantityItemHeight,
    left: 0,
    right: 0,
    height: quantityItemHeight,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#007AFF',
    zIndex: 1,
  },

  quantityList: {
    height: quantityItemHeight * 3,
    width: '100%',
  },

  quantityItem: {
    height: quantityItemHeight,
    justifyContent: 'center',
    alignItems: 'center',
  },

  quantityItemSelected: {
    // 스타일은 selectionIndicator로 대체
  },

  quantityText: {
    fontSize: 16,
    color: '#888',
  },

  quantityTextSelected: {
    fontSize: 20,
    color: '#007AFF',
    fontWeight: 'bold',
  },

  saveButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    marginHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },

  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
