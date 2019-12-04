/**
 * 朋友列表页面
 * @class FriendIndexPage Page
 * @date 2019/6/28 3:57
 * @author RanYunlong
 */
// eslint-disable-next-line no-unused-vars
import Taro, {Component} from "@tarojs/taro";
import {Button, View} from "@tarojs/components";
import {QueryFriend, queryPageFriend} from "../../apis/friend";
import {IReduxStore} from "../../reducers";
import {connect} from "@tarojs/redux";
import EmptyData from "../../components/empty/EmptyData";
import {AtTabs} from "taro-ui";
import "./index.less";
import {IconEnum} from "../../constants/icon.enum";
import {QueryUser, queryUserPage} from "../../apis/user";
import {syncForMeFriendAction, syncFriendForMeAction, syncUserListAction} from "../../actions/SyncFriendAction";
import List from "../../components/list/List";
import ListItem from "../../components/list/ListItem";
import EmptyText from "../../components/empty/EmptyText";
import {syncLocationAction} from "../../actions/SyncLocationAction";

const mapStateToProps = (store: IReduxStore) => {
  return {
    userInfo: store.app.userInfo,
    baseUserInfo: store.app.baseUserInfo,
    userList: store.app.userList,
    friendForMeList: store.app.friendForMeList,
    forMeFriendList: store.app.forMeFriendList,
    location: store.app.location,
    rule: store.app.rule,
  }
};
const mapDispatchToProps = {
  syncUserList: syncUserListAction,
  syncFriendForMeList: syncFriendForMeAction,
  syncForMeFriendList: syncForMeFriendAction,
  syncLocation: syncLocationAction,
};

@connect(
  mapStateToProps,
  mapDispatchToProps
)
class Friend extends Component<Props, State> {

  public state: State = {
    forMeQuery: {
      current: 1,
      size: 20,
    },
    forFriendQuery: {
      current: 1,
      size: 20,
    },
    userQuery: {
      current: 1,
      size: 20,
    },
    current: 0,
    list: [null, null, null, null, null, null, null,null, null, null, null, null, null, null,],
  };

  public componentDidMount() {
    if (!this.props.location) {
      this.props.syncLocation();
      return Taro.navigateBack();
    }
  }

  public componentDidShow() {
    if (this.props.userInfo) {
      this.getForMeList({
        ...this.state.forMeQuery,
        userId: this.props.userInfo.id,
      });
      this.getForFriendList({
        ...this.state.forFriendQuery,
        friendId: this.props.userInfo.id
      });
      this.getUserList({
        ...this.state.userQuery,
      });
    }
  }

  public onReachBottom(): void {
    this.setState({
      loading: true
    });
    if (this.state.current === 2) {
      this.getUserList({
        ...this.state.userQuery,
        current:this.state.userQuery.current + 1
      })
    }

    if (this.state.current === 1) {
      this.getForFriendList({
        ...this.state.forFriendQuery,
        current:this.state.userQuery.current + 1
      })
    }

    if (this.state.current === 0) {
      this.getForMeList({
        ...this.state.forMeQuery,
        current:this.state.userQuery.current + 1
      })
    }
  }

