/**
 * @class MineSettingRolePage Page
 * @date 2019/6/28 19:01
 * @author RanYunlong
 */
// eslint-disable-next-line no-unused-vars
import Taro, {Component, Config} from "@tarojs/taro";
import {View} from "@tarojs/components";

class MineSettingRolePage extends Component<Props, State> {
  public config: Config = {
      navigationBarTitleText: "角色设置"
  };

  public render() {
      return (
          <View className="page">

          </View>
      )
  }
}

export default MineSettingRolePage

type MapStateProps = {}
type MapDispatchProps = {};
type OwnProps = {};
type State = Readonly<{}>;
type Props = MapStateProps & MapDispatchProps & OwnProps;
