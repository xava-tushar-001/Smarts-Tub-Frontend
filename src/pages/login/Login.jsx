import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { LoginUser } from "../../api/api_client";


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
      navigate("/home", { replace: true });
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
    <div className="flex min-h-screen items-center justify-center bg-white px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-black">
          Smart<span className="text-[#EA2859]">Hub</span>
          </h1>
          <p className="mt-2 text-sm text-black/60">Sign in to your admin account</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-black/10 bg-white p-8 shadow-lg shadow-black/5 ring-1 ring-[#EA2859]/15"
        >
          <div className="space-y-5">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-left text-sm font-medium text-black">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-black/15 bg-white px-3.5 py-2.5 text-black outline-none transition placeholder:text-black/35 focus:border-[#EA2859] focus:ring-2 focus:ring-[#EA2859]/25"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="mb-1.5 block text-left text-sm font-medium text-black">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-black/15 bg-white px-3.5 py-2.5 text-black outline-none transition placeholder:text-black/35 focus:border-[#EA2859] focus:ring-2 focus:ring-[#EA2859]/25"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-8 w-full rounded-lg bg-[#EA2859] px-4 py-3 text-sm font-semibold text-white shadow-md shadow-[#EA2859]/30 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}