/**
 * @class HouseCallListPage Page
 * @date 2019/7/16 3:43
 * @author RanYunlong
 */
// eslint-disable-next-line no-unused-vars
import Taro, {Component, Config} from "@tarojs/taro";
import {View} from "@tarojs/components";
import Pane from "../../components/pane/Pane";
import {queryCallList, QueryCount} from "../../apis/count";
import {connect} from "@tarojs/redux";
import {IReduxStore} from "../../reducers";
import List from "../../components/list/List";
import ListItem from "../../components/list/ListItem";
import {formatDate} from "../../utils/formatDate";
import "./call.less";
import EmptyText from "../../components/empty/EmptyText";

// redux mixins
const mapStateToProps = (store: IReduxStore) => {
  return {
    userInfo: store.app.userInfo,
  }
};
const mapDispatchToProps = {};

@connect(
  mapStateToProps,
  mapDispatchToProps
)
class HouseCallListPage extends Component<Props, State> {
  public readonly state: State = {
    list: [undefined, undefined, undefined, undefined, undefined, undefined, undefined],
  };
  public config: Config = {
      navigationBarTitleText: "电话联系列表",
      enablePullDownRefresh: false,
  };
  public componentDidShow(): void {
    this.getList();
  }
  public render() {
      const { list, total} = this.state;
      return (
          <View className="page">
            <Pane
              title="已联系列表"
              value={total !== undefined ? `${total} 次` : undefined}
            />
            <List>
              <EmptyText visible={list.length === 0} text="暂无数据"  />
              {
                list.map((item, index) => (
                  item ? (
                    <ListItem
                      key={index}
                      avatar={item.avatarUrl}
                      title={item.phone}
                      desc={formatDate(item.rawAddTime)}
                      hasArrow={true}
                      hasBorder={index !== list.length - 1}
                      onClick={this.handleGoUserCard}
                      info={item}
                    />
                  ): (
                    <ListItem
                      avatar=""
                      title=""
                      desc=""
                      key={index}
                      hasBorder={index !== list.length - 1}
                      info={item}
                    />
                  )
                ))
              }
            </List>
          </View>
      )
  }
  /**
   * 跳转至用户名片页面
   * @param info 用户信息
   */
  private async handleGoUserCard(info) {
      Taro.navigateTo({
        url: `/pages/user/card?id=${info.info.userId}`
      });
  }
  /**
   * 获取电话列表
   */
  private async getList() {
    const { id } = this.$router.params;
     const response = await queryCallList(id);
     const { success, data } = response.data;
     if (success) {
      const { total, records } = data;
       setTimeout(() => this.setState({
         list: records,
         total
       }), 500);
     }
  }
}

export default HouseCallListPage

type OwnProps = {};
type State = Readonly<{
  // 电话联系列表
  list: Array<QueryCount.CallInfo | undefined>;
  // 电话联系总数
  total?: number;
}>;
type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps & OwnProps;
