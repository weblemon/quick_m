/**
 * @class MineBuyPage Page
 * @date 2019/7/26 23:50
 * @author RanYunlong
 */
// eslint-disable-next-line no-unused-vars
import Taro, {Component, Config} from "@tarojs/taro";
import {Form, Switch, Textarea, View} from "@tarojs/components";
import "./buy.less";
import FormItem from "../../components/form/FormItem";
import {connect} from "@tarojs/redux";
import {IReduxStore} from "../../reducers";
import {BaseEventOrig} from "@tarojs/components/types/common";
import {updateUser} from "../../apis/user";
import {syncUserInfoAction} from "../../actions/SyncUserInfoAction";

const mapStateToProps = (store: IReduxStore) => {
  return {
    userInfo: store.app.userInfo,
    location: store.app.location
  }
};
const mapDispatchToProps = {
  syncUserInfo: syncUserInfoAction
};

@connect(
  mapStateToProps,
  mapDispatchToProps
)
class MineBuyPage extends Component<Props, State> {
  public config: Config = {
    navigationBarTitleText: "我要接房",
    enablePullDownRefresh: false,
  };

  public state: State = {
    locations: [],
    status: 0,
    description: "",
  };

  public componentDidShow(): void {
    const { location, userInfo } = this.props;
    if (location) {
      const { province, city, district } = location.address_component;
      if (userInfo) {
        const { isBadly, badlyRegion, detailed = ""} = userInfo;
        return this.setState({
          locations: badlyRegion ? badlyRegion.split(","): [province, city, district],
          status: isBadly,
          description: detailed ? detailed : "",
        })
      }
      this.setState({
        locations: [province, city, district]
      })
    }
  }

  public render() {
    const {  status, description } = this.state;
    return (
      <View className="page">
        <Form>
          <FormItem
            label="我要接房"
          >
            <Switch checked={status === 1} onChange={(e: BaseEventOrig<{value: boolean}>) => this.setState({ status: e.detail.value ? 1 : 0 })} name="isBadly" color="#f53b16" />
          </FormItem>

          {/*<FormItem*/}
          {/*  label="我要接房"*/}
          {/*>*/}
          {/*  <Picker name="badlyRegion" mode="region" value={locations} onChange={e => this.setState({locations: e.detail.value})}>*/}
          {/*   <View className="data">*/}
          {/*     {locations.length > 0 ? locations.join("-"): "选择接房地区"}*/}
          {/*     <Image src={require("../../assets/images/arrow-down.png")} />*/}
          {/*   </View>*/}
          {/*  </Picker>*/}
          {/*</FormItem>*/}

          <FormItem
            label="详细需求"
            mode="column"
          >
            <Textarea placeholder="请输入需求描述" onInput={e => this.setState({description: e.detail.value})} name="detailed" maxlength={200} style={{width: "100%", backgroundColor: "#f7f7f7", color: "#333", padding: Taro.pxTransform(20), margin: [Taro.pxTransform(20), Taro.pxTransform(0)].join(" ")}} value={description} />
          </FormItem>
        </Form>
      </View>
    )
  }

  public componentWillUnmount(): void {
    const { userInfo } = this.props;
    if (userInfo) {
      updateUser({
        id: userInfo.id,
        isBadly: this.state.status,
        detailed: this.state.description,
        badlyRegion: this.state.locations.join(",")
      }).then(res => {
        if (res.data.success) {
          this.props.syncUserInfo({
            ...userInfo,
            isBadly: this.state.status,
            detailed: this.state.description,
            badlyRegion: this.state.locations.join(",")
          })
        }
      })
    }

  }
}

export default MineBuyPage

type OwnProps = {};
type State = Readonly<{
  locations: string[];
  status: 0 | 1;
  description: string;
}>;
type Props =ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps  & OwnProps;
//
// interface IBuyForm {
//   // 用户id
//   userId: number;
//   // 状态 0 关闭 1开启
//   status: 0 | 1;
//   // 描述 255
//   description: string;
//   // 接房地区 ["重庆市","重庆市","永川区"]
//   region: string[];
// }
//
// interface Info {
//   // 需求id
//   id: number;
//   // 用户详情
//   userInfo: QueryUser.Info;
//   // 状态 0 关闭 1开启
//   status:  0 | 1;
//   // 描述 255
//   description: string;
//   // 接房地区 ["重庆市","重庆市","永川区"]
//   region: string[];
// }
