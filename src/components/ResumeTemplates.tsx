import React from "react";
import { ResumeData, TemplateType } from "../types";
import { Mail, Phone, MapPin, Linkedin, Github, ExternalLink, Calendar, GraduationCap, Briefcase, Award, Globe, Code } from "lucide-react";

interface ResumeTemplatesProps {
  data: ResumeData;
  templateType: TemplateType;
}

export default function ResumeTemplates({ data, templateType }: ResumeTemplatesProps) {
  const { personalInfo, summary, experience, education, skills, certifications, languages, projects } = data;

  // Split responsibilities by newline or bullet points for neat rendering
  const parseResponsibilities = (text: string) => {
    if (!text) return [];
    return text
      .split("\n")
      .map((item) => item.replace(/^[•\s*-]+\s*/, "").trim())
      .filter((item) => item.length > 0);
  };

  const getTemplateStyle = () => {
    switch (templateType) {
      case "executive":
        return {
          fontFamily: "'Playfair Display', Georgia, serif",
          containerClass: "bg-white text-[#1e293b] p-10 max-w-4xl mx-auto shadow-md border-t-8 border-indigo-900 rounded-sm print:p-0 print:shadow-none print:border-none",
          headerSection: "text-center border-b border-gray-300 pb-5 mb-6",
          sectionTitle: "font-serif text-lg tracking-wider font-semibold border-b-2 border-indigo-900 text-indigo-900 pb-1 mb-3 uppercase",
        };
      case "minimal":
        return {
          fontFamily: "'Inter', sans-serif",
          containerClass: "bg-white text-gray-800 p-8 max-w-4xl mx-auto shadow-md rounded-sm print:p-0 print:shadow-none",
          headerSection: "mb-6",
          sectionTitle: "font-sans text-[#334155] text-sm tracking-widest font-extrabold border-l-4 border-slate-400 pl-3 pb-0.5 mb-3 uppercase",
        };
      case "corporate":
        return {
          fontFamily: "'Inter', sans-serif",
          containerClass: "bg-white text-[#111827] p-10 max-w-4xl mx-auto shadow-md rounded-sm border-t-4 border-gray-900 print:p-0 print:shadow-none print:border-none",
          headerSection: "border-b-2 border-gray-200 pb-4 mb-6",
          sectionTitle: "font-sans text-base tracking-wide font-black bg-gray-50 text-gray-900 p-1 pl-3 mb-3 border-l-4 border-gray-800 uppercase",
        };
      case "creative":
        return {
          fontFamily: "'Space Grotesk', system-ui, sans-serif",
          containerClass: "bg-white text-[#1f2937] p-8 max-w-4xl mx-auto shadow-md border-b-8 border-blue-600 rounded-sm print:p-0 print:shadow-none print:border-none",
          headerSection: "bg-blue-50 -mx-8 -mt-8 p-8 mb-6 border-b border-blue-100",
          sectionTitle: "font-sans text-[#2563eb] text-sm tracking-wider font-bold mb-3 uppercase flex items-center justify-between after:content-[''] after:flex-1 after:h-[1px] after:bg-blue-200 after:ml-4",
        };
      case "student":
        return {
          fontFamily: "'Inter', sans-serif",
          containerClass: "bg-white text-gray-900 p-8 max-w-4xl mx-auto shadow-md border-l-8 border-emerald-600 rounded-sm print:p-0 print:shadow-none print:border-none",
          headerSection: "mb-6 border-b border-emerald-100 pb-4",
          sectionTitle: "font-sans text-emerald-800 text-sm tracking-widest font-semibold border-b border-emerald-300 pb-1 mb-3 uppercase",
        };
      case "modern":
      default:
        return {
          fontFamily: "'Inter', sans-serif",
          containerClass: "bg-white text-[#1e293b] p-8 max-w-4xl mx-auto shadow-md border-t-4 border-blue-600 rounded-sm print:p-0 print:shadow-none print:border-none",
          headerSection: "flex flex-col md:flex-row justify-between items-start border-b border-gray-100 pb-6 mb-6 gap-4 print:flex-row",
          sectionTitle: "text-blue-800 text-sm tracking-wider font-bold border-b border-blue-100 pb-1 mb-3 uppercase",
        };
    }
  };

  const style = getTemplateStyle();

  return (
    <div id="print-resume-area" className={style.containerClass} style={{ fontFamily: style.fontFamily }}>
      {/* 1. HEADER SECTION */}
      {templateType === "modern" && (
        <div className={style.headerSection}>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">{personalInfo.name || "Your Name"}</h1>
            <p className="text-lg font-medium text-blue-600 mt-1">{personalInfo.title || "Target Professional Title"}</p>
          </div>
          <div className="text-xs space-y-1 bg-slate-50 p-3 rounded-lg border border-slate-100 min-w-[220px] print:bg-transparent print:border-none print:p-0">
            {personalInfo.email && (
              <div className="flex items-center gap-1.5 text-slate-600">
                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{personalInfo.email}</span>
              </div>
            )}
            {personalInfo.phone && (
              <div className="flex items-center gap-1.5 text-slate-600">
                <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{personalInfo.phone}</span>
              </div>
            )}
            {personalInfo.address && (
              <div className="flex items-center gap-1.5 text-slate-600">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{personalInfo.address}</span>
              </div>
            )}
            <div className="flex flex-wrap gap-x-2.5 gap-y-1 pt-1.5 border-t border-slate-200 mt-1.5 print:border-none">
              {personalInfo.linkedin && (
                <div className="flex items-center gap-1 text-slate-600">
                  <Linkedin className="w-3 h-3 text-slate-400 shrink-0" />
                  <span>{personalInfo.linkedin}</span>
                </div>
              )}
              {personalInfo.github && (
                <div className="flex items-center gap-1 text-slate-600">
                  <Github className="w-3 h-3 text-slate-400 shrink-0" />
                  <span>{personalInfo.github}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {templateType === "executive" && (
        <div className={style.headerSection}>
          <h1 className="text-4xl font-serif font-black tracking-wide text-indigo-950">{personalInfo.name || "Your Name"}</h1>
          <p className="text-sm tracking-widest text-slate-500 font-sans uppercase mt-1.5">{personalInfo.title || "Target Professional Role"}</p>
          <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-1 text-xs text-slate-600 mt-4">
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span>• {personalInfo.phone}</span>}
            {personalInfo.address && <span>• {personalInfo.address}</span>}
            {personalInfo.linkedin && <span>• LN: {personalInfo.linkedin}</span>}
            {personalInfo.github && <span>• GH: {personalInfo.github}</span>}
          </div>
        </div>
      )}

      {templateType === "minimal" && (
        <div className={style.headerSection}>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">{personalInfo.name || "Your Name"}</h1>
          <p className="text-sm font-semibold tracking-wide text-slate-500 uppercase mt-0.5">{personalInfo.title || "Candidate Title"}</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-slate-600 mt-4 pt-4 border-t border-slate-100">
            {personalInfo.email && <div><span className="font-bold text-slate-500 block uppercase tracking-wider text-[10px]">Email</span>{personalInfo.email}</div>}
            {personalInfo.phone && <div><span className="font-bold text-slate-500 block uppercase tracking-wider text-[10px]">Phone</span>{personalInfo.phone}</div>}
            {personalInfo.address && <div><span className="font-bold text-slate-500 block uppercase tracking-wider text-[10px]">Location</span>{personalInfo.address}</div>}
            {(personalInfo.linkedin || personalInfo.github) && (
              <div>
                <span className="font-bold text-slate-500 block uppercase tracking-wider text-[10px]">Social Profiles</span>
                {personalInfo.linkedin && <span className="block">{personalInfo.linkedin}</span>}
                {personalInfo.github && <span className="block">{personalInfo.github}</span>}
              </div>
            )}
          </div>
        </div>
      )}

      {templateType === "corporate" && (
        <div className={style.headerSection}>
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 uppercase">{personalInfo.name || "Your Name"}</h1>
              <p className="text-lg font-bold text-gray-700 tracking-wide mt-1">{personalInfo.title || "Executive Candidate"}</p>
            </div>
            <div className="text-right text-xs space-y-0.5 text-gray-600 font-medium">
              {personalInfo.email && <p>{personalInfo.email}</p>}
              {personalInfo.phone && <p>{personalInfo.phone}</p>}
              {personalInfo.address && <p>{personalInfo.address}</p>}
              {personalInfo.linkedin && <p>linkedin.com/in/{personalInfo.linkedin}</p>}
              {personalInfo.github && <p>github.com/{personalInfo.github}</p>}
            </div>
          </div>
        </div>
      )}

      {templateType === "creative" && (
        <div className={style.headerSection}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 print:flex-row">
            <div>
              <span className="bg-blue-600 text-white text-[10px] uppercase tracking-widest font-extrabold px-2.5 py-1 rounded">PORTFOLIO CV</span>
              <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mt-2">{personalInfo.name || "Your Name"}</h1>
              <p className="text-xl font-bold text-blue-600 leading-none mt-1">{personalInfo.title || "Digital Craftsman"}</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-blue-100 shadow-sm text-xs space-y-1.5 md:min-w-[240px]">
              {personalInfo.email && <div className="text-slate-600">📧 <strong>{personalInfo.email}</strong></div>}
              {personalInfo.phone && <div className="text-slate-600">📱 <strong>{personalInfo.phone}</strong></div>}
              {personalInfo.address && <div className="text-slate-600">📍 <strong>{personalInfo.address}</strong></div>}
              {personalInfo.linkedin && <div className="text-slate-600">🔗 linkedin.com/in/{personalInfo.linkedin}</div>}
              {personalInfo.github && <div className="text-slate-600">💻 github.com/{personalInfo.github}</div>}
            </div>
          </div>
        </div>
      )}

      {templateType === "student" && (
        <div className={style.headerSection}>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">{personalInfo.name || "Your Name"}</h1>
          <p className="text-base font-semibold text-emerald-700 mt-0.5">{personalInfo.title || "Academic Student & Aspiring Professional"}</p>
          <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-slate-600 mt-3 font-medium">
            {personalInfo.email && <div className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-slate-400" /> {personalInfo.email}</div>}
            {personalInfo.phone && <div className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-slate-400" /> {personalInfo.phone}</div>}
            {personalInfo.address && <div className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {personalInfo.address}</div>}
            {personalInfo.linkedin && <div className="flex items-center gap-1">LN: {personalInfo.linkedin}</div>}
            {personalInfo.github && <div className="flex items-center gap-1">GH: {personalInfo.github}</div>}
          </div>
        </div>
      )}

      {/* 2. EXECUTIVE SUMMARY */}
      {summary && (
        <div className="mb-6">
          <h2 className={style.sectionTitle}>Professional Summary</h2>
          <p className="text-xs leading-relaxed text-slate-700 whitespace-pre-line text-justify">{summary}</p>
        </div>
      )}

      {/* 3. EXPERIENCE SECTION */}
      {experience && experience.length > 0 && (
        <div className="mb-6">
          <h2 className={style.sectionTitle}>Professional Experience</h2>
          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id} className="group">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">{exp.position || "Untitled Role"}</h3>
                    <p className="text-xs font-semibold text-slate-600">{exp.company || "Employer Name"}</p>
                  </div>
                  <div className="text-right text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                    <span>{exp.startDate || "Start"}</span> - <span>{exp.current ? "Present" : exp.endDate || "End"}</span>
                  </div>
                </div>

                {/* Responsibilities list rendering */}
                {exp.responsibilities && (
                  <ul className="list-disc pl-4 mt-1.5 space-y-1">
                    {parseResponsibilities(exp.responsibilities).map((bullet, idx) => (
                      <li key={idx} className="text-xs leading-normal text-slate-700">
                        {bullet}
                      </li>
                    ))}
                    {parseResponsibilities(exp.responsibilities).length === 0 && (
                      <p className="text-xs italic text-slate-400">Describe responsibilities or trigger AI Point Improver...</p>
                    )}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. SKILLS SECTION */}
      {skills && skills.length > 0 && (
        <div className="mb-6">
          <h2 className={style.sectionTitle}>Key Skills</h2>
          <div className="flex flex-wrap gap-1.5">
            {skills.map((skill, idx) => (
              <span
                key={idx}
                className="bg-slate-100 text-slate-800 text-[11px] font-medium px-2.5 py-0.5 rounded-full border border-slate-200/50 print:bg-transparent print:border-slate-300 print:px-1.5"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 5. PROJECTS SECTION */}
      {projects && projects.length > 0 && (
        <div className="mb-6">
          <h2 className={style.sectionTitle}>Key Projects</h2>
          <div className="grid grid-cols-1 gap-4">
            {projects.map((proj) => (
              <div key={proj.id}>
                <div className="flex justify-between items-baseline">
                  <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1">
                    {proj.title || "Project Title"}
                    {proj.link && <ExternalLink className="w-3 h-3 text-slate-400" />}
                  </h3>
                  {proj.technologies && (
                    <span className="text-[10px] text-indigo-700 font-mono font-medium">{proj.technologies}</span>
                  )}
                </div>
                <p className="text-xs text-slate-600 mt-1">{proj.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. EDUCATION SECTION */}
      {education && education.length > 0 && (
        <div className="mb-6">
          <h2 className={style.sectionTitle}>Education</h2>
          <div className="space-y-3">
            {education.map((edu) => (
              <div key={edu.id} className="flex justify-between items-start">
                <div>
                  <h3 className="text-xs font-bold text-slate-900">{edu.degree || "Certificate/Degree Program"}</h3>
                  <p className="text-xs text-slate-600 font-medium">{edu.institution || "College/University Name"}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 font-semibold block uppercase tracking-wider">{edu.graduationDate}</span>
                  {edu.gpa && <span className="text-[11px] text-slate-500 font-semibold mt-0.5 block">GPA: {edu.gpa}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. CERTIFICATIONS & LANGUAGES (TWO COLUMNS FOR SPACE SAVING) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:grid-cols-2">
        {/* Certifications column */}
        {certifications && certifications.length > 0 && (
          <div>
            <h2 className={style.sectionTitle}>Certifications</h2>
            <ul className="list-disc pl-4 space-y-1 text-xs text-slate-700">
              {certifications.map((cert, idx) => (
                <li key={idx}>{cert}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Languages column */}
        {languages && languages.length > 0 && (
          <div>
            <h2 className={style.sectionTitle}>Languages</h2>
            <div className="flex flex-wrap gap-2 text-xs text-slate-700 font-medium pt-1">
              {languages.map((lang, idx) => (
                <span key={idx} className="bg-slate-50 border border-slate-150 px-2 py-0.5 rounded print:border-none print:px-0 print:bg-transparent">
                  {lang}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
