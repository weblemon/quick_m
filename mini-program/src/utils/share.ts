import Taro from "@tarojs/taro";

export function share(title: string, path: string):Taro.ShareAppMessageReturn {
  return {
    title: title || "快马好房分享",
    path: `/pages/home/index?jumpPath=${escape(path)}`,
  }
}

export function shareRegister(title: string, path: string):Taro.ShareAppMessageReturn {
  return {
    title: title || "快马好房分享",
    path: `/pages/home/index?scene=${escape(path)}`,
  }
}

