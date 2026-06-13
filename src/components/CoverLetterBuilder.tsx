import React, { useState } from "react";
import { ResumeDocument, CoverLetterDocument } from "../types";
import { Sparkles, FileText, Loader, ArrowRight, Copy, Check, Printer, FileDown, Edit3 } from "lucide-react";

interface CoverLetterBuilderProps {
  initialLetter: CoverLetterDocument | null;
  resumeDoc: ResumeDocument;
  onSave: (doc: CoverLetterDocument) => void;
  onActivityLog: (details: string, type: any) => void;
  onExit: () => void;
}

export default function CoverLetterBuilder({
  initialLetter,
  resumeDoc,
  onSave,
  onActivityLog,
  onExit,
}: CoverLetterBuilderProps) {
  const [letter, setLetter] = useState<CoverLetterDocument>(
    initialLetter || {
      id: "letter_" + Date.now(),
      title: "New Cover Letter Draft",
      companyName: "",
      hiringManager: "",
      jobDescription: "",
      tone: "Professional",
      generatedContent: "",
      updatedAt: new Date().toISOString(),
    }
  );

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  // Call Gemini API to generate Cover Letter
  const handleGenerateCoverLetter = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch("/api/generate-cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeData: resumeDoc.data,
          companyName: letter.companyName,
          hiringManager: letter.hiringManager,
          jobDescription: letter.jobDescription,
          tone: letter.tone,
        }),
      });
      const data = await response.json();
      if (data.success && data.coverLetter) {
        setLetter((prev) => ({
          ...prev,
          generatedContent: data.coverLetter,
          updatedAt: new Date().toISOString(),
        }));
        onActivityLog(`AI generated a personalized ${letter.tone} cover letter for ${letter.companyName}`, "generate_cover");
      }
    } catch (err) {
      console.error("Failed to generate cover letter:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyClipboard = () => {
    if (!letter.generatedContent) return;
    navigator.clipboard.writeText(letter.generatedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
    onActivityLog(`Copied Cover Letter to Clipboard`, "download");
  };

  const handlePrint = () => {
    window.print();
    onActivityLog(`Printed Cover Letter`, "download");
  };

  // DOCX downloader simulation producing styled Word compatible HTML format
  const handleDownloadDocx = () => {
    if (!letter.generatedContent) return;
    
    const headerBlock = `
      <h1>${resumeDoc.data.personalInfo.name || "Your Name"}</h1>
      <p>${resumeDoc.data.personalInfo.title || "Professional Applicant"}</p>
      <p>Email: ${resumeDoc.data.personalInfo.email} | Phone: ${resumeDoc.data.personalInfo.phone}</p>
      <hr/>
    `;

    const htmlContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><title>Cover Letter - ${letter.companyName}</title>
      <style>
        body { font-family: Arial; font-size: 11pt; line-height: 1.5; color: #333333; }
        h1 { font-size: 18pt; margin-bottom: 0px; }
        hr { border: 1px solid #cccccc; }
      </style>
      </head>
      <body>
        ${headerBlock}
        <div style="margin-top: 20px; white-space: pre-line;">
          ${letter.generatedContent.replace(/\n/g, '<br/>')}
        </div>
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff' + htmlContent], {
      type: 'application/msword'
    });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Cover_Letter_${letter.companyName.replace(/\s+/g, '_') || "Draft"}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onActivityLog(`Downloaded Cover Letter as DOCX`, "download");
  };

  // Document Save callback
  const handleSaveDoc = () => {
    onSave(letter);
    onExit();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* HEADER SECTION */}
      <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-sm mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            Cover Letter Studio <Sparkles className="w-5 h-5 text-indigo-500" />
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Using experience records from: <strong className="text-blue-600">{resumeDoc.title}</strong>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSaveDoc}
            className="px-4 py-2 bg-indigo-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-indigo-700 shadow shadow-indigo-500/10 active:scale-95 transition"
          >
            Save Draft
          </button>
          <button
            onClick={onExit}
            className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-xs uppercase tracking-wider rounded-xl transition"
          >
            Exit Studio
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: PARAMETERS FORMS */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm min-h-[520px] flex flex-col justify-between">
          <form onSubmit={handleGenerateCoverLetter} className="space-y-4">
            <span className="bg-indigo-50 text-[#312e81] border border-indigo-200 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider rounded">bespoke letter</span>
            <h3 className="font-extrabold text-slate-905 text-sm tracking-tight mb-2">Build Target parameters</h3>

            <div>
              <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1">Company Name</label>
              <input
                type="text"
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold focus:ring-1 focus:ring-indigo-500"
                value={letter.companyName}
                onChange={(e) => setLetter((prev) => ({ ...prev, companyName: e.target.value }))}
                placeholder="e.g. Stripe, Inc."
                required
              />
            </div>

            <div>
              <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1">Hiring Manager / Team Title (optional)</label>
              <input
                type="text"
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold focus:ring-1 focus:ring-indigo-500"
                value={letter.hiringManager}
                onChange={(e) => setLetter((prev) => ({ ...prev, hiringManager: e.target.value }))}
                placeholder="e.g. Recruiting Operations Team Coordinator"
              />
            </div>

            {/* TONE SELECTION BUTTONS */}
            <div>
              <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block mb-2">Selected copywriting Tone</label>
              <div className="flex gap-2">
                {[
                  { value: "Professional", label: "🏢 Professional" },
                  { value: "Friendly", label: "🤝 Friendly / Sincere" },
                  { value: "Confident", label: "⚡ Confident / Strong" }
                ].map((tone) => (
                  <button
                    key={tone.value}
                    type="button"
                    onClick={() => setLetter((prev) => ({ ...prev, tone: tone.value as any }))}
                    className={`flex-1 text-center py-2.5 border rounded-xl text-xs font-bold transition ${letter.tone === tone.value ? "border-indigo-600 bg-indigo-50 text-[#312e81] font-sans" : "border-slate-200 hover:border-slate-350 bg-white"}`}
                  >
                    {tone.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1">Target Vacancy Description details</label>
              <textarea
                rows={6}
                className="w-full border border-slate-200 rounded-xl p-3 text-xs leading-normal font-medium focus:ring-1 focus:ring-indigo-500"
                value={letter.jobDescription}
                onChange={(e) => setLetter((prev) => ({ ...prev, jobDescription: e.target.value }))}
                placeholder="Paste key responsibilities or target job specs here to focus the AI pitch..."
                required
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading || !letter.companyName}
                className="w-full py-4 bg-slate-900 hover:bg-slate-950 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md flex items-center justify-center gap-2 transition active:scale-95 disabled:opacity-45"
              >
                {isLoading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin text-slate-100" /> Compiling bespoken copywriter letter...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" /> Create bespoke Letter with AI
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* RIGHT COLUMN: RECIPIENT LETTER PAPER RENDER */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex justify-between items-center bg-white border border-slate-200 rounded-xl p-3 text-xs font-semibold select-none shadow-sm font-sans gap-2">
            <span className="flex items-center gap-1.5"><FileText className="w-4 h-4 text-indigo-500" /> A4 Physical Letter Sheet</span>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsEditMode(!isEditMode)}
                className={`p-1.5 rounded-lg border transition ${isEditMode ? "bg-amber-50 border-amber-250 text-amber-800 font-sans" : "border-slate-200 hover:border-slate-300"}`}
                title="Manual Edit Mode"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={handleCopyClipboard}
                disabled={!letter.generatedContent}
                className="p-1.5 rounded-lg border border-slate-200 hover:border-slate-300 transition flex items-center gap-1 text-slate-600 disabled:opacity-40"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500 font-bold" /> : <Copy className="w-4 h-4" />}
                Copy Text
              </button>
              <button
                onClick={handlePrint}
                disabled={!letter.generatedContent}
                className="p-1.5 rounded-lg border border-slate-200 hover:border-slate-300 transition text-slate-600 disabled:opacity-40"
                title="Print Letter"
              >
                <Printer className="w-4 h-4" />
              </button>
              <button
                onClick={handleDownloadDocx}
                disabled={!letter.generatedContent}
                className="p-1.5 rounded-lg bg-blue-50/60 border border-blue-200 hover:bg-blue-100/60 transition text-blue-700 text-xs font-bold flex items-center gap-1 disabled:opacity-40"
                title="Download as Word DOC"
              >
                <FileDown className="w-3.5 h-3.5" />
                Word DOC
              </button>
            </div>
          </div>

          <div id="print-cover-letter-area" className="bg-white border border-slate-200 shadow-md p-10 font-sans text-gray-800 leading-relaxed text-justify max-w-4xl min-h-[580px] rounded-lg relative print:border-none print:shadow-none print:p-0">
            {/* SENDER ADDRESS WRITER */}
            <div className="border-b border-gray-150 pb-4 mb-6">
              <h2 className="text-xl font-bold text-gray-900 tracking-tight">{resumeDoc.data.personalInfo.name || "Tariq Ali"}</h2>
              <p className="text-xs font-semibold text-indigo-700 uppercase tracking-wider mt-0.5">{resumeDoc.data.personalInfo.title || "Applicant Developer"}</p>
              <div className="text-[11px] text-gray-500 font-medium space-x-1 flex flex-wrap mt-2">
                <span>📧 {resumeDoc.data.personalInfo.email} </span>
                {resumeDoc.data.personalInfo.phone && <span> | 📱 {resumeDoc.data.personalInfo.phone} </span>}
                {resumeDoc.data.personalInfo.address && <span> | 📍 {resumeDoc.data.personalInfo.address}</span>}
              </div>
            </div>

            {/* DATE & HEADING RECIPIENT */}
            <div className="text-xs text-gray-500 font-bold mb-4 font-mono">{new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</div>
            
            <div className="text-xs space-y-0.5 text-gray-700 font-medium mb-6">
              <p className="font-extrabold uppercase tracking-wide text-gray-500">To the Recipient:</p>
              <p className="font-bold">{letter.hiringManager || "Hiring Specialist Team Coordination Lead"}</p>
              <p className="font-semibold text-indigo-700">{letter.companyName || "Employer Brand Coordinator"}</p>
            </div>

            {/* LETTER TEXT LINES AREA */}
            <div className="text-xs leading-6 text-gray-700 text-justify font-sans">
              {isEditMode ? (
                <textarea
                  rows={20}
                  className="w-full border border-slate-200/80 p-3 rounded-lg text-xs font-semibold focus:ring-1 focus:ring-indigo-500 leading-relaxed text-justify"
                  value={letter.generatedContent}
                  onChange={(e) => setLetter((prev) => ({ ...prev, generatedContent: e.target.value }))}
                />
              ) : (
                <div className="whitespace-pre-line leading-relaxed text-justify">
                  {letter.generatedContent || (
                    <p className="text-slate-400 italic">No message drafted yet. Fill target values on the left form panel and click the generate button to start copywriting bespoke career letters.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
