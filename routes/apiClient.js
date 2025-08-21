// apiClient.js
const API_BASE = 'https://jaegoserverver1-production.up.railway.app/api';

//null 배치 가져오기
export async  function getnullBatch(){
  const res = await  fetch(`${API_BASE}/batches/null`);
  return res.json();
}
//카테고리 가져오기
export async function getCategory() {
  const res = await fetch(`${API_BASE}/categories`,{
    method:'GET'
  });
  return res.json();
}
//상품 가져오기
// 상품 가져오기 (categoryId가 없으면 null 또는 undefined 전달)
export async function getProduct(categoryId) {
  let url = `${API_BASE}/inventories/category`;
  if (categoryId !== null && categoryId !== undefined) {
    url += `?categoryId=${categoryId}`;
  }
  const res = await fetch(url, {
    method: 'GET',
  });
  return res.json();
}

export async function getBatch(inventoryId){
  const res = await fetch(`${API_BASE}/batches/inventory/${inventoryId}`,{
    method:'GET'
  });
  return res.json();
}
export async function setBatch(batchId, expire,quantity){
   await fetch(`${API_BASE}/batches/${batchId}?request=${expire}&quantity=${quantity}`,{
    method:'POST'
  });
}

export async function getUrgent(days){
  const res = await fetch(`${API_BASE}/batches/urgent/${days}`, {
    method:'GET'
 });
  return res.json();
}

// 카테고리 지정하기
export async function setCategory(inventory, category){
  const res = await fetch(`${API_BASE}/inventories/category/${category}?inventoryId=${inventory}`)
  return res.json();
}
//카테고리 생성
export async function createCategory(newCategoryRequest){
  const res = await fetch(`${API_BASE}/categories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newCategoryRequest)
  });
  return res;
}
export async function deleteCategory(categoryId){
  const response = await fetch(`${API_BASE}/categories/${categoryId}`, {
    method: 'DELETE',
  });
  return response;
}
// 특정 사용자 설정 정보
export async function getUserSettings(userId) {
  const res = await fetch(`${API_BASE}/user-settings/${userId}`);
  if (!res.ok) {
    // 200번대 응답이 아니면 에러로 처리
    throw new Error('사용자 설정을 불러오는 데 실패했습니다.');
  }
  return res.json();
}
// 특정 사용자 정보 업데이트
export async function updateUserSettings(userId, settingsDto) {
  const res = await fetch(`${API_BASE}/user-settings/${userId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(settingsDto)
  });
  if (!res.ok) {
    throw new Error('사용자 설정 저장에 실패했습니다.');
  }
  return res.json(); // 성공 시 OperationResult 같은 응답 본문을 파싱
}