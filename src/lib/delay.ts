export const delay = (fn: () => void, ms?: number) => {
  const DEFAULT_DELAY = process.env.VITE_DEFAULT_DELAY ? parseInt(process.env.VITE_DEFAULT_DELAY) : 500;

  return new Promise<void>((resolve) => {
    setTimeout(() => {
      fn();
      resolve();
    }, ms ?? DEFAULT_DELAY);
  });
};
