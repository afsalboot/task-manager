import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import { Check, Clock, Edit, Play, Save, Trash2 } from "lucide-react";

const TaskCard = ({ task }) => {
  const { updateTask, deleteTask } = useContext(AppContext);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");

  // Cycle status: Pending → In Progress → Completed → Pending
  const cycleStatus = async () => {
    const nextStatus =
      task.status === "Pending"
        ? "In Progress"
        : task.status === "In Progress"
        ? "Completed"
        : "Pending";

    try {
      await updateTask(task._id, { status: nextStatus });
    } catch (err) {
      console.error("Failed to update status:", err.message);
    }
  };

  // Toggle priority (cycles through Low → Medium → High)
  const togglePriority = async () => {
    const priorities = ["Low", "Medium", "High"];
    const currentIdx = priorities.indexOf(task.priority || "Low");
    const nextPriority = priorities[(currentIdx + 1) % priorities.length];

    try {
      await updateTask(task._id, { priority: nextPriority });
    } catch (err) {
      console.error("Failed to update priority:", err);
    }
  };

  // Save edited task
  const handleSave = async () => {
    if (!title.trim()) return;
    try {
      await updateTask(task._id, { title, description });
      setEditing(false);
    } catch (err) {
      console.error("Failed to update task:", err);
    }
  };

  // Delete task
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await deleteTask(task._id);
      } catch (err) {
        console.error("Failed to delete task:", err);
      }
    }
  };

  // Status styles + icons
  const statusInfo = {
    Pending: { color: "bg-ending-status text-text-statusp", icon: <Clock size={12} /> },
    "In Progress": { color: "bg-inprogress-status text-text-status", icon: <Play size={12} /> },
    Completed: { color: "bg-complete-status text-text-status", icon: <Check size={12} /> },
  };

  // Priority badge color
  const priorityColors = {
    low: "bg-green-200 text-green-700 dark:bg-green-800 dark:text-green-300",
    medium:
      "bg-yellow-200 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-300",
    high: "bg-red-200 text-red-700 dark:bg-red-800 dark:text-red-300",
  };

  return (
    <div
      className={`p-4 rounded-xl shadow-md mb-3 transition-all duration-300
      bg-light-primary dark:bg-dark-primary hover:scale-[1.02] hover:shadow-lg`}
    >
      <div className="flex justify-between items-start gap-3">
        {/* Left: Status Toggle + Content */}
        <div className="flex items-start gap-3 w-full">
          {/* 3-way Status Toggle */}
          <div
            onClick={cycleStatus}
            className={`flex items-center justify-center w-5 h-5 rounded-full cursor-pointer transition-colors duration-300
            ${statusInfo[task.status]?.color}`}
            title={`Status: ${task.status}`}
          >
            {statusInfo[task.status]?.icon}
          </div>

          {/* Title and Description */}
          <div className="flex flex-col w-full">
            {editing ? (
              <>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="border p-1 rounded-md mb-2 bg-light-primary dark:bg-dark-primary text-light-text-dull dark:text-dark-text "
                />
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="2"
                  placeholder="Add description..."
                  className="border p-1 rounded-md dark:bg-dark-primary dark:text-light-text"
                />
              </>
            ) : (
              <>
                <h3
                  className={`text-lg font-semibold ${
                    task.status === "Completed"
                      ? "line-through text-gray-400"
                      : "text-light-text-dull dark:text-dark-text"
                  }`}
                >
                  {task.title}
                </h3>
                {task.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {task.description}
                  </p>
                )}
              </>
            )}

            {/* Priority & Due Date */}
            <div className="flex items-center gap-3 mt-2">
              <button
                onClick={togglePriority}
                className={`text-xs px-2 py-1 rounded-full capitalize font-medium transition-colors duration-200 
                  ${
                    priorityColors[task.priority?.toLowerCase()] ||
                    priorityColors.medium
                  }`}
                title="Click to change priority"
              >
                {task.priority || "Low"}
              </button>
              {task.dueDate && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right section: Edit / Save / Delete */}
        <div className="flex items-center gap-2">
          {editing ? (
            <button
              onClick={handleSave}
              className="text-blue-500 hover:text-blue-700 transition"
              title="Save"
            >
              <Save size={20} />
            </button>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="text-yellow-500 hover:text-yellow-700 transition"
              title="Edit"
            >
              <Edit size={20} />
            </button>
          )}

          <button
            onClick={handleDelete}
            className="text-red-500 hover:text-red-700 transition"
            title="Delete"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
