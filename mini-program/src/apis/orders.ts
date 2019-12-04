import {http} from "../utils/http";

/**
 * 保存订单
 */
export function saveOrders(userId: number, money: number) {
  return http.post("/orders/save", {
    userId,
    money
  })
}
