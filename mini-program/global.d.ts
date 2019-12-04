import Global = WebAssembly.Global;

declare module "*.png";
declare module "*.gif";
declare module "*.jpg";
declare module "*.jpeg";
declare module "*.svg";
declare module "*.css";
declare module "*.less";
declare module "*.scss";
declare module "*.sass";
declare module "*.styl";

// @ts-ignore
declare const process: {
  env: {
    TARO_ENV: 'weapp' | 'swan' | 'alipay' | 'h5' | 'rn' | 'tt';
    [key: string]: any;
  }
};

declare module "date-diff" {
  interface DateDiffConstructor {
    date1: Date;
    date2: Date;
    difference: number;
    new(date1: Date, date2: Date): DateDiffConstructor;
    beginOfYear(date: Date): any;
    dayOfYear(date: Date): any;
    days(): any;
    daysInYear(date: Date): any;
    endOfMonth(date: Date): any;
    endOfYear(date: Date): any;
    hours(): number;
    minutes(): number;
    months(): number;
    seconds(): number;
    weeks(): number;
    years(): number;
  }

  const DateDiff: DateDiffConstructor;
  export default DateDiff;
}
