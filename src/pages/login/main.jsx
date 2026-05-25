import React, { useEffect, useRef } from 'react';
import MainLogo from "../assets/smarstub.png";

export default function LandingPage() {
  // Refs for scroll animations
  const observerRef = useRef(null);

  useEffect(() => {
    // Nav scroll effect
    const handleScroll = () => {
      const nav = document.getElementById('main-nav');
      if (nav) {
        if (window.scrollY > 20) {
          nav.classList.add('scrolled');
        } else {
          nav.classList.remove('scrolled');
        }
      }
    };
    window.addEventListener('scroll', handleScroll);

    // Intersection Observer for fade-in animations
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }
        });
      },
      { threshold: 0.1 }
    );

    const animatedElements = document.querySelectorAll(
      '.feat-card, .how-step, .db-hi, .price-card, .tax-point'
    );
    animatedElements.forEach((el) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      observerRef.current?.observe(el);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  const handleWaitlist = (e) => {
    e.preventDefault();
    const btn = e.currentTarget.querySelector('.waitlist-btn');
    const input = document.getElementById('email-input');
    if (btn && input) {
      btn.textContent = "✓ You're on the list!";
      btn.style.background = '#10B981';
      btn.style.boxShadow = '0 4px 20px rgba(16,185,129,0.4)';
      btn.disabled = true;
      input.value = '';
      input.placeholder = "We'll be in touch soon!";
      input.disabled = true;
    }
  };

  const handleHowStepClick = (step) => {
    const steps = document.querySelectorAll('.how-step');
    steps.forEach((s) => (s.style.opacity = '0.5'));
    step.style.opacity = '1';
    setTimeout(() => {
      steps.forEach((s) => (s.style.opacity = '1'));
    }, 1200);
  };

  return (
    <div className="font-sans text-slate-900 bg-white overflow-x-hidden">
      {/* Navigation */}
      <nav
        id="main-nav"
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-12 h-[72px] bg-white/92 backdrop-blur-md border-b border-slate-200/80 transition-shadow duration-300"
      >
        <a href="/" className="flex items-center gap-2.5 font-extrabold text-2xl tracking-tight text-slate-900 no-underline">
          <img
            src={MainLogo}
            alt="SmartStub Logo"
            className="h-32 w-32 object-contain"
          />
        </a>
        <ul className="hidden md:flex gap-8 list-none">
          <li><a href="#features" className="text-sm font-medium text-slate-500 hover:text-slate-900 no-underline transition-colors">Features</a></li>
          <li><a href="#how" className="text-sm font-medium text-slate-500 hover:text-slate-900 no-underline transition-colors">How It Works</a></li>
          <li><a href="#dashboard" className="text-sm font-medium text-slate-500 hover:text-slate-900 no-underline transition-colors">Dashboard</a></li>
          <li><a href="#pricing" className="text-sm font-medium text-slate-500 hover:text-slate-900 no-underline transition-colors">Pricing</a></li>
        </ul>
        <div className="hidden md:flex gap-3 items-center">
          {/* <a href="#" className="text-sm font-semibold text-blue-600 py-2 px-5 border-2 border-blue-600 rounded-lg no-underline transition-all hover:bg-sky-50">Sign In</a> */}
          <a href="#waitlist" className="text-sm font-bold text-white bg-blue-600 py-2.5 px-6 rounded-lg no-underline transition-all shadow-md hover:bg-blue-700 hover:-translate-y-0.5 hover:shadow-lg">Get Early Access</a>
        </div>
        <button className="md:hidden flex flex-col gap-1.5 bg-transparent border-none cursor-pointer p-1" aria-label="Open menu">
          <span className="block w-6 h-0.5 bg-slate-900 rounded-full transition-all"></span>
          <span className="block w-6 h-0.5 bg-slate-900 rounded-full transition-all"></span>
          <span className="block w-6 h-0.5 bg-slate-900 rounded-full transition-all"></span>
        </button>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen pt-[120px] pb-20 px-5 md:px-12 relative overflow-hidden bg-white" id="home">
        <div className="absolute inset-0 pointer-events-none z-0 bg-[repeating-linear-gradient(45deg,transparent_0px,transparent_38px,rgba(45,106,79,0.025)_38px,rgba(45,106,79,0.025)_40px),repeating-linear-gradient(-45deg,transparent_0px,transparent_38px,rgba(45,106,79,0.025)_38px,rgba(45,106,79,0.025)_40px)]"></div>
        <div className="absolute font-serif text-7xl md:text-[280px] font-bold text-emerald-900/5 pointer-events-none select-none z-0 -top-16 right-[5%] animate-[floatDollar_20s_ease-in-out_infinite]">$</div>
        <div className="absolute font-serif text-7xl md:text-[180px] font-bold text-emerald-900/5 pointer-events-none select-none z-0 bottom-[10%] left-[3%] animate-[floatDollar_20s_ease-in-out_infinite] -delay-700">$</div>
        <div className="absolute w-[900px] h-[900px] bg-gradient-to-br from-blue-600/5 to-transparent rounded-full -top-48 -right-48 pointer-events-none z-0"></div>

        <div className="max-w-7xl mx-auto relative z-10 grid md:grid-cols-2 gap-16 items-center">
          <div className="animate-[slideUp_0.7s_0.1s_ease_both]">
            <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 font-mono text-xs font-medium py-1.5 px-3.5 rounded-full mb-6 tracking-wide uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-[pulseDot_2s_ease_infinite]"></span>
              Now in Early Access
            </div>
            <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight text-slate-900 mb-6">
              Know Every{" "}
              <br />
              <span className="relative inline-block mb-2">
                <span className="text-blue-600 italic">Dollar</span>
                <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full"></span>
              </span>
              <br />
              You've{" "}
              <em className="text-blue-600 not-italic">Earned.</em>
            </h1>


            <p className="text-lg text-slate-500 leading-relaxed max-w-md mb-10">SmartStub decodes your paycheck so you can feel confident about your money catch errors, understand your taxes, and take control of every dollar.</p>
            <div className="flex flex-col gap-3 mb-10">
              <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center text-sm">🔍</div><span><strong>Complete Clarity</strong> - See a full breakdown of earnings, taxes &amp; deductions</span></div>
              <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-sm">🛡️</div><span><strong>Verify Accuracy</strong> - Catch errors and make sure you're paid what you deserve</span></div>
              <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-sm">⚡</div><span><strong>Instant Answers</strong> - Clear explanations for every line on your pay stub</span></div>
              <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-sm">📊</div><span><strong>Track &amp; Plan Better</strong> - Understand your money, plan your future</span></div>
            </div>
            <div className="flex gap-3.5 flex-wrap">
              <a href="#waitlist" className="bg-blue-600 text-white font-bold text-sm py-3.5 px-8 rounded-xl no-underline transition-all shadow-lg hover:bg-blue-700 hover:-translate-y-1 hover:shadow-xl inline-flex items-center gap-2">Start Free</a>
              <a href="#how" className="bg-transparent text-slate-900 font-semibold text-sm py-3.5 px-6 rounded-xl no-underline border-2 border-slate-200 transition-all hover:border-blue-400 hover:bg-sky-50 hover:text-blue-600 inline-flex items-center gap-2">See How It Works</a>
            </div>
            <div className="flex items-center gap-2 mt-7 text-xs text-slate-400"><span className="text-base">🔒</span><span>Bank-level encryption  ·  We never share your information</span></div>
          </div>

          <div className="relative animate-[slideUp_0.9s_0.3s_ease_both]">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl max-h-[540px]">
              {/* <img src="/api/placeholder/600/540" alt="SmartStub Dashboard Preview" className="w-full h-full object-cover object-top max-h-[540px]" /> */}
            </div>
            <div className="absolute top-6 right-0 md:-right-6 bg-white/96 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-white/90 min-w-[180px]">
              <div className="font-mono text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5">Net Pay</div>
              <div className="font-bold text-2xl text-emerald-600 leading-tight mb-1.5">$1,452.68</div>
              <div className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 text-xs font-semibold py-1 px-2 rounded-full">↑ 8.7% vs last period</div>
            </div>
            <div className="absolute bottom-10 left-0 md:-left-6 bg-white/96 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-white/90 min-w-[200px]">
              <div className="font-mono text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5">Take Home %</div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[conic-gradient(#2563EB_0%_67.6%,#E2E8F0_67.6%_100%)] flex items-center justify-center relative before:absolute before:w-[34px] before:h-[34px] before:rounded-full before:bg-white/96"></div>
                <div className="font-extrabold text-base text-slate-900">67.6%</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ticker */}
      <div className="py-5 bg-slate-50 border-y border-slate-200 overflow-hidden">
        <div className="text-center font-mono text-[0.65rem] tracking-[0.15em] uppercase text-slate-400 mb-3">Integrates with payroll &amp; gig platforms you already use</div>
        <div className="overflow-hidden">
          <div className="flex gap-12 w-max animate-[ticker_25s_linear_infinite]">
            {['ADP', 'Gusto', 'Paychex', 'Rippling', 'Workday', 'QuickBooks Payroll', 'Uber', 'DoorDash', 'Lyft', 'Instacart', 'Upwork', 'Square Payroll', 'Justworks', 'Bamboo HR', 'Paylocity', 'UKG'].map((item, i) => (
              <span key={i} className="font-bold text-sm text-slate-900/25 whitespace-nowrap tracking-wide uppercase">{item}</span>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <section className="py-24 px-5 md:px-12 bg-slate-50" id="how">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-20 items-center">
            <div>
              <div className="font-mono text-[0.7rem] font-medium tracking-[0.15em] uppercase text-blue-600 mb-4">How It Works</div>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight text-slate-900 mb-4">Four steps to total<br /><span className="text-blue-600 italic">paycheck clarity.</span></h2>
              <p className="text-lg text-slate-500 leading-relaxed max-w-md mb-8">Link your employer's payroll or upload a PDF SmartStub handles the rest automatically.</p>
              <div className="flex flex-col gap-0">
                {[
                  { num: '01', title: 'Connect or Upload', desc: "Link your employer's payroll system (ADP, Gusto, Workday…) or simply drag & drop a pay stub PDF. SmartStub reads and structures all the data." },
                  { num: '02', title: 'SmartStub Reads & Extracts', desc: 'Our AI reads every line  gross pay, each tax type, every deduction  and extracts it into a clean, structured format in seconds.' },
                  { num: '03', title: 'Review & Verify', desc: 'Confirm the extracted data and see any errors flagged instantly missed overtime, wrong tax rates, duplicate deductions.' },
                  { num: '04', title: 'See Your Full Breakdown', desc: 'Get clear charts, insights, and plain-English explanations for every dollar on your paycheck. Plus AI answers for any question you have.' }
                ].map((step, idx) => (
                  <div key={idx} className="flex gap-5 py-6 border-b border-slate-200 last:border-none cursor-pointer transition-all hover:opacity-100 how-step" onClick={(e) => handleHowStepClick(e.currentTarget)}>
                    <div className="w-11 h-11 flex-shrink-0 rounded-full bg-sky-50 border-2 border-slate-200 flex items-center justify-center font-mono text-sm font-bold text-blue-600 transition-all group-hover:bg-blue-600 group-hover:text-white">{step.num}</div>
                    <div><div className="font-bold text-base text-slate-900 mb-1">{step.title}</div><div className="text-sm text-slate-500 leading-relaxed">{step.desc}</div></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-xl border border-slate-200 max-h-[680px]">
                {/* <img src="/api/placeholder/600/680" alt="Connect or Upload your payslip" className="w-full h-full object-cover object-top max-h-[680px]" /> */}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-5 md:px-12 bg-white" id="features">
        <div className="max-w-7xl mx-auto">
          <div className="font-mono text-[0.7rem] font-medium tracking-[0.15em] uppercase text-blue-600 mb-4">Features</div>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight text-slate-900 mb-4">Your paycheck,<br /><span className="text-blue-600 italic">fully decoded.</span></h2>
          <p className="text-lg text-slate-500 leading-relaxed max-w-xl mb-14">From W-2 workers to gig drivers SmartStub handles every earning type with precision and clarity.</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Large feature 1 */}
            <div className="lg:col-span-2 bg-white border-2 border-slate-200 rounded-2xl p-8 transition-all hover:border-blue-400 hover:-translate-y-1 hover:shadow-lg relative overflow-hidden feat-card">
              <div><div className="w-13 h-13 rounded-xl bg-sky-50 flex items-center justify-center text-2xl mb-5">📄</div><div className="font-bold text-lg text-slate-900 mb-2.5">Pay Stub Upload &amp; Parsing</div><div className="text-sm text-slate-500 leading-relaxed mb-5">Upload a PDF or snap a photo of your pay statement. SmartStub's AI extracts every line gross pay, deductions, taxes automatically. Supports any employer, any format.</div><span className="inline-block font-mono text-[0.65rem] font-medium py-1 px-2.5 rounded-full bg-emerald-100 text-emerald-700 uppercase tracking-wider">Free</span></div>
              {/* <div className="mt-6"><img src="/api/placeholder/400/200" alt="Pay stub parsing" className="w-full rounded-xl shadow-md object-cover" /></div> */}
            </div>
            {/* Regular features */}
            {[
              { icon: '🔗', title: 'Payroll & Gig Integrations', desc: 'Connect directly to ADP, Gusto, Paychex, Workday, and gig platforms like Uber, DoorDash, and Instacart. Data syncs automatically every pay cycle.', tag: 'Pro', tagColor: 'amber' },
              { icon: '⚠️', title: 'Payroll Error Detection', desc: 'SmartStub flags anomalies — missed overtime, incorrect tax rates, duplicate deductions — and explains exactly what to say to HR to get it fixed.', tag: 'Free + Pro', tagColor: 'blue' },
              { icon: '🧮', title: 'Hypothetical Calculator', desc: 'Simulate a raise, relocation, adding a dependent, or changing your 401(k) contribution — see your exact take-home instantly before any decision.', tag: 'Free + Pro', tagColor: 'blue' },
              { icon: '📈', title: 'Earnings History & Trends', desc: 'See your full earning history across all jobs and platforms. Track how your gross and net pay have changed over time with beautiful visual charts.', tag: 'Pro', tagColor: 'amber' },
            ].map((feat, idx) => (
              <div key={idx} className="bg-white border-2 border-slate-200 rounded-2xl p-8 transition-all hover:border-blue-400 hover:-translate-y-1 hover:shadow-lg relative overflow-hidden feat-card">
                <div className={`w-13 h-13 rounded-xl flex items-center justify-center text-2xl mb-5 ${feat.icon === '🔗' ? 'bg-emerald-50' : feat.icon === '⚠️' ? 'bg-red-50' : feat.icon === '🧮' ? 'bg-amber-50' : 'bg-purple-50'}`}>{feat.icon}</div>
                <div className="font-bold text-lg text-slate-900 mb-2.5">{feat.title}</div>
                <div className="text-sm text-slate-500 leading-relaxed mb-5">{feat.desc}</div>
                <span className={`inline-block font-mono text-[0.65rem] font-medium py-1 px-2.5 rounded-full uppercase tracking-wider ${feat.tagColor === 'amber' ? 'bg-amber-100 text-amber-800' : 'bg-sky-100 text-blue-600'}`}>{feat.tag}</span>
              </div>
            ))}
            {/* Large feature 2 */}
            <div className="lg:col-span-2 bg-white border-2 border-slate-200 rounded-2xl p-8 transition-all hover:border-blue-400 hover:-translate-y-1 hover:shadow-lg relative overflow-hidden feat-card flex flex-col lg:flex-row gap-8">
              <div><div className="w-13 h-13 rounded-xl bg-emerald-50 flex items-center justify-center text-2xl mb-5">🗺️</div><div className="font-bold text-lg text-slate-900 mb-2.5">Multi-State Tax Comparison</div><div className="text-sm text-slate-500 leading-relaxed mb-5">Moving states? Working remotely? SmartStub models your exact tax impact across all 50 states — see exactly how much more you'd take home before you make the move.</div><span className="inline-block font-mono text-[0.65rem] font-medium py-1 px-2.5 rounded-full bg-amber-100 text-amber-800 uppercase tracking-wider">Pro</span></div>
              {/* <div className="lg:w-1/2"><img src="/api/placeholder/400/300" alt="Multi-state tax comparison" className="w-full rounded-xl shadow-md object-cover object-center" /></div> */}
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Section */}
      <section className="py-24 px-5 md:px-12 bg-gradient-to-b from-slate-50 to-white" id="dashboard">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-20 items-center">
            <div>
              <div className="font-mono text-[0.7rem] font-medium tracking-[0.15em] uppercase text-blue-600 mb-4">Your Financial Dashboard</div>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight text-slate-900 mb-4">Everything about your money,<br /><span className="text-emerald-700">in one place.</span></h2>
              <p className="text-lg text-slate-500 leading-relaxed max-w-md mb-8">Your personalised financial home screen — latest paycheck, YTD totals, tax breakdown, benefits balance, and AI-powered insights, all updated automatically.</p>
              <div className="grid grid-cols-2 gap-3 mb-8">
                <div className="bg-white border-2 border-slate-200 rounded-xl p-5 transition-all hover:border-blue-400 hover:shadow-md db-hi"><div className="font-extrabold text-2xl text-emerald-600 mb-1">$23,645</div><div className="text-xs font-medium text-slate-400">YTD Gross Pay</div></div>
                <div className="bg-white border-2 border-slate-200 rounded-xl p-5 transition-all hover:border-blue-400 hover:shadow-md db-hi"><div className="font-extrabold text-2xl text-blue-600 mb-1">$15,842</div><div className="text-xs font-medium text-slate-400">YTD Net Take-Home</div></div>
                <div className="bg-white border-2 border-slate-200 rounded-xl p-5 transition-all hover:border-blue-400 hover:shadow-md db-hi"><div className="font-extrabold text-2xl text-amber-500 mb-1">$3,892</div><div className="text-xs font-medium text-slate-400">YTD Taxes Paid</div></div>
                <div className="bg-white border-2 border-slate-200 rounded-xl p-5 transition-all hover:border-blue-400 hover:shadow-md db-hi"><div className="font-extrabold text-2xl text-blue-600 mb-1">67.6%</div><div className="text-xs font-medium text-slate-400">Take-Home Rate</div></div>
              </div>
              <a href="#waitlist" className="bg-blue-600 text-white font-bold text-sm py-3.5 px-8 rounded-xl no-underline transition-all shadow-md hover:bg-blue-700 hover:-translate-y-0.5 inline-flex items-center gap-2">View Full Dashboard →</a>
            </div>
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-xl border border-slate-200 max-h-[680px]">
                {/* <img src="/api/placeholder/600/680" alt="SmartStub Dashboard" className="w-full h-full object-cover object-top max-h-[680px]" /> */}
              </div>
              {/* <div className="absolute -bottom-4 right-6 bg-slate-900 text-white text-xs font-semibold py-2.5 px-5 rounded-full flex items-center gap-2 shadow-xl">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Ask SmartStub AI — anything about your pay
              </div> */}
            </div>
          </div>
        </div>
      </section>

      {/* Tax Comparison */}
      <section className="py-24 px-5 md:px-12 bg-white" id="tax">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-18 items-center">
            <div>
              <div className="font-mono text-[0.7rem] font-medium tracking-[0.15em] uppercase text-blue-600 mb-4">Multi-State Tax Modeling</div>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight text-slate-900 mb-4">Compare Your Tax<br /><span className="text-blue-600 italic">in Different States</span></h2>
              <p className="text-lg text-slate-500 leading-relaxed max-w-md mb-8">See how much of your hard-earned money you keep depending on where you live and work.</p>
              <div className="flex flex-col gap-5">
                {[
                  { icon: '🗂️', title: 'State-by-State Comparison', desc: 'Instantly compare income tax, take-home pay, and overall tax burden across any states you choose.', bg: 'bg-sky-50' },
                  { icon: '💰', title: 'See What You Keep', desc: 'Know exactly how much more you can take home in lower-tax states — with real numbers, not estimates.', bg: 'bg-emerald-50' },
                  { icon: '🎯', title: 'Make Smarter Decisions', desc: 'Use real numbers to plan your move, negotiate salary, or understand your remote work tax situation.', bg: 'bg-purple-50' }
                ].map((point, idx) => (
                  <div key={idx} className="flex gap-4 items-start tax-point"><div className={`w-11 h-11 flex-shrink-0 rounded-xl ${point.bg} flex items-center justify-center text-xl`}>{point.icon}</div><div><div className="font-bold text-base text-slate-900 mb-1">{point.title}</div><div className="text-sm text-slate-500 leading-relaxed">{point.desc}</div></div></div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-xl border border-slate-200 max-h-[500px]">
                {/* <img src="/api/placeholder/600/500" alt="Tax comparison across states" className="w-full h-full object-cover object-top max-h-[500px]" /> */}
              </div>
              <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap bg-gradient-to-r from-emerald-700 to-emerald-500 text-white font-bold text-sm py-3 px-6 rounded-full shadow-xl flex items-center gap-2">💰 Keep up to $7,247 more per year in Texas vs. California</div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 px-5 md:px-12 bg-slate-50" id="pricing">
        <div className="max-w-4xl mx-auto text-center">
          <div className="font-mono text-[0.7rem] font-medium tracking-[0.15em] uppercase text-blue-600 mb-4">Pricing</div>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight text-slate-900 mb-3">Start free.<br /><span className="text-blue-600 italic">Upgrade when you're ready.</span></h2>
          <p className="text-lg text-slate-500 leading-relaxed max-w-md mx-auto mb-14">No hidden fees. No surprises. Cancel anytime.</p>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white border-2 border-slate-200 rounded-2xl p-10 transition-all hover:-translate-y-1 hover:shadow-lg price-card">
              <div className="font-mono text-xs font-medium text-slate-400 uppercase tracking-wider mb-3">Free</div>
              <div className="font-serif text-5xl font-bold text-slate-900 flex items-baseline gap-1 mb-2"><sup className="text-2xl">$</sup>0</div>
              <div className="text-sm text-slate-500 leading-relaxed mb-7">Perfect for workers who want to understand their pay stub without any hassle.</div>
              <ul className="list-none mb-8 flex flex-col gap-0">
                {['Pay stub upload & AI parsing', 'Basic error detection', 'Net pay calculator', '3 pay stubs per month'].map((item, i) => (<li key={i} className="text-sm text-slate-800 py-2 border-b border-slate-200 flex items-center gap-2"><span className="text-emerald-600 text-sm flex-shrink-0">✓</span>{item}</li>))}
                {['Payroll integrations', 'Full earnings history', 'Multi-state scenarios'].map((item, i) => (<li key={i} className="text-sm text-slate-400 py-2 border-b border-slate-200 flex items-center gap-2"><span className="text-slate-400 text-sm flex-shrink-0">✕</span>{item}</li>))}
              </ul>
              <a href="#waitlist" className="block w-full py-3.5 rounded-xl font-bold text-sm border-2 border-slate-200 bg-transparent text-slate-900 text-center no-underline transition-all hover:border-blue-600 hover:text-blue-600 hover:bg-sky-50">Get Started Free</a>
            </div>
            {/* Pro Plan */}
            <div className="bg-slate-900 border-2 border-slate-900 rounded-2xl p-10 relative transition-all hover:-translate-y-1 hover:shadow-2xl price-card">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-emerald-400 text-emerald-900 font-mono text-[0.65rem] font-medium py-1 px-4 rounded-full uppercase tracking-wider whitespace-nowrap">Most Popular</div>
              <div className="font-mono text-xs font-medium text-white/50 uppercase tracking-wider mb-3">Pro</div>
              <div className="font-serif text-5xl font-bold text-white flex items-baseline gap-1 mb-2"><sup className="text-2xl">$</sup>9<small className="text-base font-normal text-white/50">/mo</small></div>
              <div className="text-sm text-white/60 leading-relaxed mb-7">For the worker who wants full automation, deep insights, and zero paycheck surprises.</div>
              <ul className="list-none mb-8 flex flex-col gap-0">
                {['Everything in Free', 'Unlimited pay stub uploads', 'Payroll & gig integrations', 'Auto-sync every pay cycle', 'Full earnings history & charts', 'Multi-state tax modeling', 'Priority error alerts'].map((item, i) => (<li key={i} className="text-sm text-white/85 py-2 border-b border-white/10 flex items-center gap-2"><span className="text-emerald-600 text-sm flex-shrink-0">✓</span>{item}</li>))}
              </ul>
              <a href="#waitlist" className="block w-full py-3.5 rounded-xl font-bold text-sm bg-emerald-500 text-white text-center no-underline transition-all shadow-md hover:bg-emerald-600 hover:-translate-y-0.5">Start Pro — $9/mo</a>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile App Section */}
      <section className="py-20 px-5 md:px-12 bg-white" id="mobile">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-20 items-center">
            <div>
              <div className="font-mono text-[0.7rem] font-medium tracking-[0.15em] uppercase text-blue-600 mb-4">Mobile App Preview</div>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight text-slate-900 mb-4">Your paycheck,<br /><span className="text-blue-600 italic">always in your pocket.</span></h2>
              <p className="text-lg text-slate-500 leading-relaxed max-w-md mb-8">Check your latest paycheck, scan a new stub with your camera, and ask SmartStub AI anything — all from your phone.</p>
              <div className="flex flex-col gap-4">
                {[
                  { icon: '📱', title: 'Scan Stub with Camera', desc: 'Point your camera at any payslip  SmartStub reads it instantly', bg: 'bg-sky-50' },
                  { icon: '💬', title: 'Ask SmartStub AI', desc: 'Why was my overtime taxed higher ?  get plain-English answers', bg: 'bg-emerald-50' },
                  { icon: '🔔', title: 'Payday Notifications', desc: 'Get notified the moment your paycheck is ready, with a net pay summary', bg: 'bg-amber-50' }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3.5"><div className={`w-11 h-11 flex-shrink-0 rounded-xl ${item.bg} flex items-center justify-center text-xl`}>{item.icon}</div><div><div className="font-bold text-base text-slate-900 mb-0.5">{item.title}</div><div className="text-sm text-slate-500">{item.desc}</div></div></div>
                ))}
              </div>
            </div>
            <div className="max-w-[360px] mx-auto">
              <div className="rounded-3xl overflow-hidden shadow-2xl border border-slate-200 max-h-[720px]">
                {/* <img src="/api/placeholder/360/720" alt="SmartStub mobile app" className="w-full h-full object-cover object-top max-h-[720px]" /> */}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Waitlist CTA */}
      <section className="py-24 px-5 md:px-12 bg-slate-900 relative overflow-hidden text-center" id="waitlist">
        <div className="absolute font-serif text-9xl md:text-[400px] font-bold text-white/5 pointer-events-none select-none -top-28 -left-20">$</div>
        <div className="absolute font-serif text-9xl md:text-[300px] font-bold text-white/5 pointer-events-none select-none -bottom-20 -right-10">$</div>
        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="font-mono text-xs font-medium tracking-[0.15em] uppercase text-emerald-400 mb-5">Get Early Access</div>
          <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight mb-4">Your paycheck shouldn't<br />be a mystery.</h2>
          <p className="text-base text-white/60 leading-relaxed mb-10">Join thousands of workers taking control of their earnings with SmartStub. Early access is free no credit card required.</p>
          {/* <form className="flex flex-col md:flex-row gap-3 max-w-md mx-auto" onSubmit={handleWaitlist}>
            <input type="email" id="email-input" placeholder="Enter your email address" required className="flex-1 bg-white/10 border-2 border-white/20 rounded-xl py-3.5 px-5 font-sans text-sm text-white outline-none transition-colors focus:border-emerald-400 placeholder:text-white/35" />
            <button type="submit" className="waitlist-btn bg-emerald-500 text-white font-bold text-sm py-3.5 px-6 rounded-xl whitespace-nowrap transition-all shadow-md hover:bg-emerald-600 hover:-translate-y-0.5">Join Waitlist</button>
          </form> */}
          {/* <p className="text-xs text-white/35 mt-4">🔒  We respect your privacy. No spam, ever. Unsubscribe anytime.</p> */}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-2 px-5 md:px-12 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2 font-extrabold text-lg text-slate-900">
          <img
            src={MainLogo}
            alt="SmartStub Logo"
            className="h-15 w-32 object-contain"
          />
        </div>
        <div className="flex flex-wrap justify-center gap-7">
          {['Privacy Policy', 'Terms of Service', 'Contact', 'Blog'].map((item, i) => (<a key={i} href="#" className="text-xs text-slate-400 no-underline transition-colors hover:text-slate-900">{item}</a>))}
        </div>
        <div className="font-mono text-[0.72rem] text-slate-400">&copy; 2026 SmartStub, Inc. All rights reserved.</div>
      </footer>

      {/* Inject custom keyframes for animations */}
      <style>{`
        @keyframes floatDollar {
          0%, 100% { transform: translateY(0) rotate(-5deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes pulseDot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.7); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-floatDollar { animation: floatDollar 20s ease-in-out infinite; }
        .animate-pulseDot { animation: pulseDot 2s ease infinite; }
        .animate-slideUp { animation: slideUp 0.7s ease both; }
        .animate-ticker { animation: ticker 25s linear infinite; }
      `}</style>
    </div>
  );
}