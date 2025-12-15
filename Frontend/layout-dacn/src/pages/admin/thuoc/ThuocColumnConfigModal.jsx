import React from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

export default function ThuocColumnConfigModal({ open, onClose, columns, setColumns }) {
  if (!open) return null;

  // ✅ Xử lý kéo thả
  const onDragEnd = (result) => {
    if (!result.destination) return;

    const reordered = Array.from(columns);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    setColumns(reordered);
  };

  // ✅ Toggle bật / tắt hiển thị cột
  const toggleVisible = (id) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.id === id ? { ...col, visible: !col.visible } : col
      )
    );
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-5 w-[420px] shadow-lg">
        <h2 className="text-lg font-semibold text-sky-700 mb-4 text-center">
          ⚙ Cấu hình cột hiển thị
        </h2>

        {/* ✅ Kéo thả hoạt động đúng */}
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="columns">
            {(provided) => (
              <ul
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-2 max-h-[400px] overflow-y-auto"
              >
                {columns.map((col, index) => (
                  <Draggable key={col.id} draggableId={col.id} index={index}>
                    {(prov, snapshot) => (
                      <li
                        ref={prov.innerRef}
                        {...prov.draggableProps}
                        {...prov.dragHandleProps}
                        className={`flex items-center justify-between bg-sky-50 border border-sky-200 px-3 py-2 rounded-lg select-none transition-all duration-100 ${
                          snapshot.isDragging ? "bg-sky-100 shadow-md" : ""
                        }`}
                      >
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={col.visible}
                            onChange={() => toggleVisible(col.id)}
                          />
                          <span className="text-sm text-gray-700">
                            {col.label}
                          </span>
                        </label>
                        <span className="cursor-grab text-gray-400 text-sm">
                          ↕
                        </span>
                      </li>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>

        <div className="mt-5 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg text-sm"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
