// Analysis loading + Result profile screen
import { useState as uSA, useEffect as uEA } from 'react';
import { RadarChart, PrimaryButton, QuietLink } from './primitives.jsx';
import { NavBrand } from './landing.jsx';
import { useT } from './i18n.js';

const AnalyzingScreen = () => {
  const { t } = useT();
  const messages = [
    t('analyzing.msg.1'),
    t('analyzing.msg.2'),
    t('analyzing.msg.3'),
  ];
  const [idx, setIdx] = uSA(0);
  uEA(() => {
    const id = setInterval(() => setIdx(i => (i + 1) % messages.length), 2800);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="mf-px" style={{
      minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexDirection: 'column', paddingTop: 40, paddingBottom: 40, fontFamily: 'Inter, sans-serif',
    }}>
      <div style={{ position: 'relative', width: 'min(320px, 80vw)', aspectRatio: '1', marginBottom: 40 }}>
        {[1, 0.78, 0.56, 0.34].map((s, i) => (
          <div key={i} style={{
            position: 'absolute', inset: 0, margin: 'auto',
            width: `${s * 100}%`, height: `${s * 100}%`, borderRadius: '50%',
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
        {t('analyzing.note')}
      </p>
    </div>
  );
};

const ResultScreen = ({ analysis, onRestart, onToDashboard, onSave, onHome }) => {
  const { t } = useT();
  const a = analysis;
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)' }}>
      <header className="mf-px mf-bar" style={{
        paddingTop: 22, paddingBottom: 22, fontFamily: 'Inter, sans-serif',
        borderBottom: '1px solid var(--line)',
      }}>
        <NavBrand onClick={onHome} iconSize={22} textSize={15} label={t('result.headerTitle')} />
        <div style={{ display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
          <span className="mf-hide-sm">
            <QuietLink onClick={onToDashboard}>{t('result.dashboard')}</QuietLink>
          </span>
          <span className="mf-hide-sm">
            <PrimaryButton ghost onClick={onSave} style={{ padding: '9px 18px', fontSize: 13 }}>
              {t('result.save')}
            </PrimaryButton>
          </span>
          <PrimaryButton onClick={onRestart} style={{ padding: '9px 18px', fontSize: 13 }}>
            {t('result.newSession')}
          </PrimaryButton>
        </div>
      </header>

      {/* Hero reveal */}
      <section className="mf-px" style={{
        paddingTop: 'clamp(48px, 9vw, 80px)', paddingBottom: 'clamp(28px, 5vw, 48px)',
        maxWidth: 1080, margin: '0 auto', textAlign: 'center',
      }}>
        <p style={{
          fontFamily: 'Inter, sans-serif', fontSize: 11, letterSpacing: '0.2em',
          textTransform: 'uppercase', color: 'var(--ink-muted)', margin: 0,
        }}>
          {t('result.eyebrow')}
        </p>
        <h1 className="mf-result-title" style={{
          fontFamily: 'Fraunces, serif', fontWeight: 300,
          letterSpacing: '-0.035em', margin: '18px 0 14px',
          color: 'var(--ink)',
        }}>
          <em style={{ fontStyle: 'italic', color: 'var(--primary-deep)' }}>{a.archetype}</em>
        </h1>
        <p className="mf-body-lg" style={{
          fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontWeight: 300,
          color: 'var(--ink-soft)', maxWidth: 640, margin: '0 auto',
        }}>
          {a.subtitle}
        </p>
      </section>

      {/* Narrative + radar */}
      <section className="mf-px" style={{ paddingTop: 'clamp(24px, 4vw, 40px)', maxWidth: 1080, margin: '0 auto' }}>
        <div className="mf-narrative-grid" style={{
          borderTop: '1px solid var(--line)', paddingTop: 'clamp(32px, 6vw, 56px)',
        }}>
          <div>
            <p style={{
              fontFamily: 'Fraunces, serif', fontSize: 13, letterSpacing: '0.18em',
              textTransform: 'uppercase', color: 'var(--ink-muted)', margin: 0,
            }}>
              {t('result.narrativeEyebrow')}
            </p>
            <p className="mf-narrative" style={{
              fontFamily: 'Fraunces, serif', fontWeight: 300,
              color: 'var(--ink)', marginTop: 20, letterSpacing: '-0.005em',
            }}>
              {a.narrative}
            </p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', width: '100%', maxWidth: 320, margin: '0 auto' }}>
            <RadarChart values={a.dimensions} size={320} />
          </div>
        </div>
      </section>

      {/* Themes */}
      <section className="mf-px mf-section-pt" style={{ maxWidth: 1080, margin: '0 auto' }}>
        <div style={{ borderTop: '1px solid var(--line)', paddingTop: 'clamp(28px, 5vw, 48px)' }}>
          <p style={{
            fontFamily: 'Fraunces, serif', fontSize: 13, letterSpacing: '0.18em',
            textTransform: 'uppercase', color: 'var(--ink-muted)', margin: 0,
          }}>
            {t('result.themesEyebrow')}
          </p>
          <div className="mf-themes" style={{ gridTemplateColumns: `repeat(${a.themes.length}, 1fr)`, marginTop: 28 }}>
            {a.themes.map((th, i) => (
              <div key={i} style={{
                padding: 'clamp(18px, 3vw, 28px)', borderRadius: 18,
                background: i % 2 ? 'var(--accent-soft)' : 'var(--primary-soft)',
                fontFamily: 'Inter, sans-serif',
              }}>
                <div style={{
                  fontFamily: 'Fraunces, serif', fontSize: 'clamp(20px, 2.6vw, 24px)', fontWeight: 400,
                  color: i % 2 ? 'var(--accent-deep)' : 'var(--primary-deep)',
                  marginBottom: 10, letterSpacing: '-0.01em',
                }}>
                  {th.label}
                </div>
                <div style={{ fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.55 }}>
                  {th.note}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Strengths + Growth two-column */}
      <section className="mf-px mf-section-pt" style={{ maxWidth: 1080, margin: '0 auto' }}>
        <div className="mf-wide-2col" style={{
          borderTop: '1px solid var(--line)', paddingTop: 'clamp(28px, 5vw, 48px)',
        }}>
          <div>
            <p style={{
              fontFamily: 'Fraunces, serif', fontSize: 13, letterSpacing: '0.18em',
              textTransform: 'uppercase', color: 'var(--ink-muted)', margin: 0,
            }}>
              {t('result.strengthsEyebrow')}
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
              {t('result.growthEyebrow')}
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
      <section className="mf-px mf-section-pt" style={{ maxWidth: 1080, margin: '0 auto' }}>
        <div style={{ borderTop: '1px solid var(--line)', paddingTop: 'clamp(28px, 5vw, 48px)' }}>
          <p style={{
            fontFamily: 'Fraunces, serif', fontSize: 13, letterSpacing: '0.18em',
            textTransform: 'uppercase', color: 'var(--ink-muted)', margin: 0,
          }}>
            {t('result.recsEyebrow')}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 28 }}>
            {a.recommendations.map((r, i) => (
              <div key={i} className="mf-rec-row" style={{
                padding: '24px clamp(18px, 3vw, 28px)', borderRadius: 16, background: 'var(--bg-raised)',
                border: '1px solid var(--line)',
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
                }}>{t('result.recsSave')}</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing */}
      <section className="mf-px mf-section-py" style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ borderTop: '1px solid var(--line)', paddingTop: 'clamp(28px, 5vw, 48px)' }}>
          <p className="mf-quote" style={{
            fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontWeight: 300,
            color: 'var(--ink)', margin: 0,
          }}>
            {t('result.closingQuote')}
          </p>
          <div className="mf-row-stack" style={{ marginTop: 40, justifyContent: 'center' }}>
            <PrimaryButton onClick={onToDashboard}>{t('result.viewDashboard')}</PrimaryButton>
            <PrimaryButton ghost onClick={onRestart}>{t('result.doAgain')}</PrimaryButton>
          </div>
          <p style={{ fontSize: 12, color: 'var(--ink-muted)', marginTop: 36, fontFamily: 'Inter, sans-serif' }}>
            {t('result.disclaimer')}
          </p>
        </div>
      </section>
    </div>
  );
};

export { AnalyzingScreen, ResultScreen };
