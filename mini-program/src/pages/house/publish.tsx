/**
 * @class HousePublishPage Page
 * @date 2019/7/4 15:15
 * @author RanYunlong
 */
// eslint-disable-next-line no-unused-vars
import Taro, {chooseLocation, Component, Config} from "@tarojs/taro";
import {View, Image, Form, Input, Text, Picker, Textarea, Button, CoverView} from "@tarojs/components";
import {IReduxStore} from "../../reducers";
import {connect} from "@tarojs/redux";
import iconUpload from  "../../assets/images/house-publish-upload-image.png";
import List from "../../components/list/List";
import ListCell from "../../components/list/ListCell";
import FormGridGroup from "../../components/form-grid/FormGridGroup";
import FormGrid from "../../components/form-grid/FormGrid";
import {getHouseType, houseTypeEnum} from "../../constants/house.type.enum";
import {BaseEventOrig} from "@tarojs/components/types/common";
import houseFloorRange, {
  getCountFloorRange,
  getHouseFloorTypeName
} from "../../constants/house.floor.enum";
import {getHouseingName, getHouseingRange} from "../../constants/house.houseingtype.enum";
import {getHouseOrientationName, getHouseOrientationRange} from "../../constants/house.orientation.enum";
import {getHouseDoorLookType, getHouseDoorLookTypeRange} from "../../constants/house.doorlook.enum";
import {getHouseElevator, getHouseElevatorRange} from "../../constants/house.elevator.enum";
import {getHouseDecoration, getHouseDecorationRange} from "../../constants/house.decoration.enum";
import {geocoder} from "../../apis/qmap";
import {IconEnum} from "../../constants/icon.enum";
import {QueryHouse, queryHousingResources, saveHousingResources} from "../../apis/house";
import "./publish.less";
import {syncLocationAction} from "../../actions/SyncLocationAction";
import {syncUploadTempFileAction} from "../../actions/SyncUploadTempFileAction";

const mapStateToProps = (store: IReduxStore) => {
  return {
    stateLocation: store.app.location,
    photos: store.app.uploadTempFiles,
    userInfo: store.app.userInfo,
  }
};
const mapDispatchToProps = {
  syncLocation: syncLocationAction,
  syncUploadTempFiles: syncUploadTempFileAction,
};

@connect(
  mapStateToProps,
  mapDispatchToProps
)
class HousePublishPage extends Component<Props, State> {
  public config: Config = {
    navigationBarTitleText: "房源发布",
    enablePullDownRefresh: false,
  };
  public readonly state: State = {
    houseArea: "",
    houseAreaPlus: "",
    houseType: [],
    houseFloor: [],
    houseFloorRange: houseFloorRange,
    houseOrientation: -1,
    houseDoorLookType: -1,
    houseingType: -1,
    houseElevator: -1,
    houseDecoration: -1,
    houseRemarks: "",
    detailedAddress: "",
    houseTitle: "",
    price: "",
  };
  public componentWillMount(): void {
    this.getHouseInfo();
  }
  public componentDidShow(): void {
    const { stateLocation } = this.props;
    if (stateLocation) {
      const { province, city, district } = stateLocation.address_component;
      this.setState({
        pubArea: [province, city, district],
      })
    }
  }

