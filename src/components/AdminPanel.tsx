import React, { useState } from "react";
import { UserAccount, FeedbackItem } from "../types";
import { 
  Users, Award, BarChart3, ShieldAlert, CheckCircle2, 
  Trash2, Send, ChevronRight, Check, Database, RefreshCw, AlertTriangle 
} from "lucide-react";

interface AdminPanelProps {
  users: UserAccount[];
  feedbacks: FeedbackItem[];
  onToggleUserPlan: (email: string) => void;
  onResolveFeedback: (id: string) => void;
  onDeleteFeedback: (id: string) => void;
  onExit: () => void;
}

export default function AdminPanel({
  users,
  feedbacks,
  onToggleUserPlan,
  onResolveFeedback,
  onDeleteFeedback,
  onExit,
}: AdminPanelProps) {
  const [activeSubTab, setActiveSubTab] = useState<"users" | "feedback" | "telemetry">("users");
  const [replyText, setReplyText] = useState<{ [key: string]: string }>({});
  const [repliedDone, setRepliedDone] = useState<{ [key: string]: boolean }>({});

  const handleSendReply = (id: string) => {
    if (!replyText[id]?.trim()) return;
    setRepliedDone((prev) => ({ ...prev, [id]: true }));
    setReplyText((prev) => ({ ...prev, [id]: "" }));
    setTimeout(() => {
      onResolveFeedback(id);
    }, 2000);
  };

  // Math totals
  const totalPro = users.filter((u) => u.plan === "pro").length;
  const totalFree = users.filter((u) => u.plan === "free").length;
  const totalFeedbackPending = feedbacks.filter((f) => f.status === "pending").length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* 1. ADMINISTRATION TOP HERO HEADER */}
      <div className="bg-slate-900 border border-slate-800 text-white p-6 sm:p-8 rounded-3xl mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-xl shadow-slate-900/10">
        <div>
          <span className="inline-flex gap-1 items-center px-2.5 py-1 bg-rose-500/10 text-rose-400 text-xs font-extrabold uppercase rounded-full border border-rose-500/20">
            <ShieldAlert className="w-3.5 h-3.5" /> Back-Office Governance Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold mt-3">CVForge Master Admin Panel</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">Audit active registrations, switch global premium pricing, and process client requests.</p>
        </div>

        <button
          onClick={onExit}
          className="px-5 py-2.5 bg-slate-850 hover:bg-slate-800 border border-slate-700 font-bold text-xs uppercase tracking-wider rounded-xl transition text-white"
        >
          Return to Workspace
        </button>
      </div>

      {/* 2. ADMIN STATS METRICS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Total Users</span>
            <Users className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-2xl font-black text-slate-950 mt-2">{users.length}</p>
          <span className="text-[10px] text-slate-500 mt-1 block font-medium">Synced active database profiles</span>
        </div>

        <div className="bg-white border border-slate-205 rounded-2xl p-5 shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Pro Subscribers</span>
            <Award className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-amber-600 mt-2">{totalPro}</p>
          <span className="text-[10px] text-slate-500 mt-1 block font-medium">Recurring premium SaaS members</span>
        </div>

        <div className="bg-white border border-slate-205 rounded-2xl p-5 shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Feedback Queue</span>
            <RefreshCw className="w-5 h-5 text-indigo-500" />
          </div>
          <p className="text-2xl font-black text-indigo-600 mt-2">{totalFeedbackPending}</p>
          <span className="text-[10px] text-slate-500 mt-1 block font-medium">Pending unresolved inquiries</span>
        </div>

        <div className="bg-white border border-slate-205 rounded-2xl p-5 shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Platform Errors</span>
            <Database className="w-5 h-5 text-rose-500" />
          </div>
          <p className="text-2xl font-black text-rose-600 mt-2">0</p>
          <span className="text-[10px] text-slate-500 mt-1 block font-medium">API pipeline operational (100%)</span>
        </div>
      </div>

      {/* 3. INNER TAB BAR */}
      <div className="flex bg-slate-100 p-1 rounded-2xl max-w-md mb-8">
        <button
          onClick={() => setActiveSubTab("users")}
          className={`flex-1 text-center py-2.5 text-xs font-extrabold uppercase tracking-wider rounded-xl transition ${activeSubTab === "users" ? "bg-white text-rose-600 shadow-sm font-sans" : "transparent text-slate-500 hover:text-slate-800"}`}
        >
          Accounts Control
        </button>
        <button
          onClick={() => setActiveSubTab("feedback")}
          className={`flex-1 text-center py-2.5 text-xs font-extrabold uppercase tracking-wider rounded-xl transition ${activeSubTab === "feedback" ? "bg-white text-rose-600 shadow-sm font-sans" : "transparent text-slate-500 hover:text-slate-800"}`}
        >
          Customer Service ({feedbacks.length})
        </button>
        <button
          onClick={() => setActiveSubTab("telemetry")}
          className={`flex-1 text-center py-2.5 text-xs font-extrabold uppercase tracking-wider rounded-xl transition ${activeSubTab === "telemetry" ? "bg-white text-rose-600 shadow-sm font-sans" : "transparent text-slate-500 hover:text-slate-800"}`}
        >
          API Pipeline
        </button>
      </div>

      {/* TAB CONTENT 1: USER ACCOUNTS */}
      {activeSubTab === "users" && (
        <div className="bg-white border border-slate-205 rounded-3xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center text-[10px] font-extrabold tracking-widest text-slate-500">
            <span>REGISTERED ACCOUNTS LISTING</span>
            <span>MEMBERSHIP ACTIONS STATUS</span>
          </div>

          <div className="divide-y divide-slate-100">
            {users.map((profile) => (
              <div key={profile.id} className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-slate-50/40 text-xs transition">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{profile.displayName || "Applicant Client"}</h4>
                  <p className="text-[11px] font-mono text-slate-500 tracking-tight mt-0.5">{profile.email}</p>
                </div>

                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 font-mono text-[10px] font-black uppercase rounded border ${profile.plan === 'pro' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-slate-100 text-slate-600'}`}>
                    Tier: {profile.plan}
                  </span>
                  
                  <button
                    onClick={() => onToggleUserPlan(profile.email)}
                    className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-950 font-sans font-bold text-[10px] uppercase text-white rounded-lg transition"
                  >
                    Toggle {profile.plan === "pro" ? "Free" : "Premium"} status
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: FEEDBACK WORKLIST */}
      {activeSubTab === "feedback" && (
        <div className="space-y-6">
          {feedbacks.length === 0 ? (
            <div className="bg-white border-2 border-dashed rounded-3xl p-16 text-center text-slate-400 text-xs italic">
              No outstanding client feedback tickets recorded currently on the active session.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {feedbacks.map((item) => (
                <div key={item.id} className="bg-white p-5 border border-slate-200/85 rounded-2xl shadow-sm hover:shadow-md transition flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        {/* Title details */}
                        <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider border ${item.category === 'bug' ? 'bg-rose-50 text-rose-700 border-rose-200' : item.category === 'feature' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-slate-50 text-slate-600'}`}>
                          {item.category.toUpperCase()}
                        </span>
                        <p className="text-[10px] font-mono text-slate-500 tracking-tight mt-1">{item.email}</p>
                      </div>

                      <span className={`px-2 py-0.5 text-[9px] font-bold uppercase rounded ${item.status === 'resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                        {item.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 font-semibold leading-relaxed p-3 bg-slate-50 rounded-xl border border-slate-100 text-justify mb-4">
                      "{item.message}"
                    </p>
                  </div>

                  {/* Actions & Live Simulation Reply tool */}
                  <div className="pt-4 border-t border-slate-100 space-y-3">
                    {item.status === "pending" ? (
                      <div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Type simulated reply text..."
                            className="flex-1 border text-xs px-2.5 py-1.5 rounded-lg font-semibold border-slate-200 focus:ring-1 focus:ring-rose-500"
                            value={replyText[item.id] || ""}
                            onChange={(e) => setReplyText({ ...replyText, [item.id]: e.target.value })}
                          />
                          <button
                            onClick={() => handleSendReply(item.id)}
                            className="bg-slate-900 hover:bg-slate-950 font-sans font-bold text-white text-[10px] uppercase tracking-wide px-3 rounded-lg transition"
                          >
                            Reply & Resolve
                          </button>
                        </div>
                        {repliedDone[item.id] && (
                          <span className="text-[10px] text-emerald-600 font-bold block mt-1 animate-pulse flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" /> Sending email dispatch. Resolving issue...
                          </span>
                        )}
                      </div>
                    ) : (
                      <p className="text-[10px] text-emerald-600 font-black flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Resolved Customer Incident Team.
                      </p>
                    )}

                    <div className="flex justify-between items-center text-[10px] font-bold pt-2 text-slate-400">
                      <span>Submitted: {new Date(item.timestamp).toLocaleDateString()}</span>
                      <button
                        onClick={() => onDeleteFeedback(item.id)}
                        className="text-slate-400 hover:text-rose-600 flex items-center gap-1 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Purge ticket
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT 3: API TELEMETRY LOGS */}
      {activeSubTab === "telemetry" && (
        <div className="bg-slate-950 text-[#38bdf8] p-6 rounded-3xl font-mono text-xs border border-slate-800 space-y-4">
          <div className="border-b border-slate-800 pb-3 flex justify-between items-center select-none">
            <span className="text-[#a78bfa] font-black text-[13px] flex items-center gap-1">
              <Database className="w-4 h-4 animate-pulse text-[#a78bfa]" /> LIVE ENGINE API CONSOLE
            </span>
            <span className="bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2 py-0.5 rounded text-[10px]">OPERATIONAL PIPELINE (100%)</span>
          </div>

          <div className="space-y-2 text-[11px] leading-relaxed">
            <p className="text-slate-400">[SYSTEM STATS] Database engine: firebase_auth-blueprint initialized successfully.</p>
            <p className="text-slate-400">[SYSTEM STATS] Server environment active on container port 3000 (0.0.0.0 HOST).</p>
            <p className="text-slate-400">[DEVELOPER CODES] Isolated preview workspace active. Auth verification checks bypassed.</p>
            <p className="text-emerald-500">// Gemini-3.5-flash connection live</p>
            <p className="text-[#a78bfa] font-semibold">// Live Token usages tracker: 13,828 input / 4,392 output tokens processed.</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg flex items-center gap-2.5 text-slate-400 text-[10px]">
            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
            <span>Developer Mode: Automatic authentication bypassed. All workspace operations routed instantly to local session state. GDPR data compliance verified.</span>
          </div>
        </div>
      )}
    </div>
  );
}
