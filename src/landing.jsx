// Landing + Onboarding + Ritual Pembuka
// Fraunces for editorial moments; Inter for UI.

import { useState as useStateL } from 'react';
import { BreathDot, PrimaryButton, ThemeToggle, LangToggle } from './primitives.jsx';
import { useT } from './i18n.js';

const WordmarkMark = ({ size = 28 }) => (
  // Not a logo — a simple two-overlapping-circle symbol = meeting place of you + you
  <svg width={size} height={size} viewBox="0 0 32 32">
    <circle cx="12" cy="16" r="9" fill="none" stroke="var(--primary-deep)" strokeWidth="1.6" />
    <circle cx="20" cy="16" r="9" fill="none" stroke="var(--accent-deep)" strokeWidth="1.6" />
  </svg>
);

// NavBrand — the WordmarkMark + adjacent text cluster used in every screen's header.
// When label is omitted (default "Mindful AI" wordmark), the whole cluster acts as a home button.
// When a custom label is provided (e.g. screen title like "Sesi"), only the icon is the home button —
// the text label stays static so it doesn't read as clickable.
const NavBrand = ({ onClick, iconSize = 22, textSize = 16, label, gap = 10 }) => {
  const isCustomLabel = label !== undefined;
  const icon = <WordmarkMark size={iconSize} />;
  const text = (
    <span style={{
      fontFamily: 'Fraunces, serif', fontSize: textSize,
      fontWeight: 400, letterSpacing: '-0.015em', color: 'inherit',
    }}>
      {label ?? (<>Mindful <em style={{ fontStyle: 'italic' }}>AI</em></>)}
    </span>
  );

  if (!onClick) {
    return <div style={{ display: 'inline-flex', alignItems: 'center', gap }}>{icon}{text}</div>;
  }

  const homeBtnStyle = {
    appearance: 'none', background: 'transparent', border: 'none', padding: 0,
    display: 'inline-flex', alignItems: 'center', cursor: 'pointer', color: 'inherit',
  };

  if (isCustomLabel) {
    return (
      <div style={{ display: 'inline-flex', alignItems: 'center', gap }}>
        <button onClick={onClick} aria-label="Home" style={homeBtnStyle}>{icon}</button>
        {text}
      </div>
    );
  }

  return (
    <button onClick={onClick} aria-label="Home" style={{ ...homeBtnStyle, gap }}>
      {icon}{text}
    </button>
  );
};

const NavLink = ({ onClick, children }) => (
  <button
    onClick={onClick}
    className="mf-hide-sm"
    style={{
      appearance: 'none', background: 'transparent', border: 'none', padding: 0,
      color: 'inherit', font: 'inherit', cursor: 'pointer',
    }}
  >
    {children}
  </button>
);

