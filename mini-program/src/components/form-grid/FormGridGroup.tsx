/**
 * @class FormGridGroup Component
 * @date 2019/7/6 11:22
 * @author RanYunlong
 */

import Taro , { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import PropType from "prop-types";
import "./FormGridGroup.less";

class FormGridGroup extends Component<Prop, State> {
  static propTypes: OwnPropTypes = {
    className: PropType.string,
  };
  public readonly state: State = {};
  public render() {
    return (
      <View className="form-grid-group">
        {this.props.children}
      </View>
    );
  }
}
export default FormGridGroup;

interface OwnProp {
  className?: string;
}
type Prop = OwnProp;
type State = Readonly<{

}>
type OwnPropTypes = { [K in keyof OwnProp]: PropType.Requireable<OwnProp[K]>;}
