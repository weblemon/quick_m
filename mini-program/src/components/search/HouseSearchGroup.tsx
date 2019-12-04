/**
 * @class HouseSearchGroup Component
 * @date 2019/6/29 16:23
 * @author RanYunlong
 */

import Taro , { Component } from "@tarojs/taro";
import {View, Text, Button} from "@tarojs/components";
import PropType from "prop-types";
import "./HouseSearchGroup.less";

class HouseSearchGroup extends Component<Prop, State> {
  static propTypes: OwnPropTypes = {
    label: PropType.string,
    options: PropType.array,
    onChange: PropType.func,
    checked: PropType.object as any,
  };
  static defaultProps: OwnProp = {
      label: "标题",
      options: [],
      checked: {
        index: 0,
      },
  };
  public readonly state: State = {};
  public render() {
    const { label, options, checked } = this.props;
    return (
      <View className="house-search-group">
        <View className="header">
          <Text className="label">{label}</Text>
        </View>
        <View className="list">
          {
            options.map((item, index) => {
              return (
                <Button
                  onClick={() => {
                    this.handleSelect(index, item);
                  }}
                  key={item.value}
                  size="mini"
                  className={index === checked.index ? "active" : ""}>
                  {item.label}
                </Button>
              )
            })
          }
        </View>
      </View>
    );
  }
  private handleSelect(index: number, detail: HouseSearchGroupItem) {
    this.setState({
      active: index
    });
    if (typeof this.props.onChange === "function") {
      this.props.onChange({
        index,
        detail,
      });
    }
  }
}
export default HouseSearchGroup;

interface OwnProp {
  // 标题
  label: string;
  // 项目
  options: HouseSearchGroupItem[];
  // 默认选中元素
  checked: Checked;
  // 更新事件
  onChange?: (checked: Checked) => void;
}
type Prop = OwnProp;
type State = Readonly<{}>
type OwnPropTypes = { [K in keyof OwnProp]: PropType.Requireable<OwnProp[K]>;}

export interface HouseSearchGroupItem<T = any> {
  label: string;
  value: T;
}

export interface  Checked<T = any> {
  index: number;
  detail?: HouseSearchGroupItem<T>;
}
