/**
 * @class Pane Component
 * @date 2019/7/4 16:06
 * @author RanYunlong
 */

import Taro , { Component } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import PropType from "prop-types";
import "./Pane.less";
import EmptyLine from "../empty/EmptyLine";

class Pane extends Component<Prop, State> {
  static propTypes: OwnPropTypes = {
    title: PropType.string,
    value: PropType.string,
  };
  static defaultProps: OwnProp = {
      title: ""
  };
  public readonly state: State = {};
  public render() {
    const { title, value } = this.props;
    return (
      <View className="pane">
        <View className="header">
          <View className="title">
            {
              title.length === 0 ? (
                <EmptyLine height={30} width={300} />
              ) : (
                <Text>{title}</Text>
              )
            }

          </View>
          {
             value !== undefined ? <Text className="value">{value}</Text>: <EmptyLine width={40} />
          }
        </View>
        <View className="main">
          {this.props.children}
        </View>
      </View>
    );
  }
}
export default Pane;

interface OwnProp {
  title: string;
  value?: string;
}
type Prop = OwnProp;
type State = Readonly<{

}>
type OwnPropTypes = { [K in keyof OwnProp]: PropType.Requireable<OwnProp[K]>;}
