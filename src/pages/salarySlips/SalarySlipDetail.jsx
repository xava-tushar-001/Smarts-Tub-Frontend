// import { useCallback, useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { toast } from "react-toastify";
// import {
//   HiOutlineArrowLeft,
//   HiOutlineArrowPath,
//   HiOutlineEye,
//   HiOutlineCheckCircle,
//   HiOutlineExclamationTriangle,
//   HiOutlineXCircle,
// } from "react-icons/hi2";
// import { GetSalarySlip, GetSalarySlipFile, RetrySalarySlip } from "../../api/api_client";
// import { OverallBadge } from "./statusBadge";

// function readError(err, fallback) {
//   const msg =
//     err.response?.data?.message ??
//     err.response?.data?.error ??
//     err.message ??
//     fallback;
//   return typeof msg === "string" ? msg : fallback;
// }

// function formatDate(value) {
//   if (!value) return "—";
//   return new Date(value).toLocaleString("en-IN", {
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//     hour: "2-digit",
//     minute: "2-digit",
//     hour12: true,
//   });
// }

// const CATEGORIES = [
//   {
//     key: "pass",
//     title: "🟢 Passed",
//     empty: "No passed checks.",
//     className: "border-green-200 bg-green-50",
//     headingClassName: "text-green-700",
//     icon: HiOutlineCheckCircle,
//     iconClassName: "text-green-500",
//   },
//   {
//     key: "warning",
//     title: "🟠 Warnings",
//     empty: "No warnings.",
//     className: "border-orange-200 bg-orange-50",
//     headingClassName: "text-orange-700",
//     icon: HiOutlineExclamationTriangle,
//     iconClassName: "text-orange-500",
//   },
//   {
//     key: "error",
//     title: "🔴 Errors",
//     empty: "No errors.",
//     className: "border-red-200 bg-red-50",
//     headingClassName: "text-red-700",
//     icon: HiOutlineXCircle,
//     iconClassName: "text-red-500",
//   },
// ];

// export default function SalarySlipDetail() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(true);
//   const [slip, setSlip] = useState(null);
//   const [viewingFile, setViewingFile] = useState(false);
//   const [retrying, setRetrying] = useState(false);

//   const load = useCallback(async () => {
//     setLoading(true);
//     try {
//       const res = await GetSalarySlip(id);
//       setSlip(res.data?.body?.salary_slip ?? null);
//     } catch (err) {
//       toast.error(readError(err, "Could not load this salary slip."));
//     } finally {
//       setLoading(false);
//     }
//   }, [id]);

//   useEffect(() => {
//     load();
//   }, [load]);

//   async function handleRetry() {
//     setRetrying(true);
//     try {
//       const res = await RetrySalarySlip(id);
//       const updated = res.data?.body?.salary_slip;
//       setSlip(updated ?? null);
//       if (updated?.status === "failed") {
//         toast.error(updated.error_message || "Analysis failed again.");
//       } else {
//         toast.success("Analysis complete.");
//       }
//     } catch (err) {
//       toast.error(readError(err, "Could not retry the analysis."));
//     } finally {
//       setRetrying(false);
//     }
//   }

//   async function handleViewFile() {
//     setViewingFile(true);
//     try {
//       const res = await GetSalarySlipFile(id);
//       const url = URL.createObjectURL(res.data);
//       window.open(url, "_blank", "noopener,noreferrer");
//     } catch (err) {
//       toast.error(readError(err, "Could not open the original file."));
//     } finally {
//       setViewingFile(false);
//     }
//   }

//   if (loading) {
//     return (
//       <div className="p-4 sm:p-6 lg:p-8">
//         <p className="text-slate-500">Loading salary slip…</p>
//       </div>
//     );
//   }

//   if (!slip) {
//     return (
//       <div className="p-4 sm:p-6 lg:p-8">
//         <p className="text-slate-500">Salary slip not found.</p>
//       </div>
//     );
//   }

//   const allChecks = Array.isArray(slip.checks) ? slip.checks : [];
//   const checksByStatus = {
//     pass: allChecks.filter((c) => c.status === "pass"),
//     warning: allChecks.filter((c) => c.status === "warning"),
//     error: allChecks.filter((c) => c.status === "error"),
//   };

