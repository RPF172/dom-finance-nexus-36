import { serve } from 'https://deno.land/std@0.190.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    const { limit: rawLimit } = await req.json().catch(() => ({ limit: 10 }));
    const limit = Math.max(1, Math.min(Number(rawLimit) || 10, 25));

    const { data, error } = await supabaseClient
      .from('user_obedience_summary')
      .select(
        `user_id, total_points,
         profiles:profiles!user_obedience_summary_user_id_fkey ( display_name, avatar_url )`
      )
      .order('total_points', { ascending: false })
      .limit(limit);

    if (error) throw error;

    const leaderboard = (data ?? []).map((row: any, idx: number) => ({
      user_id: row.user_id,
      total_points: row.total_points,
      display_name: row.profiles?.display_name ?? null,
      avatar_url: row.profiles?.avatar_url ?? null,
      rank: idx + 1,
    }));

    return new Response(JSON.stringify(leaderboard), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[get-leaderboard] Error:', msg);
    return new Response(JSON.stringify({ error: msg }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
