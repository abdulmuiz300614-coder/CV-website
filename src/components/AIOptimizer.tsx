import React, { useState } from "react";
import { ResumeDocument, AIOptimizationReport, JobMatchReport } from "../types";
import { 
  Sparkles, ShieldCheck, Target, Award, CheckCircle2, 
  HelpCircle, AlertTriangle, FileText, Loader, ArrowRight, Clipboard 
} from "lucide-react";

interface AIOptimizerProps {
  document: ResumeDocument;
  onActivityLog: (details: string, type: any) => void;
  onExit: () => void;
}

export default function AIOptimizer({ document, onActivityLog, onExit }: AIOptimizerProps) {
  const [activeTab, setActiveTab] = useState<"optimize" | "match">("optimize");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [report, setReport] = useState<AIOptimizationReport | null>(null);

  // Job match state
  const [jobDescription, setJobDescription] = useState<string>("");
  const [matchReport, setMatchReport] = useState<JobMatchReport | null>(null);

  // Run full resume optimization report
  const handleOptimizeResume = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/optimize-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeData: document.data }),
      });
      const data = await response.json();
      if (data.success && data.analysis) {
        setReport(data.analysis);
        onActivityLog(`Fully optimized resume & calculated grading score (${data.analysis.resumeScore}/100)`, "optimize_resume");
      }
    } catch (err) {
      console.error("Failed to run optimization audit:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Run Job Match analysis
  const handleJobMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobDescription.trim()) return;
    setIsLoading(true);
    try {
      const response = await fetch("/api/match-job", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeData: document.data,
          jobDescription: jobDescription,
        }),
      });
      const data = await response.json();
      if (data.success && data.matchResult) {
        setMatchReport(data.matchResult);
        onActivityLog(`Screened resume against a job vacancy (${data.matchResult.matchPercentage}% fit)`, "optimize_resume");
      }
    } catch (err) {
      console.error("Failed to perform Job Match:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-600 border-emerald-200 bg-emerald-50";
    if (score >= 60) return "text-amber-600 border-amber-200 bg-amber-50";
    return "text-rose-600 border-rose-200 bg-rose-50";
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* HEADER SECTION */}
      <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-sm mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">AI Optimisation & Match Studio</h2>
          <p className="text-xs text-slate-500 mt-1">Audit ATS metrics, correct weak grammar blocks, and align resumes with live job vacancies.</p>
        </div>

        <button
          onClick={onExit}
          className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-xs uppercase tracking-wider rounded-xl transition"
        >
          Exit Studio
        </button>
      </div>

      {/* COMPONENT SUBTABS */}
      <div className="flex bg-slate-100 p-1 rounded-2xl max-w-md mb-8">
        <button
          onClick={() => setActiveTab("optimize")}
          className={`flex-1 text-center py-2.5 text-xs font-extrabold uppercase tracking-wider rounded-xl transition ${activeTab === "optimize" ? "bg-white text-blue-600 shadow-sm font-sans" : "transparent text-slate-500 hover:text-slate-800"}`}
        >
          1. Resume Grader
        </button>
        <button
          onClick={() => setActiveTab("match")}
          className={`flex-1 text-center py-2.5 text-xs font-extrabold uppercase tracking-wider rounded-xl transition ${activeTab === "match" ? "bg-white text-blue-600 shadow-sm font-sans" : "transparent text-slate-500 hover:text-slate-800"}`}
        >
          2. Vacancy Matcher
        </button>
      </div>

      {isLoading && (
        <div className="bg-slate-950/5/50 border border-slate-200 rounded-3xl p-16 text-center shadow-inner mb-6">
          <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <h3 className="text-base font-extrabold text-slate-900 animate-pulse">Running Server-Side Gemini Intelligence Audit</h3>
          <p className="text-xs text-slate-500 mt-2 max-w-sm mx-auto leading-normal">
            Scanning work summaries, bullet phrasings, formatting spacing grids, and checking syntactic alignments. Standby for metrics computations...
          </p>
        </div>
      )}

      {/* FEATURE TAB 1: RESUME AUDIT GRADER */}
      {!isLoading && activeTab === "optimize" && (
        <div className="space-y-8">
          {report === null ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-sm">
              <ShieldCheck className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-900">Measure Your Resume Score</h3>
              <p className="text-xs text-slate-500 mt-2 max-w-lg mx-auto leading-relaxed text-center">
                Our optimizer scans the grammar tone, counts quantifiable action-achievement metrics, evaluates ATS scanner layouts, and estimates layout readability. Run audit to check compatibility.
              </p>
              <button
                onClick={handleOptimizeResume}
                className="mt-6 px-6 py-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 text-white text-xs font-black uppercase tracking-wider rounded-xl hover:from-blue-700 shadow-lg shadow-blue-500/10 active:scale-95 transition flex items-center justify-center gap-1.5 mx-auto"
              >
                <Sparkles className="w-4 h-4 text-emerald-400" /> Start AI Complete Optimisation
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* SCORE CARDS ROW */}
              <div className="lg:col-span-4 space-y-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                  <h3 className="font-extrabold text-xs text-slate-400 uppercase tracking-widest mb-4">Overall Score Cards</h3>
                  
                  <div className="space-y-4">
                    {/* Gauge 1 */}
                    <div>
                      <div className="flex justify-between items-baseline mb-1">
                        <span className="text-xs font-extrabold text-slate-700">Resume Quality Score</span>
                        <span className="text-sm font-black font-mono text-blue-600">{report.resumeScore} / 100</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded overflow-hidden">
                        <div className="bg-blue-600 h-2.5 rounded transition-all" style={{ width: `${report.resumeScore}%` }} />
                      </div>
                    </div>

                    {/* Gauge 2 */}
                    <div>
                      <div className="flex justify-between items-baseline mb-1">
                        <span className="text-xs font-extrabold text-slate-700">ATS Compatibility</span>
                        <span className="text-sm font-black font-mono text-indigo-600">{report.atsScore} / 100</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded overflow-hidden">
                        <div className="bg-indigo-600 h-2.5 rounded transition-all" style={{ width: `${report.atsScore}%` }} />
                      </div>
                    </div>

                    {/* Gauge 3 */}
                    <div>
                      <div className="flex justify-between items-baseline mb-1">
                        <span className="text-xs font-extrabold text-slate-700">Grammar Phrasing Code</span>
                        <span className="text-sm font-black font-mono text-emerald-600">{report.grammarScore} / 100</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded overflow-hidden">
                        <div className="bg-emerald-600 h-2.5 rounded transition-all" style={{ width: `${report.grammarScore}%` }} />
                      </div>
                    </div>

                    {/* Gauge 4 */}
                    <div>
                      <div className="flex justify-between items-baseline mb-1">
                        <span className="text-xs font-extrabold text-slate-700">Measurable Impact</span>
                        <span className="text-sm font-black font-mono text-amber-600">{report.impactScore} / 100</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded overflow-hidden">
                        <div className="bg-amber-500 h-2.5 rounded transition-all" style={{ width: `${report.impactScore}%` }} />
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-5 border-t border-slate-100 text-center">
                    <button
                      onClick={handleOptimizeResume}
                      className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center justify-center gap-1.5 mx-auto"
                    >
                      <Sparkles className="w-3.5 h-3.5" /> Re-Scan Resume File
                    </button>
                  </div>
                </div>
              </div>

              {/* ACTIONABLE IMPROVEMENTS BULLETS LIST */}
              <div className="lg:col-span-8 space-y-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-205 shadow-sm space-y-6">
                  <h3 className="font-extrabold text-slate-900 tracking-tight text-base">Actionable Enhancements Recommendations</h3>

                  {/* Recommendations Category 1: Weak wording */}
                  <div>
                    <h4 className="flex items-center gap-2 text-xs font-extrabold text-amber-700 bg-amber-50 border border-amber-100 px-3 py-1 rounded-xl uppercase tracking-wider mb-3">
                      <AlertTriangle className="w-4 h-4 text-amber-600" /> Weak Wording corrections
                    </h4>
                    <ul className="list-disc pl-5 text-xs text-slate-600 leading-relaxed space-y-1.5">
                      {report.weakWordingSuggestions.map((item, id) => (
                        <li key={id}>{item}</li>
                      ))}
                      {report.weakWordingSuggestions.length === 0 && (
                        <li className="text-emerald-600 list-none font-bold">✓ Perfect power-verbs detected throughout document!</li>
                      )}
                    </ul>
                  </div>

                  {/* Recommendations Category 2: Grammar suggestions */}
                  <div>
                    <h4 className="flex items-center gap-2 text-xs font-extrabold text-blue-700 bg-blue-50 border border-blue-100 px-3 py-1 rounded-xl uppercase tracking-wider mb-3">
                      <CheckCircle2 className="w-4 h-4 text-blue-500" /> Grammar & Structural suggestions
                    </h4>
                    <ul className="list-disc pl-5 text-xs text-slate-600 leading-relaxed space-y-1.5">
                      {report.grammarSuggestions.map((item, id) => (
                        <li key={id}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Recommendations Category 3: ATS compliance */}
                  <div>
                    <h4 className="flex items-center gap-2 text-xs font-extrabold text-indigo-700 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-xl uppercase tracking-wider mb-3">
                      <Target className="w-4 h-4 text-indigo-600" /> ATS Compatibility Fixes
                    </h4>
                    <ul className="list-disc pl-5 text-xs text-slate-600 leading-relaxed space-y-1.5">
                      {report.atsSuggestions.map((item, id) => (
                        <li key={id}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Recommendations Category 4: Suggested keywords */}
                  <div>
                    <h4 className="flex items-center gap-2 text-xs font-extrabold text-emerald-800 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-xl uppercase tracking-wider mb-3">
                      <Award className="w-4 h-4 text-emerald-600" /> Strategic Keyword Recommendations
                    </h4>
                    <ul className="list-disc pl-5 text-xs text-slate-600 leading-relaxed space-y-1.5">
                      {report.keyWordSuggestions.map((item, id) => (
                        <li key={id}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* FEATURE TAB 2: VACANCY DESCRIPTION MATCHER */}
      {!isLoading && activeTab === "match" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Paste Form panel left */}
          <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative flex flex-col justify-between min-h-[480px]">
            <form onSubmit={handleJobMatch} className="space-y-4 flex-1">
              <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider rounded">MATCH DETECTOR</span>
              <h3 className="font-extrabold text-[#0f172a] text-sm tracking-tight mb-2">Paste Job Description</h3>
              <p className="text-xs text-slate-500 leading-normal mb-4">
                We will match your resume credentials, skills, and titles with the pasting job listing to evaluate alignment.
              </p>

              <div>
                <textarea
                  rows={12}
                  className="w-full border border-slate-250 p-3 rounded-xl text-xs font-semibold focus:ring-1 focus:ring-emerald-500 leading-normal"
                  placeholder="Paste complete copy of target vacancy responsibilities, qualifications, and role outline here..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  required
                />
              </div>

              <div>
                <button
                  type="submit"
                  disabled={!jobDescription.trim()}
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md flex items-center justify-center gap-1.5 transition active:scale-95 disabled:opacity-45"
                >
                  <Target className="w-4 h-4" /> Compare CV with Vacancy
                </button>
              </div>
            </form>
          </div>

          {/* Results dashboard pane right */}
          <div className="lg:col-span-7">
            {matchReport === null ? (
              <div className="bg-slate-50 border border-dashed border-slate-350 rounded-3xl p-16 text-center shadow-inner h-full flex flex-col justify-center">
                <Clipboard className="w-10 h-10 text-slate-300 mx-auto mb-4" />
                <h4 className="text-sm font-extrabold text-slate-800">Analyzer Standby</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto leading-normal">
                  No scan reports available. Paste a vacancy description and click the match button to start.
                </p>
              </div>
            ) : (
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                {/* MATCH PERCENTAGE GRAPH */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50 border border-slate-100 p-5 rounded-2xl">
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900 leading-tight">Job Match Alignment Percentage</h4>
                    <p className="text-xs text-slate-500 mt-1">High compatibility increases candidate interview rates.</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`p-4 font-black font-mono text-xl border rounded-2xl text-center min-w-[76px] ${getScoreColor(matchReport.matchPercentage)}`}>
                      {matchReport.matchPercentage}%
                    </div>
                  </div>
                </div>

                {/* STRENGTH ANALYSIS */}
                <div>
                  <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest block mb-1">Qualitative Strengths Alignment Evaluation</h4>
                  <p className="text-xs text-slate-600 leading-relaxed text-justify bg-slate-50 border p-3 rounded-xl border-slate-150/70 font-semibold">{matchReport.strengthAnalysis}</p>
                </div>

                {/* EXTRACTED JD KEYWORDS */}
                <div>
                  <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest block mb-2">High Importance Vacancy Keywords</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {matchReport.extractedKeywords.map((tag, id) => (
                      <span key={id} className="bg-slate-100 text-slate-705 border border-slate-200/50 px-2 py-0.5 rounded text-[11px] font-bold">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* MISSING SKILLS LIST */}
                <div>
                  <h4 className="text-xs font-extrabold text-rose-800 uppercase tracking-widest block mb-2 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600" /> Key Missing or Weakly Represented skills
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {matchReport.missingSkills.map((tag, id) => (
                      <span key={id} className="bg-rose-50 text-rose-800 border border-rose-200 px-2.5 py-0.5 rounded text-[11px] font-bold uppercase">
                        {tag}
                      </span>
                    ))}
                    {matchReport.missingSkills.length === 0 && (
                      <span className="text-emerald-600 text-xs font-bold">✓ This CV matches all required technical expertise listings!</span>
                    )}
                  </div>
                </div>

                {/* SUGGESTED REWRITE SAMPLES */}
                <div>
                  <h4 className="text-xs font-extrabold text-blue-800 uppercase tracking-widest block mb-2">Suggested Bullet Additions / Improvements</h4>
                  <div className="space-y-2.5">
                    {matchReport.suggestedAdditions.map((item, id) => (
                      <div key={id} className="p-3 bg-blue-50/50 border border-blue-100 rounded-xl text-xs text-blue-900 leading-normal">
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
