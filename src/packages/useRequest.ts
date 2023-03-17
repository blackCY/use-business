/*
 * 通过 swr 使得我们将传统的请求方式更改为使用 hook 的方式，一个好处在于，在传统意义上，子组件想要得到父组件请求回来的数据，会通过 props 或者 context 的方式，但是使用 swr 则完全可以通过在父子组件分别调用对应的请求 hook，让他们做到独立，最棒的是，只会有 1 个请求 发送到 API，因为它们使用相同的 SWR key，因此请求会被自动 去除重复、缓存 和 共享。详见：https://swr.vercel.app/zh-CN/docs/getting-started#%E7%A4%BA%E4%BE%8B
 */

import useSWR, { SWRResponse, SWRConfiguration } from "swr";
import { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";

export interface Config<Data = unknown, Error = unknown> extends Omit<SWRConfiguration<AxiosResponse<Data>, AxiosError<Error>>, "fallbackData"> {
  fallbackData?: Data;
}

/**
 * isValidating: 是否有请求或重新验证加载
 * mutate:
 *   - 更改缓存数据的函数，使用 mutate，可以传递一个异步函数(此项目中就是 () => axiosInstance.get(url, params))，该函数将接收当前缓存的值(如果有)，并返回一个 updated document
 *   - 详情可见 /src/pages/MaterialLibrary/components/MaterialLayout/index.tsx 里 mutate 的使用
 *
 * @interface Return
 * @extends {(Pick<SWRResponse<AxiosResponse<Data>, AxiosError<Error>>, 'isValidating' | 'error' | 'mutate'>)}
 * @template Data // 数据类型
 * @template Error // 自定义请求错误类型
 */
interface Return<Data, Error> extends Pick<SWRResponse<AxiosResponse<Data>, AxiosError<Error>>, "isValidating" | "error" | "mutate"> {
  data: Data;
  response: AxiosResponse<Data>;
}

const DefaultConfig: SWRConfiguration = {
  shouldRetryOnError: false, // 在请求出现错误后是否重试发送请求
  revalidateIfStale: false, // 控制 SWR 在挂载并且存在陈旧数据时是否应重新请求
  revalidateOnFocus: false, // 标签页聚焦时是否请求
  revalidateOnReconnect: false, // 网络重新连接时是否重试发送请求
};

/**
 * 请求 hook
 *
 * @export
 * @template Data 数据类型
 * @template Error 自定义请求错误类型，可不传
 * @param {AxiosRequestConfig} requestArgs 请求参数
 * @param {Config<Data, Error>} config 为 swr 库的配置 [{ fallbackData, ...config }=DefaultConfig]
 * @return {*}  {Return<Data, Error>}
 */
export function useRequest<Data = unknown, Error = unknown>(requestArgs: AxiosRequestConfig, { fallbackData, ...config }: Config<Data, Error> = DefaultConfig): Return<Data, Error> {
  const { url, params } = requestArgs || { url: "" };

  if (!url) {
    throw Error("你的 url 呢？被你吃啦？😠");
  }

  const {
    data: response = { data: {} } as AxiosResponse<Data>, // 这里给默认值
    error,
    isValidating,
    mutate,
  } = useSWR<AxiosResponse<Data>, AxiosError<Error>>(
    requestArgs,
    () =>
      // 请求方法
      new Promise(() => {}),
    {
      ...config,
      fallbackData: fallbackData && {
        status: 200,
        statusText: "InitialData",
        config: requestArgs!,
        headers: {},
        data: fallbackData,
      },
    }
  );

  return {
    data: response?.data,
    response,
    error,
    isValidating,
    mutate,
  };
}
