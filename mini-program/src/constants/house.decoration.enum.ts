enum HouseDecorations {
  "全新豪装家具家电齐全" = 0,
  "全新精装家具家电齐全",
  "住家装修家具家电齐全",
  "中等装修",
  "简装",
  "毛坯"
}


/**
 * 获取装修范围
 */
export function getHouseDecorationRange() {
  return Object.keys(HouseDecorations).filter((item: any) => !isNaN(item)).map(item => HouseDecorations[item] as string);
}

/**
 * 获取装修名称
 * @param id
 */
export function getHouseDecoration(id: string | number) {
  return HouseDecorations[id];
}
