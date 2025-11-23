import { http } from '@/utils/request'

// 发验证码
// encryptMobile smsStatus-cxjpf:sms:binding_phone
export function sendSmsApi(data) {
  return http.post('/bxxt/xuanwu/smsApi/sendSms', { ...data,  })
}

// 验证码校验
// code encryptMobile smsStatus-cxjpf:sms:binding_phone
export function sendSmsCheck(data) {
  return http.post('/bxxt/xuanwu/smsApi/checkCode', data)
}
