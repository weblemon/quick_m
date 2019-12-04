/**
 * @class MineQrcodePage Page
 * @date 2019/7/26 14:36
 * @author RanYunlong
 */
// eslint-disable-next-line no-unused-vars
import Taro, {Component, Config} from "@tarojs/taro";
import {View} from "@tarojs/components";
import "./qrcode.less";
import {IReduxStore} from "../../reducers";
import {connect} from "@tarojs/redux";
import List from "../../components/list/List";
import {queryPageCode, QueryPageCode} from "../../apis/qrcode";
import ListItem from "../../components/list/ListItem";
import "./qrcode.list.less";
import EmptyText from "../../components/empty/EmptyText";
import qs from "qs";

const mapStateToProps = (store: IReduxStore) => {
  return {
    userInfo: store.app.userInfo,
    baseUserInfo: store.app.baseUserInfo,
  }
};
const mapDispatchToProps = {};

@connect(
  mapStateToProps,
  mapDispatchToProps
)
class MineQrcodeListPage extends Component<Props, State> {
  public config: Config = {
      navigationBarTitleText: "小程序码"
  };

  public state: State = {
    query: {
      current: 1,
      size: 20,
      type: 1,
      order: "desc",
    },
    list: [],
  };
  private isFirst: boolean = true;
  public onPullDownRefresh(): void {
    this.getList({
      ...this.state.query,
      current: 1,
    }, true)
  }

  public onReachBottom(): void {
    this.setState({
      loading: true
    });
    this.getList({
      ...this.state.query,
      current: this.state.query.current + 1,
    })
  }

  public componentDidShow() {
    if (!this.props.userInfo) return Taro.navigateBack();
    this.getList();
  }

  public render() {
    const { loading, list } = this.state;
    if (this.isFirst) {
      return (
        <View className="page">
          <List loading={loading}>
            {
              [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, ]
                .map((item, index) => (
                <ListItem
                  title={item || ""}
                  key="index"
                  hasBorder={list.length - 1 !== index}
                  hasArrow={true}
                />
              ))
            }
          </List>
        </View>
      )
    }
    return (
      <View className="page">
        <List loading={loading}>
          <EmptyText onClick={Taro.navigateBack} visible={list.length === 0 && !this.isFirst} text="暂无地区权限，请后台管理员开通！">
            点击返回
          </EmptyText>
          {
            list.map((item, index) => (
              <ListItem
                title={item.districtName.split(",").join("/")}
                key={item.id}
                hasBorder={list.length - 1 !== index}
                hasArrow={true}
                onClick={() => Taro.navigateTo({
                  url: `/pages/mine/qrcode?${qs.stringify(item)}`
                })}
              />
            ))
          }
        </List>
      </View>
    )
  }

  public async getList(params?: QueryPageCode.Params, clear?: boolean) {
    if (this.isFirst) {
      this.isFirst = false;
    }
    const res = await queryPageCode(params || this.state.query);
    if (res.data.success) {
      Taro.stopPullDownRefresh();
      const { size, records, current } = res.data.data;
      let { list = [] } = this.state;
      if (clear) {
        list = [];
      }
      if (records.length > 0) {
        records.forEach(record => {
          if (!list.find(item => item.id === record.id)) {
            list.push(record)
          }
        });
        this.setState({
          list,
          loading: false,
          query: {
            ...this.state.query,
            ...params,
            size,
            current,
          }
        })
      } else {
        this.setState({
          loading: false,
          list
        })
      }
    }
  }
}

export default MineQrcodeListPage

type OwnProps = {};
type State = Readonly<{
  loading?: boolean;
  query: QueryPageCode.Params;
  list: QueryPageCode.Info[];
}>;
type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps & OwnProps;
