// Landing + Onboarding + Ritual Pembuka
// Fraunces for editorial moments; Inter for UI.

const { useState: useStateL, useEffect: useEffectL } = React;

const WordmarkMark = ({ size = 28 }) => (
  // Not a logo — a simple two-overlapping-circle symbol = meeting place of you + you
  <svg width={size} height={size} viewBox="0 0 32 32">
    <circle cx="12" cy="16" r="9" fill="none" stroke="var(--primary-deep)" strokeWidth="1.6" />
    <circle cx="20" cy="16" r="9" fill="none" stroke="var(--accent-deep)" strokeWidth="1.6" />
  </svg>
);

const LandingScreen = ({ onStart, onToDashboard, hasHistory }) => {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)' }}>
      {/* Top nav */}
      <nav
        style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '26px 48px', fontFamily: 'Inter, sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <WordmarkMark />
          <span style={{ fontFamily: 'Fraunces, serif', fontSize: 20, fontWeight: 400, letterSpacing: '-0.015em' }}>
            Mindful <em style={{ fontStyle: 'italic' }}>AI</em>
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 28, fontSize: 14, color: 'var(--ink-soft)' }}>
          <a style={{ color: 'inherit', textDecoration: 'none' }}>Cara kerja</a>
          <a style={{ color: 'inherit', textDecoration: 'none' }}>Keamanan & privasi</a>
          <a style={{ color: 'inherit', textDecoration: 'none' }}>Untuk profesional</a>
          {hasHistory && (
            <QuietLink onClick={onToDashboard} style={{ color: 'var(--ink)' }}>Dashboard-ku</QuietLink>
          )}
          <PrimaryButton ghost onClick={onStart} style={{ padding: '10px 20px', fontSize: 14 }}>Masuk</PrimaryButton>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ padding: '40px 48px 80px', maxWidth: 1180, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 64, alignItems: 'center' }}>
          <div>
            <div
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                padding: '7px 14px', borderRadius: 999, background: 'var(--primary-soft)',
                fontFamily: 'Inter, sans-serif', fontSize: 12, color: 'var(--primary-deep)',
                letterSpacing: '0.04em', marginBottom: 28,
              }}
            >
              <BreathDot size={8} color="var(--primary-deep)" />
              Untuk kamu yang ingin mengenal dirimu lebih dalam
            </div>
            <h1
              style={{
                fontFamily: 'Fraunces, serif',
                fontWeight: 300,
                fontSize: 72,
                lineHeight: 1.02,
                letterSpacing: '-0.03em',
                margin: 0,
              }}
            >
              Ruang refleksi<br/>
              yang <em style={{ fontStyle: 'italic', color: 'var(--primary-deep)' }}>mendengarkanmu</em><br/>
              kembali.
            </h1>
            <p
              style={{
                marginTop: 28, maxWidth: 480,
                fontFamily: 'Inter, sans-serif', fontSize: 17, lineHeight: 1.6, color: 'var(--ink-soft)',
              }}
            >
              Mindful AI adalah teman refleksi pribadi. Setiap pertanyaan dibuat khusus untukmu,
              berdasarkan caramu bercerita — bukan template yang sama untuk jutaan orang.
            </p>

            <div style={{ display: 'flex', gap: 14, marginTop: 34, alignItems: 'center' }}>
              <PrimaryButton onClick={onStart}>Mulai sesi refleksi →</PrimaryButton>
              <span style={{ fontSize: 13, color: 'var(--ink-muted)', fontFamily: 'Inter, sans-serif' }}>
                Sekitar 8 menit · gratis · bisa berhenti kapan saja
              </span>
            </div>

            <p style={{ marginTop: 42, fontSize: 12, color: 'var(--ink-muted)', fontFamily: 'Inter, sans-serif', maxWidth: 440 }}>
              Mindful AI bukan pengganti terapi profesional. Jika kamu sedang dalam krisis,
              kamu bisa menghubungi <u style={{ textDecorationColor: 'var(--line)' }}>Into The Light Indonesia</u> atau
              layanan Kementerian Kesehatan 119 ext. 8.
            </p>
          </div>

          {/* Right-side illustration: concentric breathing circles + sample question card */}
          <div style={{ position: 'relative', height: 480 }}>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {[380, 300, 220, 140].map((s, i) => (
                <div key={s} style={{
                  position: 'absolute', width: s, height: s, borderRadius: '50%',
                  border: '1px solid var(--line)',
                  background: i === 3 ? 'var(--primary-soft)' : 'transparent',
                  animation: `mindfulBreathe ${7 + i}s ease-in-out ${i * 0.4}s infinite`,
                }} />
              ))}
            </div>
            <div
              style={{
                position: 'absolute', right: -8, top: 60, width: 300,
                background: 'var(--bg-raised)', border: '1px solid var(--line)',
                borderRadius: 18, padding: 22, boxShadow: '0 20px 60px -30px rgba(0,0,0,0.15)',
                fontFamily: 'Inter, sans-serif',
                transform: 'rotate(-2deg)',
              }}
            >
              <div style={{ fontSize: 11, color: 'var(--ink-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>
                Pertanyaan 4 dari 10
              </div>
              <p style={{ fontFamily: 'Fraunces, serif', fontSize: 20, lineHeight: 1.35, margin: 0, fontWeight: 400 }}>
                "Kalau perasaan itu punya suara, apa yang ia bisikkan padamu?"
              </p>
            </div>
            <div
              style={{
                position: 'absolute', left: -8, bottom: 70, width: 260,
                background: 'var(--bg-raised)', border: '1px solid var(--line)',
                borderRadius: 18, padding: 22,
                fontFamily: 'Inter, sans-serif',
                transform: 'rotate(1.5deg)',
                boxShadow: '0 20px 60px -30px rgba(0,0,0,0.12)',
              }}
            >
              <div style={{ fontSize: 11, color: 'var(--accent-deep)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>
                Tema dominan
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {['Kepekaan tinggi', 'Kebutuhan ruang', 'Rasa tanggung jawab batin'].map(t => (
                  <span key={t} style={{
                    fontSize: 12, padding: '5px 10px', borderRadius: 999,
                    background: 'var(--accent-soft)', color: 'var(--accent-deep)',
                  }}>{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Principles strip */}
      <section style={{ padding: '0 48px 80px', maxWidth: 1180, margin: '0 auto' }}>
        <div style={{ borderTop: '1px solid var(--line)', paddingTop: 48 }}>
          <p style={{
            fontFamily: 'Fraunces, serif', fontSize: 13, letterSpacing: '0.18em',
            textTransform: 'uppercase', color: 'var(--ink-muted)', margin: 0,
          }}>
            Prinsip kami
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 36, marginTop: 32 }}>
            {[
              ['Empati di atas efisiensi', 'Kami tidak terburu-buru. Jeda adalah bagian dari proses.'],
              ['Kejujuran, bukan validasi', 'AI kami tidak menjilat. Ia merefleksikan, bukan memuji.'],
              ['Privasi tanpa kompromi', 'Data emosimu terenkripsi dan sepenuhnya milikmu.'],
              ['Batas yang jelas', 'Kami bukan terapis — dan kami tidak pura-pura jadi terapis.'],
            ].map(([t, d]) => (
              <div key={t}>
                <div style={{
                  fontFamily: 'Fraunces, serif', fontSize: 22, fontWeight: 400,
                  letterSpacing: '-0.01em', marginBottom: 10, lineHeight: 1.25,
                }}>{t}</div>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, lineHeight: 1.6, color: 'var(--ink-soft)', margin: 0 }}>
                  {d}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '32px 48px', borderTop: '1px solid var(--line)',
        fontFamily: 'Inter, sans-serif', fontSize: 12, color: 'var(--ink-muted)',
        display: 'flex', justifyContent: 'space-between',
      }}>
        <div>© 2026 Mindful AI · Dibuat dengan empati di Jakarta</div>
        <div style={{ display: 'flex', gap: 20 }}>
          <span>Privasi</span><span>Kebijakan data</span><span>Kontak</span>
        </div>
      </footer>
    </div>
  );
};

// Ritual pembuka — 3-step breathing before a session begins.
const RitualScreen = ({ onReady, onCancel }) => {
  const [step, setStep] = useStateL(0);
  const steps = [
    { title: "Temukan tempat nyaman.", sub: "Duduk, sandarkan punggung. Kalau perlu, tutup pintu." },
    { title: "Ambil tiga napas dalam.", sub: "Hirup melalui hidung empat hitungan. Hembuskan enam hitungan." },
    { title: "Tidak ada jawaban yang salah.", sub: "Kamu boleh pelan. Kamu boleh diam sebentar." },
  ];

  return (
    <div
      style={{
        minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: 40, fontFamily: 'Inter, sans-serif',
      }}
    >
      <div style={{ position: 'absolute', top: 24, left: 32, display: 'flex', alignItems: 'center', gap: 10 }}>
        <WordmarkMark size={22} />
        <span style={{ fontFamily: 'Fraunces, serif', fontSize: 15 }}>Mindful <em>AI</em></span>
      </div>
      <button onClick={onCancel}
        style={{
          position: 'absolute', top: 24, right: 32, appearance: 'none', background: 'transparent',
          border: 'none', color: 'var(--ink-muted)', fontSize: 13, cursor: 'pointer',
        }}>Kembali</button>

      {/* Breathing animation */}
      <div style={{ position: 'relative', width: 240, height: 240, marginBottom: 48 }}>
        {[1, 0.82, 0.62, 0.42].map((s, i) => (
          <div key={i} style={{
            position: 'absolute', inset: 0, margin: 'auto',
            width: 240 * s, height: 240 * s, borderRadius: '50%',
            border: '1px solid var(--line)',
            background: i === 3 ? 'var(--primary-soft)' : 'transparent',
            animation: `mindfulBreathe ${7 + i}s ease-in-out ${i * 0.2}s infinite`,
          }} />
        ))}
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--primary-deep)', fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontSize: 20,
        }}>
          tarik · hembus
        </div>
      </div>

      <div style={{ textAlign: 'center', maxWidth: 520 }}>
        <p style={{
          fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase',
          color: 'var(--ink-muted)', margin: 0,
        }}>
          Ritual pembuka · {step + 1} dari 3
        </p>
        <h2 style={{
          fontFamily: 'Fraunces, serif', fontWeight: 400, fontSize: 40, letterSpacing: '-0.02em',
          margin: '18px 0 14px',
        }}>
          {steps[step].title}
        </h2>
        <p style={{ color: 'var(--ink-soft)', fontSize: 16, lineHeight: 1.6, margin: 0 }}>
          {steps[step].sub}
        </p>

        <div style={{ marginTop: 44, display: 'flex', gap: 14, justifyContent: 'center' }}>
          {step < steps.length - 1 ? (
            <PrimaryButton onClick={() => setStep(s => s + 1)}>Lanjut</PrimaryButton>
          ) : (
            <PrimaryButton onClick={onReady}>Aku siap memulai</PrimaryButton>
          )}
          <PrimaryButton ghost onClick={() => setStep(s => Math.max(0, s - 1))}>
            Kembali
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { LandingScreen, RitualScreen, WordmarkMark });
