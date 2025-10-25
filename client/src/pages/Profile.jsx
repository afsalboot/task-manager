import React, { useContext } from "react";
import { CheckCircle, Clock, ListTodo, Loader, Activity, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";
import { AppContext } from "../context/AppContext.jsx";
import ProgressBar from "../components/ProgressBar.jsx";

const Profile = () => {
  const { user, stats, loading } = useContext(AppContext);
  const { total, completed, pending, inProgress } = stats();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-light-primary-dull dark:bg-dark-primary-dull transition-colors duration-300">
        <Loader className="animate-spin w-10 h-10 text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-light-primary-dull dark:bg-dark-primary-dull transition-colors duration-300 px-4">
      <div className="w-full max-w-2xl bg-light-bg-form dark:bg-dark-bg-form shadow-lg rounded-2xl p-8">
        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 mb-6 text-blue-600 dark:text-blue-400 hover:underline"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Dashboard</span>
        </button>

        <h1 className="text-3xl font-bold text-center text-light-text-dull dark:text-dark-text mb-8">
          Profile
        </h1>

        {/* User Info */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8">
          <div className="w-24 h-24 rounded-full bg-blue-500 flex items-center justify-center text-white text-3xl font-bold shadow-md">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-xl font-semibold text-light-text-dull dark:text-dark-text">
              {user?.name || "Unknown User"}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">{user?.email}</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="flex flex-col items-center justify-center p-4 bg-light-primary dark:bg-dark-button rounded-lg shadow-md">
            <ListTodo className="text-blue-500 w-8 h-8 mb-2" />
            <h3 className="font-semibold text-light-text-dull dark:text-dark-text">
              Total Tasks
            </h3>
            <p className="text-2xl font-bold text-blue-500">{total}</p>
          </div>

          <div className="flex flex-col items-center justify-center p-4 bg-light-primary dark:bg-dark-button rounded-lg shadow-md">
            <CheckCircle className="text-green-500 w-8 h-8 mb-2" />
            <h3 className="font-semibold text-light-text-dull dark:text-dark-text">
              Completed
            </h3>
            <p className="text-2xl font-bold text-green-500">{completed}</p>
          </div>

          <div className="flex flex-col items-center justify-center p-4 bg-light-primary dark:bg-dark-button rounded-lg shadow-md">
            <Clock className="text-yellow-500 w-8 h-8 mb-2" />
            <h3 className="font-semibold text-light-text-dull dark:text-dark-text">
              Pending
            </h3>
            <p className="text-2xl font-bold text-yellow-500">{pending}</p>
          </div>

          <div className="flex flex-col items-center justify-center p-4 bg-light-primary dark:bg-dark-button rounded-lg shadow-md">
            <Activity className="text-orange-500 w-8 h-8 mb-2" />
            <h3 className="font-semibold text-light-text-dull dark:text-dark-text">
              In Progress
            </h3>
            <p className="text-2xl font-bold text-orange-500">{inProgress}</p>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="mt-10">
          <h3 className="text-lg font-semibold mb-2 text-light-text-dull dark:text-dark-text">
            Task Completion Overview
          </h3>
          <ProgressBar
            completed={completed}
            inProgress={inProgress}
            pending={pending}
            total={total}
          />
        </div>
      </div>
    </div>
  );
};

export default Profile;
