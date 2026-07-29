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

        const uploadRes = await fetch('/api/uploadPdf', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fileBase64: fileBase64,
            fileName: `${teamInfo.teamId}_sub${userSubmissions.length + 1}_${(teamInfo.teamName || 'team').replace(/[^a-zA-Z0-9]/g, '_')}.pdf`,
            teamId: teamInfo.teamId,
          }),
        });

        const contentType = uploadRes.headers.get('content-type');
        let uploadData = {};
        if (contentType && contentType.includes('application/json')) {
          uploadData = await uploadRes.json();
        } else {
          const rawText = await uploadRes.text();
          throw new Error(rawText || `Upload endpoint returned HTTP ${uploadRes.status}`);
        }

        if (!uploadRes.ok) {
          throw new Error(uploadData.message || 'Failed to upload presentation to Google Drive.');
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
        </div>

        {/* Sidebar Nav Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {[
            { id: 'teamDetails', label: 'Team Details', count: members.length },
            { id: 'submission', label: 'Submit Idea', count: `${userSubmissions.length}/2`, highlight: userSubmissions.length < 2 },
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
        {activeTab === 'submission' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, flexWrap: 'wrap', gap: 12 }}>
              <h1 style={{ fontFamily: 'Montserrat,sans-serif', fontWeight: 800, color: '#fff', fontSize: 24, margin: 0 }}>
                Problem Statement Submission
              </h1>
              <span style={{ background: 'rgba(255,153,51,0.15)', color: '#FF9933', border: '1px solid rgba(255,153,51,0.3)', padding: '5px 12px', borderRadius: 8, fontSize: 12, fontWeight: 700 }}>
                {userSubmissions.length} of 2 Submissions Completed
              </span>
            </div>

            {submissionStatus === 'loading' ? (
              <p style={{ color: 'rgba(255,255,255,0.6)' }}>Loading...</p>
            ) : userSubmissions.length >= 2 ? (
              <div style={{ padding: '40px 20px', textAlign: 'center', background: '#0a1d33', borderRadius: 14, border: '1px solid rgba(74,222,128,0.3)' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🎉</div>
                <h3 style={{ margin: '0 0 8px', color: '#4ade80', fontFamily: 'Montserrat,sans-serif', fontSize: 20, fontWeight: 800 }}>
                  Maximum Submissions Reached (2 / 2)
                </h3>
                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, margin: '0 auto 16px', maxWidth: 480 }}>
                  Your team has submitted the maximum allowed 2 problem statements. You can review both of your submitted ideas in the <strong>Review Submissions</strong> tab.
                </p>
                <button onClick={() => setActiveTab('review')} style={{ background: '#FF9933', color: '#000', padding: '8px 20px', borderRadius: 8, border: 'none', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
                  Review Submissions &rarr;
                </button>
              </div>
            ) : timeLeft ? (
              <div style={{ padding: '50px 20px', textAlign: 'center', background: '#0a1d33', borderRadius: 14, border: '1px solid rgba(255,153,51,0.2)' }}>
                <div style={{ fontSize: 40, marginBottom: 16 }}>⏳</div>
                <h3 style={{ margin: '0 0 8px', color: '#fff', fontFamily: 'Montserrat,sans-serif', fontSize: 20, fontWeight: 700 }}>
                  Submissions Open Soon
                </h3>
                <p style={{ color: 'rgba(255,255,255,0.6)', margin: '0 auto 24px', fontSize: 13, maxWidth: 450 }}>
                  PPT submissions will begin on 20th July 2026. Get your ideas ready!
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 14, flexWrap: 'wrap' }}>
                  {Object.entries(timeLeft).map(([unit, value]) => (
                    <div key={unit} style={{ background: 'rgba(0,0,0,0.3)', padding: '12px 16px', borderRadius: 8, minWidth: 70, border: '1px solid rgba(255,153,51,0.2)' }}>
                      <div style={{ color: '#FF9933', fontSize: 24, fontWeight: 800, fontFamily: 'Montserrat,sans-serif' }}>
                        {value.toString().padStart(2, '0')}
                      </div>
                      <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, textTransform: 'uppercase', marginTop: 2 }}>
                        {unit}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16, background: '#0a1d33', border: '1px solid rgba(255,153,51,0.15)', borderRadius: 14, padding: 24 }}>
                {/* Warning Banner */}
                <div style={{ background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 8, padding: '12px 16px', color: '#fca5a5', fontSize: 12.5, lineHeight: 1.5, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 20, flexShrink: 0 }}>⚠️</span>
                  <div>
                    <strong style={{ color: '#ef4444', display: 'block', fontSize: 13, textTransform: 'uppercase' }}>Warning: Submissions are final & uneditable</strong>
                    Once an idea is submitted, it <strong>cannot be edited or updated</strong>. Please double-check all problem statements, presentation slides, and URLs carefully before submitting!
                  </div>
                </div>

                {/* Genuine Thoughts / AI Notice Banner */}
                <div style={{ background: 'rgba(255, 153, 51, 0.1)', border: '1px solid rgba(255, 153, 51, 0.3)', borderRadius: 8, padding: '14px 18px', color: '#ffedd5', fontSize: 13, lineHeight: 1.6, display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <span style={{ fontSize: 22, flexShrink: 0 }}>💡</span>
                  <div>
                    <strong style={{ color: '#FF9933', display: 'block', fontSize: 13.5, marginBottom: 2, fontFamily: 'Montserrat,sans-serif' }}>Express Your Authentic Thoughts</strong>
                    Please write your solution descriptions, use cases, and innovation details in your own words based on your actual knowledge and ideas. Avoid using AI tools to copy-paste generated text — our judges want to understand your team's genuine perspective and creative problem-solving approach!
                  </div>
                </div>

                {submitError && <div style={{ padding: 10, background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #ef4444', color: '#ef4444', borderRadius: 8, fontSize: 12 }}>{submitError}</div>}

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontWeight: 600, fontSize: 12, color: '#fff', marginBottom: 4 }}>Select PS Code *</label>
                    <select value={problemCode} onChange={handleProblemCodeChange} required style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(0,0,0,0.3)', color: '#fff', fontSize: 12 }}>
                      <option value="" style={{ color: '#000' }}>Choose PS Code...</option>
                      {STATEMENTS.map(s => <option key={s.id} value={s.id} style={{ color: '#000' }}>{s.id} - {s.title.substring(0, 45)}...</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontWeight: 600, fontSize: 12, color: '#fff', marginBottom: 4 }}>Select PS Title *</label>
                    <select value={problemTitle} onChange={handleProblemTitleChange} required style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(0,0,0,0.3)', color: '#fff', fontSize: 12 }}>
                      <option value="" style={{ color: '#000' }}>Choose PS Title...</option>
                      {STATEMENTS.map(s => <option key={s.id} value={s.title} style={{ color: '#000' }}>{s.title}</option>)}
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontWeight: 600, fontSize: 12, color: '#fff', marginBottom: 4 }}>Theme</label>
                    <input type="text" value={theme} readOnly style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.4)', color: '#FF9933', fontSize: 12, boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontWeight: 600, fontSize: 12, color: '#fff', marginBottom: 4 }}>Category</label>
                    <input type="text" value={category} readOnly style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.4)', color: '#FF9933', fontSize: 12, boxSizing: 'border-box' }} />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: 600, fontSize: 12, color: '#fff', marginBottom: 4 }}>Idea Title *</label>
                  <input type="text" value={ideaTitle} onChange={e => setIdeaTitle(e.target.value)} required placeholder="Short catchy title..." style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(0,0,0,0.3)', color: '#fff', fontSize: 12, boxSizing: 'border-box' }} />
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: 600, fontSize: 12, color: '#fff', marginBottom: 4 }}>Real-life Use Case *</label>
                  <textarea rows="2" value={useCase} onChange={e => setUseCase(e.target.value)} required placeholder="Explain real-world usage..." style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(0,0,0,0.3)', color: '#fff', fontSize: 12, boxSizing: 'border-box' }} />
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: 600, fontSize: 12, color: '#fff', marginBottom: 4 }}>Target Audience & Stakeholders *</label>
                  <textarea rows="2" value={targetAudience} onChange={e => setTargetAudience(e.target.value)} required placeholder="Who will benefit?" style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(0,0,0,0.3)', color: '#fff', fontSize: 12, boxSizing: 'border-box' }} />
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: 600, fontSize: 12, color: '#fff', marginBottom: 4 }}>Unique Idea & Innovation *</label>
                  <textarea rows="2" value={uniqueIdea} onChange={e => setUniqueIdea(e.target.value)} required placeholder="What makes your solution unique?" style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(0,0,0,0.3)', color: '#fff', fontSize: 12, boxSizing: 'border-box' }} />
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: 600, fontSize: 12, color: '#fff', marginBottom: 4 }}>Detailed Description of Solution *</label>
                  <textarea rows="3" value={ideaDesc} onChange={e => setIdeaDesc(e.target.value)} required placeholder="Explain technical architecture and workflow..." style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(0,0,0,0.3)', color: '#fff', fontSize: 12, boxSizing: 'border-box' }} />
                </div>

                {/* Upload PPT File (.pdf only, max 6 pages) */}
                <div>
                  <label style={{ display: 'block', fontWeight: 600, fontSize: 12, color: '#fff', marginBottom: 4 }}>Upload Presentation Deck (.pdf only, max 6 pages)</label>
                  <div style={{ border: '1.5px dashed rgba(255,153,51,0.3)', borderRadius: 8, padding: '16px', textAlign: 'center', background: 'rgba(0,0,0,0.2)' }}>
                    <input type="file" accept=".pdf,application/pdf" onChange={handlePptFileSelect} style={{ display: 'none' }} id="ppt-file-upload" />
                    <label htmlFor="ppt-file-upload" style={{ cursor: 'pointer', display: 'block' }}>
                      <div style={{ color: '#fff', fontWeight: 600, fontSize: 12.5 }}>
                        {pptFile ? `Selected: ${pptFile.name}` : 'Click to select .pdf presentation file'}
                      </div>
                      <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, marginTop: 2 }}>
                        Must be a PDF document &middot; Up to 20MB &middot; Max 6 pages
                      </div>
                    </label>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontWeight: 600, fontSize: 12, color: '#fff', marginBottom: 4 }}>YouTube Link (Optional)</label>
                    <input type="url" value={ytLink} onChange={e => setYtLink(e.target.value)} placeholder="https://youtube.com/..." style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(0,0,0,0.3)', color: '#fff', fontSize: 12, boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontWeight: 600, fontSize: 12, color: '#fff', marginBottom: 4 }}>Drive Doc Link (Optional)</label>
                    <input type="url" value={documentLink} onChange={e => setDocumentLink(e.target.value)} placeholder="https://drive.google.com/..." style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(0,0,0,0.3)', color: '#fff', fontSize: 12, boxSizing: 'border-box' }} />
                  </div>
                </div>

                <button disabled={submitting} type="submit" style={{ background: '#FF9933', color: '#000', padding: '10px 24px', borderRadius: 8, border: 'none', fontWeight: 700, fontSize: 13, cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.7 : 1, alignSelf: 'flex-start' }}>
                  {submitting ? 'Submitting...' : `Submit Idea (Submission #${userSubmissions.length + 1})`}
                </button>
              </form>
            )}
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

                    <h3 style={{ margin: '0 0 6px', color: '#fff', fontSize: 16 }}>{sub.idea_title}</h3>
                    <p style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.8)', margin: '0 0 8px' }}><strong>Problem:</strong> {sub.problem_statement}</p>
                    {sub.use_case && <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', margin: '0 0 6px' }}><strong>Use Case:</strong> {sub.use_case}</p>}
                    {sub.target_audience && <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', margin: '0 0 10px' }}><strong>Target Audience:</strong> {sub.target_audience}</p>}

                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 10 }}>
                      {sub.ppt_url && <a href={sub.ppt_url} target="_blank" rel="noreferrer" style={{ color: '#4ade80', fontSize: 12, textDecoration: 'none', background: 'rgba(74,222,128,0.15)', padding: '5px 10px', borderRadius: 6, border: '1px solid rgba(74,222,128,0.3)' }}>View Presentation PPT</a>}
                      {sub.yt_link && <a href={sub.yt_link} target="_blank" rel="noreferrer" style={{ color: '#ef4444', fontSize: 12, textDecoration: 'none', background: 'rgba(239,68,68,0.15)', padding: '5px 10px', borderRadius: 6, border: '1px solid rgba(239,68,68,0.3)' }}>YouTube Video</a>}
                      {sub.document_link && <a href={sub.document_link} target="_blank" rel="noreferrer" style={{ color: '#38bdf8', fontSize: 12, textDecoration: 'none', background: 'rgba(56,189,248,0.15)', padding: '5px 10px', borderRadius: 6, border: '1px solid rgba(56,189,248,0.3)' }}>Drive Document</a>}
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
