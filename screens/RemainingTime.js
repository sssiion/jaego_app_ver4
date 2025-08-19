import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// 남은 시간을 일(day) 또는 분(minute)으로 반환하는 함수
function formatRemainingTime(diffInMilliseconds) {
  const minutes = Math.floor(diffInMilliseconds / (1000 * 60));
  if (minutes < 60) {
    // 1시간 미만이면 분으로
    return `${minutes}분 남음`;
  } else if (minutes < 60 * 24) {
    // 1일 미만이면 시간으로
    const hours = Math.floor(minutes / 60);
    return `${hours}시간 남음`;
  } else {
    // 1일 이상이면 일로 표시
    const days = Math.floor(minutes / (60 * 24));
    return `${days}일 남음`;
  }
}

export default function RemainingTime({ expiryDate }) {
  // expiryDate는 '2025-08-19T14:00:00' 같은 ISO 문자열 입력 가정
  const now = new Date();
  const expiry = new Date(expiryDate);
  const diff = expiry - now; // 밀리초 차이

  return (
    <View style={styles.container}>
      {diff > 0 ? (
        <Text style={styles.text}>{formatRemainingTime(diff)}</Text>
      ) : (
        <Text style={styles.expiredText}>이미 만료됨</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  text: { fontSize: 14, color: 'green' },
  expiredText: { fontSize: 14, color: 'red' }
});
