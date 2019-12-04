/**
 * @class HousePhotosPage Page
 * @date 2019/7/7 0:08
 * @author RanYunlong
 */

import Taro, {Component, Config, hideLoading} from "@tarojs/taro";
import {View, Text, Button, Image, Progress} from "@tarojs/components";
import {IReduxStore} from "../../reducers";
import {connect} from "@tarojs/redux";
import "./photos.less";
import iconAdd from "../../assets/images/add.png";
import {IconEnum} from "../../constants/icon.enum";
import {BASE_URI} from "../../utils/http";
import {syncUploadTempFileAction} from "../../actions/SyncUploadTempFileAction";

const mapStateToProps = (store: IReduxStore) => {
  return {
    location: store.app.location,
    Authorization: store.app.token,
    files: store.app.uploadTempFiles,
  }
};
const mapDispatchToProps = {
  syncUploadTempFiles: syncUploadTempFileAction
};

@connect(
  mapStateToProps,
  mapDispatchToProps,
)
class HousePhotosPage extends Component<Props, State> {
  public config: Config = {
    navigationBarTitleText: "上传图片",
    enablePullDownRefresh: false
  };
  public readonly state: State = {
    files: [],
  };
  public render() {
    const { files } = this.state;
    return (
      <View className="page">
        <View className="cover-photo">
          {files.length > 0 ? <Image mode="widthFix"  src={files[0].tempFilePath} /> : null}
          <View className="title">
            <Text>封面</Text>
          </View>
        </View>
        <View className="uploads">
          {
            files.map((item, index) => {
              return (
                <View key={index} className="item">
                  <View className="photo">
                    <Image data-path={item.tempFilePath} onClick={this.handleMoveFirst.bind(this)} mode="widthFix" lazyLoad={true} src={item.tempFilePath} />
                  </View>
                  <Image data-path={item.tempFilePath} src={IconEnum.clear} onClick={this.clearTempFile.bind(this)} className="clear" />
                  {!item.uploaded ? <Progress percent={item.progress} /> : null}
                </View>
              )
            })
          }
          <View className="item button">
            <Image onClick={this.handleChooseImage.bind(this)} className="add" src={iconAdd} />
          </View>
        </View>
        <Button hoverClass="hover" onClick={this.handleUploadFiles.bind(this)}>保存上传</Button>
      </View>
    )
  }

  componentWillMount(): void {
    const files = this.props.files.map((f: string) => {
        return {
          path: f,
          tempFilePath: f,
          uploaded: true,
          progress: 100
        }
    });
    this.setState({
      files
    })
  }

  private handleChooseImage() {
    if (this.state.files.length >= 9) {
      return Taro.showToast({
        icon: "none",
        title: "图片数量已达到最大限制，请删除其他图片后再上传！"
      })
    }
    Taro.chooseImage({
      count: 9 - this.state.files.length,
      sizeType: ["compressed"],
      sourceType: ["album", "camera"]
    }).then(res => {
      const files = [...this.state.files];
      res.tempFilePaths.forEach((tempFilePath: string) => {
        files.push({
          tempFilePath,
          uploaded: false,
          progress: 0
        });
      });
      this.setState({
        files,
      });
    }).catch(() => {
      Taro.showToast({
        image: IconEnum.error,
        title: "未选择照片"
      })
    })
  }
  /**
   * 上传文件
   * @param filePath
   */
  private upload(filePath: string) {
    const { Authorization } = this.props;
     return Taro.uploadFile({
      url: BASE_URI + '/multiUpload',
      filePath,
      header: {
        Authorization,
        "content-type": "multipart/form-data",
      },
      name: "file",
    })
  }
  private handleUploadFiles() {
    if (this.state.files.length > 0 ) {
      Taro.showLoading({
        title: "上传中"
      });
      const tasks = new Set();
      this.state.files.filter(item => !item.uploaded).forEach((item) => {
        const task = this.upload(item.tempFilePath);
        tasks.add(task);
        task.progress(({progress}) => {
          const find = this.state.files.find(f => f.tempFilePath === item.tempFilePath);
          if (find) {
            find.progress = progress
          }
          this.setState({
            files: [...this.state.files],
          });
        });
        task.then(res => {
          const { success, message, data } = JSON.parse(res.data);
          if (success) {
            const image = this.state.files.find(image => image.tempFilePath === item.tempFilePath);
            if (image) {
              image.path = data;
              item.uploaded = true;
            }
            this.setState({
              files: [...this.state.files],
            });
            tasks.delete(task);
          } else {
            Taro.showToast({
              image: IconEnum.error,
              title: message,
            });
            tasks.delete(task);
          }
          if (tasks.size === 0) {
            hideLoading();
            this.props.syncUploadTempFiles(this.state.files.filter(f => f.path !== undefined).map(f => f.path as string))
            Taro.navigateBack();
          }
        }).catch(() => {
          task.abort();
          tasks.delete(task);
          if (tasks.size === 0) {
            hideLoading();
          }
        });
      })
    }
  }
  private clearTempFile(e) {
    this.setState({
        files: this.state.files.filter(item => item.tempFilePath !== e.currentTarget.dataset.path),
    })
  }
  private handleMoveFirst(e) {
    const filter = this.state.files.filter(item => item.tempFilePath === e.currentTarget.dataset.path);
    const filter2 = this.state.files.filter(item => item.tempFilePath !== e.currentTarget.dataset.path);
    this.setState({
      files: [...filter, ...filter2],
    })
  }
}

export default HousePhotosPage

type OwnProps = {};
type State = Readonly<{
  files: TempFile[],
}>;
type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps & OwnProps;

export interface TempFile{
  /**
   * 本地文件路径
   */
  path?: string
  /**
   * 上传状态
   */
  uploaded: boolean;
  /**
   * 上传进度
   */
  progress?: any;
  /**
   * 临时文件
   */
  tempFilePath: string;
}
