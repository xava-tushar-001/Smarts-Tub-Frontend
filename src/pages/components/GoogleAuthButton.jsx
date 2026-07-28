import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { GoogleLogin as googleLoginRequest } from "../../api/api_client";

export default function GoogleAuthButton() {
  const navigate = useNavigate();

  async function handleSuccess(credentialResponse) {
    try {
      const res = await googleLoginRequest({ credential: credentialResponse.credential });
      const token = res.data?.body?.token;
      if (!token) {
        toast.error("Google sign-in succeeded but no token was returned.");
        return;
      }
      localStorage.setItem("token", token);
      toast.success("Signed in with Google.");
      navigate(res.data?.body?.plan_selected ? "/home" : "/select-plan", { replace: true });
    } catch (err) {
      const msg =
        err.response?.data?.message ??
        err.response?.data?.error ??
        err.message ??
        "Google sign-in failed.";
      toast.error(typeof msg === "string" ? msg : "Google sign-in failed.");
    }
  }

  return (
    <div className="flex justify-center">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => toast.error("Google sign-in failed.")}
        shape="pill"
        width="320"
      />
    </div>
  );
}
