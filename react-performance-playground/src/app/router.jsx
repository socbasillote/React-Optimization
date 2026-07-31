import { Routes, Route } from "react-router-dom";

import AppLayout from "../components/AppLayout";

import DashboardPage from "../pages/Dashboard/DashboardPage";
//import LabsPage from "../pages/Labs/LabsPage";
import PerformanceMonitorPage from "../pages/Labs/PerformanceMonitor/PerformanceMonitorPage";
import NetworkInspectorPage from "../pages/Labs/NetworkInspector/NetworkInspectorPage";
import BundleAnalyzerPage from "../pages/Labs/BundleAnalyzer/BundleAnalyzerPage";
import SettingsPage from "../pages/Settings/SettingsPage";
//import RenderingFundamentalsLabMemo from "../labs/react-memo";
//import RenderingFundamentalsLabReferential from "../labs/referential-equality";
//import UseMemoLabs from "../labs/use-memo";
//import FunctionIdentityLabs from "../labs/function-identity";
//import UseCallbackLabs from "../labs/useCallback";
//import NotToMeMoize from "../labs/NotToMemoize";
import DeriveState from "../labs/derived_state";
//import RenderingFundamentalsLab from "../labs/rendering-fundamentals";

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="labs" element={<DeriveState />} />
        <Route path="performance" element={<PerformanceMonitorPage />} />
        <Route path="network" element={<NetworkInspectorPage />} />
        <Route path="bundle" element={<BundleAnalyzerPage />} />

        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
}
