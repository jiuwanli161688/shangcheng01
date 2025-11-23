import { http } from '@/utils/request'

// 订单角标统计
// sjid
export function orderCount(data) {
  return http.get('/dingdan/ddDdb/count', data)
}
