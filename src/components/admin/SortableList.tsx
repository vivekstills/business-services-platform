import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

type SortableItemProps<T> = {
  id: string;
  item: T;
  index: number;
  children: React.ReactNode;
  className?: string;
};

function SortableItem<T>({ id, children, className = '' }: SortableItemProps<T>) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-start gap-2 group ${isDragging ? 'opacity-50 z-10' : ''} ${className}`}
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="mt-2 p-1 rounded cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 hover:bg-gray-100 touch-none"
        aria-label="Drag to reorder"
      >
        <GripVertical className="w-4 h-4" />
      </button>
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}

type SortableListProps<T> = {
  items: T[];
  onReorder: (items: T[]) => void;
  getItemId: (item: T, index: number) => string;
  renderItem: (item: T, index: number) => React.ReactNode;
  itemClassName?: string;
};

export function SortableList<T>({
  items,
  onReorder,
  getItemId,
  renderItem,
  itemClassName,
}: SortableListProps<T>) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const ids = items.map((item, i) => getItemId(item, i));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = ids.indexOf(active.id as string);
    const newIndex = ids.indexOf(over.id as string);
    if (oldIndex !== -1 && newIndex !== -1) {
      onReorder(arrayMove(items, oldIndex, newIndex));
    }
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={ids} strategy={verticalListSortingStrategy}>
        <div className="space-y-3">
          {items.map((item, i) => (
            <SortableItem
              key={ids[i]}
              id={ids[i]}
              item={item}
              index={i}
              className={itemClassName}
            >
              {renderItem(item, i)}
            </SortableItem>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
