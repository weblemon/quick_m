/**
 * @class ListHouseItem Component
 * @date 2019/6/28 4:03
 * @author RanYunlong
 */

import Taro, {Component} from "@tarojs/taro";
import {View, Text, Button, Image} from "@tarojs/components";
import PropType from "prop-types";
import './ListHouseItem.less';
import {QueryHouse} from "../../apis/house";
import EmptyLine from "../empty/EmptyLine";
import {getHouseType} from "../../constants/house.type.enum";
import {getHouseDecoration} from "../../constants/house.decoration.enum";
import {getHouseDoorLookType} from "../../constants/house.doorlook.enum";
import {IconEnum} from "../../constants/icon.enum";
import {BaseEventOrig} from "@tarojs/components/types/common";
import {formatHouseDate} from "../../utils/formatDate";

class ListHouseItem extends Component<Prop, State> {
  static defaultProps: OwnProp = {
    hasBorder: true,
  };
  static propTypes: OwnPropTypes = {
    hasBorder: PropType.bool,
    extraTime: PropType.string,
    onSelect: PropType.func,
    onEdit: PropType.func,
    onDown: PropType.func,
    onCollection: PropType.func,
    onUp: PropType.func,
  };
  public render() {
    const {hasBorder, houseInfo, onEdit, onDown, onCollection, onUp, onRemove, extraTime} = this.props;
    const hasEdit = typeof onEdit === "function";
    const hasDown = typeof onDown === "function";
    const hasCollection = typeof onCollection === "function";
    const hasUp =  typeof onUp === "function";
    const hasRemove = typeof onRemove === "function";
    if (houseInfo) {
      return (
        <View onClick={this.handleSelect.bind(this)} className={hasBorder ? 'house-list-item bordered' : 'house-list-item'}>
          <View className="header">
            <Text className="title">{houseInfo.houseTitle}</Text>
            <View>
              {hasEdit ? (
                <Button onClick={this.handleEdit.bind(this)} type="primary" size="mini">编辑</Button>
              ) : null}
              {hasDown ? (
                <Button onClick={this.handleDown.bind(this)} type="warn" size="mini">下架</Button>
              ) : null}
              {hasUp ? (
                <Button onClick={this.handleUp.bind(this)} type="warn" size="mini">上架</Button>
              ) : null}
              {hasCollection ? (
                <Image onClick={this.handleCollcetion.bind(this)} className="collcetion" src={houseInfo.isCollect ? IconEnum.collcetioned : IconEnum.collcetion}/>
              ) : null}
              {hasRemove ? (
                <Image onClick={this.handleRemove.bind(this)} className="collcetion" src={IconEnum.delete}/>
              ): null}
            </View>
          </View>
          <View className="main">
            {getHouseType(houseInfo.houseType)} {houseInfo.houseArea}m<Text
            className="sup">2</Text>+ {houseInfo.houseAreaPlus}m<Text className="sup">2 </Text>
            {getHouseDecoration(houseInfo.houseDecoration)}{!houseInfo.isPower ? getHouseDoorLookType(houseInfo.houseDoorLookType): ""}
          </View>
          <View className="footer">
            <View className="price">
              {houseInfo.price.toFixed(1)}
              <Text className="unit">万</Text>
            </View>
            {extraTime ? <Text className="time">{extraTime}</Text>: <Text className="time">{formatHouseDate(houseInfo.rawAddTime)}</Text>}
          </View>
        </View>
      )
    }
    return (
      <View onClick={this.handleSelect.bind(this)}
            className={hasBorder ? 'house-list-item bordered' : 'house-list-item'}>
        <View className="header">
          <EmptyLine width={250} height={30}/>
        </View>
        <View className="main">
          <EmptyLine width={710}/>
          <EmptyLine width={710}/>
          <EmptyLine width={100}/>
        </View>
        <View className="footer">
          <View className="price">
            <EmptyLine width={200}/>
          </View>
          <EmptyLine width={100}/>
        </View>
      </View>
    )
  }
  private handleSelect(e: BaseEventOrig<any>) {
    e.stopPropagation();
    if (typeof this.props.onSelect === 'function' && this.props.houseInfo) {
      this.props.onSelect(this.props.houseInfo);
    }
  }
  private handleDown(e: BaseEventOrig<any>) {
    e.stopPropagation();
    if (this.props.onDown) this.props.onDown(this.props.houseInfo);
  }
  private handleEdit(e: BaseEventOrig<any>) {
    e.stopPropagation();
    if (this.props.onEdit) this.props.onEdit(this.props.houseInfo);
  }
  private handleCollcetion(e: BaseEventOrig<any>) {
    e.stopPropagation();
    if (this.props.onCollection) this.props.onCollection(this.props.houseInfo);
  }
  private handleRemove(e: BaseEventOrig<any>) {
    e.stopPropagation();
    if (this.props.onRemove) this.props.onRemove(this.props.houseInfo);
  }
  private handleUp(e: BaseEventOrig<any>) {
    e.stopPropagation();
    if (this.props.onUp) this.props.onUp(this.props.houseInfo);
  }
}

export default ListHouseItem;

interface OwnProp {
  // 是否有边框
  hasBorder: boolean;
  // 额外展示的时间 替换默认房源的时间
  extraTime?: string;
  // 房源信息
  houseInfo?: QueryHouse.HouseInfo;
  // 选择当前房源事件
  onSelect?: (info?: QueryHouse.HouseInfo) => void;
  // 编辑房源事件
  onEdit?: (info?: QueryHouse.HouseInfo) => void;
  // 房源下架事件
  onDown?: (info?: QueryHouse.HouseInfo) => void;
  // 房源收藏事件
  onCollection?: (info?: QueryHouse.HouseInfo) => void;
  // 房源重新上架事件
  onUp?: (info?: QueryHouse.HouseInfo) => void;
  // 删除历史记录事件
  onRemove?: (info?: QueryHouse.HouseInfo) => void;
}

type Prop = OwnProp;
type State = Readonly<{}>
type OwnPropTypes = { [K in keyof OwnProp]: PropType.Requireable<OwnProp[K]>; }
