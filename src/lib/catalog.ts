import { queryOptions } from "@tanstack/react-query";
import { getCatalog } from "./catalog.functions";

export { formatMoney } from "./catalog-types";
export type { Sku } from "./catalog-types";

export const catalogQueryOptions = queryOptions({
  queryKey: ["catalog"],
  queryFn: () => getCatalog(),
  staleTime: 5 * 60 * 1000, // 5 min on client
});
