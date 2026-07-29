import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { email, password } = req.body || {};
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPassword = (password || '').trim();

    if (!cleanEmail || !cleanPassword) {
      return res.status(400).json({ message: 'Please enter both Email and Password.' });
    }

    if (!supabaseUrl || !supabaseKey) {
      return res.status(500).json({ message: 'Server configuration error: Supabase connection details missing.' });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // 1. Check app_users table (super_admin / admin / evaluator / team_leader)
    const { data: appUser } = await supabase
      .from('app_users')
      .select('id, email, password, full_name, role')
      .eq('email', cleanEmail)
      .maybeSingle();

    if (appUser && appUser.password === cleanPassword) {
      const normalizedRole = appUser.role === 'super_admin' || appUser.role === 'admin' 
        ? 'super_admin' 
        : appUser.role === 'evaluator' 
          ? 'Evaluator' 
          : appUser.role;

      let teamId = appUser.team_id || null;
      let teamName = 'Your Team';

      if (normalizedRole === 'team_leader' || normalizedRole === 'leader') {
        const { data: t } = await supabase.from('teams').select('id, team_name').eq('email', cleanEmail).maybeSingle();
        if (t) {
          teamId = t.id;
          teamName = t.team_name || teamName;
        } else {
          const { data: p } = await supabase.from('profiles').select('team_id').eq('email', cleanEmail).maybeSingle();
          if (p) teamId = p.team_id;
        }
      }

      return res.status(200).json({
        success: true,
        user: {
          id: appUser.id,
          teamId: teamId,
          email: appUser.email,
          name: appUser.full_name || appUser.email,
          leaderName: appUser.full_name || appUser.email,
          teamName: teamName,
          role: normalizedRole,
        }
      });
    }

    // 2. Check evaluators table
    const { data: evalData } = await supabase
      .from('evaluators')
      .select('id, email, password, name')
      .eq('email', cleanEmail)
      .maybeSingle();

    if (evalData && evalData.password === cleanPassword) {
      return res.status(200).json({
        success: true,
        user: {
          id: evalData.id,
          email: evalData.email,
          name: evalData.name || evalData.email,
          role: 'Evaluator',
        }
      });
    }

    // 3. Check teams table (team leader)
    const { data: teamData } = await supabase
      .from('teams')
      .select('id, email, password, team_name')
      .eq('email', cleanEmail)
      .maybeSingle();

    if (teamData && teamData.password === cleanPassword) {
      return res.status(200).json({
        success: true,
        user: {
          teamId: teamData.id,
          email: teamData.email,
          leaderName: teamData.team_name || 'Team Leader',
          teamName: teamData.team_name || 'Your Team',
          role: 'team_leader',
        }
      });
    }

    // 4. Check profiles table (team leader / member fallback)
    const { data: profileData } = await supabase
      .from('profiles')
      .select('id, email, password, full_name, team_id, is_team_leader')
      .eq('email', cleanEmail)
      .maybeSingle();

    if (profileData && profileData.password === cleanPassword) {
      let teamName = 'Your Team';
      if (profileData.team_id) {
        const { data: t } = await supabase.from('teams').select('team_name').eq('id', profileData.team_id).maybeSingle();
        if (t?.team_name) teamName = t.team_name;
      }
      return res.status(200).json({
        success: true,
        user: {
          teamId: profileData.team_id || profileData.id,
          email: profileData.email,
          leaderName: profileData.full_name || 'Team Leader',
          teamName: teamName,
          role: 'team_leader',
        }
      });
    }

    return res.status(401).json({ message: 'Invalid credentials. Please verify your email and password.' });
  } catch (err) {
    console.error('Backend login error:', err);
    return res.status(500).json({ message: err.message || 'Authentication failed on server.' });
  }
}
