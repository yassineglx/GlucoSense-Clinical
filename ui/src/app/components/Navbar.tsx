"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";
import { LogIn, LogOut, User, Activity, LayoutDashboard, History } from "lucide-react";

export default function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  return (
    <nav className="w-full border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 flex items-center justify-center group-hover:bg-sky-500/30 transition-colors">
              <Activity className="w-5 h-5 text-sky-400" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white" style={{ fontFamily: "var(--font-display)" }}>
              Gluco<span className="text-sky-400">Sense</span>
            </span>
          </Link>

          {session && (
            <div className="hidden md:flex items-center gap-2">
              <Link
                href="/"
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                  pathname === "/" ? "bg-white/10 text-white" : "text-slate-400 hover:bg-white/5 hover:text-slate-300"
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
              <Link
                href="/history"
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                  pathname === "/history" ? "bg-white/10 text-white" : "text-slate-400 hover:bg-white/5 hover:text-slate-300"
                }`}
              >
                <History className="w-4 h-4" />
                History
              </Link>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          {status === "loading" ? (
            <div className="h-8 w-24 bg-white/5 rounded animate-pulse" />
          ) : session ? (
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 text-sm text-slate-300">
                <div className="w-8 h-8 rounded-full bg-sky-500/20 flex items-center justify-center border border-sky-500/30">
                  <User className="w-4 h-4 text-sky-400" />
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="font-medium text-white">{session.user?.name || session.user?.email}</span>
                  <span className="text-[10px] text-sky-400 uppercase tracking-wider">Clinical Access</span>
                </div>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors border border-white/5"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => signIn()}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-black bg-sky-400 hover:bg-sky-300 rounded-lg transition-colors shadow-[0_0_15px_rgba(56,189,248,0.3)] hover:shadow-[0_0_25px_rgba(56,189,248,0.5)]"
            >
              <LogIn className="w-4 h-4" />
              Sign In
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
