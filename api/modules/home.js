import { http } from '@/utils/request'

// 获取首页数据
export function getHomeData() {
  return http.get('/home/index')
}

// 获取轮播图
export function getBannerList() {
  return http.get('/home/banner')
}

// 获取分类导航
export function getCategoryList() {
  return http.get('/home/categories')
}

// 获取推荐商品
export function getRecommendList(params = {}) {
  return http.get('/home/recommend', params)
}

// 获取热门搜索
export function getHotSearch() {
  return http.get('/home/hot-search')
}