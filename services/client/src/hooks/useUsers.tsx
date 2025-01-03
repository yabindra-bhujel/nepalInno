import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchMe, currentUser } from "../features/userSlice";
import { AppDispatch, RootState } from "../store/store";

export const useUser = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector(currentUser);
  const status = useSelector((state: RootState) => state.user.status);
  const error = useSelector((state: RootState) => state.user.error);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchMe());
    }
  }, [status, dispatch]);

  return { user, status, error };
};
