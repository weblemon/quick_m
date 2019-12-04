/**
 * @class MineSettingPhonePage Page
 * @date 2019/6/28 19:01
 * @author RanYunlong
 */
// eslint-disable-next-line no-unused-vars
import Taro, {Component, Config} from "@tarojs/taro";
import {Text, View, Input, Button} from "@tarojs/components";
import './info.less';
import {IReduxStore} from "../../../reducers";
import {connect} from "@tarojs/redux";

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
class MineSettingPhonePage extends Component<Props, State> {
  public config: Config = {
      navigationBarTitleText: "手机设置"
  };

  public render() {
    const { userInfo } = this.props;
      return (
          <View className="page">
            <View className="label">
              <Text className='title'>电话号码验证</Text>
              <Text className='desc'>请务必填写能联系到您的电话</Text>
            </View>
            <Input placeholder="请输入手机号码" value={userInfo ? userInfo.phone as string : ''} />
            <Input placeholder="备用号码，可不填写" value={userInfo ? userInfo.sparePhone as string : ''} />
            <Button>完成</Button>
          </View>
      )
  }
}

export default MineSettingPhonePage

type OwnProps = {};
type State = Readonly<{}>;
type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps & OwnProps;
