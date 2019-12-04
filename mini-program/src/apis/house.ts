import {BaseResponse, BaseResponsePage, http} from "../utils/http";
import HouseInfo = QueryHouse.HouseInfo;
import {chooseLocation} from "@tarojs/taro";

/**
 * 获取房源列表
 * @param params
 */
export function queryPageHouses(params: QueryHouse.Params, version?: "v1") {
  if (version === "v1") {
    return http.get<BaseResponsePage<HouseInfo[]>>('/housingResources/queryPageHouses', params);
  }
  return http.get<BaseResponsePage<HouseInfo[]>>('/housingResources/queryPageHousesV2', params).then(res => {
    if (res.data.data.records === null) res.data.data.records = [];
    return res;
  });
}

/**
 * 使用id查询房源
 * @param params
 */
export function queryHousingResources(params: { id: string | number, userId?: number}) {
  // return http.get<BaseResponse<HouseInfo>>("/housingResources/queryHousingResources", params);
  return http.get<BaseResponse<HouseInfo>>("/housingResources/queryHousinV2", params);
}

/**
 * 保存房源
 * @param params
 */
export function saveHousingResources(params: QueryHouse.HouseParams) {
  return http.post<BaseResponse<any>>("/housingResources/save", params);
}

export namespace QueryHouse {
  export interface Params {
    // 地区码
    areaCode?: string;
    // 省
    province?: string;
    // 市
    city?: string;
    // 区
    area?: string;
    // id
    id?: string | number;
    // 类型
    housingType?: string | number;
    // 手机
    phone?: string | number;
    // 经度
    latitude?: number| string;
    // 纬度
    longitude?: number| string;
    // 范围/米
    range?: number| string;
    // 标题
    houseTitle?: string;
    // 面积
    houseArea?: number| string;
    // 赠送面积
    houseAreaPlus?: number| string;
    // 户型
    houseType?: string | number;
    // 朝向
    houseOrientation?: number| string;
    // 价格
    price?: number| string;
    // 门锁类型
    houseDoorLookType?: number| string;
    // 装修类型
    houseDecoration?: number| string;
    // 电梯
    houseElevator?: number| string;
    // 楼层
    houseFloor?: string;
    // 发布状态
    auditStatus?: 0 | 1 | 2 | 3 | '0' | '1' | '2' | '3' | number | string;
    // 发布时间/开始时间
    startAddTime?: string;
    // 发布时间/结束时间
    endAddTime?: string;
    // 名称
    name?: string;
    // 地址
    address?: string;
    // 发布人
    releaseId?: number| string;
    // 模糊搜索
    search?: number| string;
    // 模糊类型
    hType?: number| string;
    // 开始面积
    startHouseArea?: number| string;
    // 结束面积
    endHouseArea?: number| string;
    // 开始价格
    startPrice?: number| string;
    // 结束价格
    endPrice?: number| string;
    // 条数限制
    size: number;
    // 当前页码
    current: number;
    // 排序
    order?: 'asc' | 'desc';
    // 当前用户id 匹配关注
    userId?: number;
  }
  export interface HouseParams {
    // 房源id 更新时使用
    id?: number;
    // 房源标题
    houseTitle?: string;
    // 房源面积
    houseArea?: number;
    // 赠送面积
    houseAreaPlus?: number;
    // 户型
    houseType?: string;
    // 朝向
    houseOrientation?: number;
    // 价格
    price?: number;
    // 门锁类型
    houseDoorLookType?: number;
    // 装修类型
    houseDecoration?: number;
    // 电梯
    houseElevator?: number;
    // 类型
    housingType?: number;
    // 楼层
    houseFloor?: string;
    // 发布人
    releaseId?: number;
    // 状态
    auditStatus?: number | string;
    // 图册
    housePhotos?: any;
    // 描述
    houseRemarks?: string;
    // 省
    province?: string;
    // 市
    city?: string;
    // 区
    area?: string;
    // 详细地址
    detailedAddress?: string;
    // 定位信息
    houseLocation?: chooseLocation.Promised;
  }
  export interface HouseInfo {
    // 房源id
    id: number;
    // 删除状态
    deleted: boolean;
    // 发布时间
    rawAddTime: string;
    // 更新时间
    rawUpdateTime?: any;
    // 房源标题
    houseTitle: string;
    // 房源面积
    houseArea: number;
    // 赠送面积
    houseAreaPlus: number;
    // 户型
    houseType: string;
    // 朝向
    houseOrientation: number;
    // 价格
    price: number;
    // 门锁类型
    houseDoorLookType: number;
    // 装修类型
    houseDecoration: number;
    // 电梯
    houseElevator: number;
    // 类型
    housingType: number;
    // 楼层
    houseFloor: string;
    // 发布人
    releaseId: number;
    // 状态
    auditStatus: string | number;
    // 图册
    housePhotos?: any;
    // 描述
    houseRemarks: string;
    // 省
    province: string;
    // 市
    city: string;
    // 区
    area: string;
    // 详细地址
    detailedAddress: string;
    // 定位信息
    houseLocation: HouseLocation;
    // 用户信息
    user: User;
    // 收藏装填
    isCollect?: boolean;
    browseId?: number;
    isPower?: boolean;
  }
  export interface HouseLocation {
    // 定位id
    id: number;
    // 删除状态
    deleted: boolean;
    // 创建时间
    rawAddTime?: any;
    // 更新时间
    rawUpdateTime?: any;
    // 房源id
    houssId?: any;
    // 名称
    name: string;
    // 地址
    address: string;
    // 经度
    latitude: number;
    // 纬度
    longitude: number;
  }
  export interface User {
    // 用户id
    id: number;
    // 昵称
    nickName: string;
    // 真实姓名
    realName: string;
    // 手机号码
    phone: string;
    // 备用手机
    sparePhone?: any;
    // 头像
    avatarUrl: string;
    // 性别
    gender: number;
  }
}


