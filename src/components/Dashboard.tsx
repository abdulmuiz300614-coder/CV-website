import React, { useState } from "react";
import { ResumeDocument, CoverLetterDocument, UserAccount, ActivityLog, FeedbackItem } from "../types";
import { Plus, Edit, Trash2, Copy, Tag, Eye, ArrowUpRight, BarChart3, Clock, Sparkles, AlertCircle, Settings, Send, FileText, Check, FileDown } from "lucide-react";

interface DashboardProps {
  user: UserAccount;
  resumes: ResumeDocument[];
  coverLetters: CoverLetterDocument[];
  activities: ActivityLog[];
  onSelectResume: (doc: ResumeDocument) => void;
  onSelectCoverLetter: (doc: CoverLetterDocument) => void;
  onCreateResume: () => void;
  onCreateCoverLetter: () => void;
  onDeleteResume: (id: string) => void;
  onDeleteCoverLetter: (id: string) => void;
  onDuplicateResume: (doc: ResumeDocument) => void;
  onRenameResume: (id: string, newTitle: string) => void;
  onRenameCoverLetter: (id: string, newTitle: string) => void;
  onUpgrade: () => void;
  onSubmitFeedback: (category: "feature" | "bug" | "other", message: string) => void;
  onUpdateUserDetails: (name: string) => void;
}

