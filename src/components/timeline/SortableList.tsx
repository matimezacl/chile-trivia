"use client";

import { DndContext, PointerSensor, TouchSensor, useSensor, useSensors, closestCenter, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { ReactNode } from "react";

// A reusable vertical sortable list. Renders each item via a render prop so
// the caller controls the card visuals; this component only handles drag.

export interface SortableListItem {
  id: string;
}

export function SortableList<T extends SortableListItem>({
  items,
  onChange,
  renderItem,
  disabled = false,
}: {
  items: T[];
  onChange: (next: T[]) => void;
  renderItem: (item: T, args: { index: number; isDragging: boolean }) => ReactNode;
  disabled?: boolean;
}) {
  // Small activation distance so accidental taps aren't treated as drags on
  // mobile — matters because the whole card is grabbable, not a handle.
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 120, tolerance: 5 } })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const from = items.findIndex((i) => i.id === active.id);
    const to = items.findIndex((i) => i.id === over.id);
    if (from < 0 || to < 0) return;
    onChange(arrayMove(items, from, to));
  }

  if (disabled) {
    return (
      <div className="flex flex-col gap-2.5">
        {items.map((item, i) => (
          <div key={item.id}>{renderItem(item, { index: i, isDragging: false })}</div>
        ))}
      </div>
    );
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-2.5">
          {items.map((item, i) => (
            <SortableWrapper key={item.id} id={item.id}>
              {(isDragging) => renderItem(item, { index: i, isDragging })}
            </SortableWrapper>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

function SortableWrapper({ id, children }: { id: string; children: (isDragging: boolean) => ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        touchAction: "none",
        zIndex: isDragging ? 10 : "auto",
      }}
      {...attributes}
      {...listeners}
      className="cursor-grab select-none active:cursor-grabbing"
    >
      {children(isDragging)}
    </div>
  );
}
