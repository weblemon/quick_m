/**
 * @class WebViewPage Page
 * @date 2019/7/14 0:20
 * @author RanYunlong
 */
// eslint-disable-next-line no-unused-vars
import Taro, {Component, Config} from "@tarojs/taro";
import {WebView} from "@tarojs/components";

class WebViewPage extends Component<Props, State> {
  public config: Config = {
      navigationBarTitleText: "浏览"
  };

  public render() {
      const src: string = this.$router.params.src;
      return (
        <WebView src={src} />
      )
  }
}

export default WebViewPage

type OwnProps = {};
type State = Readonly<{}>;
type Props = OwnProps;
