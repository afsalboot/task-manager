import React from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { GripVertical } from "lucide-react";
import TaskCard from "./TaskCard.jsx";

const TaskList = ({ tasks, onDragEnd }) => {
  if (!tasks || tasks.length === 0)
    return <p className="text-center text-gray-500 mt-6">No tasks found.</p>;

  return (
    <div className="mb-10">
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="taskList">
          {(provided) => (
            <ul
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-3"
            >
              {tasks.map((task, index) => (
                <Draggable key={task._id} draggableId={task._id} index={index}>
                  {(provided) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`relative flex items-center justify-between ${
                        task.status === "Completed" ? "opacity-60" : ""
                      }`}
                    >
                      {/* Task content */}
                      <div className="flex-1 mr-3">
                        <TaskCard task={task} />
                      </div>

                      {/* Drag handle */}
                      <div
                        {...provided.dragHandleProps}
                        className="flex items-center justify-center w-9 h-9 rounded-md text-gray-400 hover:text-gray-200 hover:bg-gray-700 cursor-grab active:cursor-grabbing transition"
                        title="Drag to reorder"
                      >
                        <GripVertical size={18} />
                      </div>
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default TaskList;
