"use client";

import { DndContext, DragOverlay, PointerSensor, TouchSensor, useSensor, useSensors, closestCenter, type DragEndEvent, type DragStartEvent } from "@dnd-kit/core";
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState, type ReactNode } from "react";

// A reusable vertical sortable list. The dragged card is rendered as an
// overlay (in a portal) so the ghost follows the cursor exactly even when
// the surrounding layout has padding, flex gaps or a sibling column — the
// naive "translate in place" mode can drift right/down in those cases.

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
  const [activeId, setActiveId] = useState<string | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 120, tolerance: 5 } })
  );

  const activeIndex = activeId ? items.findIndex((i) => i.id === activeId) : -1;
  const activeItem = activeIndex >= 0 ? items[activeIndex] : null;

  function handleDragStart(e: DragStartEvent) {
    setActiveId(String(e.active.id));
  }

  function handleDragEnd(e: DragEndEvent) {
    setActiveId(null);
    const { active, over } = e;
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
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveId(null)}
    >
      <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-2.5">
          {items.map((item, i) => (
            <SortableWrapper key={item.id} id={item.id}>
              {(isDragging) => renderItem(item, { index: i, isDragging })}
            </SortableWrapper>
          ))}
        </div>
      </SortableContext>
      <DragOverlay dropAnimation={null}>
        {activeItem ? (
          <div className="rotate-1">{renderItem(activeItem, { index: activeIndex, isDragging: true })}</div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

function SortableWrapper({ id, children }: { id: string; children: (isDragging: boolean) => ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  return (
    <div
      ref={setNodeRef}
      style={{
        // Only apply the reorder transform to non-dragging items — the dragged
        // card is rendered by DragOverlay and the original is dimmed in place.
        transform: isDragging ? undefined : CSS.Transform.toString(transform),
        transition,
        touchAction: "none",
        opacity: isDragging ? 0.35 : 1,
      }}
      {...attributes}
      {...listeners}
      className="cursor-grab select-none active:cursor-grabbing"
    >
      {children(isDragging)}
    </div>
  );
}
