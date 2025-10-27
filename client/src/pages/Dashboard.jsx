import React, { useContext, useEffect, useState } from "react";
import { ListTodo, PlusSquare } from "lucide-react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { AppContext } from "../context/AppContext.jsx";
import TaskFilter from "../components/TaskFilter.jsx";
import TaskList from "../components/TaskList.jsx";
import TaskEmptyState from "../components/TaskEmptyState.jsx";
import TaskChart from "../components/TaskChart.jsx";
import Loading from "../components/Loading.jsx";

const Dashboard = () => {
  const navigate = useNavigate();
  const { tasks, fetchTasks, reorderTask, stats, token, user, loading } =
    useContext(AppContext);

  const [filter, setFilter] = useState({
    status: "All",
    priority: "All",
    dueDate: "All",
  });

  useEffect(() => {
    if (token) fetchTasks();
  }, [token]);

  const handleAddTaskClick = () => {
    if (!user || !token) navigate("/login");
    else navigate("/add-task");
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;
    await reorderTask(result.source.index, result.destination.index);
    toast.success("Task order updated");
  };

  // ✅ Filter + Sort
  const filteredTasks = tasks
    .filter((t) => {
      if (filter.status !== "All" && t.status !== filter.status) return false;
      if (filter.priority !== "All" && t.priority !== filter.priority)
        return false;

      if (filter.dueDate !== "All") {
        if (!t.dueDate) return false;
        const taskDate = new Date(t.dueDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (
          filter.dueDate === "Today" &&
          taskDate.toDateString() !== today.toDateString()
        )
          return false;

        if (filter.dueDate === "This Week") {
          const start = new Date(today);
          start.setDate(today.getDate() - today.getDay());
          const end = new Date(start);
          end.setDate(start.getDate() + 6);
          if (taskDate < start || taskDate > end) return false;
        }

        if (filter.dueDate === "This Month") {
          if (
            taskDate.getMonth() !== today.getMonth() ||
            taskDate.getFullYear() !== today.getFullYear()
          )
            return false;
        }

        if (filter.dueDate === "Next Month") {
          const nextMonth = new Date(today);
          nextMonth.setMonth(today.getMonth() + 1);
          if (
            taskDate.getMonth() !== nextMonth.getMonth() ||
            taskDate.getFullYear() !== nextMonth.getFullYear()
          )
            return false;
        }

        if (filter.dueDate === "Overdue" && taskDate >= today) return false;
      }

      return true;
    })
    // ✅ Completed tasks at bottom
    .sort((a, b) => {
      const order = { Pending: 1, "In Progress": 2, Completed: 3 };
      return order[a.status] - order[b.status];
    });

  const { completed, inProgress, pending } = stats();

  return (
    <div className="min-h-screen px-4 md:px-16 lg:px-36 py-5 bg-light-primary-dull dark:bg-dark-primary-dull">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2 text-[#4B0082] dark:text-[#A694F7]">
            <ListTodo />
            My Tasks
          </h1>
          {user && token && tasks.length > 0 && (
            <button
              onClick={handleAddTaskClick}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#4B0082] dark:bg-[#A694F7] text-dark-text dark:text-light-text hover:bg-[#C1A6D1] transition"
            >
              <PlusSquare size={18} />
              <span className="hidden md:inline">Add Task</span>
            </button>
          )}
        </div>

        {/* Filter */}
        {user && token && tasks.length > 0 && (
          <TaskFilter filter={filter} setFilter={setFilter} />
        )}

        {/* Content */}
        {!user || !token ? (
          <TaskEmptyState type="welcome" onAdd={handleAddTaskClick} />
        ) : loading ? (
          <div className="flex justify-center items-center py-20">
            <Loading size={28} />
          </div>
        ) : tasks.length === 0 ? (
          <TaskEmptyState type="empty" onAdd={handleAddTaskClick} />
        ) : filteredTasks.length > 0 ? (
          <TaskList tasks={filteredTasks} onDragEnd={handleDragEnd} />
        ) : (
          <TaskEmptyState type="filtered" />
        )}

        {/* Chart */}
        {user && token && tasks.length > 0 && (
          <TaskChart
            completed={completed}
            inProgress={inProgress}
            pending={pending}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
