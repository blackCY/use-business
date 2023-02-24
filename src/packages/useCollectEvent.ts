import { useRef, useCallback } from "react";

type IGenerateEventType<T> = (eventType: keyof T, eventFn: T[keyof T]) => void;

export interface IAddEvent<T> {
  addEvent: IGenerateEventType<T>;
}

/**
 * 用于取代 forwardRef，通过父组件调用此 hook，传递给子组件，子组件注册对应的函数值，父组件进行调用
 *
 */
export const useCollectEvent = <T>() => {
  const eventCollection = useRef<{
    [key in keyof T]?: T[key];
  }>({});

  const addEvent = useCallback<IGenerateEventType<T>>((eventType, eventFn) => {
    eventCollection.current[eventType] = eventFn;
  }, []);

  return {
    eventCollection: eventCollection.current,
    addEvent,
  };
};
