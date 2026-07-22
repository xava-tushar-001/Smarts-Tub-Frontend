import { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { PDFDocument } from "pdf-lib";
import { HiOutlineArrowLeft, HiOutlineDocumentArrowUp, HiOutlineXMark, HiOutlineLockClosed } from "react-icons/hi2";
import { UploadSalarySlip as uploadSalarySlipRequest, GetBillingStatus } from "../../api/api_client";

const ACCEPTED_TYPES = ["application/pdf", "image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_PDF_PAGES = 4;

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
  const [checkingFile, setCheckingFile] = useState(false);
  const [usage, setUsage] = useState(null);
  const [loadingUsage, setLoadingUsage] = useState(true);

  useEffect(() => {
    GetBillingStatus()
      .then((res) => setUsage(res.data?.body?.usage ?? null))
      .catch(() => {})
      .finally(() => setLoadingUsage(false));
  }, []);

  const limitReached = usage && usage.count >= usage.limit;

  async function validateAndSetFile(candidate) {
    if (!candidate) return;
    if (!ACCEPTED_TYPES.includes(candidate.type)) {
      toast.error("Unsupported file type. Please upload a PDF, JPG, PNG, or WEBP file.");
      return;
    }
    if (candidate.size > MAX_SIZE) {
      toast.error("File is too large. Maximum size is 10MB.");
      return;
    }

    if (candidate.type === "application/pdf") {
      setCheckingFile(true);
      try {
        const bytes = await candidate.arrayBuffer();
        const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
        const pageCount = doc.getPageCount();
        if (pageCount > MAX_PDF_PAGES) {
          toast.error(
            `This PDF has ${pageCount} pages. Please upload a salary slip with at most ${MAX_PDF_PAGES} pages.`
          );
          return;
        }
      } catch {
        toast.error("Could not read this PDF. Please make sure it's a valid, unencrypted PDF file.");
        return;
      } finally {
        setCheckingFile(false);
      }
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
      if (err.response?.data?.body?.limit_reached) {
        setUsage({ count: err.response.data.body.used, limit: err.response.data.body.limit });
      }
      toast.error(readError(err, "Could not analyze the salary slip."));
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6 sm:mb-8">
        <button
          type="button"
          onClick={() => navigate("/salary-slips")}
          className="mb-3 flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-slate-700"
        >
          <HiOutlineArrowLeft className="h-4 w-4" aria-hidden />
          Back to Salary Slips
        </button>
        <h1 className="text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl">Upload Salary Slip</h1>
        <p className="mt-1 text-slate-500">AI will analyze it for errors, warnings, and missing information.</p>
      </div>

      {!loadingUsage && usage && (
        <p className="mb-4 max-w-5xl text-sm text-slate-500">
          {usage.count} of {usage.limit} payslips used this month
        </p>
      )}

      {limitReached ? (
        <div className="max-w-5xl rounded-2xl border border-[#d7dfc0] bg-[#eef2df] p-8 text-center">
          <HiOutlineLockClosed className="mx-auto h-8 w-8 text-[#17352a]" aria-hidden />
          <p className="mt-3 font-semibold text-slate-800">
            You've used all {usage.limit} payslip uploads this month
          </p>
          <p className="mt-1 text-sm text-slate-600">
            Upgrade to Pro for up to 12 uploads/month and more.
          </p>
          <Link
            to="/billing"
            className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-[#17352a] px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-[#17352a]/20 transition hover:bg-[#0f2820] hover:shadow-[#17352a]/30"
          >
            Upgrade to Pro
          </Link>
        </div>
      ) : (
      <div className="max-w-5xl overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div
          onDragOver={(e) => {
            e.preventDefault();
            if (!checkingFile) setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={checkingFile ? undefined : handleDrop}
          onClick={() => !checkingFile && inputRef.current?.click()}
          className={`flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-4 py-10 text-center transition sm:px-6 sm:py-12 ${
            checkingFile ? "cursor-wait opacity-70" : "cursor-pointer"
          } ${dragOver ? "border-[#8aa25a] bg-[#eef2df]" : "border-slate-200 hover:border-slate-300"}`}
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#eef2df]">
            <HiOutlineDocumentArrowUp className="h-7 w-7 text-[#17352a]" aria-hidden />
          </div>
          <div>
            <p className="font-medium text-slate-700">
              {checkingFile ? "Checking file…" : "Click to browse or drag a file here"}
            </p>
            <p className="mt-1 text-sm text-slate-400">PDF (up to {MAX_PDF_PAGES} pages), JPG, PNG, or WEBP · up to 10MB</p>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,image/jpeg,image/png,image/webp"
            disabled={checkingFile}
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
          className="mt-6 w-full rounded-lg bg-[#17352a] px-4 py-3 text-sm font-semibold text-white shadow-sm shadow-[#17352a]/20 transition hover:bg-[#0f2820] hover:shadow-[#17352a]/30 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {uploading ? "Analyzing your salary slip…" : "Analyze Salary Slip"}
        </button>
      </div>
      )}
    </div>
  );
}
