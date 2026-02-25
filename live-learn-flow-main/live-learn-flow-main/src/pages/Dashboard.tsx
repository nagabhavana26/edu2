import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StudentDashboard } from "@/components/dashboards/StudentDashboard";
import { TeacherDashboard } from "@/components/dashboards/TeacherDashboard";
import { ParentDashboard } from "@/components/dashboards/ParentDashboard";
import { AdminDashboard } from "@/components/dashboards/AdminDashboard";
import { User } from "@supabase/supabase-js";
import { VoiceAssistant } from "@/components/VoiceAssistant";

// Lazy load sub-pages
import Courses from "@/pages/Courses";
import Quizzes from "@/pages/Quizzes";
import Analytics from "@/pages/Analytics";
import Jobs from "@/pages/Jobs";
import Profile from "@/pages/Profile";
import Students from "@/pages/Students";
import Content from "@/pages/Content";
import SettingsPage from "@/pages/SettingsPage";
import Children from "@/pages/Children";
import Performance from "@/pages/Performance";
import Alerts from "@/pages/Alerts";
import Reports from "@/pages/Reports";
import UsersManagement from "@/pages/UsersManagement";

type Role = "student" | "teacher" | "parent" | "admin";

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role>("student");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        if (session?.user?.user_metadata?.role) {
          setRole(session.user.user_metadata.role as Role);
        }
        setLoading(false);
        
        if (!session?.user) {
          navigate("/auth");
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user?.user_metadata?.role) {
        setRole(session.user.user_metadata.role as Role);
      }
      setLoading(false);
      
      if (!session?.user) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const userName = user.user_metadata?.name || user.email?.split("@")[0] || "User";

  const renderContent = () => {
    const path = location.pathname;

    switch (path) {
      case "/courses":
        return <Courses />;
      case "/quizzes":
        return <Quizzes />;
      case "/analytics":
        return <Analytics />;
      case "/jobs":
        return <Jobs />;
      case "/profile":
        return <Profile />;
      case "/students":
        return <Students />;
      case "/content":
        return <Content />;
      case "/settings":
        return <SettingsPage />;
      case "/children":
        return <Children />;
      case "/performance":
        return <Performance />;
      case "/alerts":
        return <Alerts />;
      case "/reports":
        return <Reports />;
      case "/users":
        return <UsersManagement />;
      case "/voice":
        return <VoiceAssistant />;
      default: {
        switch (role) {
          case "student": return <StudentDashboard />;
          case "teacher": return <TeacherDashboard />;
          case "parent": return <ParentDashboard />;
          case "admin": return <AdminDashboard />;
          default: return <StudentDashboard />;
        }
      }
    }
  };

  return (
    <DashboardLayout role={role} userName={userName} onLogout={handleLogout}>
      {renderContent()}
    </DashboardLayout>
  );
}
