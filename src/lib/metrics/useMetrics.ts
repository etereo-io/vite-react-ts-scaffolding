// example of a hook that can be used to send metrics to an analytics service
export function useMetrics() {
  return {
    event: (name: string) => {
      // eslint-disable-next-line no-console
      console.log("event =>", name);
    },
  };
}
