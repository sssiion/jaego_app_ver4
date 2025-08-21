import React, {  useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import {setBatch} from '../routes/apiClient.js';
import { Picker } from '@react-native-picker/picker';


export default function BatchEditScreen({ route, navigation }) {
  const { batch } = route.params;

  // --- 상태 변수 초기화 로직 ---
  const initializeDateTime = () => {
    const now = new Date();
    const currentHour = now.getHours();

    // 시간이 오전(0-11)이면 20시, 오후(12-23)면 8시로 설정
    const initialHour = currentHour < 12 ? 20 : 8;

    return {
      year: now.getFullYear(),
      month: now.getMonth() + 1, // Date.getMonth()는 0-11을 반환하므로 +1
      day: now.getDate(),
      hour: initialHour,
      minute: 0, // 분은 항상 00으로 고정
    };
  };
  const [initialValues] = useState(initializeDateTime());
  const [year, setYear] = useState(initialValues.year);
  const [month, setMonth] = useState(initialValues.month);
  const [day, setDay] = useState(initialValues.day);
  const [hour, setHour] = useState(initialValues.hour);
  const [minute, setMinute] = useState(initialValues.minute);

  const [quantity, setQuantity] = useState('1'); // 수량은 초기값 비움
  const [isDirectInput, setIsDirectInput] = useState(false); // 수량 직접 입력 모드 상태

  const handleSave = () => {

    const pad = (n) => String(n).padStart(2, '0');
    const expiryDateTime = `${year}-${pad(month)}-${pad(day)}T${pad(hour)}:${pad(minute)}:00`;
    if (!quantity || Number(quantity) <= 0) {
      alert('수량을 1 이상으로 입력해주세요.');
      return;
    }
    setBatch(Number(batch.id), expiryDateTime, Number(quantity)).catch(console.error);
    navigation.replace('BatchEdit',{ batch: route });
    navigation.goBack();


  };
  // 피커에 표시할 데이터 생성
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i); // 현재년도 기준 +-5년
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const days = Array.from({ length: 31 }, (_, i) => i + 1); // 간단하게 1-31일로 설정
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = [0]; // 분은 0으로 고정되지만, 스크롤 인터페이스 유지를 위해 배열로 제공
  const quantities = Array.from({ length: 100 }, (_, i) => String(i + 1)); // 1부터 100까지의 수량


  return (
    <View style={styles.container}>
      <Text style={styles.label}>유통기한</Text>
      <View style={styles.pickerContainer}>
        {/* 년 */}
        <Picker
          style={styles.picker}
          selectedValue={year}
          onValueChange={(itemValue) => setYear(itemValue)}>
          {years.map((y) => <Picker.Item key={y} label={`${y}년`} value={y} />)}
        </Picker>

        {/* 월 */}
        <Picker
          style={styles.picker}
          selectedValue={month}
          onValueChange={(itemValue) => setMonth(itemValue)}>
          {months.map((m) => <Picker.Item key={m} label={`${m}월`} value={m} />)}
        </Picker>

        {/* 일 */}
        <Picker
          style={styles.picker}
          selectedValue={day}
          onValueChange={(itemValue) => setDay(itemValue)}>
          {days.map((d) => <Picker.Item key={d} label={`${d}일`} value={d} />)}
        </Picker>

        {/* 시 */}
        <Picker
          style={styles.picker}
          selectedValue={hour}
          onValueChange={(itemValue) => setHour(itemValue)}>
          {hours.map((h) => <Picker.Item key={h} label={`${h}시`} value={h} />)}
        </Picker>

        {/* 분 */}
        <Picker
          style={styles.picker}
          selectedValue={minute}
          onValueChange={(itemValue) => setMinute(itemValue)}>
          {/* 분은 0으로 고정되므로 선택지는 하나만 제공 */}
          <Picker.Item label="00분" value={0} />
        </Picker>
      </View>
      <Text style={styles.label}>수량</Text>
      <View style={styles.quantityControlContainer}>
        <View style={styles.quantityInputWrapper}>
          {isDirectInput ? (
            // 직접 입력 모드일 때 TextInput 표시
            <TextInput
              style={styles.input}
              value={String(quantity)}
              onChangeText={setQuantity}
              keyboardType="numeric"
              placeholder="수량 직접 입력"
              autoFocus={true} // TextInput으로 전환 시 바로 키보드가 나타나도록 설정
            />
          ) : (
            // 스크롤 모드일 때 Picker 표시
            <View style={styles.quantityPickerBorder}>
              <Picker
                style={styles.pickerFullWidth}
                selectedValue={String(quantity)}
                onValueChange={(itemValue) => setQuantity(itemValue)}
              >
                {quantities.map((q) => <Picker.Item key={q} label={q} value={q} />)}
              </Picker>
            </View>
          )}
        </View>
        {/* 입력 방식 전환 버튼 */}
        <TouchableOpacity
          onPress={() => setIsDirectInput(!isDirectInput)}
          style={styles.toggleButton}
        >
          <Text style={styles.toggleButtonText}>
            {isDirectInput ? '스크롤 선택' : '직접 입력'}
          </Text>
        </TouchableOpacity>
      </View>
      <Button title="저장" onPress={handleSave} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  label: { marginTop: 12, marginBottom: 4, fontSize: 14 },
  input: { borderColor: '#ccc', borderWidth: 1, borderRadius: 8, padding: 8, fontSize: 16 },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
  },
  picker: {
    flex: 1,
    // Android에서는 높이 지정이 필요할 수 있습니다.
    height: Platform.OS === 'ios' ? 180 : 50,
  },
  quantityControlContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  quantityInputWrapper: {
    flex: 1,
  },
  quantityPickerBorder: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    height: Platform.OS === 'ios' ? 'auto' : 50,
    justifyContent: 'center',
  },
  pickerFullWidth: {
    height: Platform.OS === 'ios' ? 180 : 50,
  },
  toggleButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
