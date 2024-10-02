export const localStorageUtil = () => {
  const setItem = (key: string, value: any) => {
    window.localStorage.setItem(key, JSON.stringify(value));
  };
  const getItem = (key: string) => {
    const value = window.localStorage.getItem(key);
    if (value === "undefined") return null;
    return value ? JSON.parse(value) : null;
  };

  return { setItem, getItem };
};
