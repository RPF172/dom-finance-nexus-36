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
    <div className="min-h-screen bg-black text-[#e3dcc3] flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold font-cinzel text-white">
            MAGAT UNIVERSITY
          </h1>
          <p className="text-sm text-[#999] italic">
            Submit • Surrender • Serve
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex bg-[#1a1a1a] rounded-lg p-1">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-colors ${
              isLogin 
                ? 'bg-red-600 text-white' 
                : 'text-[#999] hover:text-[#e3dcc3]'
            }`}
          >
            Submit to Entry
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-colors ${
              !isLogin 
                ? 'bg-red-600 text-white' 
                : 'text-[#999] hover:text-[#e3dcc3]'
            }`}
          >
            Begin Indoctrination
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Collar ID (Username for registration) */}
          {!isLogin && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#999]">
                Collar Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#666] h-4 w-4" />
                <Input
                  type="text"
                  value={formData.collarName}
                  onChange={handleInputChange('collarName')}
                  className="pl-10 bg-[#1a1a1a] border-[#333] text-[#e3dcc3] placeholder-[#666]"
                  placeholder="Your designated identifier"
                  disabled={loading}
                />
              </div>
            </div>
          )}

          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#999]">
              {isLogin ? 'Collar ID' : 'Email Address'}
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#666] h-4 w-4" />
              <Input
                type="email"
                value={formData.email}
                onChange={handleInputChange('email')}
                className="pl-10 bg-[#1a1a1a] border-[#333] text-[#e3dcc3] placeholder-[#666]"
                placeholder={isLogin ? "your.email@domain.com" : "Email for institutional communications"}
                disabled={loading}
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#999]">
              Passphrase
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#666] h-4 w-4" />
              <Input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleInputChange('password')}
                className="pl-10 pr-10 bg-[#1a1a1a] border-[#333] text-[#e3dcc3] placeholder-[#666]"
                placeholder={isLogin ? "Enter your binding phrase" : "Minimum 8 characters of submission"}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#666] hover:text-[#e3dcc3]"
                disabled={loading}
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
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                className="border-[#666] data-[state=checked]:bg-red-600"
              />
              <label htmlFor="remember" className="text-sm text-[#999] cursor-pointer">
                Remember My Shame
              </label>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 font-medium"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Processing...
              </div>
            ) : (
              isLogin ? 'Submit to Entry' : 'Begin Indoctrination →'
            )}
          </Button>
        </form>

        {/* Footer */}
        <div className="text-center text-xs text-[#666]">
          <p className="mb-2">
            By proceeding, you acknowledge your worthlessness and accept institutional processing.
          </p>
          <p>
            Your data belongs to the Institution. Privacy is a delusion of the unprocessed.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;