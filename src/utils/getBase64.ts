/**
 * 将文件转为 base64
 *
 * @param {File} file
 * @return {*}
 */
export const getBase64 = <T = string>(file: File) => {
  return new Promise<T>((resolve, reject) => {
    const reader = new FileReader();
    let imgRes: any;

    reader.readAsDataURL(file);
    reader.onload = () => {
      imgRes = reader.result;
    };
    reader.onerror = err => {
      reject(err);
    };
    reader.onloadend = () => {
      resolve(imgRes);
    };
  });
};
