/**
 * formatAudioTime
 * 格式化音频时间(最大位数是分钟)
 *
 * @param {number} time 原时长(单位 s)
 * @param {number} digits 保留几位小数
 * @return {*}  {string}
 */
export const formatAudioTime = (time: number = 0, digits = 2): string => {
  const minutes = (Math.floor(time / 60) + "").padStart(2, "0");

  const seconds = (Math.floor(time % 60) + "").padStart(2, "0");

  let pointNum = (time + "").split(".")[1];
  if (pointNum) {
    if (pointNum.length < digits) {
      const fills = digits - pointNum.length;
      pointNum = pointNum + new Array(fills).fill("0").join("");
    } else {
      pointNum = pointNum.slice(0, digits);
    }
  } else {
    pointNum = "00";
  }

  if (digits === 0) return minutes + ":" + seconds;

  return minutes + ":" + seconds + "." + pointNum;
};

/**
 * 格式化视频时间(最大位数是小时)
 * @param time 原时长(单位 s)
 * @return {*} {string}
 */
export const formatVideoTime = (time: number = 0): string => {
  if (time === 0) return "00:00:00";

  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = parseInt((time % 60).toFixed());

  return (hours < 10 ? `0${hours}` : hours) + ":" + (minutes < 10 ? `0${minutes}` : minutes) + ":" + (seconds < 10 ? `0${seconds}` : seconds);
};
