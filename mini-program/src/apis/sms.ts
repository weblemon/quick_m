import {http} from "../utils/http";

/**
 * 发送短信验证码
 * @param phone
 */
export function sendSms(phone: number | string) {
  return http.get("/util/senSms",{phone})
}
