import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { useLoginMutation } from "../api";
import { setAccessToken } from "../authSlice";

import { getErrorMessage } from "@/utils/getErrorMessage";

export function useLogin() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loginMutation, { isLoading }] = useLoginMutation();

  const login = async (values) => {
    try {
      const result = await loginMutation(values).unwrap();

      // Save the access token
      dispatch(setAccessToken(result.data.accessToken));

      toast.success("Welcome back!");

      navigate("/app/dashboard", {
        replace: true,
      });
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return {
    login,
    isLoading,
  };
}
