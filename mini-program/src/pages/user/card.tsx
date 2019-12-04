/**
 * @class UserCardPage Page
 * @date 2019/7/14 0:54
 * @author RanYunlong
 */
// eslint-disable-next-line no-unused-vars
import Taro, {Component, Config} from "@tarojs/taro";
import {View, Image, Text, Button} from "@tarojs/components";
import {IconEnum} from "../../constants/icon.enum";
import Pane from "../../components/pane/Pane";
import List from "../../components/list/List";
import "./card.less";
import {IReduxStore} from "../../reducers";
import {connect} from "@tarojs/redux";
import {QueryHouse, queryPageHouses} from "../../apis/house";
import {QueryUser, queryUserInfo} from "../../apis/user";
import EmptyLine from "../../components/empty/EmptyLine";
import {UserTypeEnum} from "../../enum/user.type.enum";
import ListHouseItem from "../../components/list/ListHouseItem";
import {BaseResponse} from "../../utils/http";
import {deleteCollection, saveCollection} from "../../apis/collection";
import {deleteFriend, saveFriend} from "../../apis/friend";
import {syncForMeFriendAction} from "../../actions/SyncFriendAction";
import {share} from "../../utils/share";
import ListItem from "../../components/list/ListItem";
import {syncWxUserInfoAction} from "../../actions/SyncWxUserInfoAction";

const mapStateToProps = (store: IReduxStore) => {
  return {
    userInfo: store.app.userInfo,
    baseUserInfo: store.app.baseUserInfo,
    forMeFriendList: store.app.forMeFriendList,
  }
};
const mapDispatchToProps = {
  syncUserInfo: syncWxUserInfoAction,
  syncForMeFriendList: syncForMeFriendAction,
};

@connect(
  mapStateToProps,
  mapDispatchToProps
)
class UserCardPage extends Component<Props, State> {
  public config: Config = {
    navigationBarTitleText: "名片",
    enablePullDownRefresh: false,
  };
  public componentWillMount(): void {
    if (this.$router.params.share === "ok") {
      Taro.showShareMenu();
    }
    this.getUserInfo(this.$router.params.id);
  }
  public onReachBottom(): void {
    let current = this.state.query.current || 0;
    this.getList({
      ...this.state.query,
      current: current + 1
    })
  }
  public readonly state: State = {
    query: {
      size: 10,
      current: 1,
      auditStatus: 0,
    },
    total: 0,
    list: [],
  };
  public render() {
    const { userInfo } = this.props;
    const { info, list, loading, total } = this.state;

    if (info) {
      return  (
        <View className="page">
          <View className="header">
            <Image className="avatar" src={info.avatarUrl || (info.gender == 0 ? IconEnum.woman : IconEnum.man)}/>
            <View className="info">
              <Text className="username">
                { info.realName || info.nickName || "用户" + info.id}
              </Text>
              <Text className="nickname">
                {UserTypeEnum[info.type || 0]}
              </Text>
            </View>
          </View>
          <View className="btn-group">
            <Button
              size="mini"
              openType="share"
            >
              分享名片
            </Button>
            {
              userInfo && userInfo.id !== info.id ? (
                <Button
                  size="mini"
                  onClick={this.handleFriend.bind(this)}
                >
                  {info.isFrend ? "已关注" : "关注TA"}
                </Button>
              ): <View/>
            }
          </View>
          {
            info.type === 2 ? (
              <List>
                <ListItem
                  title="联系电话"
                  extraText={info.phone}
                  hasArrow={true}
                  hasBorder={true}
                  onClick={() => Taro.makePhoneCall({
                    phoneNumber: info.phone as string
                  })}
                />
                <ListItem
                  title="所在地区"
                  extraText={[info.province, info.city, info.region].join("-")}
                  hasArrow={true}
                />
              </List>
            ): null
          }
          {
            info.type === 1 || info.type === 3 ? (
              userInfo && info.id !== userInfo.id ? (
                <View>
                  <Pane
                    title="Ta发布的房源"
                    value={`${total}套`}
                  />
                  <List loading={loading}>
                    {
                      list.map((item, index) => (
                        <ListHouseItem
                          onSelect={this.jumpHouseDetailPage.bind(this)}
                          hasBorder={index !== list.length - 1}
                          onCollection={this.handleCollection.bind(this)}
                          houseInfo={item}
                          key={item.id}
                        />
                      ))
                    }
                  </List>
                </View>
              ): (
                <View>
                  <Pane
                    title="Ta发布的房源"
                    value={`${total}套`}
                  />
                  <List loading={loading}>
                    {
                      list.map((item, index) => (
                        <ListHouseItem
                          onSelect={this.jumpHouseDetailPage.bind(this)}
                          hasBorder={index !== list.length - 1}
                          houseInfo={item}
                          key={item.id}
                        />
                      ))
                    }
                  </List>
                </View>
              )
            ): null
          }
        </View>
      )
    }
    return (
      <View className="page">
        <View className="header">
          <Image className="avatar" src={IconEnum.avatar}/>
          <View className="info">
            <EmptyLine width={200} />
            <EmptyLine width={100} />
          </View>
        </View>
        <View className="btn-group">
          <Button
            size="mini"
            openType="share"
          >
            <EmptyLine width={100} />
          </Button>
          <Button
            size="mini"
          >
            <EmptyLine width={100}/>
          </Button>
        </View>
      </View>
    )
  }
  public onShareAppMessage(): Taro.ShareAppMessageReturn {
    if (!this.state.info) return {};
    return share(
      this.state.info.nickName || this.state.info.realName || `卖房侠用户${this.state.info.id}的名片`,
      `/pages/user/card?id=${this.state.info.id}`
    )
  }
  public componentDidShow(): void {
    const { info } = this.state;
    if (info) {
      if (this.props.userInfo) {
        this.state.query.userId = this.props.userInfo.id;
        this.state.query.releaseId = info.id;
      }
      this.getList(this.state.query, true);
    }
  }

