import React, { ReactNode } from "react";
import { Footer } from "../components/navigation/Footer";
import { useNavigate } from "react-router-dom";
import instance from "../config/instance";
import { TopBar } from "../components/navigation/TopBar";
interface NavigationProps {
  children: ReactNode;
}

export const Navigation: React.FC<NavigationProps> = ({ children }) => {
  const navigate = useNavigate();

  const logout = async () => {
    await instance.post("/auth/logout");
    navigate("/login");
  };

  return (
    <>
      <nav className="py-4 border-b">
        <TopBar logout={logout} />
      </nav>

      <main>{children}</main>

      <footer className="py-4 border-t">
        <Footer />
      </footer>
    </>
  );
};
