import { NavLink } from "react-router-dom";

const navigation = [
  { label: "Dashboard", path: "/" },
  { label: "Optimization Labs", path: "/labs" },
  { label: "Performance Monitor", path: "/performance" },
  { label: "Network Inspector", path: "/network" },
  { label: "Bundle Analyzer", path: "/bundle" },
  { label: "Settings", path: "/settings" },
];

function Sidebar() {
  return (
    <aside className="sidebar">
      <h2>React Performance Playground</h2>

      <nav>
        {navigation.map((item) => (
          <NavLink key={item.path} to={item.path}>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
