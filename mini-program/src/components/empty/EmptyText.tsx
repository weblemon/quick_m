/**
 * @class EmptyText Component
 * @date 2019/6/28 13:50
 * @author RanYunlong
 */

import Taro , { Component } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import PropType from "prop-types";
import "./EmptyText.less";

class EmptyText extends Component<Prop, State> {
  static defaultProps: OwnProp = {
    text: '暂无数据',
    visible: true,
  };
  static propTypes: OwnPropTypes = {
    text: PropType.string,
    visible: PropType.bool,
  };
  public readonly state: State = {};
  public render() {
    const { text, visible, onClick} = this.props;
    const hasClick = onClick ? true : false;
    if (visible) {
      return (
        <View className="empty-text">
          <Text>{text}</Text>
          {hasClick ? (
            <Text className="value" onClick={this.handleClick.bind(this)}>{this.props.children}</Text>
          ): null}
        </View>
      );
    }
    return null;
  }
  private handleClick() {
    if (typeof this.props.onClick === "function") {
      this.props.onClick()
    }
  }
}
export default EmptyText;

interface OwnProp {
  text: string;
  visible: boolean;
  onClick?: () => void;
}
type Prop = OwnProp;
type State = Readonly<{

}>
type OwnPropTypes = { [K in keyof OwnProp]: PropType.Requireable<OwnProp[K]>;}
