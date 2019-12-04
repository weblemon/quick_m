/**
 * @class MineLoginPage Page
 * @date 2019/6/28 17:01
 * @author RanYunlong
 */
// eslint-disable-next-line no-unused-vars
import Taro, {Component, Config} from "@tarojs/taro";
import {View, Image} from "@tarojs/components";
import loginImage from "../../assets/images/login.jpg";
import {BaseEventOrig} from "@tarojs/components/types/common";
import {connect} from "@tarojs/redux";
import {IReduxStore} from "../../reducers";
import "./login.less";
import {AtButton} from "taro-ui";
import {userLoginAction, userLogoutAction} from "../../actions/UserLoginAction";
import {syncWxCodeAction} from "../../actions/SyncWxCodeAction";
import {syncFirstActiveCityCodeAction} from "../../actions/SyncFirstActiveCityCodeAction";
import {syncLocationAction} from "../../actions/SyncLocationAction";

const mapStateToProps = (state: IReduxStore) => {
  const { code, baseUserInfo, session_key, unionid, openid, firstActiveCityCode, userInfo, location } = state.app;
  return {
    code,
    location,
    baseUserInfo,
    session_key,
    unionid,
    openid,
    firstActiveCityCode,
    userInfo
  }
};

const mapDispatchToProps = {
  login: userLoginAction,
  syncWxCode: syncWxCodeAction,
  syncFirstActiveCityCode: syncFirstActiveCityCodeAction,
  syncLocation: syncLocationAction,
  logOut: userLogoutAction,
};

@connect(
  mapStateToProps,
  mapDispatchToProps
)
class MineLoginPage extends Component<Props, State> {
  public config: Config = {
      navigationBarTitleText: "登录"
  };

  public componentDidMount(): void {
    this.props.logOut();
    if (!this.props.baseUserInfo) Taro.redirectTo({url: "/pages/mine/authinfo"});
  }

  public componentDidShow(): void {
    if (!this.props.code) this.props.syncWxCode();
    this.props.syncWxCode();
  }

  public render() {
      return (
          <View className="page">
            <Image className="pic" src={loginImage} />
            <AtButton circle type="primary" openType="getPhoneNumber" onGetPhoneNumber={this.onLogin.bind(this)}>微信授权登录</AtButton>
          </View>
      )
  }


  /**
   * 登录事件
   * @param e
   */
  private onLogin(e: BaseEventOrig<{encryptedData: string; iv: string}>) {
    // if (!this.props.baseUserInfo)  return Taro.redirectTo({url: "/pages/mine/authinfo"});
    const { session_key, unionid, baseUserInfo, openid } = this.props;
    const { encryptedData, iv } = e.detail;
    if (!encryptedData) return;
    if (session_key && baseUserInfo && openid) {
      const data: any = { unionid, openid, ...baseUserInfo};
      if (this.props.firstActiveCityCode) {
        data.warrantRegion = [this.props.firstActiveCityCode];
      }
      try {
        this.props.login({
          encryptedData,
          iv,
          session_key
        }, data, this.props.location);
      } catch (e) {
        this.props.syncWxCode();
        Taro.showModal({
          title: "提示",
          content: "登录失败，请重试！",
          showCancel: false,
        })
      }
      // Taro.checkSession().then(() => {
      //
      // }).catch(() => {
      //   this.props.syncWxCode();
      //   Taro.showModal({
      //     title: "提示",
      //     content: "登录失败，请重试！",
      //     showCancel: false,
      //   })
      // })

    }
  }

}

export default MineLoginPage

type OwnProps = {};
type State = Readonly<{}>;
type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps & OwnProps;
