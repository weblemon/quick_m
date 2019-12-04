import '@tarojs/async-await'
// eslint-disable-next-line no-unused-vars
import Taro, {Component, Config} from '@tarojs/taro'
import {Provider} from '@tarojs/redux'
import configStore from './store'
import './app.less'
import "./app.scss";
import HomeIndexPage from "./pages/house";
import {syncWxCodeAction} from "./actions/SyncWxCodeAction";
import {syncLocationAction} from "./actions/SyncLocationAction";
import qs from "qs";
import {syncFirstActiveCityCodeAction, syncRecommendIdAction} from "./actions/SyncFirstActiveCityCodeAction";
import {registrationCodeAction} from "./actions/RegistrationCodeAction";
import {updateUserInfoAction} from "./actions/UpdateUserAction";
import {syncUserInfoAction} from "./actions/SyncUserInfoAction";
import {QueryUser, queryUserInfo} from "./apis/user";
// import {IReduxStore} from "./reducers";
// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }
export const store = configStore();
class App extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  public config: Config = {
    pages: [
      "pages/home/index",
      "pages/promoter/detail",
      "pages/service/index",
      "pages/promoter/index",
      "pages/promoter/create",
      "pages/promoter/market",
      "pages/promoter/market.list",
      "pages/mine/qrcode.list",
      "pages/friend/index",
      "pages/service/buys",
      "pages/mine/buy",
      "pages/mine/active",
      "pages/mine/readme",
      "pages/mine/qrcode",
      "pages/mine/index",
      "pages/mine/setting/index",
      "pages/mine/login",
      "pages/mine/setting/info",
      "pages/mine/setting/role",
      "pages/mine/setting/phone",
      "pages/mine/authinfo",
      "pages/mine/house/index",
      "pages/mine/house/list/house",
      "pages/mine/house/count/click",
      "pages/house/index",
      "pages/house/detail",
      "pages/house/publish",
      "pages/house/photos",
      "pages/house/call",
      "pages/www/index",
      "pages/user/card"
    ],
    window: {
      backgroundTextStyle: "dark",
      navigationBarBackgroundColor: "#fff",
      navigationBarTitleText: "快马好房",
      navigationBarTextStyle: "black",
      enablePullDownRefresh: true,
      backgroundColor: "#eeeeee"
    },
    networkTimeout: {
      request: 10000,
      uploadFile: 60000,
      downloadFile: 10000,
    },
    tabBar: {
      color: "#999",
      selectedColor: "#f43516",
      list: [
        {
          pagePath: "pages/home/index",
          text: "首页",
          iconPath: "./assets/icons/home.png",
          selectedIconPath: "./assets/icons/home-active.png"
        },
        {
          pagePath: "pages/friend/index",
          text: "朋友",
          iconPath: "./assets/icons/friend.png",
          selectedIconPath: "./assets/icons/friend-active.png"
        },
        {
          pagePath: "pages/service/index",
          text: "服务",
          iconPath: "./assets/icons/service.png",
          selectedIconPath: "./assets/icons/service-active.png"
        },
        {
          pagePath: "pages/mine/index",
          text: "我的",
          iconPath: "./assets/icons/mine.png",
          selectedIconPath: "./assets/icons/mine-active.png"
        }
      ]
    },
    permission: {
      "scope.userLocation": {
        desc: "您的位置信息将用于推荐您的所在地区！"
      }
    },
    debug: false
  };

  /**
   * 同步sessionKey&wxCode
   * @param code
   */
  public syncWxCode(code: string | null) {
    if (!code) syncWxCodeAction()(store.dispatch);
  }

  /**
   * 检测用户信息是否完善，如果未完善，跳转至完善页面
   * @param userInfo
   */
  public checkUserInfo(userInfo) {
    if (userInfo) {
      const { type, realName } = userInfo;
      if (type === 0 || !realName) Taro.redirectTo({
        url: "/pages/mine/setting/index?type=0"
      });
    }
  }

  /**
   * 同步地理位置
   * @param location
   */
  public syncLocation(location) {
    if (!location) {
      syncLocationAction()(store.dispatch);
    } else {
      syncLocationAction(location)(store.dispatch);
    }
  }
  public async asyncUserInfo(userInfo: QueryUser.Info | null) {
    if (!userInfo) return;
    const data = await queryUserInfo(userInfo.id);
    if (data.data.success) {
      this.checkUserInfo(data.data.data);
      syncUserInfoAction(data.data.data)(store.dispatch);
    }
  }
  public componentWillMount(): void {
    const data = qs.parse(decodeURIComponent(this.$router.params.scene)) as Scene;
    const { code, registration, recommendId } = data;
    const { userInfo, location } = store.getState().app;
    if (registration && code) {
      // 如果用户已登录直接激活
      if (userInfo && location) {
        registrationCodeAction(code, userInfo, location)(store.dispatch);
      } else {
        // 否则加入待激活
        syncFirstActiveCityCodeAction(code)(store.dispatch);
      }
    }
    // 添加推荐人
    if (recommendId) {
      if (userInfo && !userInfo.recommendId) {
        updateUserInfoAction({
          id: userInfo.id,
          recommendId,
        })(store.dispatch)
      } else {
        syncRecommendIdAction(recommendId)(store.dispatch);
      }
    }
  }
  public componentDidMount() {}
  public componentDidShow() {
    const { userInfo, code, location } = store.getState().app;
    this.asyncUserInfo(userInfo);
    // this.checkUserInfo(userInfo);
    this.syncWxCode(code);
    this.syncLocation(location);
    store.subscribe(() => {
      const { recommendId, firstActiveCityCode, userInfo, location } = store.getState().app;
      if (userInfo) {
        if (recommendId && !recommendId.isAdd) {
          updateUserInfoAction({
            id: userInfo.id,
            recommendId: recommendId.recommendId,
          })(store.dispatch);
        }
        if (firstActiveCityCode && !firstActiveCityCode.isActive && location) {
          registrationCodeAction(firstActiveCityCode.code, userInfo, location)(store.dispatch);
        }
      }
    })
  }
  public componentDidHide() {}
  public componentDidCatchError() {}

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  public render() {
    return (
      <Provider store={store}>
        <HomeIndexPage />
      </Provider>
    )
  }
}

Taro.render(<App />, document.getElementById('app'));

interface Scene {
  // 添加注册码场景
  registration?: string;
  // 推荐人
  recommendId?: string;
  // 激活码
  code?: string;
}