export default function Dashboard({
  user,
  resumes,
  coverLetters,
  activities,
  onSelectResume,
  onSelectCoverLetter,
  onCreateResume,
  onCreateCoverLetter,
  onDeleteResume,
  onDeleteCoverLetter,
  onDuplicateResume,
  onRenameResume,
  onRenameCoverLetter,
  onUpgrade,
  onSubmitFeedback,
  onUpdateUserDetails,
}: DashboardProps) {
  const [activeTab, setActiveTab] = useState<"resumes" | "letters" | "activities" | "settings">("resumes");
  const [renameId, setRenameId] = useState<string | null>(null);
  const [renameTitle, setRenameTitle] = useState<string>("");
  const [editingType, setEditingType] = useState<"resume" | "letter">("resume");
  const [feedbackCategory, setFeedbackCategory] = useState<"feature" | "bug" | "other">("feature");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [tempName, setTempName] = useState(user.displayName);
  const [nameSaved, setNameSaved] = useState(false);

  const startRename = (id: string, title: string, type: "resume" | "letter") => {
    setRenameId(id);
    setRenameTitle(title);
    setEditingType(type);
  };

  const handleRenameSave = () => {
    if (!renameTitle.trim()) return;
    if (editingType === "resume") {
      onRenameResume(renameId!, renameTitle);
    } else {
      onRenameCoverLetter(renameId!, renameTitle);
    }
    setRenameId(null);
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackMessage.trim()) return;
    onSubmitFeedback(feedbackCategory, feedbackMessage);
    setFeedbackMessage("");
    setFeedbackSubmitted(true);
    setTimeout(() => setFeedbackSubmitted(false), 4000);
  };

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempName.trim()) return;
    onUpdateUserDetails(tempName);
    setNameSaved(true);
    setTimeout(() => setNameSaved(false), 3000);
  };

  // Compute calculated metrics
  const resumeLimit = user.plan === "pro" ? 50 : 2;
  const letterLimit = user.plan === "pro" ? 50 : 2;
  const resumeProgress = (resumes.length / resumeLimit) * 100;
  const letterProgress = (coverLetters.length / letterLimit) * 100;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* 1. TOP STATS AND USER CALLOUT */}
      <div className="bg-[#1e293b] text-white p-6 sm:p-8 rounded-3xl mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-xl shadow-slate-200">
        <div>
          <span className="inline-flex gap-1 items-center px-2.5 py-1 bg-blue-500/20 text-blue-400 text-xs font-extrabold uppercase rounded-full border border-blue-500/30">
            <Sparkles className="w-3 h-3 text-blue-400" /> Professional Dashboard
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold mt-3">Welcome, {user.displayName || "Applicant"}</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">Manage, optimization-test, and generate standard corporate layouts instantly.</p>
        </div>

        <div className="flex flex-wrap gap-4">
          <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 font-mono text-center min-w-[120px]">
            <span className="text-[10px] text-slate-400 font-sans font-bold uppercase tracking-widest">Active Tier</span>
            <p className="text-base font-extrabold text-blue-400 mt-0.5 uppercase">{user.plan}</p>
          </div>
          <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 font-mono text-center min-w-[120px]">
            <span className="text-[10px] text-slate-400 font-sans font-bold uppercase tracking-widest">Saved Docs</span>
            <p className="text-base font-extrabold text-emerald-400 mt-0.5">{resumes.length + coverLetters.length}</p>
          </div>
          {user.plan === "free" && (
            <button
              onClick={onUpgrade}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 px-5 rounded-xl text-xs font-black tracking-wider uppercase transition text-white self-stretch flex items-center justify-center gap-1 shadow-lg shadow-blue-500/10 active:scale-95"
            >
              UPGRADE PLAN
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: NAVIGATION & CONTROLS */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50">
              <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">SaaS Navigation</span>
            </div>
            <div className="p-2 space-y-1">
              <button
                onClick={() => setActiveTab("resumes")}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold tracking-wide transition ${activeTab === "resumes" ? "bg-blue-50 text-blue-700 font-black border-l-4 border-blue-600 rounded-l-none" : "hover:bg-slate-50 text-slate-600"}`}
              >
                <FileText className="w-4.5 h-4.5" />
                My Resumes ({resumes.length})
              </button>
              <button
                onClick={() => setActiveTab("letters")}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold tracking-wide transition ${activeTab === "letters" ? "bg-blue-50 text-blue-700 font-black border-l-4 border-blue-600 rounded-l-none" : "hover:bg-slate-50 text-slate-600"}`}
              >
                <FileText className="w-4.5 h-4.5 text-indigo-500" />
                Cover Letters ({coverLetters.length})
              </button>
              <button
                onClick={() => setActiveTab("activities")}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold tracking-wide transition ${activeTab === "activities" ? "bg-blue-50 text-blue-700 font-black border-l-4 border-blue-600 rounded-l-none" : "hover:bg-slate-50 text-slate-600"}`}
              >
                <Clock className="w-4.5 h-4.5 text-emerald-500" />
                Recent Activities
              </button>
              <button
                onClick={() => setActiveTab("settings")}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold tracking-wide transition ${activeTab === "settings" ? "bg-blue-50 text-blue-700 font-black border-l-4 border-blue-600 rounded-l-none" : "hover:bg-slate-50 text-slate-600"}`}
              >
                <Settings className="w-4.5 h-4.5 text-slate-500" />
                Account Settings
              </button>
            </div>
          </div>

          {/* DOCUMENT LIMIT METERS */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <span>Resume Quota</span>
                <span>{resumes.length} / {resumeLimit}</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded overflow-hidden">
                <div className={`h-2 rounded transition-all ${resumes.length >= resumeLimit ? "bg-red-550" : "bg-blue-600"}`} style={{ width: `${Math.min(resumeProgress, 100)}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <span>Cover Letter Quota</span>
                <span>{coverLetters.length} / {letterLimit}</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded overflow-hidden">
                <div className={`h-2 rounded transition-all ${coverLetters.length >= letterLimit ? "bg-red-550" : "bg-indigo-600"}`} style={{ width: `${Math.min(letterProgress, 100)}%` }} />
              </div>
            </div>

            {user.plan === "free" && (
              <div className="bg-amber-50 rounded-xl p-3 border border-amber-200/60 text-[10px] text-amber-800 leading-normal flex gap-1.5 font-medium">
                <AlertCircle className="w-3.5 h-3.5 shrink-0 text-amber-600" />
                <span>You are on Free. Max 2 resumes allowed. Upgrade to Pro for unlimited saves.</span>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: WORKSPACE DATA VIEW */}
        <div className="lg:col-span-9">
          {/* TAB 1: RESUMES LISTING */}
          {activeTab === "resumes" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">My Saved Resumes</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Manage, duplicate, rename and edit previous structural career versions.</p>
                </div>
                <button
                  onClick={onCreateResume}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl shadow-md transition flex items-center gap-1.5 active:scale-95 shrink-0"
                >
                  <Plus className="w-4 h-4" /> Create New CV
                </button>
              </div>

              {resumes.length === 0 ? (
                <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 p-12 text-center">
                  <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-base font-extrabold text-slate-900">No Resumes Registered Yet</h3>
                  <p className="text-xs text-slate-500 mt-2 max-w-sm mx-auto leading-normal">
                    Get started by utilizing our step-by-step assistant wizard to structure your master profile info.
                  </p>
                  <button
                    onClick={onCreateResume}
                    className="mt-6 px-6 py-3 bg-blue-600 text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-blue-700 transition"
                  >
                    Build First Resume
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {resumes.map((doc) => (
                    <div
                      key={doc.id}
                      className="bg-white border border-slate-200/80 rounded-2xl shadow-sm hover:shadow-lg hover:border-blue-200 transition p-5 flex flex-col justify-between"
                    >
                      <div>
                        {/* Upper Details block */}
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1 mr-3">
                            {renameId === doc.id ? (
                              <div className="flex items-center gap-1.5">
                                <input
                                  type="text"
                                  value={renameTitle}
                                  onChange={(e) => setRenameTitle(e.target.value)}
                                  className="border border-slate-300 px-2 py-1 rounded text-xs focus:ring-1 focus:ring-blue-500 w-full"
                                />
                                <button
                                  onClick={handleRenameSave}
                                  className="bg-emerald-600 hover:bg-emerald-700 text-white p-1 rounded text-xs shrink-0"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ) : (
                              <h3
                                onClick={() => startRename(doc.id, doc.title, "resume")}
                                className="font-bold text-slate-900 text-sm hover:text-blue-600 cursor-pointer flex items-center gap-1.5"
                                title="Click to Rename"
                              >
                                {doc.title}
                                <span className="text-[10px] text-slate-400 font-sans font-normal italic">rename</span>
                              </h3>
                            )}
                            <span className="text-[10px] text-slate-400 font-bold uppercase mt-1 block">
                              Layout: {doc.templateType.toUpperCase()}
                            </span>
                          </div>
                          <span className="bg-slate-100 text-slate-600 font-mono text-[9px] font-extrabold px-2 py-0.5 rounded">
                            {doc.data.experience.length} Positions
                          </span>
                        </div>

                        {/* Summary Block */}
                        <p className="text-xs text-slate-500 line-clamp-2 min-h-[32px] text-justify leading-relaxed">
                          {doc.data.summary || "No summary written. Hit AI builder to generate a professional targeted synopsis."}
                        </p>
                      </div>

                      {/* Doc Control Footer toolbar */}
                      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold gap-2">
                        <button
                          onClick={() => onSelectResume(doc)}
                          className="flex items-center gap-1 text-blue-600 hover:text-blue-700 transition"
                        >
                          <Edit className="w-3.5 h-3.5" /> Edit & Optimize
                        </button>
                        
                        <div className="flex items-center gap-2.5">
                          <button
                            onClick={() => onDuplicateResume(doc)}
                            className="text-slate-500 hover:text-slate-700 transition"
                            title="Duplicate Document"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteResume(doc.id)}
                            className="text-slate-400 hover:text-rose-600 transition"
                            title="Delete resume"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: COVER LETTERS */}
          {activeTab === "letters" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">My Saved Cover Letters</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Generate, custom copy and download custom targeted letter records.</p>
                </div>
                <button
                  onClick={onCreateCoverLetter}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl shadow-md transition flex items-center gap-1.5 active:scale-95 shrink-0"
                >
                  <Plus className="w-4 h-4" /> Generate Letter
                </button>
              </div>

              {coverLetters.length === 0 ? (
                <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 p-12 text-center">
                  <FileText className="w-12 h-12 text-indigo-300 mx-auto mb-4" />
                  <h3 className="text-base font-extrabold text-slate-900">No Cover Letters Registered</h3>
                  <p className="text-xs text-slate-500 mt-2 max-w-sm mx-auto leading-normal">
                    Generate an industry-certified, bespoke cover letter by pasting your target job description.
                  </p>
                  <button
                    onClick={onCreateCoverLetter}
                    className="mt-6 px-6 py-3 bg-indigo-600 text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-indigo-700 transition"
                  >
                    Generate First Letter
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {coverLetters.map((doc) => (
                    <div
                      key={doc.id}
                      className="bg-white border border-slate-200/80 rounded-2xl shadow-sm hover:shadow-lg hover:border-indigo-200 transition p-5 flex flex-col justify-between"
                    >
                      <div>
                        {/* Upper Details block */}
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1 mr-3">
                            {renameId === doc.id ? (
                              <div className="flex items-center gap-1.5">
                                <input
                                  type="text"
                                  value={renameTitle}
                                  onChange={(e) => setRenameTitle(e.target.value)}
                                  className="border border-slate-300 px-2 py-1 rounded text-xs focus:ring-1 focus:ring-indigo-500 w-full"
                                />
                                <button
                                  onClick={handleRenameSave}
                                  className="bg-emerald-600 hover:bg-emerald-700 text-white p-1 rounded text-xs shrink-0"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ) : (
                              <h3
                                onClick={() => startRename(doc.id, doc.title, "letter")}
                                className="font-bold text-slate-900 text-sm hover:text-indigo-600 cursor-pointer flex items-center gap-1.5"
                                title="Click to Rename"
                              >
                                {doc.title}
                                <span className="text-[10px] text-slate-400 font-sans font-normal italic">rename</span>
                              </h3>
                            )}
                            <span className="text-[10px] text-[#2563eb] font-bold mt-1 block">
                              For: {doc.companyName || "Target Employer"}
                            </span>
                          </div>
                          <span className="bg-indigo-50 text-[#312e81] font-mono text-[9px] font-extrabold px-2 py-0.5 border border-indigo-100 rounded">
                            {doc.tone} Tone
                          </span>
                        </div>

                        {/* Summary Block */}
                        <p className="text-xs text-slate-500 line-clamp-3 min-h-[48px] text-justify leading-relaxed">
                          {doc.generatedContent || "Brief summary generated using selected tone and qualifications details."}
                        </p>
                      </div>

                      {/* Doc Control Footer toolbar */}
                      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold gap-2">
                        <button
                          onClick={() => onSelectCoverLetter(doc)}
                          className="flex items-center gap-1 text-indigo-600 hover:text-indigo-700 transition"
                        >
                          <Edit className="w-3.5 h-3.5" /> Edit letter
                        </button>
                        
                        <button
                          onClick={() => onDeleteCoverLetter(doc.id)}
                          className="text-slate-400 hover:text-rose-600 transition"
                          title="Delete document"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: RECENT ACTIVITIES */}
          {activeTab === "activities" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Recent Activity Log</h2>
                <p className="text-xs text-slate-500 mt-0.5">Live audit of document creations, AI generations, and file downloads.</p>
              </div>

              <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center text-[10px] font-extrabold tracking-widest text-slate-500">
                  <span>ACTIVITY DETAILS</span>
                  <span>TIMESTAMP</span>
                </div>
                <div className="divide-y divide-slate-100">
                  {activities.map((act) => (
                    <div key={act.id} className="p-4 flex justify-between items-center hover:bg-slate-50/50 text-xs transition">
                      <div className="flex items-center gap-3.5">
                        <div className={`p-2 rounded-lg font-bold ${act.type.includes("optimize") ? "bg-amber-100 text-amber-700" : act.type.includes("cover") ? "bg-indigo-100 text-indigo-700" : "bg-blue-105 text-blue-700"}`}>
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">{act.details}</p>
                          <p className="text-[10px] text-slate-400 font-medium">Action: {act.type.replace("_", " ")}</p>
                        </div>
                      </div>
                      <span className="font-mono text-slate-500 text-[10px]">
                        {new Date(act.timestamp).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
                      </span>
                    </div>
                  ))}
                  {activities.length === 0 && (
                    <p className="p-8 text-center text-slate-400 text-xs italic">No activities registered. Try building a resume!</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ACCOUNT SETTINGS & FEEDBACK */}
          {activeTab === "settings" && (
            <div className="space-y-8">
              {/* Account Settings profile form */}
              <div className="bg-white border border-slate-205 rounded-2xl shadow-sm p-6">
                <h3 className="font-extrabold text-base text-slate-900 tracking-tight mb-4">Edit Profile details</h3>
                <form onSubmit={handleSaveName} className="space-y-4 max-w-md">
                  <div>
                    <label className="text-xs font-bold text-slate-500 block mb-1">REGISTERED EMAIL</label>
                    <input
                      type="text"
                      className="w-full bg-slate-100 border border-slate-200 text-slate-500 px-3 py-2 rounded-xl text-xs font-mono font-bold select-none cursor-not-allowed"
                      value={user.email}
                      disabled
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 block mb-1">DISPLAY NAME</label>
                    <input
                      type="text"
                      className="w-full bg-white border border-slate-200 text-slate-800 px-3 py-2 rounded-xl text-xs font-semibold focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl transition"
                    >
                      Save Profile Name
                    </button>
                    {nameSaved && (
                      <span className="text-emerald-600 text-xs font-semibold flex items-center gap-1.5 animate-pulse">
                        <Check className="w-4 h-4" /> Name successfully saved.
                      </span>
                    )}
                  </div>
                </form>
              </div>

              {/* Feedbacks submission section */}
              <div className="bg-white border border-slate-205 rounded-2xl shadow-sm p-6">
                <h3 className="font-extrabold text-base text-slate-900 tracking-tight mb-2 flex items-center gap-1.5">
                  Send Feedback or Feature Request <Send className="w-4 h-4 text-slate-400" />
                </h3>
                <p className="text-xs text-slate-500 mb-4 leading-normal">
                  Found a bug or want to request a layout? Type details below to contact development teams directly.
                </p>

                <form onSubmit={handleFeedbackSubmit} className="space-y-4 max-w-lg">
                  <div className="flex gap-4">
                    {["feature", "bug", "other"].map((cat) => (
                      <label
                        key={cat}
                        className={`flex-1 text-center py-2 border rounded-xl text-xs font-bold uppercase cursor-pointer transition ${feedbackCategory === cat ? "border-blue-600 bg-blue-50 text-blue-700 font-sans" : "border-slate-200 hover:border-slate-350"}`}
                      >
                        <input
                          type="radio"
                          name="category"
                          value={cat}
                          checked={feedbackCategory === cat}
                          onChange={() => setFeedbackCategory(cat as any)}
                          className="sr-only"
                        />
                        {cat}
                      </label>
                    ))}
                  </div>

                  <div>
                    <textarea
                      placeholder="Context detail..."
                      rows={4}
                      className="w-full border border-slate-200 rounded-xl p-3 text-xs leading-normal font-medium focus:ring-1 focus:ring-blue-500"
                      value={feedbackMessage}
                      onChange={(e) => setFeedbackMessage(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-slate-900 hover:bg-slate-950 text-white font-semibold text-xs tracking-wide uppercase rounded-xl transition active:scale-95"
                    >
                      Submit Message
                    </button>
                  </div>
                </form>
                {feedbackSubmitted && (
                  <div className="mt-4 p-3 bg-emerald-50 border border-emerald-250 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2 animate-bounce">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Feedback safely submitted! Thank you. Let's make career upgrades seamless.</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
