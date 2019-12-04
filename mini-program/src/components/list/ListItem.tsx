import Taro , { Component } from "@tarojs/taro";
import {View, Text, Image, Button} from "@tarojs/components";
import PropType from "prop-types";
import EmptyLine from "../empty/EmptyLine";
import {CommonEventFunction} from "@tarojs/components/types/common";
import {IconEnum} from "../../constants/icon.enum";
import "./ListItem.less";

class ListItem extends Component<Prop, State> {
  static propTypes: OwnPropTypes = {
    title: PropType.string,
    disabled: PropType.bool,
    desc: PropType.string,
    avatar: PropType.string,
    hasArrow: PropType.bool,
    hasBorder: PropType.bool,
    onOpenSetting: PropType.func,
    onClick: PropType.func,
    extraText: PropType.string,
  };
  public readonly state: State = {};
  public render() {
      const { title, desc, extraText, hasArrow, hasBorder, avatar, openType } = this.props;
          return (
              <Button
                onClick={this.handleClick.bind(this)}
                onOpenSetting={this.handleOpenSetting.bind(this)}
                openType={openType}
                hoverClass="list-item-hover"
                hoverStartTime={0}
                className="list-item"
              >
                  <View className={hasBorder ? "bordered border-view" : "border-view"}>
                      {
                        avatar !==undefined ? <Image className="avatar" src={avatar} /> : null
                      }
                      <View className="info">
                        {
                          title !== undefined ? (
                            <View className="title">
                              {title ? <Text>{title}</Text>: <EmptyLine width={200} />}
                            </View>
                          ): null
                        }
                        {
                          desc !== undefined ? (
                            <View className="desc">
                              {desc ? <Text>{desc}</Text> : <EmptyLine />}
                            </View>
                          ): null
                        }
                      </View>
                      {extraText !== undefined ? (
                        <View className="extra">
                          {extraText ? <Text>{extraText}</Text>: <EmptyLine width={50} />}
                        </View>
                      ): null}
                      { hasArrow !== undefined ? (<Image className="arrow" src={IconEnum.arrowRight} />): null}
                  </View>
              </Button>
          );
      }
  private handleClick() {
    if (typeof this.props.onClick === "function") {
      this.props.onClick(this.props);
    }
  }
  private handleOpenSetting(e) {
    if (typeof this.props.onOpenSetting === "function") {
      this.props.onOpenSetting(e);
    }
  }
}
export default ListItem;
interface OwnProp {
  // 元素的标题
  title?: string;
  // 是否禁用
  disabled?: boolean;
  // 元素的描述信息
  desc?: string;
  // 元素的主要缩略图
  avatar?: string;
  // 箭头的方向
  hasArrow?: boolean;
  // 额外信息的文本
  extraText?: any;
  // 是否有边框
  hasBorder?: boolean;
  // 按钮的openType类型
  openType?:  'contact' | 'share' | 'launchApp' | 'openSetting' | 'feedback';
  // click事件
  onClick?: (prop: OwnProp) => void;
  // 打开设置事件
  onOpenSetting?: CommonEventFunction;
  info?: any;
}

type Prop = OwnProp;
type State = Readonly<{}>
type OwnPropTypes = { [K in keyof OwnProp]: PropType.Requireable<OwnProp[K]>;}
