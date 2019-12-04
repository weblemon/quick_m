export enum HouseHouseingtypeEnum {
  "高层" = 0,
  "洋房",
  "别墅",
  "商业",
  "步行房"
}

export function getHouseingRange() {
  return Object
    .keys(HouseHouseingtypeEnum)
    .filter((key: any) => {
      return !isNaN(key)
    })
    .map(item => {
      return {
        label: HouseHouseingtypeEnum[item],
        value: item,
      }
    });
}
export function getHouseingName(type: string | number) {
  return HouseHouseingtypeEnum[type];
}
