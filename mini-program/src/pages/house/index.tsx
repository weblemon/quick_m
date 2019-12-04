/**
 * 首页
 * @class HomeIndexPage Page
 * @date 2019/6/28 4:00
 * @author RanYunlong
 */
// eslint-disable-next-line no-unused-vars
import Taro, {Component, Config} from "@tarojs/taro";
import {View} from "@tarojs/components";
import List from "../../components/list/List";
import ListHouseItem from "../../components/list/ListHouseItem";
import {IReduxStore} from "../../reducers";
import {connect} from "@tarojs/redux";
import {QueryHouse, queryPageHouses} from "../../apis/house";
import HouseSearch from "../../components/search/HouseSearch";
import EmptyQuery from "../../components/empty/EmptyQuery";
import "./index.less";
import EmptyText from "../../components/empty/EmptyText";
import {deleteCollection, saveCollection} from "../../apis/collection";
import {BaseResponse} from "../../utils/http";
import {share} from "../../utils/share";
import {syncLocationAction} from "../../actions/SyncLocationAction";
import {syncUserInfoAction} from "../../actions/SyncUserInfoAction";
import {syncRuleAction} from "../../actions/SyncRuleAction";

// redux mixins
const mapStateToProps = (store: IReduxStore) => {
  return {
    userInfo: store.app.userInfo,
    baseUserInfo: store.app.baseUserInfo,
    location: store.app.location,
    rule: store.app.rule,
    token: store.app.token
  }
};
const mapDispatchToProps = {
  syncLocation: syncLocationAction,
  syncUserInfo: syncUserInfoAction,
  syncRule: syncRuleAction
};

@connect(
  mapStateToProps,
  mapDispatchToProps
)
class HouseIndexPage extends Component<Props, State> {
  public config: Config = {
      navigationBarTitleText: "全区房源",
  };
  public state: State = {
    query: {
      size: 10,
      current: 1,
      order: "desc",
    },
    total: 1,
    pages: 1,
    houseList: [undefined, undefined, undefined] as any,
    search: {},
  };
  public componentWillMount() {
    if (!this.props.location) {
      this.props.syncLocation();
      return Taro.navigateBack();
    }
  }
  public componentDidShow() {
    this.getHouseList();
  }
  public onShareAppMessage(): Taro.ShareAppMessageReturn {
    return share("快马好房", "/pages/home/index");
  }
  public render() {
    const { houseList, loading, search } = this.state;
    const { userInfo } = this.props;
    const location = this.props.location
    const queryLength = Object.keys(search).length;
    const hasLocation  = location ? true : false;
    return (
      <View className="page">
        <View className="header">
          <HouseSearch ref="search" onConfirm={this.handleSearch.bind(this)} />
        </View>
        <List loading={loading}>
          <EmptyText onClick={this.handleOpenSetting.bind(this)} visible={!hasLocation} text="未开启定位权限！">
            打开授权设置？
          </EmptyText>
          <EmptyText visible={houseList.length === 0 && queryLength === 0 && hasLocation} text="当前地区还未发布房源信息" />
          <EmptyQuery visible={queryLength > 0 && houseList.length === 0} onClear={this.handleClearHouseQueryParams.bind(this)} />
          {
            houseList.map((item, index) => {
              if (item && userInfo && userInfo.id !== item.user.id && userInfo.type !== 1 && !item.isPower) {
                return (
                  <ListHouseItem
                    onCollection={this.handleCollection.bind(this)}
                    onSelect={this.jumpHouseDetailPage.bind(this)}
                    key={item.id}
                    houseInfo={item}
                  />
                )
              } else if (item) {
                return (
                  <ListHouseItem
                    onSelect={this.jumpHouseDetailPage.bind(this)}
                    key={item.id}
                    houseInfo={item}
                  />
                )
              }
              return <ListHouseItem key={index} houseInfo={item} />
            })
          }
        </List>
      </View>
    )
  }
  /**
   * 下拉状态
   */
  private isPullDown: boolean = false;
  private isFirst: boolean = true;
  /**
   * 页面下拉刷新
   */
  public onPullDownRefresh() {
    this.isPullDown = true;
    this.getHouseList({
      ...this.state.query,
      current: 1,
      size: 10,
    })
  }
  public onReachBottom() {
    this.setState({
      loading: true
    })
    this.getHouseList({
      ...this.state.query,
      current: this.state.query.current + 1,
    })
  }
  /**
   * 获取房源列表
   * @param params
   */
  private async getHouseList(params?: QueryHouse.Params, clear?: boolean) {
    const { userInfo, location } = this.props;
    const  { search } = this.state;
    const query = {...params || this.state.query}
    // 如果已登录
    if (userInfo) {
      query.userId = userInfo.id;
    }
    if (location) {
      const { city, district, province } = location.address_component;
      if (params) {
        query.province = province;
        query.city = city;
        query.area = district;
      } else {
        query.province = province;
        query.city = city;
        query.area = district;
      }
    } else {
      return this.setState({
        houseList: []
      });
    }
    const response = await queryPageHouses({
      ...query,
      auditStatus: "0",
      ...search,
    });
    const { success, data } = response.data;
    if (success) {
      const { current, records, pages, size, total } = data;
      let list = this.state.houseList.filter(item => item);
      if (clear) {
        list = [];
      }
      if (this.isFirst) {
        list = [];
        this.isFirst = false;
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
          houseList: list,
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
          houseList: list,
          query: {
            ...this.state.query,
            current: query.current,
            size: query.size,
          },
          loading: false,
        })
      }
      if (this.isPullDown) {
        // 取消下拉状态
        this.isPullDown = false;
        Taro.stopPullDownRefresh();
      }
    }
  }
  /**
   * 清除查询条件
   */
  private handleClearHouseQueryParams() {
    const search = this.refs.search as HouseSearch;
    search.clear(true);
  }
  /**
   * 跳转至详情页
   * @param info 房源详情
   */
  private async jumpHouseDetailPage(info: QueryHouse.HouseInfo) {
    Taro.navigateTo({
      url: `../house/detail?id=${info.id}`
    })
  }
  /**
   * 处理关注
   * @param info
   */
  private async handleCollection(info: QueryHouse.HouseInfo) {
    if (!this.props.userInfo) return;
    let response: Taro.request.Promised<BaseResponse<any>>;
    if (!info.isCollect) {
      response = await saveCollection({
        userId: this.props.userInfo.id,
        housesId: info.id
      })
    } else {
      response = await deleteCollection({
        userId: this.props.userInfo.id,
        housesId: info.id
      })
    }
    const { success } = response.data;
    if (success) {
      // this.getHouseList();
      const list = this.state.houseList;
      const find = list.find(item => item.id === info.id);
      if (find) {
        find.isCollect = !find.isCollect
        this.setState({
          houseList: [...list]
        })
      }
    }
  }
  /**
   * 打开小程序的授权设置
   */
  private async handleOpenSetting() {
    Taro.openSetting().then(res => {
      if (res.authSetting["scope.userLocation"]) {
        this.props.syncLocation()
      }
    })
  }
  private async handleSearch(params: any) {
    this.setState({
      search: params,
    }, () => {
      this.state.query.current = 1;
      this.getHouseList(this.state.query, true)
    })
  }
}
export default HouseIndexPage as any

type OwnProps = {};
type State = Readonly<{
  // 查询条件
  query: QueryHouse.Params;
  // 房源列表
  houseList: Array<QueryHouse.HouseInfo>;
  // 总页码
  pages: number;
  // 总条数
  total: number;
  // location
  userLocation?: string[];
  loading?: boolean;
  search?: any;
}>;
type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps & OwnProps;
