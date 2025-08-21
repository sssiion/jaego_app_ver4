import React, {  useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import {setBatch} from '../routes/apiClient.js';


export default function BatchEditScreen({ route, navigation }) {
  const { batch } = route.params;
  const [expiry, setExpiry] = useState(String);
  const [quantity, setQuantity] = useState(String);

  const handleSave = () => {
    // 실제 서비스라면 이 부분에서 API 호출로 변경사항 저장
    // 여기서는 예시로 이전 화면으로 이동
    setBatch(Number(batch.id),parseCustomDate(expiry),Number(quantity)).catch(console.error);
    navigation.replace('BatchEdit',{ batch: route });
    navigation.goBack();


  };

  function parseCustomDate(input) {
    if (input.length !== 8 && input.length !== 6) throw new Error("입력값이 8, 6자리여야 합니다.");

    const now = new Date();
    const year = now.getFullYear(); // 올해
    const month = parseInt(input.substring(0, 2)) - 1; // JS Date는 0~11
    const day = parseInt(input.substring(2, 4));
    const hour = parseInt(input.substring(4, 6));
    var minute = 0;
    if (input.length === 8) {
      minute = parseInt(input.substring(6, 8));
    }

    const date = new Date(year, month, day, hour, minute, 0);

    // ISO 문자열 포맷 (초까지, 로컬 시간 기준)
    // toISOString()은 항상 UTC라 원하는 경우 직접 포매팅:
    const pad = n => n.toString().padStart(2, '0');
    return`${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:00`;

  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>유통기한</Text>
      <TextInput
        style={styles.input}
        value={expiry}
        onChangeText={setExpiry}
        placeholder="08/20. 09:00 > 08200900 (시간 4자리 선택)"
      />
      <Text style={styles.label}>수량</Text>
      <TextInput
        style={styles.input}
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="numeric"
        placeholder="수량"
      />
      <Button title="저장" onPress={handleSave} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  label: { marginTop: 12, marginBottom: 4, fontSize: 14 },
  input: { borderColor: '#ccc', borderWidth: 1, borderRadius: 8, padding: 8, fontSize: 16 }
});
