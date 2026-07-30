import { Routes, Route } from "react-router-dom";

import AppLayout from "./components/AppLayout";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import SettingsPage from "./pages/Settings/SettingsPage";
import LabsPage from "./pages/Labs/LabsPage";
import NetworkInspectorPage from "./pages/Labs/NetworkInspector/NetworkInspectorPage";
import BundleAnalyzerPage from "./pages/Labs/BundleAnalyzer/BundleAnalyzerPage";

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="labs" element={<LabsPage />} />
        <Route path="performance" element={<NetworkInspectorPage />} />
        <Route path="network" element={<NetworkInspectorPage />} />
        <Route path="bundle" element={<BundleAnalyzerPage />} />

        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
}
