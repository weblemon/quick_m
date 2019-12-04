enum HouseElevatorEnum {
  "有" = 0,
  "无"
}

/**
 * 获取电梯范围
 */
export function getHouseElevatorRange() {
  return Object.keys(HouseElevatorEnum).filter((item: any) => !isNaN(item)).map(item => HouseElevatorEnum[item]);
}

/**
 * 获取电梯类型
 * @param type
 */
export function getHouseElevator(type: string | number) {
  return HouseElevatorEnum[type];
}
