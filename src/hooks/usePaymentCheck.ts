import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface PaymentInfo {
  card_number?: string;
  card_expiry?: string;
  card_cvc?: string;
  street_address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
}

export function usePaymentCheck(onMissingPayment: () => void) {
  const [missingPayment, setMissingPayment] = useState(false);

  useEffect(() => {
    async function checkPayment() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('card_number, card_expiry, card_cvc, street_address, city, state, zip_code')
        .eq('user_id', user.id)
        .maybeSingle();
      if (error || !profile) return;
      const missing = !profile.card_number || !profile.card_expiry || !profile.card_cvc || !profile.street_address || !profile.city || !profile.state || !profile.zip_code;
      setMissingPayment(missing);
      if (missing) onMissingPayment();
    }
    checkPayment();
  }, [onMissingPayment]);

  return missingPayment;
}
