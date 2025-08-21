import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Switch, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import Slider from '@react-native-community/slider'; // 슬라이더 컴포넌트 임포트
import { getUserSettings, updateUserSettings } from '../routes/apiClient.js';

// 실제 앱에서는 로그인된 사용자 ID를 가져와야 합니다. 여기서는 예시로 1L을 사용합니다.
const MOCK_USER_ID = 1;

export default function UserSettingsScreen({ navigation }) {
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태
  const [settings, setSettings] = useState({
    enableExpiryAlerts: true,
    alertThreshold: 7,
    enableLowStockAlerts: true,
    lowStockThreshold: 5,
    theme: 'LIGHT',
  });

  // 화면이 처음 로드될 때 사용자 설정을 불러옵니다.
  useEffect(() => {
    fetchSettings();
  }, []);

  // 서버에서 설정을 불러오는 함수
  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const userSettings = await getUserSettings(MOCK_USER_ID);
      setSettings(userSettings);
    } catch (error) {
      Alert.alert('오류', '설정을 불러오는 중 문제가 발생했습니다.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // 설정을 저장하는 함수
  const handleSave = async () => {
    try {
      setIsLoading(true);
      // 서버에 보낼 DTO 객체 생성
      const settingsDto = {
        userId: MOCK_USER_ID,
        enableExpiryAlerts: settings.enableExpiryAlerts,
        alertThreshold: settings.alertThreshold,
        enableLowStockAlerts: settings.enableLowStockAlerts,
        lowStockThreshold: settings.lowStockThreshold,
        theme: settings.theme,
      };

      await updateUserSettings(MOCK_USER_ID, settingsDto);
      Alert.alert('성공', '설정이 저장되었습니다.');
      navigation.goBack(); // 저장 후 이전 화면으로 이동
    } catch (error) {
      Alert.alert('오류', '설정 저장 중 문제가 발생했습니다.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // 로딩 중일 때 표시할 화면
  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text>설정 정보를 불러오는 중...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>사용자 설정</Text>

      {/* 유통기한 알림 설정 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>유통기한/소비기한 알림</Text>
        <View style={styles.settingRow}>
          <Text style={styles.label}>알림 받기</Text>
          <Switch
            value={settings.enableExpiryAlerts}
            onValueChange={(value) => setSettings(prev => ({ ...prev, enableExpiryAlerts: value }))}
          />
        </View>
        {settings.enableExpiryAlerts && (
          <View style={styles.settingRow}>
            <Text style={styles.label}>알림 시점: {settings.alertThreshold}일 전</Text>
            <Slider
              style={{ width: '60%' }}
              minimumValue={1}
              maximumValue={30}
              step={1}
              value={settings.alertThreshold}
              onValueChange={(value) => setSettings(prev => ({ ...prev, alertThreshold: value }))}
            />
          </View>
        )}
      </View>

      {/* 부족 재고 알림 설정 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>부족 재고 알림</Text>
        <View style={styles.settingRow}>
          <Text style={styles.label}>알림 받기</Text>
          <Switch
            value={settings.enableLowStockAlerts}
            onValueChange={(value) => setSettings(prev => ({ ...prev, enableLowStockAlerts: value }))}
          />
        </View>
        {settings.enableLowStockAlerts && (
          <View style={styles.settingRow}>
            <Text style={styles.label}>부족 기준: {settings.lowStockThreshold}개 이하</Text>
            <Slider
              style={{ width: '60%' }}
              minimumValue={1}
              maximumValue={50}
              step={1}
              value={settings.lowStockThreshold}
              onValueChange={(value) => setSettings(prev => ({ ...prev, lowStockThreshold: value }))}
            />
          </View>
        )}
      </View>

      {/* 테마 설정 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>앱 테마</Text>
        <View style={styles.themeSelector}>
          <TouchableOpacity
            style={[styles.themeButton, settings.theme === 'LIGHT' && styles.themeButtonSelected]}
            onPress={() => setSettings(prev => ({ ...prev, theme: 'LIGHT' }))}
          >
            <Text style={settings.theme === 'LIGHT' ? styles.themeTextSelected : styles.themeText}>라이트 모드</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.themeButton, settings.theme === 'DARK' && styles.themeButtonSelected]}
            onPress={() => setSettings(prev => ({ ...prev, theme: 'DARK' }))}
          >
            <Text style={settings.theme === 'DARK' ? styles.themeTextSelected : styles.themeText}>다크 모드</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 저장 버튼 */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>저장하기</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// 스타일은 CategoryExpiryScreen의 스타일을 참고하여 재구성했습니다.
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 10,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  label: {
    fontSize: 16,
  },
  themeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
  },
  themeButton: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#007AFF',
  },
  themeButtonSelected: {
    backgroundColor: '#007AFF',
  },
  themeText: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  themeTextSelected: {
    color: 'white',
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
