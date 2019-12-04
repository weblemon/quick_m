/**
 * @class MineHouseListPage Page
 * @date 2019/7/14 3:03
 * @author RanYunlong
 */
// eslint-disable-next-line no-unused-vars
import Taro, {Component, Config} from "@tarojs/taro";
import {Button, Text, View} from "@tarojs/components";
import {IReduxStore} from "../../../../reducers";
import {connect} from "@tarojs/redux";
import {QueryHouse, queryPageHouses, saveHousingResources} from "../../../../apis/house";
// import Pane from "../../../../components/pane/Pane";
import "./house.less";
import List from "../../../../components/list/List";
import ListHouseItem from "../../../../components/list/ListHouseItem";
import EmptyText from "../../../../components/empty/EmptyText";
import {deleteBrowse, QueryBrowse, queryPageBrowseVo, queryPageCollectionVo} from "../../../../apis/browse";
import {BaseResponse} from "../../../../utils/http";
import {deleteCollection, saveCollection} from "../../../../apis/collection";
import {IconEnum} from "../../../../constants/icon.enum";
import {HouseStatusEnum} from "../../../../enum/house.status.enum";
import EmptyLine from "../../../../components/empty/EmptyLine";
import {share} from "../../../../utils/share";

const mapStateToProps = (store: IReduxStore) => {
  return {
    userInfo: store.app.userInfo,
  }
};

@connect(
  mapStateToProps,
)
class MineHouseListPage extends Component<Props, State> {
  public config: Config = {
    navigationBarTitleText: "房源列表",
    enablePullDownRefresh: false,
  };
  public readonly state: State = {
    query: {
      size: 10,
      current: 1,
    },
    total: 0,
    list: [],
  };
  public componentWillMount(): void {
    const { title ="标题一枚" } = this.$router.params;
    Taro.setNavigationBarTitle({
      title
    });
  }
  public componentDidShow(): void {
    const { type = "list" } = this.$router.params;
    this.state.query.current = 1;
    this.getList(type, this.state.query as any, true);
  }
  public onShareAppMessage() {
    if (!this.props.userInfo) return {};
    return share(
      this.props.userInfo.nickName || this.props.userInfo.realName || `卖房侠用户${this.props.userInfo.id}的名片`,
      `/pages/user/card?id=${this.props.userInfo.id}`
    )
  }

