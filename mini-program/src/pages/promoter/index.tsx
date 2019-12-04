/**
 * @class PromoterPage Page
 * @date 2019/7/26 1:00
 * @author RanYunlong
 */
// eslint-disable-next-line no-unused-vars
import Taro, {Component, Config} from "@tarojs/taro";
import {Button, View} from "@tarojs/components";
import "./index.less";
import Search from "../../components/search/Search";
import {IReduxStore} from "../../reducers";
import {connect} from "@tarojs/redux";
import List from "../../components/list/List";
import {QueryUser, queryUserPage} from "../../apis/user";
import ListItem from "../../components/list/ListItem";
import {UserTypeEnum} from "../../enum/user.type.enum";
import {IconEnum} from "../../constants/icon.enum";
import EmptyText from "../../components/empty/EmptyText";

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
class PromoterPage extends Component<Props, State> {
  public config: Config = {
    navigationBarTitleText: "推广"
  };

  public state: State = {
    query: {
      current: 1,
      size: 20,
      order: "desc",
    },
    list: [],
    total: 0,
    search: "",
  };

  public componentWillMount() {
    if (!this.props.userInfo) return Taro.navigateBack();
    this.setState({
      query: {
        ...this.state.query,
        parentId: this.props.userInfo.id
      }
    })
  }

  public componentDidShow(): void {
    this.getList({
      ...this.state.query,
    }, true)
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

  public onPullDownRefresh(): void {
    this.getList({
      ...this.state.query,
      current: 1,
    }, true)
  }

  public render() {
    const {loading, list, search} = this.state;
    return (
      <View className="page">
        <View className="i-search ">
          <View className="head">
            <Button size="mini" type="primary" onClick={() => Taro.navigateTo({url: "/pages/promoter/create"})}>添加客户</Button>
          </View>
          <Search
            value={search}
            onInput={search => this.setState({search})}
            onClear={() => {
              this.getList({...this.state.query, search: ""} as any, true);
              this.setState({
                search: "",
              })
            }}
            onConfirm={v => this.getList({...this.state.query, search: v} as any, true)}
            placeholder="搜索客户"
          />
        </View>
        <List loading={loading}>
          <EmptyText visible={!this.isFirst && list.length === 0} text="暂无客户数据" onClick={() => {
            this.setState({
              search: "",
            });
            this.getList({
              ...this.state.query,
              search: ""
            } as any);
          }}>
            {this.state.search ? "清除条件": ""}
          </EmptyText>
          {
            this.isFirst ? (
              [undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined]
                .map((item, index) => (
                <ListItem
                  key={index}
                  title={item || ""}
                  desc=""
                  hasArrow={true}
                  hasBorder={true}
                />
              ))
            ):  (
              list.map((item, index) => (
                <ListItem
                  avatar={item.avatarUrl || (item.gender === 0 ? IconEnum.woman : IconEnum.man)}
                  key={item.id}
                  title={item.realName || item.nickName || "用户" + item.id}
                  desc={UserTypeEnum[item.type]}
                  hasBorder={index !== list.length -1}
                  hasArrow={true}
                  onClick={() => Taro.navigateTo({
                    url: `/pages/promoter/detail?id=${item.id}`
                  })}
                />
              ))
            )
          }
        </List>
        {/*<View onClick={() => Taro.navigateTo({url: "/pages/promoter/create"})} className="publish-button">*/}
        {/*  <Image src={IconEnum.publish} />*/}
        {/*</View>*/}
      </View>
    )
  }
  private isFirst: boolean = true;
  private async getList(params?: QueryUser.Params, clear?: boolean) {
    const res = await queryUserPage(params || this.state.query);
    if (res.data.success) {
      const { size, records, current, total } = res.data.data;
      let { list = [] } = this.state;
      if (this.isFirst) {
        list = [];
        this.isFirst = false;
      }
      if (clear) {
        list = [];
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
          query: {
            ...this.state.query,
            current,
            size,
          },
          total,
          loading: false
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
}

export default PromoterPage

type OwnProps = {};
type State = Readonly<{
  loading?: boolean;
  query: QueryUser.Params;
  list: QueryUser.Info[];
  total: number;
  search: string;
}>;
type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps & OwnProps;
