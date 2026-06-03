import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { LoginUser } from "../../api/api_client";
import MianLogo from "../../assets/logo.webp";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email.trim() || !password) {
      toast.error("Please enter email and password.");
      return;
    }
    setLoading(true);
    try {
      const res = await LoginUser({ email: email.trim(), password });
      const token = res.data?.body?.token;
      if (!token) {
        toast.error("Login succeeded but no token was returned. Check the API response shape.");
        setLoading(false);
        return;
      }
      localStorage.setItem("token", token);
      localStorage.setItem("adminEmail", email.trim());
      toast.success("Welcome back, Admin!");
      navigate("/home", { replace: true });
    } catch (err) {
      const msg =
        err.response?.data?.message ??
        err.response?.data?.error ??
        err.message ??
        "Login failed. Please check your credentials.";
      toast.error(typeof msg === "string" ? msg : "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen w-full bg-slate-50">
      {/* LEFT PANEL - Admin Branding & Security Info */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '30px 30px'
          }}></div>
        </div>

        {/* Animated gradient orb */}
        <div className="absolute top-20 -left-20 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 -right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

        <div className="relative z-10 flex flex-col justify-between h-full p-10">
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2.5 border border-white/10">
              <img src={MianLogo} alt="SmartStub" className="h-10 w-auto" />
            </div>
            <div>
              <span className="text-white text-xl font-bold tracking-tight">SmartStub</span>
              <span className="block text-white/40 text-xs">Admin Panel</span>
            </div>
          </div>

          {/* Main Content */}
          <div className="space-y-8 max-w-md">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5 mt-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-white/80 text-xs font-medium">Admin Access</span>
              </div>
              <h2 className="text-white text-4xl font-bold leading-tight">
                Admin Dashboard
              </h2>
              <p className="text-slate-300 text-base leading-relaxed">
                Manage users, monitor platform activity, and control system settings from a single unified dashboard.
              </p>
            </div>

            {/* Admin Features */}
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                <div className="bg-indigo-500/20 rounded-lg p-2">
                  <svg className="w-5 h-5 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-white font-semibold">User Management</h4>
                  <p className="text-slate-400 text-sm">View, edit, and manage all user accounts and permissions</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                <div className="bg-emerald-500/20 rounded-lg p-2">
                  <svg className="w-5 h-5 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-white font-semibold">Analytics & Reports</h4>
                  <p className="text-slate-400 text-sm">Access detailed platform analytics and generate custom reports</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                <div className="bg-amber-500/20 rounded-lg p-2">
                  <svg className="w-5 h-5 text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-white font-semibold">System Configuration</h4>
                  <p className="text-slate-400 text-sm">Configure global settings, roles, and platform preferences</p>
                </div>
              </div>
            </div>

            {/* Security Notice */}
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <p className="text-red-300 text-sm font-medium">Secure Session</p>
                  {/* <p className="text-red-300/70 text-xs">This is a restricted area. All access attempts are logged and monitored.</p> */}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center gap-4 text-slate-500 text-xs">
            <span className="flex items-center gap-1">

            </span>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL - Admin Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white px-6 py-12 sm:px-8 lg:px-12 overflow-y-auto">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex flex-col items-center mb-8">
            <div className="bg-slate-100 rounded-2xl p-3 mb-3">
              <img src={MianLogo} alt="SmartStub" className="h-10 w-auto" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Admin Panel</h2>
          </div>

          {/* Header */}
          <div className="text-center lg:text-left">
            <div className="hidden lg:block mb-2">
              {/* <span className="text-slate-400 text-sm font-mono">// ADMIN AUTHENTICATION</span> */}
            </div>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Administrator Login</h1>
            <p className="mt-2 text-slate-500">Enter your credentials to access the panel</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-1.5">
                Admin Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-3 text-slate-800 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 hover:border-slate-300"
                  placeholder="admin@smartstub.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-sm font-semibold text-slate-700">
                  Password
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-12 py-3 text-slate-800 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 hover:border-slate-300"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:from-indigo-600 hover:to-indigo-700 hover:shadow-indigo-500/35 hover:-translate-y-0.5 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Authenticating...
                </span>
              ) : (
                "Access Dashboard →"
              )}
            </button>
          </form>

          {/* Help Links */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <div className="flex justify-center gap-6">
              <a href="#" className="text-sm text-slate-500 hover:text-indigo-500 transition-colors">
                {/* Need help? */}
              </a>
              <a href="#" className="text-sm text-slate-500 hover:text-indigo-500 transition-colors">
                {/* Contact Support */}
              </a>
              <a href="#" className="text-sm text-slate-500 hover:text-indigo-500 transition-colors">
                {/* Security Policy */}
              </a>
            </div>
          </div>

          {/* Version Info */}
          <p className="mt-6 text-center text-xs text-slate-400 font-mono">
            SmartStub Admin Panel v0.0.1 • Secure Connection
          </p>
        </div>
      </div>
    </div>
  );
}