const LandingScreen = ({ onStart, onToDashboard, onToHowItWorks, onToPrivacy, onToForPros, onToAbout, onToForHoney, hasHistory, dark, onToggleDark }) => {
  const { t } = useT();
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)' }}>
      {/* Top nav */}
      <nav
        className="mf-px mf-bar"
        style={{ fontFamily: 'Inter, sans-serif', paddingTop: 22, paddingBottom: 22 }}
      >
        <NavBrand iconSize={22} textSize={15} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 22, fontSize: 14, color: 'var(--ink-soft)' }}>
          <NavLink onClick={onToHowItWorks}>{t('nav.howItWorks')}</NavLink>
          <NavLink onClick={onToPrivacy}>{t('nav.privacy')}</NavLink>
          <NavLink onClick={onToForPros}>{t('nav.forPros')}</NavLink>
          <LangToggle />
          <ThemeToggle dark={dark} onToggle={onToggleDark} />
          {hasHistory && (
            <button
              onClick={onToDashboard}
              aria-label={t('nav.profile')}
              title={t('nav.profile')}
              className="mf-press"
              style={{
                appearance: 'none', border: '1px solid var(--line)',
                background: 'var(--bg-raised)', color: 'var(--ink)',
                width: 40, height: 40, borderRadius: '50%',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', padding: 0,
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
              </svg>
            </button>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="mf-px" style={{
        paddingTop: 'clamp(24px, 5vw, 40px)',
        paddingBottom: 'clamp(48px, 8vw, 80px)',
        maxWidth: 1180, margin: '0 auto',
      }}>
        <div className="mf-hero-grid">
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
              {t('landing.tag')}
            </div>
            <h1
              className="mf-hero-title"
              style={{
                fontFamily: 'Fraunces, serif',
                fontWeight: 300,
                letterSpacing: '-0.03em',
                margin: 0,
              }}
            >
              {t('landing.title.line1')}<br />
              {t('landing.title.line2Prefix')}<em style={{ fontStyle: 'italic', color: 'var(--primary-deep)' }}>{t('landing.title.line2')}</em><br />
              {t('landing.title.line3')}
            </h1>
            <p
              style={{
                marginTop: 28, maxWidth: 480,
                fontFamily: 'Inter, sans-serif', fontSize: 'clamp(15px, 1.8vw, 17px)',
                lineHeight: 1.6, color: 'var(--ink-soft)',
              }}
            >
              {t('landing.subtitle')}
            </p>

            <div className="mf-row-stack" style={{ marginTop: 34 }}>
              <PrimaryButton onClick={onStart}>{t('landing.cta')}</PrimaryButton>
              <span style={{ fontSize: 13, color: 'var(--ink-muted)', fontFamily: 'Inter, sans-serif' }}>
                {t('landing.ctaMeta')}
              </span>
            </div>

            <p style={{ marginTop: 42, fontSize: 12, color: 'var(--ink-muted)', fontFamily: 'Inter, sans-serif', maxWidth: 440 }}>
              {t('landing.disclaimer')}
            </p>
          </div>

          {/* Right-side illustration: concentric breathing circles + sample question card */}
          <div className="mf-hide-sm" style={{ position: 'relative', height: 480 }}>
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
                {t('landing.sample.eyebrow')}
              </div>
              <p style={{ fontFamily: 'Fraunces, serif', fontSize: 20, lineHeight: 1.35, margin: 0, fontWeight: 400 }}>
                {t('landing.sample.question')}
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
                {t('landing.sample.themesLabel')}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {[t('landing.sample.theme1'), t('landing.sample.theme2'), t('landing.sample.theme3')].map(label => (
                  <span key={label} style={{
                    fontSize: 12, padding: '5px 10px', borderRadius: 999,
                    background: 'var(--accent-soft)', color: 'var(--accent-deep)',
                  }}>{label}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Principles strip */}
      <section className="mf-px" style={{
        paddingBottom: 'clamp(48px, 8vw, 80px)', maxWidth: 1180, margin: '0 auto',
      }}>
        <div style={{ borderTop: '1px solid var(--line)', paddingTop: 'clamp(28px, 5vw, 48px)' }}>
          <p style={{
            fontFamily: 'Fraunces, serif', fontSize: 13, letterSpacing: '0.18em',
            textTransform: 'uppercase', color: 'var(--ink-muted)', margin: 0,
          }}>
            {t('landing.principles.eyebrow')}
          </p>
          <div className="mf-4col" style={{ marginTop: 32 }}>
            {[1, 2, 3, 4].map((n) => (
              <div key={n}>
                <div style={{
                  fontFamily: 'Fraunces, serif', fontSize: 'clamp(18px, 2.5vw, 22px)', fontWeight: 400,
                  letterSpacing: '-0.01em', marginBottom: 10, lineHeight: 1.25,
                }}>{t(`landing.principles.${n}.title`)}</div>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, lineHeight: 1.6, color: 'var(--ink-soft)', margin: 0 }}>
                  {t(`landing.principles.${n}.body`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mf-px mf-footer-row" style={{
        paddingTop: 32, paddingBottom: 32, borderTop: '1px solid var(--line)',
        fontFamily: 'Inter, sans-serif', fontSize: 12, color: 'var(--ink-muted)',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div>{t('landing.footer.tagline')}</div>
          <div style={{ fontSize: 11, color: 'var(--ink-muted)', display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span>
              Built by <em style={{ fontStyle: 'italic', color: 'var(--ink-soft)' }}>Crafyne</em>
            </span>
            <span aria-hidden="true">·</span>
            <button onClick={onToForHoney} style={{
              appearance: 'none', background: 'transparent', border: 'none', padding: 0,
              color: 'var(--ink-soft)', font: 'inherit', fontStyle: 'italic',
              lineHeight: 1, cursor: 'pointer',
            }}>{t('landing.footer.forHoney')}</button>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'center' }}>
          <button onClick={onToAbout} style={{
            appearance: 'none', background: 'transparent', border: 'none', padding: 0,
            color: 'inherit', font: 'inherit', lineHeight: 1, cursor: 'pointer',
          }}>{t('landing.footer.about')}</button>
          <button onClick={onToPrivacy} style={{
            appearance: 'none', background: 'transparent', border: 'none', padding: 0,
            color: 'inherit', font: 'inherit', lineHeight: 1, cursor: 'pointer',
          }}>{t('landing.footer.privacy')}</button>
          <a href="mailto:contact@crafyne.com" style={{
            color: 'inherit', font: 'inherit', lineHeight: 1, textDecoration: 'none',
          }}>
            {t('landing.footer.contact')}
          </a>
        </div>
      </footer>
    </div>
  );
};

// Ritual pembuka — 3-step breathing before a session begins.
const RitualScreen = ({ onReady, onCancel, onHome }) => {
  const { t } = useT();
  const [step, setStep] = useStateL(0);
  const stepKeys = [1, 2, 3];

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)',
      display: 'flex', flexDirection: 'column', fontFamily: 'Inter, sans-serif',
    }}>
      <header className="mf-px mf-bar" style={{ paddingTop: 22, paddingBottom: 22 }}>
        <NavBrand onClick={onHome} iconSize={22} textSize={15} />
        <button onClick={onCancel} style={{
          appearance: 'none', background: 'transparent', border: 'none',
          color: 'var(--ink-muted)', fontSize: 13, cursor: 'pointer', padding: '6px 8px',
        }}>{t('ritual.back')}</button>
      </header>

      <div className="mf-px" style={{
        flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        paddingTop: 'clamp(20px, 4vw, 40px)', paddingBottom: 'clamp(20px, 4vw, 40px)',
      }}>

        {/* Breathing animation */}
        <div style={{ position: 'relative', width: 'min(240px, 55vw)', aspectRatio: '1', marginBottom: 'clamp(28px, 5vw, 48px)' }}>
          {[1, 0.82, 0.62, 0.42].map((s, i) => (
            <div key={i} style={{
              position: 'absolute', inset: 0, margin: 'auto',
              width: `${s * 100}%`, height: `${s * 100}%`, borderRadius: '50%',
              border: '1px solid var(--line)',
              background: i === 3 ? 'var(--primary-soft)' : 'transparent',
              animation: `mindfulBreathe ${7 + i}s ease-in-out ${i * 0.2}s infinite`,
            }} />
          ))}
          <div style={{
            position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--primary-deep)', fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontSize: 20,
          }}>
            {t('ritual.breathLabel')}
          </div>
        </div>

        <div style={{ textAlign: 'center', maxWidth: 520, width: '100%' }}>
          <p style={{
            fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase',
            color: 'var(--ink-muted)', margin: 0,
          }}>
            {t('ritual.eyebrow', { n: step + 1 })}
          </p>
          <h2 className="mf-h2" style={{
            fontFamily: 'Fraunces, serif', fontWeight: 400, letterSpacing: '-0.02em',
            margin: '18px 0 14px',
          }}>
            {t(`ritual.steps.${stepKeys[step]}.title`)}
          </h2>
          <p style={{ color: 'var(--ink-soft)', fontSize: 16, lineHeight: 1.6, margin: 0 }}>
            {t(`ritual.steps.${stepKeys[step]}.sub`)}
          </p>

          <div className="mf-row-stack" style={{ marginTop: 44, justifyContent: 'center' }}>
            {step < stepKeys.length - 1 ? (
              <PrimaryButton onClick={() => setStep(s => s + 1)}>{t('ritual.next')}</PrimaryButton>
            ) : (
              <PrimaryButton onClick={onReady}>{t('ritual.ready')}</PrimaryButton>
            )}
            <PrimaryButton ghost onClick={() => step === 0 ? onCancel() : setStep(s => s - 1)}>
              {t('ritual.back')}
            </PrimaryButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export { LandingScreen, RitualScreen, WordmarkMark, NavBrand };
