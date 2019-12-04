/**
 * @class FormGrid Component
 * @date 2019/7/6 11:20
 * @author RanYunlong
 */

import Taro , { Component } from "@tarojs/taro";
import {Text, View} from "@tarojs/components";
import PropType from "prop-types";
import "./FormGrid.less";

class FormGrid extends Component<Prop, State> {
  static propTypes: OwnPropTypes = {
    title: PropType.string,
  };
  public readonly state: State = {};
  public render() {
    const {title} = this.props;
    return (
      <View className="form-grid">
        <Text className='title'>{title}</Text>
        {this.props.children}
      </View>
    );
  }
}
export default FormGrid;

interface OwnProp {
  title?: string;
}
type Prop = OwnProp;
type State = Readonly<{

}>
type OwnPropTypes = { [K in keyof OwnProp]: PropType.Requireable<OwnProp[K]>;}
