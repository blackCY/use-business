import { useState, useEffect, RefObject } from "react";
import { useIsMounted } from "./useIsMounted";

/**
 * 监听目标元素外的点击事件，这里特地用于点击 document 关闭弹窗
 *
 * ```ts
 * interface {
 *   ref: RefObject<T>;
 *   // ref 所在元素关闭时的额外事件函数
 *   onCloseFn?: () => void;
 * }
 * ```
 */
export const useClickAway = <T = HTMLDivElement>(ref: RefObject<T>, onCloseFn?: () => void) => {
  const [visible, setVisible] = useState(false);
  const isMounted = useIsMounted();

  useEffect(() => {
    const clickDocument = (e: MouseEvent) => {
      if (!(ref.current as HTMLDivElement | null)?.contains(e.target as Node) && isMounted()) {
        onClose();
        onCloseFn?.();
      }
    };

    document.addEventListener("click", clickDocument);

    return () => {
      document.removeEventListener("click", clickDocument);
    };
  }, []);

  const onShow = (e: React.MouseEvent) => {
    e.stopPropagation();
    setVisible(true);
  };

  const onClose = () => setVisible(false);

  return {
    visible,
    onShow,
    onClose,
  };
};
