/**
 * @class MineAuthUserInfoPage Page
 * @date 2019/7/13 14:46
 * @author RanYunlong
 */
// eslint-disable-next-line no-unused-vars
import Taro, {Component, Config, getUserInfo} from "@tarojs/taro";
import {Button, Image, View} from "@tarojs/components";
import "./authinfo.less";
import loginImage from "../../assets/images/login.jpg";
import {IReduxStore} from "../../reducers";
import {connect} from "@tarojs/redux";
import {BaseEventOrig} from "@tarojs/components/types/common";
import {IconEnum} from "../../constants/icon.enum";
import {syncWxUserInfoAction} from "../../actions/SyncWxUserInfoAction";

const mapStateToProps = (store: IReduxStore) => {
  return {
    userInfo: store.app.baseUserInfo,
  }
};
const mapDispatchToProps = {
  syncUserInfo: syncWxUserInfoAction
};

@connect(
  mapStateToProps,
  mapDispatchToProps
)
class MineAuthUserInfoPage extends Component<Props, State> {
  public config: Config = {
      navigationBarTitleText: "授权用户信息",
      enablePullDownRefresh: false,
  };

  public render() {
    return (
      <View className="page">
        <Image className="pic" src={loginImage} />
        <Button type="primary" openType="getUserInfo" onGetUserInfo={this.onGetUserInfo.bind(this)}>授权用户信息</Button>
      </View>
    )
  }

  private onGetUserInfo(e: BaseEventOrig<{userInfo?: getUserInfo.PromisedPropUserInfo}>) {
    if (e.detail.userInfo) {
      this.props.syncUserInfo(e.detail.userInfo);
      Taro.redirectTo({url: "/pages/mine/login"});
    } else {
      Taro.showToast({
        image: IconEnum.error,
        title: "授权失败"
      })
    }
  }
}

export default MineAuthUserInfoPage

type OwnProps = {};
type State = Readonly<{}>;
type Props = OwnProps & ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;
