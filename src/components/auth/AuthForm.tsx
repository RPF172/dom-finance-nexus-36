import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';

interface AuthFormProps {
  onSuccess?: () => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    collarName: ''
  });
  
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Redirect authenticated users to pledge hall
        if (session?.user) {
          navigate('/pledgehall');
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        navigate('/pledgehall');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      toast({
        title: "Your entry was rejected",
        description: "All fields must be completed to proceed.",
        variant: "destructive",
      });
      return false;
    }
    
    if (formData.password.length < 8) {
      toast({
        title: "Passphrase insufficient",
        description: "Your weakness requires at least 8 characters.",
        variant: "destructive",
      });
      return false;
    }
    
    if (!isLogin && !formData.collarName) {
      toast({
        title: "Identification required",
        description: "You must provide a collar name for processing.",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
        
        if (error) {
          toast({
            title: "Entry denied",
            description: "Your credentials were found wanting. Try harder.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Welcome back, Property",
            description: "You have been re-admitted to the Institution.",
          });
          onSuccess?.();
        }
      } else {
        const redirectUrl = `${window.location.origin}/pledgehall`;
        
        const { error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            emailRedirectTo: redirectUrl,
            data: {
              collar_name: formData.collarName,
              rank: 'Initiate Whelp',
            }
          }
        });
        
        if (error) {
          toast({
            title: "Indoctrination failed",
            description: error.message || "Your application was rejected. Address your deficiencies.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Begin processing",
            description: "Check your email to confirm your commitment to the Institution.",
          });
        }
      }
    } catch (error) {
      toast({
        title: "System failure",
        description: "The Institution's systems are temporarily unavailable.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <div className="min-h-screen bg-card text-foreground flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 border border-border rounded-xl shadow-lg bg-card">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold font-cinzel text-[hsl(var(--secondary-foreground))]">
            MAGAT University Login
          </h1>
          <p className="text-sm text-muted-foreground italic">
            "Obedience is the Tuition. Ownership is the Degree."
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex bg-secondary rounded-lg p-1 animate-fade-in [animation-delay:0.3s] opacity-0 [animation-fill-mode:forwards]">
          <button
            type="button"
            className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all duration-300 hover:scale-105 ${isLogin ? 'bg-card text-foreground shadow-md border border-border' : 'bg-secondary text-secondary-foreground shadow-lg border border-border'}`}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button
            type="button"
            className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all duration-300 hover:scale-105 ${!isLogin ? 'bg-card text-foreground shadow-md border border-border' : 'bg-secondary text-secondary-foreground shadow-lg border border-border'}`}
            onClick={() => setIsLogin(false)}
          >
            Register
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in [animation-delay:0.5s] opacity-0 [animation-fill-mode:forwards]">
          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Email</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <input
                type="email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="pl-10 bg-card border-border text-foreground placeholder-muted-foreground rounded-md w-full py-2 border"
                placeholder="Email address"
                required
              />
            </div>
          </div>

          {/* Collar ID (Username for registration) */}
          {!isLogin && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Collar Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <input
                  type="text"
                  value={formData.collarName}
                  onChange={e => setFormData({ ...formData, collarName: e.target.value })}
                  className="pl-10 bg-card border-border text-foreground placeholder-muted-foreground rounded-md w-full py-2 border"
                  placeholder="Collar name"
                  required
                />
              </div>
            </div>
          )}

          {/* Password */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
                className="pl-10 pr-10 bg-card border-border text-foreground placeholder-muted-foreground rounded-md w-full py-2 border"
                placeholder="Password"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-accent"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          {isLogin && (
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked === true)}
                className="border-border data-[state=checked]:bg-accent"
              />
              <label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">
                Remember me
              </label>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground py-3 font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg relative overflow-hidden group"
            disabled={loading}
          >
            {loading ? 'Processing...' : isLogin ? 'Login' : 'Register'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AuthForm;