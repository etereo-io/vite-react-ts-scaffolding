import * as React from "react";

interface TitleProps {
  readonly children?: React.ReactNode;
}

export function Title(props: TitleProps) {
  return (
    <h2 className="text-lg font-semibold text-blue-600 mb-4">
      {props.children}
    </h2>
  );
}
