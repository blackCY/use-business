import { useState, useEffect } from "react";
import { getDuration } from "../utils";
import { useIsMounted } from "./useIsMounted";

/**
 * 获取音、视频时长的钩子
 * @param audioUrl 音视频 url
 * @param mediaType type: 'audio' | 'video'，默认 'audio'
 * @returns
 */
export const useDuration = (audioUrl: string, mediaType?: Parameters<typeof getDuration>[0]) => {
  const durationState = useState(0);
  const isMounted = useIsMounted();

  useEffect(() => {
    if (!audioUrl) return;
    // 获取时长
    getDuration(mediaType || "audio", audioUrl)
      .then(duration => {
        isMounted() && durationState[1](duration);
      })
      .catch(err => {
        console.log(`获取音频时长失败(${audioUrl})：`, err);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioUrl]);

  return durationState;
};
