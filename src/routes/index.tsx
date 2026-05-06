import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'

export const Route = createFileRoute('/')({
  component: PrimeFXPage,
})

const tickerPairs = [
  { sym: 'EUR/USD', bid: '1.08421', chg: '+0.12%', up: true },
  { sym: 'GBP/USD', bid: '1.26884', chg: '-0.08%', up: false },
  { sym: 'USD/JPY', bid: '154.220', chg: '+0.21%', up: true },
  { sym: 'XAU/USD', bid: '2,321.50', chg: '+0.44%', up: true },
  { sym: 'BTC/USD', bid: '62,840', chg: '-1.10%', up: false },
  { sym: 'US30', bid: '38,412', chg: '+0.33%', up: true },
  { sym: 'WTI/USD', bid: '78.44', chg: '-0.22%', up: false },
  { sym: 'USD/CHF', bid: '0.91203', chg: '+0.05%', up: true },
  { sym: 'AUD/USD', bid: '0.64812', chg: '-0.14%', up: false },
  { sym: 'NAS100', bid: '17,840', chg: '+0.55%', up: true },
]

function useCounterAnimation(target: number, suffix?: string, prefix?: string) {
  const [value, setValue] = useState('0')
  const ref = useRef<HTMLSpanElement>(null)
  const animated = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated.current) {
          animated.current = true
          const duration = 1800
          const start = performance.now()
          const update = (now: number) => {
            const t = Math.min((now - start) / duration, 1)
            const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
            const val = Math.round(ease * target)
            if (suffix === 'K' && target >= 1000) {
              setValue((prefix ?? '') + (val >= 1000 ? (val / 1000).toFixed(0) + 'K+' : String(val)))
            } else {
              setValue((prefix ?? '') + val.toLocaleString() + (suffix ?? ''))
            }
            if (t < 1) requestAnimationFrame(update)
            else {
              setValue(
                (prefix ?? '') +
                  (suffix === 'K' && target >= 1000
                    ? (target / 1000).toFixed(0) + 'K+'
                    : target.toLocaleString()) +
                  (suffix !== 'K' ? (suffix ?? '') : ''),
              )
            }
          }
          requestAnimationFrame(update)
        }
      },
      { threshold: 0.4 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [target, suffix, prefix])

  return { ref, value }
}

function StatBox({ target, label, suffix, prefix, delay }: { target: number; label: string; suffix?: string; prefix?: string; delay?: string }) {
  const { ref, value } = useCounterAnimation(target, suffix, prefix)
  return (
    <div className={`stat-box fade-in${delay ? ` ${delay}` : ''}`}>
      <span className="stat-num" ref={ref}>{value}</span>
      <span className="stat-label">{label}</span>
    </div>
  )
}

function useFadeIn() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.12 },
    )
    document.querySelectorAll('.fade-in').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])
}

function ServeChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.width = canvas.offsetWidth || 300
    canvas.height = 180
    const ctx = canvas.getContext('2d')!
    const pts = [40,80,55,90,65,105,70,95,85,115,90,108,100,130,110,120,125,140,135,128,145,155,155,145,170,170]
    const w = canvas.width, h = canvas.height
    const xs = pts.filter((_, i) => i % 2 === 0)
    const ys = pts.filter((_, i) => i % 2 === 1)
    const minX = Math.min(...xs), maxX = Math.max(...xs)
    const minY = Math.min(...ys), maxY = Math.max(...ys)
    const scaleX = (x: number) => ((x - minX) / (maxX - minX)) * (w - 20) + 10
    const scaleY = (y: number) => h - ((y - minY) / (maxY - minY)) * (h - 20) - 10
    const grad = ctx.createLinearGradient(0, 0, 0, h)
    grad.addColorStop(0, 'rgba(201,168,76,0.18)')
    grad.addColorStop(1, 'rgba(201,168,76,0)')
    ctx.beginPath()
    ctx.moveTo(scaleX(xs[0]), scaleY(ys[0]))
    for (let i = 1; i < xs.length; i++) ctx.lineTo(scaleX(xs[i]), scaleY(ys[i]))
    ctx.lineTo(scaleX(xs[xs.length - 1]), h)
    ctx.lineTo(scaleX(xs[0]), h)
    ctx.closePath()
    ctx.fillStyle = grad
    ctx.fill()
    ctx.beginPath()
    ctx.moveTo(scaleX(xs[0]), scaleY(ys[0]))
    for (let i = 1; i < xs.length; i++) ctx.lineTo(scaleX(xs[i]), scaleY(ys[i]))
    ctx.strokeStyle = '#C9A84C'
    ctx.lineWidth = 2
    ctx.stroke()
  }, [])
  return <canvas ref={canvasRef} className="serve-visual-chart" />
}

