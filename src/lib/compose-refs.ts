import type { MutableRefObject, Ref, RefCallback } from "react";

type PossibleRef<T> = Ref<T> | undefined;

function setRef<T>(ref: PossibleRef<T>, value: T): void {
  if (typeof ref === "function") {
    ref(value);
  } else if (ref !== null && ref !== undefined) {
    (ref as MutableRefObject<T>).current = value;
  }
}

export function composeRefs<T>(...refs: PossibleRef<T>[]): RefCallback<T> {
  return (node: T) => {
    for (const ref of refs) {
      setRef(ref, node);
    }
  };
}
