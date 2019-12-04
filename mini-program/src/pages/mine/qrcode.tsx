/**
 * @class MineQrcodePage Page
 * @date 2019/7/26 14:36
 * @author RanYunlong
 */
// eslint-disable-next-line no-unused-vars
import Taro, {Component, Config} from "@tarojs/taro";
import {View, Image, Text} from "@tarojs/components";
import "./qrcode.less";
import {IReduxStore} from "../../reducers";
import {connect} from "@tarojs/redux";
import {IconEnum} from "../../constants/icon.enum";
import {AtButton} from "taro-ui";
import {createMiniCode, createRegistration, QueryPageCode} from "../../apis/qrcode";
import qs from "qs";
import {formatDate} from "../../utils/formatDate";
import {syncUserInfoAction} from "../../actions/SyncUserInfoAction";

const mapStateToProps = (store: IReduxStore) => {
  return {
    userInfo: store.app.userInfo,
    baseUserInfo: store.app.baseUserInfo,
  }
};
const mapDispatchToProps = {
  syncUserInfo: syncUserInfoAction
};

@connect(
  mapStateToProps,
  mapDispatchToProps
)
class MineQrcodePage extends Component<Props, State> {
  public config: Config = {
      navigationBarTitleText: "小程序码"
  };

  public onShareAppMessage(): Taro.ShareAppMessageReturn {
    return {
      title: "加入快马好房",
      path: `/pages/home/index`,
    }
  }

  public componentWillMount(): void {
    if (!this.$router.params.url && this.props.userInfo && !this.props.userInfo.qrCode) {
      createMiniCode({
        userId: this.props.userInfo.id,
        scene: `recommendId=${this.props.userInfo.id}`,
        page: process.env.NODE_ENV === "development" ? "pages/index/index": "pages/home/index"
      }).then(res => {
        if (res.data.success) {
          this.props.syncUserInfo({
            ...this.props.userInfo as any,
            qrCode: res.data.data
          })
        }
      })
    }
  }

  public render() {
    const { userInfo } = this.props;
    if (userInfo) {
      return (
        <View className="page">
          <Image mode="widthFix" src={this.$router.params.url || userInfo.qrCode || IconEnum.logo} />
          {
            this.$router.params.qrCodeUrl ? (
             <View>
               <Text className="registrationCode">访问码 {this.$router.params.registrationCode}</Text>
               {
                 this.$router.params.rawUpdateTime ? (
                   <Text className="desc">上次更新时间 {formatDate(this.$router.params.rawUpdateTime)}</Text>
                 ): null
               }
             </View>
            ): null
          }

          {
            this.$router.params.qrCodeUrl ? (
              <View className="btn-group">
                <AtButton type="primary" circle={true} onClick={this.refreshCode.bind(this)}>刷新二维码</AtButton>
                <AtButton circle onClick={() => Taro.setClipboardData({data: this.$router.params.registrationCode})} type="secondary">复制访问码</AtButton>
              </View>
            ): (
              <View className="btn-group">
                <AtButton openType="share" circle={true}  type="primary">分享二维码</AtButton>
              </View>
            )
          }

        </View>
      )
    }
    return null
  }

  private refreshCode() {
    const item = this.$router.params as QueryPageCode.Info;
    Taro.showLoading({
      title: "生成中，请稍后"
    });
    createRegistration({
      page: item.page,
      id: item.id,
      userId: item.userId,
      districtId: item.districtId,
      districtName: item.districtName,
      scene: `registration=${item.districtId}`
    }).then(res => {
      if (res.data.success) {
        Taro.redirectTo({
          url: `/pages/mine/qrcode?${qs.stringify(res.data.data)}`
        })
      }
      Taro.hideLoading();
    })
  }
}

export default MineQrcodePage

type OwnProps = {};
type State = Readonly<{}>;
type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps & OwnProps;
