import {BaseResponse, http} from "../utils/http";

export function queryWarrantRegion(districtCode: string) {
  // 1:不是权限地区
  // 2:用户已授权
  // 3:用户未授权
  return http.get<BaseResponse<1 | 2 | 3>>("/users/privilege", {
    region: districtCode
  }).then(res => {
    if (res.data.data) {
      res.data.data = 2
    } else {
      res.data.data = 1;
    }
    return res;
  })
}
