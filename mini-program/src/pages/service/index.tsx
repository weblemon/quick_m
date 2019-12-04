/**
 * @class ServiceIndexPage Page
 * @date 2019/6/28 3:59
 * @author RanYunlong
 */
// eslint-disable-next-line no-unused-vars
import Taro, {Component, Config} from "@tarojs/taro";
import {Button, View} from "@tarojs/components";
import {IReduxStore} from "../../reducers";
import {connect} from "@tarojs/redux";
import EmptyData from "../../components/empty/EmptyData";
import "./index.less";
import {getServiceList, QueryService} from "../../apis/service";
import List from "../../components/list/List";
import ListServiceItem from "../../components/list/ListServiceItem";

const mapStateToProps = (store: IReduxStore) => {
  return {
    userInfo: store.app.userInfo,
    baseUserInfo: store.app.baseUserInfo,
  }
};
const mapDispatchToProps = {
};

@connect(
  mapStateToProps,
  mapDispatchToProps
)
class ServiceIndexPage extends Component<Props, State> {
  public config: Config = {
    navigationBarTitleText: "服务",
    enablePullDownRefresh: false,
  };
  public readonly state: State = {
    query: {
      size: 10,
      state: 0,
      order: "asc",
      current: 1,
    },
    list: [],
  };
  public componentDidShow(): void {
    if (this.props.userInfo) {
      this.getList();
    }
  }
  public render() {
    const { userInfo} = this.props;
    const { list } = this.state;
    if (userInfo) {
      return  (
        <View className="page">
          <List>
            {
              list.map((info, index) => (
                <ListServiceItem info={info} index={index} key={info.id} />
              ))
            }
          </List>
        </View>
      )
    }
    return (
      <View className="page center empty">
        <EmptyData value="服务需要登陆后才能查看哦">
          <Button size="mini" onClick={this.jumpLogin.bind(this)}>去登录</Button>
        </EmptyData>
      </View>
    )
  }
  private jumpLogin() {
    Taro.navigateTo({
      url: "/pages/mine/login"
    })
  }
  private async getList() {
    const { query } = this.state;
    getServiceList(query).then(res => {
      const { success, data } = res.data;
      if (success) {
        const { records } = data;
        this.setState({
          list: records
        })
      }
    })
  }
}

export default ServiceIndexPage

interface OwnProps{

}
type State = Readonly<{
  query: QueryService.Params;
  list: QueryService.Info[];
}>;
type Props =  ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps & OwnProps;
