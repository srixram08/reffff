"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { DottedLogo } from "./DottedLogo";

export const Navbar: React.FC = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md shadow-sm font-sans border-b border-purple-100">
        {/* Main Navbar Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Brand Logo with Bot & Matrix */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 rounded-2xl overflow-hidden border border-purple-200 shadow-sm bg-gradient-to-br from-indigo-50 to-purple-100 flex items-center justify-center group-hover:scale-105 transition-transform">
              <span className="text-xl">🤖</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-heading text-xl font-bold tracking-tight text-[#1E1B4B] leading-none">
                  ReviveX <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">AI</span>
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <span className="text-[10px] uppercase tracking-[0.16em] text-purple-600 font-sans mt-1 font-bold">
                Exam Guardian Bot
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-xs font-bold text-slate-700">
            <Link href="/" className="hover:text-purple-600 transition-colors py-2">
              Home
            </Link>
            <Link href="/intelligence" className="text-purple-700 hover:text-purple-900 transition-colors py-2 flex items-center gap-1.5">
              <span>Intelligence Center</span>
              <span className="rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[9px] font-extrabold px-2 py-0.5 shadow-sm">2.0</span>
            </Link>
            <Link href="/student" className="hover:text-purple-600 transition-colors py-2">
              Student Pod
            </Link>
            <Link href="/teacher" className="hover:text-purple-600 transition-colors py-2">
              Teacher Studio
            </Link>
            <Link href="/dashboard" className="hover:text-purple-600 transition-colors py-2">
              Proctor Console
            </Link>
            <Link href="/architecture" className="hover:text-purple-600 transition-colors py-2">
              Architecture
            </Link>
          </nav>

          {/* Right Action CTAs */}
          <div className="hidden sm:flex items-center gap-3.5">
            <Link
              href="/login"
              className="text-xs font-bold text-slate-700 hover:text-purple-600 px-3 py-2 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/login?role=student&intent=exam"
              className="bot-pill-btn !py-2.5 !px-5 !text-xs flex items-center gap-1.5"
            >
              <span>Launch Exam Pod</span>
              <span className="text-xs">→</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="lg:hidden p-2 text-slate-700 hover:text-purple-600"
            aria-label="Toggle Menu"
          >
            {isMobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {isMobileOpen && (
          <div className="lg:hidden bg-white/95 border-t border-purple-100 px-6 py-5 space-y-4 shadow-xl backdrop-blur-md">
            <div className="flex flex-col space-y-3 text-xs uppercase tracking-wider font-bold text-slate-800">
              <Link href="/" onClick={() => setIsMobileOpen(false)} className="py-2 border-b border-purple-50 hover:text-purple-600">Home</Link>
              <Link href="/intelligence" onClick={() => setIsMobileOpen(false)} className="py-2 border-b border-purple-50 text-purple-700 flex items-center justify-between">
                <span>Intelligence Center</span>
                <span className="rounded bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[9px] font-extrabold px-1.5 py-0.5">2.0</span>
              </Link>
              <Link href="/student" onClick={() => setIsMobileOpen(false)} className="py-2 border-b border-purple-50 hover:text-purple-600">Student Pod</Link>
              <Link href="/teacher" onClick={() => setIsMobileOpen(false)} className="py-2 border-b border-purple-50 hover:text-purple-600">Teacher Studio</Link>
              <Link href="/dashboard" onClick={() => setIsMobileOpen(false)} className="py-2 border-b border-purple-50 hover:text-purple-600">Proctor Console</Link>
              <Link href="/architecture" onClick={() => setIsMobileOpen(false)} className="py-2 border-b border-purple-50 hover:text-purple-600">Architecture</Link>
            </div>
            <div className="pt-2 flex flex-col gap-2.5">
              <Link href="/login" onClick={() => setIsMobileOpen(false)} className="w-full text-center py-2.5 rounded-full border border-purple-200 text-xs font-bold text-purple-800">
                Sign In
              </Link>
              <Link href="/login?role=student&intent=exam" onClick={() => setIsMobileOpen(false)} className="bot-pill-btn w-full text-center py-2.5 text-xs">
                Launch Exam Pod
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Dedicated layout spacer to ensure zero content clipping */}
      <div className="h-20 w-full shrink-0" aria-hidden="true" />
    </>
  );
};
