import { useState, useCallback } from "react";

type IGroupState<T extends string, Value> = Partial<Record<T, Value>>;

/**
 * 用于管理同一种类型的 state
 * 接收两个泛型，分别是键和值的类型，键的类型是 string 或 string 的联合类型，值的类型可不传，默认是 boolean
 *
 */
export const useGroupState = <K extends string, Value = boolean>(defaultValue?: IGroupState<K, Value>): [{ [key in K]?: Value }, (newState: IGroupState<K, Value>) => void] => {
  const [groupState, setGroupState] = useState<{ [key in K]?: Value }>(defaultValue || {});

  const onGroupState = useCallback(
    (newState: IGroupState<K, Value>) =>
      setGroupState(state => ({
        ...state,
        ...newState,
      })),
    []
  );

  return [groupState, onGroupState];
};
