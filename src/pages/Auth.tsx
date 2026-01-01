import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Sparkles, Mail, Lock, User, ArrowRight, Loader2 } from "lucide-react";
import lumoraLogo from "@/assets/lumora-logo.png";
import { z } from "zod";

const authSchema = z.object({
  email: z.string().trim().email({ message: "Please enter a valid email" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  displayName: z.string().trim().optional(),
});

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  
  const { signIn, signUp, user, loading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate("/");
    }
  }, [user, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    // Validate inputs
    const result = authSchema.safeParse({ email, password, displayName });
    if (!result.success) {
      const fieldErrors: { email?: string; password?: string } = {};
      result.error.errors.forEach((err) => {
        if (err.path[0] === 'email') fieldErrors.email = err.message;
        if (err.path[0] === 'password') fieldErrors.password = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (isSignUp) {
        const { error } = await signUp(email, password, displayName || undefined);
        if (error) {
          if (error.message.includes("already registered")) {
            toast({
              title: "Account exists",
              description: "This email is already registered. Please sign in instead.",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Sign up failed",
              description: error.message,
              variant: "destructive",
            });
          }
        } else {
          toast({
            title: "Welcome to Lumora!",
            description: "Your account has been created successfully.",
          });
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          toast({
            title: "Sign in failed",
            description: "Invalid email or password. Please try again.",
            variant: "destructive",
          });
        }
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="gradient-orb absolute top-1/4 left-1/4 w-[600px] h-[600px] opacity-30" />
        <div className="gradient-orb absolute bottom-1/4 right-1/4 w-[500px] h-[500px] opacity-20" style={{ animationDelay: "-10s" }} />
      </div>
      
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-4 animate-fade-in-up">
          <div className="relative">
            <img 
              src={lumoraLogo} 
              alt="Lumora" 
              className="h-16 w-16 rounded-2xl shadow-glow"
            />
            <div className="absolute inset-0 rounded-2xl bg-primary/20 blur-xl -z-10" />
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              {isSignUp ? "Create your account" : "Welcome back"}
            </h1>
            <p className="mt-2 text-muted-foreground">
              {isSignUp 
                ? "Start your journey with Lumora AI" 
                : "Sign in to continue to Lumora"}
            </p>
          </div>
        </div>

        {/* Auth Card */}
        <div className="w-full max-w-sm animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          <div className="glass-effect rounded-2xl p-8 shadow-xl border border-border/50">
            <form onSubmit={handleSubmit} className="space-y-5">
              {isSignUp && (
                <div className="space-y-2">
                  <Label htmlFor="displayName" className="text-sm font-medium text-foreground/80">
                    Display name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="displayName"
                      type="text"
                      placeholder="Your name"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="pl-10 h-11 bg-background/50 border-border/50 focus:border-primary/50 transition-colors"
                    />
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-foreground/80">
                  Email address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-11 bg-background/50 border-border/50 focus:border-primary/50 transition-colors"
                    required
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-destructive">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-foreground/80">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 h-11 bg-background/50 border-border/50 focus:border-primary/50 transition-colors"
                    required
                  />
                </div>
                {errors.password && (
                  <p className="text-xs text-destructive">{errors.password}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-all duration-200 group"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    {isSignUp ? "Create account" : "Sign in"}
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setErrors({});
                }}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {isSignUp 
                  ? "Already have an account? Sign in" 
                  : "Don't have an account? Sign up"}
              </button>
            </div>
          </div>

          {/* Features hint */}
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <Sparkles className="h-3.5 w-3.5" />
            <span>Powered by advanced AI</span>
          </div>
        </div>
      </div>
    </div>
  );
}
