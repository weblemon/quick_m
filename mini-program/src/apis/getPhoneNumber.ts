import {BaseResponse, http} from "../utils/http";

/**
 * 对称解密手机
 * @param params
 */
export function getPhoneNumber(params: GetPhoneNumberParams) {
  return http.post<BaseResponse<string>>('/util/getPhone', params);
}

export interface GetPhoneNumberParams {
  code?: string;
  session_key: string | number;
  encryptedData: string;
  iv: string;
}
