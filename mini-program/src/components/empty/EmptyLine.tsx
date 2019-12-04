/**
 * 空行组件
 * @class EmptyLine Component
 * @date 2019/6/28 12:35
 * @author RanYunlong
 */

import Taro , { Component } from "@tarojs/taro";
import {Text} from "@tarojs/components";
import PropType from "prop-types";
import "./EmptyLine.less";

class EmptyLine extends Component<Prop, State> {
  static defaultProps: OwnProp = {
    width: 120,
    height: 20
  };
  static propTypes: OwnPropTypes = {
    height: PropType.number,
    width: PropType.number,
  };
  public readonly state: State = {};
  public render() {
      const { width, height } = this.props;
      return (
          <Text
              className="empty-line"
              style={{
                  width: Taro.pxTransform(width),
                  height: Taro.pxTransform(height),
                  borderRadius: Taro.pxTransform(5),
              }}
          >
          </Text>
      );
  }
}
export default EmptyLine;

interface OwnProp {
  height: number;
  width: number;
}
type Prop = OwnProp;
type State = Readonly<{

}>
type OwnPropTypes = { [K in keyof OwnProp]: PropType.Requireable<OwnProp[K]>;}
