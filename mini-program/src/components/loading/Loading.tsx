/**
 * @class Loading Component
 * @date 2019/7/2 19:49
 * @author RanYunlong
 */

import Taro , { Component } from "@tarojs/taro";
import { View, Image, Text } from "@tarojs/components";
import PropType from "prop-types";
import './Loading.less';
import {IconEnum} from "../../constants/icon.enum";

class Loading extends Component<Prop, State> {
  static propTypes: OwnPropTypes = {
    loading: PropType.bool,
    text: PropType.string,
  };
  static defaultProps: OwnProp = {
    text: "加载中",
    loading: false
  };
  public readonly state: State = {};
  public render() {
    const { loading } = this.props;
    if (loading) {
      return (
        <View className="loading">
          <Image src={IconEnum.loading} />
          <Text>加载中</Text>
        </View>
      )
    }
    return null;
  }
}
export default Loading;

interface OwnProp {
  loading: boolean;
  text: string;
}
type Prop = OwnProp;
type State = Readonly<{

}>
type OwnPropTypes = { [K in keyof OwnProp]: PropType.Requireable<OwnProp[K]>;}
