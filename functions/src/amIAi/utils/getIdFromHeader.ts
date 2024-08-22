export const extractIdFromHeader = (param: {
  headers: {
    'x-user-id'?: string | string[];
    'x-language'?: string | string[];
    string?: string | string[];
  };
}): { userId: string; language: 0 | 1 } => {
  return {
    userId: param.headers['x-user-id'] as string,
    language: Number(param.headers['x-language'] as string) as 0 | 1,
  };
};
