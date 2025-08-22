import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Switch,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  FlatList, Pressable,
} from 'react-native';
import Slider from '@react-native-community/slider'; // 슬라이더 컴포넌트 임포트
import { getUserSettings, updateUserSettings } from '../routes/apiClient.js';

// 실제 앱에서는 로그인된 사용자 ID를 가져와야 합니다. 여기서는 예시로 1L을 사용합니다.
const MOCK_USER_ID = 1234;
const daysList = Array.from({ length: 7 }, (_, i) => i + 1);
const minutesList = [10, 30, 60]; // 3개 선택지로 변경
export default function UserSettingsScreen({ navigation }) {
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태
  const [alertType, setAlertType] = useState('소비');
  const [alertThreshold, setAlertThreshold] = useState(3); // 일 단위
  const [alertThresholdMinutes, setAlertThresholdMinutes] = useState(30); // 분
  const [settings, setSettings] = useState({
    enableExpiryAlerts: true,
    alertType: '소비',
    alertThreshold: 7,
    alertThresholdMinutes: 30,
    enableLowStockAlerts: true,
    lowStockThreshold: 5,
    theme: 'LIGHT',
  });
  const onChangeAlertType = (type) => {
    setAlertType(type);
  };
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

      {/* 유통/소비 탭 선택 */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, alertType === '유통' && styles.tabButtonSelected]}
          onPress={() => onChangeAlertType('유통')}
        >
          <Text style={alertType === '유통' ? styles.tabTextSelected : styles.tabText}>유통</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, alertType === '소비' && styles.tabButtonSelected]}
          onPress={() => onChangeAlertType('소비')}
        >
          <Text style={alertType === '소비' ? styles.tabTextSelected : styles.tabText}>소비</Text>
        </TouchableOpacity>
      </View>

      {/* 유통 알림: 일 단위 선택 (수직 스크롤) */}
      {alertType === '유통' && (
        <View style={[styles.section, { height: 200 }]}>
          <Text style={styles.sectionTitle}>알림 시점 (일 단위)</Text>
          <FlatList
            data={daysList}
            keyExtractor={(item) => item.toString()}
            renderItem={({ item }) => (
              <Pressable onPress={() => setAlertThreshold(item)}>
                <View style={[styles.dayItem, alertThreshold === item && styles.dayItemSelected]}>
                  <Text style={alertThreshold === item ? styles.dayTextSelected : styles.dayText}>{item}일 전</Text>
                </View>
              </Pressable>
            )}
            showsVerticalScrollIndicator={true}
          />
        </View>
      )}

      {/* 소비 알림: 분 단위 선택 (가로 배치) */}
      {alertType === '소비' && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>알림 시점 (분 단위)</Text>
          <View style={styles.minutesContainer}>
            {minutesList.map((item) => (
              <Pressable
                key={item}
                onPress={() => setAlertThresholdMinutes(item)}
                style={styles.minuteButtonContainer}
              >
                <View style={[styles.minuteItem, alertThresholdMinutes === item && styles.minuteItemSelected]}>
                  <Text style={alertThresholdMinutes === item ? styles.minuteTextSelected : styles.minuteText}>
                    {item}분 전
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>
        </View>
      )}

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
    height: 110,  // 예시 높이 추가
  },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 10 },
  itemContainer: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
  },
  itemText: {
    fontSize: 18,
    color: '#007AFF',
  },
  selectedItemText: {
    color: 'white',
    fontWeight: 'bold',
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 10,
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
  tabContainer: { flexDirection: 'row', justifyContent: 'center', marginBottom: 20 },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#007AFF',
    marginHorizontal: 10,
  },
  tabButtonSelected: { backgroundColor: '#007AFF' },
  tabText: { color: '#007AFF', fontWeight: 'bold' },
  tabTextSelected: { color: 'white', fontWeight: 'bold' },

  dayItem: {
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 15,
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginHorizontal: 5,
  },
  dayItemSelected: { backgroundColor: '#007AFF' },
  dayText: { color: '#007AFF' },
  dayTextSelected: { color: 'white' },

  // 분 단위 가로 배치 스타일 추가
  minutesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
  },
  minuteButtonContainer: {
    flex: 1,
    marginHorizontal: 5,
  },
  minuteItem: {
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 15,
    paddingVertical: 8,
    paddingHorizontal: 15,
    alignItems: 'center',
  },
  minuteItemSelected: {
    backgroundColor: '#007AFF'
  },
  minuteText: {
    color: '#007AFF',
    fontSize: 14,
  },
  minuteTextSelected: {
    color: 'white',
    fontSize: 14,
  },
});
