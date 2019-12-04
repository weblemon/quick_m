/**
 * @class MineSettingInfoPage Page
 * @date 2019/6/28 19:00
 * @author RanYunlong
 */
// eslint-disable-next-line no-unused-vars
import Taro, {Component, Config} from "@tarojs/taro";
import {View, Text, OpenData, RadioGroup, Label, Radio, Input, Button} from "@tarojs/components";
import {IReduxStore} from "../../../reducers";
import {connect} from "@tarojs/redux";
import "./info.less";

const mapStateToProps = (state: IReduxStore) => {
  return {
    userInfo: state.app.userInfo
  }
};
const mapDispatchToProps = {};
@connect(
  mapStateToProps,
  mapDispatchToProps
)
class MineSettingInfoPage extends Component<Props, State> {
  public config: Config = {
      navigationBarTitleText: "完善资料",
      enablePullDownRefresh: false,
  };

  public render() {
    const { userInfo } = this.props;
      return (
          <View className="page">
              <View className="label">
                <Text className='title'>完善资料</Text>
                <Text className='desc'>为了更好的了解您</Text>
              </View>
              <View className="user-pic" >
                  <OpenData type="userAvatarUrl" />
              </View>
              <Input disabled={true} placeholder="昵称" value={userInfo ? userInfo.nickName as string: ""} />
              <Input maxLength={6} placeholder="您的昵称" value={userInfo ? userInfo.realName as string: ""} />
              <RadioGroup>
                  <Label for="sir">先生</Label>
                  <Radio checked={Boolean(userInfo && userInfo.gender.toString() === "1")} id="sir" value="1" color="#f53b16" />
                  <Label for="ld">女士</Label>
                  <Radio checked={Boolean(userInfo && userInfo.gender.toString() === "0")} id="ld" value="0" color="#f53b16" />
              </RadioGroup>
              <Text className="readme">阅读免责声明</Text>
              <Button>完成</Button>
          </View>
      )
  }
}

export default MineSettingInfoPage

type OwnProps = {};
type State = Readonly<{}>;
type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps & OwnProps;
