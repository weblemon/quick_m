import {BaseResponse, http} from "../utils/http";

/**
 * 刷新后台的sessionKey
 * 发送短信验证码前必须检测session key是否过期
 * 否则解析会不成功
 * 如果过期使用此方法属性session key
 * @param code
 */
export function syncSessionKey(code: string) {
  return http.post<BaseResponse<SessionKeyResponse>>('/util/getWxUser', {code});
}

export type SessionKeyResponse = {
  unionid: number | string;
  openid: number | string;
  session_key: string;
}
