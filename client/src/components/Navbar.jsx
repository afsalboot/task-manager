import React, { useContext } from "react";
import { AppContext } from "../context/AppContext.jsx";
import { Link } from "react-router";
import { LogOut, Moon, Sun, User } from "lucide-react";

const Navbar = () => {
  const { user, logout, dark, setDark, hideSignupButton } = useContext(AppContext);

  return (
    <nav className="w-full flex items-center justify-between px-6 md:px-16 lg:px-36 py-5 bg-light-primary dark:bg-dark-primary dark:backdrop-blur-md transition-colors duration-300">
      {/* Logo */}
      <div className="flex items-center gap-4">
        <Link
          to="/"
          className="text-xl font-bold text-light-title dark:text-dark-title transition-colors duration-300"
        >
          Task Manager
        </Link>
      </div>

      {/* Right Side Controls */}
      <div className="flex items-center gap-4">
        {/* Theme toggle */}
        <button
          onClick={() => setDark(!dark)}
          className="p-2 rounded text-light-text-dull dark:text-dark-text transition-colors duration-300"
          aria-label="Toggle dark mode"
        >
          {dark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {user ? (
          <>
            {/* Profile button */}
            <Link
              to="/profile"
              className="flex items-center gap-2 px-3 py-1 rounded text-light-text dark:text-dark-text bg-light-button dark:bg-dark-button hover:bg-light-hover dark:hover:bg-dark-hover transition-colors duration-300 cursor-pointer"
            >
              <User size={18} />
              {/* Hide name/email on small screens */}
              <span className="hidden md:inline">
                {user.name || user.email}
              </span>
            </Link>

            {/* Logout button */}
            <button
              onClick={logout}
              className="px-3 py-1 rounded bg-red-500 hover:bg-red-400 
              dark:bg-red-600 dark:hover:bg-red-700 flex items-center gap-2 transition-colors duration-300 cursor-pointer"
            >
              <LogOut size={18} />
              {/* Hide label on mobile */}
              <span className="hidden md:inline">Logout</span>
            </button>
          </>
        ) : (
          !hideSignupButton && (
            <Link
              to="/login"
              className="px-3 py-1 rounded text-light-text dark:text-dark-text dark:bg-dark-button bg-light-button hover:bg-light-hover dark:hover:bg-dark-hover transition-colors duration-300"
            >
              Start Organizing
            </Link>
          )
        )}
      </div>
    </nav>
  );
};

export default Navbar;
