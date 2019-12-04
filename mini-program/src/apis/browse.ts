import {BaseResponse, http} from "../utils/http";

/**
 * 查询历史访问记录
 */
export function queryPageBrowseVo(params: QueryBrowse.Params) {
  return http.get("/browse/queryPageBrowseVo", {
    ...params,
    order: "desc"
  });
}
/**
 * 删除历史记录
 */
export function deleteBrowse(data: QueryBrowse.DeleteParams) {
  return http.post<BaseResponse<any>>("/browse/delete", data);
}
/**
 * 添加历史记录
 */
export function saveBrowse(data: QueryBrowse.SaveParams) {
  return http.post<BaseResponse<any>>("/browse/save", data);
}
/**
 * 查询收藏记录
 * @param params
 */
export function queryPageCollectionVo(params: QueryBrowse.Params) {
  return http.get("/collection/queryPageCollectionVo", {
    ...params,
    order: "desc"
  })
}

export namespace QueryBrowse {
  /**
   * 查询历史记录参数
   */
  export interface Params {
    userId: number | string;
    size: number;
    current: number;
    order?: "desc";
  }
  /**
   * 删除历史记录参数
   */
  export interface DeleteParams {
    // 用户id
    id?: number;
  }
  /**
   * 保存历史记录参数
   */
  export interface SaveParams {
    /**
     * 用户id
     */
    userId: number;
    /**
     * 房源id
     */
    housesId: number;
    /**
     * 浏览时长
     */
    browseTime: number;
  }
}
