import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, Download, FileText, CheckCircle, Sparkles, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import toast, { Toaster } from 'react-hot-toast';

const CertificateDownload = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [participantData, setParticipantData] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // 1. Verify user email against 'profiles' (and fallbacks)
  const handleVerifyEmail = async () => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      toast.error('Please enter your registered email address');
      return;
    }

    setIsVerifying(true);
    setParticipantData(null);

    try {
      // Step A: Query 'profiles' table
      const { data: profileData } = await supabase
        .from('profiles')
        .select(`
          *,
          teams (
            team_name
          )
        `)
        .ilike('email', cleanEmail)
        .maybeSingle();

      if (profileData) {
        const teamName = profileData.teams
          ? (Array.isArray(profileData.teams) ? profileData.teams[0]?.team_name : profileData.teams.team_name)
          : profileData.team_name;

        const resolvedName = profileData.full_name || profileData.name || 'Participant';
        setParticipantData({
          name: resolvedName,
          teamname: teamName || '',
          email: profileData.email || cleanEmail
        });
        toast.success(`Verified: ${resolvedName}`);
        return;
      }

      // Step B: Fallback to 'svh-certificate-participants' table
      const { data: certData } = await supabase
        .from('svh-certificate-participants')
        .select('name, teamname, email')
        .ilike('email', cleanEmail)
        .maybeSingle();

      if (certData) {
        setParticipantData({
          name: certData.name,
          teamname: certData.teamname || '',
          email: certData.email || cleanEmail
        });
        toast.success(`Verified: ${certData.name}`);
        return;
      }

      // Step C: Fallback to 'app_users'
      const { data: appUserData } = await supabase
        .from('app_users')
        .select('full_name, email')
        .ilike('email', cleanEmail)
        .maybeSingle();

      if (appUserData) {
        setParticipantData({
          name: appUserData.full_name,
          teamname: '',
          email: appUserData.email || cleanEmail
        });
        toast.success(`Verified: ${appUserData.full_name}`);
        return;
      }

      toast.error('User not found in records. Please check your email address.');
    } catch (err) {
      console.error('Verification error:', err);
      toast.error('An unexpected error occurred during verification');
    } finally {
      setIsVerifying(false);
    }
  };

  // 2. Download Certificate PDF from backend API
  const handleDownloadPDF = async () => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      toast.error('Please enter your email address first');
      return;
    }

    setIsDownloading(true);
    const toastId = toast.loading('Generating your certificate PDF...');

    try {
      const response = await fetch('/api/downloadCertificate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: cleanEmail }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to download certificate');
      }

      // Read PDF stream blob
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      // Trigger automatic browser file download
      const safeName = (participantData?.name || 'Participant').replace(/[^a-zA-Z0-9_-]/g, '_');
      const a = document.createElement('a');
      a.href = url;
      a.download = `Certificate_${safeName}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      toast.success('Certificate downloaded successfully!', { id: toastId });
    } catch (err) {
      console.error('Download certificate error:', err);
      toast.error(err.message || 'Error downloading certificate PDF', { id: toastId });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-slate-50 via-gray-50 to-amber-50/20 pt-28 pb-16 px-4 relative overflow-hidden font-poppins">
      {/* Toast Notification Container */}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3500,
          style: {
            background: '#0f2942',
            color: '#ffffff',
            border: '1px solid rgba(255, 153, 51, 0.4)',
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: 600,
          },
          success: {
            iconTheme: {
              primary: '#FF9933',
              secondary: '#ffffff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#ffffff',
            },
          },
        }}
      />

      {/* Patriotic Gradient Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-r from-orange-400/10 via-amber-300/5 to-emerald-400/10 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/')}
          className="mb-8 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-slate-200 text-[#0f2942] font-semibold text-sm font-montserrat shadow-sm hover:border-[#FF9933] hover:text-[#FF9933] hover:shadow-md transition-all duration-300 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Home</span>
        </motion.button>

        {/* Header Section */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-[#FF9933]/30 text-[#FF9933] text-xs font-bold font-montserrat tracking-wide uppercase mb-4"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>SMART VIT HACKATHON 2026</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black font-montserrat text-[#0f2942] tracking-tight mb-4"
          >
            Download <span className="bg-gradient-to-r from-[#FF9933] to-[#e07800] bg-clip-text text-transparent">Certificate</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-600 max-w-2xl mx-auto text-sm sm:text-base font-normal leading-relaxed"
          >
            Enter your registered email address to authenticate your participation and download your official SVH 2026 Certificate of Appreciation
          </motion.p>
        </div>

        {/* Main Grid Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Left Column: Email Verification Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-montserrat text-[#0f2942] mb-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-[#FF9933]">
                  <Award className="w-5 h-5" />
                </div>
                <span>Participant Authentication</span>
              </h2>

              <div className="space-y-5">
                <div>
                  <label className="block text-[#0f2942] font-semibold font-montserrat mb-2 text-sm">
                    Registered Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleVerifyEmail()}
                      placeholder="Enter your registered email address"
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-[#0f2942] placeholder-slate-400 font-medium focus:outline-none focus:border-[#FF9933] focus:ring-2 focus:ring-[#FF9933]/20 transition-all text-sm"
                    />
                  </div>
                </div>

                {/* Verify Email Button */}
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={handleVerifyEmail}
                  disabled={!email.trim() || isVerifying}
                  className={`
                    w-full py-3.5 rounded-xl font-bold font-montserrat text-sm
                    transition-all duration-300 flex items-center justify-center gap-2 shadow-md
                    ${email.trim() && !isVerifying
                      ? 'bg-gradient-to-r from-[#0f2942] to-[#1a3f6f] text-white hover:shadow-lg hover:shadow-[#0f2942]/30'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                    }
                  `}
                >
                  {isVerifying ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      <span>Verify Email</span>
                    </>
                  )}
                </motion.button>

                {/* Info / Warning Banner */}
                {!participantData && (
                  <div className="p-4 bg-amber-50/60 border border-dashed border-[#FF9933]/30 rounded-xl flex gap-3 items-start text-xs text-amber-800 font-medium leading-relaxed font-poppins">
                    <span className="text-base leading-none">⚠️</span>
                    <div>
                      <strong>Verification Note:</strong> Enter the exact email address registered in your profile to retrieve your certificate.
                    </div>
                  </div>
                )}

                {/* Verified Participant Card */}
                {participantData && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-5 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2"
                  >
                    <p className="text-emerald-800 font-bold font-montserrat text-xs uppercase tracking-wider flex items-center gap-1.5 mb-1">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <span>Participant Verified</span>
                    </p>
                    <div className="text-sm text-slate-700 font-medium space-y-1">
                      <p><span className="text-slate-500 font-normal">Participant Name:</span> <strong className="text-[#0f2942]">{participantData.name}</strong></p>
                      {participantData.teamname && (
                        <p><span className="text-slate-500 font-normal">Team Name:</span> <strong className="text-[#0f2942]">{participantData.teamname}</strong></p>
                      )}
                      <p><span className="text-slate-500 font-normal">Email:</span> {participantData.email}</p>
                    </div>
                  </motion.div>
                )}

                {/* Download Certificate Action Button */}
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={handleDownloadPDF}
                  disabled={!participantData || isDownloading}
                  className={`
                    w-full py-4 rounded-xl font-bold font-montserrat text-sm sm:text-base
                    transition-all duration-300 flex items-center justify-center gap-2 shadow-md
                    ${participantData && !isDownloading
                      ? 'bg-gradient-to-r from-[#FF9933] to-[#e07800] text-white hover:shadow-xl hover:shadow-orange-500/30'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                    }
                  `}
                >
                  {isDownloading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Generating PDF Certificate...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5" />
                      <span>Download Certificate (PDF)</span>
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Dynamic Certificate Preview Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 flex flex-col"
          >
            <h2 className="text-xl sm:text-2xl font-bold font-montserrat text-[#0f2942] mb-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-[#138808]">
                <FileText className="w-5 h-5" />
              </div>
              <span>Certificate Live Preview</span>
            </h2>

            <div className="flex-1 flex flex-col justify-center items-center p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
              <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200 max-w-full bg-white">
                <img
                  src="/scratch/svh-certificate-participation.pdf.png"
                  alt="Certificate Template Preview"
                  className="w-auto h-auto max-w-full max-h-[380px] block rounded-2xl object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />

                {/* Overlaid exact text positioned cleanly above dotted line in preview */}
                {participantData && (
                  <div
                    className="absolute pointer-events-none select-none drop-shadow-sm"
                    style={{
                      top: '53.8%',
                      left: '14.6%',
                      right: '25%',
                      color: '#0f2942',
                      fontFamily: '"Times New Roman", Times, Georgia, serif',
                      fontWeight: 700,
                      fontStyle: 'italic',
                      fontSize: 'clamp(11px, 2.2vw, 24px)',
                      lineHeight: 1.1,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {participantData.name} {participantData.teamname ? `(Team : ${participantData.teamname})` : ''}
                  </div>
                )}
              </div>

              {!participantData && (
                <p className="text-slate-500 text-xs sm:text-sm font-medium mt-4 text-center">
                  Verify your email to preview your personalized certificate details before downloading.
                </p>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CertificateDownload;
