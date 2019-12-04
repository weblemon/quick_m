/**
 * @class MineIndexPage Page
 * @date 2019/6/28 3:58
 * @author RanYunlong
 */
// eslint-disable-next-line no-unused-vars
import Taro, {Component, Config} from "@tarojs/taro";
import {View, Image, Text, Button} from "@tarojs/components";
import {connect} from "@tarojs/redux";
import {IReduxStore} from "../../reducers";
import List from "../../components/list/List";
import ListItem from "../../components/list/ListItem";
import {UserTypeEnum} from "../../enum/user.type.enum";
import "../../assets/fonts/iconfont.css";
import "./index.less";
import {share} from "../../utils/share";
import {syncLocationAction} from "../../actions/SyncLocationAction";
import {userLogoutAction} from "../../actions/UserLoginAction";
import {IconEnum} from "../../constants/icon.enum";

const mapStateToProps = (store: IReduxStore) => {
  return {
    userInfo: store.app.userInfo,
    baseUserInfo: store.app.baseUserInfo,
  }
};
const mapDispatchToProps = {
  logout: userLogoutAction,
  syncLoction: syncLocationAction,
};

@connect(
  mapStateToProps,
  mapDispatchToProps
)
class MineIndexPage extends Component<Props, State> {
  public config: Config = {
      navigationBarTitleText: "我的",
      enablePullDownRefresh: false
  };
  public render() {
      const { userInfo } = this.props;
      if (userInfo) {
        return (
          <View className="page">
            <View className="user-cell">
              <View className="top">
                <Image className="avatar" src={userInfo.avatarUrl || IconEnum.avatar}/>
                <View className="info">
                  <Text className="title">{userInfo.nickName}</Text>
                  <Text className="desc">{UserTypeEnum[userInfo.type || 0]} {userInfo.realName} {userInfo.phone ? userInfo.phone.substr(0, 3) + "****" + userInfo.phone.substr(7, 4): ""}</Text>
                </View>
                <View>
                  <Button type="default" size="mini" onClick={this.handleGoLoginPage.bind(this)}>修改</Button>
                </View>
              </View>
            </View>
            <List>
              {
                userInfo.type === 2 ? (
                  <ListItem
                    desc="开通地区"
                    onClick={() => Taro.navigateTo({url: "/pages/mine/active"})}
                    hasArrow={true}
                    hasBorder={true}
                  />
                ): null
              }
              <ListItem
                desc="授权设置"
                openType="openSetting"
                hasArrow={true}
                hasBorder={true}
              />
              <ListItem
                desc="联系客服"
                openType="contact"
                hasArrow={true}
                hasBorder={true}
              />
              <ListItem
                desc="意见反馈"
                openType="feedback"
                hasArrow={true}
                hasBorder={true}
              />
              <ListItem
                desc="退出登录"
                hasArrow={true}
                hasBorder={false}
                onClick={this.props.logout}
              />
            </List>
          </View>
        )
      }
      return (
          <View className="page">
            <View className="user-cell" onClick={this.handleGoLoginPage.bind(this)}>
              <View className="top">
                <Image className="avatar" src={IconEnum.avatar}/>
                <View className="info">
                  <Text className="title">点此登录</Text>
                  <Text className="desc">登录更精彩</Text>
                </View>
              </View>
            </View>

            <List>
              <ListItem
                desc="电话号码"
                hasArrow={true}
                hasBorder={true}
                onClick={this.handleGoLoginPage.bind(this)}
              />
              <ListItem
                desc="当前角色"
                hasArrow={true}
                hasBorder={true}
                onClick={this.handleGoLoginPage.bind(this)}
              />
              <ListItem
                desc="我的钱包"
                onClick={this.handleGoLoginPage.bind(this)}
                hasArrow={true}
                hasBorder={false}
              />
            </List>

            <List>
              <ListItem
                desc="授权设置"
                openType="openSetting"
                hasArrow={true}
                hasBorder={true}
              />
              <ListItem
                desc="联系客服"
                openType="contact"
                hasArrow={true}
                hasBorder={true}
              />
              <ListItem
                desc="意见反馈"
                openType="feedback"
                hasArrow={true}
                hasBorder={false}
              />
            </List>
          </View>
      )
  }
  public onShareAppMessage(): Taro.ShareAppMessageReturn {
    if (!this.props.userInfo) return {};
    return share("分享名片", `/pages/user/card?id=${this.props.userInfo.id}`)
  }
  /**
   * 跳转至登录页面
   */
  private handleGoLoginPage() {
    if (this.props.userInfo) {
      return Taro.navigateTo({
        url: "./setting/index"
      })
    }
    return Taro.navigateTo({
      url: "./login"
    });
  }
}
export default MineIndexPage

type OwnProps = {};
type State = Readonly<{}>;
type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps & OwnProps;

