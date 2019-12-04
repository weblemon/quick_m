import {BaseResponsePage, http} from "../utils/http";
import {QueryHouse} from "./house";

/**
 * 市场动态
 * @param params
 */
export function queryMarketDynamic(params: Partial<QueryHouse.Params>) {
  return http.get<BaseResponsePage<any>>("/housingResources/queryDynamic", params);
}
