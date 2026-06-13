import React from "react";
import { UserAccount } from "../types";
import { Hammer, Sparkles, User, LogOut, LayoutDashboard, FileText, Compass, Settings, Shield } from "lucide-react";

interface HeaderProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  user: UserAccount;
  onUpgrade: () => void;
}

export default function Header({ currentPage, setCurrentPage, user, onUpgrade }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div 
          onClick={() => setCurrentPage("landing")}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-blue-600 text-white shadow-sm group-hover:bg-blue-750 transition duration-300">
            <div className="w-3.5 h-3.5 border-2 border-white rounded-sm transform rotate-45"></div>
            <Sparkles className="absolute -top-1 -right-1 w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-800 font-display transition duration-200 group-hover:text-slate-900">
            CVForge <span className="text-blue-600">AI</span>
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-semibold text-slate-500">
          <button 
            onClick={() => setCurrentPage("landing")}
            className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition ${currentPage === "landing" ? "text-blue-600 bg-blue-50" : "hover:text-slate-800 hover:bg-slate-50"}`}
          >
            <Compass className="w-4 h-4" />
            Home
          </button>
          <button 
            onClick={() => setCurrentPage("dashboard")}
            className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition ${currentPage === "dashboard" || currentPage === "wizard" || currentPage === "optimizer" || currentPage === "coverletter" ? "text-blue-600 bg-blue-50/50" : "hover:text-slate-900 hover:bg-slate-50"}`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </button>
          <button 
            onClick={() => setCurrentPage("dashboard")}
            className="px-3 py-2 rounded-lg flex items-center gap-1.5 transition hover:text-slate-900 hover:bg-slate-50"
          >
            <FileText className="w-4 h-4" />
            Document Builder
          </button>
          
          <button 
            onClick={() => setCurrentPage("admin")}
            className={`px-3 py-2 rounded-lg flex items-center gap-1.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50/50 transition border border-dashed border-red-200/50 ${currentPage === "admin" ? "text-red-600 bg-red-50/80" : ""}`}
            title="System Admin Panel"
          >
            <Shield className="w-4 h-4" />
            Admin Panel
          </button>
        </nav>

        {/* User Actions */}
        <div className="flex items-center gap-3">
          {/* Plan badge & CTA */}
          {user.plan === "free" ? (
            <button 
              onClick={onUpgrade}
              className="hidden sm:flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-xs tracking-wide uppercase px-3 py-1.5 rounded-lg hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg hover:shadow-blue-500/10 active:scale-95 transition"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Go Pro
            </button>
          ) : (
            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-lg text-xs font-bold tracking-wide uppercase flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-500 animate-bounce" />
              Pro Member
            </span>
          )}

          {/* User Profile Summary */}
          <div className="flex items-center gap-2 border border-slate-200 pl-2.5 pr-3 py-1 bg-slate-50/50 hover:bg-slate-50 rounded-lg max-w-[210px] text-xs transition">
            <div className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-105 border border-blue-200 text-blue-700 font-bold uppercase">
              {user.displayName ? user.displayName[0] : "A"}
            </div>
            <div className="hidden sm:block text-left truncate max-w-[130px]">
              <p className="font-bold text-slate-900 truncate">{user.displayName || "Abdul Muiz"}</p>
              <p className="font-medium text-slate-500 truncate text-[10px]">{user.email}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
