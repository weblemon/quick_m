/**
 * @class MineHouseClickCountPage Page
 * @date 2019/7/16 2:12
 * @author RanYunlong
 */
// eslint-disable-next-line no-unused-vars
import Taro, {Component, Config} from "@tarojs/taro";
import {View} from "@tarojs/components";
import ListItem from "../../../../components/list/ListItem";
import List from "../../../../components/list/List";
import {queryCount} from "../../../../apis/count";
import {connect} from "@tarojs/redux";
import {IReduxStore} from "../../../../reducers";
import "./click.less";

const mapStateToProps = (store: IReduxStore) => ({
  userInfo: store.app.userInfo,
});

@connect(
  mapStateToProps
)
class MineHouseClickCountPage extends Component<Props, State> {
  public config: Config = {
    navigationBarTitleText: "到访统计",
    enablePullDownRefresh: false
  };

  public componentDidShow(): void {
    this.getData();
  }

  public render() {
    const {dayCount, monthCount, dayCallCount, monthCallCount} = this.state;
    return (
      <View className="page">
        <List loading={false}>
          <ListItem
            desc="今日点击数量"
            extraText={`${dayCount ? dayCount.toString() : 0} 次`}
            hasBorder={true}
          />

          <ListItem
            desc="本月点击数量"
            extraText={`${monthCount ? monthCount.toString() : 0} 次`}
            hasBorder={true}
          />

          <ListItem
            desc="今日电话数量"
            extraText={`${dayCallCount ? dayCallCount.toString() : 0} 次`}
            hasBorder={true}
          />

          <ListItem
            desc="本月电话数量"
            extraText={`${monthCallCount ? monthCallCount.toString() : 0} 次`}
            hasBorder={false}
          />
        </List>
      </View>
    )
  }

  private async getData() {
    const {userInfo} = this.props;
    if (!userInfo) return;
    const date = new Date();
    let M: string | number = date.getMonth() + 1;
    let D: string | number = date.getDate();

    if (M < 10) M = `0${M}`;
    if (D < 10) D = `0${D}`;

    const dateTime = `${date.getFullYear()}-${M}-${D}`;
    const  monthCount = await queryCount(this.$router.params.id  || userInfo.id, 1);
    const dayCount = await queryCount(this.$router.params.id  || userInfo.id, 1, dateTime);
    const dayCallCount = await queryCount(this.$router.params.id  || userInfo.id, 2);
    const monthCallCount = await queryCount(this.$router.params.id  || userInfo.id, 2, dateTime);
    this.setState({
      dayCount: dayCount.data.data,
      monthCount: monthCount.data.data,
      dayCallCount: dayCallCount.data.data,
      monthCallCount: monthCallCount.data.data,
    })
  }
}

export default MineHouseClickCountPage

type MapDispatchProps = {};
type OwnProps = {};
type State = Readonly<{
  dayCount?: number;
  monthCount?: number;
  dayCallCount?: number;
  monthCallCount?: number;
}>;
type Props = ReturnType<typeof mapStateToProps> & MapDispatchProps & OwnProps;
