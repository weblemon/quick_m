/**
 * @class MineReadmePage Page
 * @date 2019/7/26 17:40
 * @author RanYunlong
 */
// eslint-disable-next-line no-unused-vars
import Taro, {Component, Config} from "@tarojs/taro";
import {View, Text} from "@tarojs/components";
import "./readme.less";

class MineReadmePage extends Component<Props, State> {
  public config: Config = {
      navigationBarTitleText: "免责声明"
  };

  public render() {
      return (
          <View className="page">
            <Text>
              任何使用卖房侠微信小程序系统的用户均应仔细阅读本声明，用户可选择不使用卖房侠微信小程序系统，用户使用卖房侠微信小程序系统的行为将被视为对本声明全部内容的认可。
            </Text>
            <Text>
              1、卖房侠微信小程序是一个信息发布平台，任何透过卖房侠微信小程序的页面及链接而得到的任何资讯、产品及服务信息均系用户自行发布，卖房侠微信小程序对其合法性概不负责，亦不承担任何法律责任。
            </Text>
            <Text>
              2、用户在通过卖房侠微信小程序站网页及链接得到咨讯、产品及服务信息后，与信息发布人所进行的任何交易均系其双方自主交易，双方如若发生纠纷，皆与卖房侠微信小程序无关，卖房侠微信小程序亦不承担任何法律责任。
            </Text>
            <Text>
              3、卖房侠微信小程序用户发布的任何信息内容并不代表和反映任何卖房侠微信小程序之意见。
            </Text>
            <Text>
              4、任何单位或个人认为卖房侠微信小程序的内容可能涉嫌侵犯其合法权益，应该及时向卖房侠微信小程序书面反馈，并提供身份证明、权属证明及详细侵权情况证明，卖房侠微信小程序在收到上述法律文件后，将会尽快移除被控侵权的信息内容。
            </Text>

            <Text>
              5、卖房侠微信小程序做为一个信息发布平台，在发现用户违反国家法律法规或卖房侠微信小程序信息发布审核制度的情况下，有权删除用户发布的任何信息。
            </Text>
          </View>
      )
  }
}

export default MineReadmePage

type MapStateProps = {}
type MapDispatchProps = {};
type OwnProps = {};
type State = Readonly<{}>;
type Props = MapStateProps & MapDispatchProps & OwnProps;
