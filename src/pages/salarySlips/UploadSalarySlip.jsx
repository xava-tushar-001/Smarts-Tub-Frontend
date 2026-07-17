import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { HiOutlineArrowLeft, HiOutlineDocumentArrowUp, HiOutlineXMark } from "react-icons/hi2";
import { UploadSalarySlip as uploadSalarySlipRequest } from "../../api/api_client";

const ACCEPTED_TYPES = ["application/pdf", "image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

function readError(err, fallback) {
  const msg =
    err.response?.data?.message ??
    err.response?.data?.error ??
    err.message ??
    fallback;
  return typeof msg === "string" ? msg : fallback;
}

function formatSize(bytes) {
  if (!bytes) return "";
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(0)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}

export default function UploadSalarySlip() {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);

  function validateAndSetFile(candidate) {
    if (!candidate) return;
    if (!ACCEPTED_TYPES.includes(candidate.type)) {
      toast.error("Unsupported file type. Please upload a PDF, JPG, PNG, or WEBP file.");
      return;
    }
    if (candidate.size > MAX_SIZE) {
      toast.error("File is too large. Maximum size is 10MB.");
      return;
    }
    setFile(candidate);
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    validateAndSetFile(e.dataTransfer.files?.[0]);
  }

  async function handleAnalyze() {
    if (!file) {
      toast.error("Please select a salary slip file first.");
      return;
    }
    setUploading(true);
    try {
      const res = await uploadSalarySlipRequest(file);
      const slip = res.data?.body?.salary_slip;
      if (!slip?.id) {
        toast.error("Upload succeeded but no result was returned.");
        return;
      }
      if (slip.status === "failed") {
        toast.error(slip.error_message || "Analysis failed.");
      } else {
        toast.success("Analysis complete.");
      }
      navigate(`/salary-slips/${slip.id}`, { replace: true });
    } catch (err) {
      toast.error(readError(err, "Could not analyze the salary slip."));
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <button
          type="button"
          onClick={() => navigate("/salary-slips")}
          className="mb-3 flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-slate-700"
        >
          <HiOutlineArrowLeft className="h-4 w-4" aria-hidden />
          Back to Salary Slips
        </button>
        <h1 className="text-3xl font-bold tracking-tight text-slate-800">Upload Salary Slip</h1>
        <p className="mt-1 text-slate-500">AI will analyze it for errors, warnings, and missing information.</p>
      </div>

      <div className="max-w-5xl overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-12 text-center transition ${
            dragOver ? "border-indigo-400 bg-indigo-50" : "border-slate-200 hover:border-slate-300"
          }`}
        >
          <HiOutlineDocumentArrowUp className="h-10 w-10 text-slate-400" aria-hidden />
          <div>
            <p className="font-medium text-slate-700">Click to browse or drag a file here</p>
            <p className="mt-1 text-sm text-slate-400">PDF, JPG, PNG, or WEBP · up to 10MB</p>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => validateAndSetFile(e.target.files?.[0])}
          />
        </div>

        {file && (
          <div className="mt-4 flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-slate-700">{file.name}</p>
              <p className="text-xs text-slate-400">{formatSize(file.size)}</p>
            </div>
            <button
              type="button"
              onClick={() => setFile(null)}
              disabled={uploading}
              className="shrink-0 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-200 hover:text-slate-600"
              aria-label="Remove file"
            >
              <HiOutlineXMark className="h-4 w-4" aria-hidden />
            </button>
          </div>
        )}

        <button
          type="button"
          onClick={handleAnalyze}
          disabled={!file || uploading}
          className="mt-6 w-full rounded-lg bg-indigo-500 px-4 py-3 text-sm font-semibold text-white shadow-sm shadow-indigo-500/25 transition hover:bg-indigo-600 hover:shadow-indigo-500/35 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {uploading ? "Analyzing your salary slip…" : "Analyze Salary Slip"}
        </button>
      </div>
    </div>
  );
}
