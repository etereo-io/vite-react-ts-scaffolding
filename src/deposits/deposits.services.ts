import axios from "axios";

import { ApiListResponse, getEndpoint } from "@/app/api";

import { Deposit } from "./deposits.types";

export function fetchDeposits() {
  return axios.get<ApiListResponse<Deposit[]>>(getEndpoint() + "deposits").then((res) => res.data);
}

export function deleteDeposit(depositId: string) {
  return axios.delete(getEndpoint() + `deposits/${depositId}`, {
    method: "DELETE",
  });
}
