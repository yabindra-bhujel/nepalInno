import React, { ReactNode } from "react";
import { LinkItem } from "../component/navigration/LinkItem";
import { Footer } from "../component/navigration/Footer";
import { useUser } from "../hooks/useUsers";
import { useNavigate } from "react-router-dom";
import { StatusActions } from "../features/userSlice";
import instance from "../config/instance";

interface NavigationProps {
  children: ReactNode;
}

export const Navigation: React.FC<NavigationProps> = ({ children }) => {
  const { status } = useUser();
  const isAuthenticated = status === StatusActions.succeeded;
  const navigate = useNavigate();

  if (status === StatusActions.failed) {
    navigate("/login");
    return null;
  }


  const logout = async () => {
     await instance.post("/user/logout");
      navigate("/login");
  }

  return (
    <>
      <nav className="py-4 border-b">
        <div className="mx-auto px-4">
          <div className="flex justify-between items-center">
            <div>
              <ul className="flex space-x-6">
                <LinkItem href="/" text="Home" />
                <LinkItem href="/" text="About" />
              </ul>
            </div>

            <div></div>

            <div className="flex space-x-4">
              {isAuthenticated ? (
                <>
                  <button
                    onClick={() => {
                      navigate("/create-post");
                    }}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md"
                  >
                    Create Post
                  </button>
                  <button
                    onClick={logout}
                    className="text-red-500"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <LinkItem href="/login" text="Login" />
              )}
            </div>
          </div>
        </div>
      </nav>

      <main>{children}</main>

      <footer className="py-4 border-t">
        <Footer />
      </footer>
    </>
  );
};
