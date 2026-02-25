import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, Mail, Lock, User, Eye, EyeOff, ArrowRight, Users, UserCircle, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const authSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
});

type Role = "student" | "teacher" | "parent" | "admin";

const roles: { id: Role; label: string; icon: typeof User; description: string }[] = [
  { id: "student", label: "Student", icon: GraduationCap, description: "Access courses, quizzes & jobs" },
  { id: "teacher", label: "Teacher", icon: UserCircle, description: "Manage content & students" },
  { id: "parent", label: "Parent", icon: Users, description: "Monitor child's progress" },
  { id: "admin", label: "Admin", icon: Shield, description: "Full system access" },
];

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [selectedRole, setSelectedRole] = useState<Role>("student");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const navigate = useNavigate();
  const { toast } = useToast();

  const validateForm = () => {
    try {
      authSchema.parse({
        email,
        password,
        name: isLogin ? undefined : name,
      });
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) throw error;
        
        toast({
          title: "Welcome back!",
          description: "You have successfully logged in.",
        });
        navigate("/dashboard");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              name,
              role: selectedRole,
            },
          },
        });
        
        if (error) throw error;
        
        toast({
          title: "Account created!",
          description: "Welcome to EduFlow. You can now log in.",
        });
        navigate("/dashboard");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Animation variants for multi-directional entrance
  const slideFromLeft = {
    initial: { opacity: 0, x: -100 },
    animate: { opacity: 1, x: 0 },
  };

  const slideFromRight = {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0 },
  };

  const slideFromTop = {
    initial: { opacity: 0, y: -80 },
    animate: { opacity: 1, y: 0 },
  };

  const slideFromBottom = {
    initial: { opacity: 0, y: 80 },
    animate: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-background flex relative overflow-hidden">
      {/* Animated floating cube in center background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <motion.div
          className="relative w-32 h-32 lg:w-48 lg:h-48"
          animate={{
            rotateX: [0, 360],
            rotateY: [0, 360],
            rotateZ: [0, 180],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{ transformStyle: "preserve-3d", perspective: 1000 }}
        >
          {/* Cube faces */}
          {[
            { transform: "translateZ(60px)", bg: "from-primary/20 to-primary/5" },
            { transform: "translateZ(-60px) rotateY(180deg)", bg: "from-info/20 to-info/5" },
            { transform: "rotateY(90deg) translateZ(60px)", bg: "from-success/20 to-success/5" },
            { transform: "rotateY(-90deg) translateZ(60px)", bg: "from-warning/20 to-warning/5" },
            { transform: "rotateX(90deg) translateZ(60px)", bg: "from-primary/15 to-info/10" },
            { transform: "rotateX(-90deg) translateZ(60px)", bg: "from-success/15 to-warning/10" },
          ].map((face, i) => (
            <motion.div
              key={i}
              className={`absolute w-full h-full rounded-2xl bg-gradient-to-br ${face.bg} border border-white/10 backdrop-blur-sm`}
              style={{ transform: face.transform, backfaceVisibility: "hidden" }}
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
            />
          ))}
        </motion.div>

        {/* Floating particles around cube */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-primary/40"
            animate={{
              x: [0, Math.sin(i * 60) * 150, 0],
              y: [0, Math.cos(i * 60) * 150, 0],
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 8 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.3,
            }}
          />
        ))}
      </div>

      {/* Left Panel - Branding (slides from LEFT) */}
      <motion.div
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden"
        variants={slideFromLeft}
        initial="initial"
        animate="animate"
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-info/10" />
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, hsl(var(--primary) / 0.1) 0%, transparent 50%),
                           radial-gradient(circle at 80% 20%, hsl(var(--info) / 0.1) 0%, transparent 40%),
                           radial-gradient(circle at 40% 80%, hsl(var(--success) / 0.05) 0%, transparent 40%)`,
        }} />
        
        <div className="relative z-10 flex flex-col justify-center p-12">
          {/* Logo slides from TOP */}
          <motion.div
            variants={slideFromTop}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex items-center gap-3 mb-8"
          >
            <motion.div 
              className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center"
              whileHover={{ scale: 1.1, rotate: 10 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <GraduationCap className="w-8 h-8 text-primary" />
            </motion.div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">EduFlow</h1>
              <p className="text-muted-foreground">Real-Time EdTech Platform</p>
            </div>
          </motion.div>

          {/* Heading slides from LEFT */}
          <motion.div
            variants={slideFromLeft}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.7, delay: 0.5 }}
          >
            <h2 className="text-4xl font-bold text-foreground mb-4 leading-tight">
              Learn, Assess & <br />
              <span className="gradient-text">Grow Together</span>
            </h2>
            
            <p className="text-lg text-muted-foreground max-w-md">
              A dynamic platform where learning adapts to you, assessments react in real-time, 
              and opportunities appear based on your progress.
            </p>
          </motion.div>

          {/* Stats slide from BOTTOM with stagger */}
          <div className="grid grid-cols-2 gap-4 mt-12">
            {[
              { label: "Active Users", value: "10K+", direction: "left" },
              { label: "Courses", value: "500+", direction: "right" },
              { label: "Quizzes Taken", value: "1M+", direction: "left" },
              { label: "Jobs Posted", value: "2K+", direction: "right" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ 
                  opacity: 0, 
                  x: stat.direction === "left" ? -50 : 50,
                  y: 30 
                }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ 
                  duration: 0.5, 
                  delay: 0.7 + index * 0.15,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="glass-card p-4 cursor-pointer"
              >
                <p className="text-2xl font-bold text-primary">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Right Panel - Auth Form (slides from RIGHT) */}
      <motion.div 
        className="flex-1 flex items-center justify-center p-8 relative z-10"
        variants={slideFromRight}
        initial="initial"
        animate="animate"
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
      >
        <motion.div
          className="w-full max-w-md"
          variants={slideFromBottom}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <GraduationCap className="w-7 h-7 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">EduFlow</h1>
          </div>

          <div className="glass-card p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground">
                {isLogin ? "Welcome Back" : "Create Account"}
              </h2>
              <p className="text-muted-foreground mt-2">
                {isLogin
                  ? "Enter your credentials to access your account"
                  : "Join thousands of learners on EduFlow"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <AnimatePresence mode="wait">
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-5"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="name"
                          type="text"
                          placeholder="John Doe"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                      {errors.name && (
                        <p className="text-sm text-destructive">{errors.name}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Select Your Role</Label>
                      <div className="grid grid-cols-2 gap-3">
                        {roles.map((role) => {
                          const Icon = role.icon;
                          return (
                            <button
                              key={role.id}
                              type="button"
                              onClick={() => setSelectedRole(role.id)}
                              className={`p-3 rounded-xl border-2 transition-all text-left ${
                                selectedRole === role.id
                                  ? "border-primary bg-primary/10"
                                  : "border-border hover:border-primary/50"
                              }`}
                            >
                              <Icon className={`w-5 h-5 mb-2 ${
                                selectedRole === role.id ? "text-primary" : "text-muted-foreground"
                              }`} />
                              <p className="font-medium text-sm text-foreground">{role.label}</p>
                              <p className="text-xs text-muted-foreground mt-0.5">{role.description}</p>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                ) : (
                  <>
                    {isLogin ? "Sign In" : "Create Account"}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-muted-foreground">
                {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-primary hover:underline font-medium"
                >
                  {isLogin ? "Sign Up" : "Sign In"}
                </button>
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
