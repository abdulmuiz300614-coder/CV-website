import React from "react";
import { Sparkles, Linkedin, Github, Mail, ShieldAlert, BadgeCheck } from "lucide-react";

interface FooterProps {
  setCurrentPage: (page: string) => void;
}

export default function Footer({ setCurrentPage }: FooterProps) {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 font-extrabold text-lg text-white">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black">
                CF
              </div>
              <span>CVForge <span className="text-blue-500 font-black">AI</span></span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Industrial grade, ATS-friendly resume optimization and bespoke cover letters created with state-of-the-art Gemini LLM.
            </p>
            <div className="flex items-center gap-3 text-slate-500 hover:text-slate-400 transition pt-2">
              <span className="text-xs font-semibold flex items-center gap-1">
                <BadgeCheck className="w-4 h-4 text-emerald-500" />
                100% ATS Approved
              </span>
            </div>
          </div>

          {/* SaaS Core Links */}
          <div>
            <h3 className="text-white text-sm font-bold tracking-wider uppercase mb-4">Core Platform</h3>
            <ul className="space-y-2.5 text-sm font-semibold">
              <li>
                <button onClick={() => setCurrentPage("dashboard")} className="hover:text-white transition">
                  My Resume Workspace
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage("landing")} className="hover:text-white transition">
                  Browse Free Layouts
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage("dashboard")} className="hover:text-white transition">
                  Cover Letter Studio
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage("admin")} className="hover:text-white text-rose-400 transition">
                  System Administration
                </button>
              </li>
            </ul>
          </div>

          {/* ATS Guidelines */}
          <div>
            <h3 className="text-white text-sm font-bold tracking-wider uppercase mb-4">ATS Compatibility</h3>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-start gap-1.5 text-slate-400">
                <span className="text-emerald-500">✓</span> No complex layout tables
              </li>
              <li className="flex items-start gap-1.5 text-slate-400">
                <span className="text-emerald-500">✓</span> Screen-readable selectable text
              </li>
              <li className="flex items-start gap-1.5 text-slate-400">
                <span className="text-emerald-500">✓</span> Standard structural headers
              </li>
              <li className="flex items-start gap-1.5 text-slate-400">
                <span className="text-emerald-500">✓</span> Targeted, industry recommended keywords
              </li>
            </ul>
          </div>

          {/* Security & System */}
          <div className="space-y-4">
            <h3 className="text-white text-sm font-bold tracking-wider uppercase">Privacy & Safety</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              We encrypt resume data server-side and validate document downloads to prevent memory injections. Built with complete GDPR compliance guidelines.
            </p>
            <div className="text-xs flex items-center gap-2 text-slate-500 bg-slate-950 p-3 rounded-lg border border-slate-800">
              <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0" />
              <span>Developer Workspace: Isolated Storage Active.</span>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-800 text-center flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-semibold text-slate-500">
          <p>© 2026 CVForge AI. All rights reserved. Crafted for elite career enhancement.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-slate-400">Terms of Service</a>
            <a href="#" className="hover:text-slate-400">Privacy Policy</a>
            <a href="#" className="hover:text-slate-400">GDPR Compliance</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
