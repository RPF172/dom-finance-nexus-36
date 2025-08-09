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
  const [registrationStep, setRegistrationStep] = useState(1); // 1 = collar ID, 2 = full form
  const [collarIdVerified, setCollarIdVerified] = useState(false);
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
    if (!isLogin && registrationStep === 1 && !formData.collarId) {
      toast({
        title: "Collar ID required",
        description: "You must provide your assigned Collar ID to register.",
        variant: "destructive",
      });
      return false;
    }
    
    if (registrationStep === 2 && (!formData.email || !formData.password)) {
      toast({
        title: "Your entry was rejected",
        description: "All fields must be completed to proceed.",
        variant: "destructive",
      });
      return false;
    }
    
    if (registrationStep === 2 && formData.password.length < 8) {
      toast({
        title: "Passphrase insufficient",
        description: "Your weakness requires at least 8 characters.",
        variant: "destructive",
      });
      return false;
    }
    
    if (!isLogin && registrationStep === 2 && !formData.collarName) {
      toast({
        title: "Identification required",
        description: "You must provide a collar name for processing.",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };

  const validateCollarId = async () => {
    if (!formData.collarId) return false;
    
    const { data, error } = await supabase
      .from('collars')
      .select('collar_id, registered')
      .eq('collar_id', formData.collarId)
      .maybeSingle();
    
    if (error) {
      console.error('Error checking collar ID:', error);
      return false;
    }
    
    return data && !data.registered;
  };

  const handleCollarIdValidation = async () => {
    if (!formData.collarId) {
      toast({
        title: "Collar ID required",
        description: "You must provide your assigned Collar ID to register.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const isValid = await validateCollarId();
      
      if (isValid) {
        setCollarIdVerified(true);
        setRegistrationStep(2);
        toast({
          title: "Collar ID verified",
          description: "Proceed with your registration.",
        });
      } else {
        toast({
          title: "Invalid Collar ID",
          description: "This Collar ID does not exist or is already registered.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Verification failed",
        description: error?.message || "Unable to verify Collar ID.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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
          // Mark collar as registered after successful signup
          if (data.user && formData.collarId) {
            await supabase
              .from('collars')
              .update({ registered: true })
              .eq('collar_id', formData.collarId);
          }
          
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
        {!isLogin && registrationStep === 1 && (
          <>
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
                required
              />
            </div>
            <Button 
              type="button"
              onClick={handleCollarIdValidation}
              className="w-full" 
              disabled={loading}
              variant="default"
            >
              {loading ? 'VERIFYING...' : 'VERIFY COLLAR ID'}
            </Button>
          </>
        )}

        {(isLogin || (!isLogin && registrationStep === 2)) && (
          <>
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

            {!isLogin && registrationStep === 2 && (
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
                  required
                />
              </div>
            )}

            {isLogin && (
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
            )}

            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
              variant="default"
            >
              {loading ? 'PROCESSING...' : (isLogin ? 'ENTER FACILITY' : 'BEGIN PROCESSING')}
            </Button>
          </>
        )}
      </form>

      <div className="text-center space-y-2">
        <button
          type="button"
          onClick={() => {
            setIsLogin(!isLogin);
            setRegistrationStep(1);
            setCollarIdVerified(false);
            setFormData({ collarId: '', email: '', password: '', collarName: '' });
          }}
          className="text-sm text-steel-silver/80 hover:text-ritual-crimson transition-colors"
        >
          {isLogin ? 'Need to register? Begin processing' : 'Already processed? Enter facility'}
        </button>
        
        {!isLogin && registrationStep === 1 && (
          <div>
            <a 
              href="#" 
              className="text-sm text-ritual-crimson hover:text-ritual-crimson/80 transition-colors"
              onClick={(e) => {
                e.preventDefault();
                // Add your collar ID request logic here
              }}
            >
              Need a collar ID?
            </a>
          </div>
        )}
      </div>

{/* Collar ID modal intentionally disabled on registration. Kept for future use. */}
    </div>
  );
};

export default AuthForm;