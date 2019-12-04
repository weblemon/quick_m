/**
 * @class HouseSearchHistoryItem Component
 * @date 2019/7/2 17:44
 * @author RanYunlong
 */

import Taro , { Component } from "@tarojs/taro";
import {Image, Text, View} from "@tarojs/components";
import PropType from "prop-types";
import "./HouseSearchHistoryItem.less";
import {IconEnum} from "../../constants/icon.enum";

class HouseSearchHistoryItem extends Component<Prop, State> {
  static propTypes: OwnPropTypes = {
    value: PropType.string,
    index: PropType.number,
    onSelect: PropType.func,
    onRemove: PropType.func,
  };
  public readonly state: State = {};
  public render() {
    const { value }  = this.props;
    return (
      <View className="house-search-history-item">
        <Text onClick={this.handleSelect.bind(this)}>{value}</Text>
        <Image onClick={this.handleRemove.bind(this)} src={IconEnum.close} />
      </View>
    );
  }

  private handleRemove() {
    if (typeof this.props.onRemove === "function") {
      this.props.onRemove(this.props.index, this.props.value);
    }
  }

  private handleSelect() {
    if (typeof this.props.onSelect === "function") {
      this.props.onSelect(this.props.value);
    }
  }
}
export default HouseSearchHistoryItem;

interface OwnProp {
  value: string;
  index: number;
  onSelect?: (value: string) => void;
  onRemove?: (index: number, value: string) => void;
}
type Prop = OwnProp;
type State = Readonly<{}>
type OwnPropTypes = { [K in keyof OwnProp]: PropType.Requireable<OwnProp[K]>;}
