export enum HouseOrientationEnum {
  "东" = 0,
  "西",
  "南",
  "北",
  "东南",
  "西南",
  "东北",
  "西北"
}

/**
 * 获取朝向范围
 */
export function getHouseOrientationRange() {
  return Object
    .keys(HouseOrientationEnum)
    .filter((key: any) => {
      return !isNaN(key)
    })
    .map(item => {
      return {
        label: HouseOrientationEnum[item],
        value: item,
      }
    });
}
export function getHouseOrientationName(type: string|number) {
  return HouseOrientationEnum[type];
}
