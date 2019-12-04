import {http} from "../utils/http";

/**
 * 查询收费规则
 */
export function queryRule() {
  return http.get("/rule/queryRule")
}
