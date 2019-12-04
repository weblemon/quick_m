/**
 * @class MineMarketList Page
 * @date 2019/9/23 18:20
 * @author RanYunlong
 */
// eslint-disable-next-line no-unused-vars
import Taro, {Component, Config} from "@tarojs/taro";
import {Text, View} from "@tarojs/components";
import {IReduxStore} from "../../reducers";
import EmptyLine from "../../components/empty/EmptyLine";
import List from "../../components/list/List";
import EmptyText from "../../components/empty/EmptyText";
import ListHouseItem from "../../components/list/ListHouseItem";
import {QueryHouse} from "../../apis/house";
import {queryMarketDynamic} from "../../apis/market";
import {connect} from "@tarojs/redux";
import "./market.list.less";
import {diffDate, formatDate, formatHouseDate} from "../../utils/formatDate";

const mapStateToProps = (store: IReduxStore) => {
  return {
    userInfo: store.app.userInfo,
    location: store.app.location
  }
};
const mapDispatchToProps = {};

@connect(
  mapStateToProps,
  mapDispatchToProps
)
class MineMarketList extends Component<Props, State> {
  public config: Config = {
      navigationBarTitleText: "市场动态"
  };
  public state: State = {
    pages: 0,
    list: [],
    total: 0,
    query: {
      current: 0
    }
  };

  public componentDidShow(): void {
    if (this.$router.params.auditStatus === "0") {
      Taro.setNavigationBarTitle({
        title: "最近30天新增房源"
      })
    } else {
      Taro.setNavigationBarTitle({
        title: "最近30天售出房源"
      })
    }
    if (this.props.location) {
      const { ad_info, address_component } = this.props.location;
      this.getList({
        auditStatus: this.$router.params.auditStatus,
        province: address_component.province,
        city: address_component.city,
        area: address_component.district,
        areaCode: ad_info.adcode,
        // startAddTime: "",
        // endAddTime: "",
      });
    } else {
      Taro.showModal({
        title: "提示",
        content: "当前未获取到定位信息，请开启定位权限!",
      }).then(() => {
        Taro.navigateBack();
      })
    }

  }
  public onPullDownRefresh() {
    this.getList({
      ...this.state.query,
      current: 1,
      size: 10,
    }, true)
  }
  public onReachBottom() {
    this.setState({
      loading: true
    });
    this.getList({
      ...this.state.query,
      current: this.state.query.current + 1,
    })
  }
  public render() {
      const title = " ";
      const {total, loading, list} = this.state;
      return (
        <View className="page">
          <View className="pane">
            <View className="header">
              <View className="title">
                {
                  title.length === 0 ? (
                    <EmptyLine height={30} width={300} />
                  ) : (
                    <Text>{title}</Text>
                  )
                }
              </View>
              <View className="value">
                {total + "套房源" || "暂无数据"}
              </View>
            </View>
          </View>
          <List loading={loading}>
            {list.length === 0 ? (
              <EmptyText text="暂无数据" onClick={Taro.navigateBack}>
                返回前页
              </EmptyText>
            ): null}
            {
              this.$router.params.auditStatus != 0 ? (
                list.map(info => (
                  <ListHouseItem
                    extraTime={`销售周期${diffDate(info.rawAddTime, info.rawUpdateTime)}天，${formatHouseDate(info.rawUpdateTime)}卖出`}
                    onSelect={this.jumpHouseDetailPage.bind(this)}
                    houseInfo={info}
                    key={info.id}
                  />
                ))
                ): (
                list.map(info => (
                  <ListHouseItem
                    extraTime={ `发布时间：${formatDate(info.rawAddTime)} 已售${diffDate(info.rawAddTime, info.rawUpdateTime)}天`}
                    onSelect={this.jumpHouseDetailPage.bind(this)}
                    houseInfo={info}
                    key={info.id}
                  />
                ))
              )

            }
          </List>
        </View>
      )
  }
  /**
   * 跳转至详情页
   * @param info
   */
  private async jumpHouseDetailPage(info: QueryHouse.HouseInfo) {
    return Taro.navigateTo({
      url: `/pages/house/detail?id=${info.id}`
    })
  }
  private async getList(params?: Partial<QueryHouse.Params>, clear?: boolean){
    if (!this.props.userInfo) return;
    const q = params || this.state.query;
    if (q.current && q.current > 1) {
      this.setState({
        loading: true
      })
    }
    let response = await queryMarketDynamic(q);
    const {success, data} = response.data;
    if (success && data != null) {
      const { current, records, pages, size, total } = data;
      let list = this.state.list.filter(item => item);
      if (clear) {
        list = [];
      }
      if (records.length > 0) {
        data.records.forEach(record => {
          const find =  list.find(item => item.id === record.id);
          if (!find) {
            list.push(record)
          } else {
            Object.keys(find).forEach(key => {
              find[key] = record[key];
            })
          }
        });
        this.setState({
          list,
          pages,
          total,
          query: {
            ...params || this.state.query,
            current,
            size,
          },
          loading: false,
        })
      } else {
        this.setState({
          pages,
          total,
          list,
          query: {
            ...this.state.query,
            current: this.state.query.current,
            size: this.state.query.size,
          },
          loading: false,
        })
      }
      Taro.stopPullDownRefresh();
    }
    this.setState({loading: false})
  }
}

export default MineMarketList

type OwnProps = {};
type State = Readonly<{
  query: Partial<QueryHouse.Params> & { current: number};
  total: number;
  // 总页码
  pages: number;
  list: QueryHouse.HouseInfo[];
  loading?: boolean;
}>;
type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps & OwnProps;
