/**
 * 将图片 url 转为 File 对象
 * @param url 图片
 * @param imageName 图片名称
 * @returns
 */
export function getImageFileFromUrl(url: string, imageName: string) {
  return new Promise<File>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    // 这里固定为 jpeg 格式，因为腾讯云 sdk 里用的是这个
    xhr.setRequestHeader("Accept", "image/jpeg");
    xhr.responseType = "blob";
    xhr.onload = () => {
      // 获取返回结果
      const imgFile = new File([xhr.response], imageName, { type: "image/jpeg" });
      resolve(imgFile);
    };
    xhr.onerror = e => {
      reject(e);
    };
    xhr.send();
  });
}
