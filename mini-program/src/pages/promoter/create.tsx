/**
 * @class PromoterCreatePage Page
 * @date 2019/7/28 18:22
 * @author RanYunlong
 */
// eslint-disable-next-line no-unused-vars
import Taro, {Component, Config} from "@tarojs/taro";
import {Form, Input, Picker, View} from "@tarojs/components";
import {IReduxStore} from "../../reducers";
import ListCell from "../../components/list/ListCell";
import "./create.less";
import {AtButton} from "taro-ui";
import {UserTypeEnum} from "../../enum/user.type.enum";
import {saveUser, updateUser} from "../../apis/user";

const mapStateToProps = (store: IReduxStore) => {
  return {
    userInfo: store.app.userInfo,
  }
};
const mapDispatchToProps = {};
class PromoterCreatePage extends Component<Props, State> {
  public config: Config = {
    navigationBarTitleText: "创建客户",
    enablePullDownRefresh: false
  };

  public state: State = {
      type: 0,
      gender: 0,
      phone: "",
      realName: "",
  };

  componentWillMount(): void {
    if (this.$router.params.title) {
      Taro.setNavigationBarTitle({
        title: this.$router.params.title
      })
    }
  }

  public componentDidShow(): void {
    if (this.$router.params.id) {
      const { type, gender, phone, realName } = this.$router.params;
      this.setState({
        type,
        gender,
        phone,
        realName
      })
    }
  }

  public render() {
      const { type, gender, realName, phone } = this.state;
      return (
          <View className="page">
            <Form onSubmit={this.handleSubmit.bind(this)}>
              <ListCell
                label="称呼"
                hasBorder
                hasArrow
              >
                <Input value={realName} onInput={e => this.setState({realName: e.detail.value})} name="realName" maxLength={10} placeholder="请输入称呼" />
              </ListCell>
              <ListCell
                label="手机"
                hasBorder
                hasArrow
              >
                <Input value={phone} type="number" onInput={e => this.setState({phone: e.detail.value})} name="phone" maxLength={11} placeholder="请输入手机"/>
              </ListCell>
              <ListCell
                label="性别"
                hasBorder
                hasArrow
              >
                <Picker mode="selector" value={gender} onChange={e => this.setState({gender: Number(e.detail.value)})} range={["女", "男"]} >
                  {gender == 0 ? "女": "男"}
                </Picker>
              </ListCell>
              <ListCell
                label="角色"
                hasArrow
              >
                <Picker name="type" mode="selector" value={type} onChange={e => this.setState({type: Number(e.detail.value)})} range={["未知","房东", "中介"]} >
                  {UserTypeEnum[type]}
                </Picker>
              </ListCell>
              <View style={{padding: Taro.pxTransform(20)}}>
                <AtButton type="primary" formType="submit">提交</AtButton>
              </View>
            </Form>
          </View>
      )
  }
  private handleSubmit() {
    const { gender, phone, type, realName } = this.state;
    if (!realName) {
      return Taro.showModal({
        title:"提示",
        content: "请输入称呼"
      })
    }

    if (!phone || phone.length !== 11) {
      return Taro.showModal({
        title:"提示",
        content: "请输入正确的手机号码"
      })
    }

    if (this.$router.params.id) {
      return updateUser({
        id: this.$router.params.id,
        gender,
        phone,
        type,
        realName
      }).then(res => {
        if (res.data.success) {
          Taro.navigateBack();
        }
      })
    }

    saveUser({
      gender, phone, type, realName
    }).then(res => {
      if (res.data.success) {
        Taro.navigateBack();
      }
    })

  }
}

export default PromoterCreatePage

type OwnProps = {};
type State = Readonly<{
  type: number;
  gender: number;
  phone: string;
  realName: string;
}>;
type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps & OwnProps;
