import { BaseResponsePage, http} from "../utils/http";

export function getServiceList(params: QueryService.Params) {
  return http.get<BaseResponsePage<QueryService.Info[]>>("/adsever/queryAdPage", params);
}

export namespace QueryService {
  export interface Params {
    current: number,
    size: number,
    order: "asc" | "desc";
    state: 0;
  }
  export interface Info {
    id: number;
    deleted?: boolean;
    rawAddTime?: string;
    rawUpdateTime?: string;
    title?: string;
    content?: string;
    phone?: string;
    type?: any;
    state?: number;
    surl?: string;
  }
}