const serveClients = [
  {
    title: 'Brokers',
    body: 'GTC Prime offers a flexible, customised end-to-end broker solution that aligns with your risk strategy. Integrated with liquidity/prime of prime and advanced risk management analytics, our STP/ECN models deliver significantly improved spreads and much lower fees.',
  },
  {
    title: 'Hedge Funds & Asset Managers',
    body: 'Our tools create a prime performance experience across the board. With a diversified portfolio of multiple asset classes, Tier 1 bank liquidity, and unmatched support, our clients experience a reliable and trusted relationship enabling safe, secure and optimised pricing.',
  },
  {
    title: 'Professional Clients',
    body: 'Experience efficient trading via a single platform — institutional pricing backed by competitive margins, attractive commissions, and segregated accounts for funds. Our bespoke solutions drive your portfolio forward, perfectly matched to your needs.',
  },
  {
    title: 'Exchanges & MTFs',
    body: 'We work with exchanges and multilateral trading facilities requiring deep liquidity, robust API connectivity, and scalable infrastructure. Our technology integrates seamlessly with your existing systems for maximum uptime and minimum latency.',
  },
]

const offerPanels = [
  {
    tab: 'Liquidity',
    title: 'Institutional Liquidity Solutions',
    body: 'At GTC Prime, we offer liquidity solutions customised to meet your specific needs and goals. Our technology-driven approach serves clients worldwide — including hedge funds, brokers, exchanges, and professional clients.',
    points: [
      'Multi-asset liquidity across 27,000+ instruments',
      'Aggregated Tier 1 and Tier 2 pricing',
      'Customisable margin and credit facilities',
      '24/7 dedicated liquidity desk support',
      'STP, ECN, and Market Maker configurations',
    ],
    diagram: (
      <>
        <div className="od-node gold">Tier 1 Liquidity Pool</div>
        <div className="od-connector" />
        <div className="od-node">Prime Aggregation Engine</div>
        <div className="od-connector" />
        <div className="od-row">
          <div className="od-node">Broker</div>
          <div className="od-node">Hedge Fund</div>
          <div className="od-node">Pro Client</div>
        </div>
      </>
    ),
  },
  {
    tab: 'Connectivity',
    title: 'Reliable Connectivity Solutions',
    body: 'Connectivity is an essential element of successful trading. We offer reliable, fast connectivity solutions connecting our clients to the world\'s financial markets. Speed and low latency are paramount — we partner with leading technology providers to deliver cutting-edge solutions.',
    points: [
      'FIX 4.2, 4.4 and 5.0 protocol support',
      'Co-location in LD4, NY4, TY3 data centres',
      'Sub-millisecond execution speeds',
      'REST & WebSocket API access',
      '99.99% uptime SLA guaranteed',
    ],
    diagram: (
      <>
        <div className="od-node gold">Global Data Centres</div>
        <div className="od-connector" />
        <div className="od-row">
          <div className="od-node">London LD4</div>
          <div className="od-node">New York NY4</div>
          <div className="od-node">Tokyo TY3</div>
        </div>
        <div className="od-connector" />
        <div className="od-node">Your Platform (FIX / API / MT4 / MT5)</div>
      </>
    ),
  },
  {
    tab: 'Risk Solutions',
    title: 'Advanced Risk Management',
    body: "Our in-house risk management suite gives you full visibility and control over exposure, P&L, and hedging in real time. Built for the demands of prime brokerage, it handles high-volume environments without compromise.",
    points: [
      'Real-time P&L and exposure monitoring',
      'Automated hedging and netting engines',
      'Customisable margin call thresholds',
      'Full audit trail and reporting suite',
      'Credit risk analytics dashboard',
    ],
    diagram: (
      <>
        <div className="od-node gold">Risk Management Engine</div>
        <div className="od-connector" />
        <div className="od-row">
          <div className="od-node">Exposure Monitor</div>
          <div className="od-node">Auto Hedging</div>
        </div>
        <div className="od-connector" />
        <div className="od-node">Real-Time Alerts & Reporting</div>
      </>
    ),
  },
]

