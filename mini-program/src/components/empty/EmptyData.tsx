/**
 * @class EmptyData Component
 * @date 2019/7/13 23:30
 * @author RanYunlong
 */

import Taro , { Component } from "@tarojs/taro";
import { View, Image, Text } from "@tarojs/components";
import PropType from "prop-types";
import {IconEnum} from "../../constants/icon.enum";
import "./EmptyData.less";

class EmptyData extends Component<Prop, State> {
  static propTypes: OwnPropTypes = {
    value: PropType.string
  };
  public readonly state: State = {};
  public render() {
    const { value } = this.props;
    return (
      <View className="empty-data">
        <Image src={IconEnum.empty} />
        <Text>{value}</Text>
        {this.props.children}
      </View>
    );
  }
}
export default EmptyData;

interface OwnProp {
  value: string;
}
type Prop = OwnProp;
type State = Readonly<{

}>
type OwnPropTypes = { [K in keyof OwnProp]: PropType.Requireable<OwnProp[K]>;}