  private async getList(params?: QueryHouse.Params, clear?: boolean) {
    const q = params || this.state.query;
    if (q.current && q.current > 1) {
      this.setState({
        loading: true
      })
    }
    const response = await queryPageHouses(q);
    const { success, data } = response.data;
    if (success) {
      let list = this.state.list;
      if (clear) {
        list = []
      }
      if (data.records.length > 0) {
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
          total: data.total,
          query: {
            ...params || this.state.query,
            current: data.current,
            size: data.size,
          },
          loading: false,
        })
      } else{
        this.setState({
          total: data.total,
          loading: false,
        })
      }
    }
    this.setState({loading: false})
  }
  private async getUserInfo(id: number | string) {
     const response = await queryUserInfo(id, this.props.userInfo ? this.props.userInfo.id : "");
     const { success, data } = response.data;
     if (!success) return;
     this.setState({
       info: data,
     });
     Taro.setNavigationBarTitle({
       title: data.nickName || data.realName || `卖房侠${data.id}`
     });
     const query: QueryHouse.Params = {
       ...this.state.query,
       releaseId: data.id
     };
     if (this.props.userInfo) {
        query.userId = this.props.userInfo.id
     }
     this.getList(query, true)
  }
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
      this.getList(this.state.query, true);
    }
  }
  private async jumpHouseDetailPage(info: QueryHouse.HouseInfo) {
    return Taro.navigateTo({
      url: `/pages/house/detail?id=${info.id}`
    })
  }
  private async handleFriend() {
    if (this.props.userInfo && this.state.info) {
      if (this.state.info.isFrend) {
        const res = await deleteFriend({
          userId: this.props.userInfo.id,
          friendId: this.state.info.id,
        });
        if (res.data.success) {
          this.getUserInfo(this.$router.params.id);
          this.props.syncForMeFriendList(this.props.forMeFriendList.filter(item => item.friendId != this.$router.params.id))
        }
      } else {
        const res = await saveFriend({
          userId: this.props.userInfo.id,
          friendId: this.state.info.id,
          type: this.state.info.type as any
        });
        if (res.data.success) {
          this.getUserInfo(this.$router.params.id);
        }
      }
    }

  }
}

export default UserCardPage

type OwnProps = {};
type State = Readonly<{
  info?: QueryUser.Info;
  query: QueryHouse.Params;
  total: number;
  list: QueryHouse.HouseInfo[];
  loading?: boolean;
}>;
type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps & OwnProps;
