import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { STATEMENTS } from '../data/problemStatements';

import svhLogo from '../assets/svh.jpeg';
import vitbLogo from '../assets/vitblogo.png';
import blockchainLogo from '../assets/Blockchain.png';

export default function AdminDashboard() {
  const [session, setSession] = useState(null);
  const [activeTab, setActiveTab] = useState('analytics'); // 'analytics', 'teams', 'evaluators', 'leaderboard', 'changeRequests'
  const navigate = useNavigate();

  // Primary Supabase Data Collections
  const [teams, setTeams] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [evaluators, setEvaluators] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [evaluations, setEvaluations] = useState([]);
  const [changeRequests, setChangeRequests] = useState([]);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPsFilter, setSelectedPsFilter] = useState('ALL');
  const [selectedEvaluatorFilter, setSelectedEvaluatorFilter] = useState('ALL');
  const [changeReqStatusFilter, setChangeReqStatusFilter] = useState('ALL');

  // Modals state
  const [viewingTeamDetailsModal, setViewingTeamDetailsModal] = useState(null); // { team, members }
  const [editingTeamData, setEditingTeamData] = useState(null); // { team, members }
  const [viewingSubmissionsModal, setViewingSubmissionsModal] = useState(null); // { team, subs }

  // Admin notes for change requests
  const [processingRequestId, setProcessingRequestId] = useState(null);
  const [adminNoteInput, setAdminNoteInput] = useState('');

  // Evaluator Management state
  const [newEvalData, setNewEvalData] = useState({ name: '', email: '', password: '' });
  const [showAddEvalModal, setShowAddEvalModal] = useState(false);
  const [selectedEvaluator, setSelectedEvaluator] = useState(null);

  // Data Export Tab state variables
  const [exportType, setExportType] = useState('teams_members');
  const [exportPsFilter, setExportPsFilter] = useState('ALL');
  const [exportGenderFilter, setExportGenderFilter] = useState('ALL');
  const [exportSearchQuery, setExportSearchQuery] = useState('');
  const [selectedColumns, setSelectedColumns] = useState({});

  // Email Broadcaster tab states
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [emailIsHtml, setEmailIsHtml] = useState(true);
  const [emailPsFilter, setEmailPsFilter] = useState('ALL');
  const [emailToOverride, setEmailToOverride] = useState('blockchainvitb@gmail.com');
  
  // BCC Target Checkboxes
  const [bccTargetLeaders, setBccTargetLeaders] = useState(true);
  const [bccTargetMembers, setBccTargetMembers] = useState(false);
  const [bccTargetEvaluators, setBccTargetEvaluators] = useState(false);
  const [manualBccEmails, setManualBccEmails] = useState('');

  const [sendingEmails, setSendingEmails] = useState(false);
  const [emailDryRun, setEmailDryRun] = useState(false);
  const [emailSendStatus, setEmailSendStatus] = useState(null); // { success: boolean, message: string }

  // Computed BCC Recipients List
  const computedBccRecipients = useMemo(() => {
    let list = [];
    let targetTeamIds = teams.map(t => t.id);
    if (emailPsFilter !== 'ALL') {
      const psSubs = submissions.filter(s => s.problem_code === emailPsFilter);
      targetTeamIds = Array.from(new Set(psSubs.map(s => s.team_id)));
    }

    // 1. Team Leaders
    if (bccTargetLeaders) {
      const activeTeams = teams.filter(t => targetTeamIds.includes(t.id));
      activeTeams.forEach(t => {
        if (t.email && t.email.includes('@')) {
          list.push(t.email.trim());
        }
      });
    }

    // 2. Group Members (Non-leaders)
    if (bccTargetMembers) {
      const targetProfiles = profiles.filter(p => targetTeamIds.includes(p.team_id) && !p.is_team_leader);
      targetProfiles.forEach(p => {
        if (p.email && p.email.includes('@')) {
          list.push(p.email.trim());
        }
      });
    }

    // 3. Evaluators
    if (bccTargetEvaluators) {
      evaluators.forEach(e => {
        if (e.email && e.email.includes('@')) {
          list.push(e.email.trim());
        }
      });
    }

    // 4. Merge manual BCC emails
    if (manualBccEmails.trim()) {
      const parsed = manualBccEmails
        .split(',')
        .map(e => e.trim())
        .filter(e => e && e.includes('@'));
      list = [...list, ...parsed];
    }

    return Array.from(new Set(list));
  }, [teams, profiles, evaluators, submissions, bccTargetLeaders, bccTargetMembers, bccTargetEvaluators, emailPsFilter, manualBccEmails]);

  const handleBroadCastEmail = async (e) => {
    e.preventDefault();
    if (computedBccRecipients.length === 0) {
      alert('BCC Recipients list is empty! Please select at least one group or add manual emails.');
      return;
    }
    if (!emailSubject.trim() || !emailBody.trim()) {
      alert('Please fill in both the Subject and Email Body.');
      return;
    }

    const confirmMessage = emailDryRun
      ? `Are you sure you want to run a DRY RUN simulation for this broadcast to ${computedBccRecipients.length} recipients (no actual emails will be sent)?`
      : `Are you sure you want to broadcast this email to ${computedBccRecipients.length} recipients via BCC?`;

    if (!window.confirm(confirmMessage)) {
      return;
    }

    setSendingEmails(true);
    setEmailSendStatus(null);

    try {
      const res = await fetch('/api/bulkSendEmail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: emailSubject,
          body: emailBody,
          isHtml: emailIsHtml,
          toEmail: emailToOverride,
          bccRecipients: computedBccRecipients,
          dryRun: emailDryRun
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Error occurred while broadcasting emails.');
      }

      setEmailSendStatus({ 
        success: true, 
        message: data.message || `Successfully processed email broadcast for ${computedBccRecipients.length} recipients!` 
      });
      if (!emailDryRun) {
        setEmailSubject('');
        setEmailBody('');
      }
    } catch (err) {
      console.error('Broadcast Error:', err);
      setEmailSendStatus({ success: false, message: err.message || 'Failed to send broadcast.' });
    } finally {
      setSendingEmails(false);
    }
  };

  const COLUMN_DEFINITIONS = useMemo(() => ({
    teams_members: [
      { id: 'team_id', label: 'Team ID', default: true },
      { id: 'team_name', label: 'Team Name', default: true },
      { id: 'leader_email', label: 'Leader Email', default: true },
      { id: 'team_password', label: 'Team Password', default: false },
      { id: 'member_name', label: 'Member Name', default: true },
      { id: 'member_email', label: 'Member Email', default: true },
      { id: 'member_phone', label: 'Member Phone', default: true },
      { id: 'member_gender', label: 'Member Gender', default: true },
      { id: 'member_reg_no', label: 'Member Reg No', default: true },
      { id: 'is_leader', label: 'Is Leader', default: true },
    ],
    submissions: [
      { id: 'idea_id', label: 'Idea ID', default: true },
      { id: 'team_id', label: 'Team ID', default: true },
      { id: 'team_name', label: 'Team Name', default: true },
      { id: 'problem_code', label: 'PS Code', default: true },
      { id: 'problem_statement', label: 'PS Title', default: true },
      { id: 'theme', label: 'Theme', default: true },
      { id: 'category', label: 'Category', default: true },
      { id: 'idea_title', label: 'Idea Title', default: true },
      { id: 'use_case', label: 'Use Case', default: false },
      { id: 'target_audience', label: 'Target Audience', default: false },
      { id: 'unique_idea', label: 'Unique Idea/Innovation', default: false },
      { id: 'idea_description', label: 'Detailed Description', default: false },
      { id: 'yt_link', label: 'YouTube Link', default: true },
      { id: 'document_link', label: 'Drive Doc Link', default: true },
      { id: 'ppt_url', label: 'PPT URL', default: true },
      { id: 'submitted_at', label: 'Submitted At', default: true }
    ],
    evaluations: [
      { id: 'eval_id', label: 'Evaluation ID', default: false },
      { id: 'team_id', label: 'Team ID', default: true },
      { id: 'team_name', label: 'Team Name', default: true },
      { id: 'idea_id', label: 'Idea ID', default: true },
      { id: 'problem_code', label: 'PS Code', default: true },
      { id: 'evaluator_email', label: 'Evaluator Email', default: true },
      { id: 'evaluator_name', label: 'Evaluator Name', default: true },
      { id: 'alignment_score', label: 'Alignment Score', default: true },
      { id: 'innovation_score', label: 'Innovation Score', default: true },
      { id: 'feasibility_score', label: 'Feasibility Score', default: true },
      { id: 'scalability_score', label: 'Scalability Score', default: true },
      { id: 'compliance_score', label: 'Compliance Score', default: true },
      { id: 'total_score', label: 'Total Score', default: true },
      { id: 'comments', label: 'Comments / Remarks', default: true },
      { id: 'created_at', label: 'Evaluation Date', default: true }
    ],
    evaluators: [
      { id: 'evaluator_id', label: 'Evaluator ID', default: true },
      { id: 'evaluator_name', label: 'Evaluator Name', default: true },
      { id: 'evaluator_email', label: 'Evaluator Email', default: true },
      { id: 'evaluator_password', label: 'Evaluator Password', default: true },
      { id: 'created_at', label: 'Created At', default: true }
    ]
  }), []);

  useEffect(() => {
    const cols = COLUMN_DEFINITIONS[exportType] || [];
    const initialMap = {};
    cols.forEach(c => {
      initialMap[c.id] = c.default;
    });
    setSelectedColumns(initialMap);
  }, [exportType, COLUMN_DEFINITIONS]);

  const handleExportCSV = () => {
    const colsToExport = COLUMN_DEFINITIONS[exportType].filter(c => selectedColumns[c.id]);
    if (colsToExport.length === 0) {
      alert('Please select at least one column to export.');
      return;
    }

    let rowsData = [];

    if (exportType === 'teams_members') {
      teams.forEach(t => {
        const teamMembers = profiles.filter(p => p.team_id === t.id);

        if (exportSearchQuery.trim()) {
          const q = exportSearchQuery.toLowerCase();
          const matchTeam = t.id.toLowerCase().includes(q) || t.team_name.toLowerCase().includes(q) || (t.email && t.email.toLowerCase().includes(q));
          const hasMatchingMember = teamMembers.some(m => m.full_name.toLowerCase().includes(q) || (m.email && m.email.toLowerCase().includes(q)) || (m.registration_number && m.registration_number.toLowerCase().includes(q)));
          if (!matchTeam && !hasMatchingMember) return;
        }

        const membersList = teamMembers.length > 0 ? teamMembers : [{
          id: '', full_name: '-', email: '-', phone: '-', gender: '-', registration_number: '-', is_team_leader: false
        }];

        membersList.forEach(m => {
          if (exportGenderFilter !== 'ALL' && m.gender !== exportGenderFilter) return;

          const row = {};
          if (selectedColumns['team_id']) row['team_id'] = t.id;
          if (selectedColumns['team_name']) row['team_name'] = t.team_name;
          if (selectedColumns['leader_email']) row['leader_email'] = t.email || '-';
          if (selectedColumns['team_password']) row['team_password'] = t.password || '-';
          if (selectedColumns['member_name']) row['member_name'] = m.full_name;
          if (selectedColumns['member_email']) row['member_email'] = m.email || '-';
          if (selectedColumns['member_phone']) row['member_phone'] = m.phone || '-';
          if (selectedColumns['member_gender']) row['member_gender'] = m.gender || '-';
          if (selectedColumns['member_reg_no']) row['member_reg_no'] = m.registration_number || '-';
          if (selectedColumns['is_leader']) row['is_leader'] = m.is_team_leader ? 'Yes' : 'No';
          rowsData.push(row);
        });
      });
    } else if (exportType === 'submissions') {
      submissions.forEach(sub => {
        const teamObj = teams.find(t => t.id === sub.team_id) || {};

        if (exportPsFilter !== 'ALL' && sub.problem_code !== exportPsFilter) return;

        if (exportSearchQuery.trim()) {
          const q = exportSearchQuery.toLowerCase();
          const matchSub = sub.idea_id.toLowerCase().includes(q) || sub.problem_code.toLowerCase().includes(q) || sub.idea_title.toLowerCase().includes(q) || sub.problem_statement.toLowerCase().includes(q);
          const matchTeam = (teamObj.team_name && teamObj.team_name.toLowerCase().includes(q)) || sub.team_id.toLowerCase().includes(q);
          if (!matchSub && !matchTeam) return;
        }

        const row = {};
        if (selectedColumns['idea_id']) row['idea_id'] = sub.idea_id;
        if (selectedColumns['team_id']) row['team_id'] = sub.team_id;
        if (selectedColumns['team_name']) row['team_name'] = teamObj.team_name || '-';
        if (selectedColumns['problem_code']) row['problem_code'] = sub.problem_code;
        if (selectedColumns['problem_statement']) row['problem_statement'] = sub.problem_statement;
        if (selectedColumns['theme']) row['theme'] = sub.theme;
        if (selectedColumns['category']) row['category'] = sub.category;
        if (selectedColumns['idea_title']) row['idea_title'] = sub.idea_title;
        if (selectedColumns['use_case']) row['use_case'] = sub.use_case;
        if (selectedColumns['target_audience']) row['target_audience'] = sub.target_audience;
        if (selectedColumns['unique_idea']) row['unique_idea'] = sub.unique_idea;
        if (selectedColumns['idea_description']) row['idea_description'] = sub.idea_description;
        if (selectedColumns['yt_link']) row['yt_link'] = sub.yt_link || '-';
        if (selectedColumns['document_link']) row['document_link'] = sub.document_link || '-';
        if (selectedColumns['ppt_url']) row['ppt_url'] = sub.ppt_url || '-';
        if (selectedColumns['submitted_at']) row['submitted_at'] = new Date(sub.submitted_at).toLocaleString();
        rowsData.push(row);
      });
    } else if (exportType === 'evaluations') {
      evaluations.forEach(ev => {
        const teamObj = teams.find(t => t.id === ev.team_id) || {};

        if (exportPsFilter !== 'ALL' && ev.problem_code !== exportPsFilter) return;

        if (exportSearchQuery.trim()) {
          const q = exportSearchQuery.toLowerCase();
          const matchEv = ev.idea_id.toLowerCase().includes(q) || ev.problem_code.toLowerCase().includes(q) || (ev.evaluator_name && ev.evaluator_name.toLowerCase().includes(q)) || ev.evaluator_email.toLowerCase().includes(q);
          const matchTeam = (teamObj.team_name && teamObj.team_name.toLowerCase().includes(q)) || ev.team_id.toLowerCase().includes(q);
          if (!matchEv && !matchTeam) return;
        }

        const row = {};
        if (selectedColumns['eval_id']) row['eval_id'] = ev.id;
        if (selectedColumns['team_id']) row['team_id'] = ev.team_id;
        if (selectedColumns['team_name']) row['team_name'] = teamObj.team_name || ev.team_name || '-';
        if (selectedColumns['idea_id']) row['idea_id'] = ev.idea_id;
        if (selectedColumns['problem_code']) row['problem_code'] = ev.problem_code;
        if (selectedColumns['evaluator_email']) row['evaluator_email'] = ev.evaluator_email;
        if (selectedColumns['evaluator_name']) row['evaluator_name'] = ev.evaluator_name || '-';
        if (selectedColumns['alignment_score']) row['alignment_score'] = ev.alignment_score;
        if (selectedColumns['innovation_score']) row['innovation_score'] = ev.innovation_score;
        if (selectedColumns['feasibility_score']) row['feasibility_score'] = ev.feasibility_score;
        if (selectedColumns['scalability_score']) row['scalability_score'] = ev.scalability_score;
        if (selectedColumns['compliance_score']) row['compliance_score'] = ev.compliance_score;
        if (selectedColumns['total_score']) row['total_score'] = ev.total_score;
        if (selectedColumns['comments']) row['comments'] = ev.comments || '-';
        if (selectedColumns['created_at']) row['created_at'] = new Date(ev.created_at).toLocaleString();
        rowsData.push(row);
      });
    } else if (exportType === 'evaluators') {
      evaluators.forEach(ev => {
        if (exportSearchQuery.trim()) {
          const q = exportSearchQuery.toLowerCase();
          if (!ev.name.toLowerCase().includes(q) && !ev.email.toLowerCase().includes(q)) return;
        }

        const row = {};
        if (selectedColumns['evaluator_id']) row['evaluator_id'] = ev.id;
        if (selectedColumns['evaluator_name']) row['evaluator_name'] = ev.name;
        if (selectedColumns['evaluator_email']) row['evaluator_email'] = ev.email;
        if (selectedColumns['evaluator_password']) row['evaluator_password'] = ev.password;
        if (selectedColumns['created_at']) row['created_at'] = new Date(ev.created_at).toLocaleString();
        rowsData.push(row);
      });
    }

    if (rowsData.length === 0) {
      alert('No data matches the selected filters.');
      return;
    }

    const headers = colsToExport.map(c => `"${c.label.replace(/"/g, '""')}"`).join(',');
    const body = rowsData.map(row => {
      return colsToExport.map(c => {
        const val = row[c.id] !== undefined ? String(row[c.id]) : '';
        return `"${val.replace(/"/g, '""')}"`;
      }).join(',');
    }).join('\n');

    const csvContent = `\uFEFF${headers}\n${body}`; // Add BOM for Excel UTF-8 support
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `svh_${exportType}_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    const sessionStr = localStorage.getItem('super_eval_session');
    if (!sessionStr) {
      navigate('/login');
      return;
    }
    const sess = JSON.parse(sessionStr);
    if (sess.role !== 'super_admin') {
      navigate('/login');
      return;
    }
    setSession(sess);
  }, [navigate]);

  const fetchAllAdminData = async () => {
    setLoading(true);
    try {
      const [
        { data: teamsData },
        { data: profilesData },
        { data: subsData },
        { data: evalsData },
        { data: assignData },
        { data: scoresData },
        { data: reqsData }
      ] = await Promise.all([
        supabase.from('teams').select('*').limit(5000).order('created_at', { ascending: false }),
        supabase.from('profiles').select('*').limit(5000),
        supabase.from('submissions').select('*').limit(5000).order('submitted_at', { ascending: false }),
        supabase.from('evaluators').select('*').limit(5000).order('name', { ascending: true }),
        supabase.from('evaluator_assignments').select('*').limit(5000),
        supabase.from('evaluations').select('*').limit(5000).order('created_at', { ascending: false }),
        supabase.from('change_requests').select('*').limit(5000).order('created_at', { ascending: false })
      ]);

      setTeams(teamsData || []);
      setProfiles(profilesData || []);
      setSubmissions(subsData || []);
      setEvaluators(evalsData || []);
      setAssignments(assignData || []);
      setEvaluations(scoresData || []);
      setChangeRequests(reqsData || []);
    } catch (err) {
      console.error('Failed to fetch admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      fetchAllAdminData();
    }
  }, [session]);

  const handleLogout = () => {
    localStorage.removeItem('super_eval_session');
    navigate('/login');
  };

  // --- TEAM MANAGEMENT & MEMBER EDITS ---
  const openViewTeamModal = (team) => {
    const teamMembers = profiles.filter(p => p.team_id === team.id);
    setViewingTeamDetailsModal({ team, members: teamMembers });
  };

  const openEditTeamModal = (team) => {
    const teamMembers = profiles.filter(p => p.team_id === team.id);
    setEditingTeamData({
      team: { ...team },
      members: teamMembers.map(m => ({ ...m }))
    });
  };

  const openViewSubmissionsModal = (team) => {
    const teamSubs = submissions.filter(s => s.team_id === team.id);
    setViewingSubmissionsModal({ team, subs: teamSubs });
  };

  const handleSaveTeamAndMembers = async (e) => {
    e.preventDefault();
    if (!editingTeamData) return;
    setActionLoading(true);

    try {
      const { team, members: editMembers } = editingTeamData;

      // 1. Update public.teams table
      const { error: teamErr } = await supabase
        .from('teams')
        .update({
          team_name: team.team_name,
          email: team.email,
          password: team.password
        })
        .eq('id', team.id);

      if (teamErr) throw teamErr;

      // Also sync app_users if leader email changed
      if (team.email && team.password) {
        await supabase.from('app_users').upsert([{
          email: team.email,
          password: team.password,
          full_name: team.team_name,
          role: 'team_leader'
        }], { onConflict: 'email' });
      }

      // 2. Ensure strictly ONLY 1 Team Leader selected
      let membersToSave = [...editMembers];
      const hasLeader = membersToSave.some(m => m.is_team_leader);
      if (!hasLeader && membersToSave.length > 0) {
        membersToSave[0].is_team_leader = true;
      }

      // 3. Update/Insert public.profiles table
      for (const m of membersToSave) {
        const profPayload = {
          team_id: team.id,
          full_name: m.full_name || 'Unnamed Member',
          email: m.email || null,
          phone: m.phone || null,
          gender: m.gender || 'Female',
          registration_number: m.registration_number || null,
          is_team_leader: !!m.is_team_leader
        };

        const targetId = m.id || crypto.randomUUID();

        // Check if profile exists in database
        const { data: existingProf } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', targetId)
          .maybeSingle();

        if (existingProf) {
          const { error: pErr } = await supabase
            .from('profiles')
            .update(profPayload)
            .eq('id', targetId);
          if (pErr) throw pErr;
        } else {
          const { error: pErr } = await supabase
            .from('profiles')
            .insert([{
              id: targetId,
              ...profPayload
            }]);
          if (pErr) throw pErr;
        }
      }

      setEditingTeamData(null);
      await fetchAllAdminData();
      alert('Team & Member details updated successfully!');
    } catch (err) {
      alert(`Error saving team details: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteTeam = async (teamId, teamName) => {
    if (!window.confirm(`Are you sure you want to delete Team "${teamName}" (${teamId})? This will delete all submissions and member profiles!`)) return;
    setActionLoading(true);
    try {
      await supabase.from('profiles').delete().eq('team_id', teamId);
      await supabase.from('submissions').delete().eq('team_id', teamId);
      await supabase.from('evaluator_assignments').delete().eq('team_id', teamId);
      await supabase.from('evaluations').delete().eq('team_id', teamId);
      await supabase.from('teams').delete().eq('id', teamId);

      await fetchAllAdminData();
      alert('Team deleted successfully!');
    } catch (err) {
      alert(`Error deleting team: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  // --- EVALUATOR MANAGEMENT ---
  const handleAddEvaluator = async (e) => {
    e.preventDefault();
    if (!newEvalData.name || !newEvalData.email || !newEvalData.password) return;
    setActionLoading(true);
    try {
      const { error: evalErr } = await supabase
        .from('evaluators')
        .insert([{
          name: newEvalData.name,
          email: newEvalData.email,
          password: newEvalData.password
        }]);

      if (evalErr) throw evalErr;

      await supabase.from('app_users').upsert([{
        email: newEvalData.email,
        password: newEvalData.password,
        full_name: newEvalData.name,
        role: 'evaluator'
      }], { onConflict: 'email' });

      setNewEvalData({ name: '', email: '', password: '' });
      setShowAddEvalModal(false);
      await fetchAllAdminData();
      alert('Evaluator added successfully!');
    } catch (err) {
      alert(`Error adding evaluator: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteEvaluator = async (evalEmail) => {
    if (!window.confirm(`Delete evaluator account ${evalEmail}?`)) return;
    setActionLoading(true);
    try {
      await supabase.from('evaluators').delete().eq('email', evalEmail);
      await supabase.from('app_users').delete().eq('email', evalEmail);
      await supabase.from('evaluator_assignments').delete().eq('evaluator_email', evalEmail);
      await fetchAllAdminData();
      if (selectedEvaluator?.email === evalEmail) setSelectedEvaluator(null);
      alert('Evaluator deleted!');
    } catch (err) {
      alert(`Error deleting evaluator: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  // --- EVALUATOR ASSIGNMENTS SHORTCUTS ---
  const isIdeaAssigned = (evalEmail, ideaId) => {
    return assignments.some(a => a.evaluator_email === evalEmail && a.idea_id === ideaId);
  };

  const toggleAssignment = async (evaluatorObj, submissionObj) => {
    const isAssigned = isIdeaAssigned(evaluatorObj.email, submissionObj.idea_id);
    setActionLoading(true);
    try {
      if (isAssigned) {
        await supabase
          .from('evaluator_assignments')
          .delete()
          .eq('evaluator_email', evaluatorObj.email)
          .eq('idea_id', submissionObj.idea_id);
      } else {
        await supabase
          .from('evaluator_assignments')
          .insert([{
            evaluator_id: evaluatorObj.id,
            evaluator_email: evaluatorObj.email,
            idea_id: submissionObj.idea_id,
            team_id: submissionObj.team_id
          }]);
      }
      await fetchAllAdminData();
    } catch (err) {
      alert(`Assignment error: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const assignAllVisibleIdeas = async (evaluatorObj, visibleSubs) => {
    if (!evaluatorObj || visibleSubs.length === 0) return;
    setActionLoading(true);
    try {
      const newAssignments = visibleSubs
        .filter(sub => !isIdeaAssigned(evaluatorObj.email, sub.idea_id))
        .map(sub => ({
          evaluator_id: evaluatorObj.id,
          evaluator_email: evaluatorObj.email,
          idea_id: sub.idea_id,
          team_id: sub.team_id
        }));

      if (newAssignments.length > 0) {
        const { error } = await supabase.from('evaluator_assignments').insert(newAssignments);
        if (error) throw error;
        await fetchAllAdminData();
        alert(`Assigned ${newAssignments.length} ideas to ${evaluatorObj.name}!`);
      }
    } catch (err) {
      alert(`Error assigning ideas: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const unassignAllVisibleIdeas = async (evaluatorObj, visibleSubs) => {
    if (!evaluatorObj || visibleSubs.length === 0) return;
    setActionLoading(true);
    try {
      const targetIdeaIds = visibleSubs.map(s => s.idea_id);
      const { error } = await supabase
        .from('evaluator_assignments')
        .delete()
        .eq('evaluator_email', evaluatorObj.email)
        .in('idea_id', targetIdeaIds);

      if (error) throw error;
      await fetchAllAdminData();
      alert(`Unassigned all visible ideas from ${evaluatorObj.name}!`);
    } catch (err) {
      alert(`Error unassigning ideas: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  // --- CHANGE REQUESTS & LIVE DIRECT SUPABASE UPDATES ---
  const parseChangeRequestPayload = (description) => {
    if (!description) return null;
    try {
      const trimmed = description.trim();
      if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
        const parsed = JSON.parse(trimmed);
        if (parsed.before && parsed.after) {
          return parsed;
        }
      }
    } catch (e) {
      // Free text
    }
    return null;
  };

  const handleUpdateChangeRequest = async (requestObj, newStatus) => {
    setActionLoading(true);
    try {
      // If Admin approves, apply updates directly to Supabase tables!
      if (newStatus === 'Approved') {
        const payload = parseChangeRequestPayload(requestObj.description);
        if (payload && payload.after) {
          const { team, members: newMembers } = payload.after;
          const targetTeamId = requestObj.team_id || (team && team.id);

          // 1. Update public.teams
          if (team && targetTeamId) {
            const teamPayload = {};
            if (team.team_name) teamPayload.team_name = team.team_name;
            if (team.email) teamPayload.email = team.email;
            if (team.password) teamPayload.password = team.password;

            if (Object.keys(teamPayload).length > 0) {
              const { error: tErr } = await supabase
                .from('teams')
                .update(teamPayload)
                .eq('id', targetTeamId);

              if (tErr) throw tErr;
            }

            // Sync app_users if leader email & password exist
            if (team.email && team.password) {
              await supabase.from('app_users').upsert([{
                email: team.email,
                password: team.password,
                full_name: team.team_name || targetTeamId,
                role: 'team_leader'
              }], { onConflict: 'email' });
            }
          }

          // 2. Update / Insert public.profiles
          if (newMembers && Array.isArray(newMembers) && newMembers.length > 0) {
            // Reset is_team_leader for all members of this team first
            await supabase
              .from('profiles')
              .update({ is_team_leader: false })
              .eq('team_id', targetTeamId);

            for (const m of newMembers) {
              const profPayload = {
                team_id: targetTeamId,
                full_name: m.full_name || 'Unnamed Member',
                email: m.email || null,
                phone: m.phone || null,
                gender: m.gender || 'Female',
                registration_number: m.registration_number || null,
                is_team_leader: !!m.is_team_leader
              };

              const targetId = m.id || crypto.randomUUID();

              // Check if profile exists in database
              const { data: existingProf } = await supabase
                .from('profiles')
                .select('id')
                .eq('id', targetId)
                .maybeSingle();

              if (existingProf) {
                const { error: pErr } = await supabase
                  .from('profiles')
                  .update(profPayload)
                  .eq('id', targetId);
                if (pErr) throw pErr;
              } else {
                const { error: pErr } = await supabase
                  .from('profiles')
                  .insert([{
                    id: targetId,
                    ...profPayload
                  }]);
                if (pErr) throw pErr;
              }
            }
          }
        }
      }

      // Mark request status in Supabase
      const { error: reqErr } = await supabase
        .from('change_requests')
        .update({
          status: newStatus,
          admin_notes: adminNoteInput || (newStatus === 'Approved' ? 'Approved and team profiles updated directly in database.' : null)
        })
        .eq('id', requestObj.id);

      if (reqErr) throw reqErr;

      setProcessingRequestId(null);
      setAdminNoteInput('');
      await fetchAllAdminData();
      alert(`Change Request ${newStatus} successfully! ${newStatus === 'Approved' ? 'Team details have been updated live in database.' : ''}`);
    } catch (err) {
      console.error("Error approving request:", err);
      alert(`Error updating request: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  // --- COMPUTED ANALYTICS & INSIGHTS ---
  const psAnalytics = useMemo(() => {
    const statsMap = {};
    STATEMENTS.forEach(stmt => {
      statsMap[stmt.id] = {
        id: stmt.id,
        title: stmt.title,
        category: stmt.category,
        submissionCount: 0,
        assignedCount: 0,
        evaluatedCount: 0,
        totalScoresSum: 0,
        highestScore: 0
      };
    });

    submissions.forEach(sub => {
      if (statsMap[sub.problem_code]) {
        statsMap[sub.problem_code].submissionCount += 1;
      } else {
        statsMap[sub.problem_code] = {
          id: sub.problem_code,
          title: sub.problem_statement,
          category: sub.category,
          submissionCount: 1,
          assignedCount: 0,
          evaluatedCount: 0,
          totalScoresSum: 0,
          highestScore: 0
        };
      }
    });

    assignments.forEach(a => {
      const sub = submissions.find(s => s.idea_id === a.idea_id);
      if (sub && statsMap[sub.problem_code]) {
        statsMap[sub.problem_code].assignedCount += 1;
      }
    });

    evaluations.forEach(ev => {
      if (statsMap[ev.problem_code]) {
        statsMap[ev.problem_code].evaluatedCount += 1;
        statsMap[ev.problem_code].totalScoresSum += (ev.total_score || 0);
        if ((ev.total_score || 0) > statsMap[ev.problem_code].highestScore) {
          statsMap[ev.problem_code].highestScore = ev.total_score;
        }
      }
    });

    return Object.values(statsMap);
  }, [submissions, assignments, evaluations]);

  // Overall Statistics
  const overallStats = useMemo(() => {
    const totalTeams = teams.length;
    const totalSubmissions = submissions.length;
    const totalEvaluators = evaluators.length;
    const totalEvaluationsDone = evaluations.length;
    const pendingChangeReqs = changeRequests.filter(r => r.status === 'Pending').length;

    let avgScore = 0;
    if (totalEvaluationsDone > 0) {
      const sum = evaluations.reduce((acc, curr) => acc + (curr.total_score || 0), 0);
      avgScore = (sum / totalEvaluationsDone).toFixed(1);
    }

    return { totalTeams, totalSubmissions, totalEvaluators, totalEvaluationsDone, pendingChangeReqs, avgScore };
  }, [teams, submissions, evaluators, evaluations, changeRequests]);

  // Filtered Teams
  const filteredTeams = useMemo(() => {
    if (!searchQuery.trim()) return teams;
    const q = searchQuery.toLowerCase();
    return teams.filter(t =>
      t.id.toLowerCase().includes(q) ||
      t.team_name.toLowerCase().includes(q) ||
      (t.email && t.email.toLowerCase().includes(q))
    );
  }, [teams, searchQuery]);

  // Filtered Submissions for Evaluator Assignment tab
  const visibleSubmissionsForAssignment = useMemo(() => {
    let list = submissions;
    if (selectedPsFilter !== 'ALL') {
      list = list.filter(s => s.problem_code === selectedPsFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(s =>
        s.idea_id.toLowerCase().includes(q) ||
        s.team_id.toLowerCase().includes(q) ||
        s.problem_code.toLowerCase().includes(q) ||
        s.idea_title.toLowerCase().includes(q)
      );
    }
    return list;
  }, [submissions, selectedPsFilter, searchQuery]);

  // Filtered Leaderboard
  const filteredLeaderboard = useMemo(() => {
    let list = evaluations;
    if (selectedPsFilter !== 'ALL') {
      list = list.filter(e => e.problem_code === selectedPsFilter);
    }
    if (selectedEvaluatorFilter !== 'ALL') {
      list = list.filter(e => e.evaluator_email === selectedEvaluatorFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(e =>
        e.idea_id.toLowerCase().includes(q) ||
        e.team_id.toLowerCase().includes(q) ||
        e.problem_code.toLowerCase().includes(q)
      );
    }
    return list;
  }, [evaluations, selectedPsFilter, selectedEvaluatorFilter, searchQuery]);

  // Filtered Change Requests
  const filteredChangeRequests = useMemo(() => {
    if (changeReqStatusFilter === 'ALL') return changeRequests;
    return changeRequests.filter(r => r.status === changeReqStatusFilter);
  }, [changeRequests, changeReqStatusFilter]);

  return (
    <section className="flex flex-col md:flex-row" style={{
      position: 'relative',
      height: '100vh',
      width: '100vw',
      overflow: 'hidden',
      background: '#071728',
      color: '#e2e8f0',
      fontFamily: 'Poppins, sans-serif'
    }}>
      {/* Sidebar Navigation */}
      <nav className="w-full md:w-[270px] h-auto md:h-full overflow-y-auto flex-shrink-0" style={{
        background: '#0a1d33',
        borderRight: '1px solid rgba(255,255,255,0.08)',
        padding: '20px 16px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        zIndex: 10
      }}>
        {/* Header Branding */}
        <div style={{ paddingBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6, marginBottom: 14, background: 'rgba(0,0,0,0.2)', padding: '6px 10px', borderRadius: 8 }}>
            <img src={svhLogo} alt="SVH" style={{ height: 28, width: 'auto', borderRadius: 4 }} />
            <img src={blockchainLogo} alt="BC" style={{ height: 26, width: 'auto' }} />
            <img src={vitbLogo} alt="VITB" style={{ height: 24, width: 'auto' }} />
          </div>

          <div style={{ background: 'rgba(255, 153, 51, 0.08)', border: '1px solid rgba(255, 153, 51, 0.2)', borderRadius: 10, padding: '10px 12px' }}>
            <div style={{ fontSize: 10, color: '#FF9933', textTransform: 'uppercase', letterSpacing: 1, fontFamily: 'Montserrat, sans-serif', fontWeight: 800 }}>
              Super Admin Console
            </div>
            <h2 style={{ color: '#fff', fontSize: 14, fontFamily: 'Montserrat,sans-serif', fontWeight: 800, margin: '2px 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {session ? session.name || session.email : 'Admin'}
            </h2>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>
              Full System Access
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {[
            { id: 'analytics', label: 'Dashboard & Analytics' },
            { id: 'teams', label: 'Teams & Members', count: teams.length },
            { id: 'evaluators', label: 'Evaluators & Assignments', count: evaluators.length },
            { id: 'leaderboard', label: 'PS Scores & Leaderboard', count: evaluations.length },
            { id: 'changeRequests', label: 'Change Requests', count: overallStats.pendingChangeReqs, highlight: overallStats.pendingChangeReqs > 0 },
            { id: 'export', label: 'Export Data Tools' },
            { id: 'emailSender', label: 'Email Broadcaster' }
          ].map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '10px 14px',
                  background: isActive ? 'rgba(255,153,51,0.15)' : 'transparent',
                  color: isActive ? '#FF9933' : 'rgba(255,255,255,0.8)',
                  border: isActive ? '1px solid rgba(255,153,51,0.3)' : '1px solid transparent',
                  borderRadius: 8,
                  cursor: 'pointer',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: 12.5,
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.15s ease'
                }}
              >
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span style={{
                    background: tab.highlight ? 'rgba(239,68,68,0.25)' : isActive ? 'rgba(255,153,51,0.3)' : 'rgba(255,255,255,0.08)',
                    color: tab.highlight ? '#ef4444' : isActive ? '#FF9933' : 'rgba(255,255,255,0.7)',
                    fontSize: 10,
                    fontWeight: 700,
                    padding: '2px 7px',
                    borderRadius: 10
                  }}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer Navigation */}
        <div style={{ marginTop: 'auto', paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button
            onClick={() => navigate('/')}
            style={{ padding: '9px 12px', background: 'rgba(255,255,255,0.04)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 12 }}
          >
            Return to Home
          </button>
          <button
            onClick={handleLogout}
            style={{ padding: '9px 12px', background: 'rgba(255,107,107,0.12)', color: '#ff6b6b', border: '1px solid rgba(255,107,107,0.2)', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 12 }}
          >
            Logout Super Admin
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 p-5 md:p-8 z-10 box-border overflow-y-auto h-full">

        {/* TAB 1: DASHBOARD & ANALYTICS */}
        {activeTab === 'analytics' && (
          <div>
            <h1 style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 800, color: '#fff', fontSize: 24, marginBottom: 20 }}>
              System Overview & Problem Statements Breakdown
            </h1>

            {/* Metric Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 14, marginBottom: 24 }}>
              <div style={{ background: '#0a1d33', border: '1px solid rgba(255,255,255,0.08)', padding: '18px 20px', borderRadius: 12 }}>
                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11, fontWeight: 500 }}>Total Teams Registered</div>
                <div style={{ color: '#FF9933', fontSize: 28, fontWeight: 800, fontFamily: 'Montserrat,sans-serif', marginTop: 2 }}>{overallStats.totalTeams}</div>
              </div>
              <div style={{ background: '#0a1d33', border: '1px solid rgba(255,255,255,0.08)', padding: '18px 20px', borderRadius: 12 }}>
                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11, fontWeight: 500 }}>Total Submissions Recd</div>
                <div style={{ color: '#38bdf8', fontSize: 28, fontWeight: 800, fontFamily: 'Montserrat,sans-serif', marginTop: 2 }}>{overallStats.totalSubmissions}</div>
              </div>
              <div style={{ background: '#0a1d33', border: '1px solid rgba(255,255,255,0.08)', padding: '18px 20px', borderRadius: 12 }}>
                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11, fontWeight: 500 }}>Evaluators Active</div>
                <div style={{ color: '#a78bfa', fontSize: 28, fontWeight: 800, fontFamily: 'Montserrat,sans-serif', marginTop: 2 }}>{overallStats.totalEvaluators}</div>
              </div>
              <div style={{ background: '#0a1d33', border: '1px solid rgba(255,255,255,0.08)', padding: '18px 20px', borderRadius: 12 }}>
                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11, fontWeight: 500 }}>Evaluations Completed</div>
                <div style={{ color: '#4ade80', fontSize: 28, fontWeight: 800, fontFamily: 'Montserrat,sans-serif', marginTop: 2 }}>{overallStats.totalEvaluationsDone}</div>
              </div>
              <div style={{ background: '#0a1d33', border: '1px solid rgba(255,255,255,0.08)', padding: '18px 20px', borderRadius: 12 }}>
                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11, fontWeight: 500 }}>Average Score Given</div>
                <div style={{ color: '#fbbf24', fontSize: 28, fontWeight: 800, fontFamily: 'Montserrat,sans-serif', marginTop: 2 }}>{overallStats.avgScore} <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>/ 50</span></div>
              </div>
            </div>

            {/* Problem Statements Breakdown Table */}
            <div style={{ background: '#0a1d33', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 20 }}>
              <h3 style={{ color: '#fff', fontFamily: 'Montserrat,sans-serif', fontSize: 16, fontWeight: 700, marginBottom: 14 }}>
                Problem Statement Wise Submissions & Evaluations Breakdown
              </h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', color: '#fff', fontSize: 12.5 }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left' }}>
                      <th style={{ padding: '10px 12px', color: '#FF9933' }}>PS Code</th>
                      <th style={{ padding: '10px 12px' }}>Statement Title</th>
                      <th style={{ padding: '10px 12px' }}>Category</th>
                      <th style={{ padding: '10px 12px', textAlign: 'center' }}>Submissions</th>
                      <th style={{ padding: '10px 12px', textAlign: 'center' }}>Assigned</th>
                      <th style={{ padding: '10px 12px', textAlign: 'center' }}>Evaluated</th>
                      <th style={{ padding: '10px 12px', textAlign: 'center' }}>Avg Score</th>
                      <th style={{ padding: '10px 12px', textAlign: 'center' }}>Highest</th>
                    </tr>
                  </thead>
                  <tbody>
                    {psAnalytics.map((ps, idx) => {
                      const avg = ps.evaluatedCount > 0 ? (ps.totalScoresSum / ps.evaluatedCount).toFixed(1) : '-';
                      return (
                        <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                          <td style={{ padding: '10px 12px', fontWeight: 800, fontFamily: 'Courier New, monospace', color: '#FF9933' }}>{ps.id}</td>
                          <td style={{ padding: '10px 12px', fontWeight: 600, maxWidth: 280, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ps.title}</td>
                          <td style={{ padding: '10px 12px', color: 'rgba(255,255,255,0.6)' }}>{ps.category}</td>
                          <td style={{ padding: '10px 12px', textAlign: 'center', fontWeight: 700, color: '#38bdf8' }}>{ps.submissionCount}</td>
                          <td style={{ padding: '10px 12px', textAlign: 'center', color: '#a78bfa' }}>{ps.assignedCount}</td>
                          <td style={{ padding: '10px 12px', textAlign: 'center', color: '#4ade80' }}>{ps.evaluatedCount}</td>
                          <td style={{ padding: '10px 12px', textAlign: 'center', color: '#fbbf24' }}>{avg}</td>
                          <td style={{ padding: '10px 12px', textAlign: 'center', color: '#f472b6' }}>{ps.highestScore || '-'}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TEAMS & MEMBERS */}
        {activeTab === 'teams' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, flexWrap: 'wrap', gap: 12 }}>
              <h1 style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 800, color: '#fff', fontSize: 24, margin: 0 }}>
                All Teams & Member Profiles ({filteredTeams.length})
              </h1>
              <input
                type="text"
                placeholder="Search Team ID, Team Name, Email..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(0,0,0,0.3)', color: '#fff', outline: 'none', width: 260, fontSize: 12 }}
              />
            </div>

            <div style={{ background: '#0a1d33', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 16, overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', color: '#fff', fontSize: 12.5 }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left' }}>
                    <th style={{ padding: '10px 12px', color: '#FF9933' }}>Team ID</th>
                    <th style={{ padding: '10px 12px' }}>Team Name</th>
                    <th style={{ padding: '10px 12px' }}>Leader Email</th>
                    <th style={{ padding: '10px 12px', textAlign: 'center' }}>Members Count</th>
                    <th style={{ padding: '10px 12px', textAlign: 'center' }}>Submissions</th>
                    <th style={{ padding: '10px 12px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTeams.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ padding: '32px 16px', color: 'rgba(255,255,255,0.4)', textAlign: 'center', fontSize: 13 }}>
                        No teams found matching search query.
                      </td>
                    </tr>
                  ) : (
                    filteredTeams.map(t => {
                      const memberCount = profiles.filter(p => p.team_id === t.id).length;
                      const subCount = submissions.filter(s => s.team_id === t.id).length;
                      return (
                        <tr key={t.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                          <td style={{ padding: '10px 12px', fontWeight: 800, fontFamily: 'Courier New, monospace', color: '#FF9933' }}>{t.id}</td>
                          <td style={{ padding: '10px 12px', fontWeight: 700 }}>{t.team_name}</td>
                          <td style={{ padding: '10px 12px', color: 'rgba(255,255,255,0.7)' }}>{t.email || '-'}</td>
                          <td style={{ padding: '10px 12px', textAlign: 'center', fontWeight: 700 }}>{memberCount}</td>
                          <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                            <button
                              onClick={() => openViewSubmissionsModal(t)}
                              style={{ background: 'rgba(56,189,248,0.15)', color: '#38bdf8', border: '1px solid rgba(56,189,248,0.3)', padding: '3px 8px', borderRadius: 6, cursor: 'pointer', fontSize: 11, fontWeight: 700 }}
                            >
                              {subCount} Submissions &rarr;
                            </button>
                          </td>
                          <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                            <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                              <button
                                onClick={() => openViewTeamModal(t)}
                                style={{ background: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid rgba(255,255,255,0.15)', padding: '5px 10px', borderRadius: 6, cursor: 'pointer', fontSize: 11, fontWeight: 600 }}
                              >
                                View Team
                              </button>
                              <button
                                onClick={() => openEditTeamModal(t)}
                                style={{ background: '#FF9933', color: '#000', border: 'none', padding: '5px 10px', borderRadius: 6, cursor: 'pointer', fontSize: 11, fontWeight: 700 }}
                              >
                                Edit Team & Profiles
                              </button>
                              <button
                                onClick={() => handleDeleteTeam(t.id, t.team_name)}
                                style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)', padding: '5px 10px', borderRadius: 6, cursor: 'pointer', fontSize: 11, fontWeight: 600 }}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: EVALUATORS & ASSIGNMENTS */}
        {activeTab === 'evaluators' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, flexWrap: 'wrap', gap: 12 }}>
              <h1 style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 800, color: '#fff', fontSize: 24, margin: 0 }}>
                Evaluators & PS Idea Assignments
              </h1>
              <button
                onClick={() => setShowAddEvalModal(true)}
                style={{ background: '#FF9933', color: '#000', border: 'none', padding: '8px 16px', borderRadius: 8, fontWeight: 700, cursor: 'pointer', fontSize: 12, fontFamily: 'Montserrat,sans-serif' }}
              >
                + Create New Evaluator
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, marginBottom: 24 }}>
              {evaluators.map(ev => {
                const assignedCount = assignments.filter(a => a.evaluator_email === ev.email).length;
                const completedCount = evaluations.filter(e => e.evaluator_email === ev.email).length;
                const isSelected = selectedEvaluator?.email === ev.email;

                return (
                  <div
                    key={ev.id}
                    onClick={() => setSelectedEvaluator(ev)}
                    style={{
                      background: isSelected ? 'rgba(255,153,51,0.1)' : '#0a1d33',
                      border: isSelected ? '1px solid rgba(255,153,51,0.4)' : '1px solid rgba(255,255,255,0.08)',
                      borderRadius: 12,
                      padding: 16,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                      <div>
                        <h3 style={{ margin: 0, color: '#fff', fontSize: 15, fontFamily: 'Montserrat,sans-serif', fontWeight: 700 }}>
                          {ev.name || ev.email}
                        </h3>
                        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, marginTop: 2 }}>{ev.email}</div>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeleteEvaluator(ev.email); }}
                        style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: 12 }}
                      >
                        Delete
                      </button>
                    </div>

                    <div style={{ display: 'flex', gap: 12, marginTop: 12, fontSize: 11 }}>
                      <span style={{ background: 'rgba(255,153,51,0.15)', color: '#FF9933', padding: '3px 8px', borderRadius: 6, fontWeight: 700 }}>
                        Assigned: {assignedCount}
                      </span>
                      <span style={{ background: 'rgba(74,222,128,0.15)', color: '#4ade80', padding: '3px 8px', borderRadius: 6, fontWeight: 700 }}>
                        Evaluated: {completedCount}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Assignment Section for Selected Evaluator */}
            {selectedEvaluator && (
              <div style={{ background: '#0a1d33', border: '1px solid rgba(255,153,51,0.3)', borderRadius: 14, padding: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
                  <div>
                    <h3 style={{ margin: 0, color: '#FF9933', fontFamily: 'Montserrat,sans-serif', fontSize: 16, fontWeight: 800 }}>
                      Assign Problem Ideas to: {selectedEvaluator.name} ({selectedEvaluator.email})
                    </h3>
                    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>
                      Toggle checkboxes to assign/unassign ideas for this evaluator.
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                    <select
                      value={selectedPsFilter}
                      onChange={e => setSelectedPsFilter(e.target.value)}
                      style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(0,0,0,0.3)', color: '#fff', fontSize: 11.5 }}
                    >
                      <option value="ALL" style={{ color: '#000' }}>Filter by All PS Codes</option>
                      {STATEMENTS.map(s => <option key={s.id} value={s.id} style={{ color: '#000' }}>{s.id} - {s.title.substring(0, 35)}...</option>)}
                    </select>

                    <button
                      onClick={() => assignAllVisibleIdeas(selectedEvaluator, visibleSubmissionsForAssignment)}
                      style={{ background: 'rgba(74,222,128,0.15)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.3)', padding: '6px 12px', borderRadius: 6, cursor: 'pointer', fontSize: 11.5, fontWeight: 700 }}
                    >
                      ✓ Select All Visible ({visibleSubmissionsForAssignment.length})
                    </button>
                    <button
                      onClick={() => unassignAllVisibleIdeas(selectedEvaluator, visibleSubmissionsForAssignment)}
                      style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)', padding: '6px 12px', borderRadius: 6, cursor: 'pointer', fontSize: 11.5, fontWeight: 600 }}
                    >
                      ✕ Deselect All Visible
                    </button>
                  </div>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', color: '#fff', fontSize: 12.5 }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left' }}>
                        <th style={{ padding: '8px 12px', textAlign: 'center', width: 40 }}>Assign</th>
                        <th style={{ padding: '8px 12px', color: '#FF9933' }}>Idea ID</th>
                        <th style={{ padding: '8px 12px' }}>Team ID</th>
                        <th style={{ padding: '8px 12px' }}>PS Code</th>
                        <th style={{ padding: '8px 12px' }}>Idea Title</th>
                        <th style={{ padding: '8px 12px' }}>Problem Statement Title</th>
                      </tr>
                    </thead>
                    <tbody>
                      {visibleSubmissionsForAssignment.map(sub => {
                        const assigned = isIdeaAssigned(selectedEvaluator.email, sub.idea_id);
                        return (
                          <tr key={sub.id || sub.idea_id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', background: assigned ? 'rgba(74,222,128,0.04)' : 'transparent' }}>
                            <td style={{ padding: '8px 12px', textAlign: 'center' }}>
                              <input
                                type="checkbox"
                                checked={assigned}
                                onChange={() => toggleAssignment(selectedEvaluator, sub)}
                                style={{ width: 16, height: 16, cursor: 'pointer', accentColor: '#FF9933' }}
                              />
                            </td>
                            <td style={{ padding: '8px 12px', fontWeight: 800, fontFamily: 'Courier New, monospace', color: '#FF9933' }}>{sub.idea_id}</td>
                            <td style={{ padding: '8px 12px', fontWeight: 700 }}>{sub.team_id}</td>
                            <td style={{ padding: '8px 12px', color: '#FF9933', fontWeight: 700 }}>{sub.problem_code}</td>
                            <td style={{ padding: '8px 12px', fontWeight: 600 }}>{sub.idea_title}</td>
                            <td style={{ padding: '8px 12px', color: 'rgba(255,255,255,0.7)', maxWidth: 260, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{sub.problem_statement}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: LEADERBOARD & EVALUATED SCORES */}
        {activeTab === 'leaderboard' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, flexWrap: 'wrap', gap: 12 }}>
              <h1 style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 800, color: '#fff', fontSize: 24, margin: 0 }}>
                PS Scores & Evaluated Leaderboard ({filteredLeaderboard.length})
              </h1>

              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <select
                  value={selectedPsFilter}
                  onChange={e => setSelectedPsFilter(e.target.value)}
                  style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(0,0,0,0.3)', color: '#fff', fontSize: 11.5 }}
                >
                  <option value="ALL" style={{ color: '#000' }}>Filter by All PS Codes</option>
                  {STATEMENTS.map(s => <option key={s.id} value={s.id} style={{ color: '#000' }}>{s.id} - {s.title.substring(0, 35)}...</option>)}
                </select>

                <select
                  value={selectedEvaluatorFilter}
                  onChange={e => setSelectedEvaluatorFilter(e.target.value)}
                  style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(0,0,0,0.3)', color: '#fff', fontSize: 11.5 }}
                >
                  <option value="ALL" style={{ color: '#000' }}>Filter by All Evaluators</option>
                  {evaluators.map(ev => <option key={ev.id} value={ev.email} style={{ color: '#000' }}>{ev.name || ev.email}</option>)}
                </select>
              </div>
            </div>

            <div style={{ background: '#0a1d33', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 16, overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', color: '#fff', fontSize: 12.5 }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left' }}>
                    <th style={{ padding: '10px 12px', color: '#FF9933' }}>Rank</th>
                    <th style={{ padding: '10px 12px' }}>Idea ID</th>
                    <th style={{ padding: '10px 12px' }}>Team ID</th>
                    <th style={{ padding: '10px 12px' }}>PS Code</th>
                    <th style={{ padding: '10px 12px' }}>Problem Title</th>
                    <th style={{ padding: '10px 12px' }}>Evaluator</th>
                    <th style={{ padding: '10px 12px', textAlign: 'center' }}>Breakdown</th>
                    <th style={{ padding: '10px 12px', textAlign: 'center' }}>Total Score</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeaderboard.length === 0 ? (
                    <tr>
                      <td colSpan="8" style={{ padding: '32px 16px', color: 'rgba(255,255,255,0.4)', textAlign: 'center', fontSize: 13 }}>
                        No evaluation scores recorded yet.
                      </td>
                    </tr>
                  ) : (
                    filteredLeaderboard
                      .sort((a, b) => (b.total_score || 0) - (a.total_score || 0))
                      .map((ev, idx) => {
                        const stmt = STATEMENTS.find(s => s.id === ev.problem_code);
                        return (
                          <tr key={ev.id || idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                            <td style={{ padding: '10px 12px', fontWeight: 800, color: idx === 0 ? '#fbbf24' : idx === 1 ? '#94a3b8' : idx === 2 ? '#b45309' : '#fff' }}>
                              #{idx + 1}
                            </td>
                            <td style={{ padding: '10px 12px', fontWeight: 800, fontFamily: 'Courier New, monospace', color: '#FF9933' }}>{ev.idea_id}</td>
                            <td style={{ padding: '10px 12px', fontWeight: 700 }}>{ev.team_id}</td>
                            <td style={{ padding: '10px 12px', color: '#FF9933', fontWeight: 700 }}>{ev.problem_code}</td>
                            <td style={{ padding: '10px 12px', color: 'rgba(255,255,255,0.8)', maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {stmt ? stmt.title : ev.problem_code}
                            </td>
                            <td style={{ padding: '10px 12px', color: 'rgba(255,255,255,0.7)', fontSize: 11.5 }}>{ev.evaluator_email}</td>
                            <td style={{ padding: '10px 12px', textAlign: 'center', fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>
                              A:{ev.alignment_score || 0} | I:{ev.innovation_score || 0} | F:{ev.feasibility_score || 0} | S:{ev.scalability_score || 0} | C:{ev.compliance_score || 0}
                            </td>
                            <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                              <span style={{ background: 'rgba(74,222,128,0.15)', color: '#4ade80', padding: '3px 8px', borderRadius: 6, fontWeight: 800, fontSize: 13 }}>
                                {ev.total_score} / 50
                              </span>
                            </td>
                          </tr>
                        );
                      })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: CHANGE REQUESTS & DIRECT LIVE UPDATES */}
        {activeTab === 'changeRequests' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, flexWrap: 'wrap', gap: 12 }}>
              <h1 style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 800, color: '#fff', fontSize: 24, margin: 0 }}>
                Team Change Requests ({filteredChangeRequests.length})
              </h1>

              <select
                value={changeReqStatusFilter}
                onChange={e => setChangeReqStatusFilter(e.target.value)}
                style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(0,0,0,0.3)', color: '#fff', fontSize: 12 }}
              >
                <option value="ALL" style={{ color: '#000' }}>All Statuses</option>
                <option value="Pending" style={{ color: '#000' }}>Pending</option>
                <option value="Approved" style={{ color: '#000' }}>Approved</option>
                <option value="Rejected" style={{ color: '#000' }}>Rejected</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {filteredChangeRequests.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 20px', background: '#0a1d33', borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>
                  No change requests found.
                </div>
              ) : (
                filteredChangeRequests.map(req => {
                  const payload = parseChangeRequestPayload(req.description);

                  return (
                    <div key={req.id} style={{
                      background: '#0a1d33',
                      border: req.status === 'Pending' ? '1px solid rgba(255,153,51,0.3)' : '1px solid rgba(255,255,255,0.06)',
                      borderRadius: 12,
                      padding: 18
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10, marginBottom: 12 }}>
                        <div>
                          <span style={{ background: 'rgba(255,153,51,0.15)', color: '#FF9933', padding: '3px 8px', borderRadius: 6, fontSize: 11, fontWeight: 700 }}>
                            {req.request_type}
                          </span>
                          <h3 style={{ color: '#fff', margin: '6px 0 2px', fontSize: 15, fontFamily: 'Montserrat,sans-serif', fontWeight: 700 }}>
                            Team: {req.team_name} ({req.team_id})
                          </h3>
                          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>
                            Requested on {new Date(req.created_at).toLocaleString()}
                          </div>
                        </div>
                        <span style={{
                          background: req.status === 'Approved' ? 'rgba(74,222,128,0.15)' : req.status === 'Rejected' ? 'rgba(239,68,68,0.15)' : 'rgba(251,191,36,0.15)',
                          color: req.status === 'Approved' ? '#4ade80' : req.status === 'Rejected' ? '#ef4444' : '#fbbf24',
                          padding: '4px 10px', borderRadius: 8, fontWeight: 700, fontSize: 11, textTransform: 'uppercase'
                        }}>
                          {req.status}
                        </span>
                      </div>

                      {/* Render Structured Before vs After Diff if JSON payload exists */}
                      {payload ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                          {/* Reason Box */}
                          <div style={{ background: 'rgba(255,153,51,0.08)', border: '1px solid rgba(255,153,51,0.2)', padding: 12, borderRadius: 8, color: '#fff', fontSize: 12 }}>
                            <strong style={{ color: '#FF9933', display: 'block', marginBottom: 2 }}>Reason for Request:</strong>
                            {payload.reason}
                          </div>

                          {/* Side-by-side Diff Table */}
                          <div style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, padding: 12, overflowX: 'auto' }}>
                            <h4 style={{ margin: '0 0 8px', color: '#38bdf8', fontSize: 12, fontFamily: 'Montserrat,sans-serif' }}>Proposed Team & Member Profile Changes</h4>
                            <table style={{ width: '100%', borderCollapse: 'collapse', color: '#fff', fontSize: 11.5 }}>
                              <thead>
                                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left', color: 'rgba(255,255,255,0.6)' }}>
                                  <th style={{ padding: '6px' }}>Item / Member</th>
                                  <th style={{ padding: '6px' }}>Current in DB (Before)</th>
                                  <th style={{ padding: '6px', color: '#4ade80' }}>Requested Change (After)</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                                  <td style={{ padding: '6px', fontWeight: 600, color: '#FF9933' }}>Team Name</td>
                                  <td style={{ padding: '6px' }}>{payload.before?.team?.team_name}</td>
                                  <td style={{ padding: '6px', color: payload.before?.team?.team_name !== payload.after?.team?.team_name ? '#4ade80' : '#fff', fontWeight: 700 }}>
                                    {payload.after?.team?.team_name}
                                  </td>
                                </tr>
                                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                                  <td style={{ padding: '6px', fontWeight: 600, color: '#FF9933' }}>Leader Email</td>
                                  <td style={{ padding: '6px' }}>{payload.before?.team?.email || '-'}</td>
                                  <td style={{ padding: '6px', color: payload.before?.team?.email !== payload.after?.team?.email ? '#4ade80' : '#fff', fontWeight: 700 }}>
                                    {payload.after?.team?.email || '-'}
                                  </td>
                                </tr>

                                {payload.after?.members?.map((m, idx) => {
                                  const orig = payload.before?.members?.[idx] || {};
                                  const nameChanged = orig.full_name !== m.full_name;
                                  const phoneChanged = orig.phone !== m.phone;
                                  const emailChanged = orig.email !== m.email;

                                  return (
                                    <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                                      <td style={{ padding: '6px', fontWeight: 600 }}>Member #{idx + 1} {m.is_team_leader ? '(Leader)' : ''}</td>
                                      <td style={{ padding: '6px', color: 'rgba(255,255,255,0.6)' }}>
                                        {orig.full_name || '-'} | {orig.email || '-'} | {orig.phone || '-'} | {orig.gender || '-'} | {orig.registration_number || '-'}
                                      </td>
                                      <td style={{ padding: '6px', color: '#4ade80', fontWeight: 600 }}>
                                        <span style={{ color: nameChanged ? '#4ade80' : '#fff' }}>{m.full_name}</span> | <span style={{ color: emailChanged ? '#4ade80' : '#fff' }}>{m.email}</span> | <span style={{ color: phoneChanged ? '#4ade80' : '#fff' }}>{m.phone}</span> | {m.gender} | {m.registration_number}
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      ) : (
                        <p style={{ color: 'rgba(255,255,255,0.85)', background: 'rgba(0,0,0,0.2)', padding: 12, borderRadius: 8, fontSize: 12.5, whiteSpace: 'pre-wrap', margin: 0, border: '1px solid rgba(255,255,255,0.04)' }}>
                          {req.description}
                        </p>
                      )}

                      {req.admin_notes && (
                        <div style={{ marginTop: 10, color: '#FF9933', fontSize: 12 }}>
                          <strong>Admin Notes:</strong> {req.admin_notes}
                        </div>
                      )}

                      {req.status === 'Pending' && (
                        <div style={{ marginTop: 14, borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 12 }}>
                          {processingRequestId === req.id ? (
                            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                              <input
                                type="text"
                                placeholder="Add admin note..."
                                value={adminNoteInput}
                                onChange={e => setAdminNoteInput(e.target.value)}
                                style={{ flex: '1 1 200px', padding: '8px 12px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(0,0,0,0.3)', color: '#fff', fontSize: 12 }}
                              />
                              <button disabled={actionLoading} onClick={() => handleUpdateChangeRequest(req, 'Approved')} style={{ background: '#4ade80', color: '#000', border: 'none', padding: '8px 14px', borderRadius: 6, fontWeight: 700, cursor: 'pointer', fontSize: 12, fontFamily: 'Montserrat,sans-serif' }}>
                                Approve & Apply Changes to Database
                              </button>
                              <button disabled={actionLoading} onClick={() => handleUpdateChangeRequest(req, 'Rejected')} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: 6, fontWeight: 700, cursor: 'pointer', fontSize: 12, fontFamily: 'Montserrat,sans-serif' }}>
                                Reject Request
                              </button>
                              <button onClick={() => setProcessingRequestId(null)} style={{ background: 'transparent', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.15)', padding: '8px 12px', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button onClick={() => setProcessingRequestId(req.id)} style={{ background: '#FF9933', color: '#000', border: 'none', padding: '8px 16px', borderRadius: 6, fontWeight: 700, cursor: 'pointer', fontSize: 12, fontFamily: 'Montserrat,sans-serif' }}>
                              Respond & Update Request
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* TAB 6: DATA EXPORT TOOLS */}
        {activeTab === 'export' && (
          <div>
            <h1 style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 800, color: '#fff', fontSize: 24, marginBottom: 6 }}>
              Data Export & CSV Reports Generator
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, marginBottom: 22 }}>
              Configure, filter, and export live SVH 2026 data directly as Microsoft Excel-compatible CSV spreadsheets.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 20 }}>
              {/* Step 1: Select Data Source */}
              <div style={{ background: '#0a1d33', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 22 }}>
                <h3 style={{ color: '#FF9933', fontFamily: 'Montserrat,sans-serif', fontSize: 15, fontWeight: 700, margin: '0 0 14px' }}>
                  Step 1: Select Data Source
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
                  {[
                    { id: 'teams_members', label: 'Teams & Member Profiles', desc: 'All registered teams, leader accounts, and group members.', icon: '👥' },
                    { id: 'submissions', label: 'Idea Submissions', desc: 'Round 1 ideas, PS selections, YT links, and PPT attachments.', icon: '💡' },
                    { id: 'evaluations', label: 'Evaluations & Scores', desc: 'Evaluator scorecards, alignment, scalability, and remarks.', icon: '📊' },
                    { id: 'evaluators', label: 'Evaluator Accounts', desc: 'Evaluator system logins, credentials, and names.', icon: '👨‍🏫' },
                  ].map(opt => {
                    const isSelected = exportType === opt.id;
                    return (
                      <div
                        key={opt.id}
                        onClick={() => setExportType(opt.id)}
                        style={{
                          background: isSelected ? 'rgba(255,153,51,0.08)' : 'rgba(0,0,0,0.15)',
                          border: isSelected ? '1.5px solid #FF9933' : '1.5px solid rgba(255,255,255,0.06)',
                          borderRadius: 12, padding: '16px 14px', cursor: 'pointer',
                          transition: 'all 0.2s ease', display: 'flex', gap: 12, alignItems: 'flex-start'
                        }}
                      >
                        <span style={{ fontSize: 24 }}>{opt.icon}</span>
                        <div>
                          <div style={{ fontWeight: 700, color: isSelected ? '#FF9933' : '#fff', fontSize: 13, marginBottom: 4 }}>{opt.label}</div>
                          <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11.5, lineHeight: 1.4 }}>{opt.desc}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Columns & Filters Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
                {/* Columns Selection */}
                <div style={{ background: '#0a1d33', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 22 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                    <h3 style={{ color: '#FF9933', fontFamily: 'Montserrat,sans-serif', fontSize: 15, fontWeight: 700, margin: 0 }}>
                      Step 2: Choose Columns to Export
                    </h3>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        onClick={() => {
                          const updated = {};
                          (COLUMN_DEFINITIONS[exportType] || []).forEach(c => updated[c.id] = true);
                          setSelectedColumns(updated);
                        }}
                        style={{ background: 'transparent', border: 'none', color: '#38bdf8', fontSize: 11.5, fontWeight: 600, cursor: 'pointer' }}
                      >
                        Select All
                      </button>
                      <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 11.5 }}>|</span>
                      <button
                        onClick={() => setSelectedColumns({})}
                        style={{ background: 'transparent', border: 'none', color: '#ff6b6b', fontSize: 11.5, fontWeight: 600, cursor: 'pointer' }}
                      >
                        Clear All
                      </button>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    {(COLUMN_DEFINITIONS[exportType] || []).map(col => (
                      <label
                        key={col.id}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 8,
                          padding: '10px 12px', background: 'rgba(0,0,0,0.15)',
                          borderRadius: 8, border: '1px solid rgba(255,255,255,0.03)',
                          cursor: 'pointer', fontSize: 12, color: selectedColumns[col.id] ? '#fff' : 'rgba(255,255,255,0.55)'
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={!!selectedColumns[col.id]}
                          onChange={e => setSelectedColumns({ ...selectedColumns, [col.id]: e.target.checked })}
                          style={{ accentColor: '#FF9933', width: 15, height: 15, cursor: 'pointer' }}
                        />
                        <span>{col.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Filters Selection */}
                <div style={{ background: '#0a1d33', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 22 }}>
                  <h3 style={{ color: '#FF9933', fontFamily: 'Montserrat,sans-serif', fontSize: 15, fontWeight: 700, margin: '0 0 14px' }}>
                    Step 3: Apply Filters & Search
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div>
                      <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: 11.5, marginBottom: 4 }}>Search Filter</label>
                      <input
                        type="text"
                        placeholder="Search IDs, names, emails..."
                        value={exportSearchQuery}
                        onChange={e => setExportSearchQuery(e.target.value)}
                        style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(0,0,0,0.3)', color: '#fff', fontSize: 12, boxSizing: 'border-box' }}
                      />
                    </div>

                    {(exportType === 'submissions' || exportType === 'evaluations') && (
                      <div>
                        <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: 11.5, marginBottom: 4 }}>Problem Statement Filter</label>
                        <select
                          value={exportPsFilter}
                          onChange={e => setExportPsFilter(e.target.value)}
                          style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(0,0,0,0.3)', color: '#fff', fontSize: 12 }}
                        >
                          <option value="ALL">All Problem Statements</option>
                          {STATEMENTS.map(s => (
                            <option key={s.id} value={s.id} style={{ color: '#000' }}>{s.id} - {s.title.substring(0, 40)}...</option>
                          ))}
                        </select>
                      </div>
                    )}

                    {exportType === 'teams_members' && (
                      <div>
                        <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: 11.5, marginBottom: 4 }}>Gender Filter (Members)</label>
                        <select
                          value={exportGenderFilter}
                          onChange={e => setExportGenderFilter(e.target.value)}
                          style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(0,0,0,0.3)', color: '#fff', fontSize: 12 }}
                        >
                          <option value="ALL">All Genders</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    )}
                  </div>

                  <div style={{ marginTop: 24, borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                      onClick={handleExportCSV}
                      style={{
                        background: 'linear-gradient(135deg, #FF9933 0%, #e07800 100%)',
                        color: '#000', border: 'none', padding: '11px 24px', borderRadius: 8,
                        fontWeight: 800, cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6,
                        boxShadow: '0 4px 14px rgba(255,153,51,0.3)', transition: 'transform 0.2s'
                      }}
                      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                      onMouseLeave={e => e.currentTarget.style.transform = 'none'}
                    >
                      📥 Download Excel / CSV File
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: EMAIL BROADCASTER */}
        {activeTab === 'emailSender' && (
          <div>
            <h1 style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 800, color: '#fff', fontSize: 24, marginBottom: 6 }}>
              Email Broadcaster Portal 📬
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, marginBottom: 22 }}>
              Compose and dispatch custom plain text or HTML formatted emails to specific participant filters, coordinators, or evaluators.
            </p>

            {emailSendStatus && (
              <div style={{
                background: emailSendStatus.success ? 'rgba(74,222,128,0.12)' : 'rgba(239,68,68,0.12)',
                border: emailSendStatus.success ? '1px solid rgba(74,222,128,0.3)' : '1px solid rgba(239,68,68,0.3)',
                color: emailSendStatus.success ? '#4ade80' : '#ef4444',
                padding: '14px 18px', borderRadius: 10, fontSize: 13, marginBottom: 22,
                display: 'flex', alignItems: 'center', gap: 10
              }}>
                <span>{emailSendStatus.success ? '✅' : '⚠️'}</span>
                <span>{emailSendStatus.message}</span>
              </div>
            )}

            <form onSubmit={handleBroadCastEmail} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, alignItems: 'flex-start' }}>
              {/* Left Column: Email Composer */}
              <div style={{ background: '#0a1d33', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 22, display: 'flex', flexDirection: 'column', gap: 16 }}>
                <h3 style={{ color: '#FF9933', fontFamily: 'Montserrat,sans-serif', fontSize: 15, fontWeight: 700, margin: 0 }}>
                  Email Template Composer
                </h3>

                <div>
                  <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: 12, marginBottom: 4, fontWeight: 600 }}>
                    Send To (Primary Visible Recipient) *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. blockchainvitb@gmail.com"
                    value={emailToOverride}
                    onChange={e => setEmailToOverride(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(0,0,0,0.3)', color: '#fff', fontSize: 13, boxSizing: 'border-box', outline: 'none' }}
                  />
                  <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, marginTop: 4 }}>
                    👥 All other selected groups and manual emails will be BCC'd privately.
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: 12, marginBottom: 4, fontWeight: 600 }}>
                    Subject Line *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter email subject..."
                    value={emailSubject}
                    onChange={e => setEmailSubject(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(0,0,0,0.3)', color: '#fff', fontSize: 13, boxSizing: 'border-box', outline: 'none' }}
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: 600 }}>
                      Message Content (Body) *
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5, color: '#FF9933', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={emailIsHtml}
                        onChange={e => setEmailIsHtml(e.target.checked)}
                        style={{ accentColor: '#FF9933', width: 14, height: 14 }}
                      />
                      <span>Format body as HTML Code</span>
                    </label>
                  </div>
                  <textarea
                    required
                    rows="14"
                    placeholder={emailIsHtml ? "<html>\n  <body>\n    <h2>Hello Innovators!</h2>\n    <p>We are glad to announce...</p>\n  </body>\n</html>" : "Write your email message body here..."}
                    value={emailBody}
                    onChange={e => setEmailBody(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(0,0,0,0.3)', color: '#fff', fontSize: 12.5, fontFamily: emailIsHtml ? 'Courier New, monospace' : 'Poppins, sans-serif', boxSizing: 'border-box', outline: 'none', resize: 'vertical', lineHeight: 1.5 }}
                  />
                  <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, marginTop: 4 }}>
                    💡 {emailIsHtml ? 'HTML Mode: Paste full HTML tags, links (<a href="...">), and CSS colors. They will parse and render natively in standard mail boxes.' : 'Plain Text Mode: Raw text content only (no formatting tags).'}
                  </div>

                  <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', background: 'rgba(255,153,51,0.06)', border: '1px solid rgba(255,153,51,0.15)', borderRadius: 8 }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#FF9933', fontWeight: 700, fontSize: 12.5, cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={emailDryRun}
                        onChange={e => setEmailDryRun(e.target.checked)}
                        style={{ accentColor: '#FF9933', width: 16, height: 16 }}
                      />
                      <span>Dry Run Mode (Test/Simulate without sending actual emails)</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Right Column: Audience Routing & Preview */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {/* Routing & Filters Card */}
                <div style={{ background: '#0a1d33', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 22, display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <h3 style={{ color: '#FF9933', fontFamily: 'Montserrat,sans-serif', fontSize: 15, fontWeight: 700, margin: 0 }}>
                    Audience Routing & Constraints
                  </h3>

                  {/* Filter by Problem Statement */}
                  <div>
                    <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: 11.5, marginBottom: 4 }}>
                      Limit by Problem Statement (PS) Selection
                    </label>
                    <select
                      value={emailPsFilter}
                      onChange={e => setEmailPsFilter(e.target.value)}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(0,0,0,0.3)', color: '#fff', fontSize: 12.5 }}
                    >
                      <option value="ALL">All Registered Teams (No PS Filter)</option>
                      {STATEMENTS.map(s => (
                        <option key={s.id} value={s.id} style={{ color: '#000' }}>{s.id} - {s.title.substring(0, 42)}...</option>
                      ))}
                    </select>
                  </div>

                  {/* BCC Targets Checkboxes */}
                  <div>
                    <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: 11.5, marginBottom: 6, fontWeight: 600 }}>
                      BCC Target Groups (Select Multiple)
                    </label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '10px 12px', background: 'rgba(0,0,0,0.2)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#fff', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={bccTargetLeaders}
                          onChange={e => setBccTargetLeaders(e.target.checked)}
                          style={{ accentColor: '#FF9933', width: 15, height: 15 }}
                        />
                        <span>Team Leaders</span>
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#fff', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={bccTargetMembers}
                          onChange={e => setBccTargetMembers(e.target.checked)}
                          style={{ accentColor: '#FF9933', width: 15, height: 15 }}
                        />
                        <span>Group Members (Non-Leaders)</span>
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#fff', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={bccTargetEvaluators}
                          onChange={e => setBccTargetEvaluators(e.target.checked)}
                          style={{ accentColor: '#FF9933', width: 15, height: 15 }}
                        />
                        <span>All Evaluators</span>
                      </label>
                    </div>
                  </div>

                  {/* Manual BCC Inputs */}
                  <div>
                    <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: 11.5, marginBottom: 4, fontWeight: 600 }}>
                      Additional / Manual BCC Emails
                    </label>
                    <textarea
                      rows="3"
                      placeholder="Enter emails separated by commas (e.g. test@gmail.com, admin@vitbhopal.ac.in)..."
                      value={manualBccEmails}
                      onChange={e => setManualBccEmails(e.target.value)}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(0,0,0,0.2)', color: '#fff', fontSize: 12, boxSizing: 'border-box', resize: 'vertical' }}
                    />
                    <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10.5, marginTop: 4 }}>
                      🔒 BCC hides recipient addresses from each other for privacy.
                    </div>
                  </div>
                </div>

                {/* Audience Preview Card */}
                <div style={{ background: '#0a1d33', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 22, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ margin: 0, color: '#4ade80', fontSize: 13, fontFamily: 'Montserrat,sans-serif' }}>
                      BCC Recipients List ({computedBccRecipients.length})
                    </h4>
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>Ready to Dispatch</span>
                  </div>

                  <div style={{
                    maxHeight: 140, overflowY: 'auto', background: 'rgba(0,0,0,0.25)',
                    border: '1px solid rgba(255,255,255,0.05)', borderRadius: 8, padding: 10,
                    fontFamily: 'Courier New, monospace', fontSize: 11, color: 'rgba(255,255,255,0.7)',
                    display: 'flex', flexWrap: 'wrap', gap: 6
                  }}>
                    {computedBccRecipients.length === 0 ? (
                      <span style={{ fontStyle: 'italic', color: 'rgba(255,255,255,0.35)' }}>No target recipients selected or entered.</span>
                    ) : (
                      computedBccRecipients.map((mail, idx) => (
                        <span key={idx} style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)', borderRadius: 4, padding: '2px 5px', color: '#4ade80' }}>
                          {mail}
                        </span>
                      ))
                    )}
                  </div>

                  <div style={{ marginTop: 14, display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                      type="submit"
                      disabled={sendingEmails || computedBccRecipients.length === 0}
                      style={{
                        background: 'linear-gradient(135deg, #4ade80 0%, #16a34a 100%)',
                        color: '#000', border: 'none', padding: '12px 28px', borderRadius: 8,
                        fontWeight: 800, cursor: (sendingEmails || computedBccRecipients.length === 0) ? 'not-allowed' : 'pointer',
                        fontSize: 13, display: 'flex', alignItems: 'center', gap: 6,
                        opacity: (sendingEmails || computedBccRecipients.length === 0) ? 0.6 : 1,
                        boxShadow: '0 4px 14px rgba(74,222,128,0.25)', transition: 'all 0.2s'
                      }}
                    >
                      {sendingEmails ? '⚡ Dispatching Emails...' : '🚀 Broadcast Emails'}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        )}

      </main>

      {/* --- MODAL 1: VIEW TEAM POPUP (TEAM ACCOUNT + ALL MEMBERS) --- */}
      {viewingTeamDetailsModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 99999, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div style={{ background: '#0a1d33', border: '1px solid rgba(255,153,51,0.3)', padding: 24, borderRadius: 16, width: '100%', maxWidth: 700, maxHeight: '85vh', overflowY: 'auto', color: '#fff', fontSize: 12.5 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ margin: 0, color: '#FF9933', fontFamily: 'Montserrat,sans-serif', fontSize: 18, fontWeight: 800 }}>
                Team Overview: {viewingTeamDetailsModal.team.team_name} ({viewingTeamDetailsModal.team.id})
              </h3>
              <button onClick={() => setViewingTeamDetailsModal(null)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 20, cursor: 'pointer' }}>✕</button>
            </div>

            {/* Team Info */}
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: 14, borderRadius: 10, marginBottom: 16, border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10 }}>
                <div><strong>Team ID:</strong> <span style={{ color: '#FF9933', fontFamily: 'Courier New, monospace' }}>{viewingTeamDetailsModal.team.id}</span></div>
                <div><strong>Team Name:</strong> {viewingTeamDetailsModal.team.team_name}</div>
                <div><strong>Leader Email:</strong> {viewingTeamDetailsModal.team.email || '-'}</div>
                <div><strong>Team Password:</strong> {viewingTeamDetailsModal.team.password || '-'}</div>
              </div>
            </div>

            {/* Members Profiles Table */}
            <h4 style={{ margin: '0 0 10px', color: '#4ade80', fontSize: 14, fontFamily: 'Montserrat,sans-serif' }}>
              Linked Team Members ({viewingTeamDetailsModal.members.length})
            </h4>
            {viewingTeamDetailsModal.members.length === 0 ? (
              <p style={{ color: 'rgba(255,255,255,0.5)' }}>No linked member profiles in profiles table.</p>
            ) : (
              <div style={{ overflowX: 'auto', marginBottom: 18 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', color: '#fff', fontSize: 12 }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left', color: 'rgba(255,255,255,0.7)' }}>
                      <th style={{ padding: '8px' }}>Full Name</th>
                      <th style={{ padding: '8px' }}>Role</th>
                      <th style={{ padding: '8px' }}>Email</th>
                      <th style={{ padding: '8px' }}>Phone</th>
                      <th style={{ padding: '8px' }}>Gender</th>
                      <th style={{ padding: '8px' }}>Reg Number</th>
                    </tr>
                  </thead>
                  <tbody>
                    {viewingTeamDetailsModal.members.map(m => (
                      <tr key={m.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <td style={{ padding: '8px', fontWeight: 600 }}>{m.full_name}</td>
                        <td style={{ padding: '8px' }}>
                          <span style={{ background: m.is_team_leader ? 'rgba(255,153,51,0.2)' : 'rgba(255,255,255,0.06)', color: m.is_team_leader ? '#FF9933' : 'rgba(255,255,255,0.7)', padding: '2px 6px', borderRadius: 4, fontSize: 10, fontWeight: 700 }}>
                            {m.is_team_leader ? 'Leader' : 'Member'}
                          </span>
                        </td>
                        <td style={{ padding: '8px', color: 'rgba(255,255,255,0.7)' }}>{m.email || '-'}</td>
                        <td style={{ padding: '8px', color: 'rgba(255,255,255,0.7)' }}>{m.phone || '-'}</td>
                        <td style={{ padding: '8px', color: 'rgba(255,255,255,0.7)' }}>{m.gender || '-'}</td>
                        <td style={{ padding: '8px', color: 'rgba(255,255,255,0.7)' }}>{m.registration_number || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button onClick={() => openEditTeamModal(viewingTeamDetailsModal.team)} style={{ background: '#FF9933', color: '#000', border: 'none', padding: '8px 16px', borderRadius: 6, fontWeight: 700, cursor: 'pointer', fontSize: 12 }}>
                Edit Team & Member Profiles
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 2: EDIT TEAM & ALL MEMBER DETAILS --- */}
      {editingTeamData && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 99999, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <form onSubmit={handleSaveTeamAndMembers} style={{ background: '#0a1d33', border: '1px solid rgba(255,153,51,0.3)', padding: 24, borderRadius: 16, width: '100%', maxWidth: 740, maxHeight: '85vh', overflowY: 'auto', color: '#fff', fontSize: 12.5 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ margin: 0, color: '#FF9933', fontFamily: 'Montserrat,sans-serif', fontSize: 18, fontWeight: 800 }}>
                Edit Team & Member Profiles ({editingTeamData.team.id})
              </h3>
              <button type="button" onClick={() => setEditingTeamData(null)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 20, cursor: 'pointer' }}>✕</button>
            </div>

            {/* Team Credentials Section */}
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: 16, borderRadius: 10, marginBottom: 20, border: '1px solid rgba(255,255,255,0.06)' }}>
              <h4 style={{ margin: '0 0 12px', color: '#38bdf8', fontSize: 14, fontFamily: 'Montserrat,sans-serif' }}>Team Account Details</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', marginBottom: 4, color: 'rgba(255,255,255,0.7)' }}>Team Name</label>
                  <input type="text" value={editingTeamData.team.team_name} onChange={e => setEditingTeamData({ ...editingTeamData, team: { ...editingTeamData.team, team_name: e.target.value } })} style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(0,0,0,0.3)', color: '#fff', fontSize: 12, boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: 4, color: 'rgba(255,255,255,0.7)' }}>Leader Email</label>
                  <input type="email" value={editingTeamData.team.email || ''} onChange={e => setEditingTeamData({ ...editingTeamData, team: { ...editingTeamData.team, email: e.target.value } })} style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(0,0,0,0.3)', color: '#fff', fontSize: 12, boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: 4, color: 'rgba(255,255,255,0.7)' }}>Team Password</label>
                  <input type="text" value={editingTeamData.team.password || ''} onChange={e => setEditingTeamData({ ...editingTeamData, team: { ...editingTeamData.team, password: e.target.value } })} style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(0,0,0,0.3)', color: '#fff', fontSize: 12, boxSizing: 'border-box' }} />
                </div>
              </div>
            </div>

            {/* Team Members Profiles Section */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0 0 12px' }}>
              <h4 style={{ margin: 0, color: '#4ade80', fontSize: 14, fontFamily: 'Montserrat,sans-serif' }}>
                Member Profiles ({editingTeamData.members.length})
              </h4>
              <button
                type="button"
                onClick={() => {
                  const newMember = {
                    id: crypto.randomUUID(),
                    full_name: '',
                    email: '',
                    phone: '',
                    gender: 'Female',
                    registration_number: '',
                    is_team_leader: editingTeamData.members.length === 0,
                    team_id: editingTeamData.team.id
                  };
                  setEditingTeamData({
                    ...editingTeamData,
                    members: [...editingTeamData.members, newMember]
                  });
                }}
                style={{ background: 'rgba(74,222,128,0.15)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.3)', padding: '4px 10px', borderRadius: 6, cursor: 'pointer', fontSize: 11, fontWeight: 700 }}
              >
                + Add Member Slot
              </button>
            </div>

            {editingTeamData.members.length === 0 ? (
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>No linked member profiles in profiles table. Click "+ Add Member Slot" above to add team members.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
                {editingTeamData.members.map((m, idx) => {
                  const setLeaderForMember = (targetIdx) => {
                    const updatedM = editingTeamData.members.map((mem, i) => ({
                      ...mem,
                      is_team_leader: i === targetIdx
                    }));
                    setEditingTeamData({ ...editingTeamData, members: updatedM });
                  };

                  return (
                    <div key={m.id || idx} style={{
                      background: m.is_team_leader ? 'rgba(255,153,51,0.08)' : 'rgba(0,0,0,0.2)',
                      padding: 14,
                      borderRadius: 10,
                      border: m.is_team_leader ? '1px solid rgba(255,153,51,0.3)' : '1px solid rgba(255,255,255,0.06)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                        <div style={{ fontWeight: 700, color: m.is_team_leader ? '#FF9933' : '#fff', fontSize: 12 }}>
                          Member #{idx + 1} {m.is_team_leader ? '(Team Leader)' : ''}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <input
                            type="checkbox"
                            id={`leader_chk_${idx}`}
                            checked={!!m.is_team_leader}
                            onChange={() => setLeaderForMember(idx)}
                            style={{ width: 16, height: 16, cursor: 'pointer', accentColor: '#FF9933' }}
                          />
                          <label htmlFor={`leader_chk_${idx}`} style={{ color: m.is_team_leader ? '#FF9933' : 'rgba(255,255,255,0.7)', fontWeight: m.is_team_leader ? 700 : 500, fontSize: 11.5, cursor: 'pointer' }}>
                            {m.is_team_leader ? '★ Team Leader' : 'Set as Team Leader'}
                          </label>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 10 }}>
                        <div>
                          <label style={{ display: 'block', marginBottom: 2, color: 'rgba(255,255,255,0.6)', fontSize: 11 }}>1. Full Name</label>
                          <input type="text" value={m.full_name || ''} onChange={e => {
                            const updatedM = [...editingTeamData.members];
                            updatedM[idx].full_name = e.target.value;
                            setEditingTeamData({ ...editingTeamData, members: updatedM });
                          }} placeholder="Member full name..." style={{ width: '100%', padding: '6px 8px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(0,0,0,0.3)', color: '#fff', fontSize: 12, boxSizing: 'border-box' }} />
                        </div>
                        <div>
                          <label style={{ display: 'block', marginBottom: 2, color: 'rgba(255,255,255,0.6)', fontSize: 11 }}>2. Email</label>
                          <input type="email" value={m.email || ''} onChange={e => {
                            const updatedM = [...editingTeamData.members];
                            updatedM[idx].email = e.target.value;
                            setEditingTeamData({ ...editingTeamData, members: updatedM });
                          }} placeholder="email@domain.com" style={{ width: '100%', padding: '6px 8px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(0,0,0,0.3)', color: '#fff', fontSize: 12, boxSizing: 'border-box' }} />
                        </div>
                        <div>
                          <label style={{ display: 'block', marginBottom: 2, color: 'rgba(255,255,255,0.6)', fontSize: 11 }}>3. Phone</label>
                          <input type="text" value={m.phone || ''} onChange={e => {
                            const updatedM = [...editingTeamData.members];
                            updatedM[idx].phone = e.target.value;
                            setEditingTeamData({ ...editingTeamData, members: updatedM });
                          }} placeholder="10-digit mobile..." style={{ width: '100%', padding: '6px 8px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(0,0,0,0.3)', color: '#fff', fontSize: 12, boxSizing: 'border-box' }} />
                        </div>
                        <div>
                          <label style={{ display: 'block', marginBottom: 2, color: 'rgba(255,255,255,0.6)', fontSize: 11 }}>4. Gender</label>
                          <select value={m.gender || 'Female'} onChange={e => {
                            const updatedM = [...editingTeamData.members];
                            updatedM[idx].gender = e.target.value;
                            setEditingTeamData({ ...editingTeamData, members: updatedM });
                          }} style={{ width: '100%', padding: '6px 8px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(0,0,0,0.3)', color: '#fff', fontSize: 12, boxSizing: 'border-box' }}>
                            <option value="Female" style={{ color: '#000' }}>Female</option>
                            <option value="Male" style={{ color: '#000' }}>Male</option>
                            <option value="Other" style={{ color: '#000' }}>Other</option>
                          </select>
                        </div>
                        <div>
                          <label style={{ display: 'block', marginBottom: 2, color: 'rgba(255,255,255,0.6)', fontSize: 11 }}>5. Reg Number</label>
                          <input type="text" value={m.registration_number || ''} onChange={e => {
                            const updatedM = [...editingTeamData.members];
                            updatedM[idx].registration_number = e.target.value;
                            setEditingTeamData({ ...editingTeamData, members: updatedM });
                          }} placeholder="23BCE..." style={{ width: '100%', padding: '6px 8px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(0,0,0,0.3)', color: '#fff', fontSize: 12, boxSizing: 'border-box' }} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => setEditingTeamData(null)} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '8px 16px', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>Cancel</button>
              <button disabled={actionLoading} type="submit" style={{ background: '#FF9933', border: 'none', color: '#000', padding: '8px 20px', borderRadius: 6, fontWeight: 700, cursor: 'pointer', fontSize: 12 }}>Save All Changes</button>
            </div>
          </form>
        </div>
      )}

      {/* --- MODAL 3: VIEW SUBMISSIONS FOR A TEAM --- */}
      {viewingSubmissionsModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 99999, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div style={{ background: '#0a1d33', border: '1px solid rgba(255,153,51,0.3)', padding: 24, borderRadius: 16, width: '100%', maxWidth: 680, maxHeight: '85vh', overflowY: 'auto', color: '#fff', fontSize: 12.5 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ margin: 0, color: '#FF9933', fontFamily: 'Montserrat,sans-serif', fontSize: 18, fontWeight: 800 }}>
                Submissions by {viewingSubmissionsModal.team.team_name} ({viewingSubmissionsModal.team.id})
              </h3>
              <button onClick={() => setViewingSubmissionsModal(null)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 20, cursor: 'pointer' }}>✕</button>
            </div>

            {viewingSubmissionsModal.subs.length === 0 ? (
              <p style={{ color: 'rgba(255,255,255,0.5)' }}>No submissions found for this team yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {viewingSubmissionsModal.subs.map((s, idx) => (
                  <div key={s.id || idx} style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,153,51,0.2)', padding: 16, borderRadius: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <span style={{ background: '#FF9933', color: '#000', fontWeight: 800, padding: '2px 8px', borderRadius: 6, fontSize: 11, fontFamily: 'Courier New, monospace' }}>
                        Idea ID: {s.idea_id}
                      </span>
                      <span style={{ color: '#FF9933', fontWeight: 800, fontSize: 12 }}>PS Code: {s.problem_code}</span>
                    </div>
                    <h4 style={{ margin: '0 0 6px', color: '#fff', fontSize: 14 }}>{s.idea_title}</h4>
                    <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', margin: '0 0 8px' }}><strong>Problem:</strong> {s.problem_statement}</p>
                    {s.use_case && <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', margin: '0 0 8px' }}><strong>Real-life Use Case:</strong> {s.use_case}</p>}
                    {s.target_audience && <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', margin: '0 0 8px' }}><strong>Target Audience:</strong> {s.target_audience}</p>}

                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 10 }}>
                      {s.ppt_url && <a href={s.ppt_url} target="_blank" rel="noreferrer" style={{ color: '#4ade80', fontSize: 12, textDecoration: 'none', background: 'rgba(74,222,128,0.15)', padding: '5px 10px', borderRadius: 6, border: '1px solid rgba(74,222,128,0.3)' }}>View PPT Deck (.pdf)</a>}
                      {s.yt_link && <a href={s.yt_link} target="_blank" rel="noreferrer" style={{ color: '#ef4444', fontSize: 12, textDecoration: 'none', background: 'rgba(239,68,68,0.15)', padding: '5px 10px', borderRadius: 6, border: '1px solid rgba(239,68,68,0.3)' }}>YouTube Video</a>}
                      {s.document_link && <a href={s.document_link} target="_blank" rel="noreferrer" style={{ color: '#38bdf8', fontSize: 12, textDecoration: 'none', background: 'rgba(56,189,248,0.15)', padding: '5px 10px', borderRadius: 6, border: '1px solid rgba(56,189,248,0.3)' }}>Drive Document</a>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- MODAL 4: CREATE EVALUATOR MODAL --- */}
      {showAddEvalModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 99999, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <form onSubmit={handleAddEvaluator} style={{ background: '#0a1d33', border: '1px solid rgba(255,153,51,0.3)', padding: 24, borderRadius: 16, width: '100%', maxWidth: 440, color: '#fff', fontSize: 12.5 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ margin: 0, color: '#FF9933', fontFamily: 'Montserrat,sans-serif', fontSize: 16, fontWeight: 800 }}>Create Evaluator Account</h3>
              <button type="button" onClick={() => setShowAddEvalModal(false)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 20, cursor: 'pointer' }}>✕</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
              <div>
                <label style={{ display: 'block', marginBottom: 4, color: 'rgba(255,255,255,0.7)', fontSize: 11 }}>Full Name</label>
                <input type="text" required value={newEvalData.name} onChange={e => setNewEvalData({ ...newEvalData, name: e.target.value })} placeholder="Dr. John Doe" style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(0,0,0,0.3)', color: '#fff', fontSize: 12, boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: 4, color: 'rgba(255,255,255,0.7)', fontSize: 11 }}>Email Address</label>
                <input type="email" required value={newEvalData.email} onChange={e => setNewEvalData({ ...newEvalData, email: e.target.value })} placeholder="evaluator@vitbhopal.ac.in" style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(0,0,0,0.3)', color: '#fff', fontSize: 12, boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: 4, color: 'rgba(255,255,255,0.7)', fontSize: 11 }}>Login Password</label>
                <input type="text" required value={newEvalData.password} onChange={e => setNewEvalData({ ...newEvalData, password: e.target.value })} placeholder="svh2026@evaluator_name" style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(0,0,0,0.3)', color: '#fff', fontSize: 12, boxSizing: 'border-box' }} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => setShowAddEvalModal(false)} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '8px 16px', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>Cancel</button>
              <button disabled={actionLoading} type="submit" style={{ background: '#FF9933', border: 'none', color: '#000', padding: '8px 20px', borderRadius: 6, fontWeight: 700, cursor: 'pointer', fontSize: 12 }}>
                Create Evaluator
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}
