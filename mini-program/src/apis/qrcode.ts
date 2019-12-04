import {BaseResponse, BaseResponsePage, http} from "../utils/http";

export function queryPageCode(params: QueryPageCode.Params) {
    return http.get<BaseResponsePage<QueryPageCode.Info[]>>("/qrCodeDistrict/queryPageCode", {params});
}

export function createRegistration(data: QueryPageCode.SaveParams) {
  return http.post<BaseResponse<any>>("/qrCodeDistrict/qrCode", data)
}

/**
 * 用户创建小程序码
 * @param data
 */
export function createMiniCode(data: QueryPageCode.UserCode) {
  return http.post<BaseResponse<any>>("/users/qrCode", data)
}

/**
 * 地区激活
 * 验证激活码
 * @param registrationCode 激活码
 */
export function registrationCode(registrationCode: number| string, districtCode: number | string) {
  return http.get<BaseResponse<any>>("/qrCodeDistrict/queryCode", {
    registrationCode,
    districtCode
  });
}


export namespace QueryPageCode {
  export interface Info {
    deleted: boolean;
    districtId: number;
    districtName: string;
    id: number;
    page: string;
    qrCodeUrl: string;
    rawAddTime: string;
    rawUpdateTime: null| string;
    registrationCode: string;
    scene: string;
    type: 1 | 2;
    userId: string;
  }
  export interface Params{
    current: number;
    size: number;
    order: "asc" | "desc";
    userId?: number | string;
    //1：二维码 2:注册码
    type?: 1 | 2;
  }
  export interface UserCode {
    // 用户id
    userId: number;
    // 场景
    scene: string;
    // 页面
    page: string;
  }
  export interface SaveParams {
    id?: number;
    // 用户id
    userId?: string;
    // 地区id
    districtId?: number;
    // 地区名称
    districtName?: string;
    // 小程序码场景
    scene?: string;
    // 页面路径
    page?: string;
  }
}
