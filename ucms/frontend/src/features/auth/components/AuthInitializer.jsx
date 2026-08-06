import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";

import { useRefreshMutation } from "../api/authApi";

import { clearAccessToken, setAccessToken, setInitialized } from "../authSlice";

export default function AuthInitializer({ children }) {
  const dispatch = useDispatch();
  const initializedRef = useRef(false);

  const [refresh] = useRefreshMutation();

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const initialize = async () => {
      try {
        const result = await refresh().unwrap();

        dispatch(setAccessToken(result.data.accessToken));
      } catch {
        dispatch(clearAccessToken());
      } finally {
        dispatch(setInitialized(true));
      }
    };

    initialize();
  }, []);

  return children;
}
