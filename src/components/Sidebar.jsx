import { NavLink } from "react-router-dom";
import { Home, GitBranch } from "lucide-react";

const navItems = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/", icon: GitBranch, label: "Workflows" },
];

export default function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
            <GitBranch size={18} className="text-white" />
          </div>
          <span className="font-bold text-gray-800">Telematrix Systems</span>
        </div>
      </div>

      <nav className="flex-1 p-3">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${
                isActive
                  ? "bg-emerald-50 text-emerald-700"
                  : "text-gray-600 hover:bg-gray-50"
              }`
            }
          >
            <item.icon size={18} />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
