import React, { useContext, useState } from "react";
import { useNavigate } from "react-router";
import { Calendar } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { AppContext } from "../context/AppContext.jsx";
import Loading from "../components/Loading.jsx";

const TaskForm = () => {
  const navigate = useNavigate();
  const { createTask } = useContext(AppContext);

  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "Pending",
    priority: "Low",
    dueDate: null,
  });

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      alert("Title is required");
      return;
    }

    setSubmitting(true);
    try {
      await createTask({
        ...form,
        dueDate: form.dueDate ? form.dueDate.toISOString().split("T")[0] : "",
      });
      navigate("/");
    } catch (err) {
      console.error("Failed to create task", err.message);
      alert("Failed to create task. Please try again.");
    }
    setSubmitting(false);
  };

  return (
    <div className="flex justify-center items-start min-h-screen bg-light-primary-dull dark:bg-dark-primary-dull transition-colors duration-300 px-4 py-10">
      <div className="w-full max-w-md p-6 rounded-2xl transition-colors duration-300">
        <h2 className="text-2xl font-bold mb-6 text-center text-[#4B0082] dark:text-[#A694F7]">
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
            className="w-full p-2 rounded-md bg-light-primary dark:bg-dark-primary text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-[#A694F7]"
            required
          />

          {/* Description */}
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Task Description"
            className="w-full p-2 rounded-md bg-light-primary dark:bg-dark-primary text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-[#A694F7]"
            rows={4}
          />

          {/* Status */}
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full p-2 rounded-md bg-light-primary dark:bg-dark-primary text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-[#A694F7]"
          >
            <option>Pending</option>
            <option>In Progress</option>
          </select>

          {/* Priority */}
          <select
            name="priority"
            value={form.priority}
            onChange={handleChange}
            className="w-full p-2 rounded-md bg-light-primary dark:bg-dark-primary text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-[#A694F7]"
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>

          {/* Due Date with Calendar Icon */}
          <div className="relative w-full">
            <Calendar
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 pointer-events-none"
            />
            <div className="w-full">
              <DatePicker
                selected={form.dueDate}
                onChange={(date) =>
                  setForm((prev) => ({ ...prev, dueDate: date }))
                }
                placeholderText="Select due date"
                dateFormat="dd-MM-yyyy"
                className="w-full p-2 pl-10 rounded-md bg-light-primary dark:bg-dark-primary text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-[#A694F7]"
                popperClassName="react-datepicker-popper"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full dark:bg-[#A694F7] bg-[#4B0082] hover:bg-[#C1A6D1] text-dark-text dark:text-light-text p-2 rounded-md transition mt-2 flex items-center justify-center gap-2"
          >
            {submitting ? (
              <Loading size={12} color="text-white" />
            ) : (
              "Create Task"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
