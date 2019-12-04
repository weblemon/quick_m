/**
 * @class ListBuyItem Component
 * @date 2019/7/28 1:14
 * @author RanYunlong
 */

import Taro , { Component } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import PropType from "prop-types";
import "./ListBuyItem.less";
import {AtAvatar, AtButton} from "taro-ui";
import EmptyLine from "../empty/EmptyLine";

class ListBuyItem extends Component<Prop, State> {
  static propTypes: OwnPropTypes = {
    info: PropType.any,
    hasBorder: PropType.bool
  };
  public readonly state: State = {};
  public render() {
    const { info = {}, hasBorder ="" } = this.props;
    if (info.phone) {
      return (
        <View className="list-buy-item" style={{borderBottomWidth:  hasBorder ? Taro.pxTransform(1): 0}}>
          <View className="info">
            <AtAvatar circle size="small" image={info.avatarUrl}  />
            <View className="username">{info.realName || "用户" + info.id}</View>
            <AtButton type="primary" size="small" onClick={() => {
              if (info.phone) {
                Taro.makePhoneCall({
                  phoneNumber: info.phone
                })
              }
            }}>联系</AtButton>
          </View>
          <Text className="desc">
            {info.detailed}
          </Text>
        </View>
      );
    }
    return  (
      <View className="list-buy-item" style={{borderBottomWidth:  hasBorder ? Taro.pxTransform(1): 0}}>
        <View className="info">
          <AtAvatar circle size="small" />
          <View className="username">
            <EmptyLine width={100} />
          </View>
        </View>
        <View className="desc">
          <EmptyLine width={700} />
          <EmptyLine width={700} />
          <EmptyLine width={100} />
        </View>
      </View>
    )
  }
}
export default ListBuyItem;

interface OwnProp {
  info: any;
  hasBorder?: boolean;
}
type Prop = OwnProp;
type State = Readonly<{

}>
type OwnPropTypes = { [K in keyof OwnProp]: PropType.Requireable<OwnProp[K]>;}
