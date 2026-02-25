import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  GraduationCap,
  ClipboardCheck,
  BookOpen,
  Briefcase,
  Users,
  Settings,
  Bell,
  LogOut,
  ChevronLeft,
  BarChart3,
  UserCircle,
  FileText,
  Mic,
} from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

interface SidebarProps {
  role: "student" | "teacher" | "parent" | "admin";
  onLogout: () => void;
}

const roleMenus = {
  student: [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: BookOpen, label: "Courses", path: "/courses" },
    { icon: ClipboardCheck, label: "Quizzes", path: "/quizzes" },
    { icon: BarChart3, label: "Analytics", path: "/analytics" },
    { icon: Briefcase, label: "Jobs", path: "/jobs" },
    { icon: UserCircle, label: "Profile", path: "/profile" },
    { icon: Mic, label: "Voice Assistant", path: "/voice" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ],
  teacher: [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: Users, label: "Students", path: "/students" },
    { icon: ClipboardCheck, label: "Quizzes", path: "/quizzes" },
    { icon: BookOpen, label: "Content", path: "/content" },
    { icon: BarChart3, label: "Analytics", path: "/analytics" },
    { icon: Mic, label: "Voice Assistant", path: "/voice" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ],
  parent: [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: Users, label: "Children", path: "/children" },
    { icon: BarChart3, label: "Performance", path: "/performance" },
    { icon: Bell, label: "Alerts", path: "/alerts" },
    { icon: FileText, label: "Reports", path: "/reports" },
    { icon: Mic, label: "Voice Assistant", path: "/voice" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ],
  admin: [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: Users, label: "Users", path: "/users" },
    { icon: GraduationCap, label: "Courses", path: "/courses" },
    { icon: Briefcase, label: "Jobs", path: "/jobs" },
    { icon: BarChart3, label: "Analytics", path: "/analytics" },
    { icon: Mic, label: "Voice Assistant", path: "/voice" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ],
};

const roleLabels = {
  student: "Student Portal",
  teacher: "Teacher Portal",
  parent: "Parent Portal",
  admin: "Admin Portal",
};

export function Sidebar({ role, onLogout }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const menu = roleMenus[role];

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className={cn(
        "fixed left-0 top-0 h-screen bg-sidebar border-r border-sidebar-border flex flex-col z-50 transition-all duration-300",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="font-bold text-foreground">EduFlow</h1>
                <p className="text-xs text-muted-foreground">{roleLabels[role]}</p>
              </div>
            </motion.div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-lg hover:bg-sidebar-accent transition-colors"
          >
            <ChevronLeft
              className={cn(
                "w-5 h-5 text-muted-foreground transition-transform",
                collapsed && "rotate-180"
              )}
            />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto scrollbar-thin">
        {menu.map((item, index) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn("sidebar-item", isActive && "active")}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  {item.label}
                </motion.span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-sidebar-border">
        <button
          onClick={onLogout}
          className="sidebar-item w-full text-destructive hover:bg-destructive/10"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </motion.aside>
  );
}
