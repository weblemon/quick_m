/**
 * @class EmptyQuery Component
 * @date 2019/7/3 12:10
 * @author RanYunlong
 */

import Taro , { Component } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import PropType from "prop-types";
import "./EmptyQuery.less";

class EmptyQuery extends Component<Prop, State> {
  static propTypes: OwnPropTypes = {
    visible: PropType.bool,
    onClear: PropType.func,
  };
  static defaultProps: OwnProp = {
    visible: false,
  };
  public readonly state: State = {};
  public render() {
    const { visible } = this.props;
    if (visible) {
      return (
        <View className="empty-query">
          <Text>暂无符合条件数据</Text>
          <Text className="clear" onClick={this.handleClear.bind(this)}>清空条件</Text>
        </View>
      );
    }
    return null;
  }
  private handleClear() {
    if (typeof this.props.onClear === "function") {
      this.props.onClear()
    }
  }
}
export default EmptyQuery;

interface OwnProp {
  visible: boolean;
  onClear?: () => void;
}
type Prop = OwnProp;
type State = Readonly<{
}>
type OwnPropTypes = { [K in keyof OwnProp]: PropType.Requireable<OwnProp[K]>;}



