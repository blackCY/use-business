import { useRef } from "react";
import { useIsMounted } from "./useIsMounted";
import { useAtom, atom } from "jotai";
import { flatPromise } from "../utils";
import { nanoid } from "nanoid";

const audioInfoAtom = atom<{
  /** 音频 url */
  src: string;
  /** 全局音频的播放状态 */
  playStatus?: "playing" | "pause";
  /** 当前播放音频的播放进度 */
  currentTime?: number;
  /** 全局记录的当前播放音频的 id */
  audioId?: string;
}>({
  src: "",
  playStatus: "pause",
  currentTime: 0,
  audioId: "",
});

/**
 * 获取全局的播放音频状态信息 hook
 * 这里只用于获取全局音频信息，其余设置操作一律交给 useAudioControl
 *
 * @return {*}
 */
export const useAudioInfo = () => {
  const [audioInfo] = useAtom(audioInfoAtom);
  return audioInfo;
};

const audioInstance = atom<HTMLMediaElement | null>(null);

/** 获取当前音频元素实例，全局设置用，其他时候不用管 */
export const useAudioInstance = () => {
  return useAtom(audioInstance);
};

/**
 * 全局音频控制器
 *
 */
export const useAudioControl = () => {
  const [audioInfo, setAudioInfo] = useAtom(audioInfoAtom);
  const isMounted = useIsMounted();
  const [audioInstance] = useAudioInstance();
  const audioIdRef = useRef<string>("");
  audioIdRef.current = audioIdRef.current || nanoid();
  const onPause = useAudioPause();

  const control = {
    /**
     * 拖动设置进度函数
     * @param value 进度值
     * @param syncToElement 是否同步进度到 audio 元素，默认已经同步了，不用传
     * @returns
     */
    setCurrentTime: (value: number, syncToElement: boolean = true) => {
      if (!audioInstance) return;

      syncToElement && (audioInstance.currentTime = value);
      setAudioInfo(state => ({
        ...state,
        currentTime: value,
      }));
    },
    /**
     * 播放函数
     * @param src 播放的音频
     * @param currentTime 可选，用于设置当前音频播放进度
     * @returns
     */
    onPlay: (src: string, currentTime?: number) => {
      return new Promise((resolve, reject) => {
        if (!audioInstance || !isMounted()) return reject("");

        setAudioInfo({
          src,
          playStatus: "playing",
          audioId: audioIdRef.current,
        });
        resolve("");
      })
        .then(async () => {
          if (currentTime !== undefined) {
            control.setCurrentTime(currentTime);
          }

          const [playError] = await flatPromise(audioInstance!.play());

          if (playError) {
            setAudioInfo({
              src: "",
              playStatus: "pause",
              audioId: "",
            });
            return Promise.reject();
          }
        })
        .catch(() => {
          console.log("播放错误，请刷新浏览器重试");
        });
    },
    /** 音频暂停函数 */
    onPause,
    /** 当前音频播放状态 */
    isPlaying: audioIdRef.current === audioInfo.audioId,
  };

  return control;
};

/**
 * 全局音频暂停 hook
 *
 */
export const useAudioPause = () => {
  const isMounted = useIsMounted();
  const [audioInstance] = useAudioInstance();
  const [, setAudioInfo] = useAtom(audioInfoAtom);

  /**
   * 暂停音频函数
   * @returns
   */
  const onPause = () => {
    if (!audioInstance || !isMounted()) return;

    audioInstance?.pause();
    setAudioInfo(state => ({
      ...state,
      playStatus: "pause",
      audioId: "",
    }));
  };

  return onPause;
};
