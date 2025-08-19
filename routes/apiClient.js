// apiClient.js
const API_BASE = 'http://114.70.216.77:8080/api';



//카테고리 가져오기
export async function getCategory() {
  const res = await fetch(`${API_BASE}/categories`,{
    method:'GET'
  });
  return res.json();
}
//상품 가져오기
export async function getProduct( categoryId){
  const res = await fetch(`${API_BASE}/inventories/category/${categoryId}`, {
    method: 'GET'
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