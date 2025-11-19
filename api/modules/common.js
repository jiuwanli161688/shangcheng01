import { http } from '@/utils/request'

// 发验证码
// encryptMobile smsStatus-cxjpf:sms:binding_phone
export function getList() {
  return http.post('/bxxt/xuanwu/smsApi/sendSms')
}

// 验证码校验
// code encryptMobile smsStatus-cxjpf:sms:binding_phone
export function getList() {
  return http.post('/bxxt/xuanwu/smsApi/checkCode')
}
