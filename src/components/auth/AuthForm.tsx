import React, { useState, useEffect } from 'react';
import { CollarIdModal } from '@/components/ui/CollarIdModal';
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
  const [collarId, setCollarId] = useState<string | null>(null);
  const [showCollarModal, setShowCollarModal] = useState(false);
  // Collar ID generator: R + 5-6 random digits
  function generateCollarId() {
    const digits = Math.floor(10000 + Math.random() * 900000); // 5-6 digits
    return `R${digits}`;
  }
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
        const collarIdValue = generateCollarId();
        const { data, error } = await supabase.auth.signUp({
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
          // Insert collar_id into profiles table
          const userId = data?.user?.id;
          if (userId) {
            await supabase.from('profiles').update({ collar_id: collarIdValue }).eq('user_id', userId);
            setCollarId(collarIdValue);
            setShowCollarModal(true);
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
};

export default AuthForm;