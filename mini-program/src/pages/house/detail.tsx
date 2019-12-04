/**
 * 房源详情页面
 * @class HouseDetailPage Page
 * @date 2019/7/4 15:13
 * @author RanYunlong
 */
// eslint-disable-next-line no-unused-vars
import Taro, {Component, Config} from "@tarojs/taro";
import {Button, CoverImage, CoverView, Image, Map, Swiper, SwiperItem, Text, View} from "@tarojs/components";
import "./detail.less";
import logo from "../../assets/images/login.jpg";
import Pane from "../../components/pane/Pane";
import {QueryHouse, queryHousingResources} from "../../apis/house";
import EmptyLine from "../../components/empty/EmptyLine";
import {getHouseingName} from "../../constants/house.houseingtype.enum";
import {getHouseDecoration} from "../../constants/house.decoration.enum";
import {getHouseOrientationName} from "../../constants/house.orientation.enum";
import {getHouseDoorLookType} from "../../constants/house.doorlook.enum";
import {getHouseFloorTypeName} from "../../constants/house.floor.enum";
import {getHouseElevator} from "../../constants/house.elevator.enum";
import {formatHouseDate} from "../../utils/formatDate";
import {IReduxStore} from "../../reducers";
import {connect} from "@tarojs/redux";
import { IconEnum } from "../../constants/icon.enum";
import {getHouseType} from "../../constants/house.type.enum";
import {deleteCollection, saveCollection} from "../../apis/collection";
import {saveBrowse} from "../../apis/browse";
import List from "../../components/list/List";
import ListItem from "../../components/list/ListItem";
import {queryClickSum, saveCall, saveClick} from "../../apis/count";
import {share} from "../../utils/share";

const mapStateToProps = (store: IReduxStore) => {
  return {
    location: store.app.location,
    userInfo: store.app.userInfo,
    baseUserInfo: store.app.baseUserInfo,
    rule: store.app.rule,
  }
};
const mapDispatchToProps = {};

