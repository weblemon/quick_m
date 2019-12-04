/**
 * @class MineHouseIndexPage Page
 * @date 2019/7/14 2:19
 * @author RanYunlong
 */

// eslint-disable-next-line no-unused-vars
import Taro, {Component, Config} from "@tarojs/taro";
import {View} from "@tarojs/components";
import List from "../../../components/list/List";
import ListItem from "../../../components/list/ListItem";
import {IReduxStore} from "../../../reducers";
import "./index.less";
import {connect} from "@tarojs/redux";

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
class MineHouseIndexPage extends Component<Props, State> {
  public config: Config = {
    navigationBarTitleText: "数据统计"
  };
  public readonly state: State = {
    myHouseCounts: [0, 0, 0, 0],
  };
  public render() {
    return (
      <View className="page">
        <List>
          <ListItem
            desc="在售房源"
            extraText="查看"
            hasArrow={true}
            hasBorder={true}
            onClick={this.jumpOnlineListPage}
          />
          <ListItem
            desc="已售房源"
            extraText="查看"
            hasArrow={true}
            hasBorder={false}
            onClick={this.jumpOfflineListPage}
          />
        </List>
        <List>
          <ListItem
            desc="收藏记录"
            extraText="查看"
            hasArrow={true}
            hasBorder={true}
            onClick={this.jumpCollectionListPage}
          />

          <ListItem
            desc="浏览记录"
            extraText="查看"
            hasArrow={true}
            hasBorder={true}
            onClick={this.jumpHistoryListPage}
          />
          <ListItem
            desc="到访统计"
            extraText="查看"
            hasArrow={true}
            hasBorder={false}
            onClick={this.jumpClickCountPage}
          />
        </List>
      </View>
    )
  }
  /**
   * 查看在售房源
   */
  private async jumpOnlineListPage() {
    return  Taro.navigateTo({
      url: "/pages/mine/house/list/house?auditStatus=0&title=在售房源统计"
    })
  }
  /**
   * 查看已售房源
   */
  private async jumpOfflineListPage() {
    return  Taro.navigateTo({
      url: "/pages/mine/house/list/house?auditStatus=2&title=已售房源统计"
    })
  }
  /**
   * 查看历史访问记录
   */
  private async jumpHistoryListPage() {
    return  Taro.navigateTo({
      url: "/pages/mine/house/list/house?auditStatus=2&title=浏览记录&type=history"
    })
  }
  /**
   * 查看历史访问记录
   */
  private async jumpCollectionListPage() {
    return  Taro.navigateTo({
      url: "/pages/mine/house/list/house?auditStatus=2&title=收藏记录&type=collection"
    })
  }
  private async jumpClickCountPage() {
    return Taro.navigateTo({
      url: "./count/click"
    })
  }
}

export default MineHouseIndexPage

type OwnProps = {};
type State = Readonly<{
  myHouseCounts: number[];
}>;
type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps & OwnProps;
