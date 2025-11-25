import { useCallback, useMemo, useState } from "react";

import { PAGE_SIZE_OPTIONS } from "../../../config/constants.js";
import { ensureNumber } from "../../../utils/number.js";

export const useCatalogControls = ({
  defaultSort = "relevance",
  defaultPageSize = PAGE_SIZE_OPTIONS[0],
  onItemsPerPageChange,
} = {}) => {
  const [sort, setSort] = useState(defaultSort);
  const [itemsPerPage, setItemsPerPage] = useState(defaultPageSize);

  const handleChangeItemsPerPage = useCallback(
    (nextValue) => {
      const numericValue = Math.max(1, ensureNumber(nextValue, defaultPageSize));
      setItemsPerPage(numericValue);
      onItemsPerPageChange?.(numericValue);
    },
    [defaultPageSize, onItemsPerPageChange],
  );

  const controls = useMemo(
    () => ({
      sort,
      setSort,
      itemsPerPage,
      handleChangeItemsPerPage,
      pageSizeOptions: PAGE_SIZE_OPTIONS,
    }),
    [sort, setSort, itemsPerPage, handleChangeItemsPerPage],
  );

  return controls;
};
