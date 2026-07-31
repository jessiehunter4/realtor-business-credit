import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get the user from the Authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid user' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Setting up admin role for user: ${user.email}`);

    // Check if user already has admin role
    const { data: existingRole } = await supabaseClient
      .from('user_roles')
      .select('*')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .maybeSingle();

    if (existingRole) {
      return new Response(
        JSON.stringify({ 
          message: 'User already has admin role',
          user: { email: user.email, id: user.id }
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // An admin role may be self-granted in two cases:
    //   1. The caller supplies the correct ADMIN_SIGNUP_CODE, or
    //   2. BOOTSTRAP: the system has no administrator yet.
    let codeAccepted = false;
    const adminSignupCode = Deno.env.get('ADMIN_SIGNUP_CODE') ?? '';
    if (adminSignupCode) {
      try {
        const body = await req.json().catch(() => ({}));
        const supplied = typeof body?.code === 'string' ? body.code.trim() : '';
        codeAccepted = supplied.length > 0 && supplied === adminSignupCode;
      } catch (_) {
        codeAccepted = false;
      }
    }

    const { count: adminCount, error: countError } = await supabaseClient
      .from('user_roles')
      .select('id', { count: 'exact', head: true })
      .eq('role', 'admin');

    if (countError) {
      console.error('Error counting admins:', countError);
      return new Response(
        JSON.stringify({ error: 'Internal server error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!codeAccepted && (adminCount ?? 0) > 0) {
      console.warn(`Rejected admin self-grant for ${user.email}: admins already exist`);
      return new Response(
        JSON.stringify({ error: 'Forbidden' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Assign admin role. This function may be invoked more than once during
    // auth state hydration, so duplicate-key conflicts are a successful,
    // idempotent outcome rather than a runtime failure.
    const { error: insertError } = await supabaseClient
      .from('user_roles')
      .upsert({
        user_id: user.id,
        role: 'admin'
      }, {
        onConflict: 'user_id,role',
        ignoreDuplicates: true
      });

    if (insertError) {
      if (insertError.code === '23505') {
        console.log(`Admin role already exists for ${user.email}`);
        return new Response(
          JSON.stringify({ 
            message: 'User already has admin role',
            user: { email: user.email, id: user.id }
          }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.error('Error assigning admin role:', insertError);
      return new Response(
        JSON.stringify({ error: 'Failed to assign admin role', details: insertError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Admin role successfully assigned to ${user.email}`);

    return new Response(
      JSON.stringify({ 
        message: 'Admin role assigned successfully',
        user: { email: user.email, id: user.id }
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in setup-admin function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
