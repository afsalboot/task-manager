import React from "react";
import { PlusSquare } from "lucide-react";

const TaskEmptyState = ({ type, onAdd }) => {
  const styles = "text-center py-20 text-[#4B0082] dark:text-[#A694F7]";
  if (type === "welcome")
    return (
      <div className={styles}>
        <p className="text-2xl font-semibold mb-3">
          “Welcome! Productivity starts with a single task.”
        </p>
        <p className="text-lg opacity-80">Log in or sign up to start organizing your day</p>
      </div>
    );

  if (type === "empty")
    return (
      <div className={styles}>
        <p className="text-2xl font-semibold mb-3">No tasks yet</p>
        <p className="text-lg opacity-80">Create your first task to get started!</p>
        <button
          onClick={onAdd}
          className="mt-5 px-5 py-2 rounded-lg bg-[#A694F7] text-light-text hover:bg-[#C1A6D1] transition"
        >
          <PlusSquare size={18} className="inline mr-2" />
          Add Task
        </button>
      </div>
    );

  if (type === "filtered")
    return (
      <div className={styles}>
        <p className="text-lg opacity-80">No tasks match your filters.</p>
      </div>
    );
};

export default TaskEmptyState;