function PrimeFXPage() {
  useFadeIn()
  const [activeServe, setActiveServe] = useState(0)
  const [activeTab, setActiveTab] = useState(0)
  const [formState, setFormState] = useState({ submitted: false })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFormState({ submitted: true })
    setTimeout(() => setFormState({ submitted: false }), 3000)
  }

  return (
    <>
      {/* NAV */}
      <nav>
        <a href="#" className="nav-logo">PRIME<span>FX</span></a>
        <ul className="nav-links">
          <li><a href="#about">About</a></li>
          <li><a href="#serve">Who We Serve</a></li>
          <li><a href="#offer">What We Offer</a></li>
          <li><a href="#technology">Technology</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
        <div className="nav-ctas">
          <a href="#" className="btn-ghost">Member Login</a>
          <a href="#contact" className="btn-gold">Open Account</a>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero" id="home">
        <div className="hero-bg" />
        <div className="hero-grid" />
        <div className="hero-content">
          <div className="hero-eyebrow">Liquidity | Connectivity | Risk Solutions</div>
          <h1>Access To 8 Asset Markets With Over <em>27,000</em> Instruments</h1>
          <div className="hero-divider" />
          <p className="hero-sub">Advanced infrastructure and pricing sourced directly from Tier 1 banks, with DMA execution built for the demands of institutional and professional traders.</p>
          <div className="hero-actions">
            <a href="#contact" className="btn-primary">Open Live Account</a>
            <a href="#offer" className="btn-outline">Explore Solutions</a>
          </div>
        </div>
        <div className="hero-stats">
          <div className="hero-stat-item">
            <span className="hero-stat-num">500+</span>
            <span className="hero-stat-label">Clients Served</span>
          </div>
          <div className="hero-stat-item">
            <span className="hero-stat-num">27K+</span>
            <span className="hero-stat-label">Instruments</span>
          </div>
          <div className="hero-stat-item">
            <span className="hero-stat-num">$4B</span>
            <span className="hero-stat-label">Monthly Trades</span>
          </div>
        </div>
      </section>

      {/* TICKER */}
      <div className="ticker">
        <div className="ticker-inner">
          {[...tickerPairs, ...tickerPairs].map((p, i) => (
            <div className="ticker-item" key={i}>
              <span className="sym">{p.sym}</span>
              <span>{p.bid}</span>
              <span className={p.up ? 'up' : 'dn'}>{p.chg}</span>
            </div>
          ))}
        </div>
      </div>

      {/* WHY CHOOSE */}
      <section className="why-section" id="about">
        <div className="section-tag">Our Edge</div>
        <div className="section-title">Why Choose <em>Prime</em> Liquidity</div>
        <p className="section-body">We combine institutional-grade infrastructure with personalised support to deliver a seamless trading experience.</p>
        <div className="why-grid">
          {[
            {
              icon: <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"/></svg>,
              title: 'Trusted Partner',
              body: 'Regulated, transparent, and built on years of delivering institutional-grade reliability to brokers and professional traders worldwide.',
            },
            {
              icon: <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941"/></svg>,
              title: 'Competitive Pricing',
              body: 'Tight raw spreads sourced from a deep pool of Tier 1 liquidity providers, passed directly to you with no hidden markups.',
            },
            {
              icon: <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"/></svg>,
              title: 'Low Latency Execution',
              body: 'Co-located matching engines and optimised routing ensure your orders hit the market in microseconds, not milliseconds.',
            },
            {
              icon: <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375"/></svg>,
              title: 'Deep Liquidity',
              body: 'Access up to 10 levels of market depth across forex, metals, commodities, indices, and crypto CFDs from a single platform.',
            },
            {
              icon: <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0l4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0l-5.571 3-5.571-3"/></svg>,
              title: 'In-House Technology',
              body: 'Proprietary risk management tools, analytics dashboards, and API integrations developed by our internal engineering team.',
            },
            {
              icon: <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"/></svg>,
              title: 'Comprehensive Solutions',
              body: 'From onboarding to ongoing support — complete end-to-end solutions tailored to brokers, hedge funds, and professional clients.',
            },
          ].map((card, i) => (
            <div key={card.title} className={`why-card fade-in${i > 0 ? ` delay-${i}` : ''}`}>
              <div className="why-icon">{card.icon}</div>
              <h3>{card.title}</h3>
              <p>{card.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* WHO WE SERVE */}
      <section className="serve-section" id="serve">
        <div className="section-tag">Clients</div>
        <div className="section-title">Who We <em>Serve</em></div>
        <p className="section-body">Advanced infrastructure and comprehensive expertise — tailored pricing with DMA execution for every client type.</p>
        <div className="serve-layout">
          <div className="serve-cards">
            {serveClients.map((client, i) => (
              <div
                key={client.title}
                className={`serve-card${activeServe === i ? ' active' : ''}`}
                onClick={() => setActiveServe(i)}
              >
                <div className="serve-card-head">
                  {client.title}
                  <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/></svg>
                </div>
                <div className="serve-card-body">{client.body}</div>
              </div>
            ))}
          </div>
          <div className="serve-visual">
            <div className="serve-visual-bg" />
            <ServeChart />
            <div className="serve-visual-label">Tier 1</div>
            <div className="serve-visual-sub">Liquidity Source</div>
          </div>
        </div>
      </section>

      {/* DIRECT ACCESS */}
      <section className="access-section" id="technology">
        <div className="access-layout">
          <div>
            <div className="section-tag">Infrastructure</div>
            <div className="section-title">Direct Access to <em>Top Tier</em> Liquidity</div>
            <p className="section-body">Trade efficiently at low costs with fast execution. Our state-of-the-art technology ensures your trades remain private, transparent, and reliable.</p>
            <div className="access-features">
              {[
                'Low Spreads & Commissions',
                'Ultra Fast Execution',
                '10 Levels of Market Depth',
                'Quick Integration',
                'Ultra Fast Price Feeds',
                'Fast Onboarding',
              ].map((feat) => (
                <div className="access-feat" key={feat}>
                  <div className="access-feat-dot" />
                  <span className="access-feat-text">{feat}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="access-visual">
            <div className="access-visual-bg" />
            <div className="access-visual-content">
              <div className="access-badge">Live Liquidity Stack</div>
              <h3>Prime of Prime Architecture</h3>
              <p>Our multi-layered liquidity model aggregates from the world's largest financial institutions, delivering best-bid and best-offer across all asset classes.</p>
              <div className="access-tiers">
                {[
                  { rank: 'T1', label: 'Global Tier 1 Banks & Prime Brokers', width: '95%' },
                  { rank: 'T2', label: 'Regional Banks & Non-Bank Providers', width: '75%' },
                  { rank: 'T3', label: 'ECN Venues & Dark Pools', width: '55%' },
                  { rank: 'You', label: 'Your Trading Infrastructure', width: '100%', gold: true },
                ].map((tier) => (
                  <div className="access-tier" key={tier.rank}>
                    <span className="tier-rank" style={tier.gold ? { color: 'var(--text)' } : undefined}>{tier.rank}</span>
                    <span>{tier.label}</span>
                    <div className="tier-bar">
                      <div className="tier-fill" style={{ width: tier.width, ...(tier.gold ? { background: 'var(--gold)' } : {}) }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT WE OFFER */}
      <section className="offer-section" id="offer">
        <div className="section-tag">Solutions</div>
        <div className="section-title">What We <em>Offer</em></div>
        <div className="offer-tabs">
          {offerPanels.map((panel, i) => (
            <div
              key={panel.tab}
              className={`offer-tab${activeTab === i ? ' active' : ''}`}
              onClick={() => setActiveTab(i)}
            >
              {panel.tab}
            </div>
          ))}
        </div>
        <div className="offer-panels">
          {offerPanels.map((panel, i) => (
            <div key={panel.tab} className={`offer-panel${activeTab === i ? ' active' : ''}`}>
              <div className="offer-panel-text">
                <h3>{panel.title}</h3>
                <p>{panel.body}</p>
                <div className="offer-points">
                  {panel.points.map((pt) => (
                    <div className="offer-point" key={pt}>{pt}</div>
                  ))}
                </div>
              </div>
              <div className="offer-visual">
                <div className="offer-visual-bg" />
                <div className="offer-diagram">{panel.diagram}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* STATS */}
      <div className="stats-section">
        <div className="stats-grid">
          <StatBox target={500} label="Clients Served" />
          <StatBox target={27000} label="Trading Instruments" suffix="K" delay="delay-1" />
          <StatBox target={40} label="Destinations Worldwide" delay="delay-2" />
          <StatBox target={4} label="Monthly Trade Volume" prefix="$" suffix="B" delay="delay-3" />
        </div>
      </div>

      {/* CONTACT */}
      <section className="contact-section" id="contact">
        <div className="section-tag">Get Started</div>
        <div className="section-title">Open an <em>Account</em></div>
        <div className="contact-layout">
          <div>
            <p className="section-body" style={{ marginBottom: 40 }}>
              Ready to access institutional-grade liquidity? Get in touch with our team and we'll have you up and running in no time.
            </p>
            <div className="contact-info">
              <div className="contact-item">
                <div className="contact-item-icon">
                  <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"/></svg>
                </div>
                <div>
                  <div className="contact-item-label">Phone</div>
                  <div className="contact-item-val">+1 800 000 0000</div>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-item-icon">
                  <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"/></svg>
                </div>
                <div>
                  <div className="contact-item-label">Email</div>
                  <div className="contact-item-val">support@yourdomain.com</div>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-item-icon">
                  <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </div>
                <div>
                  <div className="contact-item-label">Hours</div>
                  <div className="contact-item-val">24 / 7 Support</div>
                </div>
              </div>
            </div>
          </div>
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>First Name</label>
                <input type="text" placeholder="John" />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input type="text" placeholder="Doe" />
              </div>
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" placeholder="john@company.com" />
            </div>
            <div className="form-group">
              <label>I Am A</label>
              <select defaultValue="">
                <option value="" disabled>Select client type</option>
                <option>Broker</option>
                <option>Hedge Fund</option>
                <option>Professional Client</option>
                <option>Exchange / MTF</option>
                <option>Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Message</label>
              <textarea placeholder="Tell us about your trading needs..." />
            </div>
            <button
              type="submit"
              className="form-submit"
              style={formState.submitted ? { background: '#4CAF89' } : undefined}
            >
              {formState.submitted ? 'Enquiry Sent!' : 'Submit Enquiry'}
            </button>
          </form>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-top">
          <div>
            <span className="footer-brand-name">PRIMEFX</span>
            <p className="footer-tagline">Institutional-grade liquidity, connectivity, and risk solutions for the modern trading world.</p>
            <div className="footer-socials">
              {['f', 'in', 'X', '▶', 't'].map((s) => (
                <a key={s} href="#" className="footer-social">{s}</a>
              ))}
            </div>
          </div>
          <div>
            <div className="footer-col-title">Company</div>
            <ul className="footer-links">
              {['About Us', 'Why Us', 'Global Presence', 'Awards', 'Careers', 'Contact'].map((l) => (
                <li key={l}><a href={l === 'Contact' ? '#contact' : '#'}>{l}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <div className="footer-col-title">Trading</div>
            <ul className="footer-links">
              {['Forex CFDs', 'Metal CFDs', 'Commodity CFDs', 'Index CFDs', 'Energy CFDs', 'Crypto CFDs'].map((l) => (
                <li key={l}><a href="#">{l}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <div className="footer-col-title">Prime & Tech</div>
            <ul className="footer-links">
              {['Liquidity & Technology', 'Copy Trading', 'PAMM Account', 'MAM Account', 'VPS Servers', 'API Access'].map((l) => (
                <li key={l}><a href="#">{l}</a></li>
              ))}
            </ul>
          </div>
        </div>
        <p className="footer-legal">Risk Warning: Investing in derivative products carries significant risks and may not be suitable for all investors. The use of leverage can increase both the level of risk and potential for losses. Before engaging in trading, carefully consider your investment objectives, experience, and risk tolerance. You should only invest funds you can afford to lose.</p>
        <div className="footer-bottom">
          <span>© 2026 PrimeFX — All Rights Reserved</span>
          <span>Regulated Financial Services Provider</span>
        </div>
      </footer>
    </>
  )
}
