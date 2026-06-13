import React, { useState } from "react";
import { Sparkles, ArrowRight, Zap, Target, FileDown, CheckCircle, Star, HelpCircle } from "lucide-react";

interface HeroProps {
  onStartBuilding: () => void;
  onUpgrade: () => void;
}

export default function Hero({ onStartBuilding, onUpgrade }: HeroProps) {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [activeTemplatePreview, setActiveTemplatePreview] = useState<string>("modern");

  const faqs = [
    {
      question: "Are these resumes really ATS-friendly?",
      answer: "Yes, 100%! Most builders use complex tables, icons, and non-standard layouts that look pretty to the eye but fail when compiled into ATS text scanners. We generate our documents using strict structured single-column margins and standard headers, allowing the browser's native print engine to output raw vector text. This guarantees ATS systems can parse 100% of your resume content cleanly.",
    },
    {
      question: "How does the AI optimize my bullet points?",
      answer: "Our system calls the advanced Gemini API on our backend. It transforms generic responsibilities (e.g., 'answered customer emails') into quantitative, high-impact achievements (e.g., 'Engineered secure support protocols, managing 150+ client tickets daily and decreasing response latency by 35%').",
    },
    {
      question: "What formats can I export?",
      answer: "We support high-fidelity PDF, formatted DOCX (native word-processor files), raw printable standard views, and quick Copy-to-Clipboard options.",
    },
    {
      question: "Can I manage multiple resumes & cover letters?",
      answer: "Absolutely. With our SaaS workspace, Pro members can save, duplicate, customize, and edit unlimited versions of their resumes and cover letters for different companies and job descriptions.",
    },
  ];

  const testimonials = [
    {
      name: "Tariq Ali",
      role: "Lead Software engineer",
      company: "InnovateTech",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80",
      content: "I pasted my messy draft, and CVForge AI reorganized it into a stunning corporate resume. The bullet point improver is absolutely genius—it translated my standard system logs into metrics that got me 4 interview callbacks within a week!",
      stars: 5,
    },
    {
      name: "Sophia Martinez",
      role: "Digital Marketing Specialist",
      company: "GrowthLabs",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&h=120&q=80",
      content: "The Job Description Matching tool recalculated my resume's alignment score in real-time. It pointed out precisely which keywords I was missing. The cover letter generator saved me hours of boring copy-pasting for each job portal.",
      stars: 5,
    },
    {
      name: "Jonathan Vance",
      role: "MBA Graduate",
      company: "LSE School",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80",
      content: "The Executive template got me through the door at top tier consulting firms. The design is crisp, professional, and is completely clean of low-quality graphics. Highly recommend if you take your job search seriously.",
      stars: 5,
    },
  ];

  return (
    <div className="relative overflow-hidden bg-slate-50">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none -z-10 opacity-30 select-none">
        <div className="absolute top-20 right-10 w-96 h-96 rounded-full bg-blue-400 blur-[120px]" />
        <div className="absolute top-40 left-10 w-96 h-96 rounded-full bg-indigo-300 blur-[120px]" />
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100/65 border border-blue-200 rounded-full text-blue-800 text-xs font-bold tracking-wide uppercase mb-6 animate-fade-in shadow-sm">
          <Sparkles className="w-3.5 h-3.5" />
          Next-Gen AI Resume Platform
        </div>
        
        <h1 className="text-4xl sm:text-6xl font-bold font-display text-slate-900 tracking-tight leading-tight max-w-4xl mx-auto">
          Create a <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 bg-clip-text text-transparent">Professional Resume</span> in Minutes with AI
        </h1>
        
        <p className="mt-6 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Unlock your dream career with CVForge AI. Leverage deep ATS-optimization algorithms, real-time job matching, instant bullet point enhancements, and personalized cover letters.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
          <button
            onClick={onStartBuilding}
            className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition flex items-center justify-center gap-2 group transform active:scale-95"
          >
            Build My Resume
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
          </button>
          
          <button
            onClick={() => {
              const previewSection = document.getElementById("templates-showcase");
              if (previewSection) {
                previewSection.scrollIntoView({ behavior: "smooth" });
              }
            }}
            className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-50 text-slate-800 font-bold rounded-xl border border-slate-200 hover:border-slate-350 transition flex items-center justify-center gap-1.5 shadow-sm"
          >
            See Examples
          </button>
        </div>

        {/* Floating Screen Graphic Teaser */}
        <div className="mt-16 relative rounded-2xl border border-slate-200/80 p-3 bg-white/60 backdrop-blur shadow-xl max-w-4xl mx-auto overflow-hidden">
          <div className="absolute top-3 left-3 flex gap-1.5 select-none text-slate-300">
            <span className="w-3 h-3 rounded-full bg-red-400" />
            <span className="w-3 h-3 rounded-full bg-yellow-400" />
            <span className="w-3 h-3 rounded-full bg-green-400" />
            <span className="text-[10px] ml-4 font-mono select-none">cvforge-builder-saas.v1</span>
          </div>
          <div className="bg-slate-900 rounded-xl overflow-hidden mt-6 p-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-4 text-left border-r border-slate-800 pr-4 space-y-4 text-slate-300 text-xs">
                <div className="p-2.5 bg-slate-850 rounded border border-slate-800">
                  <p className="font-bold text-white mb-1 flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-blue-400" /> Professional Summary
                  </p>
                  <p className="text-[10px] text-slate-400 italic">"Write an ATS-friendly overview focused on measurable scale..."</p>
                </div>
                <div className="p-2.5 bg-slate-850 rounded border border-slate-800">
                  <p className="font-bold text-emerald-400 mb-1 flex items-center gap-1">
                    <Target className="w-3.5 h-3.5 text-emerald-400" /> Real-time Audit Score
                  </p>
                  <div className="w-full bg-slate-800 h-2 rounded mt-1.5">
                    <div className="bg-emerald-550 h-2 rounded" style={{ width: "88%" }} />
                  </div>
                  <span className="text-[10px] text-emerald-400 mt-1 block text-right font-mono font-bold">88 / 100 Grade (Highly Compatible)</span>
                </div>
              </div>
              <div className="md:col-span-8 text-left text-slate-400 text-xs space-y-3 font-mono p-2">
                <p className="text-blue-400">// Gemini AI ATS Bullet Improver Engine</p>
                <div className="p-3 bg-slate-950 rounded border border-blue-900/50 space-y-1.5 text-[11px] leading-relaxed">
                  <p className="text-[#f8fafc]"><span className="text-rose-400 font-bold font-mono">Original:</span> "Assisted client teams with their daily deployment errors."</p>
                  <p className="text-[#a8a29e]"><span className="text-emerald-400 font-bold font-mono">Improved:</span> "Engineered automated cloud troubleshooting playbooks, decreasing platform deployment downtime by <span className="text-emerald-400 font-bold font-mono">24%</span> and facilitating seamless hot-fixes."</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 1. FEATURES SECTION */}
      <div className="bg-white border-t border-slate-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-xs font-bold tracking-widest text-blue-600 uppercase">Features</h2>
          <p className="mt-2 text-3xl font-bold font-display tracking-tight text-slate-900 sm:text-4xl">
            Everything You Need to Command Higher Salaries
          </p>
          <p className="mt-4 text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Eliminate hours of manual writing. Let our structured backend AI scan and rewrite your CV blocks for immediate positive recruiter feedback.
          </p>

          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl border border-slate-100 hover:border-blue-105 bg-slate-50/50 hover:bg-white text-left transition hover:shadow-xl hover:shadow-slate-100">
              <div className="inline-flex p-3 rounded-lg bg-blue-100/50 text-blue-600 mb-6 font-bold">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">AI Summary Generator</h3>
              <p className="mt-3 text-sm text-slate-500 leading-relaxed">
                Prompt Gemini to produce strong, concise summaries based on your metrics and target role. Keep statements highly aligned to bypass screening software filters easily.
              </p>
            </div>

            <div className="p-8 rounded-2xl border border-slate-100 hover:border-blue-105 bg-slate-50/50 hover:bg-white text-left transition hover:shadow-xl hover:shadow-slate-100">
              <div className="inline-flex p-3 rounded-lg bg-indigo-100/50 text-indigo-600 mb-6 font-bold">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Bullet Point Improver</h3>
              <p className="mt-3 text-sm text-slate-500 leading-relaxed">
                Convert weak, passive sentences (e.g., "was in charge of sales") into quantified achievements (e.g., "Orchestrated tactical campaigns driving $400k revenue expansion").
              </p>
            </div>

            <div className="p-8 rounded-2xl border border-slate-100 hover:border-blue-105 bg-slate-50/50 hover:bg-white text-left transition hover:shadow-xl hover:shadow-slate-100">
              <div className="inline-flex p-3 rounded-lg bg-emerald-100/50 text-emerald-600 mb-6 font-bold">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Precision Job Matching</h3>
              <p className="mt-3 text-sm text-slate-500 leading-relaxed">
                Paste the job listing description. Our AI compares terms, calculates a real match alignment percentage, and highlights specific missing keywords or technical skills.
              </p>
            </div>

            <div className="p-8 rounded-2xl border border-slate-100 hover:border-blue-105 bg-slate-50/50 hover:bg-white text-left transition hover:shadow-xl hover:shadow-slate-100">
              <div className="inline-flex p-3 rounded-lg bg-amber-100/50 text-amber-600 mb-6 font-bold">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">AI Cover Letter Writer</h3>
              <p className="mt-3 text-sm text-slate-500 leading-relaxed">
                Generate personalized one-page letters aligning your personal experience with company details and set custom tones of Friendly, Professional, or Confident.
              </p>
            </div>

            <div className="p-8 rounded-2xl border border-slate-100 hover:border-blue-105 bg-slate-50/50 hover:bg-white text-left transition hover:shadow-xl hover:shadow-slate-100">
              <div className="inline-flex p-3 rounded-lg bg-red-100/50 text-red-600 mb-6 font-bold">
                <FileDown className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Flexible Layout Formats</h3>
              <p className="mt-3 text-sm text-slate-500 leading-relaxed">
                Switch instantly between our high-performance formats: Modern, Executive, Minimal, Corporate, Creative, or Student. Always maintaining flawless spacing.
              </p>
            </div>

            <div className="p-8 rounded-2xl border border-slate-100 hover:border-blue-105 bg-slate-50/50 hover:bg-white text-left transition hover:shadow-xl hover:shadow-slate-100">
              <div className="inline-flex p-3 rounded-lg bg-teal-100/50 text-teal-600 mb-6 font-bold">
                <FileDown className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Clean Vector Export</h3>
              <p className="mt-3 text-sm text-slate-500 leading-relaxed">
                Export to Word (DOCX format), print natively, or output absolute PDF structures. Never worry about corrupt formats or misaligned graphics files.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. HOW IT WORKS */}
      <div className="bg-slate-900 text-white py-20 border-t border-slate-850">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-xs font-bold tracking-widest text-[#60a5fa] uppercase">Process</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Go From Average draft to Premium SaaS CV In minutes
          </p>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="relative p-6 bg-slate-850 rounded-xl border border-slate-800 text-left">
              <div className="absolute top-4 right-4 text-3xl font-black text-slate-800 group-hover:text-slate-700">01</div>
              <span className="w-10 h-10 rounded-lg bg-[#2563eb] text-white flex items-center justify-center font-bold text-sm mb-6">
                Step 1
              </span>
              <h3 className="text-lg font-bold">Key In Personal Details</h3>
              <p className="mt-3 text-sm text-slate-400 leading-relaxed text-justify">
                Fill the fast multi-step wizard covering personal links (GitHub, LinkedIn), experience summaries, education records, and certifications.
              </p>
            </div>

            <div className="relative p-6 bg-slate-850 rounded-xl border border-slate-800 text-left">
              <div className="absolute top-4 right-4 text-3xl font-black text-slate-800 group-hover:text-slate-700">02</div>
              <span className="w-10 h-10 rounded-lg bg-[#312e81] text-white flex items-center justify-center font-bold text-sm mb-6">
                Step 2
              </span>
              <h3 className="text-lg font-bold">Run AI Grade & Optimisation</h3>
              <p className="mt-3 text-sm text-slate-400 leading-relaxed text-justify">
                Enable server-side Gemini algorithms to re-form summary blocks, suggest missing keywords based on real job openings, and improve achievements.
              </p>
            </div>

            <div className="relative p-6 bg-slate-850 rounded-xl border border-slate-800 text-left">
              <div className="absolute top-4 right-4 text-3xl font-black text-slate-800 group-hover:text-slate-700">03</div>
              <span className="w-10 h-10 rounded-lg bg-[#059669] text-white flex items-center justify-center font-bold text-sm mb-6">
                Step 3
              </span>
              <h3 className="text-lg font-bold">Export Premium Format</h3>
              <p className="mt-3 text-sm text-slate-400 leading-relaxed text-justify">
                Toggle between layout frames instantly. Run DOCX/PDF rendering and download. Copy matching cover letters with customized pitch hooks.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. RESUME TEMPLATES SECTION */}
      <div id="templates-showcase" className="bg-white py-20 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-xs font-bold tracking-widest text-[#2563eb] uppercase">Styles</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Choose Recruiter-Approved Layout Frames
          </p>
          <p className="mt-4 text-base text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Standard design presets tailored to different career sectors, levels, and industries. Completely swap anytime without losing content records.
          </p>

          <div className="mt-12 flex flex-wrap justify-center gap-2">
            {[
              { id: "modern", label: "Modern Layout" },
              { id: "executive", label: "Executive Frame" },
              { id: "minimal", label: "Minimalist Style" },
              { id: "corporate", label: "Corporate Grid" },
              { id: "creative", label: "Creative Splice" },
              { id: "student", label: "Academic Student" }
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTemplatePreview(t.id)}
                className={`px-5 py-2.5 rounded-lg text-sm font-bold tracking-wide transition border ${activeTemplatePreview === t.id ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/15" : "bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300"}`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="mt-10 border border-slate-200/80 rounded-2xl bg-slate-50/50 p-6 max-w-3xl mx-auto shadow-inner text-left">
            <div className="bg-white p-6 rounded-lg shadow border border-slate-105 min-h-[380px] flex flex-col justify-between">
              <div>
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded tracking-wide uppercase ${activeTemplatePreview === 'executive' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : activeTemplatePreview === 'creative' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-emerald-50 text-emerald-800'}`}>
                  {activeTemplatePreview.toUpperCase()} FRAME
                </span>
                <div className="mt-4 pb-3 border-b border-slate-100">
                  <h3 className="text-xl font-bold text-slate-800">Tariq Ali</h3>
                  <p className="text-xs font-semibold text-slate-500">Lead Cloud Engineer — InnovateTech Cloud Services</p>
                  <p className="text-[10px] text-slate-400 mt-1">📧 abdul.muiz300614@gmail.com | 📱 +1 555 382 1928</p>
                </div>
                <div className="mt-4">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest text-[10px]">Work Summary</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Over 5 years driving full-stack system structures and hotfile server configurations on Docker frameworks. Skilled in high-performance cloud operations and container load balance strategies.
                  </p>
                </div>
                <div className="mt-4">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest text-[10px]">Recent Responsibility</h4>
                  <ul className="list-disc pl-4 mt-1.5 text-xs text-slate-600 space-y-1">
                    <li>Led migration of 4 legacy storage servers to cloud containers, cutting operational costs by 32%.</li>
                    <li>Developed real-time webhook endpoints, boosting transaction synchronization latency speeds.</li>
                  </ul>
                </div>
              </div>
              <div className="mt-8 pt-4 border-t border-slate-100 flex justify-between items-center text-[10px] font-bold text-slate-400">
                <span>SYSTEM RENDER APPROVED</span>
                <span className="text-blue-600">CVFORGE-REPRESENTATION</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. TESTIMONIALS */}
      <div className="bg-slate-50 py-20 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-xs font-bold tracking-widest text-[#2563eb] uppercase">Reviews</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Success Stories from Career Movers
          </p>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((test, idx) => (
              <div key={idx} className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm text-left flex flex-col justify-between">
                <div>
                  <div className="flex gap-0.5 text-amber-500 mb-4">
                    {[...Array(test.stars)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm text-slate-600 italic leading-relaxed text-justify">
                    "{test.content}"
                  </p>
                </div>

                <div className="flex items-center gap-4 mt-6 pt-6 border-t border-slate-100">
                  <img src={test.image} alt={test.name} className="w-10 h-10 rounded-full" referrerPolicy="no-referrer" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">{test.name}</h4>
                    <p className="text-xs text-slate-500">
                      {test.role}, <span className="font-semibold text-slate-700">{test.company}</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. PRICING SECTION */}
      <div className="bg-white py-20 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-xs font-bold tracking-widest text-[#2563eb] uppercase">Plans</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Sleek & Transparent Pricing Plans
          </p>
          <p className="mt-4 text-base text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Begin with our default free plan or upgrade anytime for unlimited document variants, advanced deep ATS optimization algorithms, and premium styles context.
          </p>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Free Plan */}
            <div className="p-8 rounded-2xl border border-slate-205 bg-slate-50/50 hover:bg-white text-left transition relative flex flex-col justify-between min-h-[460px]">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Standard Free Plan</h3>
                <p className="text-xs text-slate-500 mt-2">Perfect for trying out our CV wizard interface.</p>
                <div className="mt-6">
                  <span className="text-4xl font-extrabold text-slate-900">$0</span>
                  <span className="text-xs font-bold text-slate-400"> / forever</span>
                </div>
                <ul className="mt-8 space-y-3.5 text-xs text-slate-600 font-medium">
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-slate-400" /> Save up to 2 Resumes</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-slate-400" /> Save up to 2 Cover Letters</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-slate-400" /> Standard Modern template access</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-slate-400" /> Basic AI point suggestions</li>
                </ul>
              </div>
              <button
                onClick={onStartBuilding}
                className="w-full mt-8 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs uppercase tracking-wider rounded-xl transition"
              >
                Launch Builder
              </button>
            </div>

            {/* Pro Plan */}
            <div className="p-8 rounded-2xl border-2 border-blue-600 bg-white text-left relative flex flex-col justify-between shadow-xl shadow-blue-500/5 min-h-[460px]">
              <div className="absolute -top-3.5 right-6 px-3 py-1 bg-blue-600 text-white text-[10px] uppercase tracking-widest font-extrabold rounded-full shadow-md animate-pulse">
                RECOMMENDED
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-1.5">
                  CVForge Pro Plan <Sparkles className="w-4 h-4 text-blue-500" />
                </h3>
                <p className="text-xs text-[#2563eb] mt-2 font-bold uppercase tracking-wider">Fastest Career Upgrade Tool.</p>
                <div className="mt-6">
                  <span className="text-4xl font-extrabold text-slate-900">$19</span>
                  <span className="text-xs font-bold text-slate-400"> / lifetime</span>
                </div>
                <ul className="mt-8 space-y-3.5 text-xs text-slate-700 font-semibold">
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-500" /> Unlimited saved CV configurations</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-500" /> Unlimited saved Corporate Letters</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-500" /> Master optimization score panels (ATS Grade)</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-500" /> Fully custom bullet point rewrite points</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-500" /> Access all 6 premium template schemas</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-500" /> Advanced job alignment matching panels</li>
                </ul>
              </div>
              <button
                onClick={onUpgrade}
                className="w-full mt-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-blue-500/20 active:scale-95 transition"
              >
                Go Pro Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 6. FAQ SECTION */}
      <div className="bg-slate-50 py-20 border-t border-slate-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <HelpCircle className="w-8 h-8 text-blue-600 mx-auto mb-3" />
          <p className="text-2xl font-bold tracking-tight text-slate-900">
            Frequently Asked Questions
          </p>
          <p className="mt-2 text-sm text-slate-500 leading-relaxed">
            Quick, human answers to our most standard technical inquiries.
          </p>

          <div className="mt-10 space-y-4 text-left">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white border border-slate-150 rounded-xl overflow-hidden transition">
                <button
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full p-5 text-left font-bold text-sm text-slate-800 flex justify-between items-center hover:bg-slate-50"
                >
                  <span>{faq.question}</span>
                  <span className="text-lg text-slate-400">{activeFaq === i ? "−" : "+"}</span>
                </button>
                {activeFaq === i && (
                  <div className="p-5 bg-slate-50 border-t border-slate-100 text-xs text-slate-600 leading-relaxed text-justify">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
