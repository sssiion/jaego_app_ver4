import {React,useState,useEffect} from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Modal, TextInput } from 'react-native';
import { deleteCategory, fetchProductsByCategory } from '../routes/apiClient.js';
import {getCategory,createCategory} from '../routes/apiClient.js';


const categorynull = {
  categoryId : null,
  category : 'null'
};

export default function CategoryExpiryScreen({ navigation, type }) { //소비
  const [category, setCategory] = useState([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryType, setNewCategoryType] = useState(type); // 기본값 '유통'

  const [deleteMode, setDeleteMode] = useState(false); // 삭제 모드 활성화 여부
  const [selectedCatForDelete, setSelectedCatForDelete] = useState(null); // 삭제 확인용 카테고리
  const [confirmDeleteModalVisible, setConfirmDeleteModalVisible] = useState(false);

  useEffect(() => {
    refreshCategoryList();
  }, []);
  const refreshCategoryList = async () => {
    getCategory().then(setCategory).catch(console.error);
  };
  //카테고리 생성
  const modalCategory = async () => {
      if (!newCategoryName.trim()) {
        alert('오류', '카테고리 이름을 입력해주세요.');
        return;
      }

      const newCategoryRequest = {
        category: newCategoryName,
        categoryType: newCategoryType,
      };
      try{

          createCategory(newCategoryRequest);
          alert('성공', '새 카테고리가 생성되었습니다.');
          setModalVisible(false);
          refreshCategoryList();
      } catch (error) {
        alert('오류', '네트워크 오류가 발생했습니다.');
      console.error(error);
    }
  };
  // 카테고리 삭제 요청 함수
  const modaldelete = async (categoryId) => {
    try {
      const response=deleteCategory(categoryId);

        alert('성공', '카테고리가 삭제되었습니다.');
        setConfirmDeleteModalVisible(false);
        setSelectedCatForDelete(null);
        setDeleteMode(false);
        setNewCategoryType("소비");
        refreshCategoryList();
    } catch (error) {
      alert('오류', '네트워크 오류가 발생했습니다.');
      console.error(error);
    }
  };
  // 카테고리 항목 롱프레스 핸들러
  const handleLongPress = (cat) => {
    setDeleteMode(true);
    setSelectedCatForDelete(cat);
  };

  // 삭제 버튼 누르면 확인 모달 띄우기
  const handleDeletePress = () => {
    setConfirmDeleteModalVisible(true);
  };

  // 모달 닫기 함수
  const closeConfirmModal = () => {
    setConfirmDeleteModalVisible(false);
    setSelectedCatForDelete(null);
    setDeleteMode(false);
  };
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{type}기한별 상품 분류</Text>
      <View style={styles.grid}>
        <TouchableOpacity
          style={styles.button}
          key={-1}
          onPress={() => navigation.navigate('CategoryProducts',{category : categorynull})}>
          <Text style={styles.btnText}>null</Text>
        </TouchableOpacity>
        {category.filter(cat => cat.categoryType === type)   // "소비"인 것만 필터링
          .map((cat,idx) => (
            <TouchableOpacity
              style={styles.button}
              key={idx}
              onPress={() => {
                if (!deleteMode) {
                  navigation.navigate('CategoryProducts', { category: cat });
                }
              }}
              onLongPress={() => handleLongPress(cat)}
            >
              <Text style={styles.btnText}>{cat.category}</Text>
              {/* 삭제 모드이고 선택된 카테고리일 때 삭제 버튼 노출 */}
              {deleteMode && selectedCatForDelete?.categoryId === cat.categoryId && (
                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={handleDeletePress}
                >
                  <Text style={styles.deleteBtnText}>삭제하기</Text>
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          ))}
        {/* + 버튼 */}
        <TouchableOpacity style={[styles.button, styles.addButton]} onPress={() => setModalVisible(true)} onLongPress={() => setDeleteMode(false)}>
          <Text style={styles.addText}>+</Text>
        </TouchableOpacity>
      </View>
      {/* 모달 */}
      <Modal
        transparent={true}
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>새 카테고리 생성</Text>

            <TextInput
              style={styles.input}
              placeholder="카테고리 이름 입력"
              value={newCategoryName}
              onChangeText={setNewCategoryName}
            />

            <View style={styles.typeSelector}>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  newCategoryType === '유통' && styles.typeButtonSelected
                ]}
                onPress={() => setNewCategoryType('유통')}
              >
                <Text style={newCategoryType === '유통' ? styles.typeTextSelected : styles.typeText}>유통</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.typeButton,
                  newCategoryType === '소비' && styles.typeButtonSelected
                ]}
                onPress={() => setNewCategoryType('소비')}
              >
                <Text style={newCategoryType === '소비' ? styles.typeTextSelected : styles.typeText}>소비</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalBtn} onPress={modalCategory}>
                <Text style={styles.modalBtnText}>생성</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.modalBtn, styles.cancelBtn]} onPress={() => setModalVisible(false)}>
                <Text style={styles.modalBtnText}>취소</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {/* 삭제 확인 모달 */}
      <Modal
        transparent={true}
        animationType="fade"
        visible={confirmDeleteModalVisible}
        onRequestClose={closeConfirmModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.confirmModalContainer}>
            <Text style={styles.modalTitle}>
              카테고리: {selectedCatForDelete?.category}
            </Text>
            <Text style={{ marginVertical: 12 }}>정말 삭제하시겠습니까?</Text>

            <View style={styles.confirmButtons}>
              <TouchableOpacity
                style={[styles.confirmBtn, styles.confirmBtnYes]}
                onPress={() => modaldelete(selectedCatForDelete.categoryId)}
              >
                <Text style={styles.confirmBtnText}>네</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.confirmBtn, styles.confirmBtnNo]}
                onPress={closeConfirmModal}
              >
                <Text style={styles.confirmBtnText}>아니오</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  button: { width: '48%', aspectRatio: 1, backgroundColor: '#EFEFFF', alignItems: 'center', justifyContent: 'center', marginBottom: 12, borderRadius: 8 },
  btnText: { fontSize: 16, fontWeight: 'bold' },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginBottom: 15,
  },
  typeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  typeButton: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#aaa',
  },
  typeButtonSelected: {
    backgroundColor: '#1E90FF',
    borderColor: '#1E90FF',
  },
  typeText: { color: '#555', fontWeight: 'bold' },
  typeTextSelected: { color: 'white', fontWeight: 'bold' },

  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalBtn: {
    flex: 1,
    backgroundColor: '#1E90FF',
    paddingVertical: 12,
    marginHorizontal: 5,
    borderRadius: 6,
    alignItems: 'center',
  },
  cancelBtn: {
    backgroundColor: '#888',
  },
  modalBtnText: {
    color: 'white',
    fontWeight: 'bold',
  },
  deleteBtn: {
    position: 'absolute',
    bottom: 8,
    backgroundColor: '#FF4444',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  deleteBtnText: {
    color: 'white',
    fontWeight: 'bold',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmModalContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },

  confirmButtons: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  confirmBtn: {
    flex: 1,
    marginHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmBtnYes: {
    backgroundColor: '#FF4444',
  },
  confirmBtnNo: {
    backgroundColor: '#999',
  },
  confirmBtnText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});