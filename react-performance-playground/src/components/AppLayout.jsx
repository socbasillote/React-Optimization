import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Header from "./Header";

import PerformanceOverlay from "../components/monitor/PerformanceOverlay";
import PerformanceMonitor from "./monitor/PerformanceMonitor";

function AppLayout() {
  return (
    <div className="app">
      <PerformanceMonitor />
      <Sidebar />

      <div className="content">
        <Header />

        <main className="page">
          <Outlet />
        </main>

        <PerformanceOverlay />
      </div>
    </div>
  );
}

export default AppLayout;
