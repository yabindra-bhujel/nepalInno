import { useUser } from "../hooks/useUsers";
import { StatusActions } from "../features/userSlice";
import { useNavigate } from "react-router-dom";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const navigate = useNavigate();
    const { status } = useUser();
    const isAuthenticated = status === StatusActions.succeeded;
    return isAuthenticated ? <>{children}</> :
    (navigate("/login"), null);
};