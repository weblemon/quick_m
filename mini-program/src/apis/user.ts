import {BaseResponse, BaseResponsePage, http} from "../utils/http";

/**
 * 根据id查询用户信息
 * @param userId
 */
export function queryUserInfo(userId: number | string, friendId?: number | string) {
  return http.get<BaseResponse<QueryUser.Info>>(`/users/queryUser`, {
    id: userId,
    friendId: friendId ? friendId : "",
  });
}

/**
 * 查询用户列表
 * @param params
 */
export function queryUserPage(params: QueryUser.Params) {
  return http.get<BaseResponsePage<QueryUser.Info[]>>("/users/queryUserPage", params);
}
/**
 * 添加用户
 * @param data
 */
export function saveUser(data: {}) {
  return http.post<BaseResponse<any>>("/users/save", data);
}

/**
 * 更新用户
 * @param data
 */
export function updateUser(data: Partial<QueryUser.Info>) {
  return http.post<BaseResponse<any>>("/users/update", data);
}

/***
 * 生成二维码
 * @param data
 */
export function createQrCode(data: {}) {
  return http.post("/users/qrCode", data);
}

export function queryPageUrgentNeed(params: QueryUser.Need) {
  return http.get<BaseResponsePage<any[]>>("/users/queryPageUrgentNeed", params)
}

export namespace QueryUser {
  export interface Params {
    current: number;
    size: number;
    order?: "desc" | "asc";
    type?: 1 | 2;
    parentId?: number;
    province?: string;
    city?: string;
    region?: string;
  }

  export interface Info {
    isFrend: any;
    id: number;
    deleted: boolean;
    rawAddTime: string;
    rawUpdateTime?: string;
    userName?: string;
    password?: string;
    openid?: string;
    wechatNumber?: any;
    nickName?: string;
    region?: string;
    phone?: string;
    sparePhone?: string;
    realName: string;
    gender: number;
    type: number;
    state: number;
    avatarUrl?: string;
    city?: string;
    country?: string;
    language?: string;
    province?: string;
    balance: number;
    isNeedCheck: number;
    parentId?: number;
    recommendId?: any;
    qrCode?: string;
    // 是否急需房源
    isBadly: 0 | 1;
    // 急需地区
    badlyRegion?: string;
    // 急需描述
    detailed?: string;
    // 授权码
    warrantRegion?: string | null;
    district?: string;
  }

  // 急需房源参数
  export interface Need {
    badlyRegion?: string;
    detailed?: string;
    search?: string;
    order?: "asc" | "desc";
    current: number;
    size: number;
  }
}