//   return (
//     <div className="p-4 sm:p-6 lg:p-8">
//       <div className="mb-6 sm:mb-8">
//         <button
//           type="button"
//           onClick={() => navigate("/salary-slips")}
//           className="mb-3 flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-slate-700"
//         >
//           <HiOutlineArrowLeft className="h-4 w-4" aria-hidden />
//           Back to Salary Slips
//         </button>
//         <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
//           <div className="min-w-0">
//             <h1 className="truncate text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl">{slip.file_name}</h1>
//             <p className="mt-1 text-slate-500">Uploaded {formatDate(slip.createdAt)}</p>
//           </div>
//           <div className="flex shrink-0 flex-wrap items-center gap-3">
//             <OverallBadge status={slip.status === "completed" ? slip.overall_status : slip.status} size="lg" />
//             <button
//               type="button"
//               onClick={handleViewFile}
//               disabled={viewingFile}
//               className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
//             >
//               <HiOutlineEye className="h-4 w-4" aria-hidden />
//               View Original File
//             </button>
//           </div>
//         </div>
//       </div>

//       {slip.status === "processing" && (
//         <div className="max-w-2xl rounded-2xl border border-[#d7dfc0] bg-[#eef2df] px-6 py-6 text-[#0f2820]">
//           Analysis is still in progress. Check back shortly.
//         </div>
//       )}

//       {slip.status === "failed" && (
//         <div className="max-w-2xl rounded-2xl border border-slate-200 bg-slate-50 px-6 py-6 text-slate-600">
//           <p className="font-semibold text-slate-700">Analysis failed</p>
//           <p className="mt-1 text-sm">{slip.error_message || "Something went wrong while analyzing this file."}</p>
//           <button
//             type="button"
//             onClick={handleRetry}
//             disabled={retrying}
//             className="mt-4 flex items-center gap-1.5 rounded-lg bg-[#17352a] px-3 py-1.5 text-sm font-semibold text-white shadow-sm shadow-[#17352a]/20 transition hover:bg-[#0f2820] hover:shadow-[#17352a]/30 disabled:cursor-not-allowed disabled:opacity-60"
//           >
//             <HiOutlineArrowPath className={`h-4 w-4 ${retrying ? "animate-spin" : ""}`} aria-hidden />
//             {retrying ? "Retrying…" : "Retry Analysis"}
//           </button>
//         </div>
//       )}

//       {slip.status === "completed" && (
//         <>
//           {/* Summary */}
//           <div className="mb-6 max-w-5xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
//             <h2 className="text-sm font-semibold text-slate-700">Summary</h2>
//             <p className="mt-2 text-slate-600">{slip.summary}</p>
//             <div className="mt-4 flex flex-wrap gap-3">
//               <span className="inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
//                 <HiOutlineCheckCircle className="h-3.5 w-3.5" aria-hidden />
//                 {slip.pass_count} Passed
//               </span>
//               <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-medium text-orange-700">
//                 <HiOutlineExclamationTriangle className="h-3.5 w-3.5" aria-hidden />
//                 {slip.warning_count} Warnings
//               </span>
//               <span className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-medium text-red-700">
//                 <HiOutlineXCircle className="h-3.5 w-3.5" aria-hidden />
//                 {slip.error_count} Errors
//               </span>
//             </div>
//           </div>

//           {/* Checks by category */}
//           <div className="grid max-w-5xl gap-6 lg:grid-cols-3">
//             {CATEGORIES.map((cat) => {
//               const items = checksByStatus[cat.key];
//               const Icon = cat.icon;
//               return (
//                 <div key={cat.key} className={`rounded-2xl border p-5 ${cat.className}`}>
//                   <h3 className={`mb-3 text-sm font-semibold ${cat.headingClassName}`}>{cat.title}</h3>
//                   {items.length === 0 ? (
//                     <p className="text-sm text-slate-500">{cat.empty}</p>
//                   ) : (
//                     <ul className="space-y-3">
//                       {items.map((check, idx) => (
//                         <li key={idx} className="flex gap-2 rounded-lg bg-white/70 p-3">
//                           <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${cat.iconClassName}`} aria-hidden />
//                           <div className="min-w-0">
//                             <p className="text-sm font-medium text-slate-800">{check.name}</p>
//                             <p className="mt-0.5 text-sm text-slate-600">{check.message}</p>
//                           </div>
//                         </li>
//                       ))}
//                     </ul>
//                   )}
//                 </div>
//               );
//             })}
//           </div>
//         </>
//       )}
//     </div>
//   );
// }



