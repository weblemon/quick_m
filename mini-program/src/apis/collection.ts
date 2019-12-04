import {BaseResponse, http} from "../utils/http";

/**
 * 添加收藏
 * @param data
 */
export function saveCollection(data: QueryCollection.EntityParams) {
  return http.post<BaseResponse<{
    id: number;
    deleted: boolean;
    rawAddTime: any;
    rawUpdateTime: any;
    userId: number;
    housesId: number;
  }>>("/collection/save", data);
}
/**
 * 删除收藏
 * @param data
 */
export function deleteCollection(data: QueryCollection.EntityParams) {
  return http.post<BaseResponse<boolean>>("/collection/delete", data);
}

export namespace QueryCollection {
  export interface EntityParams {
    housesId: number;
    userId: number;
  }
}
