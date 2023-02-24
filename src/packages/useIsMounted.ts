import { useEffect, useRef } from "react";

/** 查看当前组件状态是否是挂载的 hook */
export const useIsMounted = () => {
  const isMountedRef = useRef<boolean>(false);

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return () => isMountedRef.current;
};
