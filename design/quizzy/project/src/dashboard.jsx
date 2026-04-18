// Dashboard — shows profile, progress over time, past sessions, daily check-in
const { useState: uSD } = React;

const DashboardScreen = ({ analysis, onNewSession, onBack, onMoodCheckin }) => {
  const a = analysis || window.MindfulSeed.fallbackAnalysis;
  const past = window.MindfulSeed.pastSessions;
  // Fake 90-day trend data for "Ketenangan" dimension
  const trend = [52, 48, 54, 60, 57, 62, 58, 65, 63, 68, 66, 70, 68, 72, a.dimensions.ketenangan];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)', fontFamily: 'Inter, sans-serif' }}>
      <header style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '22px 40px', borderBottom: '1px solid var(--line)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <WordmarkMark size={20} />
          <span style={{ fontFamily: 'Fraunces, serif', fontSize: 14 }}>Dashboard</span>
        </div>
        <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
          <QuietLink onClick={onBack}>Beranda</QuietLink>
          <PrimaryButton onClick={onNewSession} style={{ padding: '9px 18px', fontSize: 13 }}>
            + Sesi refleksi baru
          </PrimaryButton>
        </div>
      </header>

      <main style={{ maxWidth: 1080, margin: '0 auto', padding: '48px 40px 80px' }}>
        {/* Greeting */}
        <div style={{ marginBottom: 44 }}>
          <p style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--ink-muted)', margin: 0 }}>
            Jumat, 18 April 2026
          </p>
          <h1 style={{
            fontFamily: 'Fraunces, serif', fontWeight: 300, fontSize: 56,
            letterSpacing: '-0.03em', lineHeight: 1.05, margin: '14px 0 0',
          }}>
            Selamat pagi. <em style={{ fontStyle: 'italic', color: 'var(--primary-deep)' }}>Pelan-pelan saja.</em>
          </h1>
        </div>

        {/* Check-in card */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20,
        }}>
          <div style={{
            padding: 32, borderRadius: 22, background: 'var(--primary-soft)',
            border: '1px solid color-mix(in oklab, var(--primary) 22%, transparent)',
          }}>
            <div style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--primary-deep)' }}>
              Check-in singkat · 30 detik
            </div>
            <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: 26, fontWeight: 400, margin: '14px 0 18px', letterSpacing: '-0.01em' }}>
              Bagaimana kamu pagi ini?
            </h3>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {['Tenang', 'Biasa saja', 'Bergejolak', 'Lelah', 'Ringan', 'Cemas'].map(m => (
                <button key={m} onClick={onMoodCheckin} style={{
                  appearance: 'none', border: '1px solid color-mix(in oklab, var(--primary-deep) 30%, transparent)',
                  background: 'var(--bg-raised)', color: 'var(--ink)', padding: '10px 16px',
                  borderRadius: 999, fontFamily: 'Inter, sans-serif', fontSize: 14, cursor: 'pointer',
                  transition: 'all 400ms',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg)'}
                onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-raised)'}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div style={{
            padding: 32, borderRadius: 22, background: 'var(--bg-raised)',
            border: '1px solid var(--line)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          }}>
            <div>
              <div style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>
                Profil terkini
              </div>
              <h3 style={{
                fontFamily: 'Fraunces, serif', fontSize: 34, fontWeight: 300, margin: '14px 0 6px',
                letterSpacing: '-0.02em',
              }}>
                <em style={{ fontStyle: 'italic', color: 'var(--primary-deep)' }}>{a.archetype}</em>
              </h3>
              <p style={{ color: 'var(--ink-soft)', fontSize: 14, lineHeight: 1.55, margin: 0 }}>
                {a.subtitle}
              </p>
            </div>
            <div style={{ marginTop: 18, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {a.themes.map((t, i) => (
                <span key={i} style={{
                  fontSize: 12, padding: '5px 11px', borderRadius: 999,
                  background: 'var(--accent-soft)', color: 'var(--accent-deep)',
                }}>{t.label}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Trend */}
        <div style={{
          marginTop: 20, padding: 32, borderRadius: 22,
          background: 'var(--bg-raised)', border: '1px solid var(--line)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 28 }}>
            <div>
              <div style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>
                Perkembangan ketenangan
              </div>
              <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: 28, fontWeight: 300, margin: '10px 0 0', letterSpacing: '-0.01em' }}>
                90 hari terakhir
              </h3>
            </div>
            <div style={{ fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontSize: 16, color: 'var(--ink-soft)', maxWidth: 340, textAlign: 'right', lineHeight: 1.5 }}>
              "Kamu terlihat lebih tenang dibanding bulan lalu. Ini bukan kebetulan."
            </div>
          </div>

          {/* Line chart */}
          <svg viewBox="0 0 800 200" style={{ width: '100%', height: 200, overflow: 'visible' }}>
            {[40, 80, 120, 160].map(y => (
              <line key={y} x1="0" y1={y} x2="800" y2={y} stroke="var(--line-soft)" strokeWidth="1" />
            ))}
            {(() => {
              const pts = trend.map((v, i) => [i * (800 / (trend.length - 1)), 200 - (v / 100) * 180]);
              const d = pts.map((p, i) => (i === 0 ? `M${p[0]},${p[1]}` : `L${p[0]},${p[1]}`)).join(' ');
              const area = d + ` L800,200 L0,200 Z`;
              return (
                <>
                  <path d={area} fill="var(--primary-soft)" opacity="0.6" />
                  <path d={d} stroke="var(--primary-deep)" strokeWidth="2" fill="none" strokeLinecap="round" />
                  {pts.map(([x, y], i) => (
                    <circle key={i} cx={x} cy={y} r={i === pts.length - 1 ? 6 : 3} fill="var(--primary-deep)" />
                  ))}
                </>
              );
            })()}
          </svg>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--ink-muted)', marginTop: 10 }}>
            <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr (hari ini)</span>
          </div>
        </div>

        {/* Past sessions + active recs */}
        <div style={{
          marginTop: 20, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20,
        }}>
          <div style={{
            padding: 32, borderRadius: 22, background: 'var(--bg-raised)', border: '1px solid var(--line)',
          }}>
            <div style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: 20 }}>
              Riwayat sesi
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {[...past, { date: '18 Apr', archetype: a.archetype, tone: 'tenang', dim: a.dimensions.ketenangan, now: true }].map((s, i) => (
                <li key={i} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '16px 0', borderBottom: i < past.length ? '1px solid var(--line-soft)' : 'none',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <span style={{
                      width: 8, height: 8, borderRadius: '50%',
                      background: s.now ? 'var(--accent)' : 'var(--primary)',
                    }} />
                    <div>
                      <div style={{ fontFamily: 'Fraunces, serif', fontSize: 17, fontWeight: 400, letterSpacing: '-0.005em' }}>
                        {s.archetype} {s.now && <span style={{ fontSize: 11, color: 'var(--accent-deep)', marginLeft: 6, fontStyle: 'italic' }}>baru saja</span>}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--ink-muted)', marginTop: 2 }}>
                        {s.date} · nada {s.tone}
                      </div>
                    </div>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--ink-soft)', fontVariantNumeric: 'tabular-nums' }}>
                    {s.dim}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div style={{
            padding: 32, borderRadius: 22, background: 'var(--accent-soft)',
            border: '1px solid color-mix(in oklab, var(--accent) 22%, transparent)',
          }}>
            <div style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--accent-deep)', marginBottom: 20 }}>
              Rekomendasi aktif
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {a.recommendations.slice(0, 3).map((r, i) => (
                <li key={i} style={{
                  padding: '16px 0', borderBottom: i < 2 ? '1px solid color-mix(in oklab, var(--accent-deep) 12%, transparent)' : 'none',
                  display: 'flex', alignItems: 'flex-start', gap: 14,
                }}>
                  <input type="checkbox" style={{
                    marginTop: 4, accentColor: 'var(--accent-deep)', width: 16, height: 16,
                  }} />
                  <div>
                    <div style={{ fontFamily: 'Fraunces, serif', fontSize: 17, fontWeight: 400, color: 'var(--ink)', letterSpacing: '-0.005em' }}>
                      {r.title}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--ink-soft)', marginTop: 4 }}>
                      {r.kind}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Gentle reminder */}
        <div style={{
          marginTop: 36, padding: '28px 32px', borderRadius: 18,
          border: '1px dashed var(--line)', display: 'flex', gap: 20, alignItems: 'center',
        }}>
          <div style={{
            flexShrink: 0, width: 44, height: 44, borderRadius: '50%',
            background: 'var(--bg-sunken)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <BreathDot size={10} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'Fraunces, serif', fontSize: 17, fontWeight: 400, marginBottom: 4, color: 'var(--ink)' }}>
              Butuh bicara dengan seseorang?
            </div>
            <div style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.55 }}>
              Mindful AI bukan pengganti terapi. Kalau kamu ingin bantuan profesional, kami bisa rujukkan.
            </div>
          </div>
          <button style={{
            appearance: 'none', border: '1px solid var(--line)', background: 'var(--bg-raised)',
            color: 'var(--ink)', padding: '10px 18px', borderRadius: 999,
            fontSize: 13, fontFamily: 'Inter, sans-serif', cursor: 'pointer',
          }}>Cari profesional</button>
        </div>
      </main>
    </div>
  );
};

Object.assign(window, { DashboardScreen });
