import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Upload, User, Mail, Download, FileImage, FileText, X, CheckCircle, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import toast, { Toaster } from 'react-hot-toast';
import jsPDF from 'jspdf';
import { generateIdCard, getTemplateImage, CARD_WIDTH, CARD_HEIGHT } from '../utils/generateIDCard';

const IDCard = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        image: null,
        imagePreview: null
    });

    const [isVerifying, setIsVerifying] = useState(false);
    const [userData, setUserData] = useState(null);
    const [generatedCardUrl, setGeneratedCardUrl] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    /* ================= FILE UPLOAD ================= */
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file?.type.startsWith('image/')) return;
        const reader = new FileReader();
        reader.onloadend = () =>
            setFormData({ ...formData, image: file, imagePreview: reader.result });
        reader.readAsDataURL(file);
    };

    // Handle drag and drop
    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({
                    ...formData,
                    image: file,
                    imagePreview: reader.result
                });
            };
            reader.readAsDataURL(file);
        }
    };

    // Handle input changes
    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Verify user from Supabase
    const handleVerifyUser = async () => {
        if (!formData.email) {
            toast.error('Please enter your email address');
            return;
        }

        setIsVerifying(true);

        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('email', formData.email.toLowerCase())
                .single();

            if (error) {
                if (error.code === 'PGRST116') {
                    toast.error('User not found in database. Please check your email.');
                } else {
                    toast.error('Error verifying user. Please try again.');
                }
                setUserData(null);
                setShowPreview(false);
            } else {
                setUserData(data);
                setFormData({
                    ...formData,
                    name: data.full_name || formData.name
                });
                toast.success('User verified successfully!');
            }
        } catch (err) {
            console.error('Verification error:', err);
            toast.error('An unexpected error occurred');
            setUserData(null);
            setShowPreview(false);
        } finally {
            setIsVerifying(false);
        }
    };

    // Generate ID Card with Canvas
    const handleGenerateCard = async () => {
        if (!formData.imagePreview || !userData) {
            if (!userData) {
                toast.error('Please verify your email first');
            } else if (!formData.imagePreview) {
                toast.error('Please upload your photo');
            }
            return;
        }

        setIsGenerating(true);
        toast.loading('Generating your ID card...', { id: 'generating' });

        try {
            const displayName = userData.full_name || userData.name || formData.name || 'Participant';
            const registrationNumber = userData.registration_number || '';
            const imageUrl = await generateIdCard({
                templateSrc: getTemplateImage(),
                userImageSrc: formData.imagePreview,
                name: displayName,
                registrationNumber: registrationNumber,
            });

            setGeneratedCardUrl(imageUrl);
            setShowPreview(true);
            toast.success('ID card generated successfully!', { id: 'generating' });
        } catch (error) {
            console.error('Error generating ID card:', error);
            toast.error('Failed to generate ID card. Please try again.', { id: 'generating' });
        } finally {
            setIsGenerating(false);
        }
    };

    // Download as Image
    const handleDownloadImage = () => {
        if (!generatedCardUrl) {
            toast.error('Please generate the ID card first');
            return;
        }

        const fileName = (userData?.full_name || userData?.name || 'Participant').replace(/\s+/g, '_');
        const link = document.createElement('a');
        link.href = generatedCardUrl;
        link.download = `${fileName}_ID_Card.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('ID card downloaded as PNG!');
    };

    // Download as PDF
    const handleDownloadPDF = () => {
        if (!generatedCardUrl) {
            toast.error('Please generate the ID card first');
            return;
        }

        try {
            const fileName = (userData?.full_name || userData?.name || 'Participant').replace(/\s+/g, '_');
            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'px',
                format: [1448, 1086]
            });

            // Add generated image to PDF
            pdf.addImage(generatedCardUrl, 'PNG', 0, 0, 1448, 1086);

            // Download PDF
            pdf.save(`${fileName}_ID_Card.pdf`);
            toast.success('ID card downloaded as PDF!');
        } catch (error) {
            console.error('Error generating PDF:', error);
            toast.error('Failed to generate PDF. Please try again.');
        }
    };

    // Remove uploaded image
    const handleRemoveImage = () => {
        setFormData({
            ...formData,
            image: null,
            imagePreview: null
        });
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Get user role display text
    const getUserRoleDisplay = (userType) => {
        const roleMap = {
            'student_coordinator': 'Student Coordinator',
            'volunteer': 'Volunteer',
            'mentor': 'Mentor',
            'student_participant': 'Student Participant'
        };
        return roleMap[userType] || userType;
    };

    return (
        <div className="min-h-screen w-full bg-gradient-to-b from-slate-50 via-gray-50 to-amber-50/20 pt-28 pb-16 px-4 relative overflow-hidden font-poppins">
            {/* Toast Container */}
            <Toaster
                position="top-center"
                toastOptions={{
                    duration: 3000,
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

            {/* Patriotic Gradient Accent Top Glow */}
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
                        Generate <span className="bg-gradient-to-r from-[#FF9933] to-[#e07800] bg-clip-text text-transparent">ID Card</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-slate-600 max-w-2xl mx-auto text-sm sm:text-base font-normal leading-relaxed"
                    >
                        Upload your photo and enter your details to generate your INNOVIT 2026 ID card
                    </motion.p>
                </div>

                {/* Main Form Section - Horizontal Grid */}
                <div className="space-y-8">
                    {/* Top Row - Upload Box & User Details */}
                    <div className="grid lg:grid-cols-2 gap-8">
                        {/* Photo Upload Box */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
                        >
                            <div>
                                <h2 className="text-xl sm:text-2xl font-bold font-montserrat text-[#0f2942] mb-6 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-[#FF9933]">
                                        <Upload className="w-5 h-5" />
                                    </div>
                                    <span>Upload Photo</span>
                                </h2>

                                {/* Drag and Drop Box */}
                                <div
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    onClick={() => fileInputRef.current?.click()}
                                    className={`
                                        relative border-2 border-dashed rounded-2xl p-6 sm:p-10 text-center cursor-pointer
                                        transition-all duration-300 flex flex-col items-center justify-center min-h-[260px]
                                        ${isDragging
                                            ? 'border-[#FF9933] bg-amber-500/10 scale-[1.01]'
                                            : 'border-slate-300 bg-slate-50/80 hover:border-[#FF9933]/60 hover:bg-amber-500/5'
                                        }
                                    `}
                                >
                                    {formData.imagePreview ? (
                                        <div className="relative w-full max-w-xs mx-auto">
                                            <img
                                                src={formData.imagePreview}
                                                alt="Preview"
                                                className="w-full aspect-square object-cover rounded-xl shadow-md border border-slate-200"
                                            />
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleRemoveImage();
                                                }}
                                                className="absolute -top-3 -right-3 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-transform hover:scale-110"
                                                title="Remove photo"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                            <p className="mt-4 text-xs font-semibold text-slate-500">Click to change image</p>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="w-16 h-16 rounded-full bg-[#FF9933]/15 flex items-center justify-center mb-4 text-[#FF9933]">
                                                <Upload className="w-8 h-8" />
                                            </div>
                                            <p className="text-[#0f2942] font-bold font-montserrat mb-1 text-base sm:text-lg">
                                                Drag & drop your photo here
                                            </p>
                                            <p className="text-slate-500 text-xs sm:text-sm mb-4">
                                                or click to browse
                                            </p>
                                            <span className="inline-block px-3 py-1 rounded-full bg-slate-200/60 text-slate-600 text-xs font-medium">
                                                Supported formats: JPG, PNG, WEBP
                                            </span>
                                        </>
                                    )}
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                </div>
                            </div>
                        </motion.div>

                        {/* User Details Form */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 hover:shadow-2xl transition-all duration-300"
                        >
                            <h2 className="text-xl sm:text-2xl font-bold font-montserrat text-[#0f2942] mb-6 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-[#0f2942]/10 flex items-center justify-center text-[#0f2942]">
                                    <User className="w-5 h-5" />
                                </div>
                                <span>Your Details</span>
                            </h2>

                            <div className="space-y-5">
                                {/* Name Input */}
                                <div>
                                    <label className="block text-[#0f2942] font-semibold font-montserrat mb-2 text-sm">
                                        Full Name
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            placeholder="Enter your full name"
                                            className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-[#0f2942] placeholder-slate-400 font-medium focus:outline-none focus:border-[#FF9933] focus:ring-2 focus:ring-[#FF9933]/20 transition-all text-sm"
                                        />
                                    </div>
                                </div>

                                {/* Email Input */}
                                <div>
                                    <label className="block text-[#0f2942] font-semibold font-montserrat mb-2 text-sm">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            placeholder="Enter your email address"
                                            className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-[#0f2942] placeholder-slate-400 font-medium focus:outline-none focus:border-[#FF9933] focus:ring-2 focus:ring-[#FF9933]/20 transition-all text-sm"
                                        />
                                    </div>
                                </div>

                                {/* Verify Button */}
                                <motion.button
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                    onClick={handleVerifyUser}
                                    disabled={!formData.email || isVerifying}
                                    className={`
                                        w-full py-3.5 rounded-xl font-bold font-montserrat text-sm
                                        transition-all duration-300 flex items-center justify-center gap-2 shadow-md
                                        ${formData.email && !isVerifying
                                            ? 'bg-gradient-to-r from-[#0f2942] to-[#1a3f6f] text-white hover:shadow-lg hover:shadow-[#0f2942]/30'
                                            : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                                        }
                                    `}
                                >
                                    {isVerifying ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            <span>Verifying...</span>
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle className="w-4 h-4" />
                                            <span>Verify Email</span>
                                        </>
                                    )}
                                </motion.button>

                                {/* User Data Display Card */}
                                {userData && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl"
                                    >
                                        <p className="text-emerald-800 font-bold font-montserrat text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                            <CheckCircle className="w-4 h-4 text-emerald-600" />
                                            <span>Verified User</span>
                                        </p>
                                        <div className="space-y-1 text-sm text-slate-700 font-medium">
                                            <p><span className="text-slate-500 font-normal">Name:</span> <strong className="text-[#0f2942]">{userData.full_name || userData.name}</strong></p>
                                            <p><span className="text-slate-500 font-normal">Registration Number:</span> <strong className="text-[#0f2942]">{userData.registration_number || 'N/A'}</strong></p>
                                            {userData.email && <p><span className="text-slate-500 font-normal">Email:</span> {userData.email}</p>}
                                            {userData.phone && <p><span className="text-slate-500 font-normal">Phone:</span> {userData.phone}</p>}
                                        </div>
                                    </motion.div>
                                )}

                                {/* Generate Button */}
                                <motion.button
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                    onClick={handleGenerateCard}
                                    disabled={!userData || !formData.imagePreview || isGenerating}
                                    className={`
                                        w-full py-4 rounded-xl font-bold font-montserrat text-sm sm:text-base
                                        transition-all duration-300 flex items-center justify-center gap-2 shadow-md
                                        ${userData && formData.imagePreview && !isGenerating
                                            ? 'bg-gradient-to-r from-[#FF9933] to-[#e07800] text-white hover:shadow-xl hover:shadow-orange-500/30'
                                            : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                                        }
                                    `}
                                >
                                    {isGenerating ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            <span>Generating...</span>
                                        </>
                                    ) : (
                                        <span>Generate ID Card</span>
                                    )}
                                </motion.button>
                            </div>
                        </motion.div>
                    </div>

                    {/* Bottom Row - Full Width Card Preview */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50"
                    >
                        <h2 className="text-xl sm:text-2xl font-bold font-montserrat text-[#0f2942] mb-6 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-[#138808]">
                                <FileImage className="w-5 h-5" />
                            </div>
                            <span>ID Card Preview</span>
                        </h2>

                        {showPreview && generatedCardUrl ? (
                            <div className="space-y-6">
                                {/* Generated ID Card Display */}
                                <div className="flex justify-center p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                                    <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-300/60 max-w-full">
                                        <img
                                            src={generatedCardUrl}
                                            alt="Generated ID Card"
                                            className="w-auto h-auto max-w-full max-h-[600px] block rounded-2xl"
                                        />
                                    </div>
                                </div>

                                {/* Download Buttons */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto pt-2">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleDownloadImage}
                                        className="flex items-center justify-center gap-2 py-4 px-6 bg-gradient-to-r from-[#FF9933] to-[#e07800] text-white rounded-xl font-bold font-montserrat shadow-md hover:shadow-xl hover:shadow-orange-500/25 transition-all text-sm sm:text-base"
                                    >
                                        <FileImage className="w-5 h-5" />
                                        <span>Download as Image</span>
                                    </motion.button>

                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleDownloadPDF}
                                        className="flex items-center justify-center gap-2 py-4 px-6 bg-gradient-to-r from-[#0f2942] to-[#1a3f6f] text-white rounded-xl font-bold font-montserrat shadow-md hover:shadow-xl hover:shadow-[#0f2942]/25 transition-all text-sm sm:text-base"
                                    >
                                        <FileText className="w-5 h-5" />
                                        <span>Download as PDF</span>
                                    </motion.button>
                                </div>
                            </div>
                        ) : userData ? (
                            <div className="space-y-6">
                                {/* Show template image after user verification */}
                                <div className="flex justify-center p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                                    <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200 max-w-full">
                                        <img
                                            src={getTemplateImage()}
                                            alt="ID Card Template"
                                            className="w-auto h-auto max-w-full max-h-[500px] block rounded-2xl"
                                        />
                                    </div>
                                </div>
                                <p className="text-center text-slate-500 text-sm font-medium">
                                    Upload your photo and click 'Generate ID Card' to create your personalized card
                                </p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 sm:py-20 text-center bg-slate-50/60 rounded-2xl border border-dashed border-slate-200">
                                <div className="w-20 h-20 rounded-2xl bg-amber-500/10 flex items-center justify-center mb-5 text-[#FF9933]">
                                    <Download className="w-10 h-10" />
                                </div>
                                <p className="text-[#0f2942] text-lg font-bold font-montserrat mb-1">
                                    No Preview Available
                                </p>
                                <p className="text-slate-500 text-sm max-w-xs font-normal">
                                    Verify your email to see your ID card template
                                </p>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default IDCard;