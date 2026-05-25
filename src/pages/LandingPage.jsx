import React, { useState, useEffect, useRef } from 'react';
import './SmartStubLanding.css'; // We'll move the styles here

const SmartStubLanding = () => {
  const [scrolled, setScrolled] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [email, setEmail] = useState('');

  // Nav scroll shadow
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll reveal with IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.12 }
    );
    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach((el) => observer.observe(el));
    return () => {
      revealElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  // Waitlist submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setConfirmed(true);
    }
  };

  return (
    <>
      {/* ── NAV ── */}
      <nav id="mainNav" className={scrolled ? 'scrolled' : ''}>
        <a href="#" className="nav-logo">
          <img
            src="https://bitdlive.com/wp-content/uploads/2026/05/logo.png"
            alt="SmartStub"
          />
        </a>
        <ul>
          <li>
            <a href="#features">Features</a>
          </li>
          <li>
            <a href="#how">How It Works</a>
          </li>
          <li>
            <a href="#dashboard">Dashboard</a>
          </li>
          <li>
            <a href="#tax">Tax Compare</a>
          </li>
          <li>
            <a href="#mobile">Mobile App</a>
          </li>
        </ul>
        <div className="nav-cta">
          <a href="#" className="btn-ghost">
            Sign In
          </a>
          <a href="#waitlist" className="btn-filled">
            Get Early Access
          </a>
        </div>
        <button className="hamburger" aria-label="Menu">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </nav>

      {/* ── HERO ── */}
      <section className="hero" id="home">
        <div className="hero-watermark">$</div>
        <div className="hero-dollars">
          <span className="hd">$</span>
          <span className="hd">$</span>
          <span className="hd">$</span>
          <span className="hd">$</span>
          <span className="hd">$</span>
          <span className="hd">$</span>
        </div>
        <div className="hero-glow g1"></div>
        <div className="hero-glow g2"></div>

        <div className="hero-inner">
          {/* LEFT */}
          <div>
            <div className="hero-pill">
              <div className="pill-dot">AI</div>
              <span className="pill-text">Now in Early Access</span>
            </div>
            <h1 className="hero-title">
              Know Every
              <br />
              <span className="underline-word accent">Dollar</span>
              <br />
              You've <em className="accent">Earned.</em>
            </h1>
            <p className="hero-sub">
              SmartStub decodes your paycheck so you can feel confident about
              your money. Catch errors, understand your taxes, and take control
              of every dollar.
            </p>
            <div className="hero-bullets">
              <div className="hero-bullet">
                <div className="hbullet-icon ic-blue">🔍</div>
                <span>
                  <strong>Complete Clarity</strong> – See a full breakdown of
                  earnings, taxes and deductions
                </span>
              </div>
              <div className="hero-bullet">
                <div className="hbullet-icon ic-green">🛡️</div>
                <span>
                  <strong>Verify Accuracy</strong> – Catch errors and make sure
                  you're paid what you deserve
                </span>
              </div>
              <div className="hero-bullet">
                <div className="hbullet-icon ic-amber">⚡</div>
                <span>
                  <strong>Instant Answers</strong> – Clear explanations for
                  every line on your pay stub
                </span>
              </div>
              <div className="hero-bullet">
                <div className="hbullet-icon ic-purple">📊</div>
                <span>
                  <strong>Track and Plan Better</strong> – Understand your
                  money and plan your future with confidence
                </span>
              </div>
            </div>
            <div className="hero-btns">
              <a href="#waitlist" className="btn-hero-primary">
                Start Free &rarr;
              </a>
              <a href="#how" className="btn-hero-outline">
                See How It Works
              </a>
            </div>
            <div className="hero-trust">
              <span className="trust-icon">🔒</span>
              <span>
                Bank-level encryption &nbsp;·&nbsp; We never share your
                information
              </span>
            </div>
          </div>

          {/* RIGHT */}
          <div className="hero-visual">
            <div className="hero-img-frame">
              <img
                src="https://bitdlive.com/wp-content/uploads/2026/05/know-every-dollar-you-earned.png"
                alt="Know Every Dollar You Have Earned"
                loading="eager"
                decoding="async"
              />
            </div>
            <div className="bubble b1">
              <div className="bubble-label">Net Pay</div>
              <div className="bubble-val">$1,452.68</div>
              <div className="bubble-badge">↑ 8.7% vs last period</div>
            </div>
            <div className="bubble b2">
              <div className="bubble-label">Take Home %</div>
              <div className="bubble-ring">
                <div className="ring">
                  <span className="ring-val">67.6%</span>
                </div>
                <div>
                  <div
                    style={{
                      fontWeight: 800,
                      fontSize: '1.4rem',
                      color: 'var(--navy)',
                    }}
                  >
                    67.6%
                  </div>
                  <div style={{ fontSize: '.72rem', color: 'var(--lgray)' }}>
                    of your gross pay
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* wave shape */}
        <div style={{ height: '80px', overflow: 'hidden', marginTop: '60px' }}>
          <svg
            viewBox="0 0 1440 80"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ width: '100%', height: '100%', display: 'block' }}
          >
            <path
              d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z"
              fill="#ffffff"
            />
          </svg>
        </div>
      </section>

      {/* ── TICKER ── */}
      <div className="ticker-section">
        <div className="ticker-eyebrow">
          Integrates with the tools you already use
        </div>
        <div style={{ overflow: 'hidden' }}>
          <div className="ticker-rail">
            <span>ADP</span>
            <span>Gusto</span>
            <span>Paychex</span>
            <span>Rippling</span>
            <span>Workday</span>
            <span>QuickBooks Payroll</span>
            <span>Uber</span>
            <span>DoorDash</span>
            <span>Lyft</span>
            <span>Instacart</span>
            <span>Upwork</span>
            <span>Square Payroll</span>
            <span>Justworks</span>
            <span>Bamboo HR</span>
            <span>Paylocity</span>
            <span>UKG</span>
            <span>ADP</span>
            <span>Gusto</span>
            <span>Paychex</span>
            <span>Rippling</span>
            <span>Workday</span>
            <span>QuickBooks Payroll</span>
            <span>Uber</span>
            <span>DoorDash</span>
            <span>Lyft</span>
            <span>Instacart</span>
            <span>Upwork</span>
            <span>Square Payroll</span>
            <span>Justworks</span>
            <span>Bamboo HR</span>
            <span>Paylocity</span>
            <span>UKG</span>
          </div>
        </div>
      </div>

      {/* ── HOW IT WORKS ── */}
      <section className="how-section" id="how">
        <div className="container">
          <div className="how-grid">
            <div>
              <div className="sec-eye">How It Works</div>
              <h2 className="sec-h2">
                Four steps to total
                <br />
                <span className="accent">paycheck clarity.</span>
              </h2>
              <p className="sec-sub">
                Link your employer's payroll system or upload a PDF. SmartStub
                handles the rest automatically.
              </p>
              <div className="steps-list">
                <div className="step-item reveal">
                  <div className="step-num">01</div>
                  <div>
                    <div className="step-name">Connect or Upload</div>
                    <div className="step-detail">
                      Link your employer's payroll system (ADP, Gusto, Workday)
                      or drag and drop a pay stub PDF. SmartStub reads and
                      structures all the data for you.
                    </div>
                  </div>
                </div>
                <div className="step-item reveal">
                  <div className="step-num">02</div>
                  <div>
                    <div className="step-name">
                      SmartStub Reads and Extracts
                    </div>
                    <div className="step-detail">
                      Our AI reads every line including gross pay, each tax
                      type, and every deduction and extracts it into a clean,
                      structured format in seconds.
                    </div>
                  </div>
                </div>
                <div className="step-item reveal">
                  <div className="step-num">03</div>
                  <div>
                    <div className="step-name">Review and Verify</div>
                    <div className="step-detail">
                      Confirm the extracted data and see any errors flagged
                      instantly including missed overtime, wrong tax rates, and
                      duplicate deductions.
                    </div>
                  </div>
                </div>
                <div className="step-item reveal">
                  <div className="step-num">04</div>
                  <div>
                    <div className="step-name">See Your Full Breakdown</div>
                    <div className="step-detail">
                      Get clear charts, insights, and plain-English explanations
                      for every dollar on your paycheck, plus AI answers for
                      any question you have.
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="reveal">
              <div className="how-img-wrap">
                <img
                  src="https://bitdlive.com/wp-content/uploads/2026/05/paycheck-clarty.png"
                  alt="Four steps to total paycheck clarity"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── YOUR PAYCHECK FULLY DECODED (features only, no images) ── */}
      <section className="decoded-section" id="features">
        <div className="container">
          <div className="decoded-header reveal">
            <div className="sec-eye">Features</div>
            <h2 className="sec-h2">
              Your paycheck, <span className="accent">fully decoded.</span>
            </h2>
            <p className="sec-sub">
              From W-2 workers to gig drivers, SmartStub handles every earning
              type with precision and clarity.
            </p>
          </div>

          <div className="feat-showcase">
            {/* WIDE card 1 */}
            <div className="feat-card2 wide reveal">
              <div className="feat-wide-content">
                <div
                  className="feat-icon2"
                  style={{ background: '#EEF4FF' }}
                >
                  📄
                </div>
                <div className="feat-name">Pay Stub Upload and AI Parsing</div>
                <div className="feat-desc2">
                  Upload a PDF or photo of any pay stub. SmartStub's AI extracts
                  every line including gross pay, each tax, and every deduction
                  automatically. Works with any employer and any format.
                </div>
                <span className="feat-pill pill-f">Free</span>
              </div>
              <div className="feat-wide-visual">
                <div className="mini-stat-row">
                  <div className="mini-stat">
                    <span className="ms-label">Gross Pay</span>
                    <span className="ms-val amber">$2,150.00</span>
                  </div>
                  <div className="mini-stat">
                    <span className="ms-label">Federal Tax</span>
                    <span className="ms-val red">-$186.52</span>
                  </div>
                  <div className="mini-stat">
                    <span className="ms-label">Social Security</span>
                    <span className="ms-val red">-$133.30</span>
                  </div>
                  <div className="mini-stat">
                    <span className="ms-label">Medicare</span>
                    <span className="ms-val red">-$31.18</span>
                  </div>
                  <div className="mini-stat">
                    <span className="ms-label">401(k)</span>
                    <span className="ms-val blue">-$150.00</span>
                  </div>
                  <div
                    className="mini-stat"
                    style={{
                      border: '2px solid var(--mint)',
                      background: 'var(--mint-l)',
                    }}
                  >
                    <span
                      className="ms-label"
                      style={{ fontWeight: 700, color: 'var(--navy)' }}
                    >
                      Net Pay
                    </span>
                    <span
                      className="ms-val green"
                      style={{ fontSize: '1.1rem' }}
                    >
                      $1,452.68
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* regular cards */}
            <div className="feat-card2 card-mint reveal">
              <div
                className="feat-icon2"
                style={{ background: 'var(--mint-l)' }}
              >
                🔗
              </div>
              <div className="feat-name">Payroll and Gig Integrations</div>
              <div className="feat-desc2">
                Connect directly to ADP, Gusto, Paychex, Workday, and gig
                platforms like Uber, DoorDash, and Instacart. Data syncs
                automatically every pay cycle with no manual uploads ever
                needed.
              </div>
              <span className="feat-pill pill-p">Pro</span>
            </div>

            <div className="feat-card2 card-coral reveal">
              <div
                className="feat-icon2"
                style={{ background: 'var(--coral-l)' }}
              >
                ⚠️
              </div>
              <div className="feat-name">Payroll Error Detection</div>
              <div className="feat-desc2">
                SmartStub flags anomalies including missed overtime, incorrect
                tax rates, and duplicate deductions, then explains exactly what
                to say to HR to get it resolved quickly.
              </div>
              <span className="feat-pill pill-b">Free + Pro</span>
            </div>

            <div className="feat-card2 card-amber reveal">
              <div
                className="feat-icon2"
                style={{ background: 'var(--amber-l)' }}
              >
                🧮
              </div>
              <div className="feat-name">Hypothetical Net Pay Calculator</div>
              <div className="feat-desc2">
                Simulate a raise, a relocation, adding a dependent, or changing
                your 401(k) contribution. See your exact take-home pay
                instantly before making any decision.
              </div>
              <span className="feat-pill pill-b">Free + Pro</span>
            </div>

            <div className="feat-card2 card-purple reveal">
              <div className="feat-icon2" style={{ background: '#EDE9FE' }}>
                📈
              </div>
              <div className="feat-name">Earnings History and Trends</div>
              <div className="feat-desc2">
                See your full earning history across all jobs and platforms.
                Track how your gross pay and net pay have changed over time
                with clear, visual charts.
              </div>
              <span className="feat-pill pill-p">Pro</span>
            </div>

            {/* WIDE card 2 */}
            <div className="feat-card2 wide card-teal reveal">
              <div className="feat-wide-content">
                <div className="feat-icon2" style={{ background: '#E0F2FE' }}>
                  🗺️
                </div>
                <div className="feat-name">Multi-State Tax Comparison</div>
                <div className="feat-desc2">
                  Moving states? Working remotely? SmartStub models your exact
                  tax impact across all 50 states. See exactly how much more
                  you would take home before you make the move.
                </div>
                <span className="feat-pill pill-p">Pro</span>
              </div>
              <div className="feat-wide-visual">
                <div className="mini-stat-row">
                  <div className="mini-stat">
                    <span className="ms-label">Texas</span>
                    <span className="ms-val green">$63,975 / yr</span>
                  </div>
                  <div className="mini-stat">
                    <span className="ms-label">Florida</span>
                    <span className="ms-val green">$63,825 / yr</span>
                  </div>
                  <div className="mini-stat">
                    <span className="ms-label">New York</span>
                    <span className="ms-val blue">$60,225 / yr</span>
                  </div>
                  <div className="mini-stat">
                    <span className="ms-label">California</span>
                    <span className="ms-val amber">$59,400 / yr</span>
                  </div>
                  <div
                    className="mini-stat"
                    style={{
                      border: '2px solid var(--d2)',
                      background: 'var(--d5)',
                    }}
                  >
                    <span
                      className="ms-label"
                      style={{ color: 'var(--d1)', fontWeight: 700 }}
                    >
                      You save in Texas vs California
                    </span>
                    <span className="ms-val green">+$7,247</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="feat-card2 reveal">
              <div className="feat-icon2" style={{ background: '#FFF1F2' }}>
                🤖
              </div>
              <div className="feat-name">Ask SmartStub AI</div>
              <div className="feat-desc2">
                Ask anything about your paycheck in plain English. "Why was my
                overtime taxed higher?" or "What is Social Security tax used
                for?" Get clear, accurate answers instantly.
              </div>
              <span className="feat-pill pill-b">Free + Pro</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── DASHBOARD ── */}
      <section className="dash-section" id="dashboard">
        <div className="container">
          <div className="dash-grid">
            <div>
              <div className="sec-eye">Your Financial Dashboard</div>
              <h2 className="sec-h2">
                Everything about your money,
                <br />
                <span className="green">in one place.</span>
              </h2>
              <p className="sec-sub">
                Your personalised financial home screen showing your latest
                paycheck, YTD totals, tax breakdown, benefits balance, and
                AI-powered insights, all updated automatically.
              </p>
              <div className="dash-stats reveal">
                <div className="dash-stat s-green">
                  <div className="ds-val green">$23,645</div>
                  <div className="ds-lbl">YTD Gross Pay</div>
                </div>
                <div className="dash-stat s-blue">
                  <div className="ds-val blue">$15,842</div>
                  <div className="ds-lbl">YTD Net Take-Home</div>
                </div>
                <div className="dash-stat s-amber">
                  <div className="ds-val amber">$3,892</div>
                  <div className="ds-lbl">YTD Taxes Paid</div>
                </div>
                <div className="dash-stat s-teal">
                  <div className="ds-val teal">67.6%</div>
                  <div className="ds-lbl">Take-Home Rate</div>
                </div>
              </div>
              <div className="dash-cta reveal">
                <a href="#waitlist" className="btn-filled">
                  View Full Dashboard &rarr;
                </a>
              </div>
            </div>
            <div className="dash-visual reveal">
              <div className="dash-frame">
                <img
                  src="https://bitdlive.com/wp-content/uploads/2026/05/dashboard.png"
                  alt="SmartStub Dashboard"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="ai-float">
                <span className="ai-dot"></span>
                Ask SmartStub AI about your pay
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TAX COMPARISON ── */}
      <section className="tax-section" id="tax">
        <div className="container">
          <div className="tax-grid">
            <div>
              <div className="sec-eye">Multi-State Tax Modeling</div>
              <h2 className="sec-h2">
                Compare Your Tax
                <br />
                <span className="accent">in Different States</span>
              </h2>
              <p className="sec-sub">
                See how much of your hard-earned money you keep depending on
                where you live and work.
              </p>
              <div className="tax-points">
                <div className="tax-pt reveal">
                  <div className="tax-pt-icon tpic-blue">🗂️</div>
                  <div>
                    <div className="tax-pt-title">
                      State-by-State Comparison
                    </div>
                    <div className="tax-pt-desc">
                      Instantly compare income tax, take-home pay, and overall
                      tax burden across any states you choose.
                    </div>
                  </div>
                </div>
                <div className="tax-pt reveal">
                  <div className="tax-pt-icon tpic-green">💰</div>
                  <div>
                    <div className="tax-pt-title">See What You Keep</div>
                    <div className="tax-pt-desc">
                      Know exactly how much more you can take home in lower-tax
                      states, with real numbers and not estimates.
                    </div>
                  </div>
                </div>
                <div className="tax-pt reveal">
                  <div className="tax-pt-icon tpic-purple">🎯</div>
                  <div>
                    <div className="tax-pt-title">Make Smarter Decisions</div>
                    <div className="tax-pt-desc">
                      Use real numbers to plan your move, negotiate your
                      salary, or understand your remote work tax situation.
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="tax-visual-wrap reveal">
              <div className="tax-frame">
                <img
                  src="https://bitdlive.com/wp-content/uploads/2026/05/Compare-Your-Tax.png"
                  alt="Compare Your Tax in Different States"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="tax-savings-badge">
                💵 Keep up to $7,247 more per year in Texas vs. California
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MOBILE APP ── */}
      <section className="mobile-section" id="mobile">
        <div className="mobile-wm">$</div>
        <div className="mobile-glow mg1"></div>
        <div className="mobile-glow mg2"></div>
        <div className="container">
          <div className="mobile-grid">
            <div>
              <div className="mobile-eyebrow">Mobile App</div>
              <h2 className="mobile-h2">
                Your paycheck,
                <br />
                <span className="accent">always in your pocket.</span>
              </h2>
              <p className="mobile-sub">
                Check your latest paycheck, scan a new stub with your camera,
                and ask SmartStub AI anything, all from your phone.
              </p>

              <div className="mobile-feats">
                <div className="mobile-feat reveal">
                  <div className="mf-icon mf-ic1">📷</div>
                  <div>
                    <div className="mf-title">Scan Stub with Camera</div>
                    <div className="mf-desc">
                      Point your camera at any payslip and SmartStub reads it
                      instantly with no typing needed.
                    </div>
                  </div>
                </div>
                <div className="mobile-feat reveal">
                  <div className="mf-icon mf-ic2">💬</div>
                  <div>
                    <div className="mf-title">Ask SmartStub AI</div>
                    <div className="mf-desc">
                      "Why was my overtime taxed higher?" Get plain-English
                      answers to any paycheck question, anytime.
                    </div>
                  </div>
                </div>
                <div className="mobile-feat reveal">
                  <div className="mf-icon mf-ic3">🔔</div>
                  <div>
                    <div className="mf-title">Payday Notifications</div>
                    <div className="mf-desc">
                      Get notified the moment your paycheck is ready with a full
                      net pay summary and any error alerts.
                    </div>
                  </div>
                </div>
              </div>

              <div className="app-badges reveal">
                <div className="app-badge">
                  <div className="badge-icon"></div>
                  <div className="badge-info">
                    <div className="badge-soon">Coming Soon</div>
                    <div className="badge-store">App Store (iOS)</div>
                  </div>
                </div>
                <div className="app-badge">
                  <div className="badge-icon">🤖</div>
                  <div className="badge-info">
                    <div className="badge-soon">Coming Soon</div>
                    <div className="badge-store">Google Play (Android)</div>
                  </div>
                </div>
              </div>
              <p
                style={{
                  fontSize: '.78rem',
                  color: 'rgba(255,255,255,.38)',
                  marginTop: '12px',
                }}
              >
                Mobile apps for both iOS and Android are currently in
                development and will be launching soon.
              </p>
            </div>

            <div className="mobile-visual reveal">
              <div className="mobile-phone-wrap">
                <div className="phone-glow"></div>
                <img
                  src="https://bitdlive.com/wp-content/uploads/2026/05/mobile-app.png"
                  alt="SmartStub Mobile App"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── GET EARLY ACCESS / WAITLIST ── */}
      <section className="cta-section" id="waitlist">
        <div className="cta-bg-dollar cbd1">$</div>
        <div className="cta-bg-dollar cbd2">$</div>

        <div className="cta-inner">
          <div className="cta-badge">
            <span>✦</span> Get Early Access
          </div>
          <h2 className="cta-h2">
            Your paycheck
            <br />
            shouldn't be a <span className="accent">mystery.</span>
          </h2>
          <p className="cta-sub">
            Join thousands of workers taking control of their earnings with
            SmartStub. Early access is completely free and no credit card is
            required.
          </p>

          <form
            className="waitlist-form"
            id="waitlistForm"
            onSubmit={handleSubmit}
          >
            <input
              type="email"
              id="emailInput"
              className="waitlist-email"
              placeholder="Enter your email address"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit" className="waitlist-submit">
              Join Waitlist &rarr;
            </button>
          </form>

          <div
            className="confirmed-msg"
            id="confirmedMsg"
            style={{ display: confirmed ? 'flex' : 'none' }}
          >
            ✓ &nbsp;You're on the list! We'll be in touch when we launch.
          </div>

          <p className="cta-privacy">
            🔒 &nbsp;We respect your privacy. No spam, ever. Unsubscribe
            anytime.
          </p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer>
        <div className="footer-logo">
          <img
            src="https://bitdlive.com/wp-content/uploads/2026/05/logo.png"
            alt="SmartStub"
          />
        </div>
        <div className="footer-copy">&copy; 2026 SmartStub, Inc. All rights reserved.</div>
        <div className="footer-trust">
          <span className="ft-icon">🔒</span>
          <span>
            Bank-level encryption &nbsp;·&nbsp; Your data is always private and
            secure
          </span>
        </div>
      </footer>
    </>
  );
};

export default SmartStubLanding;