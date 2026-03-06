import { CONTRACT, CONTRACT_FILTER } from "../../config/constants";
import { useFetchById, useFetchList } from "../../hooks";

/* Danh sách contract (có phân trang + filter) */
export const useContractList = (query, config = {}) => {
  return useFetchList(`${CONTRACT}/${CONTRACT_FILTER}`, query, config);
};

/* Contract theo ID */
export const useContractById = (contractId, config = {}) => {
  return useFetchById(CONTRACT, contractId, config);
};