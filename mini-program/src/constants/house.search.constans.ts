import {getHouseOrientationRange} from "./house.orientation.enum";
import {HouseSearchGroupItem} from "../components/search/HouseSearchGroup";
import {getHouseingRange} from "./house.houseingtype.enum";

// 生成朝向区间
const orientationRange = getHouseOrientationRange();
// 朝向区间
orientationRange.unshift({label: "不限", value: null as any});
// 装修去见见
const decorationRange: HouseSearchGroupItem[] = [
  {
    label: "不限",
    value: null
  },
  {
    label: "已装修",
    value: 1,
  },
  {
    label: "毛坯",
    value: 0
  }
];
// 面积区间
const areaRange: HouseSearchGroupItem[] = [
  {label: "不限", value: null},
  {label: "50以下", value: [0, 50]},
  {label: "50-70", value: [50, 70]},
  {label: "70-90", value: [70, 90]},
  {label: "90-110", value: [90, 110]},
  {label: "110-130", value: [110, 130]},
  {label: "130-150", value: [130, 150]},
  {label: "150以上", value: [150, null]},
];
// 选项卡
const tabs = ["历史", "售价", "户型", "更多"];
// 类型区间
const houseingRange = getHouseingRange();
// 类型区间
houseingRange.unshift({label: "不限", value: null as any});
// 户型区间
const houseTypeRange: HouseSearchGroupItem[] = [
  {
    label: "不限",
    value: -1
  },
  {
    label: "一居室",
    value: 0
  },
  {
    label: "二居室",
    value: 1
  },
  {
    label: "三居室",
    value: 2
  },
  {
    label: "四居室",
    value: 3
  },
  {
    label: "五居室",
    value: 4
  },
  {
    label: "五居以上",
    value: 5
  }
];
// 价格区间
const priceRange: HouseSearchGroupItem[] = [
  {
    label: "不限",
    value: null
  },
  {
    label: "70万以下",
    value: [0, 70]
  },
  {
    label: "70-100万",
    value: [70, 100]
  },
  {
    label: "100-150万",
    value: [100, 150]
  },
  {
    label: "150-200万",
    value: [150, 200]
  },
  {
    label: "200-300万",
    value: [200, 300]
  },
  {
    label: "300万以上",
    value: [300, null]
  }
];

export default  {
  tabs,
  decorationRange,
  orientationRange,
  areaRange,
  houseTypeRange,
  houseingRange,
  priceRange
}
