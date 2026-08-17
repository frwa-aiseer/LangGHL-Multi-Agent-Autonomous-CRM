import React, { useState } from "react";
import {
  Building2,
  Lock,
  Mail,
  Eye,
  EyeOff,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap,
  Sparkles,
  HelpCircle,
  X,
  CreditCard,
  Send,
  Users,
  Check,
  Globe,
  Headphones,
  Award,
} from "lucide-react";

export interface UserSession {
  companyName: string;
  email: string;
  plan: "Starter" | "Growth" | "Enterprise";
  role: string;
  isLoggedIn: boolean;
}

interface SubscriptionAuthPortalProps {
  onLoginSuccess: (session: UserSession) => void;
  onContinueAsGuest?: () => void;
  initialMode?: "login" | "signup";
}

export const SubscriptionAuthPortal: React.FC<SubscriptionAuthPortalProps> = ({
  onLoginSuccess,
  onContinueAsGuest,
  initialMode = "login",
}) => {
  // Navigation & View state
  const [navTab, setNavTab] = useState<"auth" | "features" | "pricing" | "support">("auth");
  const [authMode, setAuthMode] = useState<"login" | "signup">(initialMode);
  const [selectedPlan, setSelectedPlan] = useState<"Starter" | "Growth" | "Enterprise">("Growth");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual");

  // Login Form States
  const [loginEmail, setLoginEmail] = useState("alex.wright@nexgenlogistics.com");
  const [loginPassword, setLoginPassword] = useState("EnterprisePass123!");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loginErrors, setLoginErrors] = useState<{ email?: string; password?: string }>({});
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Signup Form States
  const [signupCompany, setSignupCompany] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [signupErrors, setSignupErrors] = useState<{
    company?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    terms?: string;
  }>({});
  const [isSigningUp, setIsSigningUp] = useState(false);

  // Modal Dialog States
  const [modalContent, setModalContent] = useState<
    "privacy" | "terms" | "contact" | "forgot_password" | null
  >(null);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);
  const [contactSubject, setContactSubject] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [contactSuccess, setContactSuccess] = useState(false);

  // Email validator
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Handle Login Validation & Submission
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: { email?: string; password?: string } = {};

    if (!loginEmail.trim()) {
      errors.email = "Please enter your company email address.";
    } else if (!isValidEmail(loginEmail)) {
      errors.email = "Please enter a valid email address (e.g. name@company.com).";
    }

    if (!loginPassword) {
      errors.password = "Please enter your password.";
    } else if (loginPassword.length < 6) {
      errors.password = "Password must be at least 6 characters.";
    }

    setLoginErrors(errors);

    if (Object.keys(errors).length === 0) {
      setIsLoggingIn(true);
      setTimeout(() => {
        setIsLoggingIn(false);
        const extractedCompany =
          loginEmail.split("@")[1]?.split(".")[0]?.toUpperCase() + " CORP" || "NEXGEN LOGISTICS";
        onLoginSuccess({
          companyName: extractedCompany,
          email: loginEmail,
          plan: selectedPlan,
          role: "Workspace Administrator",
          isLoggedIn: true,
        });
      }, 750);
    }
  };

  // Handle Signup Validation & Submission
  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: {
      company?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
      terms?: string;
    } = {};

    if (!signupCompany.trim()) {
      errors.company = "Company name is required.";
    }

    if (!signupEmail.trim()) {
      errors.email = "Please enter your corporate email address.";
    } else if (!isValidEmail(signupEmail)) {
      errors.email = "Please enter a valid work email address (e.g. alex@company.com).";
    }

    if (!signupPassword) {
      errors.password = "Please create a password.";
    } else if (signupPassword.length < 8) {
      errors.password = "Password must be at least 8 characters long.";
    }

    if (!signupConfirmPassword) {
      errors.confirmPassword = "Please confirm your password.";
    } else if (signupPassword !== signupConfirmPassword) {
      errors.confirmPassword = "Passwords do not match. Please re-enter.";
    }

    if (!agreeToTerms) {
      errors.terms = "You must agree to the Terms and Conditions to proceed.";
    }

    setSignupErrors(errors);

    if (Object.keys(errors).length === 0) {
      setIsSigningUp(true);
      setTimeout(() => {
        setIsSigningUp(false);
        onLoginSuccess({
          companyName: signupCompany,
          email: signupEmail,
          plan: selectedPlan,
          role: "Workspace Owner",
          isLoggedIn: true,
        });
      }, 900);
    }
  };

  // Fill Quick Demo Login
  const fillDemoAccount = (role: "Enterprise Admin" | "Growth Lead") => {
    if (role === "Enterprise Admin") {
      setLoginEmail("sarah.connor@apexenterprise.io");
      setLoginPassword("ApexSecure#2026");
      setSelectedPlan("Enterprise");
    } else {
      setLoginEmail("marcus.sterling@flowdynamics.com");
      setLoginPassword("GrowthPilot2026!");
      setSelectedPlan("Growth");
    }
    setLoginErrors({});
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between font-sans selection:bg-indigo-500 selection:text-white">
      {/* ------------------------------------------------------------- */}
      {/* HEADER & NAVIGATION BAR */}
      {/* ------------------------------------------------------------- */}
      <header className="border-b border-slate-800/80 bg-slate-900/90 backdrop-blur sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Company Logo & Application Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-md shadow-indigo-900/40 text-white font-black text-xl tracking-tighter">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-white">Operant</span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Enterprise
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Autonomous AI Monetization & CRM Subscription
              </p>
            </div>
          </div>

          {/* Navigation Bar */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => {
                setNavTab("auth");
                setAuthMode("login");
              }}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                navTab === "auth" && authMode === "login"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Home
            </button>
            <button
              onClick={() => setNavTab("features")}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                navTab === "features"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Features
            </button>
            <button
              onClick={() => setNavTab("pricing")}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                navTab === "pricing"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Pricing
            </button>
            <button
              onClick={() => setNavTab("support")}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                navTab === "support"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Support
            </button>
          </nav>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => {
                setNavTab("auth");
                setAuthMode("login");
              }}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                authMode === "login" && navTab === "auth"
                  ? "text-white bg-slate-800"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Log In
            </button>
            <button
              onClick={() => {
                setNavTab("auth");
                setAuthMode("signup");
              }}
              className="px-4 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-900/40 transition-all flex items-center gap-1.5"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* ------------------------------------------------------------- */}
      {/* MAIN CONTENT AREA */}
      {/* ------------------------------------------------------------- */}
      <main className="flex-1 flex flex-col justify-center py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* VIEW 1: AUTH SECTION (LOGIN & SIGNUP FORMS) */}
        {navTab === "auth" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-5xl mx-auto w-full">
            {/* Left Value Column */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <span className="text-xs uppercase font-bold tracking-widest text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
                  Enterprise Subscription
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-3 leading-tight">
                  Power Your Sales Pipeline with Autonomous AI
                </h1>
                <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                  Join forward-thinking companies deploying 24/7 lead qualification, multi-channel follow-ups, and automated high-ticket conversions.
                </p>
              </div>

              {/* Value Checkpoints */}
              <div className="space-y-3 pt-2">
                {[
                  "SOC-2 Type II Certified & End-to-End Encrypted",
                  "14-Day Free Trial on all subscription tiers",
                  "Automated GoHighLevel CRM integration",
                  "Dedicated 24/7 Priority Support & Onboarding",
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              {/* Quick Demo Shortcuts Card */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-3">
                <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider block">
                  ⚡ Quick Demo Login Presets
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => fillDemoAccount("Enterprise Admin")}
                    className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 text-left transition-all group"
                  >
                    <div className="text-xs font-bold text-white group-hover:text-indigo-300">Enterprise Admin</div>
                    <div className="text-[10px] text-slate-400">Apex Enterprise</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => fillDemoAccount("Growth Lead")}
                    className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 text-left transition-all group"
                  >
                    <div className="text-xs font-bold text-white group-hover:text-indigo-300">Growth Plan</div>
                    <div className="text-[10px] text-slate-400">Flow Dynamics</div>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Card: Login / Signup Form */}
            <div className="lg:col-span-7 bg-slate-900 border border-slate-800/90 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden backdrop-blur-xl">
              {/* Form Mode Selector Switcher */}
              <div className="flex items-center bg-slate-950 p-1 rounded-2xl border border-slate-800/80 mb-6">
                <button
                  type="button"
                  id="tab-btn-login"
                  onClick={() => {
                    setAuthMode("login");
                    setLoginErrors({});
                  }}
                  className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
                    authMode === "login"
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-900/40"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Login to Account
                </button>
                <button
                  type="button"
                  id="tab-btn-signup"
                  onClick={() => {
                    setAuthMode("signup");
                    setSignupErrors({});
                  }}
                  className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
                    authMode === "signup"
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-900/40"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Create Company Account
                </button>
              </div>

              {/* ======================================================= */}
              {/* LOGIN FORM */}
              {/* ======================================================= */}
              {authMode === "login" ? (
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <h2 className="text-xl font-bold text-white tracking-tight">Login to Your Account</h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Enter your corporate credentials to access your company dashboard.
                    </p>
                  </div>

                  {/* Field: Email Address */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                      <span>Email Address</span>
                      {loginErrors.email && (
                        <span className="text-rose-400 text-[11px] font-normal">{loginErrors.email}</span>
                      )}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        id="login-email-input"
                        value={loginEmail}
                        onChange={(e) => {
                          setLoginEmail(e.target.value);
                          if (loginErrors.email) setLoginErrors((prev) => ({ ...prev, email: undefined }));
                        }}
                        placeholder="you@company.com"
                        className={`w-full pl-10 pr-3 py-2.5 bg-slate-950 border rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition-all ${
                          loginErrors.email
                            ? "border-rose-500/80 focus:border-rose-500 bg-rose-500/5"
                            : "border-slate-800 focus:border-indigo-500"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Field: Password */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-slate-300">Password</label>
                      <button
                        type="button"
                        onClick={() => {
                          setForgotEmail(loginEmail);
                          setForgotSent(false);
                          setModalContent("forgot_password");
                        }}
                        className="text-[11px] text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type={showLoginPassword ? "text" : "password"}
                        id="login-password-input"
                        value={loginPassword}
                        onChange={(e) => {
                          setLoginPassword(e.target.value);
                          if (loginErrors.password)
                            setLoginErrors((prev) => ({ ...prev, password: undefined }));
                        }}
                        placeholder="••••••••••••"
                        className={`w-full pl-10 pr-10 py-2.5 bg-slate-950 border rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition-all ${
                          loginErrors.password
                            ? "border-rose-500/80 focus:border-rose-500 bg-rose-500/5"
                            : "border-slate-800 focus:border-indigo-500"
                        }`}
                      />
                      {/* Show Password Toggle */}
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200"
                        title={showLoginPassword ? "Hide password" : "Show password"}
                      >
                        {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {loginErrors.password && (
                      <p className="text-rose-400 text-[11px] mt-1">{loginErrors.password}</p>
                    )}
                  </div>

                  {/* Checkbox: Remember me */}
                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-slate-900"
                      />
                      <span className="text-xs text-slate-300 select-none">Remember this device</span>
                    </label>
                  </div>

                  {/* Primary Button: Login */}
                  <button
                    type="submit"
                    id="btn-submit-login"
                    disabled={isLoggingIn}
                    className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-900/40 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
                  >
                    {isLoggingIn ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Authenticating Workspace...</span>
                      </>
                    ) : (
                      <>
                        <span>Login to Workspace</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  {/* Switch to Signup Link */}
                  <div className="text-center pt-3 border-t border-slate-800 text-xs text-slate-400">
                    Don't have an enterprise account?{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode("signup");
                        setSignupErrors({});
                      }}
                      className="text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-4"
                    >
                      Sign up for a subscription
                    </button>
                  </div>
                </form>
              ) : (
                /* ======================================================= */
                /* SIGNUP FORM */
                /* ======================================================= */
                <form onSubmit={handleSignupSubmit} className="space-y-3.5">
                  <div>
                    <h2 className="text-xl font-bold text-white tracking-tight">
                      Create Your Company Account
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Start your 14-day full access trial for your organization.
                    </p>
                  </div>

                  {/* Field: Company Name */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                      <span>Company Name</span>
                      {signupErrors.company && (
                        <span className="text-rose-400 text-[11px] font-normal">{signupErrors.company}</span>
                      )}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        id="signup-company-input"
                        value={signupCompany}
                        onChange={(e) => {
                          setSignupCompany(e.target.value);
                          if (signupErrors.company)
                            setSignupErrors((prev) => ({ ...prev, company: undefined }));
                        }}
                        placeholder="Acme Technologies Inc."
                        className={`w-full pl-10 pr-3 py-2 bg-slate-950 border rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition-all ${
                          signupErrors.company
                            ? "border-rose-500/80 focus:border-rose-500 bg-rose-500/5"
                            : "border-slate-800 focus:border-indigo-500"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Field: Corporate Email */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                      <span>Work Email Address</span>
                      {signupErrors.email && (
                        <span className="text-rose-400 text-[11px] font-normal">{signupErrors.email}</span>
                      )}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        id="signup-email-input"
                        value={signupEmail}
                        onChange={(e) => {
                          setSignupEmail(e.target.value);
                          if (signupErrors.email)
                            setSignupErrors((prev) => ({ ...prev, email: undefined }));
                        }}
                        placeholder="founder@company.com"
                        className={`w-full pl-10 pr-3 py-2 bg-slate-950 border rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition-all ${
                          signupErrors.email
                            ? "border-rose-500/80 focus:border-rose-500 bg-rose-500/5"
                            : "border-slate-800 focus:border-indigo-500"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Password & Confirm Password side-by-side */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Field: Password */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300 block">Password</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                          <Lock className="w-3.5 h-3.5" />
                        </div>
                        <input
                          type={showSignupPassword ? "text" : "password"}
                          id="signup-password-input"
                          value={signupPassword}
                          onChange={(e) => {
                            setSignupPassword(e.target.value);
                            if (signupErrors.password)
                              setSignupErrors((prev) => ({ ...prev, password: undefined }));
                          }}
                          placeholder="Min. 8 chars"
                          className={`w-full pl-9 pr-9 py-2 bg-slate-950 border rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition-all ${
                            signupErrors.password
                              ? "border-rose-500/80 bg-rose-500/5"
                              : "border-slate-800 focus:border-indigo-500"
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowSignupPassword(!showSignupPassword)}
                          className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-200"
                        >
                          {showSignupPassword ? (
                            <EyeOff className="w-3.5 h-3.5" />
                          ) : (
                            <Eye className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                      {signupErrors.password && (
                        <p className="text-rose-400 text-[10px] mt-0.5">{signupErrors.password}</p>
                      )}
                    </div>

                    {/* Field: Confirm Password */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300 block">Confirm Password</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                          <Lock className="w-3.5 h-3.5" />
                        </div>
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          id="signup-confirm-password-input"
                          value={signupConfirmPassword}
                          onChange={(e) => {
                            setSignupConfirmPassword(e.target.value);
                            if (signupErrors.confirmPassword)
                              setSignupErrors((prev) => ({
                                ...prev,
                                confirmPassword: undefined,
                              }));
                          }}
                          placeholder="Re-enter password"
                          className={`w-full pl-9 pr-9 py-2 bg-slate-950 border rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition-all ${
                            signupErrors.confirmPassword
                              ? "border-rose-500/80 bg-rose-500/5"
                              : "border-slate-800 focus:border-indigo-500"
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-200"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="w-3.5 h-3.5" />
                          ) : (
                            <Eye className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                      {signupErrors.confirmPassword && (
                        <p className="text-rose-400 text-[10px] mt-0.5">
                          {signupErrors.confirmPassword}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Plan Selection Badge */}
                  <div className="bg-slate-950/70 border border-slate-800/90 rounded-xl p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-indigo-400" />
                      <span className="text-xs text-slate-300 font-medium">Selected Tier:</span>
                      <span className="text-xs font-bold text-indigo-300 bg-indigo-500/20 px-2 py-0.5 rounded-md">
                        {selectedPlan} Plan (14-Day Free Trial)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setNavTab("pricing")}
                      className="text-[11px] text-indigo-400 hover:underline"
                    >
                      Change Plan
                    </button>
                  </div>

                  {/* Checkbox: Terms and Conditions */}
                  <div className="space-y-1 pt-1">
                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        id="terms-checkbox"
                        checked={agreeToTerms}
                        onChange={(e) => {
                          setAgreeToTerms(e.target.checked);
                          if (signupErrors.terms)
                            setSignupErrors((prev) => ({ ...prev, terms: undefined }));
                        }}
                        className="mt-0.5 w-4 h-4 rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-xs text-slate-300 select-none leading-relaxed">
                        I agree to the{" "}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            setModalContent("terms");
                          }}
                          className="text-indigo-400 underline hover:text-indigo-300"
                        >
                          Terms and Conditions
                        </button>{" "}
                        and{" "}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            setModalContent("privacy");
                          }}
                          className="text-indigo-400 underline hover:text-indigo-300"
                        >
                          Privacy Policy
                        </button>
                      </span>
                    </label>
                    {signupErrors.terms && (
                      <p className="text-rose-400 text-[11px] pl-6">{signupErrors.terms}</p>
                    )}
                  </div>

                  {/* Primary Button: Sign Up */}
                  <button
                    type="submit"
                    id="btn-submit-signup"
                    disabled={isSigningUp}
                    className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-900/40 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
                  >
                    {isSigningUp ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Provisioning Workspace & Subscription...</span>
                      </>
                    ) : (
                      <>
                        <span>Create Company Account & Start Free Trial</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  {/* Switch to Login Link */}
                  <div className="text-center pt-2.5 border-t border-slate-800 text-xs text-slate-400">
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode("login");
                        setLoginErrors({});
                      }}
                      className="text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-4"
                    >
                      Login
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* VIEW 2: FEATURES SECTION */}
        {navTab === "features" && (
          <div className="space-y-8 max-w-5xl mx-auto w-full py-4">
            <div className="text-center space-y-2 max-w-2xl mx-auto">
              <span className="text-xs uppercase font-bold tracking-widest text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
                Product Architecture
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Everything Your Sales Team Needs to Scale
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Built specifically for high-ticket agencies, SaaS platforms, and enterprise education providers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: Sparkles,
                  title: "Autonomous Lead Scoring",
                  desc: "Analyzes company intent, budget authority, and urgency to assign real-time ICP scores in seconds.",
                },
                {
                  icon: Mail,
                  title: "Smart Multi-Touch Outreach",
                  desc: "Generates tailored 3-step value-first email and SMS sequences customized with prospect data.",
                },
                {
                  icon: Zap,
                  title: "24/7 Objection Handling",
                  desc: "Automatically responds to pricing and timing objections with calendar booking links.",
                },
                {
                  icon: Users,
                  title: "Multi-Seat Role Management",
                  desc: "Granular permissions for closers, account executives, and sales development reps.",
                },
                {
                  icon: ShieldCheck,
                  title: "Enterprise Data Compliance",
                  desc: "Full SOC-2 Type II controls, automated retention policies, and GDPR/CCPA readiness.",
                },
                {
                  icon: Globe,
                  title: "GoHighLevel CRM 2-Way Sync",
                  desc: "Live bi-directional contact synchronization, pipeline stage routing, and webhook execution.",
                },
              ].map((feature, i) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={i}
                    className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3 hover:border-indigo-500/40 transition-all"
                  >
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm font-bold text-white">{feature.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{feature.desc}</p>
                  </div>
                );
              })}
            </div>

            <div className="text-center pt-4">
              <button
                onClick={() => {
                  setNavTab("auth");
                  setAuthMode("signup");
                }}
                className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-900/40 transition-all inline-flex items-center gap-2"
              >
                <span>Start Your 14-Day Free Trial</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* VIEW 3: PRICING SECTION */}
        {navTab === "pricing" && (
          <div className="space-y-8 max-w-5xl mx-auto w-full py-4">
            <div className="text-center space-y-2 max-w-2xl mx-auto">
              <span className="text-xs uppercase font-bold tracking-widest text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
                Transparent Pricing
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Simple, Predictable Plans for Growing Teams
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                All plans include a 14-day no-risk trial. Cancel anytime with a single click.
              </p>

              {/* Billing Cycle Switcher */}
              <div className="flex items-center justify-center gap-3 pt-2">
                <span
                  className={`text-xs font-semibold ${
                    billingCycle === "monthly" ? "text-white" : "text-slate-400"
                  }`}
                >
                  Monthly Billing
                </span>
                <button
                  type="button"
                  onClick={() => setBillingCycle(billingCycle === "monthly" ? "annual" : "monthly")}
                  className={`w-12 h-6 rounded-full p-1 transition-colors relative ${
                    billingCycle === "annual" ? "bg-indigo-600" : "bg-slate-800"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      billingCycle === "annual" ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </button>
                <span
                  className={`text-xs font-semibold flex items-center gap-1.5 ${
                    billingCycle === "annual" ? "text-white" : "text-slate-400"
                  }`}
                >
                  <span>Annual Billing</span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                    Save 20%
                  </span>
                </span>
              </div>
            </div>

            {/* Pricing Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  tier: "Starter" as const,
                  priceMonthly: 49,
                  priceAnnual: 39,
                  desc: "Ideal for boutique agencies and solo founders scaling outreach.",
                  features: [
                    "Up to 500 AI Qualified Leads/mo",
                    "3 Automated Follow-Up Sequences",
                    "Standard GHL Pipeline Integration",
                    "1 Admin Seat Included",
                    "Community & Email Support",
                  ],
                  highlight: false,
                },
                {
                  tier: "Growth" as const,
                  priceMonthly: 149,
                  priceAnnual: 119,
                  desc: "Our most popular package for high-volume sales teams.",
                  features: [
                    "Up to 2,500 AI Qualified Leads/mo",
                    "Unlimited Outreach Sequences",
                    "24/7 Autonomous Objection Handling",
                    "5 Team Seats + Audit Trail",
                    "Priority Email & Slack Support",
                    "Custom GHL Webhook Triggers",
                  ],
                  highlight: true,
                },
                {
                  tier: "Enterprise" as const,
                  priceMonthly: 399,
                  priceAnnual: 319,
                  desc: "Dedicated SLA & customized machine intelligence for large firms.",
                  features: [
                    "Unlimited AI Pipeline Qualification",
                    "Custom Multi-Agent Workflows",
                    "Dedicated Account Strategist",
                    "Unlimited Team Seats",
                    "99.9% Uptime SLA & Custom DPA",
                    "Single Sign-On (SSO) Support",
                  ],
                  highlight: false,
                },
              ].map((plan, idx) => {
                const isSelected = selectedPlan === plan.tier;
                const price = billingCycle === "annual" ? plan.priceAnnual : plan.priceMonthly;

                return (
                  <div
                    key={idx}
                    className={`rounded-3xl p-6 flex flex-col justify-between relative transition-all ${
                      plan.highlight
                        ? "bg-slate-900 border-2 border-indigo-500 shadow-2xl shadow-indigo-950/60"
                        : "bg-slate-900/80 border border-slate-800"
                    }`}
                  >
                    {plan.highlight && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white font-bold text-[10px] uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                        Most Popular
                      </span>
                    )}

                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-bold text-white">{plan.tier}</h3>
                        <p className="text-xs text-slate-400 mt-1 min-h-[32px]">{plan.desc}</p>
                      </div>

                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-extrabold text-white">${price}</span>
                        <span className="text-xs text-slate-400">/ month</span>
                      </div>

                      <div className="space-y-2.5 pt-2 border-t border-slate-800">
                        {plan.features.map((feat, fIdx) => (
                          <div key={fIdx} className="flex items-center gap-2 text-xs text-slate-300">
                            <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedPlan(plan.tier);
                        setNavTab("auth");
                        setAuthMode("signup");
                      }}
                      className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all mt-6 ${
                        plan.highlight
                          ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-900/40"
                          : "bg-slate-800 hover:bg-slate-700 text-slate-200"
                      }`}
                    >
                      {isSelected ? "Selected — Start Trial" : `Choose ${plan.tier}`}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* VIEW 4: SUPPORT & HELP CENTER */}
        {navTab === "support" && (
          <div className="space-y-8 max-w-4xl mx-auto w-full py-4">
            <div className="text-center space-y-2 max-w-xl mx-auto">
              <span className="text-xs uppercase font-bold tracking-widest text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
                Support & Knowledge Base
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">We're Here to Help</h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Get answers from our product specialists or reach our 24/7 technical help desk.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* FAQ Box */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-lg">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-indigo-400" />
                  <span>Frequently Asked Questions</span>
                </h3>
                <div className="space-y-3 text-xs">
                  <div>
                    <h4 className="font-semibold text-slate-200">How does the 14-day free trial work?</h4>
                    <p className="text-slate-400 mt-0.5">
                      You get full, unrestricted access to your chosen tier. You can invite team members and test live pipelines.
                    </p>
                  </div>
                  <div className="pt-2 border-t border-slate-800">
                    <h4 className="font-semibold text-slate-200">Can I switch plans or cancel later?</h4>
                    <p className="text-slate-400 mt-0.5">
                      Yes. Upgrades and downgrades are prorated immediately, and subscriptions can be cancelled anytime with zero penalty.
                    </p>
                  </div>
                  <div className="pt-2 border-t border-slate-800">
                    <h4 className="font-semibold text-slate-200">Is my company data protected?</h4>
                    <p className="text-slate-400 mt-0.5">
                      All lead records and communications are isolated using AES-256 encryption and SOC-2 Type II standards.
                    </p>
                  </div>
                </div>
              </div>

              {/* Direct Inquiry Form */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-lg">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Headphones className="w-4 h-4 text-indigo-400" />
                  <span>Contact Our Support Team</span>
                </h3>

                {contactSuccess ? (
                  <div className="p-4 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-center space-y-2">
                    <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto" />
                    <h4 className="text-xs font-bold text-white">Message Received!</h4>
                    <p className="text-[11px] text-slate-300">
                      Our customer success team will respond to your registered email within 2 business hours.
                    </p>
                  </div>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      setContactSuccess(true);
                    }}
                    className="space-y-3"
                  >
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">Subject</label>
                      <input
                        type="text"
                        required
                        value={contactSubject}
                        onChange={(e) => setContactSubject(e.target.value)}
                        placeholder="e.g. Question about CRM integration"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">Message</label>
                      <textarea
                        rows={3}
                        required
                        value={contactMessage}
                        onChange={(e) => setContactMessage(e.target.value)}
                        placeholder="How can our support engineering team assist your company?"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-900/40 transition-all flex items-center justify-center gap-2"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Support Inquiry</span>
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ------------------------------------------------------------- */}
      {/* FOOTER */}
      {/* ------------------------------------------------------------- */}
      <footer className="border-t border-slate-800/80 bg-slate-900/60 py-6 px-4 sm:px-6 lg:px-8 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            <span>© {new Date().getFullYear()} Operant Enterprise AI Inc. All rights reserved.</span>
          </div>

          {/* Footer Navigation Links */}
          <div className="flex items-center gap-6 text-xs text-slate-400">
            <button
              type="button"
              id="footer-privacy-link"
              onClick={() => setModalContent("privacy")}
              className="hover:text-white transition-colors"
            >
              Privacy Policy
            </button>
            <button
              type="button"
              id="footer-terms-link"
              onClick={() => setModalContent("terms")}
              className="hover:text-white transition-colors"
            >
              Terms of Service
            </button>
            <button
              type="button"
              id="footer-contact-link"
              onClick={() => {
                setContactSuccess(false);
                setModalContent("contact");
              }}
              className="hover:text-white transition-colors"
            >
              Contact Us
            </button>
          </div>
        </div>
      </footer>

      {/* ------------------------------------------------------------- */}
      {/* MODALS (PRIVACY, TERMS, CONTACT, FORGOT PASSWORD) */}
      {/* ------------------------------------------------------------- */}
      {modalContent && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                {modalContent === "privacy" && "Privacy Policy"}
                {modalContent === "terms" && "Terms of Service"}
                {modalContent === "contact" && "Contact Customer Support"}
                {modalContent === "forgot_password" && "Reset Your Password"}
              </h3>
              <button
                onClick={() => setModalContent(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Privacy Policy Body */}
            {modalContent === "privacy" && (
              <div className="space-y-3 text-xs text-slate-300 max-h-80 overflow-y-auto pr-1 leading-relaxed">
                <p>
                  <strong>1. Data Confidentiality:</strong> Operant AI guarantees strict isolation of all corporate lead dossiers, message transcripts, and customer interaction logs.
                </p>
                <p>
                  <strong>2. Encryption Standards:</strong> All data in transit is encrypted using TLS 1.3, and all data at rest is secured via AES-256 encryption.
                </p>
                <p>
                  <strong>3. AI Model Governance:</strong> Proprietary customer communications and training data are never utilized to train public foundation models without explicit corporate authorization.
                </p>
                <p>
                  <strong>4. Compliance:</strong> We comply fully with GDPR, CCPA, and SOC-2 Type II standards.
                </p>
              </div>
            )}

            {/* Terms of Service Body */}
            {modalContent === "terms" && (
              <div className="space-y-3 text-xs text-slate-300 max-h-80 overflow-y-auto pr-1 leading-relaxed">
                <p>
                  <strong>1. Subscription Terms:</strong> Subscriptions are billed on a recurring monthly or annual basis. You may upgrade, downgrade, or cancel your tier at any time.
                </p>
                <p>
                  <strong>2. Free Trial:</strong> All new corporate accounts receive 14 days of unrestricted access. You may cancel prior to day 14 to avoid billing.
                </p>
                <p>
                  <strong>3. Authorized Use:</strong> The service must only be utilized for lawful sales outreach and customer relationship operations adhering to CAN-SPAM and TCPA guidelines.
                </p>
              </div>
            )}

            {/* Forgot Password Flow */}
            {modalContent === "forgot_password" && (
              <div className="space-y-3">
                {forgotSent ? (
                  <div className="p-4 bg-indigo-500/15 border border-indigo-500/30 rounded-xl text-center space-y-2">
                    <CheckCircle2 className="w-6 h-6 text-indigo-400 mx-auto" />
                    <h4 className="text-xs font-bold text-white">Password Reset Link Dispatched</h4>
                    <p className="text-[11px] text-slate-300">
                      We have sent instructions to <strong>{forgotEmail}</strong>. Please check your corporate inbox.
                    </p>
                  </div>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      setForgotSent(true);
                    }}
                    className="space-y-3"
                  >
                    <p className="text-xs text-slate-400">
                      Enter the corporate email associated with your subscription account and we'll send you a secure one-time password reset link.
                    </p>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300">Work Email</label>
                      <input
                        type="email"
                        required
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="you@company.com"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-900/40 transition-all"
                    >
                      Send Password Reset Link
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* Contact Modal */}
            {modalContent === "contact" && (
              <div className="space-y-3">
                {contactSuccess ? (
                  <div className="p-4 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-center space-y-2">
                    <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto" />
                    <h4 className="text-xs font-bold text-white">Support Ticket Created</h4>
                    <p className="text-[11px] text-slate-300">
                      Our support engineers will follow up shortly at your contact address.
                    </p>
                  </div>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      setContactSuccess(true);
                    }}
                    className="space-y-3"
                  >
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">Company / Email</label>
                      <input
                        type="text"
                        required
                        placeholder="Acme Corp • alex@acme.com"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">Message</label>
                      <textarea
                        rows={3}
                        required
                        placeholder="How can our support team assist your subscription workspace?"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 resize-none"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-900/40 transition-all flex items-center justify-center gap-2"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Support Ticket</span>
                    </button>
                  </form>
                )}
              </div>
            )}

            <div className="pt-2 text-right">
              <button
                type="button"
                onClick={() => setModalContent(null)}
                className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
