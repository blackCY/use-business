import { useState, useRef, useCallback } from "react";

/**
 * 水平菜单滚动 hook
 *
 * ```ts
 * interface {
 *   // menus 的长度
 *   maxSize,
 *   // 默认选中索引
 *   defaultIndex,
 *   // menu item 的类名
 *   className = 'menu-scroll',
 * }
 * ```
 *
 */
export const useMenuScroll = ({ maxSize, defaultIndex, className = "menu-scroll" }: { maxSize: number; defaultIndex?: number; className?: string }) => {
  const [menuSelectedIdx, setMenuSelectedIdx] = useState<number>(defaultIndex || 0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  /** 计算容器最新 scrollLeft */
  const onComputedContainer = useCallback((idx: number) => {
    if (!containerRef.current) return;

    // 得到最新选中的样式信息
    const curMenuEl = document.getElementsByClassName(className)[idx] as HTMLDivElement;

    const containerWidth = containerRef.current.offsetWidth;
    const menuWidth = curMenuEl.offsetWidth;
    const menuLeft = curMenuEl.offsetLeft;
    const menuRight = menuLeft + menuWidth;

    const containerScrollLeft = containerRef.current.scrollLeft;
    const containerRight = containerScrollLeft + containerWidth;

    if (menuLeft <= containerScrollLeft + menuWidth) {
      containerRef.current.scrollLeft = menuLeft - menuWidth;
    }

    if (menuRight >= containerRight - menuWidth) {
      containerRef.current.scrollLeft = menuRight - containerWidth + menuWidth;
    }
  }, []);

  /** 点击 menu item */
  const onClickMenu = (idx: number) => {
    if (idx === menuSelectedIdx) return;

    setMenuSelectedIdx(idx);
    onComputedContainer(idx);
  };

  /** 点击左右切换按钮 */
  const onClickArrow = (type: "left" | "right") => {
    switch (type) {
      case "left": {
        if (menuSelectedIdx === 0) return;

        const newestIdx = menuSelectedIdx - 1;
        setMenuSelectedIdx(newestIdx);
        return onComputedContainer(newestIdx);
      }
      case "right": {
        if (menuSelectedIdx === maxSize - 1) return;

        const newestIdx = menuSelectedIdx + 1;
        setMenuSelectedIdx(newestIdx);
        return onComputedContainer(newestIdx);
      }
      default:
        return;
    }
  };

  return {
    menuSelectedIdx,
    containerRef,
    onClickMenu,
    onClickArrow,
  };
};
