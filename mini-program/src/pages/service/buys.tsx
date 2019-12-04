/**
 * @class ServiceBuysPage Page
 * @date 2019/7/28 0:47
 * @author RanYunlong
 */
// eslint-disable-next-line no-unused-vars
import Taro, {Component, Config} from "@tarojs/taro";
import {View, Text, Button} from "@tarojs/components";
import "./buys.less";
import {IReduxStore} from "../../reducers";
import {connect} from "@tarojs/redux";
import {queryPageUrgentNeed, QueryUser} from "../../apis/user";
import List from "../../components/list/List";
import ListBuyItem from "../../components/list/ListBuyItem";
import Search from "../../components/search/Search";
import EmptyText from "../../components/empty/EmptyText";

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
class ServiceBuysPage extends Component<Props, State> {
  public state: State = {
    query: {
      current: 1,
      size: 10,
      order: "asc",
    },
    list: [{id: 0}, {id: 1}, {id: 2}, {id: 3}, {id: 4}, {id: 5}],
  };
  public config: Config = {
    navigationBarTitleText: "全区接房需求"
  };
  public isFirst: boolean = true;

  public componentDidShow(): void {
    if (!this.props.userInfo) return;
    const {location} = this.props;
    if (location) {
      const {district, province, city} = location.address_component;
      this.getList({
        ...this.state.query,
        badlyRegion: [province, city, district].join(","),
      })
    }
  }

  public onPullDownRefresh(): void {
    this.setState({
      list: [],
    }, () => this.getList({
      ...this.state.query,
      current: 1,
    }))
  }

  public onReachBottom(): void {
    this.setState({
      loading: true
    });
    this.getList({
      ...this.state.query,
      current: this.state.query.current + 1
    })
  }

  public render() {
    const {loading, list} = this.state;
    const {userInfo} = this.props;
    return (
      <View className="page">
        <View className="i-search">
          <View className="head">
            <Text/>
            {
              userInfo && userInfo.type === 1 ? (
                <Button size="mini" type="primary" onClick={() => Taro.navigateTo({url: "/pages/mine/buy"})}>我要接房</Button>
              ): null
            }
          </View>
          <Search value={this.state.query.search} onClear={this.handleSearchClear.bind(this)}
                  onInput={v => this.setState({query: {...this.state.query, search: v}})} placeholder="搜索需求"
                  onConfirm={this.handleSearch.bind(this)}/>
        </View>
        <List loading={loading}>
          {
            list.map((item, index) => (
              <ListBuyItem info={item} key={item.id} hasBorder={index !== list.length - 1}/>
            ))
          }
          <EmptyText visible={list.length === 0} text="暂无接房需求" onClick={Taro.navigateBack}>点击返回</EmptyText>
        </List>
      </View>
    )
  }

  public async getList(params?: QueryUser.Need) {
    const res = await queryPageUrgentNeed(params || this.state.query);
    if (res.data.success) {
      const {records} = res.data.data;
      let {list} = this.state;
      if (this.isFirst) {
        list = [];
        this.isFirst = false;
      }
      if (records.length > 0) {
        records.forEach(record => {
          const find = list.find(item => item.id === record.id);
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
          loading: false,
          query: {
            ...this.state.query,
            ...params
          }
        })
      } else {
        this.setState({
          loading: false,
          list
        })
      }

    }
    Taro.stopPullDownRefresh();
  }

  private async handleSearch(e) {
    if (e) {
      this.getList({
        ...this.state.query,
        search: e as string
      })
    } else {
      delete this.state.query.search;
      this.getList({
        ...this.state.query,
        search: "",
      })
    }
  }

  private async handleSearchClear() {
    this.setState({
      query: {
        ...this.state.query,
        search: ""
      }
    }, () => {
      this.getList(this.state.query)
    })
  }
}

export default ServiceBuysPage

type OwnProps = {};
type State = Readonly<{
  query: QueryUser.Need,
  loading?: boolean;
  list: any[],
}>;
type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps & OwnProps;
