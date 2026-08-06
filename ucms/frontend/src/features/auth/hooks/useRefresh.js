import { useDispatch } from "react-redux";

import { useRefreshMutation } from "../api/authApi";
import { setAccessToken } from "../authSlice";

export default function useRefresh() {
  const dispatch = useDispatch();

  const [refreshMutation] = useRefreshMutation();

  const refresh = async () => {
    const result = await refreshMutation().unwrap();

    dispatch(setAccessToken(result.data.accessToken));

    return result.data.accessToken;
  };

  return { refresh };
}
