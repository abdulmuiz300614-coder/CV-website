import React, { useState } from "react";
import { ResumeData, ResumeDocument, TemplateType } from "../types";
import ResumeTemplates from "./ResumeTemplates";
import { 
  ArrowLeft, ArrowRight, Save, Sparkles, Plus, Trash2, 
  HelpCircle, Check, Loader, LayoutTemplate, Copy, FileText, CheckCircle2 
} from "lucide-react";

interface ResumeWizardProps {
  initialDoc: ResumeDocument;
  onSave: (doc: ResumeDocument) => void;
  onExit: () => void;
}

export default function ResumeWizard({ initialDoc, onSave, onExit }: ResumeWizardProps) {
  const [doc, setDoc] = useState<ResumeDocument>(initialDoc);
  const [activeStep, setActiveStep] = useState<number>(1);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [yearsOfExp, setYearsOfExp] = useState<string>("3");
  const [bgInfo, setBgInfo] = useState<string>("");

  // Sub-items states for list keys
  const [newSkill, setNewSkill] = useState<string>("");
  const [newCert, setNewCert] = useState<string>("");
  const [newLang, setNewLang] = useState<string>("");

  // AI Recommended skills
  const [recommendedSkills, setRecommendedSkills] = useState<string[]>([]);
  const [improvedBullets, setImprovedBullets] = useState<{ [key: string]: string }>({});

  const updatePersonalInfo = (field: string, value: string) => {
    setDoc((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        personalInfo: {
          ...prev.data.personalInfo,
          [field]: value,
        },
      },
    }));
  };

  const updateSummary = (value: string) => {
    setDoc((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        summary: value,
      },
    }));
  };

  const handleTemplateChange = (type: TemplateType) => {
    setDoc((prev) => ({
      ...prev,
      templateType: type,
    }));
  };

  // --- EXPERIENCE OPERATIONS ---
  const addExperience = () => {
    const newItem = {
      id: "exp_" + Date.now(),
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      current: false,
      responsibilities: "",
    };
    setDoc((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        experience: [...prev.data.experience, newItem],
      },
    }));
  };

  const updateExperience = (id: string, field: string, value: any) => {
    setDoc((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        experience: prev.data.experience.map((item) =>
          item.id === id ? { ...item, [field]: value } : item
        ),
      },
    }));
  };

  const deleteExperience = (id: string) => {
    setDoc((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        experience: prev.data.experience.filter((item) => item.id !== id),
      },
    }));
  };

  // AI IMPROVE EXPERIENCE BULLET POINT
  const improveBulletPoint = async (expId: string, currentVal: string) => {
    if (!currentVal.trim()) return;
    setIsAiLoading(true);
    try {
      const response = await fetch("/api/improve-bullet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bulletPoint: currentVal,
          targetRole: doc.data.personalInfo.title,
        }),
      });
      const data = await response.json();
      if (data.success && data.improvedBullet) {
        updateExperience(expId, "responsibilities", data.improvedBullet);
      }
    } catch (error) {
      console.error("Failed to improve bullet:", error);
    } finally {
      setIsAiLoading(false);
    }
  };

  // --- EDUCATION OPERATIONS ---
  const addEducation = () => {
    const newItem = {
      id: "edu_" + Date.now(),
      institution: "",
      degree: "",
      graduationDate: "",
    };
    setDoc((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        education: [...prev.data.education, newItem],
      },
    }));
  };

  const updateEducation = (id: string, field: string, value: string) => {
    setDoc((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        education: prev.data.education.map((item) =>
          item.id === id ? { ...item, [field]: value } : item
        ),
      },
    }));
  };

  const deleteEducation = (id: string) => {
    setDoc((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        education: prev.data.education.filter((item) => item.id !== id),
      },
    }));
  };

  // --- PROJECTS OPERATIONS ---
  const addProject = () => {
    const newItem = {
      id: "proj_" + Date.now(),
      title: "",
      description: "",
      technologies: "",
    };
    setDoc((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        projects: [...prev.data.projects, newItem],
      },
    }));
  };

  const updateProject = (id: string, field: string, value: string) => {
    setDoc((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        projects: prev.data.projects.map((item) =>
          item.id === id ? { ...item, [field]: value } : item
        ),
      },
    }));
  };

  const deleteProject = (id: string) => {
    setDoc((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        projects: prev.data.projects.filter((item) => item.id !== id),
      },
    }));
  };

  // --- SKILLS LIST ---
  const handleAddSkill = (skillText?: string) => {
    const item = (skillText || newSkill).trim();
    if (!item) return;

    if (!doc.data.skills.includes(item)) {
      setDoc((prev) => ({
        ...prev,
        data: {
          ...prev.data,
          skills: [...prev.data.skills, item],
        },
      }));
    }
    setNewSkill("");
    if (skillText) {
      setRecommendedSkills((prev) => prev.filter((s) => s !== skillText));
    }
  };

  const handleDeleteSkill = (skill: string) => {
    setDoc((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        skills: prev.data.skills.filter((s) => s !== skill),
      },
    }));
  };

  // --- CERTIFICATIONS LIST ---
  const handleAddCert = () => {
    const item = newCert.trim();
    if (!item) return;
    if (!doc.data.certifications.includes(item)) {
      setDoc((prev) => ({
        ...prev,
        data: {
          ...prev.data,
          certifications: [...prev.data.certifications, item],
        },
      }));
    }
    setNewCert("");
  };

  const handleDeleteCert = (cert: string) => {
    setDoc((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        certifications: prev.data.certifications.filter((c) => c !== cert),
      },
    }));
  };

  // --- LANGUAGES LIST ---
  const handleAddLang = () => {
    const item = newLang.trim();
    if (!item) return;
    if (!doc.data.languages.includes(item)) {
      setDoc((prev) => ({
        ...prev,
        data: {
          ...prev.data,
          languages: [...prev.data.languages, item],
        },
      }));
    }
    setNewLang("");
  };

  const handleDeleteLang = (lang: string) => {
    setDoc((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        languages: prev.data.languages.filter((l) => l !== lang),
      },
    }));
  };

  // --- AI GENERATIONS / CALLS ---
  const generateAiSummary = async () => {
    setIsAiLoading(true);
    try {
      const response = await fetch("/api/generate-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          yearsOfExperience: yearsOfExp,
          targetRole: doc.data.personalInfo.title,
          skills: doc.data.skills,
          backgroundInfo: bgInfo,
        }),
      });
      const data = await response.json();
      if (data.success && data.summary) {
        updateSummary(data.summary);
      }
    } catch (error) {
      console.error("Failed to generate AI summary:", error);
    } finally {
      setIsAiLoading(false);
    }
  };

  const getSkillRecommendations = async () => {
    if (!doc.data.personalInfo.title) return;
    setIsAiLoading(true);
    try {
      const response = await fetch("/api/recommend-skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetRole: doc.data.personalInfo.title,
          currentSkills: doc.data.skills,
        }),
      });
      const data = await response.json();
      if (data.success && data.recommendedSkills) {
        setRecommendedSkills(data.recommendedSkills);
      }
    } catch (error) {
      console.error("Failed to fetch skill recommendations:", error);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleGlobalSave = () => {
    onSave(doc);
    onExit();
  };

  const stepsList = [
    "Personal Info",
    "AI Summary",
    "Experience",
    "Education",
    "Skills",
    "Certifications",
    "Languages",
    "Projects"
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* 1. STATUS BAR */}
      <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onExit}
            className="p-2 hover:bg-slate-50 border border-slate-200 rounded-lg text-slate-500 hover:text-slate-700 transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-sm font-extrabold text-slate-900 truncate">Editing: {doc.title}</h2>
            <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Step {activeStep} of {stepsList.length} — {stepsList[activeStep - 1]}</p>
          </div>
        </div>

        {/* Change Templates toolbar */}
        <div className="flex items-center gap-2.5">
          <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <LayoutTemplate className="w-3.5 h-3.5" /> Preset Layout:
          </label>
          <select
            value={doc.templateType}
            onChange={(e) => handleTemplateChange(e.target.value as TemplateType)}
            className="border border-slate-250 bg-slate-50 p-1.5 px-2.5 text-xs font-semibold rounded-lg text-slate-700 cursor-pointer"
          >
            <option value="modern">Modern Professional</option>
            <option value="executive">Executive Gutter</option>
            <option value="minimal">Minimalist Style</option>
            <option value="corporate">Corporate Standard</option>
            <option value="creative">Creative Splice</option>
            <option value="student">Student/Academic</option>
          </select>
          <button
            onClick={handleGlobalSave}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider px-4 py-2 rounded-xl shadow-md flex items-center gap-1 transition active:scale-95"
          >
            <Save className="w-3.5 h-3.5" /> Save Done
          </button>
        </div>
      </div>

      {/* 2. CHIP NAVIGATION STEPS */}
      <div className="hidden sm:flex gap-1 bg-slate-100 p-1 rounded-xl mb-6">
        {stepsList.map((step, idx) => {
          const sNum = idx + 1;
          return (
            <button
              key={idx}
              onClick={() => setActiveStep(sNum)}
              className={`flex-1 text-center py-2 text-[10px] font-extrabold uppercase tracking-wider rounded-lg transition ${activeStep === sNum ? "bg-white text-blue-600 shadow-sm border border-slate-200/50 font-sans" : "transparent text-slate-500 hover:text-slate-800"}`}
            >
              {sNum}. {step}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COMPONENT: FORM BUILDER STEPS */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm min-h-[580px] flex flex-col justify-between">
          <div>
            {/* STEP 1: PERSONAL DETAILS */}
            {activeStep === 1 && (
              <div className="space-y-4">
                <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider rounded">PERSONAL INFORMATION</span>
                <h3 className="font-extrabold text-base text-slate-900 tracking-tight">Main Contacts</h3>
                
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1">Full Name</label>
                    <input
                      type="text"
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:ring-1 focus:ring-blue-500"
                      value={doc.data.personalInfo.name}
                      onChange={(e) => updatePersonalInfo("name", e.target.value)}
                      placeholder="e.g. Tariq Ali"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1">Professional Title</label>
                    <input
                      type="text"
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:ring-1 focus:ring-blue-500"
                      value={doc.data.personalInfo.title}
                      onChange={(e) => updatePersonalInfo("title", e.target.value)}
                      placeholder="e.g. Lead Software Engineer"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1">Email</label>
                      <input
                        type="email"
                        className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:ring-1 focus:ring-blue-500"
                        value={doc.data.personalInfo.email}
                        onChange={(e) => updatePersonalInfo("email", e.target.value)}
                        placeholder="abdul.muiz300614@gmail.com"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1">Phone</label>
                      <input
                        type="text"
                        className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:ring-1 focus:ring-blue-500"
                        value={doc.data.personalInfo.phone}
                        onChange={(e) => updatePersonalInfo("phone", e.target.value)}
                        placeholder="+1 555-893-2983"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1">Location Address</label>
                    <input
                      type="text"
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:ring-1 focus:ring-blue-500"
                      value={doc.data.personalInfo.address}
                      onChange={(e) => updatePersonalInfo("address", e.target.value)}
                      placeholder="San Francisco, CA"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">LinkedIn Username</label>
                      <input
                        type="text"
                        className="w-full border border-slate-200 rounded-xl px-2.5 py-2 text-xs font-semibold focus:ring-1 focus:ring-blue-500"
                        value={doc.data.personalInfo.linkedin}
                        onChange={(e) => updatePersonalInfo("linkedin", e.target.value)}
                        placeholder="tariqali"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">GitHub User</label>
                      <input
                        type="text"
                        className="w-full border border-slate-200 rounded-xl px-2.5 py-2 text-xs font-semibold focus:ring-1 focus:ring-blue-500"
                        value={doc.data.personalInfo.github}
                        onChange={(e) => updatePersonalInfo("github", e.target.value)}
                        placeholder="tariqali"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">Portfolio link</label>
                      <input
                        type="text"
                        className="w-full border border-slate-200 rounded-xl px-2.5 py-2 text-xs font-semibold focus:ring-1 focus:ring-blue-500"
                        value={doc.data.personalInfo.portfolio}
                        onChange={(e) => updatePersonalInfo("portfolio", e.target.value)}
                        placeholder="tariq.dev"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: PROFESSIONAL SUMMARY */}
            {activeStep === 2 && (
              <div className="space-y-4">
                <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider rounded">PROFESSIONAL SUMMARY</span>
                <h3 className="font-extrabold text-base text-slate-900 tracking-tight">AI Summary Generator</h3>
                
                <div className="bg-slate-50/80 p-4 border border-slate-200 rounded-2xl text-xs space-y-4">
                  <p className="text-slate-500 leading-relaxed font-semibold">
                    Customize parameters below and hit "Generate with AI" to let Gemini formulate a compelling 60-100 word ATS summary.
                  </p>
                  
                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wide block mb-1">Years of Experience</label>
                      <input
                        type="number"
                        className="border border-slate-200 bg-white rounded-lg px-2 py-1 text-xs font-semibold w-20 focus:ring-1 focus:ring-blue-500"
                        value={yearsOfExp}
                        onChange={(e) => setYearsOfExp(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wide block mb-1">Key Context / Achievements (optional)</label>
                      <textarea
                        rows={3}
                        className="w-full border border-slate-200 bg-white rounded-lg p-2 text-xs leading-normal font-medium focus:ring-1 focus:ring-blue-500"
                        value={bgInfo}
                        onChange={(e) => setBgInfo(e.target.value)}
                        placeholder="e.g. Migrated databases to Kubernetes, boosted deployment operations speeds, led 4 senior reps."
                      />
                    </div>
                  </div>

                  <button
                    onClick={generateAiSummary}
                    disabled={isAiLoading}
                    className="w-full bg-slate-900 hover:bg-slate-950 text-white font-bold text-xs uppercase tracking-wider py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 active:scale-95"
                  >
                    {isAiLoading ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin text-slate-100" /> Formulating Resume Summary...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-emerald-400" /> Generate Summary with AI
                      </>
                    )}
                  </button>
                </div>

                <div>
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1">Resume Summary Box</label>
                  <textarea
                    rows={6}
                    className="w-full border border-slate-200 rounded-xl p-3 text-xs leading-normal font-medium focus:ring-1 focus:ring-blue-500"
                    value={doc.data.summary}
                    onChange={(e) => updateSummary(e.target.value)}
                    placeholder="Enter manual resume profile summary or use AI tool above."
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block text-right">Words: {doc.data.summary.split(/\s+/).filter(Boolean).length}</span>
                </div>
              </div>
            )}

            {/* STEP 3: WORK EXPERIENCE */}
            {activeStep === 3 && (
              <div className="space-y-4">
                <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider rounded">EXPERIENCE HISTORY</span>
                <div className="flex justify-between items-center">
                  <h3 className="font-extrabold text-base text-slate-900 tracking-tight">Work Experience</h3>
                  <button
                    onClick={addExperience}
                    className="bg-blue-50 hover:bg-blue-100 text-blue-700 font-extrabold text-xs uppercase tracking-wider px-3 py-1.5 rounded-lg transition border border-blue-200"
                  >
                    + Add Role
                  </button>
                </div>

                <div className="space-y-6 max-h-[420px] overflow-y-auto pr-1">
                  {doc.data.experience.map((exp, idx) => (
                    <div key={exp.id} className="p-4 bg-slate-50 border border-slate-200/60 rounded-2xl relative space-y-3">
                      <button
                        onClick={() => deleteExperience(exp.id)}
                        className="absolute top-3 right-3 text-slate-400 hover:text-rose-600 transition"
                        title="Remove role"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Position Item #{idx + 1}</p>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[9px] font-bold text-slate-500 block mb-0.5">Company</label>
                          <input
                            type="text"
                            className="bg-white border border-slate-250 w-full px-2.5 py-1 text-xs font-semibold rounded-lg"
                            value={exp.company}
                            onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
                            placeholder="InnovateTech"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] font-bold text-slate-500 block mb-0.5">Title / Position</label>
                          <input
                            type="text"
                            className="bg-white border border-slate-250 w-full px-2.5 py-1 text-xs font-semibold rounded-lg"
                            value={exp.position}
                            onChange={(e) => updateExperience(exp.id, "position", e.target.value)}
                            placeholder="Developer"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[9px] font-bold text-slate-500 block mb-0.5">Start Date</label>
                          <input
                            type="text"
                            className="bg-white border border-slate-250 w-full px-2.5 py-1 text-xs font-semibold rounded-lg"
                            value={exp.startDate}
                            onChange={(e) => updateExperience(exp.id, "startDate", e.target.value)}
                            placeholder="June 2023"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] font-bold text-slate-500 block mb-0.5">End Date</label>
                          <input
                            type="text"
                            className="bg-white border border-slate-250 w-full px-2.5 py-1 text-xs font-semibold rounded-lg"
                            value={exp.endDate}
                            disabled={exp.current}
                            onChange={(e) => updateExperience(exp.id, "endDate", e.target.value)}
                            placeholder="Present"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 py-1">
                        <input
                          type="checkbox"
                          id={`current-${exp.id}`}
                          checked={exp.current}
                          onChange={(e) => updateExperience(exp.id, "current", e.target.checked)}
                          className="rounded border-slate-300 focus:ring-blue-500 text-blue-600 cursor-pointer"
                        />
                        <label htmlFor={`current-${exp.id}`} className="text-[10px] font-bold text-slate-500 cursor-pointer uppercase select-none">I currently work here</label>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="text-[9px] font-bold text-slate-500">Responsibilities (One bullet per line)</label>
                          <button
                            onClick={() => improveBulletPoint(exp.id, exp.responsibilities)}
                            disabled={isAiLoading || !exp.responsibilities.trim()}
                            className="text-[#2563eb] hover:text-blue-700 text-[10px] font-extrabold uppercase flex items-center gap-1 transition"
                            title="Improve bullet point phrasing with AI and action achievements"
                          >
                            <Sparkles className="w-3 h-3" /> Improve bullet points
                          </button>
                        </div>
                        <textarea
                          rows={4}
                          className="bg-white border border-slate-250 w-full p-2.5 text-xs font-semibold rounded-lg focus:ring-1 focus:ring-blue-500 leading-normal"
                          value={exp.responsibilities}
                          onChange={(e) => updateExperience(exp.id, "responsibilities", e.target.value)}
                          placeholder="• Answered customer emails&#10;• Assisted dev operations"
                        />
                      </div>
                    </div>
                  ))}

                  {doc.data.experience.length === 0 && (
                    <p className="text-center p-8 text-xs italic text-slate-400">No roles added yet. Click "+ Add Role" to start experience tracking.</p>
                  )}
                </div>
              </div>
            )}

            {/* STEP 4: EDUCATION */}
            {activeStep === 4 && (
              <div className="space-y-4">
                <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider rounded">EDUCATION HISTORY</span>
                <div className="flex justify-between items-center">
                  <h3 className="font-extrabold text-base text-slate-900 tracking-tight">Academic Education</h3>
                  <button
                    onClick={addEducation}
                    className="bg-blue-50 hover:bg-blue-100 text-blue-700 font-extrabold text-xs uppercase tracking-wider px-3 py-1.5 rounded-lg transition border border-blue-200"
                  >
                    + Add Education
                  </button>
                </div>

                <div className="space-y-4 max-h-[420px] overflow-y-auto">
                  {doc.data.education.map((edu, idx) => (
                    <div key={edu.id} className="p-4 bg-slate-50 border border-slate-200/60 rounded-2xl relative space-y-3">
                      <button
                        onClick={() => deleteEducation(edu.id)}
                        className="absolute top-3 right-3 text-slate-400 hover:text-rose-600 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Institution #{idx + 1}</p>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[9px] font-bold text-slate-500 block mb-0.5">School / University ID</label>
                          <input
                            type="text"
                            className="bg-white border border-slate-250 w-full px-2.5 py-1.5 text-xs font-semibold rounded-lg"
                            value={edu.institution}
                            onChange={(e) => updateEducation(edu.id, "institution", e.target.value)}
                            placeholder="e.g. Stanford University"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] font-bold text-slate-500 block mb-0.5">Degree / Certification</label>
                          <input
                            type="text"
                            className="bg-white border border-slate-250 w-full px-2.5 py-1.5 text-xs font-semibold rounded-lg"
                            value={edu.degree}
                            onChange={(e) => updateEducation(edu.id, "degree", e.target.value)}
                            placeholder="B.S. Computer Science"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[9px] font-bold text-slate-500 block mb-0.5">Graduation Date</label>
                          <input
                            type="text"
                            className="bg-white border border-slate-250 w-full px-2.5 py-1.5 text-xs font-semibold rounded-lg"
                            value={edu.graduationDate}
                            onChange={(e) => updateEducation(edu.id, "graduationDate", e.target.value)}
                            placeholder="May 2024"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] font-bold text-slate-500 block mb-0.5">GPA (optional)</label>
                          <input
                            type="text"
                            className="bg-white border border-slate-250 w-full px-2.5 py-1.5 text-xs font-semibold rounded-lg"
                            value={edu.gpa}
                            onChange={(e) => updateEducation(edu.id, "gpa", e.target.value)}
                            placeholder="3.8 / 4.0"
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  {doc.data.education.length === 0 && (
                    <p className="text-center p-8 text-xs italic text-slate-400">No schools added. Click "+ Add Education" to trace academics.</p>
                  )}
                </div>
              </div>
            )}

            {/* STEP 5: SKILLS */}
            {activeStep === 5 && (
              <div className="space-y-4">
                <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider rounded">SKILLS AND EXPERTISE</span>
                <h3 className="font-extrabold text-base text-slate-900 tracking-tight">Key Skills Registry</h3>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    className="border border-slate-200 text-xs px-3 py-2 rounded-xl flex-1 font-semibold focus:ring-1 focus:ring-blue-500"
                    placeholder="e.g. Docker, TypeScript"
                    onKeyDown={(e) => e.key === "Enter" && handleAddSkill()}
                  />
                  <button
                    onClick={() => handleAddSkill()}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold uppercase tracking-wider px-4 py-2 rounded-xl transition"
                  >
                    Add
                  </button>
                </div>

                {/* AI RECOMMENDATION TRIGGERS */}
                <div className="bg-slate-50 border border-slate-150 p-4 rounded-2xl">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">AI Skill Advisor</span>
                    <button
                      onClick={getSkillRecommendations}
                      className="text-xs font-extrabold text-blue-650 flex items-center gap-1 hover:text-blue-800 transition"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-blue-550" /> Recommend Skills
                    </button>
                  </div>

                  {recommendedSkills.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {recommendedSkills.map((s, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleAddSkill(s)}
                          className="bg-blue-100 hover:bg-blue-200 text-blue-800 text-[10px] font-bold px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 border border-blue-200"
                        >
                          + {s}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[10px] text-slate-400 italic">Hit "Recommend Skills" (based on your profile title) to list essential hard & soft keywords.</p>
                  )}
                </div>

                {/* CURRENT SKILLS LIST */}
                <div className="space-y-2 pt-2">
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1">Your Registered Skills ({doc.data.skills.length})</label>
                  <div className="flex flex-wrap gap-1.5 max-h-[160px] overflow-y-auto p-1 border border-slate-100 rounded-lg">
                    {doc.data.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="bg-slate-105 border border-slate-200/50 text-slate-800 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1"
                      >
                        {skill}
                        <button
                          onClick={() => handleDeleteSkill(skill)}
                          className="text-slate-400 hover:text-rose-500 font-bold ml-1 text-[11px]"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                    {doc.data.skills.length === 0 && (
                      <p className="text-xs italic text-slate-400 p-2">Empty skill bank. Key in or hit recommendation widgets.</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 6: CERTIFICATIONS */}
            {activeStep === 6 && (
              <div className="space-y-4">
                <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider rounded">CREDENTIALS</span>
                <h3 className="font-extrabold text-base text-slate-900 tracking-tight">Certifications & Accreditations</h3>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCert}
                    onChange={(e) => setNewCert(e.target.value)}
                    className="border border-slate-200 text-xs px-3 py-2 rounded-xl flex-1 font-semibold focus:ring-1 focus:ring-blue-500"
                    placeholder="AWS Solutions Architect Associate"
                    onKeyDown={(e) => e.key === "Enter" && handleAddCert()}
                  />
                  <button
                    onClick={handleAddCert}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold uppercase tracking-wider px-4 py-2 rounded-xl"
                  >
                    Add
                  </button>
                </div>

                <div className="space-y-2 pt-2">
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1">Your Certifications List</label>
                  <div className="divide-y divide-slate-100 border border-slate-150 rounded-xl overflow-hidden bg-slate-50/20 max-h-[220px] overflow-y-auto">
                    {doc.data.certifications.map((cert, idx) => (
                      <div key={idx} className="p-3 flex justify-between items-center text-xs font-semibold text-slate-800 hover:bg-slate-55/40">
                        <span>{cert}</span>
                        <button
                          onClick={() => handleDeleteCert(cert)}
                          className="text-slate-400 hover:text-rose-600 font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                    {doc.data.certifications.length === 0 && (
                      <p className="text-xs italic text-slate-400 p-6 text-center">No certifications specified yet.</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 7: LANGUAGES */}
            {activeStep === 7 && (
              <div className="space-y-4">
                <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider rounded">LANGUAGES GLOBAL</span>
                <h3 className="font-extrabold text-base text-slate-900 tracking-tight">Languages</h3>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newLang}
                    onChange={(e) => setNewLang(e.target.value)}
                    className="border border-slate-200 text-xs px-3 py-2 rounded-xl flex-1 font-semibold focus:ring-1 focus:ring-blue-500"
                    placeholder="e.g. English (Fluent)"
                    onKeyDown={(e) => e.key === "Enter" && handleAddLang()}
                  />
                  <button
                    onClick={handleAddLang}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold uppercase tracking-wider px-4 py-2 rounded-xl"
                  >
                    Add
                  </button>
                </div>

                <div className="space-y-2 pt-2">
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1">Languages list</label>
                  <div className="divide-y divide-slate-105 border border-slate-150 rounded-xl overflow-hidden bg-slate-50/20 max-h-[220px] overflow-y-auto">
                    {doc.data.languages.map((lang, idx) => (
                      <div key={idx} className="p-3 flex justify-between items-center text-xs font-semibold text-slate-800 hover:bg-slate-55/40">
                        <span>{lang}</span>
                        <button
                          onClick={() => handleDeleteLang(lang)}
                          className="text-slate-400 hover:text-rose-600"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    {doc.data.languages.length === 0 && (
                      <p className="text-xs italic text-slate-400 p-6 text-center">No languages added yet.</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 8: PROJECTS */}
            {activeStep === 8 && (
              <div className="space-y-4">
                <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider rounded">PORTFOLIO PORT</span>
                <div className="flex justify-between items-center">
                  <h3 className="font-extrabold text-base text-slate-900 tracking-tight">Key Projects</h3>
                  <button
                    onClick={addProject}
                    className="bg-blue-50 hover:bg-blue-100 text-blue-700 font-extrabold text-xs uppercase tracking-wider px-3 py-1.5 rounded-lg transition border border-blue-200"
                  >
                    + Add Project
                  </button>
                </div>

                <div className="space-y-4 max-h-[420px] overflow-y-auto">
                  {doc.data.projects.map((proj, idx) => (
                    <div key={proj.id} className="p-4 bg-slate-50 border border-slate-205 rounded-2xl relative space-y-3">
                      <button
                        onClick={() => deleteProject(proj.id)}
                        className="absolute top-3 right-3 text-slate-400 hover:text-rose-600 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Project #{idx + 1}</p>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[9px] font-bold text-slate-600 block mb-0.5">Project Title</label>
                          <input
                            type="text"
                            className="bg-white border border-slate-250 w-full px-2.5 py-1.5 text-xs font-semibold rounded-lg"
                            value={proj.title}
                            onChange={(e) => updateProject(proj.id, "title", e.target.value)}
                            placeholder="Quantum Cloud Orchestrator"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] font-bold text-slate-600 block mb-0.5">Demo Link (optional)</label>
                          <input
                            type="text"
                            className="bg-white border border-slate-250 w-full px-2.5 py-1.5 text-xs font-semibold rounded-lg"
                            value={proj.link}
                            onChange={(e) => updateProject(proj.id, "link", e.target.value)}
                            placeholder="https://tariq.com/project"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-2">
                        <div>
                          <label className="text-[9px] font-bold text-slate-600 block mb-0.5">Technologies Used</label>
                          <input
                            type="text"
                            className="bg-white border border-slate-250 w-full px-2.5 py-1.5 text-xs font-semibold rounded-lg"
                            value={proj.technologies}
                            onChange={(e) => updateProject(proj.id, "technologies", e.target.value)}
                            placeholder="React, TypeScript, AWS, Docker"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] font-bold text-slate-600 block mb-0.5">Project Description</label>
                          <textarea
                            rows={3}
                            className="bg-white border border-slate-250 w-full p-2.5 text-xs font-semibold rounded-lg"
                            value={proj.description}
                            onChange={(e) => updateProject(proj.id, "description", e.target.value)}
                            placeholder="Briefly describe what you built, scope of challenges and achievements solved."
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  {doc.data.projects.length === 0 && (
                    <p className="text-center p-8 text-xs italic text-slate-400">No projects listed. Click "+ Add Project" to demonstrate engineering skills.</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* LOWER FIXED BUTTON BAR */}
          <div className="flex justify-between items-center pt-6 mt-6 border-t border-slate-100 gap-4">
            <button
              disabled={activeStep === 1}
              onClick={() => setActiveStep((p) => Math.max(1, p - 1))}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 rounded-xl text-slate-600 text-xs font-bold uppercase transition"
            >
              Back Step
            </button>
            <div className="text-xs text-slate-400 font-bold uppercase">{activeStep} / {stepsList.length}</div>
            <button
              disabled={activeStep === stepsList.length}
              onClick={() => setActiveStep((p) => Math.min(stepsList.length, p + 1))}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-950 text-white rounded-xl text-xs font-bold uppercase transition"
            >
              Next Step
            </button>
          </div>
        </div>

        {/* RIGHT COMPONENT: LIVE HIGH-FIDELITY PREVIEW MOCK */}
        <div className="lg:col-span-7 bg-slate-100/70 rounded-3xl p-4 sm:p-6 border border-slate-200/80 shadow-inner sticky top-[80px] max-h-[85vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4 text-xs font-extrabold text-slate-500 uppercase tracking-wider select-none bg-white/65 p-3 rounded-xl border border-slate-150/40">
            <span className="flex items-center gap-1"><FileText className="w-4 h-4 text-blue-500" /> Print-Ready Canvas</span>
            <span className="text-blue-600 tracking-wide font-sans text-[10px] border border-blue-200 bg-blue-50 px-2 py-0.5 rounded-full">ACTIVE STYLING</span>
          </div>
          
          <div className="shadow-lg border border-slate-200/50 rounded overflow-hidden">
            <ResumeTemplates data={doc.data} templateType={doc.templateType} />
          </div>
        </div>
      </div>
    </div>
  );
}
