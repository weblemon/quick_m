/**
 * @class HouseSearchHistory Component
 * @date 2019/7/1 18:50
 * @author RanYunlong
 */
import Taro , { Component } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import PropType from "prop-types";
import "./HouseSearchHistory.less";
import {GlobalEnum} from "../../constants/global.enum";
import HouseSearchHistoryItem from "./HouseSearchHistoryItem";

class HouseSearchHistory extends Component<Prop, State> {
  static propTypes: OwnPropTypes = {
    onSelect: PropType.func,
    onRemove: PropType.func,
    options: PropType.array,
  };
  static defaultProps: OwnProp = {
    options: [],
  };
  public readonly state: State = {};
  public render() {
    const { options } = this.props;
    return (
      <View className="house-search-history">
        {
          options.length === 0 ? (
            <Text className="empty-line">暂无历史记录</Text>
          ):(
            options.map((value, index) => {
              return (
                <HouseSearchHistoryItem
                  value={value}
                  index={index}
                  key={index}
                  onRemove={this.handleHistoryRemove.bind(this)}
                  onSelect={this.handleHistorySelect.bind(this)}
                />
              )
            })
          )
        }
      </View>
    );
  }
  public componentWillMount(): void {
    const listStr = Taro.getStorageSync(GlobalEnum.searchHistory);
    if (listStr) {
      this.setState({
        list: JSON.parse(listStr)
      })
    }
  }
  private handleHistoryRemove(index: number, value: string) {
    if (typeof this.props.onRemove === "function") {
      this.props.onRemove(index, value);
    }
  }
  private handleHistorySelect(value: string) {
    if (typeof this.props.onSelect === "function") {
      this.props.onSelect(value);
    }
  }
}
export default HouseSearchHistory;

interface OwnProp {
  options: string[];
  onSelect?: (value: string) => void;
  onRemove?: (index: number, value: string) => void;
}
type Prop = OwnProp;
type State = Readonly<{}>
type OwnPropTypes = { [K in keyof OwnProp]: PropType.Requireable<OwnProp[K]>;}
