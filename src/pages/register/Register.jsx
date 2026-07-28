import { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { RegisterUser, VerifyOtp, ResendOtp } from "../../api/api_client";
import GoogleAuthButton from "../components/GoogleAuthButton";
import MianLogo from "../../assets/logo.webp";

export default function Register() {
  const navigate = useNavigate();

  // step: 1 = enter details, 2 = enter OTP
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendIn, setResendIn] = useState(0);
  const timerRef = useRef(null);

  // Resend cooldown countdown
  useEffect(() => {
    if (resendIn <= 0) return;
    timerRef.current = setInterval(() => {
      setResendIn((s) => (s <= 1 ? 0 : s - 1));
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [resendIn]);

  function readError(err, fallback) {
    const msg =
      err.response?.data?.message ??
      err.response?.data?.error ??
      err.message ??
      fallback;
    return typeof msg === "string" ? msg : fallback;
  }

  async function handleRegister(e) {
    e.preventDefault();
    if (!email.trim() || !password) {
      toast.error("Please enter your email and password.");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      toast.error("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      await RegisterUser({ email: email.trim(), password });
      toast.success("We've sent a verification code to your email.");
      setStep(2);
      setResendIn(30);
    } catch (err) {
      toast.error(readError(err, "Could not start registration."));
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify(e) {
    e.preventDefault();
    if (!otp.trim()) {
      toast.error("Please enter the code from your email.");
      return;
    }
    setLoading(true);
    try {
      const res = await VerifyOtp({ email: email.trim(), otp: otp.trim() });
      const token = res.data?.body?.token;
      toast.success("Account created successfully.");
      if (token) {
        localStorage.setItem("token", token);
        navigate(res.data?.body?.plan_selected ? "/home" : "/select-plan", { replace: true });
      } else {
        navigate("/login", { replace: true });
      }
    } catch (err) {
      toast.error(readError(err, "Verification failed."));
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    if (resendIn > 0) return;
    setLoading(true);
    try {
      await ResendOtp({ email: email.trim() });
      toast.success("A new code has been sent.");
      setResendIn(30);
    } catch (err) {
      toast.error(readError(err, "Could not resend the code."));
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-3 text-slate-800 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 hover:border-slate-300";

  const buttonClass =
    "w-full rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:from-indigo-600 hover:to-indigo-800 hover:shadow-indigo-500/35 hover:-translate-y-0.5 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0";

  return (
    <div className="flex min-h-screen w-full">
      {/* LEFT BRANDING PANEL */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#07112b] via-[#0C1F4B] to-[#0C1F4B] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-indigo-300 rounded-full blur-3xl"></div>
        </div>
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute top-0 left-0 w-full h-full"
            style={{
              backgroundImage:
                "radial-gradient(circle at 2px 2px, white 1.5px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          ></div>
        </div>

        <div className="relative z-10 flex flex-col justify-between h-full p-12">
          <div className="flex items-center gap-3">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2">
              <img src={MianLogo} alt="Logo" className="h-10 w-auto" />
            </div>
            <span className="text-white text-xl font-bold tracking-tight">SmartStub</span>
          </div>

          <div className="space-y-6">
            <h2 className="text-white text-3xl font-bold leading-tight italic">
              Create Your
              <span className="text-green-300 underline ml-2">Free</span> Account
            </h2>
            <p className="text-indigo-200/80 text-base leading-relaxed">
              Join SmartStub in seconds. We'll email you a one-time code to verify
              your account and keep it secure.
            </p>
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

          <div className="flex items-center gap-2 text-indigo-300/60 text-xs mt-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M2.166 4.999A10 10 0 0010 20a10 10 0 0010-10c0-1.667-.4-3.242-1.107-4.666L10 10 2.166 5z"
                clipRule="evenodd"
              />
            </svg>
            <span>100% secure</span>
          </div>
        </div>
      </div>

      {/* RIGHT FORM PANEL */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white px-6 py-12 sm:px-8 lg:px-12 overflow-y-auto">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex justify-center mb-4">
            <img src={MianLogo} alt="Logo" className="h-20 w-auto" />
          </div>

          {step === 1 ? (
            <>
              <div className="text-center lg:text-left">
                <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
                  Create account
                </h1>
                <p className="mt-2 text-slate-500">
                  Enter your details to get started
                </p>
              </div>

              <form onSubmit={handleRegister} className="mt-8 space-y-6">
                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={inputClass}
                      placeholder="user@email.com"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Password
                  </label>
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
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={inputClass}
                      placeholder="At least 6 characters"
                    />
                  </div>
                </div>

                {/* Confirm password */}
                <div>
                  <label htmlFor="confirm" className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input
                      id="confirm"
                      name="confirm"
                      type="password"
                      autoComplete="new-password"
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      className={inputClass}
                      placeholder="Re-enter your password"
                    />
                  </div>
                </div>

                <button type="submit" disabled={loading} className={buttonClass}>
                  {loading ? "Sending code…" : "Create account"}
                </button>
              </form>

              {/* Divider */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-slate-400">Or continue with</span>
                </div>
              </div>

              <GoogleAuthButton />


              <p className="mt-8 text-center text-sm text-slate-500">
                Already have an account?{" "}
                <Link to="/login" className="font-semibold text-indigo-500 hover:text-indigo-600 transition-colors">
                  Sign in
                </Link>
              </p>
            </>
          ) : (
            <>
              <div className="text-center lg:text-left">
                <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
                  Verify your email
                </h1>
                <p className="mt-2 text-slate-500">
                  We sent a code to <span className="font-semibold text-slate-700">{email}</span>
                </p>
              </div>

              <form onSubmit={handleVerify} className="mt-8 space-y-6">
                <div>
                  <label htmlFor="otp" className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Verification Code
                  </label>
                  <input
                    id="otp"
                    name="otp"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-center text-2xl font-semibold tracking-[0.5em] text-slate-800 outline-none transition-all duration-200 placeholder:tracking-normal placeholder:text-slate-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20"
                    placeholder="0000"
                  />
                </div>

                <button type="submit" disabled={loading} className={buttonClass}>
                  {loading ? "Verifying…" : "Verify & create account"}
                </button>
              </form>

              <div className="mt-6 flex items-center justify-between text-sm">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-slate-500 hover:text-slate-700 transition-colors"
                >
                  ← Change email
                </button>
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendIn > 0 || loading}
                  className="font-semibold text-indigo-500 hover:text-indigo-600 transition-colors disabled:cursor-not-allowed disabled:text-slate-400"
                >
                  {resendIn > 0 ? `Resend in ${resendIn}s` : "Resend code"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
