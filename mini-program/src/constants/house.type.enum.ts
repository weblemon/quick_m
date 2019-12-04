export const houseTypeEnum = [
  [
    '1室',
    '2室',
    '3室',
    '4室',
    '5室',
    '6室',
    '7室',
    '8室',
    '9室',
  ],
  [
    '0厅',
    '1厅',
    '2厅',
    '3厅',
    '4厅',
    '5厅',
    '6厅',
    '7厅',
    '8厅',
    '9厅',
  ],
  [
    '0卫',
    '1卫',
    '2卫',
    '3卫',
    '4卫',
    '5卫',
    '6卫',
    '7卫',
    '8卫',
    '9卫',
  ]
];

/**
 * 获取户型类型名称
 * @param houseType
 */
export function getHouseType(houseType: string | number[]): string {
  if (typeof houseType === "string") {
    return houseType.split(",").map((key: string, index: number) => {
      return houseTypeEnum[index][Number(key)];
    }).join("")
  } else if (Array.isArray(houseType)) {
    return houseType.map((key: number, index: number) => {
      return houseTypeEnum[index][Number(key)];
    }).join("");
  } else {
    return  ""
  }
}