  public render() {
    const {
      houseType, houseFloor, houseFloorRange, houseingType, houseOrientation,
      houseDoorLookType, houseElevator, houseDecoration, houseRemarks,
      detailedAddress,
      houseAreaPlus,
      houseArea,
      houseTitle,
      price,
      location,
      pubArea,
    } = this.state;
    const { photos } = this.props;
    const { id } = this.$router.params;
    const publistArea = pubArea || [];
    return (
      <View className="page">
        <View className="cover-photo">
          {photos.length > 0 ? <Image mode="scaleToFill" className="photo" src={photos[0]} />: null}
          <Image className="btn" onClick={this.handleChooseImage.bind(this)} src={iconUpload} />
        </View>
        <Form className="form" onSubmit={this.handleSubmit.bind(this)}>
          <FormGridGroup>
            <FormGrid title="标题">
              <Input value={houseTitle} name="houseTitle" maxLength={26} className='info' type='text' placeholder='请输入标题'/>
            </FormGrid>
          </FormGridGroup>
          <FormGridGroup>
            <FormGrid title="面积(㎡)">
              <Input value={houseArea as string} name="houseArea" maxLength={8} className="info" type="digit" placeholderClass="placeholder" placeholder="请填写"/>
            </FormGrid>

            <FormGrid title="赠送面积(㎡)">
              <Input value={houseAreaPlus as string} name="houseAreaPlus" maxLength={4} className="info" type="digit" placeholderClass="placeholder" placeholder="请填写"/>
            </FormGrid>

            <FormGrid title="售价(万/元)">
              <Input value={price as string} name="price" maxLength={11} className="info" type="digit" placeholderClass="placeholder" placeholder="请填写"/>
            </FormGrid>
          </FormGridGroup>
          <FormGridGroup>
            <FormGrid title="户型">
              <Picker name="houseType" mode="multiSelector" value={houseType} range={houseTypeEnum} onChange={this.handleHouseTypeChange.bind(this)}>
                {houseType.length > 0 ? <Text className="value">{getHouseType(houseType)}</Text> : <Text className="placeholder">请选择</Text> }
              </Picker>
            </FormGrid>

            <FormGrid title="楼层">
              <Picker
                  name="houseFloor"
                  mode="multiSelector"
                  value={houseFloor}
                  range={houseFloorRange}
                  onChange={this.handleHouseFloorChange.bind(this)}
                  onColumnChange={this.handleHouseFirstFloorChange.bind(this)}
                  >
                {houseFloor.length === 2 ? <Text className="value">{getHouseFloorTypeName(houseFloor)}</Text>: <Text className="placeholder">请选择</Text>}
              </Picker>
            </FormGrid>

            <FormGrid title="类型">
              <Picker
                name="housingType"
                mode="selector"
                value={houseingType}
                range={getHouseingRange().map(item => item.label)}
                onChange={this.handleHouseingChange.bind(this)}
              >
                {!!~houseingType ? <Text className="value">{getHouseingName(houseingType)}</Text>: <Text className="placeholder">请选择</Text>}
              </Picker>
            </FormGrid>
          </FormGridGroup>
          <FormGridGroup>
            <FormGrid title="朝向">
              <Picker
                mode="selector"
                name="houseOrientation"
                value={houseOrientation}
                range={getHouseOrientationRange().map(item => item.label)}
                onChange={this.handleHouseOrientationChange.bind(this)}
              >
                {!!~houseOrientation ? <Text className="value">{getHouseOrientationName(houseOrientation)}</Text> : <Text className="placeholder">请选择</Text>}
              </Picker>
            </FormGrid>

            <FormGrid title="门锁">
              <Picker
                mode="selector"
                name="houseDoorLookType"
                value={houseDoorLookType}
                range={getHouseDoorLookTypeRange()}
                onChange={this.handleHouseDoorLookChange.bind(this)}
              >
                {!!~houseDoorLookType ? <Text className="value">{getHouseDoorLookType(houseDoorLookType)}</Text>: <Text className="placeholder">请选择</Text>}

              </Picker>
            </FormGrid>
          </FormGridGroup>
          <FormGridGroup>
            <FormGrid title="电梯">
              <Picker
                mode="selector"
                value={houseElevator}
                name="houseElevator"
                range={getHouseElevatorRange()}
                onChange={this.handleHouseElevatorChange.bind(this)}
              >
                {!!~houseElevator ? <Text className="value">{getHouseElevator(houseElevator)}</Text>: <Text className="placeholder">请选择</Text>}
              </Picker>
            </FormGrid>

            <FormGrid title="装修">
              <Picker
                name="houseDecoration"
                mode="selector"
                value={houseDecoration}
                range={getHouseDecorationRange()}
                onChange={this.handleHouseDecorationChange.bind(this)}
              >
                {!!~houseDecoration ? <Text className="value">{getHouseDecoration(houseDecoration)}</Text>: <Text className="placeholder">请选择</Text>}
              </Picker>
            </FormGrid>
          </FormGridGroup>
          <List loading={false}>
            <ListCell
              label="发布区域"
              hasBorder={true}
              hasArrow={true}
            >
              <Picker
                mode="region"
                value={publistArea}
                onChange={this.handleRegionChange.bind(this)}
              >
                {publistArea.length > 0 ? <Text>{publistArea.join("-")}</Text>: <Text>请选择发布区域</Text>}
              </Picker>
            </ListCell>

            <ListCell
              label="详细地址"
              hasBorder={true}
            >
                <Input value={detailedAddress} name="detailedAddress" placeholder="请输入详细的街/小区名称/单元/栋数" />
            </ListCell>

            <ListCell
              label="选择定位"
              hasArrow={true}
            >
              <View onClick={this.handleChooseLocation.bind(this)}>
                {location ? <Text>{location.address}</Text>: <Text>请选择定位</Text>}
              </View>
            </ListCell>
          </List>
          <FormGridGroup>
            <FormGrid title="备注">
              <Textarea value={decodeURIComponent(houseRemarks || "")} name="houseRemarks" placeholder="请填写备注信息(可不填写)" placeholderClass="placeholder" />
            </FormGrid>
          </FormGridGroup>
          <CoverView className="cover-view">
            {id ? <Button formType="submit">重新发布</Button> : <Button formType="submit">发布</Button>}
          </CoverView>
        </Form>
      </View>
    )
  }
  /**
   * 户型选择变化
   * @param e
   */
  private handleHouseTypeChange(e: BaseEventOrig<{value: number[]}>) {
    this.setState({
      houseType: e.detail.value,
    })
  }
  /**
   * 楼层选择变化
   * @param e
   */
  private handleHouseFloorChange(e: BaseEventOrig<{value: number[]}>) {
    this.setState({
      houseFloor: e.detail.value,
    })
  }
  /**
   * 处理楼层变化
   * @param e
   */
  private handleHouseFirstFloorChange(e: BaseEventOrig<{column: number, value: number}>) {
    const { column, value } = e.detail;
    if (column === 0) {
      const { houseFloorRange } = this.state;
      this.setState({
        houseFloorRange: [
          houseFloorRange[0],
          getCountFloorRange(value - 1)
        ]
      })
    }
  }
  /**
   * 处理类型变化
   * @param e
   */
  private handleHouseingChange(e: BaseEventOrig<{value: number}>) {
    this.setState({
      houseingType: e.detail.value,
    })
  }
  /**
   * 处理朝向变化
   * @param e
   */
  private handleHouseOrientationChange(e: BaseEventOrig<{value: number}>) {
    this.setState({
      houseOrientation: e.detail.value
    })
  }
  /**
   * 处理门锁变化
   * @param e
   */
  private handleHouseDoorLookChange(e: BaseEventOrig<{value: number}>) {
    this.setState({
      houseDoorLookType: e.detail.value
    })
  }
  /**
   * 处理电梯变化
   * @param e
   */
  private handleHouseElevatorChange(e: BaseEventOrig<{value: number}>) {
    this.setState({
      houseElevator: e.detail.value
    })
  }
  /**
   * 处理装修变化
   * @param e
   */
  private handleHouseDecorationChange(e: BaseEventOrig<{value: number}>) {
    this.setState({
      houseDecoration: e.detail.value
    })
  }
  /**
   * 处理地区变化
   * @param e
   */
  private async handleRegionChange(e: BaseEventOrig<{value: string[]}>) {
    const response = await geocoder({
      address: e.detail.value.join("")
    })
    const { status, result } = response;
    if (status === 0) {
      const { province, city, district } = result.address_components;
      this.setState({
        pubArea: [province, city, district],
      })
    }
  }
  /**
   * 处理选择定位
   */
  private handleChooseLocation() {
    Taro.chooseLocation().then(location => {
      this.setState({
        location
      })
    }).catch(() => {
      Taro.showToast({
        image: IconEnum.error,
        title: "未选择地区"
      })
    })
  }
  /**
   * 处理选择相册
   */
  private handleChooseImage() {
    Taro.navigateTo({
      url: `./photos`,
    })
  }
  /**
   * 表单验证
   * @param value
   */
  private validate(value: QueryHouse.HouseParams): Promise<QueryHouse.HouseParams> {
    const { stateLocation } = this.props;
    return new Promise((r, j) => {
      const {
        detailedAddress, houseArea, houseAreaPlus, houseDecoration,
        houseDoorLookType, houseElevator, houseFloor, houseOrientation,
        houseTitle, houseType, housingType, price
      } = value;
      if (!houseTitle || houseTitle.length === 0) {
        return j("标题必须！")
      }
      if (!houseArea || (houseArea as any) === "") {
        return j("面积必须！")
      }
      if (!price || (price as any) === "") {
        return j("售价必须！")
      }
      if (!houseFloor || !~houseFloor) {
        return j("楼层必须！")
      }
      if (houseType === undefined || !~houseType) {
        return j("户型必须！")
      }
      if (housingType === undefined || !~housingType) {
        return j("类型必须！")
      }
      if (houseOrientation === undefined || !~houseOrientation) {
        return j("朝向必须！")
      }
      if (houseDoorLookType === undefined || !~houseDoorLookType) {
        return j("门锁必须！")
      }
      if (houseElevator === undefined || !~houseElevator) {
        return j("电梯必须！")
      }
      if (houseDecoration === undefined || !~houseDecoration) {
        return j("装修必须！")
      }
      if (detailedAddress === undefined || detailedAddress.length === 0) {
        return j("详细地址必须！")
      }
      if (!this.state.location){
        j("请选择定位！")
      }
      value.houseArea = Number(houseArea);
      value.houseAreaPlus = Number(houseAreaPlus);
      value.houseDecoration= Number(houseDecoration);
      value.houseDoorLookType = Number(houseDoorLookType);
      value.houseElevator = Number(houseElevator);
      value.houseOrientation = Number(houseOrientation);
      value.housingType = Number(housingType);
      value.price = Number(price);
      value.houseLocation = this.state.location;
      // 省市区
      if (stateLocation) {
        const { province, city, district } = stateLocation.address_component;
        value.province = province;
        value.city = city;
        value.area = district;
      }

      if (this.state.pubArea) {
        const [ province, city, district ] = this.state.pubArea;
        value.province = province;
        value.city = city;
        value.area = district;
      }

      if (this.props.photos.length === 0) {
        value.housePhotos = [];
        return Taro.showModal({
          title: "提示",
          content: "当前房源未添加图片描述,是否继续发布？",
          showCancel: true,
        }).then(res => {
          if (res.confirm) {
            r(value)
          }
        })
      }
      value.housePhotos = this.props.photos;
      r(value);
    })
  }
  /**
   * 发布房源
   * @param e
   */
  private async handleSubmit(e) {
    let value = e.detail.value
    this.validate(value).then((v) => {
      if (this.$router.params.id) {
        v.id = this.$router.params.id;
      }
      if (this.$router.params.releaseId) {
        v.releaseId = this.$router.params.releaseId;
      }
      v.houseRemarks = encodeURIComponent(v.houseRemarks || "");
      saveHousingResources(v).then(res => {
        const { success } = res.data;
        if (success) {
          this.props.syncUploadTempFiles([]);
          Taro.navigateBack();
        } else {
          Taro.showToast({
            image: IconEnum.error,
            title: "提交失败，请重试!"
          })
        }
      })

    }).catch(title => {
      return Taro.showToast({
        image: IconEnum.error,
        title
      })
    })
  }
  /**
   * 获取房源详情
   */
  private async getHouseInfo() {
    if (!this.$router.params.id) return;
    const query: any = {
      id: this.$router.params.id
    };
    if (this.props.userInfo) {
      query.userId = this.props.userInfo.id;
    }
    const response = await queryHousingResources(query);
    const { success, data } = response.data;
    if (success) {
      const { houseFloor } = data;
      if (houseFloor) {
        const start = houseFloor.split(",")[0]
        this.setState({
          houseFloorRange: [
            houseFloorRange[0],
            getCountFloorRange(Number(start) - 1),
        ]
        })
      }
      this.setState({
        houseType: data.houseType ? data.houseType.split(",").map(item => Number(item)) : [0, 0, 0],
        houseRemarks: data.houseRemarks,
        houseOrientation: data.houseOrientation,
        houseElevator: data.houseElevator,
        houseDoorLookType: data.houseDoorLookType,
        houseDecoration: data.houseDecoration,
        houseingType: data.housingType,
        houseFloor: data.houseFloor ? data.houseFloor.split(",").map(item => Number(item)): [0, 0],
        location: data.houseLocation,
        detailedAddress: data.detailedAddress,
        houseArea: data.houseArea,
        houseAreaPlus: data.houseAreaPlus,
        price: data.price,
        houseTitle: data.houseTitle,
        pubArea: [data.province, data.city, data.area]
      });
      this.props.syncUploadTempFiles(data.housePhotos ? data.housePhotos.split(","): []);
    }
  }
}
export default HousePublishPage
type OwnProps = {};
type State = Readonly<{
  houseType: number[];
  houseFloor: number[];
  houseFloorRange: string[][],
  houseingType: number;
  houseOrientation: number;
  houseDoorLookType: number;
  houseElevator: number;
  houseDecoration: number;
  houseRemarks: string;
  detailedAddress: string;
  houseArea: string | number;
  houseAreaPlus: string | number;
  houseTitle: string;
  price: string | number;
  location?: chooseLocation.Promised;
  // 编辑时的省市区
  pubArea?: string[];
}>;
type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps & OwnProps;
