import { createContext, useEffect, useState } from "react";
import { API } from "../api";
import toast from "react-hot-toast";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const s = localStorage.getItem("user");
    return s ? JSON.parse(s) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dark, setDark] = useState(() => {
    const stored = localStorage.getItem("dark");
    if (stored !== null) return stored === "true";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });
  const [hideSignupButton, setHideSignupButton] = useState(false);

  useEffect(() => {
    if (dark) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
    localStorage.setItem("dark", dark);
  }, [dark]);

  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [token]);

  const login = async (credentials) => {
    try {
      const { data } = await API.post("/auth/login", credentials);
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      toast.success("Logged in successfully");
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || "Login Failed");
      return false;
    }
  };

  const signup = async (payload) => {
    try {
      const { data } = await API.post("/auth/signup", payload);
      toast.success("Account created. Please login.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed");
      return flase;
    }
  };

  const logout = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    toast.success("Logged out");
    navigate("/login");
  };

  //Tasks

  //fetch task
  const fetchTasks = async (filters = {}) => {
  setLoading(true); // show loading

  try {
    // create query string if filters exist
    const query = Object.keys(filters).length
      ? "?" + new URLSearchParams(filters).toString()
      : "";

    // fetch tasks from API
    const response = await API.get(`/task/get-tasks${query}`);

    // ensure tasks is always an array
    setTasks(Array.isArray(response.data.tasks) ? response.data.tasks : []);

    setLoading(false);
    return response.data;
  } catch (error) {
    setLoading(false);
    toast.error("Failed to load tasks");
    return [];
  }
};


  //   create task
  const createTask = async (payload) => {
    try {
      const { data } = await API.post("/task/create-task", payload);
      setTasks((p) => [data, ...p]);
      toast.success("Task created");
      return data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Created failed");
      throw err;
    }
  };

  //   update task
  const updateTask = async (id, payload) => {
    try {
      const { data } = await API.put(`/task/update-task/${id}`, payload);
      setTasks((p) => p.map((t) => (t._id === id ? data : t)));
      toast.success("Task updated");
      return data;
    } catch (err) {
      toast.error("Update failed");
      throw err;
    }
  };

  //   delete task
  const deleteTask = async (id) => {
    try {
      await API.delete(`/task/delete-task/${id}`);
      setTasks((p) => p.filter((t) => t._id !== id));
      toast.success("Task deleted");
    } catch (err) {
      toast.error("Task deleted failed");
    }
  };

  //Reorder after drag and drop (persisting order to backend optional)
  const reorderTask = async (sourceIdx, destIdx) => {
    const items = Array.from(tasks);
    const [moved] = items.splice(sourceIdx, 1);
    items.splice(destIdx, 0, moved);
    setTasks(items);

    //Optionally send order to backend (add order field in task schema)
    try {
      await API.post("/task/task-reorder", { order: items.map((t) => t._id) });
    } catch (err) {}
  };

  // task stats
  const stats = () => {
    const total = tasks.length;
    const completed = tasks.filter((c) => c.status === "Completed").length;
    const pending = tasks.filter((p) => p.status === "Pending").length;
    const inProgress = tasks.filter((i) => i.status === "In Progress").length;
    return { total, completed, pending, inProgress };
  };

  const value = {
    user,
    token,
    tasks,
    loading,
    dark,
    setDark,
    login,
    signup,
    logout,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    reorderTask,
    stats,
    hideSignupButton,
    setHideSignupButton,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
