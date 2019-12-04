/**
 * @class ListServiceItem Component
 * @date 2019/7/14 0:02
 * @author RanYunlong
 */

import Taro , { Component } from "@tarojs/taro";
import {View, Text, Image, Button} from "@tarojs/components";
import PropType from "prop-types";
import {QueryService} from "../../apis/service";
import {IconEnum} from "../../constants/icon.enum";
import "./ListServiceItem.less";

class ListServiceItem extends Component<Prop, State> {
  static propTypes: OwnPropTypes = {
    index: PropType.number,
    info: PropType.any,
    hasFooter: PropType.bool,
    onDetail: PropType.func,
    detailText: PropType.string,
  };
  public readonly state: State = {};
  public render() {
    const { index, info, hasFooter = true, detailText = "详情" } = this.props;
    return (
      <View className="list-service-item">
        <View className={`bg bg-${index}`}>
          <Text className="title">{info.title}</Text>
          <Text className="info">{info.content}</Text>
          {info.surl ? (
            <View onClick={this.props.onDetail || this.handleLinkTo} className="link">
              <Text>{detailText}</Text>
              <Image src={IconEnum.arrow} />
            </View>
          ): (
            <View onClick={this.props.onDetail} className="link">
              <Text>{detailText}</Text>
              <Image src={IconEnum.arrow} />
            </View>
          )}
        </View>
        {
          hasFooter ? (
            <View className="bottom">
              <View className="btns">
                <Button
                  className="success"
                  openType="contact"
                  size="mini"
                  plain
                >
                  客服
                </Button>
                <Button
                  className="primary"
                  size="mini"
                  plain
                  onClick={this.handleCallPhone.bind(this)}
                >
                  电话
                </Button>
              </View>
            </View>
          ) : null
        }

      </View>
    );
  }
  private handleCallPhone() {
    Taro.makePhoneCall({
      phoneNumber: this.props.info.phone as any
    });
  }
  private handleLinkTo() {
    Taro.navigateTo({
      url: `/pages/www/index?src=${this.props.info.surl}`
    })
  }
}
export default ListServiceItem;

interface OwnProp {
  // 背景图下标
  index: number;
  // 服务详细信息
  info: QueryService.Info | any;
  hasFooter?: boolean;
  onDetail?: () => void;
  detailText?: string;
}
type Prop = OwnProp;
type State = Readonly<{

}>
type OwnPropTypes = { [K in keyof OwnProp]: PropType.Requireable<OwnProp[K]>;}
