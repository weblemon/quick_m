/**
 * @class ListCell Component
 * @date 2019/7/6 10:58
 * @author RanYunlong
 */

import Taro , { Component } from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import PropType from "prop-types";
import "./ListCell.less";
import {IconEnum} from "../../constants/icon.enum";
import EmptyLine from "../empty/EmptyLine";

class ListCell extends Component<Prop, State> {
  static propTypes: OwnPropTypes = {
    hasBorder: PropType.bool,
    hasArrow: PropType.bool,
    label: PropType.string,
    value: PropType.string,
    onClick: PropType.func,
  };
  public readonly state: State = {};
  public render() {
    const { label, value, hasBorder, hasArrow } = this.props;
    return (
      <View onClick={this.handleClick.bind(this)} className={hasBorder ? "list-cell bordered": "list-cell"} hoverClass="list-cell-hover" hoverStartTime={0}>
        {label ? <Text className="label">{label}</Text>: <EmptyLine width={100} />}
          <View className="value">
            {value ? (<Text>{value}</Text>): this.props.children}
          </View>
        {hasArrow ? <Image className="arrow" src={IconEnum.arrowRight} /> : null}
      </View>
    );
  }
  private handleClick() {
    if (typeof this.props.onClick === "function") this.props.onClick();
  }
}
export default ListCell;

interface OwnProp {
  label?: string;
  value?: string;
  hasBorder?: boolean;
  hasArrow?: boolean;
  onClick?: () => void;
}
type Prop = OwnProp;
type State = Readonly<{

}>
type OwnPropTypes = { [K in keyof OwnProp]: PropType.Requireable<OwnProp[K]>;}
