export const fmt = (n) => {
  if (n === null || n === undefined) return '';
  return n.toLocaleString('vi-VN') + 'd';
};
