/**
 * 优雅的处理 async/await 的错误的函数，用于铺平 Promise、trycatch
 *
 * @template T
 * @template U
 * @param {Promise<T>} promise
 * @param {object} [errorExt] // 可以传递给err对象的附加信息
 * @return {*}  {(Promise<[U, undefined] | [null, T]>)}
 */
export const flatPromise = <T, U = Error>(promise: Promise<T>, errorExt?: object): Promise<[U, undefined] | [null, T]> => {
  return promise
    .then<[null, T]>((data: T) => [null, data])
    .catch<[U, undefined]>((err: U) => {
      if (errorExt) {
        const parsedError = Object.assign({}, err, errorExt);
        return [parsedError, undefined];
      }
      return [err, undefined];
    });
};
