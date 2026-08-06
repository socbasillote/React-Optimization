import { RouterProvider } from "react-router-dom";

import router from "./router";
import { Toaster } from "sonner";
import AuthInitializer from "@/features/auth/components/AuthInitializer";

export default function App() {
  return (
    <>
      <AuthInitializer>
        <RouterProvider router={router} />
      </AuthInitializer>

      <Toaster />
    </>
  );
}
