import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { useLogoutMutation } from "../api";
import { clearAccessToken } from "../authSlice";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { useDispatch } from "react-redux";
import { apiSlice } from "@/services/api/apiSlice";

export function useLogout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [logoutMutation, { isLoading }] = useLogoutMutation();

  const logout = async () => {
    try {
      await logoutMutation().unwrap();
      dispatch(clearAccessToken());
      dispatch(apiSlice.util.resetApiState());
      toast.success("Signed out successfully.");

      navigate("/login", {
        replace: true,
      });
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return {
    logout,
    isLoading,
  };
}
