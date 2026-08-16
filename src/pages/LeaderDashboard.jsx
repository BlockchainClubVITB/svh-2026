import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PDFDocument } from 'pdf-lib';
import { supabase } from '../supabaseClient';
import { STATEMENTS } from '../data/problemStatements';

import svhLogo from '../assets/svh.jpeg';
import vitbLogo from '../assets/vitblogo.png';
import blockchainLogo from '../assets/Blockchain.png';

export default function LeaderDashboard() {
  const [teamInfo, setTeamInfo] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('teamDetails');

  // Submission form state
  const [submissionStatus, setSubmissionStatus] = useState('loading');
  const [userSubmissions, setUserSubmissions] = useState([]);
  const [timeLeft, setTimeLeft] = useState(null);

  const [problemCode, setProblemCode] = useState('');
  const [problemTitle, setProblemTitle] = useState('');
  const [theme, setTheme] = useState('');
  const [category, setCategory] = useState('');
  const [ideaTitle, setIdeaTitle] = useState('');
  const [uniqueIdea, setUniqueIdea] = useState('');
  const [ideaDesc, setIdeaDesc] = useState('');
  const [useCase, setUseCase] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [ytLink, setYtLink] = useState('');
  const [documentLink, setDocumentLink] = useState('');
  const [pptFile, setPptFile] = useState(null);
  const [pptUrl, setPptUrl] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Change Request & Team Edit Modal state
  const [teamChangeRequests, setTeamChangeRequests] = useState([]);
  const [editingTeamData, setEditingTeamData] = useState(null);
  const [reasonForEditInput, setReasonForEditInput] = useState('');
  const [submittingRequest, setSubmittingRequest] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const targetDate = new Date('2026-07-20T00:00:00+05:30').getTime();

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        };
      }
      return null;
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchTeamData = async () => {
    setLoading(true);
    setSubmissionStatus('loading');
    try {
      const sessionStr = localStorage.getItem('leader_session');
      if (!sessionStr) {
        navigate('/login');
        return;
      }
      let session = JSON.parse(sessionStr);
      let teamId = session.teamId;

      // Fallback 1: Resolve teamId from teams or profiles table if missing in session
      if (!teamId && session.email) {
        const { data: tData } = await supabase
          .from('teams')
          .select('id, team_name')
          .eq('email', session.email)
          .maybeSingle();

        if (tData) {
          teamId = tData.id;
          session.teamName = tData.team_name || session.teamName;
        } else {
          const { data: pData } = await supabase
            .from('profiles')
            .select('team_id')
            .eq('email', session.email)
            .maybeSingle();

          if (pData) {
            teamId = pData.team_id;
          }
        }

        if (teamId) {
          session.teamId = teamId;
          localStorage.setItem('leader_session', JSON.stringify(session));
        }
      }

      setTeamInfo(session);

      if (teamId) {
        // 1. Fetch team members
        let { data: memData } = await supabase
          .from('profiles')
          .select('*')
          .eq('team_id', teamId);

        // Fallback: If no profiles by team_id, try by email
        if ((!memData || memData.length === 0) && session.email) {
          const { data: memByEmail } = await supabase
            .from('profiles')
            .select('*')
            .eq('email', session.email);
          if (memByEmail && memByEmail.length > 0) {
            memData = memByEmail;
          }
        }

        setMembers(memData || []);

        // 2. Fetch submissions for this team
        const { data: subData } = await supabase
          .from('submissions')
          .select('*')
          .eq('team_id', teamId)
          .order('submitted_at', { ascending: true });

        if (subData && subData.length > 0) {
          setUserSubmissions(subData);
          setSubmissionStatus('submitted');
        } else {
          setUserSubmissions([]);
          setSubmissionStatus('none');
        }

        // 3. Fetch change requests for this team
        const { data: reqData } = await supabase
          .from('change_requests')
          .select('*')
          .eq('team_id', teamId)
          .order('created_at', { ascending: false });

        setTeamChangeRequests(reqData || []);
      } else {
        setMembers([]);
        setUserSubmissions([]);
        setSubmissionStatus('none');
      }
    } catch (err) {
      console.error("Error fetching team data:", err);
      setUserSubmissions([]);
      setSubmissionStatus('none');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamData();
  }, [navigate]);

  // Open interactive Edit Modal
  const openEditModal = () => {
    const leaderMem = members.find(m => m.is_team_leader);
    const leaderEmail = teamInfo?.email || (leaderMem ? leaderMem.email : '');

    setEditingTeamData({
      team: {
        id: teamInfo.teamId,
        team_name: teamInfo.teamName || '',
        email: leaderEmail,
        password: teamInfo.password || ''
      },
      members: members.map(m => ({ ...m }))
    });
    setReasonForEditInput('');
  };

  // Submit Edit Request to Admin with structured JSON payload
  const handleRequestTeamUpdate = async (e) => {
    e.preventDefault();
    if (!editingTeamData) return;
    if (!reasonForEditInput.trim()) {
      alert('Please state a reason for updating your team details.');
      return;
    }

    let membersToSave = [...editingTeamData.members];
    const hasLeader = membersToSave.some(m => m.is_team_leader);
    if (!hasLeader && membersToSave.length > 0) {
      membersToSave[0].is_team_leader = true;
    }

    setSubmittingRequest(true);
    try {
      const payloadData = {
        reason: reasonForEditInput,
        before: {
          team: {
            id: teamInfo.teamId,
            team_name: teamInfo.teamName || '',
            email: teamInfo.email || '',
            password: teamInfo.password || ''
          },
          members: members.map(m => ({ ...m }))
        },
        after: {
          team: {
            id: teamInfo.teamId,
            team_name: editingTeamData.team.team_name,
            email: editingTeamData.team.email,
            password: editingTeamData.team.password
          },
          members: membersToSave
        }
      };

      const payload = {
        team_id: teamInfo.teamId,
        team_name: editingTeamData.team.team_name || teamInfo.teamId,
        request_type: 'Update Team & Member Details',
        description: JSON.stringify(payloadData),
        status: 'Pending'
      };

      const { error } = await supabase
        .from('change_requests')
        .insert([payload]);

      if (error) throw error;

      setEditingTeamData(null);
      setRequestSuccess('Change request submitted successfully to Admin! Admin will review the proposed changes and update the database.');
      await fetchTeamData();
      setActiveTab('changeRequest');
    } catch (err) {
      alert(`Error submitting request: ${err.message}`);
    } finally {
      setSubmittingRequest(false);
    }
  };

  const handleProblemCodeChange = (e) => {
    const code = e.target.value;
    setProblemCode(code);
    const stmt = STATEMENTS.find(s => s.id === code);
    if (stmt) {
      setProblemTitle(stmt.title);
      setTheme(stmt.theme);
      setCategory(stmt.category);
    } else {
      setProblemTitle('');
      setTheme('');
      setCategory('');
    }
  };

  const handleProblemTitleChange = (e) => {
    const title = e.target.value;
    setProblemTitle(title);
    const stmt = STATEMENTS.find(s => s.title === title);
    if (stmt) {
      setProblemCode(stmt.id);
      setTheme(stmt.theme);
      setCategory(stmt.category);
    } else {
      setProblemCode('');
      setTheme('');
      setCategory('');
    }
  };

  const handlePptFileSelect = async (e) => {
    setSubmitError('');
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      setSubmitError('Invalid file type! Upload .pdf file only. Convert your Canva made PPTs to .pdf');
      setPptFile(null);
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      setSubmitError('File size exceeds the 20MB limit. Please compress your PDF file.');
      setPptFile(null);
      return;
    }

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const numPages = pdfDoc.getPageCount();
      if (numPages > 6) {
        setSubmitError(`Your PDF has ${numPages} pages. Your presentation must contain 6 pages or under.`);
        setPptFile(null);
        return;
      }
      setPptFile(file);
      setSubmitError('');
    } catch (err) {
      console.error('PDF parsing error:', err);
      setSubmitError('Failed to read PDF file. Please ensure it is a valid, unencrypted PDF.');
      setPptFile(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    if (userSubmissions.length >= 2) {
      setSubmitError('You have already reached the maximum limit of 2 submissions per team.');
      return;
    }
    if (!problemCode || !problemTitle || !theme || !category || !ideaTitle || !uniqueIdea || !ideaDesc || !useCase || !targetAudience) {
      setSubmitError('Please fill in all required fields.');
      return;
    }
    setSubmitting(true);
    try {
      let finalPptUrl = pptUrl;

      if (pptFile) {
        const reader = new FileReader();
        const fileBase64 = await new Promise((resolve, reject) => {
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(pptFile);
        });

        const fileName = `${teamInfo.teamId}_sub${userSubmissions.length + 1}_${(teamInfo.teamName || 'team').replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
        const appsScriptUrl = import.meta.env.VITE_APPS_SCRIPT_URL;

        let uploadRes;
        let uploadData = {};

        if (appsScriptUrl) {
          // Direct browser to Apps Script upload to bypass Vercel's 4.5MB payload limit
          uploadRes = await fetch(appsScriptUrl, {
            method: 'POST',
            body: JSON.stringify({
              fileBase64: fileBase64,
              fileName: fileName,
              folderId: '1vJgSd32NJWReqzMc4SzI-3oV7ykRQ0G3'
            })
          });

          if (!uploadRes.ok) {
            throw new Error(`Direct Google Drive upload returned HTTP ${uploadRes.status}`);
          }

          const scriptData = await uploadRes.json();
          if (!scriptData.success) {
            throw new Error(scriptData.message || 'Failed to upload PDF via Google Apps Script.');
          }

          uploadData = { pdfUrl: scriptData.pdfUrl };
        } else {
          // Fallback to Vercel api upload (subject to Vercel's 4.5MB limit)
          uploadRes = await fetch('/api/uploadPdf', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              fileBase64: fileBase64,
              fileName: fileName,
              teamId: teamInfo.teamId,
            }),
          });

          const contentType = uploadRes.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            uploadData = await uploadRes.json();
          } else {
            const rawText = await uploadRes.text();
            throw new Error(rawText || `Upload endpoint returned HTTP ${uploadRes.status}`);
          }

          if (!uploadRes.ok) {
            throw new Error(uploadData.message || 'Failed to upload presentation to Google Drive.');
          }
        }

        finalPptUrl = uploadData.pdfUrl;
      }

      const generatedIdeaId = `${teamInfo.teamId}-${userSubmissions.length + 1}`;

      const payload = {
        idea_id: generatedIdeaId,
        team_id: teamInfo.teamId,
        problem_code: problemCode,
        problem_statement: problemTitle,
        theme: theme,
        category: category,
        idea_title: ideaTitle,
        unique_idea: uniqueIdea,
        idea_description: ideaDesc,
        use_case: useCase,
        target_audience: targetAudience,
        yt_link: ytLink || null,
        document_link: documentLink || null,
        ppt_url: finalPptUrl || null
      };

      const { data: insertedData, error } = await supabase
        .from('submissions')
        .insert([payload])
        .select();

      if (error) throw error;

      const newSubmissionRecord = (insertedData && insertedData[0]) ? insertedData[0] : payload;
      const updatedList = [...userSubmissions, newSubmissionRecord];
      setUserSubmissions(updatedList);
      setSubmissionStatus('submitted');

      setProblemCode('');
      setProblemTitle('');
      setTheme('');
      setCategory('');
      setIdeaTitle('');
      setUseCase('');
      setTargetAudience('');
      setUniqueIdea('');
      setIdeaDesc('');
      setYtLink('');
      setDocumentLink('');
      setPptFile(null);

      setActiveTab('review');
    } catch (err) {
      console.error("Submission error:", err);
      setSubmitError(err.message || 'Error submitting your idea.');
    } finally {
      setSubmitting(false);
    }
  };

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
        {/* Logos & Team Header */}
        <div style={{ paddingBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6, marginBottom: 14, background: 'rgba(0,0,0,0.2)', padding: '6px 10px', borderRadius: 8 }}>
            <img src={svhLogo} alt="SVH" style={{ height: 28, width: 'auto', borderRadius: 4 }} />
            <img src={blockchainLogo} alt="BC" style={{ height: 26, width: 'auto' }} />
            <img src={vitbLogo} alt="VITB" style={{ height: 24, width: 'auto' }} />
          </div>

          <div style={{ background: 'rgba(255, 153, 51, 0.08)', border: '1px solid rgba(255, 153, 51, 0.2)', borderRadius: 10, padding: '10px 12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <div style={{ fontSize: 10, color: '#FF9933', textTransform: 'uppercase', letterSpacing: 1, fontFamily: 'Montserrat, sans-serif', fontWeight: 800 }}>
                Team Portal
              </div>
              {teamInfo?.teamId && (
                <span style={{ background: '#FF9933', color: '#000', fontSize: 10, fontWeight: 900, fontFamily: 'Courier New, monospace', padding: '2px 6px', borderRadius: 4 }}>
                  {teamInfo.teamId}
                </span>
              )}
            </div>
            <h2 style={{ color: '#fff', fontSize: 14, fontFamily: 'Montserrat,sans-serif', fontWeight: 800, margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {teamInfo ? teamInfo.teamName || 'Your Team' : 'Loading...'}
            </h2>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>
              Leader: {teamInfo ? teamInfo.leaderName || 'Team Leader' : ''}
            </div>
          </div>
          <div style={{ background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.25)', borderRadius: 8, padding: '8px 10px', marginTop: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 13 }}>🚀</span>
            <span style={{ color: '#4ade80', fontSize: 10.5, fontWeight: 700, fontFamily: 'Montserrat, sans-serif' }}>
              PPT Evaluation Completed — Finals Ready
            </span>
          </div>
        </div>

        {/* Sidebar Nav Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {[
            { id: 'teamDetails', label: 'Team Details', count: members.length },
            { id: 'review', label: 'Review Submissions', count: userSubmissions.length },
            { id: 'changeRequest', label: 'Change Requests', count: teamChangeRequests.length },
            { id: 'contacts', label: 'Contact Support' }
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
                    background: tab.highlight ? 'rgba(255,153,51,0.25)' : isActive ? 'rgba(255,153,51,0.3)' : 'rgba(255,255,255,0.08)',
                    color: tab.highlight ? '#FF9933' : isActive ? '#FF9933' : 'rgba(255,255,255,0.7)',
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
            onClick={() => { localStorage.removeItem('leader_session'); navigate('/'); }}
            style={{ padding: '9px 12px', background: 'rgba(255,107,107,0.12)', color: '#ff6b6b', border: '1px solid rgba(255,107,107,0.2)', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 12 }}
          >
            Logout Account
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 p-5 md:p-8 z-10 box-border overflow-y-auto h-full">
        {/* TAB 1: TEAM DETAILS */}
        {activeTab === 'teamDetails' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, flexWrap: 'wrap', gap: 12 }}>
              <h1 style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 800, color: '#fff', fontSize: 24, margin: 0 }}>
                Team & Member Profiles ({members.length})
              </h1>
              <button
                onClick={openEditModal}
                style={{
                  background: '#FF9933',
                  color: '#000',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: 8,
                  fontSize: 12,
                  fontFamily: 'Montserrat,sans-serif',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Edit Team & Request Update &rarr;
              </button>
            </div>

            {loading ? (
              <p style={{ color: 'rgba(255,255,255,0.6)' }}>Loading team data...</p>
            ) : (
              <div style={{ background: '#0a1d33', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 16, overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', color: '#fff', fontSize: 12.5 }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left' }}>
                      <th style={{ padding: '10px 12px', color: '#FF9933' }}>Full Name</th>
                      <th style={{ padding: '10px 12px' }}>Role</th>
                      <th style={{ padding: '10px 12px' }}>Email ID</th>
                      <th style={{ padding: '10px 12px' }}>Mobile Number</th>
                      <th style={{ padding: '10px 12px' }}>Gender</th>
                      <th style={{ padding: '10px 12px' }}>Reg Number</th>
                    </tr>
                  </thead>
                  <tbody>
                    {members.length === 0 ? (
                      <tr>
                        <td colSpan="6" style={{ padding: '24px 12px', color: 'rgba(255,255,255,0.4)', textAlign: 'center', fontSize: 13 }}>
                          No team members found.
                        </td>
                      </tr>
                    ) : (
                      members.map((member, idx) => (
                        <tr key={member.id || idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                          <td style={{ padding: '12px', color: '#fff', fontWeight: 600 }}>{member.full_name || 'Unnamed'}</td>
                          <td style={{ padding: '12px' }}>
                            {member.is_team_leader ? (
                              <span style={{ background: 'rgba(255,153,51,0.2)', color: '#FF9933', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 6 }}>Team Leader</span>
                            ) : (
                              <span style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.7)', fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 6 }}>Member</span>
                            )}
                          </td>
                          <td style={{ padding: '12px', color: 'rgba(255,255,255,0.7)' }}>
                            {member.email || '-'}
                          </td>
                          <td style={{ padding: '12px', color: 'rgba(255,255,255,0.7)', fontFamily: 'Courier New, monospace' }}>
                            {member.phone || '-'}
                          </td>
                          <td style={{ padding: '12px', color: 'rgba(255,255,255,0.7)' }}>{member.gender || '-'}</td>
                          <td style={{ padding: '12px', color: 'rgba(255,255,255,0.7)' }}>{member.registration_number || '-'}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: SUBMISSION */}
        {/* TAB 2: SUBMISSION (CLOSED) */}
        {activeTab === 'submission' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, flexWrap: 'wrap', gap: 12 }}>
              <h1 style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 800, color: '#fff', fontSize: 24, margin: 0 }}>
                Problem Statement Submission
              </h1>
              <span style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)', padding: '5px 12px', borderRadius: 8, fontSize: 12, fontWeight: 700 }}>
                Submission Phase Closed
              </span>
            </div>

            <div style={{ padding: '50px 20px', textAlign: 'center', background: '#0a1d33', borderRadius: 14, border: '1px solid rgba(255,153,51,0.2)' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
              <h3 style={{ margin: '0 0 8px', color: '#fff', fontFamily: 'Montserrat,sans-serif', fontSize: 22, fontWeight: 800 }}>
                PPT Submission Phase is Closed
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, margin: '0 auto 20px', maxWidth: 520, lineHeight: 1.6 }}>
                The Round 1 PPT submission deadline was <strong>10th August 2026 (11:59 PM)</strong>. Idea submissions are now closed as our judging panel evaluates all submitted presentations.
              </p>
              <div style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.3)', padding: '12px 20px', borderRadius: 8, display: 'inline-block', color: '#4ade80', fontSize: 13, fontWeight: 600, marginBottom: 20 }}>
                🚀 PPT Evaluation Phase Completed! Finalist Teams Ready for Grand Finale (24 – 25 Aug 2026)
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
                <button onClick={() => setActiveTab('review')} style={{ background: '#FF9933', color: '#000', padding: '10px 24px', borderRadius: 8, border: 'none', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                  Review Submissions &rarr;
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: REVIEW SUBMISSIONS */}
        {activeTab === 'review' && (
          <div>
            <h1 style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 800, color: '#fff', fontSize: 24, marginBottom: 18 }}>
              Review Submissions ({userSubmissions.length})
            </h1>

            {submissionStatus === 'loading' ? (
              <p style={{ color: 'rgba(255,255,255,0.6)' }}>Loading...</p>
            ) : userSubmissions.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                {userSubmissions.map((sub, index) => (
                  <div key={sub.id || index} style={{ background: '#0a1d33', border: '1px solid rgba(255,153,51,0.2)', padding: 20, borderRadius: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, flexWrap: 'wrap', gap: 8 }}>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <span style={{ background: '#FF9933', color: '#000', fontWeight: 800, padding: '2px 8px', borderRadius: 6, fontSize: 11, fontFamily: 'Courier New, monospace' }}>
                          Idea ID: {sub.idea_id || `${sub.team_id}-${index + 1}`}
                        </span>
                        <span style={{ color: '#FF9933', fontWeight: 800, fontSize: 12 }}>{sub.problem_code}</span>
                      </div>
                      {sub.submitted_at && <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>Submitted on {new Date(sub.submitted_at).toLocaleDateString()}</span>}
                    </div>

                    <h3 style={{ margin: '0 0 8px', color: '#fff', fontSize: 16, fontWeight: 700, fontFamily: 'Montserrat, sans-serif' }}>{sub.idea_title}</h3>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10, margin: '10px 0', padding: '10px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.05)', fontSize: 12 }}>
                      <div><strong>Problem Statement:</strong> <span style={{ color: 'rgba(255,255,255,0.8)' }}>{sub.problem_statement}</span></div>
                      <div><strong>Theme:</strong> <span style={{ color: '#FF9933' }}>{sub.theme || '-'}</span></div>
                      <div><strong>Category:</strong> <span style={{ color: '#FF9933' }}>{sub.category || '-'}</span></div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 12, borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 12 }}>
                      {sub.use_case && (
                        <div>
                          <strong style={{ color: '#4ade80', display: 'block', fontSize: 12, fontWeight: 700 }}>Real-life Use Case:</strong>
                          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', margin: '2px 0 0 0', whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>{sub.use_case}</p>
                        </div>
                      )}
                      {sub.target_audience && (
                        <div>
                          <strong style={{ color: '#38bdf8', display: 'block', fontSize: 12, fontWeight: 700 }}>Target Audience & Stakeholders:</strong>
                          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', margin: '2px 0 0 0', whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>{sub.target_audience}</p>
                        </div>
                      )}
                      {sub.unique_idea && (
                        <div>
                          <strong style={{ color: '#a78bfa', display: 'block', fontSize: 12, fontWeight: 700 }}>Unique Idea & Innovation:</strong>
                          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', margin: '2px 0 0 0', whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>{sub.unique_idea}</p>
                        </div>
                      )}
                      {sub.idea_description && (
                        <div>
                          <strong style={{ color: '#fbbf24', display: 'block', fontSize: 12, fontWeight: 700 }}>Detailed Description & Solution Architecture:</strong>
                          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', margin: '2px 0 0 0', whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>{sub.idea_description}</p>
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 16, borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 12 }}>
                      {sub.ppt_url && <a href={sub.ppt_url} target="_blank" rel="noreferrer" style={{ color: '#4ade80', fontSize: 12, textDecoration: 'none', background: 'rgba(74,222,128,0.15)', padding: '5px 10px', borderRadius: 6, border: '1px solid rgba(74,222,128,0.3)', fontWeight: 600 }}>View Presentation PPT</a>}
                      {sub.yt_link && <a href={sub.yt_link} target="_blank" rel="noreferrer" style={{ color: '#ef4444', fontSize: 12, textDecoration: 'none', background: 'rgba(239,68,68,0.15)', padding: '5px 10px', borderRadius: 6, border: '1px solid rgba(239,68,68,0.3)', fontWeight: 600 }}>YouTube Video</a>}
                      {sub.document_link && <a href={sub.document_link} target="_blank" rel="noreferrer" style={{ color: '#38bdf8', fontSize: 12, textDecoration: 'none', background: 'rgba(56,189,248,0.15)', padding: '5px 10px', borderRadius: 6, border: '1px solid rgba(56,189,248,0.3)', fontWeight: 600 }}>Drive Document</a>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ padding: '40px 20px', textAlign: 'center', background: '#0a1d33', borderRadius: 14, color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>
                No submissions found for your team yet.
              </div>
            )}
          </div>
        )}

        {/* TAB 4: CHANGE REQUESTS & QUERIES */}
        {activeTab === 'changeRequest' && (
          <div>
            <h1 style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 800, color: '#fff', fontSize: 24, marginBottom: 18 }}>
              Team Detail Update Requests ({teamChangeRequests.length})
            </h1>

            {/* Coordinator Contact Notice Box */}
            <div style={{ background: '#0a1d33', border: '1px solid rgba(56,189,248,0.3)', borderRadius: 12, padding: '16px 20px', color: '#bae6fd', fontSize: 12.5, lineHeight: 1.5, marginBottom: 20 }}>
              <strong style={{ color: '#38bdf8', display: 'block', marginBottom: 4, fontFamily: 'Montserrat,sans-serif', fontSize: 13.5 }}>
                📌 Support Policy & Coordinator Contact
              </strong>
              Only team detail updates (team name, member profile changes) can be requested through this portal. For any urgent submission issues, technical support, or general hackathon queries, please contact the team directly via the official <strong>WhatsApp Group</strong> or reach out to your designated <strong>Event Coordinators</strong>.
            </div>

            {requestSuccess && (
              <div style={{ background: 'rgba(74,222,128,0.15)', border: '1px solid #4ade80', color: '#4ade80', padding: '10px 14px', borderRadius: 8, fontSize: 12, marginBottom: 16 }}>
                {requestSuccess}
              </div>
            )}

            {/* Raised Requests Table */}
            <div style={{ background: '#0a1d33', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 16, overflowX: 'auto' }}>
              {teamChangeRequests.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '32px 16px', color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>
                  No change requests raised yet. Use "Edit Team & Request Update" under Team Details tab to submit a request.
                </div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', color: '#fff', fontSize: 12.5 }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left' }}>
                      <th style={{ padding: '10px 12px', color: '#FF9933' }}>Request Type</th>
                      <th style={{ padding: '10px 12px' }}>Reason & Proposed Details</th>
                      <th style={{ padding: '10px 12px', textAlign: 'center' }}>Status</th>
                      <th style={{ padding: '10px 12px' }}>Admin Response</th>
                      <th style={{ padding: '10px 12px' }}>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teamChangeRequests.map(req => {
                      let displayDesc = req.description;
                      try {
                        if (req.description && req.description.trim().startsWith('{')) {
                          const p = JSON.parse(req.description);
                          displayDesc = `Reason: ${p.reason}\n\nProposed Team Name: ${p.after?.team?.team_name}\nMembers Count: ${p.after?.members?.length}`;
                        }
                      } catch (e) {}

                      return (
                        <tr key={req.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                          <td style={{ padding: '12px', fontWeight: 700, color: '#FF9933' }}>{req.request_type}</td>
                          <td style={{ padding: '12px', whiteSpace: 'pre-wrap', color: 'rgba(255,255,255,0.85)', fontSize: 11.5 }}>{displayDesc}</td>
                          <td style={{ padding: '12px', textAlign: 'center' }}>
                            <span style={{
                              background: req.status === 'Approved' ? 'rgba(74,222,128,0.15)' : req.status === 'Rejected' ? 'rgba(239,68,68,0.15)' : 'rgba(251,191,36,0.15)',
                              color: req.status === 'Approved' ? '#4ade80' : req.status === 'Rejected' ? '#ef4444' : '#fbbf24',
                              padding: '3px 8px', borderRadius: 6, fontWeight: 700, fontSize: 11, textTransform: 'uppercase'
                            }}>
                              {req.status}
                            </span>
                          </td>
                          <td style={{ padding: '12px', color: '#FF9933', fontSize: 11.5 }}>{req.admin_notes || '-'}</td>
                          <td style={{ padding: '12px', color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>{new Date(req.created_at).toLocaleDateString()}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* TAB 5: CONTACTS */}
        {activeTab === 'contacts' && (
          <div>
            <h1 style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 800, color: '#fff', fontSize: 22, marginBottom: 6 }}>Contact Support</h1>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, marginBottom: 22 }}>Reach out for queries related to SVH 2026. For team detail changes, use the Change Requests tab.</p>

            <div style={{ background: '#0a1d33', border: '1px solid rgba(56,189,248,0.2)', borderRadius: 12, padding: '14px 18px', color: '#bae6fd', fontSize: 12.5, lineHeight: 1.6, marginBottom: 22 }}>
              <strong style={{ color: '#38bdf8', display: 'block', marginBottom: 3, fontSize: 13 }}>📌 Note</strong>
              Only team detail update requests can be raised via the portal. For any other queries — submission help, technical issues, or general questions — contact the team directly on WhatsApp.
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
              {/* General Queries */}
              <div style={{ background: '#0a1d33', border: '1px solid rgba(19,136,8,0.25)', borderRadius: 14, padding: '20px' }}>
                <h3 style={{ color: '#4ade80', fontFamily: 'Montserrat,sans-serif', fontSize: 14, fontWeight: 800, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 7 }}>
                  <span style={{ width: 4, height: 16, background: '#4ade80', borderRadius: 2, display: 'inline-block' }} />
                  General Queries
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    { name: 'Ayush Tiwari', phone: '8962301907', email: 'ayush.24mei10025@vitbhopal.ac.in' },
                    { name: 'Dhairya Gothi', phone: '9424065768', email: 'dhairya.23bce10225@vitbhopal.ac.in' },
                    { name: 'Mrityunjay Singh', phone: '9555410587', email: 'mrityunjay.23bce10008@vitbhopal.ac.in' },
                  ].map((c, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: 'rgba(74,222,128,0.05)', border: '1px solid rgba(74,222,128,0.15)', borderRadius: 10, flexWrap: 'wrap', gap: 8 }}>
                      <div>
                        <div style={{ fontWeight: 700, color: '#fff', fontSize: 13 }}>{c.name}</div>
                        <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11 }}>{c.email}</div>
                      </div>
                      <a href={`https://wa.me/91${c.phone}`} target="_blank" rel="noopener noreferrer"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 10px', background: 'rgba(37,211,102,0.12)', border: '1px solid rgba(37,211,102,0.3)', borderRadius: 16, color: '#25D366', fontSize: 11, textDecoration: 'none', fontWeight: 700, whiteSpace: 'nowrap' }}>
                        💬 {c.phone}
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              {/* Technical Queries */}
              <div style={{ background: '#0a1d33', border: '1px solid rgba(255,153,51,0.25)', borderRadius: 14, padding: '20px' }}>
                <h3 style={{ color: '#FF9933', fontFamily: 'Montserrat,sans-serif', fontSize: 14, fontWeight: 800, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 7 }}>
                  <span style={{ width: 4, height: 16, background: '#FF9933', borderRadius: 2, display: 'inline-block' }} />
                  Technical Queries
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    { name: 'Abhilash', phone: '9511454951', email: null },
                    { name: 'Soumya', phone: '9332404107', email: null },
                    { name: 'Dhairya Gothi', phone: '9424065768', email: 'dhairya.23bce10225@vitbhopal.ac.in' },
                  ].map((c, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: 'rgba(255,153,51,0.05)', border: '1px solid rgba(255,153,51,0.15)', borderRadius: 10, flexWrap: 'wrap', gap: 8 }}>
                      <div>
                        <div style={{ fontWeight: 700, color: '#fff', fontSize: 13 }}>{c.name}</div>
                        {c.email && <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11 }}>{c.email}</div>}
                      </div>
                      <a href={`https://wa.me/91${c.phone}`} target="_blank" rel="noopener noreferrer"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 10px', background: 'rgba(37,211,102,0.12)', border: '1px solid rgba(37,211,102,0.3)', borderRadius: 16, color: '#25D366', fontSize: 11, textDecoration: 'none', fontWeight: 700, whiteSpace: 'nowrap' }}>
                        💬 {c.phone}
                      </a>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: 16, padding: '12px 14px', background: 'rgba(255,153,51,0.07)', border: '1px solid rgba(255,153,51,0.2)', borderRadius: 10, fontSize: 12, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>
                  <strong style={{ color: '#FF9933' }}>WhatsApp Group</strong> — For the fastest response, join the official SVH 2026 group:
                  <br />
                  <a href="https://chat.whatsapp.com/L7lXF9VZQRDCx0aXXwBhGw?s=sw&p=a&mlu=2" target="_blank" rel="noopener noreferrer"
                    style={{ color: '#25D366', textDecoration: 'none', fontWeight: 600, fontSize: 11.5 }}>Join Official WhatsApp Group →</a>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* --- INTERACTIVE EDIT TEAM & MEMBERS MODAL FOR LEADER --- */}
      {editingTeamData && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 99999, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <form onSubmit={handleRequestTeamUpdate} style={{ background: '#0a1d33', border: '1px solid rgba(255,153,51,0.3)', padding: 24, borderRadius: 16, width: '100%', maxWidth: 740, maxHeight: '88vh', overflowY: 'auto', color: '#fff', fontSize: 12.5 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <h3 style={{ margin: 0, color: '#FF9933', fontFamily: 'Montserrat,sans-serif', fontSize: 18, fontWeight: 800 }}>
                  Edit Team & Member Details ({editingTeamData.team.id})
                </h3>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>Proposed updates will be sent to Hackathon Admins for approval.</div>
              </div>
              <button type="button" onClick={() => setEditingTeamData(null)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 20, cursor: 'pointer' }}>✕</button>
            </div>

            {/* Team Account Details */}
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: 14, borderRadius: 10, marginBottom: 16, border: '1px solid rgba(255,255,255,0.06)' }}>
              <h4 style={{ margin: '0 0 10px', color: '#38bdf8', fontSize: 13, fontFamily: 'Montserrat,sans-serif' }}>Team Account Details</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10 }}>
                <div>
                  <label style={{ display: 'block', marginBottom: 2, color: 'rgba(255,255,255,0.7)', fontSize: 11 }}>Team Name</label>
                  <input type="text" value={editingTeamData.team.team_name} onChange={e => setEditingTeamData({ ...editingTeamData, team: { ...editingTeamData.team, team_name: e.target.value } })} style={{ width: '100%', padding: '6px 8px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(0,0,0,0.3)', color: '#fff', fontSize: 12, boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: 2, color: 'rgba(255,255,255,0.7)', fontSize: 11 }}>Leader Email (Frozen)</label>
                  <input type="email" value={editingTeamData.team.email || ''} readOnly disabled style={{ width: '100%', padding: '6px 8px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.5)', color: 'rgba(255,255,255,0.5)', fontSize: 12, boxSizing: 'border-box', cursor: 'not-allowed' }} />
                </div>
              </div>
            </div>

            {/* Member Profiles Section */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0 0 10px' }}>
              <h4 style={{ margin: 0, color: '#4ade80', fontSize: 13, fontFamily: 'Montserrat,sans-serif' }}>Member Profiles ({editingTeamData.members.length})</h4>
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

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
              {editingTeamData.members.map((m, idx) => {
                const setLeaderForMember = (targetIdx) => {
                  const updatedM = editingTeamData.members.map((mem, i) => ({
                    ...mem,
                    is_team_leader: i === targetIdx
                  }));
                  setEditingTeamData({ ...editingTeamData, members: updatedM });
                };

                return (
                  <div key={m.id || idx} style={{ background: m.is_team_leader ? 'rgba(255,153,51,0.08)' : 'rgba(0,0,0,0.2)', padding: 12, borderRadius: 8, border: m.is_team_leader ? '1px solid rgba(255,153,51,0.3)' : '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <div style={{ fontWeight: 700, color: m.is_team_leader ? '#FF9933' : '#fff', fontSize: 11.5 }}>
                        Member #{idx + 1} {m.is_team_leader ? '(Team Leader)' : ''}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <input
                          type="checkbox"
                          id={`ldr_chk_${idx}`}
                          checked={!!m.is_team_leader}
                          onChange={() => setLeaderForMember(idx)}
                          style={{ width: 15, height: 15, cursor: 'pointer', accentColor: '#FF9933' }}
                        />
                        <label htmlFor={`ldr_chk_${idx}`} style={{ color: m.is_team_leader ? '#FF9933' : 'rgba(255,255,255,0.7)', fontWeight: m.is_team_leader ? 700 : 500, fontSize: 11, cursor: 'pointer' }}>
                          {m.is_team_leader ? '★ Team Leader' : 'Set as Leader'}
                        </label>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 8 }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: 2, color: 'rgba(255,255,255,0.6)', fontSize: 10.5 }}>Full Name</label>
                        <input type="text" value={m.full_name || ''} onChange={e => {
                          const updatedM = [...editingTeamData.members];
                          updatedM[idx].full_name = e.target.value;
                          setEditingTeamData({ ...editingTeamData, members: updatedM });
                        }} style={{ width: '100%', padding: '5px 7px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(0,0,0,0.3)', color: '#fff', fontSize: 11.5, boxSizing: 'border-box' }} />
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: 2, color: 'rgba(255,255,255,0.6)', fontSize: 10.5 }}>Email</label>
                        <input type="email" value={m.email || ''} onChange={e => {
                          const updatedM = [...editingTeamData.members];
                          updatedM[idx].email = e.target.value;
                          setEditingTeamData({ ...editingTeamData, members: updatedM });
                        }} style={{ width: '100%', padding: '5px 7px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(0,0,0,0.3)', color: '#fff', fontSize: 11.5, boxSizing: 'border-box' }} />
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: 2, color: 'rgba(255,255,255,0.6)', fontSize: 10.5 }}>Phone</label>
                        <input type="text" value={m.phone || ''} onChange={e => {
                          const updatedM = [...editingTeamData.members];
                          updatedM[idx].phone = e.target.value;
                          setEditingTeamData({ ...editingTeamData, members: updatedM });
                        }} style={{ width: '100%', padding: '5px 7px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(0,0,0,0.3)', color: '#fff', fontSize: 11.5, boxSizing: 'border-box' }} />
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: 2, color: 'rgba(255,255,255,0.6)', fontSize: 10.5 }}>Gender</label>
                        <select value={m.gender || 'Female'} onChange={e => {
                          const updatedM = [...editingTeamData.members];
                          updatedM[idx].gender = e.target.value;
                          setEditingTeamData({ ...editingTeamData, members: updatedM });
                        }} style={{ width: '100%', padding: '5px 7px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(0,0,0,0.3)', color: '#fff', fontSize: 11.5, boxSizing: 'border-box' }}>
                          <option value="Female" style={{ color: '#000' }}>Female</option>
                          <option value="Male" style={{ color: '#000' }}>Male</option>
                          <option value="Other" style={{ color: '#000' }}>Other</option>
                        </select>
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: 2, color: 'rgba(255,255,255,0.6)', fontSize: 10.5 }}>Reg Number</label>
                        <input type="text" value={m.registration_number || ''} onChange={e => {
                          const updatedM = [...editingTeamData.members];
                          updatedM[idx].registration_number = e.target.value;
                          setEditingTeamData({ ...editingTeamData, members: updatedM });
                        }} style={{ width: '100%', padding: '5px 7px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(0,0,0,0.3)', color: '#fff', fontSize: 11.5, boxSizing: 'border-box' }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Reason for Change */}
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: 'block', marginBottom: 4, color: '#FF9933', fontSize: 12, fontWeight: 700 }}>Reason for Change Request *</label>
              <textarea
                rows="2"
                required
                value={reasonForEditInput}
                onChange={e => setReasonForEditInput(e.target.value)}
                placeholder="State the reason why you are requesting to update these team details..."
                style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid rgba(255,153,51,0.3)', background: 'rgba(0,0,0,0.3)', color: '#fff', fontSize: 12, outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => setEditingTeamData(null)} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '8px 16px', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>Cancel</button>
              <button disabled={submittingRequest} type="submit" style={{ background: '#FF9933', border: 'none', color: '#000', padding: '8px 20px', borderRadius: 6, fontWeight: 700, cursor: 'pointer', fontSize: 12 }}>
                {submittingRequest ? 'Submitting...' : 'Submit Proposed Changes to Admin'}
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}