import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  HiOutlineArrowLeft,
  HiOutlineArrowPath,
  HiOutlineEye,
  HiOutlineCheckCircle,
  HiOutlineExclamationTriangle,
  HiOutlineXCircle,
  HiOutlineDocument,
  HiOutlineCalendar,
  HiOutlineUser,
  HiOutlineBuildingOffice,
  HiOutlineArrowDownTray,
  HiOutlineLockClosed,
} from "react-icons/hi2";
import { GetSalarySlip, GetSalarySlipFile, RetrySalarySlip, GetSalarySlipReport, GetBillingStatus } from "../../api/api_client";
import { OverallBadge } from "./statusBadge";

function readError(err, fallback) {
  const msg =
    err.response?.data?.message ??
    err.response?.data?.error ??
    err.message ??
    fallback;
  return typeof msg === "string" ? msg : fallback;
}

function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function formatFileSize(bytes) {
  if (!bytes) return "—";
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
}

const CATEGORIES = [
  {
    key: "pass",
    title: "Passed Checks",
    icon: HiOutlineCheckCircle,
    iconClassName: "text-emerald-500",
    bgClassName: "bg-emerald-50",
    borderClassName: "border-emerald-200",
    textClassName: "text-emerald-700",
    empty: "All checks passed successfully.",
    gradient: "from-emerald-50 to-white",
  },
  {
    key: "warning",
    title: "Warnings",
    icon: HiOutlineExclamationTriangle,
    iconClassName: "text-amber-500",
    bgClassName: "bg-amber-50",
    borderClassName: "border-amber-200",
    textClassName: "text-amber-700",
    empty: "No warnings detected.",
    gradient: "from-amber-50 to-white",
  },
  {
    key: "error",
    title: "Errors",
    icon: HiOutlineXCircle,
    iconClassName: "text-rose-500",
    bgClassName: "bg-rose-50",
    borderClassName: "border-rose-200",
    textClassName: "text-rose-700",
    empty: "No errors found.",
    gradient: "from-rose-50 to-white",
  },
];

