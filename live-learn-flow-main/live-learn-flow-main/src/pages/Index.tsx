import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { GraduationCap, ArrowRight, BookOpen, Target, Briefcase, Users, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  { icon: BookOpen, title: "Smart Courses", description: "Personalized learning paths that adapt to your progress" },
  { icon: Target, title: "Real-Time Quizzes", description: "Time-controlled assessments with instant feedback" },
  { icon: Briefcase, title: "Job Matching", description: "Opportunities based on your skills and eligibility" },
  { icon: Users, title: "Parent Alerts", description: "Automatic notifications on student performance" },
];

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-primary" />
            </div>
            <span className="text-xl font-bold text-foreground">EduFlow</span>
          </div>
          <Link to="/auth">
            <Button>Get Started <ArrowRight className="w-4 h-4 ml-2" /></Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              Real-Time EdTech Platform
            </span>
            <h1 className="text-5xl md:text-7xl font-bold text-foreground mt-6 mb-6 leading-tight">
              Learn, Assess & <br />
              <span className="gradient-text">Grow Together</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              A dynamic platform where learning adapts to you, assessments react in real-time, 
              and opportunities appear based on your progress.
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/auth">
                <Button size="lg">Start Learning <ArrowRight className="w-5 h-5 ml-2" /></Button>
              </Link>
              <Link to="/dashboard">
                <Button size="lg" variant="secondary">Watch Demo</Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="glass-card-hover p-6"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Roles */}
      <section className="py-20 px-6 bg-secondary/30">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-foreground mb-12">Built for Everyone</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {["Students", "Teachers", "Parents", "Admins"].map((role, i) => (
              <motion.div
                key={role}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="p-6 glass-card text-center"
              >
                <CheckCircle className="w-8 h-8 text-success mx-auto mb-3" />
                <span className="font-semibold text-foreground">{role}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>© 2024 EduFlow. Real-time education platform.</p>
        </div>
      </footer>
    </div>
  );
}
