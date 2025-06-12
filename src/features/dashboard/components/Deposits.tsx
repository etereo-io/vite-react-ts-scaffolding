import * as React from "react";

import { Title } from "@/shared/components/Title";

function preventDefault(event: React.MouseEvent) {
  event.preventDefault();
}

export function Deposits() {
  return (
    <React.Fragment>
      <Title>Recent Deposits</Title>
      <div className="text-3xl font-bold text-gray-900 mb-2">$3,024.00</div>
      <div className="text-sm text-gray-500 flex-1">on 15 March, 2019</div>
      <div>
        <a
          href="#"
          onClick={preventDefault}
          className="text-blue-600 hover:text-blue-800 text-sm transition-colors"
        >
          View balance
        </a>
      </div>
    </React.Fragment>
  );
}
