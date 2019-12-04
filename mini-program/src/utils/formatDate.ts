import DateDiff from "date-diff";

export function formatHouseDate(time: string) {
  if (typeof time !== "string") {
    console.error("日期返回格式错误");
    return "";
  }
  const nowDate = new Date();
  const diffDate = new Date(time.substring(0, 16).replace('T', ' ').replace(/\-/g, '/'));
  let date: string| number = diffDate.getDate()
  let MM: string | number = diffDate.getMonth() + 1
  let mm: string | number = diffDate.getMinutes()
  let hh: string | number = diffDate.getHours()

  if (date < 10) date = `0${date}`;
  if (MM < 10) MM = `0${MM}`;
  if (mm < 10) mm = `0${mm}`;
  if (hh < 10) hh = `0${hh}`

  const diff =  new DateDiff(nowDate, diffDate)
  if (diff.seconds() < 60) {
    return `刚刚${Math.ceil(diff.seconds())}秒前`
  }

  if (diff.minutes() < 60) {
    return `${Math.ceil(diff.minutes())}分钟前`
  }
  const diffDay = diff.days()
  if (diffDay < 1) {
    return `${Math.ceil(diff.hours())}小时前`
  }
  if (diffDay < 2) {
    return `昨天 ${hh}:${mm}`
  }
  if (diffDay <= 3) {
    return `前天 ${hh}:${mm}`
  }

  if (diffDay > 3) {
    return `${ diffDay > 7 ? 7 : Math.floor(diffDay) }天前`
  }
  return `${diffDate.getFullYear()}-${MM}-${date} ${hh}:${mm}`
}

export function formatDate(date: string) {
  const dd = new Date(date.substring(0, 16).replace('T', ' ').replace(/\-/g, '/'));
  let d: string| number = dd.getDate()
  let MM: string | number = dd.getMonth() + 1
  let mm: string | number = dd.getMinutes()
  let hh: string | number = dd.getHours()

  if (d < 10) d = `0${d}`;
  if (MM < 10) MM = `0${MM}`;
  if (mm < 10) mm = `0${mm}`;
  if (hh < 10) hh = `0${hh}`;

  return `${dd.getFullYear()}-${MM}-${d} ${hh}:${mm}`;
}

export function diffDate(aTime: string, bTime: string) {
  if (typeof aTime !== "string") {
    console.error("日期返回格式错误");
    return "";
  }
  const dateA = new Date(aTime.substring(0, 16).replace('T', ' ').replace(/\-/g, '/'));
  let dateB = new Date();
    if (typeof bTime === "string" && bTime !== "") {
      dateB = new Date(bTime.substring(0, 16).replace('T', ' ').replace(/\-/g, '/'));
    }

  return  Math.ceil((dateB.getTime() - dateA.getTime()) / (1000 * 60 * 60 * 24));
}
