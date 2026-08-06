import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";

import { useRefreshMutation } from "../api/authApi";

import { clearAccessToken, setAccessToken, setInitialized } from "../authSlice";

import FullScreenLoader from "@/components/common/FullScreenLoader";
export default function AuthInitializer({ children }) {
  const dispatch = useDispatch();

  const initializedRef = useRef(false);
  const [ready, setReady] = useState(false);

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
        setReady(true);
      }
    };

    initialize();
  }, [dispatch, refresh]);

  if (!ready) {
    return <FullScreenLoader />;
  }

  return children;
}