export default function SalarySlipDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [slip, setSlip] = useState(null);
  const [viewingFile, setViewingFile] = useState(false);
  const [retrying, setRetrying] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [isPaid, setIsPaid] = useState(false);
  const [downloadingReport, setDownloadingReport] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await GetSalarySlip(id);
      setSlip(res.data?.body?.salary_slip ?? null);
    } catch (err) {
      toast.error(readError(err, "Could not load this salary slip."));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    (async () => {
      try {
        const res = await GetBillingStatus();
        setIsPaid((res.data?.body?.plan ?? "free") === "paid");
      } catch {
        setIsPaid(false);
      }
    })();
  }, []);

  async function handleDownloadReport() {
    setDownloadingReport(true);
    try {
      const res = await GetSalarySlipReport(id);
      const url = URL.createObjectURL(res.data);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${slip?.file_name || "salary-slip"}-report.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      toast.error(readError(err, "Could not download the report."));
    } finally {
      setDownloadingReport(false);
    }
  }

  async function handleRetry() {
    setRetrying(true);
    try {
      const res = await RetrySalarySlip(id);
      const updated = res.data?.body?.salary_slip;
      setSlip(updated ?? null);
      if (updated?.status === "failed") {
        toast.error(updated.error_message || "Analysis failed again.");
      } else {
        toast.success("Analysis complete.");
      }
    } catch (err) {
      toast.error(readError(err, "Could not retry the analysis."));
    } finally {
      setRetrying(false);
    }
  }

  async function handleViewFile() {
    setViewingFile(true);
    try {
      const res = await GetSalarySlipFile(id);
      const url = URL.createObjectURL(res.data);
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (err) {
      toast.error(readError(err, "Could not open the original file."));
    } finally {
      setViewingFile(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-[#17352a] border-t-transparent"></div>
              <p className="mt-4 text-slate-500">Loading salary slip details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!slip) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <HiOutlineDocument className="mx-auto h-16 w-16 text-slate-300" />
            <h2 className="mt-4 text-xl font-semibold text-slate-700">Salary Slip Not Found</h2>
            <p className="mt-2 text-slate-500">The requested salary slip could not be found.</p>
            <button
              type="button"
              onClick={() => navigate("/salary-slips")}
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#17352a] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#0f2820]"
            >
              <HiOutlineArrowLeft className="h-4 w-4" />
              Back to Salary Slips
            </button>
          </div>
        </div>
      </div>
    );
  }

  const salaryDetails = slip.salary_details || {};
  const salaryDetailRows = [
    ["Gross Pay", salaryDetails.gross_pay],
    ["Net Pay", salaryDetails.net_pay],
    ["Tax Deduction", salaryDetails.tax_deduction],
    ...(Array.isArray(salaryDetails.other) ? salaryDetails.other.map((d) => [d.label, d.value]) : []),
  ].filter(([, value]) => value);

  const allChecks = Array.isArray(slip.checks) ? slip.checks : [];
  const checksByStatus = {
    pass: allChecks.filter((c) => c.status === "pass"),
    warning: allChecks.filter((c) => c.status === "warning"),
    error: allChecks.filter((c) => c.status === "error"),
  };

  const filteredChecks = activeTab === "all" 
    ? allChecks 
    : checksByStatus[activeTab] || [];

  const getStatusColor = (status) => {
    switch (status) {
      case "pass": return "text-emerald-500 bg-emerald-50 border-emerald-200";
      case "warning": return "text-amber-500 bg-amber-50 border-amber-200";
      case "error": return "text-rose-500 bg-rose-50 border-rose-200";
      default: return "text-slate-500 bg-slate-50 border-slate-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pass": return HiOutlineCheckCircle;
      case "warning": return HiOutlineExclamationTriangle;
      case "error": return HiOutlineXCircle;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <button
            type="button"
            onClick={() => navigate("/salary-slips")}
            className="group mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-[#17352a]"
          >
            <HiOutlineArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            Back to Salary Slips
          </button>
          
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="p-6 sm:p-8">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex items-start gap-3">
                    <div className="rounded-xl bg-[#17352a]/10 p-3">
                      <HiOutlineDocument className="h-6 w-6 text-[#17352a]" />
                    </div>
                    <div className="min-w-0">
                      <h1 className="truncate text-2xl font-bold text-slate-800 sm:text-3xl">
                        {slip.file_name}
                      </h1>
                      <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                        <span className="inline-flex items-center gap-1.5">
                          <HiOutlineCalendar className="h-4 w-4" />
                          Uploaded {formatDate(slip.createdAt)}
                        </span>
                        <span className="hidden h-4 w-px bg-slate-200 sm:block" />
                        <span className="inline-flex items-center gap-1.5">
                          <HiOutlineDocument className="h-4 w-4" />
                          {formatFileSize(slip.file_size)}
                        </span>
                        <span className="hidden h-4 w-px bg-slate-200 sm:block" />
                        <span className="inline-flex items-center gap-1.5">
                          <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                            {slip.mime_type}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex shrink-0 flex-wrap items-center gap-3">
                  <OverallBadge 
                    status={slip.status === "completed" ? slip.overall_status : slip.status} 
                    size="lg" 
                  />
                  <button
                    type="button"
                    onClick={handleViewFile}
                    disabled={viewingFile}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <HiOutlineEye className="h-4 w-4" />
                    View Original
                  </button>
                  {slip.status === "completed" && (
                    isPaid ? (
                      <button
                        type="button"
                        onClick={handleDownloadReport}
                        disabled={downloadingReport}
                        className="inline-flex items-center gap-2 rounded-xl bg-[#17352a] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#0f2820] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <HiOutlineArrowDownTray className="h-4 w-4" />
                        {downloadingReport ? "Preparing…" : "Download Report"}
                      </button>
                    ) : (
                      <Link
                        to="/billing"
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-500 shadow-sm transition hover:bg-slate-50"
                      >
                        <HiOutlineLockClosed className="h-4 w-4" />
                        Pro: Download Report
                      </Link>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Status Messages */}
        {slip.status === "processing" && (
          <div className="mb-8 overflow-hidden rounded-2xl border border-blue-200 bg-blue-50">
            <div className="p-6">
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-blue-100 p-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
                </div>
                <div>
                  <h3 className="font-semibold text-blue-800">Analysis in Progress</h3>
                  <p className="mt-1 text-sm text-blue-700">
                    Your salary slip is being analyzed. This usually takes a few seconds.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {slip.status === "failed" && (
          <div className="mb-8 overflow-hidden rounded-2xl border border-rose-200 bg-rose-50">
            <div className="p-6">
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-rose-100 p-2">
                  <HiOutlineXCircle className="h-5 w-5 text-rose-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-rose-800">Analysis Failed</h3>
                  <p className="mt-1 text-sm text-rose-700">
                    {slip.error_message || "Something went wrong while analyzing this file."}
                  </p>
                  <button
                    type="button"
                    onClick={handleRetry}
                    disabled={retrying}
                    className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#17352a] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#0f2820] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <HiOutlineArrowPath className={`h-4 w-4 ${retrying ? "animate-spin" : ""}`} />
                    {retrying ? "Retrying..." : "Retry Analysis"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {slip.status === "completed" && (
          <>
            {/* Summary Section */}
            <div className="mb-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="p-6 sm:p-8">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Summary</h2>
                <p className="mt-3 text-base leading-relaxed text-slate-700">{slip.summary}</p>
                
                <div className="mt-6 flex flex-wrap gap-4 border-t border-slate-100 pt-6">
                  <div className="flex items-center gap-3 rounded-xl bg-emerald-50 px-4 py-2.5">
                    <div className="rounded-full bg-emerald-100 p-1.5">
                      <HiOutlineCheckCircle className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div>
                      <span className="text-sm font-medium text-emerald-700">{slip.pass_count}</span>
                      <span className="ml-1 text-sm text-emerald-600">Passed</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl bg-amber-50 px-4 py-2.5">
                    <div className="rounded-full bg-amber-100 p-1.5">
                      <HiOutlineExclamationTriangle className="h-4 w-4 text-amber-600" />
                    </div>
                    <div>
                      <span className="text-sm font-medium text-amber-700">{slip.warning_count}</span>
                      <span className="ml-1 text-sm text-amber-600">Warnings</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl bg-rose-50 px-4 py-2.5">
                    <div className="rounded-full bg-rose-100 p-1.5">
                      <HiOutlineXCircle className="h-4 w-4 text-rose-600" />
                    </div>
                    <div>
                      <span className="text-sm font-medium text-rose-700">{slip.error_count}</span>
                      <span className="ml-1 text-sm text-rose-600">Errors</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Checks Section */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 bg-slate-50/50 p-4 sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <h2 className="text-lg font-semibold text-slate-800">Validation Checks</h2>
                  
                  {/* Tabs */}
                  <div className="flex flex-wrap gap-1.5">
                    {["all", "pass", "warning", "error"].map((tab) => {
                      const count = tab === "all" 
                        ? allChecks.length 
                        : checksByStatus[tab]?.length || 0;
                      
                      const getTabStyles = () => {
                        if (activeTab === tab) {
                          switch (tab) {
                            case "pass": return "bg-emerald-50 text-emerald-700 border-emerald-200";
                            case "warning": return "bg-amber-50 text-amber-700 border-amber-200";
                            case "error": return "bg-rose-50 text-rose-700 border-rose-200";
                            default: return "bg-[#17352a] text-white border-[#17352a]";
                          }
                        }
                        return "bg-white text-slate-600 border-slate-200 hover:bg-slate-50";
                      };
                      
                      return (
                        <button
                          key={tab}
                          type="button"
                          onClick={() => setActiveTab(tab)}
                          className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition ${getTabStyles()}`}
                        >
                          {tab === "all" ? "All" : tab.charAt(0).toUpperCase() + tab.slice(1)}
                          <span className="rounded-full bg-black/5 px-1.5 py-0.5 text-xs">
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-6">
                {filteredChecks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <HiOutlineCheckCircle className="h-12 w-12 text-slate-300" />
                    <p className="mt-3 text-sm text-slate-500">No checks to display in this category.</p>
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {filteredChecks.map((check, idx) => {
                      const StatusIcon = getStatusIcon(check.status);
                      const statusColor = getStatusColor(check.status);
                      
                      return (
                        <div
                          key={idx}
                          className={`group rounded-xl border ${statusColor} p-4 transition hover:shadow-md`}
                        >
                          <div className="flex items-start gap-3">
                            {StatusIcon && (
                              <div className={`rounded-full p-1.5 ${statusColor.split(" ")[1]}`}>
                                <StatusIcon className={`h-4 w-4 ${statusColor.split(" ")[0]}`} />
                              </div>
                            )}
                            <div className="min-w-0 flex-1">
                              <div className="flex items-start justify-between gap-2">
                                <h4 className="text-sm font-medium text-slate-800">{check.name}</h4>
                                <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${statusColor}`}>
                                  {check.status}
                                </span>
                              </div>
                              <p className="mt-1 text-sm text-slate-600">{check.message}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Salary Details Section */}
            {salaryDetailRows.length > 0 && (
              <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="p-6 sm:p-8">
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Salary Details</h2>
                  <div className="mt-4 overflow-x-auto">
                    <table className="w-full min-w-[360px] border-collapse text-left text-sm">
                      <tbody>
                        {salaryDetailRows.map(([label, value]) => (
                          <tr key={label} className="border-b border-slate-100 last:border-0">
                            <td className="w-1/3 py-3 pr-4 font-medium text-slate-600">{label}</td>
                            <td className="py-3 text-slate-800">{value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

          </>
        )}
      </div>
    </div>
  );
}