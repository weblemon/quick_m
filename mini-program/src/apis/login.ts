import {getPhoneNumber, GetPhoneNumberParams} from "./getPhoneNumber";
import {BaseResponse, http} from "../utils/http";
import {QueryUser} from "./user";

export async function login(params: GetPhoneNumberParams, userInfo: QueryUser.Info & {unionid?: number | string; openid?: number | string; }) {
  const phoneResponse = await getPhoneNumber(params);
  const { success, data, message } = phoneResponse.data;
  if (success) {
    return http.post<BaseResponse<LoginResponse>>('/login', {
        phone: data,
        ...userInfo,
    })
  } else {
    return Promise.reject(message)
  }
}

export interface LoginResponse<T = any> {
  // 登录的token
  Authorization: string;
  // 用户信息
  userIfo: T;
}

export interface UserInfo {
  // 头像地址
  avatarUrl: string | null;
  // 钱包余额
  balance: number;
  // 城市
  city: string | null;
  // 国家
  country: string | null;
  // 删除状态
  deleted: boolean;
  // 性别 0 女 1男
  gender: number;
  // 用户id
  id: number;
  // 发布是否要检查权限
  isNeedCheck: number;
  // 语言地区
  language: string;
  // 昵称
  nickName: string | null;
  // 微信的openid
  openid: string | null;
  // 手机号码
  phone: string | null;
  // 省市
  province: string | null;
  // 个人二维码
  qrCode: string | null;
  // 注册时间
  rawAddTime: number;
  // 更新时间
  rawUpdateTime: number;
  // 真实姓名
  realName: string | null;
  // 推荐人id
  recommendId: string | null;
  // 地区
  region: string | null;
  sparePhone: string | null;
  // 状态
  state: number;
  // 类型 1 房东 2中介 3推广 0游客
  type: 0 | 1 | 2 | 3;
  isFrend: boolean;
}
