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

/**
 * useIsMounted 的返回值是一个函数而非 isMountedRef.current 的原因(显然两者都能实时访问到 isMountedRef.current 的最新值)：
 *
 * 将其作为一个函数返回可以提供更好的封装性，通过将 isMountedRef 的值包装在一个函数中，我们可以隐藏其实现细节，并使其更易于在其他组件中使用。如果将来我们需要更改实现细节，我们只需要更改 useIsMounted 的实现而不需要更改使用它的所有组件。
 */
