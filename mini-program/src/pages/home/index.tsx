/**
 * @class HomeIndexPage Page
 * @date 2019/8/19 13:54
 * @author RanYunlong
 */
// eslint-disable-next-line no-unused-vars
import Taro, {Component, Config} from "@tarojs/taro";
import {View, Image, Text, Button, Swiper, SwiperItem, OpenData} from "@tarojs/components";
import {IReduxStore} from "../../reducers";
import "./index.less";
import {connect} from "@tarojs/redux";
import {HomeIconEnum} from "../../enum/home.icon.enum";
import {UserTypeEnum} from "../../enum/user.type.enum";
import {syncLocationAction} from "../../actions/SyncLocationAction";
import {syncRuleAction} from "../../actions/SyncRuleAction";
import {syncUserInfoAction} from "../../actions/SyncUserInfoAction";

const mapStateToProps = (store: IReduxStore) => {
  const { userInfo, baseUserInfo, location, token, rule } = store.app;
  return {
    userInfo,
    baseUserInfo,
    location,
    token,
    rule,
  }
};
const mapDispatchToProps = {
  syncUserInfo: syncUserInfoAction,
  syncRule: syncRuleAction,
  syncLocation: syncLocationAction,
};


@connect(
  mapStateToProps,
  mapDispatchToProps
)
class HomeIndexPage extends Component<Props, State> {
  public config: Config = {
    navigationBarTitleText: "快马好房",
    enablePullDownRefresh: false
  };
  public componentWillMount(): void {
    if (!this.props.location) {
      this.props.syncLocation();
    }
    // 通过分享链接跳转页面
    if (this.$router.params.jumpPath) {
      Taro.navigateTo({url: unescape(this.$router.params.jumpPath)})
    }
    // 扫码注册
    // if (this.$router.params.scene && this.props.location) {
    //   const data = qs.parse(decodeURIComponent(this.$router.params.scene)) as Scene;
    //   if (data.registration && data.code && this.props.userInfo) {
    //     const {warrantRegion} = this.props.userInfo;
    //     const region: string[] = warrantRegion ? warrantRegion.split(",") : [];
    //     region.push(data.registration);
    //     registrationCode(data.code, this.props.location.ad_info.adcode).then(result => {
    //       if (result.data.success) {
    //         updateUser({
    //           ...this.props.userInfo,
    //           warrantRegion: region.join(","),
    //         }).then(res => {
    //           if (res.data.success) {
    //             this.props.syncUserInfo({
    //               ...this.props.userInfo as any,
    //               warrantRegion: region.join(",")
    //             })
    //           }
    //         })
    //       }
    //     })
    //   } else {
    //     // @ts-ignore
    //     registrationCode(data.code, this.props.location.ad_info.adcode).then(res => {
    //       // 验证激活码
    //       if (res.data.success) {
    //         this.props.syncLocationAction(res.data.data);
    //       }
    //     })
    //   }
    //   if (data.recommendId && this.props.userInfo) {
    //     if (!this.props.userInfo.recommendId) {
    //       updateUser({
    //         ...this.props.userInfo,
    //         recommendId: data.recommendId
    //       }).then(res => {
    //         if (res.data.success) {
    //           this.props.syncUserInfo({
    //             ...this.props.userInfo as any,
    //             recommendId: data.recommendId
    //           })
    //         }
    //       })
    //     }
    //   }
    // }
  }
  public componentDidShow(): void {}

