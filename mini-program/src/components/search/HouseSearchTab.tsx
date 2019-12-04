/**
 * @class HouseSearchTab Component
 * @date 2019/6/29 18:59
 * @author RanYunlong
 */

import Taro , { Component } from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import PropType from "prop-types";
import "./HouseSearchTab.less";
import {IconEnum} from "../../constants/icon.enum";

class HouseSearchTab extends Component<Prop, State> {
  static propTypes: OwnPropTypes = {
    defaultActive: PropType.any,
    list: PropType.array,
    onChange: PropType.func,
  };
  static defaultProps: OwnProp = {
      defaultActive: "",
      list: [],
  };
  public readonly state: State = {};
  public render() {
    const { list, defaultActive } = this.props;
    const { active } = this.state;
    return (
      <View className="house-search-tab">
        {
          list.map(item => {
            return (
              <View
                onClick={() => {
                  if (typeof this.props.onChange === "function") {
                    this.props.onChange(item);
                  }
                  this.setState({
                    active: item
                  })
                }}
                key={item}
                className={item === (active || defaultActive) ? "item active": "item"}
              >
                {item}<Image src={IconEnum.arrowDown}/>
              </View>
            )
          })
        }

      </View>
    );
  }
}
export default HouseSearchTab;

interface OwnProp {
  defaultActive: any;
  list: string[];
  onChange?: (value: string) => void;
}
type Prop = OwnProp;
type State = Readonly<{
  active?: any;
}>
type OwnPropTypes = { [K in keyof OwnProp]: PropType.Requireable<OwnProp[K]>;}
