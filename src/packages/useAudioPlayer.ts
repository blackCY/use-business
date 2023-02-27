import { useState, useEffect } from "react";
import { useAudioControl, useIsMounted, useAudioInfo, useDuration } from "./index";

/**
 * 音频播放通用功能 hook
 * @param audioUrl
 * @returns
 */
export const useAudioPlayer = (audioUrl: string) => {
  const { isPlaying, onPause, onPlay, setCurrentTime } = useAudioControl();
  const audioInfo = useAudioInfo();
  const isMounted = useIsMounted();
  const [progressVal, setProgressVal] = useState(0);
  const [duration] = useDuration(audioUrl);

  useEffect(() => {
    // 如果当前是播放中，设置播放进度
    if (!isPlaying || !isMounted()) return;
    setProgressVal(audioInfo.currentTime || 0);
  }, [audioInfo.currentTime, isPlaying]);

  /** 音频播放控制函数 */
  const onToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPlaying) {
      onPause();
    } else {
      onPlay(audioUrl!, progressVal >= duration ? 0 : progressVal);
    }
  };

  /* 拖动改变时长 */
  const onSliderChange = (val: number) => {
    const curTime = duration * (val / 100);
    // 如果当前音频是正在播放的音频并且是处于播放中，那么只设置进度即可，否则需要手动播放
    if (isPlaying) {
      setCurrentTime(curTime);
    } else {
      onPlay(audioUrl!, curTime);
    }
  };

  return {
    isPlaying,
    duration,
    currentTime: progressVal,
    onToggle,
    onSliderChange,
  };
};
