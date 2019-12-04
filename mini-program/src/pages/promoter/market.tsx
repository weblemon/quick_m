/**
 * @class PromoterMarket Page
 * @date 2019/9/23 17:30
 * @author RanYunlong
 */
// eslint-disable-next-line no-unused-vars
import Taro, {Component, Config} from "@tarojs/taro";
import {View} from "@tarojs/components";
import {IReduxStore} from "../../reducers";
import {connect} from "@tarojs/redux";
import {AtButton} from "taro-ui";
import "./market.less";

const mapStateToProps = (store: IReduxStore) => {
  return {
    userInfo: store.app.userInfo
  }
};
const mapDispatchToProps = {};

@connect(
  mapStateToProps,
  mapDispatchToProps
)
class PromoterMarket extends Component<Props, State> {
  public config: Config = {
      navigationBarTitleText: "市场信息"
  };

  public render() {
      return (
          <View className="page">
            {/*<Button type="primary">最近30天新增房源</Button>*/}
            <AtButton type="primary" onClick={() => Taro.navigateTo({
              url: "./market.list?auditStatus=0"
            })}>最近30天新增房源</AtButton>
            <AtButton onClick={() => Taro.navigateTo({
              url: "./market.list?auditStatus=1"
            })} type="secondary">最近30天售出房源</AtButton>
          </View>
      )
  }
}

export default PromoterMarket

type OwnProps = {};
type State = Readonly<{}>;
type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps & OwnProps;
