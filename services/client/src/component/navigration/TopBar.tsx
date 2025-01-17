import React from "react";
import { LinkItem } from "./LinkItem";
import { useUser } from "../../hooks/useUsers";
import { useNavigate, useLocation } from "react-router-dom";
import { StatusActions } from "../../features/userSlice";

interface TopBarProps {
  logout: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ logout }) => {
  const { status } = useUser();
  const isAuthenticated = status === StatusActions.succeeded;
  const navigate = useNavigate();
  const location = useLocation();
  const isCreateBlogPage = location.pathname === "/create-blog";

  return (
    <div className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-2 flex justify-between items-center">
        {/* Logo Section */}
        <div className="flex items-center">
          <img
            src="src/assets/logo.png"
            alt="logo"
            className="w-12 h-12 transition-transform duration-300 hover:scale-125"
          />
        </div>

        {/* Search Bar */}
        <div className="flex-1 mx-8">
          <input
            type="text"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Search..."
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              {!isCreateBlogPage && (
                <button
                  onClick={() => navigate("/create-blog")}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-lg transition-all"
                >
                  Create Post
                </button>
              )}
              <button
                onClick={logout}
                className="text-red-500 hover:text-red-600 font-medium px-4 py-2 transition-all"
              >
                Logout
              </button>
            </>
          ) : (
            <LinkItem
              href="/login"
              text="Login"
            />
          )}
        </div>
      </div>
    </div>
  );
};
