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
// Collar ID disabled on sign up; generator retained for future use
// const [collarId, setCollarId] = useState<string | null>(null);
// const [showCollarModal, setShowCollarModal] = useState(false);
// function generateCollarId() {
//   const digits = Math.floor(10000 + Math.random() * 900000);
//   return `R${digits}`;
// }
  const [rememberMe, setRememberMe] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [formData, setFormData] = useState({
    collarId: '',
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
    if (!isLogin && !formData.collarId) {
      toast({
        title: "Collar ID required",
        description: "You must provide your assigned Collar ID to register.",
        variant: "destructive",
      });
      return false;
    }
    
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
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            emailRedirectTo: redirectUrl,
            data: {
              collar_id: formData.collarId,
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
    } catch (error: any) {
      toast({
        title: "Unexpected error",
        description: error?.message || "An unknown error occurred.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-steel-silver uppercase tracking-wider">
          {isLogin ? 'FACILITY ACCESS' : 'INITIATE PROCESSING'}
        </h2>
        <p className="text-sm text-steel-silver/80">
          {isLogin ? 'Enter credentials for admission' : 'Register for indoctrination'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-steel-silver uppercase tracking-wide">
              Collar ID
            </label>
            <Input
              type="text"
              value={formData.collarId}
              onChange={(e) => setFormData(prev => ({ ...prev, collarId: e.target.value }))}
              className="bg-obsidian-grey border-steel-silver/30 text-steel-silver placeholder:text-steel-silver/40"
              placeholder="Enter your assigned Collar ID"
              required={!isLogin}
            />
          </div>
        )}
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-steel-silver uppercase tracking-wide">
            Identification Code
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-steel-silver/60" />
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="pl-10 bg-obsidian-grey border-steel-silver/30 text-steel-silver placeholder:text-steel-silver/40"
              placeholder="Enter email address"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-steel-silver uppercase tracking-wide">
            Security Passphrase
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-steel-silver/60" />
            <Input
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              className="pl-10 pr-10 bg-obsidian-grey border-steel-silver/30 text-steel-silver placeholder:text-steel-silver/40"
              placeholder="Enter passphrase"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-steel-silver/60 hover:text-steel-silver"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {!isLogin && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-steel-silver uppercase tracking-wide">
              Designation Name
            </label>
            <Input
              type="text"
              value={formData.collarName}
              onChange={(e) => setFormData(prev => ({ ...prev, collarName: e.target.value }))}
              className="bg-obsidian-grey border-steel-silver/30 text-steel-silver placeholder:text-steel-silver/40"
              placeholder="Enter your chosen designation"
              required={!isLogin}
            />
          </div>
        )}

        <div className="flex items-center space-x-2">
          <Checkbox
            id="remember"
            checked={rememberMe}
            onCheckedChange={(checked) => setRememberMe(checked as boolean)}
          />
          <label htmlFor="remember" className="text-sm text-steel-silver/80">
            Remember credentials
          </label>
        </div>

        <Button 
          type="submit" 
          className="w-full" 
          disabled={loading}
          variant="default"
        >
          {loading ? 'PROCESSING...' : (isLogin ? 'ENTER FACILITY' : 'BEGIN PROCESSING')}
        </Button>
      </form>

      <div className="text-center">
        <button
          type="button"
          onClick={() => setIsLogin(!isLogin)}
          className="text-sm text-steel-silver/80 hover:text-ritual-crimson transition-colors"
        >
          {isLogin ? 'Need to register? Begin processing' : 'Already processed? Enter facility'}
        </button>
      </div>

{/* Collar ID modal intentionally disabled on registration. Kept for future use. */}
    </div>
  );
};

export default AuthForm;