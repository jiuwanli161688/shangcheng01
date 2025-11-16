import { http } from '@/utils/request'

// 获取购物车列表
export function getCartList() {
  return http.get('/cart/list')
}

// 添加到购物车
export function addToCart(data) {
  return http.post('/cart/add', data)
}

// 更新购物车商品
export function updateCart(data) {
  return http.put('/cart/update', data)
}

// 删除购物车商品
export function deleteCart(data) {
  return http.delete('/cart/delete', data)
}

// 清空购物车
export function clearCart() {
  return http.delete('/cart/clear')
}

// 获取购物车数量
export function getCartCount() {
  return http.get('/cart/count')
}