@connect(
  mapStateToProps,
  mapDispatchToProps
)
class HouseDetailPage extends Component<Props, State> {
  public config: Config = {
      navigationBarTitleText: "详情",
      enablePullDownRefresh: false,
  };
  public readonly state: State =  {
    startTime: new Date(),
    clickCount: 0,
    current: 0,
  };
  public componentDidShow(): void {
    this.getHouseInfo();
  }
  public componentWillUnmount(): void {
    // 计算浏览时长
    const endTime = new Date();
    const browseTime = endTime.getTime() - this.state.startTime.getTime();
    const { houseInfo } = this.state;
    const { userInfo } = this.props;
    /**
     * 添加浏览记录
     * 1. 用户必须已登录
     * 2. 用户不能给自己添加浏览记录
     */
    if (houseInfo) {
      if (userInfo && userInfo.id !== houseInfo.user.id && !houseInfo.isPower) {
        saveBrowse({
          userId: userInfo.id,
          housesId: houseInfo.id,
          browseTime,
        });
      }
      saveClick(houseInfo.id);
    }

  }
  public onShareAppMessage(): Taro.ShareAppMessageReturn {
    if (!this.state.houseInfo) return {};
    return share(this.state.houseInfo.houseTitle, `/pages/house/detail?id=${this.state.houseInfo.id}`)
  }
  public render() {
    const { userInfo } = this.props;
    const { houseInfo, clickCount, current } = this.state;
    if (houseInfo) {
      const houseType = houseInfo.houseType ? getHouseType(houseInfo.houseType): "1室0厅0卫";
      return (
        <View className="page">
          <View className="photo-view">
            <Button className="share" openType="share" hoverStartTime={0} hoverClass="hover">
              <Image src={IconEnum.share} />
            </Button>
            <Swiper current={current} onChange={(e) => this.setState({current: e.detail.current})}>
              {
                houseInfo.housePhotos && houseInfo.housePhotos.length > 0 ? (
                  (houseInfo.housePhotos|| "").split(",").map((item, index) => {
                    return (
                      <SwiperItem key={index} onClick={this.previewImage.bind(this)}>
                        <Image mode="aspectFill" lazyLoad={true} src={item} />
                      </SwiperItem>
                    )
                  })
                ): (
                  <SwiperItem>
                    <Image mode="aspectFill" src={logo} />
                  </SwiperItem>
                )
              }
            </Swiper>
          </View>
          <View className="house-info">
            <View className="header">
              <View className="row">
                <Text className="title">{houseInfo.houseTitle}</Text>
                <View className="item">
                  <View className="text">{formatHouseDate(houseInfo.rawAddTime)}</View>
                </View>
              </View>
              <View className="row">
                <View className="item">
                  <View className="label">房源编号</View>
                  <View className="text">{houseInfo.id}</View>
                </View>
                <View className="item">
                  <View className="label">访问量</View>
                  <View className="text">{clickCount}</View>
                </View>
              </View>
            </View>
            <View className="main">
              <View className="row">
                <View className="col">
                  <View className="value">
                    <Text>{houseType.substr(0, 1)}</Text>
                    <Text className="unit">室</Text>
                    <Text>{houseType.substr(2, 1)}</Text>
                    <Text className="unit">厅</Text>
                    <Text>{houseType.substr(4, 1)}</Text>
                    <Text className="unit">卫</Text>
                  </View>
                  <Text className="label">户型</Text>
                </View>

                <View className="col">
                  <View className="value">
                    <Text>{houseInfo.houseArea}</Text>
                    <Text className="unit">m²</Text>
                    <Text className="unit">+赠送</Text>
                    <Text>{houseInfo.houseAreaPlus}</Text>
                    <Text className="unit">m²</Text>
                  </View>
                  <Text className="label">面积</Text>
                </View>
              </View>
              <View className="row">
                <View className="col">
                  <View className="value">
                    {getHouseDecoration(houseInfo.houseDecoration)}
                  </View>
                  <Text className="label">配置</Text>
                </View>
                <View className="col">
                  <View className="value">
                    <Text>{houseInfo.price}</Text>
                    <Text className="unit">万</Text>
                  </View>
                  <Text className="label">售价</Text>
                </View>
              </View>
              {
                !houseInfo.isPower ? (
                  <View className="row">
                    <View className="col">
                      <View className="value">{ getHouseOrientationName(houseInfo.houseOrientation)}</View>
                      <Text className="label">朝向</Text>
                    </View>

                    <View className="col">
                      <View className="value">{ getHouseDoorLookType(houseInfo.houseDoorLookType)}</View>
                      <Text className="label">钥匙</Text>
                    </View>
                  </View>
                ): null
              }
              <View className="row">
                <View className="col">
                  <Text className="value">
                    {getHouseingName(houseInfo.housingType)} {!houseInfo.isPower ? getHouseFloorTypeName(houseInfo.houseFloor): ""} {!houseInfo.isPower ? getHouseElevator(houseInfo.houseElevator) + "电梯": ""}
                  </Text>
                  <Text className="label">类型</Text>
                </View>
              </View>
              <View className="row">
                <View className="col">
                  <Text className="value">{houseInfo.detailedAddress}</Text>
                  <Text className="label">地址</Text>
                </View>
              </View>
              <View className="row">
                <View className="col">
                  <Text className="value">{houseInfo.houseRemarks ? decodeURIComponent(houseInfo.houseRemarks) : "暂无备注信息"}</Text>
                  <Text className="label">备注</Text>
                </View>
              </View>
            </View>
          </View>
          {
            userInfo && userInfo.id === houseInfo.user.id ? (
              <List>
                <ListItem title="意向客户电话记录" hasArrow={true} onClick={this.jumpCallListPage.bind(this)} />
              </List>
            ): null
          }
          <Pane title={houseInfo.detailedAddress} value="">
            <Map
              onClick={this.openLocation.bind(this)}
              longitude={houseInfo.houseLocation.longitude}
              latitude={houseInfo.houseLocation.latitude}
              showLocation={true}
              markers={[houseInfo.houseLocation] as any}
            />
          </Pane>
          <CoverView className="house-footer">
            <CoverView className="user">
              <CoverImage onClick={() => {
                if (houseInfo.isPower) {
                 return this.showMessage();
                }
                this.jumpUserCardPage()
              }} className="avatar" src={houseInfo.user && !houseInfo.isPower && houseInfo.user.avatarUrl ? houseInfo.user.avatarUrl: (houseInfo.user.gender === 0 ? IconEnum.woman : IconEnum.man)} />
              <CoverView onClick={() => {
                if (houseInfo.isPower) {
                  return this.showMessage();
                }
                this.jumpUserCardPage()
              }} className="text">{houseInfo.user && !houseInfo.isPower ? (houseInfo.user.realName || houseInfo.user.nickName || "用户" + houseInfo.user.id): "用户****"}</CoverView>
            </CoverView>
            <CoverView className="btn-group">
              <Button size="mini" openType="share" type="warn">分享</Button>
              { userInfo && houseInfo.user.id !== userInfo.id && !houseInfo.isPower ? (
                houseInfo.isCollect ? (
                  <Button
                    size="mini"
                    className="collection"
                    hoverClass="hover"
                      onClick={() => {
                        this.handleCollection()
                      }}
                     type="default"
                  >
                    取消收藏
                  </Button>
                ): (
                  <Button
                    size="mini"
                    className="collection"
                    hoverClass="hover"
                    onClick={() => {
                      this.handleCollection()
                    }}
                    type="default"
                  >
                    收藏房源
                  </Button>
                )
              ): null}

              { userInfo && houseInfo.user.id === userInfo.id ? (
                <Button
                  size="mini"
                  onClick={this.handleEdit.bind(this)}
                  type="primary"
                >
                  编辑
                </Button>
              ): (
                <Button
                  size="mini"
                  onClick={this.makePhoneCall.bind(this)}
                  type="primary"
                >
                  联系
                </Button>
              )}
            </CoverView>
          </CoverView>
        </View>
      )
    }

    return (
        <View className="page">
          <View className="photo-view">
            <View className="share" hoverStartTime={0} hoverClass="hover" />
            <Swiper>
              <SwiperItem>
                <Image mode="aspectFill" src={logo} />
              </SwiperItem>
            </Swiper>
          </View>
          <View className="house-info">
            <View className="header">
              <View className="row">
                <EmptyLine width={200} />
                <View className="item">
                  <EmptyLine width={100} />
                </View>
              </View>

              <View className="row">
                <View className="item">
                  <EmptyLine width={260} />
                </View>
                <View className="item">
                  <EmptyLine width={100} />
                </View>
              </View>
            </View>
            <View className="main">
              <View className="row">
                <View className="col">
                  <View className="value">
                    <EmptyLine height={40} width={200} />
                  </View>
                  <EmptyLine width={50} />
                </View>
                <View className="col">
                  <View className="value">
                    <EmptyLine height={40} width={200} />
                  </View>
                  <EmptyLine width={50} />
                </View>
              </View>
              <View className="row">
                <View className="col">
                  <View className="value">
                    <EmptyLine width={300} />
                  </View>
                  <EmptyLine width={50} />
                </View>
                <View className="col">
                  <View className="value">
                    <EmptyLine height={40} width={200} />
                  </View>
                  <EmptyLine width={50} />
                </View>
              </View>
              <View className="row">
                <View className="col">
                  <View className="value">
                    <EmptyLine width={300} />
                  </View>
                  <EmptyLine width={50} />
                </View>
              </View>
              <View className="row">
                <View className="col">
                  <View className="value">
                    <EmptyLine width={300} />
                  </View>
                  <EmptyLine width={50} />
                </View>
              </View>
              <View className="row">
                <View className="col">
                  <View className="value">
                    <EmptyLine width={700} />
                    <EmptyLine width={100} />
                  </View>
                  <EmptyLine width={50} />
                </View>
              </View>
            </View>
          </View>
          <Pane />
          <CoverView className="house-footer">
              <CoverView className="user">
                <CoverImage className="avatar" src={IconEnum.avatar} />
                <CoverView className="text-empty" />
              </CoverView>
          </CoverView>
        </View>
    )
  }
  /**
   * 获取房源详情
   */
  private async getHouseInfo() {
    const query: any = {
      id: this.$router.params.id
    };
    this.getClickCount(query.id);
    if (this.props.userInfo) {
      query.userId = this.props.userInfo.id;
    }
    const response = await queryHousingResources(query);
    const { success, data } = response.data;
    if (data.isPower) {
      Taro.showModal({
        title: "提示",
        content: "您暂无权访问本地区房源详情,请联系客服获取本地区的访问码，是否去设置？",
        confirmText: "确认",
        cancelText: "取消",
      }).then(res => {
        if (res.confirm) {
          Taro.redirectTo({
            url: "/pages/mine/active"
          })
        }
      })
    }
    if (success) {
      this.setState({
        houseInfo: data
      });
    }
  }
  /**
   * 获取房源点击量
   */
  private async getClickCount(id: number) {
    const { data } = await queryClickSum(id);
    this.setState({
      clickCount: data.data
    })
  }
  /**
   * 打开定位导航界面
   */
  private async openLocation() {
    if (this.auth()) return this.showMessage();
    if (!this.props.userInfo) {
      return Taro.showModal({
        title: "提示",
        content: "登录后才能执行该操作，是否去登录？"
      }).then(res => {
        if (res.confirm) {
          Taro.navigateTo({
            url: "../mine/login"
          })
        }
      })
    }
    const { houseInfo } = this.state;
    if (houseInfo) {
      const { houseLocation, detailedAddress } = houseInfo;
      if (!houseInfo.isPower) {
        return Taro.openLocation({
          latitude: houseLocation.latitude,
          longitude: houseLocation.longitude,
          address: detailedAddress,
        })
      } else {
        Taro.showModal({
          title: "提示",
          content: "您暂无权访问本地区房源详情,请联系客服获取本地区的访问码，在“我的”->“开通地区”中填入访问码并激活",
          confirmText: "联系客服",
          cancelText: "取消",
        }).then(res => {
          if (res.confirm) {
            Taro.switchTab({
              url: "/pages/mine/index"
            })
          }
        })
      }

    }
  }
  /**
   * 拨打电话
   */
  private async makePhoneCall() {
    if (this.auth()) return this.showMessage();
    if (!this.props.userInfo) {
      return Taro.showModal({
        title: "提示",
        content: "登录后才能执行该操作，是否去登录？"
      }).then(res => {
        if (res.confirm) {
          Taro.navigateTo({
            url: "../mine/login"
          })
        }
      })
    } else if (this.props.userInfo.type === 1) {
      return Taro.showModal({
        title: "提示",
        content: "暂未开放房东联系房东！"
      })
    } else if (this.props.userInfo.type ===  2 && this.props.rule === 3) {
      return Taro.showModal({
        title: "提示",
        content: "仅授权用户可访问！"
      })
    }
    const { houseInfo } = this.state;
    if (houseInfo) {
      if (houseInfo.user.sparePhone) {
        const itemList = [houseInfo.user.phone, houseInfo.user.sparePhone];
        return Taro.showActionSheet({
          itemList
        }).then(({tapIndex}) => {
          Taro.makePhoneCall({
            phoneNumber: itemList[tapIndex]
          }).then(() => {
            saveCall(houseInfo.id, itemList[tapIndex], this.props.userInfo ? this.props.userInfo.id: "");
          })
        })
      }
      Taro.makePhoneCall({
        phoneNumber: houseInfo.user.phone
      }).then(() => {
        saveCall(houseInfo.id, (houseInfo.user as any).phone, this.props.userInfo ? this.props.userInfo.id: "");
      })
    }
  }
  /**
   * 处理收藏
   */
  private async handleCollection() {
    if (this.auth()) return this.showMessage();
    const { userInfo } = this.props;
    if (!userInfo) {
      return  Taro.showModal({
        title: "提示",
        content: "登录后才能收藏哦，要登录吗？"
      }).then(res => {
        if (res.confirm) {
          Taro.navigateTo({
            url: "/pages/mine/login"
          })
        }
      })
    }
    if (!this.state.houseInfo) return ;
    const { isCollect, id } = this.state.houseInfo;
    this.setState({
      houseInfo: {
        ...this.state.houseInfo,
        isCollect: !isCollect
      }
    });
    if (!isCollect) {
      await saveCollection({
        userId: userInfo.id,
        housesId: id
      });
    } else {
      await deleteCollection({
        userId: userInfo.id,
        housesId: id
      })
    }
  }
  /**
   * 处理编辑房源
   */
  private async handleEdit() {
    if (!this.state.houseInfo) return;
    Taro.navigateTo({
      url: `/pages/house/publish?id=${this.state.houseInfo.id}`
    })
  }
  private auth() {
    return this.state.houseInfo && this.state.houseInfo.isPower;
  }
  private previewImage() {
    const { houseInfo, current } = this.state;
    if (houseInfo && houseInfo.housePhotos) {
      const urls = houseInfo.housePhotos.split(",");
      Taro.previewImage({
        urls,
        current: current.toString(),
      })
    }
  }
  private async showMessage() {
    Taro.showModal({
      title: "提示",
      content: "仅限开通了本地区访问权限的中介用户可查看本信息！"
    })
  }
  /**
   * 跳转到用户名片页面
   */
  private async jumpUserCardPage() {
    if (!this.state.houseInfo) return;
    return Taro.navigateTo({
      url: `/pages/user/card?id=${this.state.houseInfo.user.id}`
    })
  }
  /**
   * 处理编辑
   */
  private async jumpCallListPage() {
    if (!this.state.houseInfo) return ;
    Taro.navigateTo({
      url: `./call?id=${this.state.houseInfo.id}`
    })
  }
}

export default HouseDetailPage

type OwnProps = {};
type State = Readonly<{
  houseInfo?: QueryHouse.HouseInfo;
  startTime: Date;
  clickCount: number;
  current: number;
}>;
type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps & OwnProps;
