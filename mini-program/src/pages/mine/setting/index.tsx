/**
 * @class MineSettingPage Page
 * @date 2019/7/26 16:03
 * @author RanYunlong
 */
// eslint-disable-next-line no-unused-vars
import Taro, {Component, Config} from "@tarojs/taro";
import {Input, OpenData, Text, View, Form, RadioGroup, Label, Radio, Button} from "@tarojs/components";
// import {AtForm, AtInput, AtRadio, AtButton} from "taro-ui";
import "./index.less";
import {IReduxStore} from "../../../reducers";
import {connect} from "@tarojs/redux";
import {AtButton} from "taro-ui";
import {BaseEventOrig} from "@tarojs/components/types/common";
import {getPhoneNumber} from "../../../apis/getPhoneNumber";
import {QueryUser} from "../../../apis/user";
import {syncUserInfoAction} from "../../../actions/SyncUserInfoAction";
import {syncWxCodeAction} from "../../../actions/SyncWxCodeAction";
import {updateUserInfoAction} from "../../../actions/UpdateUserAction";

const mapStateToProps = (state: IReduxStore) => {
  return {
    userInfo: state.app.userInfo,
    code: state.app.code,
    session_key: state.app.session_key,
    location: state.app.location,
    baseUserInfo: state.app.baseUserInfo
  }
};
const mapDispatchToProps = {
  syncUserInfo: syncUserInfoAction,
  syncWxCode: syncWxCodeAction,
  updateUser: updateUserInfoAction,
};

@connect(
  mapStateToProps,
  mapDispatchToProps
)
class MineSettingPage extends Component<Props, State> {
  public config: Config = {
    navigationBarTitleText: "设置",
    enablePullDownRefresh: false,
  };

  public state: State = {
    type: 1,
    realName: "",
    sparePhone: "",
    phone: "",
  };

  public componentDidShow(): void {
    const { userInfo } = this.props;
    if (userInfo) {
      this.setState({
        type: userInfo.type ? userInfo.type : 1,
        realName: userInfo.realName,
        sparePhone: userInfo.sparePhone ? userInfo.sparePhone : "",
        phone: userInfo.phone ? userInfo.phone: ""
      })
    }
  }

  public render() {
    const { type, realName, sparePhone, phone } = this.state;
    return (
      <View className="page">
        <View className="label">
          <Text className='title'>完善资料</Text>
          <Text className='desc'>为了更好的了解您</Text>
        </View>
        <View className="user-pic" >
          <OpenData type="userAvatarUrl" />
        </View>
        <Form>
          <Input value={realName ? realName : ""} onInput={this.handleInput.bind(this)} placeholder="您的称呼" />
          {
            type != 3 ? (
              <RadioGroup
                onChange={this.handleType.bind(this)}
              >
                <Label for="sir">房东</Label>
                <Radio disabled={(this.props.userInfo as any).type != 0} checked={type == 1} id="sir" value="1" color="#f53b16" />
                <Label for="ld">中介</Label>
                <Radio disabled={(this.props.userInfo as any).type != 0} checked={type == 2} id="ld" value="2" color="#f53b16" />
              </RadioGroup>
            ): null
          }
          <Button openType="getPhoneNumber" onGetPhoneNumber={this.handleChangePhone.bind(this)}>
            {phone.toString() || "常用手机"}
          </Button>
          <Input type="number" onInput={this.handleSparePhone.bind(this)} name="sparePhone" placeholder="备用手机" maxLength={11}  value={sparePhone.toString() || ""} />
        </Form>
        <Text onClick={()=> Taro.navigateTo({
          url: "/pages/mine/readme"
        })} className="readme">阅读免责声明</Text>
        <View>
          <AtButton onClick={this.handleUpdate.bind(this)} size="small" customStyle={{width: Taro.pxTransform(200)}} type="primary">完成</AtButton>
        </View>
      </View>
    )
  }

  private async handleUpdate() {
    const { userInfo } = this.props;
    const { type, phone, sparePhone, realName } = this.state;
    const data: Partial<QueryUser.Info> = {
      ...this.props.baseUserInfo,
      type,
      phone,
      sparePhone,
      realName
    } as any;
    if (!this.state.realName) {
      return  Taro.showModal({
        title: "提示",
        content: "请输入您的称呼！"
      })
    }
    if (!userInfo) {
      if (!this.$router.params.type) {
        return Taro.navigateBack()
      } else {
        return Taro.switchTab({
          url: "/pages/home/index"
        })
      }
    }
    this.props.updateUser({
      id: userInfo.id,
      ...data
    });
    if (this.$router.params.type) {
      return Taro.switchTab({
        url: "/pages/home/index"
      })
    }
    return Taro.navigateBack();
  }

  private handleInput(e: BaseEventOrig<{value: string}>) {
    this.setState({
      realName: e.detail.value
    })
  }

  private handleType(e:BaseEventOrig<{value: string}>) {
    this.setState({
      type: Number(e.detail.value) as any
    })
  }

  private handleSparePhone(e:BaseEventOrig<{value: string}>) {
    this.setState({
      sparePhone: e.detail.value
    })
  }

  private async handleChangePhone(data: BaseEventOrig<{
    /** 包括敏感数据在内的完整用户信息的加密数据 */
    encryptedData: string,
    /** 加密算法的初始向量 */
    iv: string
  }>) {
    const { encryptedData, iv } = data.detail;
    if (!encryptedData) return;
    const { session_key } = this.props;
    if (session_key) {
      Taro.checkSession().then(() => {
        getPhoneNumber({
          encryptedData,
          iv,
          session_key
        }).then(res => {
          if (res.data.success) {
            this.setState({
              phone: res.data.data
            })
          }
        })
      }).catch(() => {
        this.props.syncWxCode();
        Taro.showModal({
          title: "提示",
          content: "授权手机号码失败，请重试",
          showCancel: false,
        })
      })
    }
  }
}

export default MineSettingPage

type OwnProps = {};
type State = Readonly<{
  realName: string | null;
  type: number;
  phone: number | string;
  sparePhone: number | string;
}>;
type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps & OwnProps;