  public render() {
    const {userInfo, rule} = this.props;
    return (
      <View className="page">
        <Swiper
          interval={3000}
          autoplay={true}
          indicatorDots={true}
          indicatorActiveColor="#fff"
          indicatorColor="rgba(255,255,255, 0.5)"
        >
          <SwiperItem>
            <Image
              className="banner"
              src="https://m.p.ximaifang.com/images/banner_02.jpg"
            />
          </SwiperItem>
          <SwiperItem>
            <Image
              className="banner"
              src="https://m.p.ximaifang.com/images/banner_01.jpg"
            />
          </SwiperItem>
        </Swiper>
        {
          userInfo && userInfo.type === 3 ? (
            <View className="list">
              <View className="row">
                <View onClick={() => {
                  Taro.navigateTo({
                    url: `/pages/promoter/index`
                  })
                }} className="item">
                  <Image src={HomeIconEnum.icon16}/>
                  <Text>我的客户</Text>
                </View>
                <View onClick={() => {
                  Taro.navigateTo({
                    url: `/pages/mine/qrcode.list`
                  })
                }} className="item">
                  <Image src={HomeIconEnum.icon12}/>
                  <Text>小程序码</Text>
                </View>
                <View onClick={() => {
                  Taro.navigateTo({
                    url: `/pages/mine/house/list/house?auditStatus=2&title=我收藏的&type=collection`
                  })
                }} className="item">
                  <Image src={HomeIconEnum.icon14}/>
                  <Text>我收藏的</Text>
                </View>
                <View onClick={() => {
                  Taro.navigateTo({
                    url: `/pages/mine/house/list/house?auditStatus=2&title=我看过的&type=history`
                  })
                }} className="item">
                  <Image src={HomeIconEnum.icon13}/>
                  <Text>我看过的</Text>
                </View>
                <View onClick={() => {
                  Taro.navigateTo({
                    url: `/pages/www/index?src=${escape("https://mp.weixin.qq.com/s/NCmtsMEDLS9vRmgmkWYr_w")}`
                  })
                }} className="item">
                  <Image src={HomeIconEnum.icon09}/>
                  <Text>使用帮助</Text>
                </View>
              </View>
              <View className="row">
                <View onClick={() => {
                  Taro.navigateTo({
                    url: `/pages/mine/house/list/house?auditStatus=0&title=在售房源`
                  })
                }} className="item">
                  <Image src={HomeIconEnum.icon02}/>
                  <Text>我要卖房</Text>
                </View>
                <View onClick={() => {
                  Taro.navigateTo({
                    url: "/pages/mine/buy"
                  })
                }} className="item">
                  <Image src={HomeIconEnum.icon01}/>
                  <Text>我要接房</Text>
                </View>
                <View onClick={() => {
                  Taro.navigateTo({
                    url: "/pages/mine/house/count/click"
                  })
                }} className="item">
                  <Image src={HomeIconEnum.icon03}/>
                  <Text>来访情况</Text>
                </View>
                <View onClick={() => {
                  Taro.navigateTo({
                    url: "/pages/mine/house/list/house?auditStatus=2&title=销售历史"
                  })
                }} className="item">
                  <Image src={HomeIconEnum.icon04}/>
                  <Text>销售历史</Text>
                </View>
                <View
                  onClick={() => {
                    Taro.navigateTo({
                      url: "/pages/promoter/market"
                    })
                  }}
                  className="item"
                >
                  <Image src={HomeIconEnum.icon15}/>
                  <Text>市场动态</Text>
                </View>
              </View>
            </View>
          ) : null
        }

        {
          userInfo && userInfo.type === 2 ? (
            <View className="list">
              <View className="row">
                <View onClick={() => {
                  Taro.navigateTo({
                    url: `/pages/mine/active`
                  })
                }} className="item">
                  <Image src={HomeIconEnum.icon16}/>
                  <Text>开通地区</Text>
                </View>
                <View onClick={() => {
                  if (rule == 2) {
                    Taro.navigateTo({
                      url: `/pages/service/buys`
                    })
                  } else {
                    Taro.navigateTo({
                      url: `/pages/mine/active`
                    })
                  }
                }} className="item">
                  <Image src={HomeIconEnum.icon15}/>
                  <Text>房源寻买家</Text>
                </View>
                <View onClick={() => {
                  Taro.navigateTo({
                    url: `/pages/mine/house/list/house?auditStatus=2&title=我收藏的&type=collection`
                  })
                }} className="item">
                  <Image src={HomeIconEnum.icon14}/>
                  <Text>我收藏的</Text>
                </View>
                <View onClick={() => {
                  Taro.navigateTo({
                    url: `/pages/mine/house/list/house?auditStatus=2&title=我看过的&type=history`
                  })
                }} className="item">
                  <Image src={HomeIconEnum.icon13}/>
                  <Text>我看过的</Text>
                </View>
              </View>
              <View className="row">
                <View onClick={() => {
                  Taro.navigateTo({
                    url: `/pages/mine/qrcode`
                  })
                }} className="item">
                  <Image src={HomeIconEnum.icon12}/>
                  <Text>小程序码</Text>
                </View>
                <View onClick={() => {
                  Taro.navigateTo({
                    url: `/pages/user/card?id=${userInfo.id}`
                  })
                }} className="item">
                  <Image src={HomeIconEnum.icon11}/>
                  <Text>分享名片</Text>
                </View>
                <View onClick={() => {
                  Taro.navigateTo({
                    url: `/pages/www/index?src=${escape("https://mp.weixin.qq.com/s/mR1yMxauJsdfW1ssXmpTzQ")}`
                  })
                }} className="item">
                  <Image src={HomeIconEnum.icon10}/>
                  <Text>使用帮助</Text>
                </View>
                <Button plain openType="contact" className="item">
                  <Image src={HomeIconEnum.icon09}/>
                  <Text>联系客服</Text>
                </Button>
              </View>
            </View>
          ) : null
        }

        {
          userInfo && userInfo.type === 1 ? (
            <View className="list">
              <View className="row">
                <View onClick={() => {
                  Taro.navigateTo({
                    url: "/pages/mine/buy"
                  })
                }} className="item">
                  <Image src={HomeIconEnum.icon01}/>
                  <Text>我要接房</Text>
                </View>
                <View onClick={() => {
                  Taro.navigateTo({
                    url: `/pages/mine/house/list/house?auditStatus=0&title=在售房源`
                  })
                }} className="item">
                  <Image src={HomeIconEnum.icon02}/>
                  <Text>我要卖房</Text>
                </View>
                <View onClick={() => {
                  Taro.navigateTo({
                    url: "/pages/mine/house/count/click"
                  })
                }} className="item">
                  <Image src={HomeIconEnum.icon03}/>
                  <Text>来访情况</Text>
                </View>
                <View onClick={() => {
                  Taro.navigateTo({
                    url: "/pages/mine/house/list/house?auditStatus=2&title=销售历史"
                  })
                }} className="item">
                  <Image src={HomeIconEnum.icon04}/>
                  <Text>销售历史</Text>
                </View>
              </View>
              <View className="row">
                <View onClick={() => {
                  Taro.switchTab({
                    url: `/pages/service/index`
                  })
                }} className="item">
                  <Image src={HomeIconEnum.icon05}/>
                  <Text>装修批发</Text>
                </View>
                <View onClick={() => {
                  Taro.navigateTo({
                    url: `/pages/user/card?id=${userInfo.id}`
                  })
                }} className="item">
                  <Image src={HomeIconEnum.icon06}/>
                  <Text>分享名片</Text>
                </View>
                <View onClick={() => {
                  Taro.navigateTo({
                    url: `/pages/www/index?src=${escape("https://mp.weixin.qq.com/s/40CtW0gdkjkh7a-oQxzASA")}`
                  })
                }} className="item">
                  <Image src={HomeIconEnum.icon07}/>
                  <Text>使用帮助</Text>
                </View>
                <Button plain openType="contact" className="item">
                  <Image src={HomeIconEnum.icon08}/>
                  <Text>联系客服</Text>
                </Button>
              </View>
            </View>
          ) : null
        }

        {
          !userInfo ? (
            <View className="list">
              <View className="row">
                <View onClick={this.handleLogin.bind(this)} className="item">
                  <Image src={HomeIconEnum.icon01}/>
                  <Text>我要接房</Text>
                </View>
                <View onClick={this.handleLogin.bind(this)} className="item">
                  <Image src={HomeIconEnum.icon02}/>
                  <Text>我要卖房</Text>
                </View>
                <View onClick={this.handleLogin.bind(this)} className="item">
                  <Image src={HomeIconEnum.icon03}/>
                  <Text>来访情况</Text>
                </View>
                <View onClick={this.handleLogin.bind(this)} className="item">
                  <Image src={HomeIconEnum.icon04}/>
                  <Text>销售历史</Text>
                </View>
              </View>
              <View className="row">
                <View onClick={this.handleLogin.bind(this)} className="item">
                  <Image src={HomeIconEnum.icon05}/>
                  <Text>装修批发</Text>
                </View>
                <View onClick={this.handleLogin.bind(this)} className="item">
                  <Image src={HomeIconEnum.icon06}/>
                  <Text>分享名片</Text>
                </View>
                <View onClick={this.handleLogin.bind(this)} className="item">
                  <Image src={HomeIconEnum.icon07}/>
                  <Text>使用帮助</Text>
                </View>
                <Button plain openType="contact" className="item">
                  <Image src={HomeIconEnum.icon08}/>
                  <Text>联系客服</Text>
                </Button>
              </View>
            </View>
          ) : null
        }


        <View className="card">
          <View
            className="title">{userInfo ? UserTypeEnum[userInfo.type] + " " + (userInfo.realName || userInfo.nickName)  :  <OpenData type="userNickName"/>}</View>
          <View className="content">
            {/*<View className="district">*/}
            {/*  地区 <Picker mode="region" value={location ? [location.address_component.province, location.address_component.city, location.address_component.district]: []} onChange={this.handleRegionSelect.bind(this)}>切换地区</Picker>*/}
            {/*</View>*/}
            <View className="district">
              地区 <Text onClick={() => Taro.navigateTo({
              url: "/pages/mine/active"
            })}>切换地区</Text>
            </View>
            <View className="address">
              {this.props.location ? [
                this.props.location.address_component.city,
                this.props.location.address_component.district
              ].join("-") : "未选择地区"}
            </View>

            {
              rule !== 2 && (userInfo && userInfo.type === 2) ? (
                <View className="desc">
                  *您尚未激活该区访问权限，<Button onClick={() => {
                  Taro.navigateTo({
                    url: "/pages/mine/active"
                  })
                }} plain size="mini">请开通</Button>
                </View>
              ) : null
            }
          </View>
          <View className="tag" onClick={() => {
            Taro.navigateTo({
              url: `/pages/house/index`
            })
          }}>
            <View>查看</View>
            <View>全区房源</View>
          </View>
        </View>
      </View>
    )
  }
  private handleLogin() {
    Taro.showModal({
      title: "提示",
      content: "当前未登录，登录后才能使用全部功能，是否去登录？"
    }).then((res) => {
      if (res.confirm) {
        Taro.navigateTo({
          url: "/pages/mine/login"
        })
      }
    })
  }
}

export default HomeIndexPage;

type OwnProps = {};
type State = Readonly<{}>;
type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps & OwnProps;
