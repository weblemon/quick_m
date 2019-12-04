/**
 * @class MineSettingReadmePage Page
 * @date 2019/6/28 19:15
 * @author RanYunlong
 */
// eslint-disable-next-line no-unused-vars
import Taro, {Component, Config} from "@tarojs/taro";
import {View} from "@tarojs/components";

class MineSettingReadmePage extends Component<Props, State> {
  public config: Config = {
      navigationBarTitleText: "免责声明"
  };

  public render() {
      return (
          <View className="page">

          </View>
      )
  }
}

export default MineSettingReadmePage

type MapStateProps = {}
type MapDispatchProps = {};
type OwnProps = {};
type State = Readonly<{}>;
type Props = MapStateProps & MapDispatchProps & OwnProps;