  public render() {
    const {userInfo} = this.props;
    const { forMeFriendList, friendForMeList, userList } = this.props;
    const {current, loading, list} = this.state;
    if (userInfo) {
      var tabList;
      if (userInfo.type === 1) {
        tabList = [{title: '我关注的'},{title: '关注我的'}]
      } else {
        tabList = [{title: '我关注的'}, {title: '关注我的'}, {title: userInfo.type === 1 ? "全区中介": userInfo.type === 2 ? "全区房东" : "全区用户"}];
      }
      return (
        <View className="page">
          <AtTabs current={current} tabList={tabList} onClick={this.checkoutTab.bind(this)} />
          {current === 0 && forMeFriendList.length > 0 ? (
            <List loading={loading}>
              {
                forMeFriendList.map((item, index) => (
                  <ListItem
                    onClick={() => Taro.navigateTo({
                      url: `/pages/user/card?id=${item.friendId}`
                    })}
                    key={item.id}
                    title={item.realName}
                    avatar={item.avatarUrl || (userInfo.gender === 0 ? IconEnum.woman : IconEnum.man)}
                    hasBorder={index !== forMeFriendList.length - 1}
                    hasArrow={true}
                  />
                ))
              }
            </List>
          ): (
            current === 0 ? (
              <List>
                {
                  list.map((item, index) => (
                    <ListItem
                      key={index}
                      title={item}
                      avatar=""
                      hasBorder={index !== forMeFriendList.length - 1}
                      hasArrow={true}
                    />
                  ))}
                <EmptyText text="暂无关注好友" visible={list.length === 0} onClick={() => this.setState({current: 2})}>去关注</EmptyText>
              </List>
            ): null
          )}

          {current === 1 && friendForMeList.length > 0 ? (
            <List loading={loading}>
              {
                friendForMeList.map((item, index) => (
                  <ListItem
                    onClick={() => Taro.navigateTo({
                      url: `/pages/user/card?id=${item.userId}`
                    })}
                    key={item.id}
                    title={item.realName}
                    avatar={item.avatarUrl || (userInfo.gender === 0 ? IconEnum.woman : IconEnum.man)}
                    hasBorder={index !== forMeFriendList.length - 1}
                    hasArrow={true}
                  />
                ))
              }
            </List>
          ): (
            current === 1 ? (
              <List>
                {
                  list.map((item, index) => (
                    <ListItem
                      key={index}
                      title={item}
                      avatar=""
                      hasBorder={index !== forMeFriendList.length - 1}
                      hasArrow={true}
                    />
                  ))}
                <EmptyText text="暂无关注你的用户" visible={list.length === 0} />
              </List>
            ): null
          )}
          {current === 2 && userList.length > 0 ? (
            <List loading={loading}>
              {
                userList.map((item, index) => (
                  <ListItem
                    onClick={() => Taro.navigateTo({
                      url: `/pages/user/card?id=${item.id}`
                    })}
                    key={item.id}
                    title={item.realName || "用户"+item.id}
                    avatar={item.avatarUrl || (userInfo.gender === 0 ? IconEnum.woman : IconEnum.man)}
                    hasBorder={index !== forMeFriendList.length - 1}
                    hasArrow={true}
                  />
                ))
              }
            </List>
          ): (
            current === 2 ? (
              <List>
                {
                  list.map((item, index) => (
                    <ListItem
                      key={index}
                      title={item}
                      avatar=""
                      hasBorder={index !== forMeFriendList.length - 1}
                      hasArrow={true}
                    />
                  ))}
                <EmptyText text={this.props.rule === 2 ? "本地区暂无用户" : "无当前地区用户查看权限"} visible={list.length === 0} />
              </List>
            ): null
          )}
        </View>
      )
    }

    return (
      <View className="page center">
        <EmptyData value="登陆后才能添加朋友">
          <Button size="mini" onClick={this.jumpLogin.bind(this)}>去登录</Button>
        </EmptyData>
      </View>
    )
  }

  private checkoutTab(current: number) {
    this.setState({
      current
    })
  }

  private async getForMeList(params?: QueryFriend.Params) {
    if (this.props.userInfo) {
      const res = await queryPageFriend(params || this.state.forMeQuery);
      if (res.data.success) {
        const {current, records, size} = res.data.data;
        const list = this.props.forMeFriendList;
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
            forMeQuery: {
              ...this.state.forMeQuery,
              current,
              size,
            },
            list: [],
            loading: false,
          });
          this.props.syncForMeFriendList(list);
        } else {
          this.setState({
            list: [],
            loading: false
          })
        }
      }
    }
  }

  private async getForFriendList(params?: QueryFriend.Params) {
    if (this.props.userInfo) {
      const res = await queryPageFriend(params || this.state.forFriendQuery);
      if (res.data.success) {
        const {current, records, size} = res.data.data;
        const list = this.props.friendForMeList;
        if (records.length > 0) {
          records.forEach(record => {
            const find = list.find(item => item.id === record.id)
            if (!find) {
              list.push(record)
            } else {
              Object.keys(find).forEach(key => {
                find[key] = record[key];
              })
            }
          });
          this.setState({
            forFriendQuery: {
              ...this.state.forFriendQuery,
              current,
              size,
            },
            loading: false,
          });
          this.props.syncFriendForMeList(list);
        } else {
          this.setState({
            loading: false
          })
        }
      }
    }
  }

  private async getUserList(params?: QueryUser.Params) {
    // console.log(this.props.rule);
    if (this.props.rule !== 2) return;
    if (this.props.userInfo) {
      const query = params || this.state.userQuery;
      if (this.props.location) {
        const { province, district, city } = this.props.location.address_component;
        query.province = province;
        query.city = city;
        query.region = district;
      }
      if (this.props.userInfo.type === 1) {
        query.type = 2;
      } else if (this.props.userInfo.type === 2) {
        query.type = 1;
      } else if (this.props.userInfo.type === 3) {
        // query.type = 2;
      }
      const res = await queryUserPage(query);
      if (res.data.success) {
        const {current, records, size} = res.data.data;
        const list = this.props.userList;
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
            userQuery: {
              ...this.state.userQuery,
              current,
              size,
            },
            loading: false,
          });
          this.props.syncUserList(list);
        } else {
          this.setState({
            loading: false
          })
        }
      }
    }
  }

  private async jumpLogin() {
    return Taro.navigateTo({
      url: "/pages/mine/login"
    })
  }
}

export default Friend

type OwnProps = {};
type State = Readonly<{
  forMeQuery: QueryFriend.Params;
  forFriendQuery: QueryFriend.Params;
  userQuery: QueryUser.Params;
  current: number;
  list: any[];
  loading?: boolean;
}>;
type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps & OwnProps;
