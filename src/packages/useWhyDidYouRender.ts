import { useEffect, useRef } from "react";

export type IProps = Record<string, any>;

/**
 * @desc
 * 通过 useWhyDidYouRender 可查看前后组件 re-render 的 props 变化
 * @param {string} componentName 组件 name
 * @param {IProps} props
 */
export function useWhyDidYouRender(componentName: string, props: IProps) {
  const previousProps = useRef<IProps>({});

  useEffect(() => {
    if (previousProps.current) {
      // 获取到之前的和现在的 props 所有 key
      const allKeys = Object.keys({ ...previousProps.current, ...props });
      // 使用这个对象追踪 props 的变化
      const changesObj: IProps = {};
      // 迭代 keys
      allKeys.forEach(key => {
        if (previousProps.current[key] !== props[key]) {
          // 添加到 changesObj
          changesObj[key] = {
            from: previousProps.current[key],
            to: props[key],
          };
        }
      });

      // 如果 changesObj 不为空，就输出到 console
      if (Object.keys(changesObj).length) {
        console.log("[why-did-you-update]", componentName, changesObj);
      }
    }

    // 最后用当前的 props 更新 previousProps 用于下次 hook 调用
    previousProps.current = props;
  });
}