  public onReachBottom(): void {
    let current = this.state.query.current || 0;
    const { type } = this.$router.params;
    this.getList(type, {
      ...this.state.query,
      current: current + 1
    } as any)
  }
  public render() {
    const {title = "标题", auditStatus, type = "list"} = this.$router.params;
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
              {
                type === "list" && auditStatus === "0" ? (
                  <View className="btn-group">
                    <Button className="primary" onClick={() => {
                      if (this.$router.params.id) {
                        Taro.navigateTo({
                          url: "/pages/house/publish?releaseId=" + this.$router.params.id
                        })
                      } else {
                        Taro.navigateTo({
                          url: "/pages/house/publish"
                        })
                      }
                    }} size="mini">添加</Button>
                    <Button className="share" openType="share" size="mini">分享</Button>
                  </View>
                ): total + "套房源" || "暂无数据"
              }
            </View>
          </View>
        </View>
        <List loading={loading}>
          {list.length === 0 ? (
            type=== "list" && auditStatus === "0" ? (
              <EmptyText text="暂无数据" onClick={() => Taro.navigateTo({url: "/pages/house/publish"})}>
                去发布
              </EmptyText>
            ): (
              <EmptyText text="暂无数据" onClick={Taro.navigateBack}>
                返回前页
              </EmptyText>
            )
          ): null}
          {
            list.map(info => {
              if (auditStatus === "0" && type === "list") {
                return (
                  <ListHouseItem
                    onSelect={this.jumpHouseDetailPage.bind(this)}
                    houseInfo={info}
                    key={info.id}
                    onDown={this.handleOffline.bind(this)}
                    onEdit={this.handleEdit.bind(this)}
                  />
                )
              } else if ((auditStatus === "1" || auditStatus === "2" || auditStatus === "3") && type === "list") {
                return  (
                  <ListHouseItem
                    onSelect={this.jumpHouseDetailPage.bind(this)}
                    houseInfo={info}
                    key={info.id}
                    onEdit={this.handleEdit.bind(this)}
                    onUp={this.handleUp.bind(this)}
                  />
                )
              } else if(type === "collection") {
                const copyInfo = {...info};
                copyInfo.isCollect = true;
                return  (
                  <ListHouseItem
                    onSelect={this.jumpHouseDetailPage.bind(this)}
                    houseInfo={copyInfo}
                    key={info.id}
                    onCollection={this.handleCollection.bind(this)}
                  />
                )
              } else if (type === "history") {
                return (
                  <ListHouseItem
                    onSelect={this.jumpHouseDetailPage.bind(this)}
                    houseInfo={info}
                    key={info.browseId}
                    onCollection={this.handleCollection.bind(this)}
                    onRemove={this.handleHistoryRemove.bind(this)}
                  />
                )
              }
              return  (
                <ListHouseItem
                  onSelect={this.jumpHouseDetailPage.bind(this)}
                  houseInfo={info}
                  key={info.id}
                  onCollection={this.handleCollection.bind(this)}
                />
              )
            })
          }
        </List>
      </View>
    )
  }

  /**
   * 获取房源列表
   * @param type
   * @param params
   */
  private async getList(type: "history", params?: QueryBrowse.Params, clear?: boolean);
  private async getList(type: "list", params?: QueryHouse.Params, clear?: boolean);
  private async getList(type: "collection", params?: QueryHouse.Params, clear?: boolean);
  private async getList(type = "list", params?: any, clear?: boolean){
    if (!this.props.userInfo) return;
    const q = params || this.state.query;
    if (q.current && q.current > 1) {
      this.setState({
        loading: true
      })
    }
    let response: any;
    if (type === "history")  {
      q.userId = this.$router.params.id || this.props.userInfo.id;
      response = await queryPageBrowseVo(q);
    } else if (type === "collection") {
      q.userId = this.$router.params.id || this.props.userInfo.id;
      response = await queryPageCollectionVo(q);
    } else if (type === "list") {
      q.releaseId = this.$router.params.id || this.props.userInfo.id;
      q.auditStatus = this.$router.params.auditStatus;
      response = await queryPageHouses(q, "v1");
    }
    const {success, data} = response.data;
    if (success) {
      if (data.records.length > 0) {
        let list = this.state.list;
        if (clear) {list = []};
        if (type === "history") {
          data.records.forEach(record => {
            const find = list.find(item => item.browseId === record.browseId)
            if (!find) {
              list.push(record)
            } else {
              Object.keys(find).forEach(key => {
                find[key] = record[key];
              })
            }
          });
        } else {
          data.records.forEach(record => {
            const find = list.find(item => item.id === record.id)
            if (!find) {
              list.push(record)
            } else {
              Object.keys(find).forEach(key => {
                find[key] = record[key];
              })
            }
          });
        }
        this.setState({
          list: [...list],
          total: data.total,
          query: {
            ...params || this.state.query,
            current: data.current,
            size: data.size
          }
        })
      } else {
        this.setState({
          total: data.total,
          query: {
            ...this.state.query,
            current: data.current,
            size: data.size
          }
        })
      }
    }
    this.setState({loading: false})
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
  /**
   * 处理收藏
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
      this.setState({
        list: [...this.state.list.filter(item => item.id !== info.id)]
      }, () => {
        this.getList(this.$router.params.type || "list");
      });
    }
  }
  /**
   * 删除历史记录
   */
  private async handleHistoryRemove(info: QueryHouse.HouseInfo) {
    if (!this.props.userInfo) return;
    const response = await deleteBrowse({
      id: info.browseId,
    });
    const { success } = response.data;
    if (success) {
      this.setState({
        list: [...this.state.list.filter(item => item.browseId !== info.browseId)]
      }, () => {
        this.getList(this.$router.params.type || "list");
      });
    }
  }
  /**
   * 下架房源
   */
  private async handleOffline(info: QueryHouse.HouseInfo) {
    const res = await saveHousingResources({
      id: info.id,
      auditStatus: HouseStatusEnum["用户下架"],
    });
    if (res.data.success) {
      const list = this.state.list.filter(item => item.id !== info.id);
      this.setState({
        list
      });
      this.getList(this.$router.params.type || "list");
    } else {
      Taro.showToast({
        title: "下架失败请重试",
        image: IconEnum.error,
      })
    }
  }
  /**
   * 更新房源
   */
  private async handleEdit(info: QueryHouse.HouseInfo) {
    Taro.navigateTo({
      url: `/pages/house/publish?id=${info.id}`
    })
  }
  /**
   * 重新上架
   */
  private async handleUp(info: QueryHouse.HouseInfo) {
    const res = await saveHousingResources({
      id: info.id,
      auditStatus: HouseStatusEnum["上架中"],
    });
    if (res.data.success) {
      const list = this.state.list.filter(item => item.id !== info.id);
      this.setState({
        list
      });
      this.getList(this.$router.params.type || "list");
    } else {
      Taro.showToast({
        title: "上架失败请重试",
        image: IconEnum.error,
      })
    }
  }
}

export default MineHouseListPage

type OwnProps = {};
type State = Readonly<{
  query: QueryHouse.Params | QueryBrowse.Params;
  total: number;
  list: QueryHouse.HouseInfo[];
  loading?: boolean;
}>;
type Props = ReturnType<typeof mapStateToProps> & OwnProps;
