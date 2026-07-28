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

    // 1. Check app_users table (super_admin / admin / evaluator)
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

      return res.status(200).json({
        success: true,
        user: {
          id: appUser.id,
          email: appUser.email,
          name: appUser.full_name || appUser.email,
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

    return res.status(401).json({ message: 'Invalid credentials. Please verify your email and password.' });
  } catch (err) {
    console.error('Backend login error:', err);
    return res.status(500).json({ message: err.message || 'Authentication failed on server.' });
  }
}
