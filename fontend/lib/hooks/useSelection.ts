"use client";

import { useMemo, useState } from "react";

/**
 * Checkbox selection for a table. `selectableIds` is the currently visible,
 * selectable set so the header checkbox only speaks for rows the user can see.
 */
export function useSelection(selectableIds: string[]) {
  const [selected, setSelected] = useState<string[]>([]);

  // Drop ids that no longer exist (deleted, filtered out, or on another page).
  const active = useMemo(
    () => selected.filter((id) => selectableIds.includes(id)),
    [selected, selectableIds],
  );

  const allSelected = selectableIds.length > 0 && active.length === selectableIds.length;

  function toggle(id: string) {
    setSelected((current) =>
      current.includes(id) ? current.filter((x) => x !== id) : [...current, id],
    );
  }

  function toggleAll() {
    setSelected(allSelected ? [] : selectableIds);
  }

  return {
    selected: active,
    count: active.length,
    isSelected: (id: string) => active.includes(id),
    toggle,
    toggleAll,
    allSelected,
    clear: () => setSelected([]),
  };
}
