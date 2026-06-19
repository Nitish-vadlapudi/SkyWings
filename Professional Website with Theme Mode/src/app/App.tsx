import React, { useState, useEffect } from "react";
import {
  Plane, Search, User, LogOut, ChevronRight, CheckCircle,
  Shield, Plus, Edit2, Trash2, ArrowLeft,
  Users, Calendar, Filter, AlertCircle, X, Check,
  Menu, Download, Printer, CreditCard
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface AppUser {
  id: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
  email: string;
  password: string;
  role: "user" | "admin";
}

interface Flight {
  id: string;
  name: string;
  flightNumber: string;
  source: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  totalSeats: number;
  bookedSeats: number;
}

interface Booking {
  id: string;
  pnr: string;
  userId: string;
  flightId: string;
  passengerName: string;
  passengerAge: number;
  passengerGender: string;
  seatNumber: string;
  bookingDate: string;
  checkedIn: boolean;
  boardingGate: string;
}

type Screen =
  | "splash"
  | "auth"
  | "dashboard"
  | "browse"
  | "flight-detail"
  | "booking-confirm"
  | "checkin"
  | "boarding-pass"
  | "admin";

// ─── Seed Data ────────────────────────────────────────────────────────────────

const SEED_FLIGHTS: Flight[] = [
  {
    id: "f1", name: "Sky Wings Express", flightNumber: "SW101",
    source: "New York (JFK)", destination: "Los Angeles (LAX)",
    departureTime: "2026-06-20T08:00", arrivalTime: "2026-06-20T11:30",
    price: 289, totalSeats: 180, bookedSeats: 42,
  },
  {
    id: "f2", name: "Sky Wings Pacific", flightNumber: "SW205",
    source: "Los Angeles (LAX)", destination: "Chicago (ORD)",
    departureTime: "2026-06-21T14:15", arrivalTime: "2026-06-21T20:45",
    price: 199, totalSeats: 160, bookedSeats: 147,
  },
  {
    id: "f3", name: "Sky Wings Coastal", flightNumber: "SW312",
    source: "Miami (MIA)", destination: "Boston (BOS)",
    departureTime: "2026-06-22T06:30", arrivalTime: "2026-06-22T09:45",
    price: 175, totalSeats: 140, bookedSeats: 140,
  },
  {
    id: "f4", name: "Sky Wings Atlantic", flightNumber: "SW418",
    source: "Chicago (ORD)", destination: "New York (JFK)",
    departureTime: "2026-06-23T10:00", arrivalTime: "2026-06-23T13:30",
    price: 219, totalSeats: 200, bookedSeats: 85,
  },
  {
    id: "f5", name: "Sky Wings Summit", flightNumber: "SW529",
    source: "Seattle (SEA)", destination: "Denver (DEN)",
    departureTime: "2026-06-24T16:45", arrivalTime: "2026-06-24T20:00",
    price: 159, totalSeats: 120, bookedSeats: 91,
  },
  {
    id: "f6", name: "Sky Wings Southern", flightNumber: "SW634",
    source: "Atlanta (ATL)", destination: "Dallas (DFW)",
    departureTime: "2026-06-25T09:15", arrivalTime: "2026-06-25T11:00",
    price: 129, totalSeats: 150, bookedSeats: 23,
  },
];

// ─── Utils ────────────────────────────────────────────────────────────────────

function genId() {
  return Math.random().toString(36).slice(2, 10);
}

function genPNR() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "SW";
  for (let i = 0; i < 6; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

function genSeat(bookedSeats: number) {
  const row = Math.floor(bookedSeats / 6) + 1;
  const col = ["A", "B", "C", "D", "E", "F"][bookedSeats % 6];
  return `${row}${col}`;
}

const GATES = ["A12", "B07", "C23", "D15", "A04", "B19", "C08", "D31", "E22", "F05"];
function genGate() { return GATES[Math.floor(Math.random() * GATES.length)]; }

function fmtTime(dt: string) {
  const d = new Date(dt);
  return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

function fmtDate(dt: string) {
  const d = new Date(dt);
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
}

function fmtDateShort(dt: string) {
  const d = new Date(dt);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function availability(f: Flight) {
  const avail = f.totalSeats - f.bookedSeats;
  const ratio = avail / f.totalSeats;
  if (avail === 0) return { dot: "bg-red-500", badge: "bg-red-50 text-red-700 border-red-200", label: "Sold Out" };
  if (ratio <= 0.15) return { dot: "bg-amber-500", badge: "bg-amber-50 text-amber-700 border-amber-200", label: `${avail} seats left` };
  return { dot: "bg-emerald-500", badge: "bg-emerald-50 text-emerald-700 border-emerald-200", label: `${avail} available` };
}

function calcDuration(dep: string, arr: string) {
  const diff = (new Date(arr).getTime() - new Date(dep).getTime()) / 60000;
  const h = Math.floor(diff / 60);
  const m = diff % 60;
  return `${h}h ${m > 0 ? m + "m" : ""}`.trim();
}

// ─── Reusable UI ──────────────────────────────────────────────────────────────

function Btn({
  children, onClick, variant = "primary", size = "md", disabled, className = "", type = "button",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost" | "danger" | "outline";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit";
}) {
  const base = "inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:opacity-50 disabled:cursor-not-allowed";
  const sizes = { sm: "px-3 py-1.5 text-sm", md: "px-5 py-2.5 text-sm", lg: "px-7 py-3.5 text-base" };
  const variants = {
    primary: "bg-sky-500 hover:bg-sky-600 text-white shadow-sm shadow-sky-500/25 active:scale-[0.98]",
    secondary: "bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200",
    ghost: "hover:bg-sky-50 text-slate-600 hover:text-sky-700",
    danger: "bg-red-500 hover:bg-red-600 text-white shadow-sm",
    outline: "border border-slate-200 hover:border-sky-300 hover:bg-sky-50 text-slate-700",
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

function Input({
  label, value, onChange, type = "text", placeholder, required, error, min, max,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
  min?: string;
  max?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-slate-700">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        min={min}
        max={max}
        className={`w-full px-4 py-2.5 rounded-xl border text-sm bg-white transition-all focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 ${error ? "border-red-400" : "border-slate-200 hover:border-slate-300"}`}
      />
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
}

function Select({
  label, value, onChange, options, required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-slate-700">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 text-sm bg-white transition-all focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400"
      >
        <option value="">Select…</option>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

function Toast({ msg, type, onClose }: { msg: string; type: "success" | "error" | "info"; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, []);
  const colors = {
    success: "bg-emerald-500",
    error: "bg-red-500",
    info: "bg-sky-500",
  };
  return (
    <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 ${colors[type]} text-white px-5 py-3 rounded-2xl shadow-xl text-sm font-medium animate-[slideIn_0.3s_ease-out]`}>
      {type === "success" && <CheckCircle className="w-4 h-4 shrink-0" />}
      {type === "error" && <AlertCircle className="w-4 h-4 shrink-0" />}
      {msg}
      <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100"><X className="w-3.5 h-3.5" /></button>
    </div>
  );
}

// ─── Splash Screen ────────────────────────────────────────────────────────────

function SplashScreen({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t = [
      setTimeout(() => setPhase(1), 200),
      setTimeout(() => setPhase(2), 800),
      setTimeout(() => setPhase(3), 2600),
      setTimeout(onDone, 3200),
    ];
    return () => t.forEach(clearTimeout);
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{
        background: "linear-gradient(135deg, #060f1e 0%, #0c1b33 50%, #0a2240 100%)",
        opacity: phase === 3 ? 0 : 1,
        transition: "opacity 0.6s ease-in-out",
      }}
    >
      {/* Decorative rings */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[600, 440, 280].map((size, i) => (
          <div
            key={i}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-sky-400/8"
            style={{ width: size, height: size, animationDelay: `${i * 0.4}s` }}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-sky-900/20 to-transparent" />
      </div>

      {/* Logo */}
      <div
        className="flex flex-col items-center gap-5"
        style={{
          opacity: phase >= 1 ? 1 : 0,
          transform: `translateY(${phase >= 1 ? 0 : 30}px)`,
          transition: "opacity 0.8s ease, transform 0.8s ease",
        }}
      >
        <div className="relative">
          <div className="w-28 h-28 rounded-3xl flex items-center justify-center shadow-2xl"
            style={{ background: "linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)" }}>
            <Plane className="w-14 h-14 text-white" strokeWidth={1.5} />
          </div>
          <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-sky-300 opacity-80"
            style={{ animation: "bounce 1s infinite", animationDelay: "0.3s" }} />
          <div className="absolute bottom-0 -left-2 w-3 h-3 rounded-full bg-sky-400 opacity-60"
            style={{ animation: "bounce 1.2s infinite", animationDelay: "0.6s" }} />
        </div>

        <div
          style={{
            opacity: phase >= 2 ? 1 : 0,
            transform: `translateY(${phase >= 2 ? 0 : 12}px)`,
            transition: "opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s",
          }}
          className="text-center"
        >
          <h1 className="text-5xl font-bold text-white tracking-tight" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
            Sky<span style={{ color: "#38bdf8" }}>Wings</span>
          </h1>
          <p className="text-sky-300/60 text-xs tracking-[0.4em] uppercase mt-2" style={{ fontFamily: "JetBrains Mono, monospace" }}>
            Elevate Your Journey
          </p>
        </div>

        {/* Progress bar */}
        <div
          className="w-44 h-[2px] bg-white/10 rounded-full overflow-hidden mt-2"
          style={{ opacity: phase >= 2 ? 1 : 0, transition: "opacity 0.4s ease 0.3s" }}
        >
          <div
            className="h-full bg-sky-400 rounded-full"
            style={{
              width: phase >= 2 ? "100%" : "0%",
              transition: "width 1.8s cubic-bezier(0.4,0,0.2,1) 0.2s",
            }}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Auth Screen ──────────────────────────────────────────────────────────────

function AuthScreen({
  onLogin,
  users,
  onAddUser,
}: {
  onLogin: (user: AppUser) => void;
  users: AppUser[];
  onAddUser: (user: AppUser) => void;
}) {
  const [tab, setTab] = useState<"signin" | "signup" | "admin">("signin");
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" | "info" } | null>(null);

  // Sign In
  const [siEmail, setSiEmail] = useState("");
  const [siPass, setSiPass] = useState("");

  // Sign Up
  const [suName, setSuName] = useState("");
  const [suAge, setSuAge] = useState("");
  const [suGender, setSuGender] = useState("");
  const [suPhone, setSuPhone] = useState("");
  const [suEmail, setSuEmail] = useState("");
  const [suPass, setSuPass] = useState("");

  // Admin
  const [adminPass, setAdminPass] = useState("");

  const showToast = (msg: string, type: "success" | "error" | "info") => setToast({ msg, type });

  function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    const user = users.find(u => u.email === siEmail && u.password === siPass && u.role === "user");
    if (!user) { showToast("Invalid email or password", "error"); return; }
    showToast("Welcome back, " + user.name + "!", "success");
    setTimeout(() => onLogin(user), 800);
  }

  function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    if (!suName || !suAge || !suGender || !suPhone || !suEmail || !suPass) {
      showToast("Please fill in all fields", "error"); return;
    }
    if (users.find(u => u.email === suEmail)) {
      showToast("An account with this email already exists", "error"); return;
    }
    if (parseInt(suAge) < 1 || parseInt(suAge) > 120) {
      showToast("Please enter a valid age", "error"); return;
    }
    const newUser: AppUser = {
      id: genId(), name: suName, age: parseInt(suAge), gender: suGender,
      phone: suPhone, email: suEmail, password: suPass, role: "user",
    };
    onAddUser(newUser);
    showToast("Account created! Welcome to Sky Wings!", "success");
    setTimeout(() => onLogin(newUser), 800);
  }

  function handleAdmin(e: React.FormEvent) {
    e.preventDefault();
    if (adminPass !== "NJSW05") { showToast("Invalid admin password", "error"); return; }
    const admin: AppUser = {
      id: "admin", name: "Administrator", age: 0, gender: "", phone: "", email: "admin@skywings.com",
      password: "NJSW05", role: "admin",
    };
    showToast("Admin access granted", "success");
    setTimeout(() => onLogin(admin), 800);
  }

  return (
    <div className="min-h-screen flex" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      {/* Left panel */}
      <div className="hidden lg:flex flex-col w-[480px] shrink-0 relative overflow-hidden"
        style={{ background: "linear-gradient(160deg, #0c1b33 0%, #0a2a50 60%, #0ea5e9 140%)" }}>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-sky-400/5 blur-3xl" />
          <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-sky-500/8 blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col h-full p-12 justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #38bdf8, #0284c7)" }}>
              <Plane className="w-5 h-5 text-white" strokeWidth={1.5} />
            </div>
            <span className="text-xl font-bold text-white">Sky<span className="text-sky-400">Wings</span></span>
          </div>

          <div>
            <h2 className="text-4xl font-bold text-white leading-tight mb-4">
              Your journey begins<br />
              <span className="text-sky-400">with a single click</span>
            </h2>
            <p className="text-sky-200/60 text-base leading-relaxed mb-8">
              Book flights, manage check-ins, and download your boarding pass — all in one place.
            </p>
            <div className="flex flex-col gap-3">
              {["Best fare guarantee", "Instant booking confirmation", "Digital boarding passes"].map(f => (
                <div key={f} className="flex items-center gap-3 text-sky-100/70 text-sm">
                  <div className="w-5 h-5 rounded-full bg-sky-500/20 border border-sky-500/30 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-sky-400" />
                  </div>
                  {f}
                </div>
              ))}
            </div>
          </div>

          <p className="text-sky-300/30 text-xs">© 2026 Sky Wings Airlines. All rights reserved.</p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-slate-50">
        <div className="w-full max-w-md">
          {/* Logo (mobile) */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br from-sky-400 to-sky-600">
              <Plane className="w-5 h-5 text-white" strokeWidth={1.5} />
            </div>
            <span className="text-lg font-bold text-slate-900">Sky<span className="text-sky-500">Wings</span></span>
          </div>

          {/* Tabs */}
          <div className="flex bg-white border border-slate-200 rounded-2xl p-1 mb-8 shadow-sm">
            {(["signin", "signup", "admin"] as const).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all ${tab === t ? "bg-sky-500 text-white shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
              >
                {t === "signin" ? "Sign In" : t === "signup" ? "Sign Up" : "Admin"}
              </button>
            ))}
          </div>

          {tab === "signin" && (
            <form onSubmit={handleSignIn} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 flex flex-col gap-5">
              <div>
                <h3 className="text-2xl font-bold text-slate-900">Welcome back</h3>
                <p className="text-slate-500 text-sm mt-1">Sign in to access your bookings</p>
              </div>
              <Input label="Email Address" value={siEmail} onChange={setSiEmail} type="email" placeholder="you@example.com" required />
              <Input label="Password" value={siPass} onChange={setSiPass} type="password" placeholder="••••••••" required />
              <Btn type="submit" size="lg" className="w-full mt-2">Sign In <ChevronRight className="w-4 h-4" /></Btn>
              <p className="text-center text-sm text-slate-500">
                No account yet?{" "}
                <button type="button" onClick={() => setTab("signup")} className="text-sky-600 font-semibold hover:underline">Sign up</button>
              </p>
            </form>
          )}

          {tab === "signup" && (
            <form onSubmit={handleSignUp} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 flex flex-col gap-4">
              <div>
                <h3 className="text-2xl font-bold text-slate-900">Create account</h3>
                <p className="text-slate-500 text-sm mt-1">Join Sky Wings and start booking</p>
              </div>
              <Input label="Full Name" value={suName} onChange={setSuName} placeholder="Alex Johnson" required />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Age" value={suAge} onChange={setSuAge} type="number" placeholder="28" min="1" max="120" required />
                <Select label="Gender" value={suGender} onChange={setSuGender} required
                  options={[{ value: "Male", label: "Male" }, { value: "Female", label: "Female" }, { value: "Other", label: "Other" }]} />
              </div>
              <Input label="Phone Number" value={suPhone} onChange={setSuPhone} type="tel" placeholder="+1 555 000 0000" required />
              <Input label="Email Address" value={suEmail} onChange={setSuEmail} type="email" placeholder="you@example.com" required />
              <Input label="Password" value={suPass} onChange={setSuPass} type="password" placeholder="Create a strong password" required />
              <Btn type="submit" size="lg" className="w-full mt-1">Create Account <ChevronRight className="w-4 h-4" /></Btn>
              <p className="text-center text-sm text-slate-500">
                Already a member?{" "}
                <button type="button" onClick={() => setTab("signin")} className="text-sky-600 font-semibold hover:underline">Sign in</button>
              </p>
            </form>
          )}

          {tab === "admin" && (
            <form onSubmit={handleAdmin} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 flex flex-col gap-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-sky-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Admin Portal</h3>
                  <p className="text-slate-500 text-sm">Restricted access only</p>
                </div>
              </div>
              <Input label="Admin Password" value={adminPass} onChange={setAdminPass} type="password" placeholder="Enter admin password" required />
              <Btn type="submit" size="lg" variant="primary" className="w-full">
                <Shield className="w-4 h-4" /> Access Admin Portal
              </Btn>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Nav Bar ──────────────────────────────────────────────────────────────────

function NavBar({
  user, screen, onNavigate, onLogout,
}: {
  user: AppUser;
  screen: Screen;
  onNavigate: (s: Screen) => void;
  onLogout: () => void;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const links =
    user.role === "admin"
      ? [{ label: "Dashboard", screen: "admin" as Screen }]
      : [
          { label: "Dashboard", screen: "dashboard" as Screen },
          { label: "Browse Flights", screen: "browse" as Screen },
          { label: "Check-In", screen: "checkin" as Screen },
        ];

  return (
    <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-100 shadow-sm" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button onClick={() => onNavigate(user.role === "admin" ? "admin" : "dashboard")} className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center">
              <Plane className="w-4 h-4 text-white" strokeWidth={1.5} />
            </div>
            <span className="text-base font-bold text-slate-900">Sky<span className="text-sky-500">Wings</span></span>
          </button>

          <div className="hidden md:flex items-center gap-1">
            {links.map(l => (
              <button
                key={l.screen}
                onClick={() => onNavigate(l.screen)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${screen === l.screen ? "bg-sky-50 text-sky-600" : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"}`}
              >
                {l.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-100">
              <div className="w-6 h-6 rounded-full bg-sky-100 flex items-center justify-center">
                <User className="w-3.5 h-3.5 text-sky-600" />
              </div>
              <span className="text-sm font-medium text-slate-700">{user.name}</span>
            </div>
            <button onClick={onLogout} className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all" title="Logout">
              <LogOut className="w-5 h-5" />
            </button>
            <button className="md:hidden p-2 rounded-xl text-slate-400 hover:bg-slate-50" onClick={() => setMobileOpen(v => !v)}>
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-slate-100 py-3 flex flex-col gap-1">
            {links.map(l => (
              <button key={l.screen} onClick={() => { onNavigate(l.screen); setMobileOpen(false); }}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${screen === l.screen ? "bg-sky-50 text-sky-600" : "text-slate-600 hover:bg-slate-50"}`}>
                {l.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

function Dashboard({
  user, flights, bookings, onNavigate,
}: {
  user: AppUser;
  flights: Flight[];
  bookings: Booking[];
  onNavigate: (s: Screen, data?: unknown) => void;
}) {
  const myBookings = bookings.filter(b => b.userId === user.id);

  const stats = [
    { label: "My Bookings", value: myBookings.length, icon: Calendar, color: "text-sky-600", bg: "bg-sky-50" },
    { label: "Checked In", value: myBookings.filter(b => b.checkedIn).length, icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Upcoming Flights", value: myBookings.filter(b => !b.checkedIn).length, icon: Plane, color: "text-violet-600", bg: "bg-violet-50" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Welcome back, {user.name.split(" ")[0]} 👋</h1>
        <p className="text-slate-500 mt-1">Here's an overview of your travel activity</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {stats.map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
            <div className={`w-12 h-12 ${s.bg} rounded-xl flex items-center justify-center shrink-0`}>
              <s.icon className={`w-6 h-6 ${s.color}`} strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{s.value}</p>
              <p className="text-sm text-slate-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Action cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <button
          onClick={() => onNavigate("browse")}
          className="group relative overflow-hidden bg-gradient-to-br from-sky-500 to-sky-600 rounded-2xl p-8 text-left shadow-lg shadow-sky-500/20 hover:shadow-xl hover:shadow-sky-500/30 transition-all hover:-translate-y-0.5"
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-16 translate-x-16" />
          <div className="absolute bottom-0 right-8 w-24 h-24 bg-white/5 rounded-full translate-y-8" />
          <div className="relative">
            <div className="w-14 h-14 bg-white/15 rounded-2xl flex items-center justify-center mb-5">
              <Search className="w-7 h-7 text-white" strokeWidth={1.5} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Browse Flights</h3>
            <p className="text-sky-100/80 text-sm leading-relaxed">Explore available routes, compare prices, and book your next adventure.</p>
            <div className="mt-5 flex items-center gap-2 text-white text-sm font-semibold">
              View all flights <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </button>

        <button
          onClick={() => onNavigate("checkin")}
          className="group relative overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 text-left shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-16 translate-x-16" />
          <div className="relative">
            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-5">
              <CheckCircle className="w-7 h-7 text-sky-400" strokeWidth={1.5} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Start Check-In</h3>
            <p className="text-slate-400 text-sm leading-relaxed">Enter your PNR to check in and get your digital boarding pass.</p>
            <div className="mt-5 flex items-center gap-2 text-sky-400 text-sm font-semibold">
              Begin check-in <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </button>
      </div>

      {/* Recent bookings */}
      {myBookings.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
          <div className="p-6 border-b border-slate-100">
            <h3 className="text-lg font-bold text-slate-900">My Bookings</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {myBookings.map(b => {
              const fl = flights.find(f => f.id === b.flightId);
              if (!fl) return null;
              return (
                <div key={b.id} className="p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:bg-slate-50 transition-colors">
                  <div className="w-10 h-10 bg-sky-50 rounded-xl flex items-center justify-center shrink-0">
                    <Plane className="w-5 h-5 text-sky-500" strokeWidth={1.5} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-slate-900 text-sm">{fl.source}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                      <span className="font-bold text-slate-900 text-sm">{fl.destination}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      <span className="font-mono text-xs text-slate-500">PNR: {b.pnr}</span>
                      <span className="text-xs text-slate-400">·</span>
                      <span className="text-xs text-slate-500">Seat {b.seatNumber}</span>
                      <span className="text-xs text-slate-400">·</span>
                      <span className="text-xs text-slate-500">{fmtDate(fl.departureTime)}</span>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${b.checkedIn ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                    {b.checkedIn ? "Checked In" : "Pending Check-In"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Browse Flights ───────────────────────────────────────────────────────────

function BrowseFlights({
  flights, onSelect,
}: {
  flights: Flight[];
  onSelect: (f: Flight) => void;
}) {
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<"price" | "departure" | "seats">("departure");

  const filtered = flights
    .filter(f => {
      const q = query.toLowerCase();
      return !q || f.source.toLowerCase().includes(q) || f.destination.toLowerCase().includes(q) ||
        f.flightNumber.toLowerCase().includes(q) || f.name.toLowerCase().includes(q);
    })
    .sort((a, b) => {
      if (sortBy === "price") return a.price - b.price;
      if (sortBy === "departure") return new Date(a.departureTime).getTime() - new Date(b.departureTime).getTime();
      return (b.totalSeats - b.bookedSeats) - (a.totalSeats - a.bookedSeats);
    });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Available Flights</h1>
        <p className="text-slate-500 mt-1">Browse and book from our global network of routes</p>
      </div>

      {/* Search & filter bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search by city, airport, or flight number…"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as typeof sortBy)}
            className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
          >
            <option value="departure">Sort: Departure</option>
            <option value="price">Sort: Price</option>
            <option value="seats">Sort: Availability</option>
          </select>
        </div>
      </div>

      {/* Availability key */}
      <div className="flex items-center gap-5 mb-6 text-xs text-slate-500">
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />High availability</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />Limited seats</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />Sold out</span>
      </div>

      {/* Flight cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(f => {
          const av = availability(f);
          const dur = calcDuration(f.departureTime, f.arrivalTime);
          return (
            <button
              key={f.id}
              onClick={() => onSelect(f)}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 text-left hover:border-sky-200 hover:shadow-md transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-xs font-mono text-slate-400 mb-1">{f.flightNumber}</p>
                  <p className="text-sm font-bold text-slate-800">{f.name}</p>
                </div>
                <div className={`w-2.5 h-2.5 rounded-full ${av.dot} mt-1.5 shrink-0`} title={av.label} />
              </div>

              <div className="flex items-center gap-3 mb-4">
                <div className="text-left">
                  <p className="text-lg font-bold text-slate-900">{fmtTime(f.departureTime)}</p>
                  <p className="text-xs text-slate-500 truncate max-w-[110px]">{f.source}</p>
                </div>
                <div className="flex-1 flex flex-col items-center gap-1">
                  <div className="text-xs text-slate-400 font-mono">{dur}</div>
                  <div className="w-full flex items-center gap-1">
                    <div className="flex-1 h-px bg-slate-200" />
                    <Plane className="w-3.5 h-3.5 text-sky-400 rotate-0" strokeWidth={2} />
                    <div className="flex-1 h-px bg-slate-200" />
                  </div>
                  <div className="text-xs text-slate-400">Direct</div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-slate-900">{fmtTime(f.arrivalTime)}</p>
                  <p className="text-xs text-slate-500 truncate max-w-[110px] text-right">{f.destination}</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className={`px-2.5 py-1 text-xs font-semibold rounded-lg border ${av.badge}`}>{av.label}</span>
                <span className="text-lg font-bold text-sky-600">${f.price}</span>
              </div>

              <div className="mt-3 flex items-center gap-1.5 text-sky-600 text-xs font-semibold group-hover:gap-2.5 transition-all">
                View details <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </button>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-slate-400">
          <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-semibold">No flights found</p>
          <p className="text-sm mt-1">Try a different search term</p>
        </div>
      )}
    </div>
  );
}

// ─── Flight Detail & Book ─────────────────────────────────────────────────────

function FlightDetail({
  flight, user, onBack, onBooked,
}: {
  flight: Flight;
  user: AppUser;
  onBack: () => void;
  onBooked: (booking: Booking, updatedFlight: Flight) => void;
}) {
  const av = availability(flight);
  const dur = calcDuration(flight.departureTime, flight.arrivalTime);
  const [showForm, setShowForm] = useState(false);
  const [pName, setPName] = useState(user.name);
  const [pAge, setPAge] = useState(String(user.age));
  const [pGender, setPGender] = useState(user.gender);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const canBook = flight.totalSeats - flight.bookedSeats > 0;

  function handleBook(e: React.FormEvent) {
    e.preventDefault();
    if (!pName || !pAge || !pGender) { setToast({ msg: "Please fill all passenger details", type: "error" }); return; }
    setLoading(true);
    setTimeout(() => {
      const booking: Booking = {
        id: genId(),
        pnr: genPNR(),
        userId: user.id,
        flightId: flight.id,
        passengerName: pName,
        passengerAge: parseInt(pAge),
        passengerGender: pGender,
        seatNumber: genSeat(flight.bookedSeats),
        bookingDate: new Date().toISOString(),
        checkedIn: false,
        boardingGate: genGate(),
      };
      const updatedFlight = { ...flight, bookedSeats: flight.bookedSeats + 1 };
      setLoading(false);
      onBooked(booking, updatedFlight);
    }, 1000);
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <button onClick={onBack} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to flights
      </button>

      {/* Hero card */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 text-white mb-6 shadow-xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-60 h-60 bg-sky-500/10 rounded-full translate-x-20 -translate-y-20" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-sky-500/5 rounded-full -translate-x-10 translate-y-10" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-8">
            <span className="font-mono text-sky-400 text-sm bg-sky-400/10 border border-sky-400/20 px-3 py-1 rounded-lg">{flight.flightNumber}</span>
            <span className="text-slate-400 text-sm">{flight.name}</span>
          </div>

          <div className="flex items-center gap-6">
            <div>
              <p className="text-5xl font-bold">{fmtTime(flight.departureTime)}</p>
              <p className="text-sky-300/70 text-sm mt-2 max-w-[180px] leading-relaxed">{flight.source}</p>
            </div>
            <div className="flex-1 flex flex-col items-center gap-2">
              <div className="text-xs font-mono text-slate-400">{dur}</div>
              <div className="w-full flex items-center gap-2">
                <div className="flex-1 h-px bg-white/10" />
                <Plane className="w-5 h-5 text-sky-400" strokeWidth={1.5} />
                <div className="flex-1 h-px bg-white/10" />
              </div>
              <div className="text-xs text-slate-500">Non-stop</div>
            </div>
            <div className="text-right">
              <p className="text-5xl font-bold">{fmtTime(flight.arrivalTime)}</p>
              <p className="text-sky-300/70 text-sm mt-2 max-w-[180px] leading-relaxed text-right">{flight.destination}</p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap gap-6">
            <div>
              <p className="text-slate-400 text-xs mb-1">Date</p>
              <p className="text-white text-sm font-semibold">{fmtDate(flight.departureTime)}</p>
            </div>
            <div>
              <p className="text-slate-400 text-xs mb-1">Price per seat</p>
              <p className="text-sky-400 text-xl font-bold">${flight.price}</p>
            </div>
            <div>
              <p className="text-slate-400 text-xs mb-1">Availability</p>
              <span className={`px-2.5 py-1 text-xs font-bold rounded-lg border ${av.badge}`}>{av.label}</span>
            </div>
            <div>
              <p className="text-slate-400 text-xs mb-1">Capacity</p>
              <p className="text-white text-sm font-semibold">{flight.bookedSeats} / {flight.totalSeats} booked</p>
            </div>
          </div>
        </div>
      </div>

      {/* Seat map visual */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-6">
        <h3 className="font-bold text-slate-900 mb-4">Seat Occupancy</h3>
        <div className="flex items-center gap-3 mb-4 text-xs text-slate-500">
          <span className="flex items-center gap-1.5"><span className="w-4 h-4 rounded bg-sky-500 inline-block" />Available</span>
          <span className="flex items-center gap-1.5"><span className="w-4 h-4 rounded bg-slate-200 inline-block" />Booked</span>
        </div>
        <div className="flex flex-wrap gap-1">
          {Array.from({ length: Math.min(flight.totalSeats, 60) }).map((_, i) => (
            <div
              key={i}
              className={`w-5 h-5 rounded-sm transition-colors ${i < flight.bookedSeats ? "bg-slate-200" : "bg-sky-500"}`}
              title={i < flight.bookedSeats ? "Booked" : "Available"}
            />
          ))}
          {flight.totalSeats > 60 && <span className="text-xs text-slate-400 self-center ml-1">+{flight.totalSeats - 60} more</span>}
        </div>
        {flight.totalSeats > 0 && (
          <div className="mt-3 flex items-center gap-2">
            <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
              <div className="h-full bg-sky-500 rounded-full" style={{ width: `${(flight.bookedSeats / flight.totalSeats) * 100}%` }} />
            </div>
            <span className="text-xs text-slate-500 font-mono">{Math.round((flight.bookedSeats / flight.totalSeats) * 100)}% full</span>
          </div>
        )}
      </div>

      {/* Book button / form */}
      {!showForm ? (
        <Btn size="lg" className="w-full" disabled={!canBook} onClick={() => setShowForm(true)}>
          {canBook ? <><CreditCard className="w-5 h-5" /> Book This Flight — ${flight.price}</> : "Flight Fully Booked"}
        </Btn>
      ) : (
        <form onSubmit={handleBook} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h3 className="font-bold text-slate-900 text-lg mb-1">Passenger Details</h3>
          <p className="text-slate-500 text-sm mb-6">Please enter the travelling passenger's information</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="sm:col-span-1">
              <Input label="Full Name" value={pName} onChange={setPName} placeholder="As per ID" required />
            </div>
            <Input label="Age" value={pAge} onChange={setPAge} type="number" placeholder="25" min="1" max="120" required />
            <Select label="Gender" value={pGender} onChange={setPGender} required
              options={[{ value: "Male", label: "Male" }, { value: "Female", label: "Female" }, { value: "Other", label: "Other" }]} />
          </div>
          <div className="bg-sky-50 rounded-xl border border-sky-100 p-4 mb-6 text-sm text-sky-800">
            <p className="font-semibold mb-1">Booking Summary</p>
            <p>{flight.source} → {flight.destination} · {fmtDate(flight.departureTime)}</p>
            <p className="text-sky-600 font-bold mt-1">Total: ${flight.price}</p>
          </div>
          <div className="flex gap-3">
            <Btn variant="outline" onClick={() => setShowForm(false)} disabled={loading}>Cancel</Btn>
            <Btn type="submit" size="lg" disabled={loading} className="flex-1">
              {loading ? "Processing…" : "Confirm Booking"}
            </Btn>
          </div>
        </form>
      )}
    </div>
  );
}

// ─── Booking Confirmation ─────────────────────────────────────────────────────

function BookingConfirmation({
  booking, flight, onNavigate,
}: {
  booking: Booking;
  flight: Flight;
  onNavigate: (s: Screen, data?: unknown) => void;
}) {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-emerald-50 border-2 border-emerald-200 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-emerald-500" strokeWidth={1.5} />
        </div>
        <h1 className="text-3xl font-bold text-slate-900">Booking Confirmed!</h1>
        <p className="text-slate-500 mt-2">Your flight has been successfully booked. Save your PNR for check-in.</p>
      </div>

      {/* Ticket card */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden mb-6">
        {/* Ticket top */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Plane className="w-5 h-5 text-sky-400" strokeWidth={1.5} />
              <span className="font-bold text-white">Sky<span className="text-sky-400">Wings</span></span>
            </div>
            <span className="font-mono text-xs text-slate-400">{flight.flightNumber}</span>
          </div>
          <div className="flex items-center gap-4">
            <div>
              <p className="text-3xl font-bold">{fmtTime(flight.departureTime)}</p>
              <p className="text-slate-400 text-xs mt-1 max-w-[130px] leading-relaxed">{flight.source}</p>
            </div>
            <div className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full flex items-center gap-2">
                <div className="flex-1 h-px border-t border-dashed border-white/20" />
                <Plane className="w-4 h-4 text-sky-400" strokeWidth={2} />
                <div className="flex-1 h-px border-t border-dashed border-white/20" />
              </div>
              <p className="text-xs text-slate-500">{calcDuration(flight.departureTime, flight.arrivalTime)}</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold">{fmtTime(flight.arrivalTime)}</p>
              <p className="text-slate-400 text-xs mt-1 max-w-[130px] leading-relaxed text-right">{flight.destination}</p>
            </div>
          </div>
        </div>

        {/* Notch divider */}
        <div className="relative h-0">
          <div className="absolute -left-4 w-8 h-8 bg-slate-50 rounded-full border border-slate-100" style={{ top: -16 }} />
          <div className="absolute -right-4 w-8 h-8 bg-slate-50 rounded-full border border-slate-100" style={{ top: -16 }} />
          <div className="mx-6 border-t border-dashed border-slate-200" style={{ marginTop: -1 }} />
        </div>

        {/* Ticket bottom */}
        <div className="p-6 pt-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
            {[
              { label: "PNR", value: booking.pnr, mono: true, highlight: true },
              { label: "Seat", value: booking.seatNumber, mono: true },
              { label: "Gate", value: booking.boardingGate, mono: true },
              { label: "Date", value: fmtDateShort(flight.departureTime), mono: false },
              { label: "Passenger", value: booking.passengerName, mono: false },
              { label: "Age / Gender", value: `${booking.passengerAge} · ${booking.passengerGender}`, mono: false },
              { label: "Booked On", value: fmtDateShort(booking.bookingDate), mono: false },
              { label: "Price Paid", value: `$${flight.price}`, mono: true },
            ].map(item => (
              <div key={item.label}>
                <p className="text-xs text-slate-400 mb-1">{item.label}</p>
                <p className={`text-sm font-bold ${item.mono ? "font-mono" : ""} ${item.highlight ? "text-sky-600 text-base" : "text-slate-900"}`}>
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Btn variant="outline" className="flex-1" onClick={() => onNavigate("browse")}>
          <Search className="w-4 h-4" /> Book Another Flight
        </Btn>
        <Btn className="flex-1" onClick={() => onNavigate("checkin")}>
          <CheckCircle className="w-4 h-4" /> Proceed to Check-In
        </Btn>
        <Btn variant="ghost" onClick={() => onNavigate("dashboard")}>
          Dashboard
        </Btn>
      </div>
    </div>
  );
}

// ─── Check-In ────────────────────────────────────────────────────────────────

function CheckIn({
  bookings, flights, user, onCheckInComplete,
}: {
  bookings: Booking[];
  flights: Flight[];
  user: AppUser;
  onCheckInComplete: (updatedBooking: Booking) => void;
}) {
  const [pnr, setPnr] = useState("");
  const [found, setFound] = useState<Booking | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [done, setDone] = useState(false);

  function search(e: React.FormEvent) {
    e.preventDefault();
    const b = bookings.find(b => b.pnr.toUpperCase() === pnr.toUpperCase().trim() && b.userId === user.id);
    if (b) { setFound(b); setNotFound(false); }
    else { setNotFound(true); setFound(null); }
  }

  function checkIn() {
    if (!found) return;
    const updated = { ...found, checkedIn: true };
    onCheckInComplete(updated);
    setFound(updated);
    setDone(true);
  }

  const foundFlight = found ? flights.find(f => f.id === found.flightId) : null;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Online Check-In</h1>
        <p className="text-slate-500 mt-1">Enter your PNR to retrieve your booking and check in</p>
      </div>

      <form onSubmit={search} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-6">
        <label className="text-sm font-semibold text-slate-700 block mb-2">
          Booking Reference (PNR)
        </label>
        <div className="flex gap-3">
          <input
            value={pnr}
            onChange={e => setPnr(e.target.value.toUpperCase())}
            placeholder="e.g. SW4K2RMN"
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 bg-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 uppercase"
            maxLength={8}
          />
          <Btn type="submit"><Search className="w-4 h-4" /> Find</Btn>
        </div>
        {notFound && (
          <div className="mt-3 flex items-center gap-2 text-red-600 text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" />
            No booking found with this PNR for your account.
          </div>
        )}
      </form>

      {found && foundFlight && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-sky-600 to-sky-500 p-6 text-white">
            <p className="text-xs text-sky-200/70 mb-1">Booking found</p>
            <div className="flex items-center gap-4">
              <div>
                <p className="text-2xl font-bold">{fmtTime(foundFlight.departureTime)}</p>
                <p className="text-sky-100/70 text-xs">{foundFlight.source}</p>
              </div>
              <div className="flex-1 flex items-center gap-2">
                <div className="flex-1 h-px border-t border-dashed border-white/30" />
                <Plane className="w-4 h-4 text-sky-200" strokeWidth={2} />
                <div className="flex-1 h-px border-t border-dashed border-white/30" />
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{fmtTime(foundFlight.arrivalTime)}</p>
                <p className="text-sky-100/70 text-xs">{foundFlight.destination}</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
              {[
                { label: "PNR", value: found.pnr, mono: true },
                { label: "Passenger", value: found.passengerName },
                { label: "Seat", value: found.seatNumber, mono: true },
                { label: "Gate", value: found.boardingGate, mono: true },
                { label: "Date", value: fmtDate(foundFlight.departureTime) },
                { label: "Status", value: found.checkedIn ? "Checked In" : "Not Checked In" },
              ].map(item => (
                <div key={item.label}>
                  <p className="text-xs text-slate-400 mb-1">{item.label}</p>
                  <p className={`text-sm font-bold text-slate-900 ${item.mono ? "font-mono" : ""}`}>{item.value}</p>
                </div>
              ))}
            </div>

            {done || found.checkedIn ? (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-sm font-semibold">
                  <CheckCircle className="w-5 h-5" />
                  Check-in complete! You're ready to fly.
                </div>
                <Btn className="w-full" onClick={() => onCheckInComplete({ ...found, checkedIn: true })}>
                  <Download className="w-4 h-4" /> Download Boarding Pass
                </Btn>
              </div>
            ) : (
              <Btn className="w-full" size="lg" onClick={checkIn}>
                <CheckCircle className="w-5 h-5" /> Confirm Check-In
              </Btn>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Boarding Pass ────────────────────────────────────────────────────────────

function BoardingPass({
  booking, flight, onNavigate,
}: {
  booking: Booking;
  flight: Flight;
  onNavigate: (s: Screen) => void;
}) {
  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-10" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Boarding Pass</h1>
        <button className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors">
          <Printer className="w-4 h-4" /> Print
        </button>
      </div>

      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl overflow-hidden shadow-2xl shadow-slate-900/30">
        {/* Top section */}
        <div className="p-7 pb-5">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <Plane className="w-5 h-5 text-sky-400" strokeWidth={1.5} />
              <span className="text-lg font-bold text-white">Sky<span className="text-sky-400">Wings</span></span>
            </div>
            <span className="font-mono text-sky-400 text-xs bg-sky-400/10 border border-sky-400/20 px-2.5 py-1 rounded-lg">
              BOARDING PASS
            </span>
          </div>

          <div className="flex items-end gap-4 mb-7">
            <div>
              <p className="text-slate-500 text-xs mb-1">From</p>
              <p className="text-5xl font-bold text-white leading-none">{flight.source.split(" ")[0].replace("(", "").replace(")", "").slice(-3).toUpperCase()}</p>
              <p className="text-slate-400 text-xs mt-1.5 max-w-[150px] leading-relaxed">{flight.source}</p>
            </div>
            <div className="flex-1 pb-1">
              <div className="flex items-center gap-2">
                <div className="flex-1 h-px border-t border-dashed border-white/15" />
                <Plane className="w-5 h-5 text-sky-400" strokeWidth={1.5} />
                <div className="flex-1 h-px border-t border-dashed border-white/15" />
              </div>
            </div>
            <div className="text-right">
              <p className="text-slate-500 text-xs mb-1">To</p>
              <p className="text-5xl font-bold text-white leading-none">{flight.destination.split(" ")[0].replace("(", "").replace(")", "").slice(-3).toUpperCase()}</p>
              <p className="text-slate-400 text-xs mt-1.5 max-w-[150px] leading-relaxed text-right">{flight.destination}</p>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            {[
              { label: "Passenger", value: booking.passengerName, wide: true },
              { label: "Flight", value: flight.flightNumber, mono: true },
              { label: "Date", value: fmtDateShort(flight.departureTime) },
              { label: "Departs", value: fmtTime(flight.departureTime), mono: true },
            ].map(item => (
              <div key={item.label} className={item.wide ? "col-span-2" : ""}>
                <p className="text-slate-500 text-xs mb-1">{item.label}</p>
                <p className={`text-sm font-bold text-white truncate ${item.mono ? "font-mono" : ""}`}>{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Divider with notch */}
        <div className="relative mx-0 flex items-center">
          <div className="w-6 h-6 bg-slate-700 rounded-full -ml-3" />
          <div className="flex-1 border-t border-dashed border-white/10 mx-0" />
          <div className="w-6 h-6 bg-slate-700 rounded-full -mr-3" />
        </div>

        {/* Bottom section */}
        <div className="p-7 pt-5">
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { label: "Seat", value: booking.seatNumber, mono: true, big: true },
              { label: "Gate", value: booking.boardingGate, mono: true, big: true },
              { label: "Class", value: "Economy", big: false },
              { label: "PNR", value: booking.pnr, mono: true },
              { label: "Gender", value: booking.passengerGender },
              { label: "Age", value: String(booking.passengerAge) },
            ].map(item => (
              <div key={item.label}>
                <p className="text-slate-500 text-xs mb-1">{item.label}</p>
                <p className={`font-bold text-white ${item.mono ? "font-mono" : ""} ${item.big ? "text-2xl" : "text-sm"}`}>{item.value}</p>
              </div>
            ))}
          </div>

          {/* Barcode */}
          <div className="flex flex-col items-center gap-2">
            <div className="flex gap-0.5 h-14 items-end">
              {Array.from({ length: 48 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white/70 rounded-sm"
                  style={{ width: [1, 2, 3, 1, 2, 1, 3, 2, 1, 2][i % 10], height: `${50 + (i % 5) * 10}%` }}
                />
              ))}
            </div>
            <p className="font-mono text-xs text-slate-500 tracking-widest">{booking.pnr} · {flight.flightNumber}</p>
          </div>
        </div>

        {/* Status bar */}
        <div className="bg-emerald-500/10 border-t border-emerald-500/20 px-7 py-3 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" strokeWidth={2} />
          <span className="text-emerald-400 text-xs font-semibold">CHECK-IN COMPLETE · READY TO BOARD</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mt-6">
        <Btn variant="outline" className="flex-1" onClick={() => onNavigate("dashboard")}>
          Back to Dashboard
        </Btn>
        <Btn className="flex-1" onClick={() => onNavigate("browse")}>
          <Search className="w-4 h-4" /> Book Another Flight
        </Btn>
      </div>
    </div>
  );
}

// ─── Admin Dashboard ──────────────────────────────────────────────────────────

function AdminDashboard({
  flights, users, bookings, onFlightsChange,
}: {
  flights: Flight[];
  users: AppUser[];
  bookings: Booking[];
  onFlightsChange: (flights: Flight[]) => void;
}) {
  const [tab, setTab] = useState<"flights" | "passengers" | "bookings">("flights");
  const [showAddFlight, setShowAddFlight] = useState(false);
  const [editFlight, setEditFlight] = useState<Flight | null>(null);
  const [searchUser, setSearchUser] = useState("");
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  // New flight form
  const emptyFlight = { name: "", flightNumber: "", source: "", destination: "", departureTime: "", arrivalTime: "", price: "", totalSeats: "", bookedSeats: "0" };
  const [form, setForm] = useState(emptyFlight);
  const [isEdit, setIsEdit] = useState(false);

  const showToast = (msg: string, type: "success" | "error") => setToast({ msg, type });

  function openAdd() { setForm(emptyFlight); setIsEdit(false); setShowAddFlight(true); setEditFlight(null); }
  function openEdit(f: Flight) {
    setForm({
      name: f.name, flightNumber: f.flightNumber, source: f.source, destination: f.destination,
      departureTime: f.departureTime, arrivalTime: f.arrivalTime,
      price: String(f.price), totalSeats: String(f.totalSeats), bookedSeats: String(f.bookedSeats),
    });
    setIsEdit(true); setShowAddFlight(true); setEditFlight(f);
  }

  function saveFlight(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.flightNumber || !form.source || !form.destination || !form.departureTime || !form.arrivalTime || !form.price || !form.totalSeats) {
      showToast("Please fill all required fields", "error"); return;
    }
    if (isEdit && editFlight) {
      const updated = flights.map(f => f.id === editFlight.id ? {
        ...f, ...form, price: parseFloat(form.price), totalSeats: parseInt(form.totalSeats), bookedSeats: parseInt(form.bookedSeats),
      } : f);
      onFlightsChange(updated);
      showToast("Flight updated successfully", "success");
    } else {
      if (flights.find(f => f.flightNumber === form.flightNumber)) {
        showToast("A flight with this number already exists", "error"); return;
      }
      const newFlight: Flight = {
        id: genId(), ...form, price: parseFloat(form.price),
        totalSeats: parseInt(form.totalSeats), bookedSeats: parseInt(form.bookedSeats),
      };
      onFlightsChange([...flights, newFlight]);
      showToast("Flight added successfully", "success");
    }
    setShowAddFlight(false);
  }

  function deleteFlight(id: string) {
    if (!window.confirm("Delete this flight? All associated bookings will be orphaned.")) return;
    onFlightsChange(flights.filter(f => f.id !== id));
    showToast("Flight deleted", "success");
  }

  const filteredUsers = users.filter(u => {
    const q = searchUser.toLowerCase();
    return !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
  });

  const tabs = [
    { key: "flights", label: "Flights", icon: Plane },
    { key: "passengers", label: "Passengers", icon: Users },
    { key: "bookings", label: "Bookings", icon: Calendar },
  ] as const;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-5 h-5 text-sky-500" />
            <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
          </div>
          <p className="text-slate-500 text-sm">Manage flights, passengers, and reservations</p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm px-4 py-3 text-center">
            <p className="text-2xl font-bold text-sky-600">{flights.length}</p>
            <p className="text-xs text-slate-500">Flights</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm px-4 py-3 text-center">
            <p className="text-2xl font-bold text-violet-600">{users.length}</p>
            <p className="text-xs text-slate-500">Users</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm px-4 py-3 text-center">
            <p className="text-2xl font-bold text-emerald-600">{bookings.length}</p>
            <p className="text-xs text-slate-500">Bookings</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-white border border-slate-200 rounded-2xl p-1 mb-6 shadow-sm w-fit">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${tab === t.key ? "bg-sky-500 text-white shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
          >
            <t.icon className="w-4 h-4" />
            {t.label}
          </button>
        ))}
      </div>

      {/* Flights tab */}
      {tab === "flights" && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900">All Flights ({flights.length})</h2>
            <Btn onClick={openAdd} size="sm"><Plus className="w-4 h-4" /> Add Flight</Btn>
          </div>

          {/* Add / Edit form */}
          {showAddFlight && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
              <h3 className="font-bold text-slate-900 mb-5">{isEdit ? "Edit Flight" : "Add New Flight"}</h3>
              <form onSubmit={saveFlight} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <Input label="Airline Name" value={form.name} onChange={v => setForm(p => ({ ...p, name: v }))} placeholder="Sky Wings Express" required />
                <Input label="Flight Number" value={form.flightNumber} onChange={v => setForm(p => ({ ...p, flightNumber: v }))} placeholder="SW101" required />
                <Input label="Source" value={form.source} onChange={v => setForm(p => ({ ...p, source: v }))} placeholder="New York (JFK)" required />
                <Input label="Destination" value={form.destination} onChange={v => setForm(p => ({ ...p, destination: v }))} placeholder="Los Angeles (LAX)" required />
                <Input label="Departure Time" value={form.departureTime} onChange={v => setForm(p => ({ ...p, departureTime: v }))} type="datetime-local" required />
                <Input label="Arrival Time" value={form.arrivalTime} onChange={v => setForm(p => ({ ...p, arrivalTime: v }))} type="datetime-local" required />
                <Input label="Ticket Price ($)" value={form.price} onChange={v => setForm(p => ({ ...p, price: v }))} type="number" placeholder="299" min="1" required />
                <Input label="Total Seats" value={form.totalSeats} onChange={v => setForm(p => ({ ...p, totalSeats: v }))} type="number" placeholder="180" min="1" required />
                <Input label="Booked Seats" value={form.bookedSeats} onChange={v => setForm(p => ({ ...p, bookedSeats: v }))} type="number" placeholder="0" min="0" />
                <div className="sm:col-span-2 lg:col-span-3 flex gap-3 pt-2">
                  <Btn variant="outline" onClick={() => setShowAddFlight(false)}>Cancel</Btn>
                  <Btn type="submit">{isEdit ? "Update Flight" : "Add Flight"}</Btn>
                </div>
              </form>
            </div>
          )}

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    {["Flight", "Route", "Schedule", "Price", "Availability", "Actions"].map(h => (
                      <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {flights.map(f => {
                    const av = availability(f);
                    return (
                      <tr key={f.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-5 py-4">
                          <p className="font-semibold text-slate-900">{f.flightNumber}</p>
                          <p className="text-xs text-slate-400 mt-0.5">{f.name}</p>
                        </td>
                        <td className="px-5 py-4">
                          <p className="text-slate-700 whitespace-nowrap">{f.source}</p>
                          <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                            <ChevronRight className="w-3 h-3" />{f.destination}
                          </p>
                        </td>
                        <td className="px-5 py-4">
                          <p className="text-slate-700 whitespace-nowrap">{fmtDate(f.departureTime)}</p>
                          <p className="text-xs text-slate-400 mt-0.5 font-mono">{fmtTime(f.departureTime)} → {fmtTime(f.arrivalTime)}</p>
                        </td>
                        <td className="px-5 py-4">
                          <span className="font-bold text-sky-600">${f.price}</span>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${av.badge} whitespace-nowrap`}>
                            <span className={`inline-block w-1.5 h-1.5 rounded-full ${av.dot} mr-1.5`} />
                            {f.bookedSeats}/{f.totalSeats}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <button onClick={() => openEdit(f)} className="p-1.5 rounded-lg text-slate-400 hover:text-sky-600 hover:bg-sky-50 transition-all">
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => deleteFlight(f.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {flights.length === 0 && (
              <div className="text-center py-12 text-slate-400">
                <Plane className="w-10 h-10 mx-auto mb-2 opacity-20" />
                <p className="font-medium">No flights yet. Add one above.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Passengers tab */}
      {tab === "passengers" && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900">Registered Passengers ({users.length})</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                value={searchUser}
                onChange={e => setSearchUser(e.target.value)}
                placeholder="Search passengers…"
                className="pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 w-56"
              />
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    {["Name", "Age / Gender", "Contact", "Bookings"].map(h => (
                      <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredUsers.map(u => {
                    const userBookings = bookings.filter(b => b.userId === u.id);
                    return (
                      <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 font-bold text-xs shrink-0">
                              {u.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                            </div>
                            <div>
                              <p className="font-semibold text-slate-900">{u.name}</p>
                              <p className="text-xs text-slate-400">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-slate-600">{u.age} · {u.gender}</td>
                        <td className="px-5 py-4 text-slate-600 font-mono text-xs">{u.phone}</td>
                        <td className="px-5 py-4">
                          <span className="px-2.5 py-1 bg-sky-50 text-sky-700 rounded-lg text-xs font-bold">{userBookings.length}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {filteredUsers.length === 0 && (
              <div className="text-center py-12 text-slate-400">
                <Users className="w-10 h-10 mx-auto mb-2 opacity-20" />
                <p className="font-medium">No passengers found.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bookings tab */}
      {tab === "bookings" && (
        <div>
          <h2 className="text-lg font-bold text-slate-900 mb-4">All Reservations ({bookings.length})</h2>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    {["PNR", "Passenger", "Flight", "Route", "Seat", "Status", "Booked"].map(h => (
                      <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {bookings.map(b => {
                    const fl = flights.find(f => f.id === b.flightId);
                    return (
                      <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-5 py-4">
                          <span className="font-mono font-bold text-sky-600 text-xs">{b.pnr}</span>
                        </td>
                        <td className="px-5 py-4">
                          <p className="font-semibold text-slate-900">{b.passengerName}</p>
                          <p className="text-xs text-slate-400">{b.passengerAge} · {b.passengerGender}</p>
                        </td>
                        <td className="px-5 py-4">
                          <span className="font-mono text-slate-600 text-xs">{fl?.flightNumber ?? "—"}</span>
                        </td>
                        <td className="px-5 py-4 text-slate-600 whitespace-nowrap text-xs">
                          {fl ? `${fl.source.split(" ")[0]} → ${fl.destination.split(" ")[0]}` : "—"}
                        </td>
                        <td className="px-5 py-4">
                          <span className="font-mono text-slate-700 text-xs">{b.seatNumber}</span>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${b.checkedIn ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                            {b.checkedIn ? "Checked In" : "Pending"}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-slate-500 text-xs whitespace-nowrap">{fmtDateShort(b.bookingDate)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {bookings.length === 0 && (
              <div className="text-center py-12 text-slate-400">
                <Calendar className="w-10 h-10 mx-auto mb-2 opacity-20" />
                <p className="font-medium">No bookings yet.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main App ──────────────────────────────────────────────────────────────────

export default function App() {
  const [splashDone, setSplashDone] = useState(false);
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [screen, setScreen] = useState<Screen>("auth");
  const [users, setUsers] = useState<AppUser[]>([]);
  const [flights, setFlights] = useState<Flight[]>(SEED_FLIGHTS);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [currentBooking, setCurrentBooking] = useState<Booking | null>(null);
  const [boardingPassBooking, setBoardingPassBooking] = useState<Booking | null>(null);
  const [boardingPassFlight, setBoardingPassFlight] = useState<Flight | null>(null);

  function navigate(s: Screen) {
    setScreen(s);
  }

  function handleLogin(user: AppUser) {
    setCurrentUser(user);
    setScreen(user.role === "admin" ? "admin" : "dashboard");
  }

  function handleLogout() {
    setCurrentUser(null);
    setScreen("auth");
    setSelectedFlight(null);
    setCurrentBooking(null);
  }

  function handleSelectFlight(f: Flight) {
    setSelectedFlight(f);
    setScreen("flight-detail");
  }

  function handleBooked(booking: Booking, updatedFlight: Flight) {
    setBookings(prev => [...prev, booking]);
    setFlights(prev => prev.map(f => f.id === updatedFlight.id ? updatedFlight : f));
    setCurrentBooking(booking);
    setScreen("booking-confirm");
  }

  function handleCheckInComplete(updatedBooking: Booking) {
    setBookings(prev => prev.map(b => b.id === updatedBooking.id ? updatedBooking : b));
    const fl = flights.find(f => f.id === updatedBooking.flightId);
    if (fl) {
      setBoardingPassBooking(updatedBooking);
      setBoardingPassFlight(fl);
      setScreen("boarding-pass");
    }
  }

  const showNav = currentUser && screen !== "auth";

  return (
    <div style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }} className="min-h-screen bg-slate-50">
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-12px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>

      {!splashDone && <SplashScreen onDone={() => setSplashDone(true)} />}

      {showNav && (
        <NavBar
          user={currentUser}
          screen={screen}
          onNavigate={navigate}
          onLogout={handleLogout}
        />
      )}

      <main>
        {screen === "auth" && splashDone && (
          <AuthScreen onLogin={handleLogin} users={users} onAddUser={u => setUsers(p => [...p, u])} />
        )}

        {screen === "dashboard" && currentUser && (
          <Dashboard user={currentUser} flights={flights} bookings={bookings} onNavigate={navigate} />
        )}

        {screen === "browse" && (
          <BrowseFlights flights={flights} onSelect={handleSelectFlight} />
        )}

        {screen === "flight-detail" && selectedFlight && currentUser && (
          <FlightDetail
            flight={flights.find(f => f.id === selectedFlight.id) ?? selectedFlight}
            user={currentUser}
            onBack={() => setScreen("browse")}
            onBooked={handleBooked}
          />
        )}

        {screen === "booking-confirm" && currentBooking && (
          <BookingConfirmation
            booking={currentBooking}
            flight={flights.find(f => f.id === currentBooking.flightId)!}
            onNavigate={navigate}
          />
        )}

        {screen === "checkin" && currentUser && (
          <CheckIn
            bookings={bookings}
            flights={flights}
            user={currentUser}
            onCheckInComplete={handleCheckInComplete}
          />
        )}

        {screen === "boarding-pass" && boardingPassBooking && boardingPassFlight && (
          <BoardingPass
            booking={boardingPassBooking}
            flight={boardingPassFlight}
            onNavigate={navigate}
          />
        )}

        {screen === "admin" && currentUser?.role === "admin" && (
          <AdminDashboard
            flights={flights}
            users={users}
            bookings={bookings}
            onFlightsChange={setFlights}
          />
        )}
      </main>
    </div>
  );
}
