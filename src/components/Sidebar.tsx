import { NavLink } from "react-router-dom";
import { Home, GitBranch, type LucideIcon } from "lucide-react";
import ThemeToggle from "./ui/ThemeToggle";

interface NavItem {
  to: string;
  icon: LucideIcon;
  label: string;
}

const navItems: NavItem[] = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/", icon: GitBranch, label: "Workflows" },
];

export default function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-sidebar border-r border-sidebar-border flex flex-col">
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <GitBranch size={18} className="text-primary-foreground" />
          </div>
          <span className="font-bold text-sidebar-foreground">
            Telematrix Systems
          </span>
        </div>
      </div>

      <nav className="flex-1 p-3">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50"
              }`
            }
          >
            <item.icon size={18} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-sidebar-border">
        <ThemeToggle />
      </div>
    </aside>
  );
}
