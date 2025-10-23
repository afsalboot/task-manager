import React, { useContext, useState } from "react";
import { useNavigate } from "react-router";
import { AppContext } from "../context/AppContext";


const TaskForm = () => {
  const navigate = useNavigate();
  const { createTask } = useContext(AppContext);

  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "Pending",
    priority: "Low",
    dueDate: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim()) {
      alert("Title is requird");
      return;
    }

    try {
      await createTask(form);
      navigate("/");
    } catch (err) {
      console.error("Failed to create task", err.message);
    }
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-light-primary-dull dark:bg-dark-primary-dull transition-colors duration-300">
        <div className="max-w-md mx-auto mt-10 p-6  bg-light-primary-dull dark:bg-dark-primary-dull transition-colors duration-300">
      <h2 className="text-xl font-bold mb-4 text-light-text-dull dark:text-dark-text">
        Add New Task
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Title */}
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Task Title"
          className="p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-light-primary dark:bg-light-primary-dull text-light-text-dull dark:text-light-text-dull"
          required
        />

        {/* Description */}
        <textarea
          name="description"
          value={form.desc}
          onChange={handleChange}
          placeholder="Task Description"
          className="p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-light-primary dark:bg-light-primary-dull text-light-text-dull dark:text-light-text-dull"
        />

        {/* Status */}
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-light-primary dark:bg-light-primary-dull text-light-text-dull dark:text-light-text-dull"
        >
          <option>Pending</option>
          <option>In Progress</option>
          <option>Completed</option>
        </select>

        {/* Priority */}
        <select
          name="priority"
          value={form.priority}
          onChange={handleChange}
          className="p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-light-primary dark:bg-light-primary-dull text-light-text-dull dark:text-light-text-dull"
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>

        {/* Due Date */}
        <input
          type="date"
          name="dueDate"
          value={form.dueDate}
          onChange={handleChange}
          className="p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-light-primary dark:bg-light-primary-dull text-light-text-dull dark:text-light-text-dull"
        />

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md transition"
        >
          Create Task
        </button>
      </form>
    </div>
    </div>
  );
};

export default TaskForm;
