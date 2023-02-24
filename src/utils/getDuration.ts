/**
 * 根据 url 获取音视频时长
 * @param audioUrl
 */
export const getDuration = (type: "audio" | "video", audioUrl: string) => {
  return new Promise<number>((resolve, reject) => {
    const audioEl = document.createElement(type);
    audioEl.src = audioUrl;
    audioEl.onloadedmetadata = () => {
      resolve(audioEl.duration);
    };
    audioEl.onerror = err => {
      reject(err);
    };
  });
};
