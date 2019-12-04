import {http} from "../utils/http";

/**
 * 查询用户流水记录
 * @param params
 */
export function queryPageCashFlowVo(params: {}) {
  return http.get("/cashflow/queryPageCashFlowVo", params)
}

/**
 * 查询流水详情
 * @param params
 */
export function queryCashFlowDetail(params: {}) {
  return http.get("/cashflow/queryCashFlowDetail", params)
}
