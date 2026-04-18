// Analysis loading + Result profile screen
const { useState: uSA, useEffect: uEA } = React;

const AnalyzingScreen = () => {
  const messages = [
    "Sedang merangkai tema dari caramu bercerita…",
    "Mendengarkan pola kecil yang mungkin kamu lewatkan…",
    "Menenun kata-katamu menjadi satu gambar utuh…",
  ];
  const [idx, setIdx] = uSA(0);
  uEA(() => {
    const id = setInterval(() => setIdx(i => (i + 1) % messages.length), 2800);
    return () => clearInterval(id);
  }, []);
  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexDirection: 'column', padding: 40, fontFamily: 'Inter, sans-serif',
    }}>
      <div style={{ position: 'relative', width: 320, height: 320, marginBottom: 40 }}>
        {[1, 0.78, 0.56, 0.34].map((s, i) => (
          <div key={i} style={{
            position: 'absolute', inset: 0, margin: 'auto',
            width: 320 * s, height: 320 * s, borderRadius: '50%',
            border: `1px solid ${i === 0 ? 'var(--accent)' : 'var(--line)'}`,
            borderTopColor: i === 0 ? 'var(--primary)' : undefined,
            background: i === 3 ? 'var(--primary-soft)' : 'transparent',
            animation: i === 0 ? `mindfulSpin ${18 - i * 2}s linear infinite`
                                : `mindfulBreathe ${8 + i}s ease-in-out infinite`,
          }} />
        ))}
      </div>
      <p style={{
        fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontWeight: 300,
        fontSize: 26, letterSpacing: '-0.01em', color: 'var(--ink)', textAlign: 'center',
        maxWidth: 520, transition: 'opacity 700ms',
      }}>
        {messages[idx]}
      </p>
      <p style={{ marginTop: 20, fontSize: 13, color: 'var(--ink-muted)' }}>
        Ini butuh sekitar 20 detik. Tidak ada yang perlu kamu lakukan sekarang.
      </p>
    </div>
  );
};

