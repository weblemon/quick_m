import Qmap from "../sdk/qqmap-wx-jssdk.js";
import {GlobalEnum} from "../constants/global.enum";

export const qmap = new Qmap({
  key: GlobalEnum.qmapKey,
});

/**
 * 获取当前地址和坐标信息
 */
export function reverseGeocoder(): Promise<GeoCode.Response> {
  return new Promise((r, j) => {
    qmap.reverseGeocoder({
      success: options => r(options),
      fail: error => j(error)
    })
  })
}

/**
 * 根据地址获取当前的坐标和地址信息
 */
export function geocoder(params: GeoCode.QueryParams): Promise<GeoCode.Response<GeoCode.Result1>> {
  return new Promise((r, j) => {
    qmap.geocoder({
      ...params,
      success: res => r(res),
      fail: error => j(error),
    })
  })
}

export namespace GeoCode {
  export interface QueryParams {
    // 地址（注：地址中请包含城市名称，否则会影响解析效果），如：'北京市海淀区彩和坊路海淀西大街74号'
    address: string;
    // 指定地址所属城市,如北京市
    region?: string;
    // 签名校验
    sig?: string;
  }
  export interface Response<T = Result> {
    /**
     * 状态码，0为正常,
     * 310请求参数信息有误，
     * 311key格式错误,
     * 306请求有护持信息请检查字符串,
     * 110请求来源未被授权
     */
    status: 0 | 310 | 311 | 306 | 110;
    /**
     * 状态说明，即对状态码status进行说明，
     * 如：
     * status为0,message为"forMeQuery ok",为正常,
     * status为310,message为"请求参数信息有误",
     * status为311,message为"key格式错误",
     * status为306,message为"请求有护持信息请检查字符串",
     * status为110,message为"请求来源未被授权"
     */
    message: string;
    // 解析结果
    result: T;
  }
  // 逆地址解析结果
  export interface Result {
    location: Location;
    address: string;
    formatted_addresses: Formattedaddresses;
    address_component: Addresscomponent;
    ad_info: Adinfo;
    address_reference: Addressreference;
  }
  // 地址解析结果
  export interface Result1 {
    location: Location;
    ad_info: Adinfo;
    address_components: Addresscomponent;
    /**
     * 查询字符串与查询结果的文本相似度
     */
    similarity: number;
    /**
     * 误差距离，单位：米， 该值取决于输入地址的精确度；
     * 如address输入：海淀区北四环西路，因为地址所述范围比较大，因此会有千米级误差；
     * 而如：银科大厦这类具体的地址，返回的坐标就会相对精确；
     * 该值为 -1 时，说明输入地址为过于模糊，仅能精确到市区级。
     */
    deviation: number;
    /**
     * 是	可信度参考：值范围 1 低可信 - 10 高可信
     * 我们根据用户输入地址的准确程度，在解析过程中，
     * 将解析结果的可信度(质量)，由低到高，分为1 - 10级，该值>=7时，
     * 解析结果较为准确，7时，会存各类不可靠因素，
     * 开发者可根据自己的实际使用场景，对于解析质量的实际要求，进行参考。
     */
    reliability: number;
  }
  export interface Addressreference {
    business_area: Businessarea;
    famous_area: Businessarea;
    crossroad: Businessarea;
    town: Businessarea;
    street_number: Businessarea;
    street: Businessarea;
    landmark_l1: Businessarea;
    landmark_l2: Businessarea;
  }
  export interface Businessarea {
    id: string;
    title: string;
    location: Location;
    _distance: number;
    _dir_desc: string;
  }
  export interface Adinfo {
    nation_code: string;
    adcode: string;
    city_code: string;
    name: string;
    location: Location;
    nation: string;
    province: string;
    city: string;
    district: string;
  }
  export interface Addresscomponent {
    nation: string;
    province: string;
    city: string;
    district: string;
    street: string;
    street_number: string;
  }
  export interface Formattedaddresses {
    recommend: string;
    rough: string;
  }
  export interface Location {
    lat: number;
    lng: number;
  }
}
