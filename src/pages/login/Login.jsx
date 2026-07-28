import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { LoginUser } from "../../api/api_client";
import GoogleAuthButton from "../components/GoogleAuthButton";
import MianLogo from "../../assets/logo.webp";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

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
      toast.success("Signed in successfully.");
      navigate(res.data?.body?.plan_selected ? "/home" : "/select-plan", { replace: true });
    } catch (err) {
      const msg =
        err.response?.data?.message ??
        err.response?.data?.error ??
        err.message ??
        "Login failed.";
      toast.error(typeof msg === "string" ? msg : "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen w-full">
      {/* LEFT SIDEBAR - Branding & Features */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br
from-[#07112b] via-[#0C1F4B] to-[#0C1F4B]
relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-indigo-300 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full">
            <svg className="w-full h-full opacity-5" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
              <circle cx="500" cy="500" r="400" fill="none" stroke="white" strokeWidth="2" />
              <circle cx="500" cy="500" r="300" fill="none" stroke="white" strokeWidth="1.5" />
              <circle cx="500" cy="500" r="200" fill="none" stroke="white" strokeWidth="1" />
            </svg>
          </div>
        </div>

        {/* Animated dots grid */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1.5px, transparent 1px)", backgroundSize: "40px 40px" }}></div>
        </div>

        <div className="relative z-10 flex flex-col justify-between h-full p-12">
          {/* Logo on sidebar */}
          <div className="flex items-center gap-3">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2">
              <img src={MianLogo} alt="Logo" className="h-10 w-auto" />
            </div>
            <span className="text-white text-xl font-bold tracking-tight">SmartStub</span>
          </div>

          {/* Testimonial / Quote */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mt-2">
                <span className="text-yellow-400 text-sm">✦</span>
                <span className="text-white/80 text-xs font-medium">Trusted by 10,000+ users</span>
              </div>
              <h2 className="text-white text-3xl font-bold leading-tight italic">
                Know Every
                <span className="text-green-300 underline ml-2">Dollar</span>
                <br />
                <span className="italic">You've</span>
                <span className="text-green-300 italic"> Earned</span>
              </h2>
              <p className="text-indigo-200/80 text-base leading-relaxed">
                SmartStub decodes your paycheck, catches errors, and helps you take control of your finances with AI-powered insights.
              </p>
            </div>

            {/* Feature list */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-white/10 rounded-lg p-1.5 mt-0.5">
                  <svg className="w-5 h-5 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-white font-semibold">AI-Powered Parsing</h4>
                  <p className="text-indigo-200/70 text-sm">Extract every line from any pay stub instantly</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-white/10 rounded-lg p-1.5 mt-0.5">
                  <svg className="w-5 h-5 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-white font-semibold">Error Detection</h4>
                  <p className="text-indigo-200/70 text-sm">Catch missed overtime and tax mistakes</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-white/10 rounded-lg p-1.5 mt-0.5">
                  <svg className="w-5 h-5 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-white font-semibold">Multi-State Comparison</h4>
                  <p className="text-indigo-200/70 text-sm">See your take-home pay across different states</p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
              <div>
                <div className="text-white text-2xl font-bold">$12M+</div>
                <div className="text-indigo-300/70 text-xs">Errors Found</div>
              </div>
              <div>
                <div className="text-white text-2xl font-bold">50K+</div>
                <div className="text-indigo-300/70 text-xs">Active Users</div>
              </div>
              <div>
                <div className="text-white text-2xl font-bold">4.9⭐</div>
                <div className="text-indigo-300/70 text-xs">User Rating</div>
              </div>
            </div>
          </div>

          {/* Trust badge */}
          <div className="flex items-center gap-2 text-indigo-300/60 text-xs mt-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2.166 4.999A10 10 0 0010 20a10 10 0 0010-10c0-1.667-.4-3.242-1.107-4.666L10 10 2.166 5z" clipRule="evenodd" />
            </svg>
            <span>100% secure</span>
          </div>
        </div>
      </div>

      {/* RIGHT SIDEBAR - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white px-6 py-12 sm:px-8 lg:px-12 overflow-y-auto">
        <div className="w-full max-w-md">
          {/* Mobile Logo (visible only on small screens) */}
          <div className="lg:hidden flex justify-center mb-4">
            <div className="rounded-2xl p-3">
              <img src={MianLogo} alt="Logo" className="h-20 w-auto" />
            </div>
          </div>

          <div className="text-center lg:text-left">
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Welcome Back</h1>
            <p className="mt-2 text-slate-500">Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
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
                  placeholder="user@email.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-sm font-semibold text-slate-700">
                  Password
                </label>
                <Link to="/forgot-password" className="text-sm text-indigo-500 hover:text-indigo-600 transition-colors font-medium">
                  Forgot Password?
                </Link>
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
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-3 text-slate-800 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 hover:border-slate-300"
                  placeholder="password"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:from-indigo-600 hover:to-indigo-800 hover:shadow-indigo-500/35 hover:-translate-y-0.5 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <p className="mt-8 text-center text-sm text-slate-500">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="font-semibold text-indigo-500 hover:text-indigo-600 transition-colors">
              Create free account
            </Link>
          </p>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-slate-400">Or continue with</span>
            </div>
          </div>

          <div className="mb-8">
            <GoogleAuthButton />
          </div>

          {/* Trust badges */}
          <div className="flex justify-center gap-6 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A10 10 0 0010 20a10 10 0 0010-10c0-1.667-.4-3.242-1.107-4.666L10 10 2.166 5z" clipRule="evenodd" />
              </svg>
              SSL Encrypted
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              GDPR Compliant
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}