import { Routes, Route } from "react-router-dom";

import AppLayout from "../components/AppLayout";

import DashboardPage from "../pages/Dashboard/DashboardPage";
import LabsPage from "../pages/Labs/LabsPage";
import PerformanceMonitorPage from "../pages/Labs/PerformanceMonitor/PerformanceMonitorPage";
import NetworkInspectorPage from "../pages/Labs/NetworkInspector/NetworkInspectorPage";
import BundleAnalyzerPage from "../pages/Labs/BundleAnalyzer/BundleAnalyzerPage";
import SettingsPage from "../pages/Settings/SettingsPage";

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="labs" element={<LabsPage />} />
        <Route path="performance" element={<PerformanceMonitorPage />} />
        <Route path="network" element={<NetworkInspectorPage />} />
        <Route path="bundle" element={<BundleAnalyzerPage />} />

        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
}
