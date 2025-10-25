import React, { useContext } from "react";
import { CheckCircle, Clock, ListTodo, Loader, Activity, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";
import { AppContext } from "../context/AppContext.jsx";
import ProgressBar from "../components/ProgressBar.jsx";
import StatsCard from "../components/StatsCard.jsx";
import Loading from "../components/Loading.jsx";

const Profile = () => {
  const { user, stats, loading } = useContext(AppContext);
  const { total, completed, pending, inProgress } = stats();
  const navigate = useNavigate();

  if (loading) return <Loading size={12} color="text-blue-500" />

  return (
    <div className="min-h-screen flex justify-center items-center bg-light-primary-dull dark:bg-dark-primary-dull transition-colors duration-300 px-4 py-6">
      <div className="w-full max-w-2xl sm:max-w-3xl lg:max-w-4xl bg-light-bg-form dark:bg-dark-bg-form shadow-lg rounded-2xl p-6 sm:p-8">
        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 mb-6 text-blue-600 dark:text-blue-400 hover:underline"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="hidden md:inline">Back to Dashboard</span>
        </button>

        <h1 className="text-3xl font-bold text-center text-light-text-dull dark:text-dark-text mb-8 sm:text-4xl">
          Profile
        </h1>

        {/* User Info */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 mb-8">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-blue-500 flex items-center justify-center text-white text-3xl sm:text-4xl font-bold shadow-md">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-xl sm:text-2xl font-semibold text-light-text-dull dark:text-dark-text">
              {user?.name || "Unknown User"}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base break-words">
              {user?.email}
            </p>
          </div>
        </div>

        {/* Stats Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <StatsCard
            icon={ListTodo}
            label="Total Tasks"
            value={total}
            color="text-blue-500"
          />
          <StatsCard
            icon={CheckCircle}
            label="Completed"
            value={completed}
            color="text-green-500"
          />
          <StatsCard
            icon={Clock}
            label="Pending"
            value={pending}
            color="text-yellow-500"
          />
          <StatsCard
            icon={Activity}
            label="In Progress"
            value={inProgress}
            color="text-orange-500"
          />
        </div>

        {/* Progress Overview */}
        <div className="mt-8 sm:mt-10">
          <h3 className="text-lg sm:text-xl font-semibold mb-2 text-light-text-dull dark:text-dark-text">
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
