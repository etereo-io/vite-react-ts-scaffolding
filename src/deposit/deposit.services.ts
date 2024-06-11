import axios from "axios";

import { ApiListResponse, getEndpoint } from "@/app/api";

import { Deposit } from "./deposit.types";

export function fetchDeposits() {
  return axios.get<ApiListResponse<Deposit[]>>(getEndpoint() + "deposits").then((res) => res.data);
}
