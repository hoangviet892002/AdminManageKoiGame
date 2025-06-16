export const parseArrayParam = (param: string | string[] | undefined) => {
  if (!param) return [];
  return Array.isArray(param) ? param : [param];
};
