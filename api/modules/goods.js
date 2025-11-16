import { http } from '@/utils/request'

// 获取商品列表
export function getGoodsList(params) {
  return http.get('/goods/list', params)
}

// 获取商品详情
export function getGoodsDetail(id) {
  return http.get(`/goods/detail/${id}`)
}

// 获取商品分类
export function getGoodsCategory() {
  return http.get('/goods/category')
}

// 搜索商品
export function searchGoods(params) {
  return http.get('/goods/search', params)
}

// 获取商品规格
export function getGoodsSpec(id) {
  return http.get(`/goods/spec/${id}`)
}

// 收藏商品
export function collectGoods(id) {
  return http.post('/goods/collect', { goodsId: id })
}

// 取消收藏
export function cancelCollectGoods(id) {
  return http.delete(`/goods/collect/${id}`)
}

// 获取收藏列表
export function getCollectList(params) {
  return http.get('/goods/collect/list', params)
}