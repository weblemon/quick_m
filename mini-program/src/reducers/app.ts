import {GeoCode} from "../apis/qmap";
import {QueryFriend} from "../apis/friend";
import {QueryUser, updateUser} from "../apis/user";
import {SyncRuleAction} from "../actions/SyncRuleAction";
import {storage} from "../utils/iLocalStorage";
import {SyncWxCodeAction} from "../actions/SyncWxCodeAction";
import {SyncWxUserInfoAction} from "../actions/SyncWxUserInfoAction";
import {ActionEnum} from "../enum/action.enum";
import {SyncSessionKeyAction} from "../actions/SyncSessionKeyAction";
import {getUserInfo} from "@tarojs/taro";
import {SyncFirstActiveCityCodeAction} from "../actions/SyncFirstActiveCityCodeAction";
import {SyncFriendAction} from "../actions/SyncFriendAction";
import {SyncLocationAction} from "../actions/SyncLocationAction";
import {SyncUploadTempFileAction} from "../actions/SyncUploadTempFileAction";
import {UserLoginAction} from "../actions/UserLoginAction";
import {http} from "../utils/http";
import {UpdateUserAction} from "../actions/UpdateUserAction";

const code = storage.getItemSync("APP_USER_WX_CODE");
const userInfo = storage.getItemSync<QueryUser.Info>("APP_USER_INFO");
const session_key = storage.getItemSync("APP_USER_SESSION_KEY");
const location = storage.getItemSync<GeoCode.Result>("APP_USER_LOCATION");
const baseUserInfo = storage.getItemSync<getUserInfo.PromisedPropUserInfo>("APP_USER_WX_USER_INFO");
const unionid = storage.getItemSync("APP_USER_UNIONID");
const openid = storage.getItemSync("APP_USER_OPENID");
const token = storage.getItemSync("APP_USER_TOKEN");
const firstActiveCityCode = storage.getItemSync<any>("APP_USER_FIRST_ACTIVE_CITY_CODE");
const rule = storage.getItemSync<3|2|1>("APP_USER_RULE") || 3;
const userList = storage.getItemSync<QueryUser.Info[]>("APP_USER_USER_LIST") || [];
const forMeFriendList = storage.getItemSync<QueryFriend.Info[]>("APP_USER_FOR_ME_FRIEND") || [];
const friendForMeList = storage.getItemSync<QueryFriend.Info[]>("APP_USER_FRIEND_FOR_ME") || [];
const uploadTempFiles = storage.getItemSync<string[]>("APP_UPLOAD_TEMP_FILES") || [];
const recommendId = storage.getItemSync<any>("APP_USER_RECOMMEND_ID");

if (token) {
  http.setHeader("Authorization", token);
} else {
  http.removeHeader("Authorization");
}

const initState: AppState = {
  code,
  userInfo,
  session_key,
  location,
  baseUserInfo,
  unionid,
  openid,
  token,
  rule,
  recommendId,
  firstActiveCityCode,
  userList,
  uploadTempFiles,
  forMeFriendList,
  friendForMeList,
}


export interface AppState {
  code: string | null;
  token: string | null;
  userInfo: QueryUser.Info | null;
  location: GeoCode.Result | null;
  uploadTempFiles: string[];
  baseUserInfo: getUserInfo.PromisedPropUserInfo | null;
  session_key: string;
  unionid: string | number | null;
  openid: string | number | null;
  userList:  QueryUser.Info[];
  forMeFriendList: QueryFriend.Info[];
  friendForMeList: QueryFriend.Info[];
  // 1:不是权限地区
  // 2:用户已授权
  // 3:用户未授权
  rule: 1 | 2 | 3;
  firstActiveCityCode: {
    code: string;
    isActive: boolean;
  } | null;
  recommendId: {
    recommendId: string;
    isAdd: boolean;
  } | null;
}

