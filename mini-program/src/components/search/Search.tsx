import Taro , { Component } from '@tarojs/taro';
import {Icon, Input, View} from '@tarojs/components';
import PropType from 'prop-types';
import './Search.less';
import {BaseEventOrig} from "@tarojs/components/types/common";

class Search extends Component<Prop, State> {
  static propTypes: OwnPropTypes = {
    onConfirm: PropType.func,
    onInput: PropType.func,
    onFocus: PropType.func,
    onBlur: PropType.func,
    onClick: PropType.func,
    defaultValue: PropType.string,
    value: PropType.string,
    focus: PropType.bool,
    disabled: PropType.bool,
  };
  public render() {
    const { placeholder, focus, value, disabled } = this.props;
    return (
      <View className="search" onClick={this.handleClick.bind(this)}>
        <Icon type="search" size="16" />
        <Input
          focus={focus}
          placeholder={placeholder}
          value={value}
          onFocus={this.handleFocus.bind(this)}
          onConfirm={this.handleConfirm.bind(this)}
          onInput={this.handleInput.bind(this)}
          onBlur={this.handleBlur.bind(this)}
          disabled={disabled}
        />
        {
          value && value.length >  0 ? <Icon type="clear" onClick={this.handleClear.bind(this)} size="16" /> : null
        }
      </View>
    );
  }

  /**
   * 处理点击事件
   */
  private handleClick() {
    if (typeof this.props.onClick === "function") {
      this.props.onClick();
    }
  }
  /**
   * 处理搜索事件
   * @param e
   */
  private handleConfirm(e: BaseEventOrig<{value: string}>) {
    if (typeof this.props.onConfirm === "function") {
      this.props.onConfirm(e.detail.value);
    }
  }
  /**
   * 处理搜索事件
   * @param e
   */
  private handleInput(e: BaseEventOrig<{value: string}>) {
    if (typeof this.props.onInput === "function") {
      this.props.onInput(e.detail.value);
    }
  }
  /**
   * 处理焦点事件
   */
  private handleFocus(e: BaseEventOrig<{value: string}>) {
    if (typeof this.props.onFocus === "function") {
      this.props.onFocus(e.detail.value);
    }
  }
  /**
   * 处理失去焦点事件
   */
  private handleBlur(e: BaseEventOrig<{value: string}>) {
    if (typeof this.props.onBlur === "function") {
      this.props.onBlur(e.detail.value);
    }
  }
  /**
   * 处理清理事件
   */
  private handleClear() {
    if (typeof this.props.onClear === "function") {
      this.props.onClear("");
    }
  }
}
export default Search;

interface OwnProp {
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  focus?: boolean;
  disabled?: boolean;
  onConfirm?: (value: string) => void;
  onInput?: (value: string) => void;
  onFocus?: (value: string) => void;
  onBlur?: (value: string) => void;
  onClear?: (value: string) => void;
  onClick?: () => void;
}
type Prop = OwnProp;
type State = Readonly<{}>
type OwnPropTypes = { [K in keyof OwnProp]: PropType.Requireable<OwnProp[K]>;}
