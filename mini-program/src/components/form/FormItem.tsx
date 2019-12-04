/**
 * @class FormItem Component
 * @date 2019/7/27 0:06
 * @author RanYunlong
 */

import Taro , { Component } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import PropType from "prop-types";
import "./FormItem.less";

class FormItem extends Component<Prop, State> {
  static propTypes: OwnPropTypes = {
    label: PropType.string,
    mode: PropType.string,
  };
  public readonly state: State = {};
  public render() {
    return (
      <View className="form-item" style={{flexDirection: this.props.mode as any || "row"}}>
        <Text className="label">{this.props.label}</Text>
        <View className="content">{this.props.children}</View>
      </View>
    );
  }
}
export default FormItem;

interface OwnProp {
  label: string;
  mode?: string;
}
type Prop = OwnProp;
type State = Readonly<{

}>
type OwnPropTypes = { [K in keyof OwnProp]: PropType.Requireable<OwnProp[K]>;}
