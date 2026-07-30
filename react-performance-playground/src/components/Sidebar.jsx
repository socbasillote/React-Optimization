import { NavLink } from "react-router-dom";
import navigation from "../app/navigation";

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
