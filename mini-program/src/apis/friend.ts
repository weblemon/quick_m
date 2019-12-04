import {BaseResponse, BaseResponsePage, http} from "../utils/http";

/**
 * 保存朋友
 * @param data
 */
export function saveFriend(data: QueryFriend.SaveParams) {
  return http.post<BaseResponse<any>>("/friend/save", data)
}

export function deleteFriend(data: Partial<QueryFriend.SaveParams>) {
  return http.post<BaseResponse<any>>("/friend/delete", data)
}

/**
 * 查询朋友
 * @param params
 */
export function queryPageFriend(params: QueryFriend.Params) {
  return http.get<BaseResponsePage<QueryFriend.Info[]>>("/friend/queryPageFriend", params);
}



export namespace QueryFriend {
  export interface Params {
    size: number;
    current: number;
    userId?: number;
    friendId?: number;
    // 1:房东 2:中介
    type?: 1 | 2 | 3;
  }
  export interface Info {
    avatarUrl: string | null;
    badlyRegion: any;
    detailed: null;
    friendId: number | null;
    id: number;
    isBadly: 0;
    realName: string;
    type: 1 | 2 | 3;
    userId: number | null;
  }
  export interface SaveParams {
    friendId: number,
    type: 1 | 2;
    userId: number;
  }
}
