/**
 * @class HouseSearch Component
 * @date 2019/6/29 14:40
 * @author RanYunlong
 */

import Taro , { Component } from "@tarojs/taro";
import {Button, View, Text, Input, Picker} from "@tarojs/components";
import PropType from "prop-types";
import "./HouseSearch.less";
import Search from "./Search";
import HouseSearchGroup, {Checked} from "./HouseSearchGroup";
import HouseSearchTab from "./HouseSearchTab";
import {BaseEventOrig} from "@tarojs/components/types/common";
import HouseSearchHistory from "./HouseSearchHistory";
import houseSearchConstans from '../../constants/house.search.constans';
import {QueryHouse} from "../../apis/house";
import {GlobalEnum} from "../../constants/global.enum";
import {getHouseType, houseTypeEnum} from "../../constants/house.type.enum";

class HouseSearch extends Component<Prop, State> {
  static propTypes: OwnPropTypes = {
    onConfirm: PropType.func,
  };
  public readonly state: State = {
    tabActive: "历史",
    query: {} as any,
    historys: [],
    checked: {
      price: {index: 0},
      houseType: { index: 0},
      orientation: {index: 0},
      houseing: {index: 0},
      decoration: {index: 0},
      area: {index: 0},
    },
    houseTypePicker: [],
  };
  public render() {
    const { tabActive, searchIng, checked, query, historys, houseTypePicker } = this.state;
    return (
      <View className="house-search">
        {
          searchIng ? (
            <View className="searching" onClick={this.handleCancel.bind(this)}>
              <View className="view" onClick={(e) => e.stopPropagation()}>
                <View className="search-bar">
                  <Search onConfirm={this.handleInputConfirm.bind(this)} value={query.search ? query.search as any : ""} onClear={this.handleInput.bind(this)} onInput={this.handleInput.bind(this)} focus={searchIng} placeholder="搜索地区/小区名" />
                  <Button onClick={this.handleCancel.bind(this)} size="mini">取消</Button>
                </View>
                <HouseSearchTab
                  defaultActive={tabActive}
                  list={houseSearchConstans.tabs}
                  onChange={this.handleTabChange.bind(this)}
                />
                {
                  tabActive === "历史" ? (
                    <View className="item">
                      <HouseSearchHistory onRemove={this.handleHistoryRemove.bind(this)} onSelect={this.handleHistorySelect.bind(this)}  options={historys} />
                      <View className="footer">
                        <View className="btn-group">
                          <Button onClick={this.clear.bind(this)} size="mini">清空</Button>
                          <Button onClick={this.onConfirm.bind(this)} hoverClass="hover" className="confirm" size="mini">确认</Button>
                        </View>
                      </View>
                    </View>
                  ): null
                }
                {
                  tabActive === "售价" ? (
                    <View className="item">
                      <HouseSearchGroup
                        label="售价"
                        checked={checked.price}
                        options={houseSearchConstans.priceRange}
                        onChange={this.onPriceChange.bind(this)}
                      />
                      <View className="footer">
                        <View className="custom">
                          <Text className="label">自定义售价</Text>
                          <View className="input-group">
                            <Input value={query.startPrice as string} onInput={this.handleHouseStartPriceInput.bind(this)} type="digit" placeholder="起始价格" />
                            <Text>至</Text>
                            <Input value={query.endPrice as string} onInput={this.handleHouseEndPriceInput.bind(this)} type="digit" placeholder="结束价格" />
                            <Text>万</Text>
                          </View>
                        </View>
                        <View className="btn-group">
                          <Button onClick={this.clear.bind(this)} size="mini">清空</Button>
                          <Button onClick={this.onConfirm.bind(this)} hoverClass="hover" className="confirm" size="mini">确认</Button>
                        </View>
                      </View>
                    </View>
                  ): null
                }
                {
                  tabActive === "户型" ? (
                    <View className="item">
                      <HouseSearchGroup
                        label="户型"
                        checked={checked.houseType}
                        onChange={this.onHouseTypeChange.bind(this)}
                        options={houseSearchConstans.houseTypeRange}
                      />
                      <HouseSearchGroup
                        label="朝向"
                        checked={checked.orientation}
                        onChange={this.onOrientationChange.bind(this)}
                        options={houseSearchConstans.orientationRange}
                      />
                      <View className="footer">
                        <View className="custom">
                          <Text className="label">自定义户型</Text>
                          <View className="input-group">
                            <Picker mode="multiSelector" onChange={this.handleHouseTypePickerChange.bind(this)} value={houseTypePicker} range={houseTypeEnum}>
                              {houseTypePicker.length > 0 ? getHouseType(houseTypePicker) : "请选择户型"}
                            </Picker>
                          </View>
                        </View>
                        <View className="btn-group">
                          <Button onClick={this.clear.bind(this)} size="mini">清空</Button>
                          <Button onClick={this.onConfirm.bind(this)} hoverClass="hover" className="confirm" size="mini">确认</Button>
                        </View>
                      </View>
                    </View>
                  ): null
                }
                {
                  tabActive === "更多" ? (
                    <View className="item">
                      <HouseSearchGroup
                        label="类型"
                        checked={checked.houseing}
                        onChange={this.onHouseingChange.bind(this)}
                        options={houseSearchConstans.houseingRange}
                      />
                      <HouseSearchGroup
                        label="装修"
                        checked={checked.decoration}
                        onChange={this.onDecroationChange.bind(this)}
                        options={houseSearchConstans.decorationRange}
                      />
                      <HouseSearchGroup
                        label="面积"
                        checked={checked.area}
                        onChange={this.onAreaChange.bind(this)}
                        options={houseSearchConstans.areaRange}
                      />
                      <View className="footer">
                        <View className="custom">
                          <Text className="label">自定义面积</Text>
                          <View className="input-group">
                            <Input value={query.startHouseArea as string} onInput={this.handleHouseStartAreaInput.bind(this)} type="digit" placeholder="起始面积" />
                            <Text>至</Text>
                            <Input value={query.endHouseArea as string} onInput={this.handleHouseEndAreaInput.bind(this)} type="digit" placeholder="结束面积" />
                            <Text>m²</Text>
                          </View>
                        </View>
                        <View className="btn-group">
                          <Button onClick={this.clear.bind(this)} size="mini">清空</Button>
                          <Button onClick={this.onConfirm.bind(this)} hoverClass="hover" className="confirm" size="mini">确认</Button>
                        </View>
                      </View>
                    </View>
                  ): null
                }

              </View>
            </View>
          ): (
            <Search
              disabled={true}
              onClear={this.handleInput.bind(this)}
              value={query.search ? query.search as any : ""}
              onClick={this.handleFocus.bind(this)}
              placeholder="搜索地区/小区名"
            />
          )
        }
      </View>
    );
  }
  /**
   * 清空条件
   * @param isConfirm 是否提交
   */
  public clear(isConfirm?: boolean) {
    this.setState({
      checked: {
        price: {index: 0},
        houseType: { index: 0},
        orientation: {index: 0},
        houseing: {index: 0},
        decoration: {index: 0},
        area: {index: 0},
      },
      query: {} as any,
    }, () => {
      if (isConfirm) this.onConfirm()
    })
  }
  /**
   * 自定义户型
   * @param e
   */
  private handleHouseTypePickerChange(e: BaseEventOrig<{value: number[]}>) {
    const { query } = this.state;
    if (query.hType) {
      delete query.hType;
    }
    this.setState({
      houseTypePicker: e.detail.value,
      query: {
        ...query,
        houseType: e.detail.value.join(",")
      },
      checked: {
        houseType: {
          index: 0
        }
      }
    })
  }
  private handleHouseStartPriceInput(e: BaseEventOrig<{value: string}>) {
    // const { endPrice } = this.state.query;
    if (e.detail.value.length > 0) {
      this.setQuery({
        startPrice: e.detail.value,
        // endPrice: endPrice && endPrice >= e.detail.value ? endPrice : e.detail.value
        // endPrice,
      } as any)
      this.setState({
        checked: {
          price: {
            index: 0
          }
        }
      })
    }
  }
  private handleHouseEndPriceInput(e: BaseEventOrig<{value: string}>) {
    // const { startPrice } = this.state.query;
    if (e.detail.value.length > 0) {
      // this.setQuery({
      //   startPrice: startPrice && startPrice < e.detail.value ? startPrice : e.detail.value ,
      //   endPrice: e.detail.value
      // } as any)
      this.setQuery({
        // startPrice,
        endPrice: e.detail.value
      } as any);
      this.setState({
        checked: {
          price: {
            index: 0
          }
        }
      })
    }
  }
  private handleHouseStartAreaInput(e: BaseEventOrig<{value: string}>) {
    // const { endHouseArea } = this.state.query;
    if (e.detail.value.length > 0) {
      this.setQuery({
        startHouseArea: e.detail.value,
        // endHouseArea
        // endHouseArea: endHouseArea && endHouseArea >= e.detail.value ? endHouseArea : e.detail.value
      } as any)
      this.setState({
        checked: {
          area: {
            index: 0
          }
        }
      })
    }
  }
  private handleHouseEndAreaInput(e: BaseEventOrig<{value: string}>) {
    // const { startHouseArea } = this.state.query;
    if (e.detail.value.length > 0) {
      this.setQuery({
        // startHouseArea,
        // startHouseArea: startHouseArea && startHouseArea < e.detail.value ? startHouseArea : e.detail.value ,
        endHouseArea: e.detail.value
      } as any)
      this.setState({
        checked: {
          area: {
            index: 0
          }
        }
      })
    }
  }
  /**
   * 处理提交
   */
  private onConfirm() {
    const { historys, query } = this.state;

    if (query && query.startPrice && query.endPrice) {
      const { startPrice = 0, endPrice = 0 } = query;
      if (startPrice> endPrice) {
        this.setState({
          tabActive: "售价"
        })
        return Taro.showToast({
          title: "您输入的价格区间有误！",
          icon: "none"
        })
      }
    }
    console.log(query);
    if (query.startHouseArea === "") delete  query.startHouseArea;
    if (query.endHouseArea === "") delete query.endHouseArea;
    if (query.startPrice === "") delete query.startPrice;
    if (query.endPrice === "") delete  query.endPrice;

    if (query && query.startHouseArea && query.endHouseArea) {
      const { startHouseArea = 0, endHouseArea = 0 } = query
      if (startHouseArea > endHouseArea) {
        this.setState({
          tabActive: "更多"
        })
        return Taro.showToast({
          title: "您输入的面积区间有误！",
          icon: "none"
        })
      }
    }
    if (query.search && typeof query.search === "string") {
      const index = historys.findIndex(item => item === query.search);
      if (index !== -1) {
        historys.splice(index, 1);
      }
      historys.unshift(query.search);
      if (historys.length > 8) {
        historys.pop();
      }
    }
    this.setState({
      searchIng: false,
      focus: false,
      historys: [...historys]
    });
    Taro.setStorageSync(GlobalEnum.searchHistory, JSON.stringify(historys));
    if (typeof this.props.onConfirm === "function") {
      const data: any = {};
      Object.keys(this.state.query).forEach(key => {
        if (this.state.query[key] !== null) {
          data[key] = this.state.query[key];
        }
      })
      this.props.onConfirm(data);
    }
  }
  /**
   * 处理选项卡修改
   * @param key
   */
  private handleTabChange(key: string) {
    this.setState({
      tabActive: key
    })
  }
  /**
   * 处理获取焦点
   */
  private handleFocus(){
    let historys: string[] = [];
    const storeHistorys = Taro.getStorageSync(GlobalEnum.searchHistory);;
    if (storeHistorys) {
      historys = JSON.parse(storeHistorys);
    }
    this.setState({
      searchIng: true,
      historys
    })
  }
  /**
   * 处理取消
   * @param e
   */
  private handleCancel(e: BaseEventOrig<any>) {
    e.stopPropagation();
    this.setState({
      searchIng: false,
      focus: false
    })
  }
  /**
   * 处理价格变化
   */
  private onPriceChange(checked: Checked<Array<number| undefined>>) {
    const { detail } = checked;
    if (detail && Array.isArray(detail.value)) {
      this.setQuery({
        startPrice: detail.value[0],
        endPrice: detail.value[1],
      } as any)
    } else {
      this.setQuery({
        startPrice: "",
        endPrice: "",
      } as any);
    }
    this.setState({
      checked: {
        ...this.state.checked,
        price: checked,
      }
    })
  }
  /**
   * 处理朝向变化
   * @param checked
   */
  private onOrientationChange(checked: Checked<string>) {
    const { detail } = checked;
    if (detail && typeof detail.value === "string") {
      this.setQuery({
        houseOrientation: detail.value,
      } as any)
    }
    if (detail && detail.value  == null) {
      delete this.state.query.houseOrientation
      this.setQuery(this.state.query);
    }
    this.setState({
      checked: {
        ...this.state.checked,
        orientation: checked,
      }
    })
  }
  /**
   * 处理户型变化
   * @param checked
   */
  private onHouseTypeChange(checked: Checked<number>) {
    const { detail } = checked;
    if (detail && typeof detail.value === "number") {
      if (detail.value === -1) {
        delete this.state.query.hType
        delete this.state.query.houseType
        this.setQuery(this.state.query);
      }else if (detail.value === 5) {
        this.setQuery({
          hType: 2,
          houseType: 4
        } as any)
      } else {
        this.setQuery({
          hType: 0,
          houseType: detail.value
        } as any)
      }
    }
    this.setState({
      checked: {
        ...this.state.checked,
        houseType: checked,
      },
      houseTypePicker: []
    })
  }
  /**
   * 处理类型变化
   * @param checked
   */
  private onHouseingChange(checked: Checked<string>) {
    const { detail } = checked;
    if (detail && typeof detail.value === "string") {
      this.setQuery({
        housingType: detail.value
      } as any)
    } else {
      delete this.state.query.housingType
      this.setQuery(this.state.query);
    }
    this.setState({
      checked: {
        ...this.state.checked,
        houseing: checked,
      }
    })
  }
  /**
   * 处理装修变化
   */
  private onDecroationChange(checked: Checked<number>) {
    const { detail } = checked;
    if (detail) {
        if (detail.value === 1) {
          delete (this.state.query as any).houseDecoration;
          this.setQuery({
            houseDecorations: '0,1,2,3,4',
          } as any)
        } else if (detail.value === 0) {
          delete (this.state.query as any).houseDecorations;
          // @ts-ignore
          this.setQuery({
            houseDecoration: 5
          })
        } else {
          delete this.state.query.houseDecoration;
          delete (this.state.query as any).houseDecorations;
          this.setQuery(this.state.query);
        }
    }
    this.setState({
      checked: {
        ...this.state.checked,
        decoration: checked,
      }
    })
  }
  /**
   * 处理面积变化
   * @param checked
   */
  private onAreaChange(checked: Checked<Array<number|undefined>>) {
    const { detail } = checked;
    if (detail && Array.isArray(detail.value)) {
      this.setQuery({
        startHouseArea: detail.value[0],
        endHouseArea: detail.value[1],
      } as any)
    } else {
      this.setQuery({
        startHouseArea: "",
        endHouseArea: ""
      } as any);
    }

    this.setState({
      checked: {
        ...this.state.checked,
        area: checked,
      }
    })
  }
  /**
   * 保存查询条件
   * @param params
   */
  private setQuery(params: QueryHouse.Params, callback?: () => void) {
    this.setState({
      query: {
        ...this.state.query,
        ...params,
      }
    }, () => {
      if (typeof callback === "function") {
        callback()
      }
    })
  }
  /**
   * 处理输入框确认事件
   * @param search
   */
  private handleInputConfirm(search: string) {
    this.setQuery({
      search
    } as any, () => {
      this.onConfirm();
    })
  }
  /**
   * 处理搜索框输入
   * @param search
   */
  private handleInput(search: string) {
      this.setQuery({
        search
      } as any)
  }
  /**
   * 处理历史记录选择
   * @param search
   */
  private handleHistorySelect(search: string) {
      this.setQuery({
        search
      } as any, () => {
        this.onConfirm()
      })
  }
  /**
   * 删除历史记录
   * @param index
   */
  private handleHistoryRemove(index: number) {
    const { historys } = this.state;
    historys.splice(index, 1);
    Taro.setStorageSync(GlobalEnum.searchHistory, JSON.stringify(historys));
    this.setState({
      historys: [...historys]
    })
  }
 }
export default HouseSearch;

interface OwnProp {
  onConfirm?: (query: QueryHouse.Params) => void;
}
type Prop = OwnProp;
type State = Readonly<{
  searchIng?: boolean;
  tabActive: string;
  focus?: boolean;
  query: QueryHouse.Params;
  historys: string[];
  houseTypePicker: number[];
  checked: {
    [key: string]: Checked;
  }
}>
type OwnPropTypes = { [K in keyof OwnProp]: PropType.Requireable<OwnProp[K]>;}
