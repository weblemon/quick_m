export enum HouseDoorLookTypeEnum {
  "密码锁" = 0,
  "指纹密码锁",
  "普通门锁"
}

export function getHouseDoorLookTypeRange() {
  return Object.keys(HouseDoorLookTypeEnum).filter((item:any) => !isNaN(item)).map(item => {
    return HouseDoorLookTypeEnum[item];
  })
}
export function getHouseDoorLookType(type: string | number) {
    return HouseDoorLookTypeEnum[type];
}