export function appReducer(state: AppState = initState, action: AppActions): AppState {
  switch (action.type) {
    // 更新用户
    case ActionEnum.updateUserInfo:
      if (!state.userInfo) return state;
      return {
        ...state,
        userInfo: {
          ...state.userInfo,
          ...action.data
        }
      }
    // 同步微信code
    case ActionEnum.syncWxCode:
      const { code } = action;
      storage.setItemSync("APP_USER_WX_CODE", code);
      return {
        ...state,
        code
      };
    // 同步sessionKey
    case ActionEnum.syncSessionKey:
      const { session_key, openid, unionid } = action.data;
      storage.setItemSync("APP_USER_SESSION_KEY", session_key);
      storage.setItemSync("APP_USER_UNIONID", unionid);
      storage.setItemSync("APP_USER_OPENID", openid);
      return {
        ...state,
        session_key,
        openid,
        unionid
      }
    // 同步用户权限
    case ActionEnum.syncRule:
      const { rule } = action;
      storage.setItemSync("APP_USER_RULE", action.rule);
      return {
        ...state,
        rule
      }
    // 同步微信用户基础信息
    case ActionEnum.syncWxUserInfo:
      const { data } = action;
      storage.setItemSync("APP_USER_WX_USER_INFO", data);
      return {
        ...state,
        baseUserInfo: data
      }
    // 同步定位信息
    case ActionEnum.syncLocation:
      const { location } = action;
      storage.setItemSync("APP_USER_LOCATION", location);
      const { city, district, province } = location.address_component;
      if (state.userInfo) {
        const _userInfo = {
          ...state.userInfo,
          city,
          province,
          region: district
        }
        updateUser(_userInfo);
        return {
          ...state,
          location,
          userInfo: _userInfo
        }
      }
      return {
        ...state,
        location
      }
    // 同步用户登录后的信息
    case ActionEnum.syncUserInfo:
      const { userInfo } = action;
      storage.setItemSync("APP_USER_INFO", userInfo);
      return {
        ...state,
        userInfo
      };
    // 同步用户的token
    case ActionEnum.syncToken:
      const { token } = action;
      storage.setItemSync("APP_USER_TOKEN", token);
      return {
        ...state,
        token
      }
    // 同步首次登录扫描的激活码
    case ActionEnum.syncFirstActiveCityCode:
      const opts: { code: string, isActive: boolean } = {
        code: action.code,
        isActive: Boolean(state.userInfo && (state.userInfo.warrantRegion || "").includes(action.code + "")),
      }
      storage.setItemSync("APP_USER_FIRST_ACTIVE_CITY_CODE", opts);
      return {
        ...state,
        firstActiveCityCode: opts
      }
    // 同步推荐人id
    case ActionEnum.syncRecommendId:
      const ops: { recommendId: string, isAdd: boolean } = {
        recommendId: action.recommendId,
        isAdd: Boolean(state.userInfo && state.userInfo.recommendId)
      }
      storage.setItemSync("APP_USER_RECOMMEND_ID", ops);
      return {
        ...state,
        recommendId: ops
      }
    // 同步用户朋友列表
    case ActionEnum.syncForMeFriend:
      const { forMeFriendList } = action;
      storage.setItemSync("APP_USER_FOR_ME_FRIEND", forMeFriendList);
      return {
        ...state,
        forMeFriendList
      }
    case ActionEnum.syncFriendForMe:
      const { friendForMeList } = action;
      storage.setItemSync("APP_USER_FRIEND_FOR_ME", friendForMeList);
      return {
        ...state,
        friendForMeList
      }
    case ActionEnum.syncUserList:
      const { userList } = action;
      storage.setItemSync("APP_USER_USER_LIST", userList);
      return {
        ...state,
        userList
      }
    // 同步用户临时上传文件列表
    case ActionEnum.syncUploadTempFile:
      const { photos } = action;
      storage.setItemSync("APP_UPLOAD_TEMP_FILES", photos);
      return {
        ...state,
        uploadTempFiles: photos
      }
    default:
      return state;
  }
}

export type AppActions = SyncWxCodeAction |
  SyncWxUserInfoAction |
  SyncSessionKeyAction |
  SyncRuleAction |
  SyncFirstActiveCityCodeAction |
  SyncFriendAction|
  SyncLocationAction|
  SyncUploadTempFileAction|
  UserLoginAction |
  UpdateUserAction ;
