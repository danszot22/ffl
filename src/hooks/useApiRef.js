import { useMemo, useRef } from "react";

export default function useApiRef(columns) {
  const apiRef = useRef(null);
  const _columns = useMemo(
    () =>
      columns.concat({
        field: " ",
        sortable: false,
        width: 0,
        renderCell: (params) => {
          apiRef.current = params.api;
          return null;
        },
      }),
    [columns]
  );

  return { apiRef, columns: _columns };
}
