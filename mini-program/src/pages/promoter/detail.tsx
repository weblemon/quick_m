/**
 * @class PromoterDetailPage Page
 * @date 2019/7/28 17:23
 * @author RanYunlong
 */
// eslint-disable-next-line no-unused-vars
import Taro, {Component, Config} from "@tarojs/taro";
import {Button, Image, Text, View} from "@tarojs/components";
import {IReduxStore} from "../../reducers";
import {UserTypeEnum} from "../../enum/user.type.enum";
import {QueryUser, queryUserInfo} from "../../apis/user";
import EmptyLine from "../../components/empty/EmptyLine";
import List from "../../components/list/List";
import ListCell from "../../components/list/ListCell";
import "./detail.less";
import {formatDate} from "../../utils/formatDate";
import {IconEnum} from "../../constants/icon.enum";
import {share} from "../../utils/share";
import qs from "qs";

const mapStateToProps = (store: IReduxStore) => {
  return {
    userInfo: store.app.userInfo
  }
};
const mapDispatchToProps = {};
class PromoterDetailPage extends Component<Props, State> {
  public config: Config = {
      navigationBarTitleText: "客户详情",
      enablePullDownRefresh: false,
  };

  public render() {
      const { info } = this.state;
      if (info) {
        const { rawUpdateTime, rawAddTime } = info;
        if (rawAddTime) {
          info.rawAddTime = formatDate(rawAddTime);
        }
        if (rawUpdateTime) {
          info.rawUpdateTime = formatDate(rawUpdateTime);
        }
        return (
          <View className="page">
            <View className="user-cell">
              <View className="top">
                <Image className="avatar" src={info.avatarUrl || (info.gender == 0 ? IconEnum.woman : IconEnum.man)}/>
                <View className="info">
                  <Text className="title">{info.nickName || info.realName || "用户" + info.id}</Text>
                  <Text className="desc">{UserTypeEnum[info.type || 0]} {info.phone ? info.phone.substr(0, 3) + "****" + info.phone.substr(7, 4): ""}</Text>
                </View>
              </View>
            </View>
            <List>
              <ListCell
                label="性别"
                hasBorder
                value={info.gender === 0 ? "女" : "男"}
              />

              {
                info.rawAddTime ? (
                  <ListCell
                    label="注册时间"
                    hasBorder
                    value={info.rawAddTime}
                  />
                ): null
              }

              {
                info.rawUpdateTime ? (
                  <ListCell
                    label="更新时间"
                    value={info.rawUpdateTime}
                  />
                ): null
              }
            </List>

            {
              info.type === 1 ? (
                <List>
                  <ListCell
                    label="访问统计"
                    onClick={() => Taro.navigateTo({url: `/pages/mine/house/count/click?id=${info.id}`})}
                    value="查看"
                    hasArrow
                  />
                </List>
              ): null
            }

            <List>
              <ListCell
                label="在售房源"
                value="查看"
                hasBorder
                hasArrow
                onClick={() => Taro.navigateTo({url: `/pages/mine/house/list/house?auditStatus=0&title=在售房源&id=${info.id}`})}
              />

              <ListCell
                label="已售房源"
                value="查看"
                onClick={() => Taro.navigateTo({url: `/pages/mine/house/list/house?auditStatus=2&title=已售房源&id=${info.id}`})}
                hasArrow
              />
            </List>

            <List>
              <ListCell
                label="修改客户"
                hasBorder
                hasArrow
                onClick={() => Taro.navigateTo({
                  url: `/pages/promoter/create?${qs.stringify(info)}&title=修改客户`
                })}
              />
              <ListCell
                label="新增房源"
                hasArrow
                onClick={() => Taro.navigateTo({
                  url: `/pages/house/publish?releaseId=${info.id}`
                })}
              />
            </List>

            <Button openType="share" className="publish-button">
              <Image src={IconEnum.share2} />
            </Button>
          </View>
        )
      }
      return (
        <View className="page">
          <View className="user-cell">
            <View className="top">
              <Image className="avatar" src=""/>
              <View className="info">
                <View className="title">
                  <EmptyLine width={100} />
                </View>
                <View className="desc">
                  <EmptyLine width={300} />
                </View>
              </View>
            </View>
          </View>
          <List>
            <ListCell
              label=""
              hasBorder
            >
              <EmptyLine width={100} />
            </ListCell>

            <ListCell
              label=""
              hasBorder
            >
              <EmptyLine width={100} />
            </ListCell>
            <ListCell
              label=""
              hasBorder
            >
              <EmptyLine width={100} />
            </ListCell>

            <ListCell
              label=""
              hasBorder
            >
              <EmptyLine width={100} />
            </ListCell>

            <ListCell
              label=""
            >
              <EmptyLine width={100} />
            </ListCell>
          </List>
          <List>
            <ListCell
              label=""
            >
              <EmptyLine width={100} />
            </ListCell>
          </List>
          <List>
            <ListCell
              label=""
              hasBorder
            >
              <EmptyLine width={100} />
            </ListCell>

            <ListCell
              label=""
              hasBorder
            >
              <EmptyLine width={100} />
            </ListCell>

            <ListCell
              label=""
            >
              <EmptyLine width={100} />
            </ListCell>
          </List>
          <List>
            <ListCell
              label=""
            >
              <EmptyLine width={100} />
            </ListCell>
          </List>
        </View>
      )
  }
  public componentDidShow() {
    if (!this.$router.params.id) return Taro.navigateBack();
    queryUserInfo(this.$router.params.id).then(res => {
      if (res.data.success) {
        this.setState({
          info: res.data.data
        })
      }
    })
  }
  public onShareAppMessage(): Taro.ShareAppMessageReturn {
    const { info } = this.state;
    if (!info) return {};
    return share((info.realName || info.nickName || "用户" + info.id) + "个人名片", `/pages/user/card?id=${info.id}`)
  }
}

export default PromoterDetailPage

type OwnProps = {};
type State = Readonly<{
  info?: QueryUser.Info;
}>;
type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps & OwnProps;
