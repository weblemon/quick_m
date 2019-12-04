/**
 * @class MineActivePage Page
 * @date 2019/7/29 13:28
 * @author RanYunlong
 */
// eslint-disable-next-line no-unused-vars
import Taro, {Component, Config} from "@tarojs/taro";
import {View, Text, Picker, Image} from "@tarojs/components";
import {IReduxStore} from "../../reducers";
import {AtButton, AtForm, AtInput} from "taro-ui";
import "./active.less";
import {IconEnum} from "../../constants/icon.enum";
import {connect} from "@tarojs/redux";
import {geocoder} from "../../apis/qmap";
import {BaseEventOrig} from "@tarojs/components/types/common";
import {syncUserInfoAction} from "../../actions/SyncUserInfoAction";
import {syncLocationAction} from "../../actions/SyncLocationAction";
import {syncRuleAction} from "../../actions/SyncRuleAction";
import {registrationCodeAction} from "../../actions/RegistrationCodeAction";
import {updateUserInfoAction} from "../../actions/UpdateUserAction";

const mapStateToProps = (store: IReduxStore) => {
  return {
    userInfo: store.app.userInfo,
    location: store.app.location,
    rule: store.app.rule,
    token: store.app.token,
  }
};
const mapDispatchToProps = {
  syncUserInfo: syncUserInfoAction,
  syncRule: syncRuleAction,
  syncLocation: syncLocationAction,
  registrationCode: registrationCodeAction,
  updateUserInfo: updateUserInfoAction,
};

@connect(
  mapStateToProps,
  mapDispatchToProps
)
class MineActivePage extends Component<Props, State> {
  public state: State = {
      code: "",
  };
  public config: Config = {
      navigationBarTitleText: "切换地区"
  };
  public render() {
      const { location } = this.props;
      const { code } = this.state;
      return (
          <View className="page">
            <AtForm>
              <View className='page-section'>
                <Text>地区</Text>
                <View>
                  <Picker mode="region" value={location ? [location.address_component.province, location.address_component.city, location.address_component.district]: []} onChange={this.handleRegionSelect.bind(this)}>
                    <View className='picker'>
                      {location ? [location.address_component.province, location.address_component.city, location.address_component.district].join("-"): "请选择地区"}
                      <Image src={IconEnum.arrowDown} />
                    </View>
                  </Picker>
                </View>
              </View>
              {
                this.props.userInfo && this.props.userInfo.type === 2 && this.props.rule && this.props.rule !== 2 ? (
                  <AtInput title="访问码" name="code" type="number" placeholder="当前地区需要访问码,请输入访问码" value={code} onChange={(code) => this.setState({code: code})}/>
                ): null
              }
            </AtForm>
            {
              this.props.userInfo  && this.props.userInfo.type === 2 &&  this.props.rule && this.props.rule !== 2 ? (
                <View>
                  <View className="button">
                    <AtButton onClick={this.handleActive.bind(this)} type="primary">激活</AtButton>
                  </View>
                  <View className="button">
                    <AtButton
                      type="secondary"
                      openType="contact"
                      showMessageCard
                      sendMessageTitle="开通访问地区权限"
                    >
                      没有访问码 联系客服申请
                    </AtButton>
                  </View>
                </View>
              ): null
            }

          </View>
      )
  }
  private handleActive() {
    if (!this.state.code) {
      return Taro.showModal({
        title: "提示",
        content: "请输入激活码！"
      })
    }
    if (this.props.userInfo && this.props.location) {
      this.props.registrationCode(this.state.code as string, this.props.userInfo, this.props.location);
    }
  }
  /**
   * 地区选择处理
   */
  private async handleRegionSelect(e: BaseEventOrig<{value: string[]}>) {
    const response = await geocoder({
      address: e.detail.value.join("")
    });
    const { status, result } = response;
    if (status === 0 && this.props.userInfo) {
      this.props.syncLocation(result);
      const { address_components } = result;
      this.props.updateUserInfo({
        id: this.props.userInfo.id,
        city: address_components.city,
        province: address_components.province,
        region: address_components.district,
      })
    }
  }
}

export default MineActivePage

type OwnProps = {};
type State = Readonly<{
  code: number |string;
}>;
type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps & OwnProps;
