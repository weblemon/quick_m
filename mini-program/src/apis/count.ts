import {BaseResponse, BaseResponsePage, http} from "../utils/http";

/**
 * 统计查询
 * @param userId 用户id
 * @param type 类型 1 点击量 2电话记录
 * @param dateTime 时间查询
 */
export function queryCount(userId: number, type: 1 | 2, dateTime?: string) {
  const data: any = {
    userId,
    type,
  };
  if (dateTime) {
    data.dateTime = dateTime;
  }
  return http.get<BaseResponse<number>>("/record/queryCount", data)
}
/**
 * 查询点击总数
 * @param id 房源id
 */
export function queryClickSum(id: number | string) {
  return http.get<BaseResponse<number>>("/record/querySum", {
    bizId: id,
    type: "1",
  })
}
/**
 * 查询电话联系总数
 * @param id 房源id
 */
export function queryCallSum(id: string) {
  return http.get("/record/querySum", {
    bizId: id,
    type: "2",
  })
}
/**
 * 查询电话联系列表
 * @param id 房源id
 */
export function queryCallList(id: number| string, current: number = 1, size: number = 10) {
  return http.get<BaseResponsePage<QueryCount.CallInfo[]>>("/record/queryList", {
    bizId: id,
    type: "2",
    current,
    size
  })
}
/**
 * 保存用户点击量
 * @param id 房源id
 */
export function saveClick(id: string | number) {
  return http.post("/record/save", {
    bizId: id,
    type: "1",
  })
}
/**
 * 保存用户点击量
 * @param id 房源id
 */
export function saveCall(id: string | number, phone: number, userId?: number | string) {
  return http.post("/record/save", {
    bizId: id,
    phone,
    userId,
    type: "2",
  })
}


export namespace QueryCount {
  export interface Params {
    /**
     * 当前用户id
     */
    userId: number,
    /**
     * 统计类型
     * 1 为点击量
     * 2 拨打总数
     */
    type: 1 | 2,
    /**
     * 查询时间
     */
    dateTime?: string;
  }
  export interface CallInfo {
    avatarUrl: string;
    bizId: number;
    dateStr: null| string;
    dateTime: number | string;
    deleted: boolean;
    id: number;
    phone: string;
    rawAddTime: string;
    rawUpdateTime:null | string;
    type: 1 | 2;
    userId: number;
  }
}
