/**
 * 获取视频第一帧
 *
 * @param file
 * @param options 包含希望获取到的图片的宽高
 * @returns
 */
export const getVideoFirstFrame = <T = string>(
  file: File,
  options: {
    width: number;
    height: number;
  }
) => {
  return new Promise<T>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    let firstFrameUrl: T;

    reader.onload = () => {
      const videoVirtual = document.createElement("video");
      videoVirtual.src = reader.result as string;

      const videoCanvas = document.createElement("canvas");
      videoCanvas.width = options.width;
      videoCanvas.height = options.height;
      videoCanvas.getContext("2d")?.drawImage(videoVirtual, 0, 0, videoCanvas.width, videoCanvas.height);

      firstFrameUrl = videoCanvas.toDataURL("image/jpeg") as T;
    };

    reader.onerror = err => {
      reject(err);
    };

    reader.onloadend = () => {
      if (!firstFrameUrl) reject("获取视频第一帧出现错误，请排查");

      resolve(firstFrameUrl);
    };
  });
};
