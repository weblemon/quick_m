/**
 * @class List Component
 * @date 2019/6/28 14:16
 * @author RanYunlong
 */

import Taro , { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import PropType from "prop-types";
import "./List.less";
import Loading from "../loading/Loading";

class List extends Component<Prop, State> {
  static propTypes: OwnPropTypes = {
    loading: PropType.bool,
    className: PropType.string,
  };
  static defaultProps: OwnProp = {
      loading: false,
  };
  public readonly state: State = {};
  public render() {
    const { loading } = this.props;
    return (
      <View className="list">
        {this.props.children}
        <Loading loading={loading} />
      </View>
    );
  }
}
export default List;

interface OwnProp {
  loading?: boolean;
  className?: string;
}
type Prop = OwnProp;
type State = Readonly<{}>;
type OwnPropTypes = { [K in keyof OwnProp]: PropType.Requireable<OwnProp[K]>;}