const ResultScreen = ({ analysis, onRestart, onToDashboard, onSave }) => {
  const a = analysis;
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)' }}>
      <header style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '22px 40px', fontFamily: 'Inter, sans-serif',
        borderBottom: '1px solid var(--line)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <WordmarkMark size={20} />
          <span style={{ fontFamily: 'Fraunces, serif', fontSize: 14 }}>Profil emosionalmu hari ini</span>
        </div>
        <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
          <QuietLink onClick={onToDashboard}>Dashboard</QuietLink>
          <PrimaryButton ghost onClick={onSave} style={{ padding: '9px 18px', fontSize: 13 }}>
            Simpan refleksi
          </PrimaryButton>
          <PrimaryButton onClick={onRestart} style={{ padding: '9px 18px', fontSize: 13 }}>
            Sesi baru
          </PrimaryButton>
        </div>
      </header>

      {/* Hero reveal */}
      <section style={{
        padding: '80px 40px 48px', maxWidth: 1080, margin: '0 auto', textAlign: 'center',
      }}>
        <p style={{
          fontFamily: 'Inter, sans-serif', fontSize: 11, letterSpacing: '0.2em',
          textTransform: 'uppercase', color: 'var(--ink-muted)', margin: 0,
        }}>
          Kamu, hari ini
        </p>
        <h1 style={{
          fontFamily: 'Fraunces, serif', fontWeight: 300, fontSize: 88,
          letterSpacing: '-0.035em', lineHeight: 1.02, margin: '18px 0 14px',
          color: 'var(--ink)',
        }}>
          <em style={{ fontStyle: 'italic', color: 'var(--primary-deep)' }}>{a.archetype}</em>
        </h1>
        <p style={{
          fontFamily: 'Fraunces, serif', fontSize: 22, fontStyle: 'italic', fontWeight: 300,
          color: 'var(--ink-soft)', maxWidth: 640, margin: '0 auto', lineHeight: 1.4,
        }}>
          {a.subtitle}
        </p>
      </section>

      {/* Narrative + radar */}
      <section style={{ padding: '40px 40px 0', maxWidth: 1080, margin: '0 auto' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 56, alignItems: 'center',
          borderTop: '1px solid var(--line)', paddingTop: 56,
        }}>
          <div>
            <p style={{
              fontFamily: 'Fraunces, serif', fontSize: 13, letterSpacing: '0.18em',
              textTransform: 'uppercase', color: 'var(--ink-muted)', margin: 0,
            }}>
              Naratif refleksi
            </p>
            <p style={{
              fontFamily: 'Fraunces, serif', fontSize: 22, fontWeight: 300, lineHeight: 1.55,
              color: 'var(--ink)', marginTop: 20, letterSpacing: '-0.005em',
            }}>
              {a.narrative}
            </p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <RadarChart values={a.dimensions} size={320} />
          </div>
        </div>
      </section>

      {/* Themes */}
      <section style={{ padding: '72px 40px 0', maxWidth: 1080, margin: '0 auto' }}>
        <div style={{ borderTop: '1px solid var(--line)', paddingTop: 48 }}>
          <p style={{
            fontFamily: 'Fraunces, serif', fontSize: 13, letterSpacing: '0.18em',
            textTransform: 'uppercase', color: 'var(--ink-muted)', margin: 0,
          }}>
            Tema yang muncul dari ceritamu
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${a.themes.length}, 1fr)`, gap: 20, marginTop: 28 }}>
            {a.themes.map((t, i) => (
              <div key={i} style={{
                padding: 28, borderRadius: 18, background: i % 2 ? 'var(--accent-soft)' : 'var(--primary-soft)',
                fontFamily: 'Inter, sans-serif',
              }}>
                <div style={{
                  fontFamily: 'Fraunces, serif', fontSize: 24, fontWeight: 400,
                  color: i % 2 ? 'var(--accent-deep)' : 'var(--primary-deep)',
                  marginBottom: 10, letterSpacing: '-0.01em',
                }}>
                  {t.label}
                </div>
                <div style={{ fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.55 }}>
                  {t.note}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Strengths + Growth two-column */}
      <section style={{ padding: '72px 40px 0', maxWidth: 1080, margin: '0 auto' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56,
          borderTop: '1px solid var(--line)', paddingTop: 48,
        }}>
          <div>
            <p style={{
              fontFamily: 'Fraunces, serif', fontSize: 13, letterSpacing: '0.18em',
              textTransform: 'uppercase', color: 'var(--ink-muted)', margin: 0,
            }}>
              Kekuatan batin
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: '20px 0 0', fontFamily: 'Inter, sans-serif' }}>
              {a.strengths.map((s, i) => (
                <li key={i} style={{
                  padding: '18px 0', borderBottom: '1px solid var(--line-soft)',
                  display: 'flex', alignItems: 'flex-start', gap: 14,
                  fontFamily: 'Fraunces, serif', fontSize: 18, fontWeight: 300,
                  color: 'var(--ink)', lineHeight: 1.45,
                }}>
                  <span style={{
                    flexShrink: 0, width: 22, height: 22, borderRadius: '50%',
                    background: 'var(--primary-soft)', color: 'var(--primary-deep)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontFamily: 'Inter, sans-serif', fontWeight: 500, marginTop: 3,
                  }}>{i + 1}</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p style={{
              fontFamily: 'Fraunces, serif', fontSize: 13, letterSpacing: '0.18em',
              textTransform: 'uppercase', color: 'var(--ink-muted)', margin: 0,
            }}>
              Area untuk bertumbuh
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: '20px 0 0', fontFamily: 'Inter, sans-serif' }}>
              {a.growth.map((s, i) => (
                <li key={i} style={{
                  padding: '18px 0', borderBottom: '1px solid var(--line-soft)',
                  display: 'flex', alignItems: 'flex-start', gap: 14,
                  fontFamily: 'Fraunces, serif', fontSize: 18, fontWeight: 300,
                  color: 'var(--ink)', lineHeight: 1.45,
                }}>
                  <span style={{
                    flexShrink: 0, width: 22, height: 22, borderRadius: '50%',
                    background: 'var(--accent-soft)', color: 'var(--accent-deep)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontFamily: 'Inter, sans-serif', fontWeight: 500, marginTop: 3,
                  }}>↑</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Recommendations */}
      <section style={{ padding: '72px 40px 0', maxWidth: 1080, margin: '0 auto' }}>
        <div style={{ borderTop: '1px solid var(--line)', paddingTop: 48 }}>
          <p style={{
            fontFamily: 'Fraunces, serif', fontSize: 13, letterSpacing: '0.18em',
            textTransform: 'uppercase', color: 'var(--ink-muted)', margin: 0,
          }}>
            Rekomendasi yang dibuat untukmu
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 28 }}>
            {a.recommendations.map((r, i) => (
              <div key={i} style={{
                display: 'grid', gridTemplateColumns: '160px 1fr auto', gap: 28,
                padding: '24px 28px', borderRadius: 16, background: 'var(--bg-raised)',
                border: '1px solid var(--line)', alignItems: 'center',
                fontFamily: 'Inter, sans-serif',
              }}>
                <div style={{
                  fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase',
                  color: 'var(--ink-muted)',
                }}>
                  {r.kind}
                </div>
                <div>
                  <div style={{
                    fontFamily: 'Fraunces, serif', fontSize: 20, fontWeight: 400,
                    color: 'var(--ink)', letterSpacing: '-0.01em', marginBottom: 6,
                  }}>{r.title}</div>
                  <div style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.55 }}>{r.why}</div>
                </div>
                <button style={{
                  appearance: 'none', border: '1px solid var(--line)', background: 'transparent',
                  color: 'var(--ink)', padding: '8px 16px', borderRadius: 999,
                  fontFamily: 'Inter, sans-serif', fontSize: 13, cursor: 'pointer',
                }}>Simpan</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing */}
      <section style={{
        padding: '80px 40px 80px', maxWidth: 720, margin: '0 auto', textAlign: 'center',
      }}>
        <div style={{ borderTop: '1px solid var(--line)', paddingTop: 48 }}>
          <p style={{
            fontFamily: 'Fraunces, serif', fontSize: 26, fontStyle: 'italic', fontWeight: 300,
            color: 'var(--ink)', lineHeight: 1.5, margin: 0,
          }}>
            "Kamu sudah melakukan hal yang sulit hari ini — bertanya pada dirimu sendiri.
            Tidak semua orang berani melakukannya."
          </p>
          <div style={{ marginTop: 40, display: 'flex', gap: 14, justifyContent: 'center' }}>
            <PrimaryButton onClick={onToDashboard}>Lihat dashboard</PrimaryButton>
            <PrimaryButton ghost onClick={onRestart}>Lakukan sesi lagi</PrimaryButton>
          </div>
          <p style={{ fontSize: 12, color: 'var(--ink-muted)', marginTop: 36, fontFamily: 'Inter, sans-serif' }}>
            Ingat — refleksi ini bukan diagnosis. Kalau kamu merasa butuh bicara dengan profesional,
            itu keputusan yang bijak, bukan tanda kelemahan.
          </p>
        </div>
      </section>
    </div>
  );
};

Object.assign(window, { AnalyzingScreen, ResultScreen });
