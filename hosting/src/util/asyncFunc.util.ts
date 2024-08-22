export const asyncFunc = <T>(func: () => Promise<T>) => {
  func();
};
