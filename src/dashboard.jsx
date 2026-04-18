// Dashboard — shows profile, real session history, daily check-in.
import { useRef, useState } from 'react';
import { BreathDot, PrimaryButton, QuietLink, ThemeToggle, LangToggle, ThinkingIndicator } from './primitives.jsx';
import { NavBrand } from './landing.jsx';
import { getSeed } from './seedContent.js';
import { useT, localeFor } from './i18n.js';
import {
  exportHistory, importHistory, clearHistory, ketenanganTrend, loadHistory,
  updateSessionTranslation, displayedAnalysis,
} from './history.js';

function toneFromKetenangan(v) {
  if (v >= 75) return 'tenang';
  if (v >= 55) return 'biasa';
  if (v >= 35) return 'campur';
  return 'berat';
}

const DashboardScreen = ({ analysis, history, onHistoryChange, onNewSession, onBack, onHome, onMoodCheckin, dark, onToggleDark }) => {
  const { t, lang } = useT();
  const a = analysis || getSeed(lang).fallbackAnalysis;
  const trend = ketenanganTrend(history || []);
  const fileInput = useRef(null);
  const [notice, setNotice] = useState('');
  const [translatingId, setTranslatingId] = useState(null);
  const [translateError, setTranslateError] = useState('');

  const latestSession = history?.[history.length - 1];
  const topView = latestSession ? displayedAnalysis(latestSession, lang) : a;
  const topIsTranslated = latestSession && latestSession.lang && latestSession.lang !== lang
    && !!latestSession.translations?.[lang];

  const handleTranslate = async (session) => {
    setTranslatingId(session.id);
    setTranslateError('');
    try {
      const resp = await fetch('/api/claude', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          mode: 'translate',
          analysis: session.analysis,
          sourceLang: session.lang || 'id',
          targetLang: lang,
        }),
      });
      if (!resp.ok) {
        const detail = await resp.text().catch(() => '');
        throw new Error(detail || `api ${resp.status}`);
      }
      const translated = await resp.json();
      const next = updateSessionTranslation(session.id, lang, translated);
      onHistoryChange?.(next);
    } catch (e) {
      console.warn('translate failed:', e);
      setTranslateError(t('dashboard.history.translateError'));
    } finally {
      setTranslatingId(null);
    }
  };

  const dateFmt = new Intl.DateTimeFormat(localeFor(lang), { day: '2-digit', month: 'short' });
  const longDateFmt = new Intl.DateTimeFormat(localeFor(lang), {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  const moods = [
    t('dashboard.checkin.mood.calm'),
    t('dashboard.checkin.mood.normal'),
    t('dashboard.checkin.mood.turbulent'),
    t('dashboard.checkin.mood.tired'),
    t('dashboard.checkin.mood.light'),
    t('dashboard.checkin.mood.anxious'),
  ];

  const handleExport = () => {
    if (!history?.length) {
      setNotice(t('dashboard.data.notice.empty'));
      return;
    }
    exportHistory();
    setNotice(t('dashboard.data.notice.exported'));
  };

  const handleImportClick = () => fileInput.current?.click();
  const handleImportFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const ok = window.confirm(t('dashboard.data.confirm.import'));
    if (!ok) return;
    try {
      const next = await importHistory(file);
      onHistoryChange?.(next);
      setNotice(t('dashboard.data.notice.imported', { n: next.length }));
    } catch (err) {
      setNotice(err.message || t('dashboard.data.error'));
    }
  };

  const handleClear = () => {
    const ok = window.confirm(t('dashboard.data.confirm.clear'));
    if (!ok) return;
    clearHistory();
    onHistoryChange?.(loadHistory());
    setNotice(t('dashboard.data.notice.cleared'));
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)', fontFamily: 'Inter, sans-serif' }}>
      <header className="mf-px mf-bar" style={{
        paddingTop: 22, paddingBottom: 22, borderBottom: '1px solid var(--line)',
      }}>
        <NavBrand onClick={onHome} iconSize={22} textSize={15} label={t('dashboard.headerTitle')} />
        <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
          <QuietLink onClick={onBack}>{t('dashboard.home')}</QuietLink>
          <LangToggle />
          <ThemeToggle dark={dark} onToggle={onToggleDark} />
          <PrimaryButton onClick={onNewSession} style={{ padding: '9px 18px', fontSize: 13 }}>
            {t('dashboard.newSession')}
          </PrimaryButton>
        </div>
      </header>

      <main className="mf-px" style={{ maxWidth: 1080, margin: '0 auto', paddingTop: 48, paddingBottom: 80 }}>
        {/* Greeting */}
        <div className="mf-rise mf-rise-1" style={{ marginBottom: 44 }}>
          <p style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--ink-muted)', margin: 0 }}>
            {longDateFmt.format(new Date())}
          </p>
          <h1 className="mf-h1" style={{
            fontFamily: 'Fraunces, serif', fontWeight: 300,
            letterSpacing: '-0.03em', margin: '14px 0 0',
          }}>
            {t('dashboard.greeting.welcome')} <em style={{ fontStyle: 'italic', color: 'var(--primary-deep)' }}>{t('dashboard.greeting.italic')}</em>
          </h1>
        </div>

        {/* Check-in card */}
        <div className="mf-2col mf-rise mf-rise-2">
          <div className="mf-card-hover" style={{
            padding: 'clamp(20px, 3vw, 32px)', borderRadius: 22, background: 'var(--primary-soft)',
            border: '1px solid color-mix(in oklab, var(--primary) 22%, transparent)',
          }}>
            <div style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--primary-deep)' }}>
              {t('dashboard.checkin.eyebrow')}
            </div>
            <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: 26, fontWeight: 400, margin: '14px 0 18px', letterSpacing: '-0.01em' }}>
              {t('dashboard.checkin.title')}
            </h3>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {moods.map(m => (
                <button key={m} onClick={onMoodCheckin} className="mf-press" style={{
                  appearance: 'none', border: '1px solid color-mix(in oklab, var(--primary-deep) 30%, transparent)',
                  background: 'var(--bg-raised)', color: 'var(--ink)', padding: '10px 16px',
                  borderRadius: 999, fontFamily: 'Inter, sans-serif', fontSize: 14, cursor: 'pointer',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg)'}
                onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-raised)'}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div className="mf-card-hover" style={{
            padding: 'clamp(20px, 3vw, 32px)', borderRadius: 22, background: 'var(--bg-raised)',
            border: '1px solid var(--line)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          }}>
            <div>
              <div style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>
                {t('dashboard.profile.eyebrow')}
              </div>
              <h3 style={{
                fontFamily: 'Fraunces, serif', fontSize: 34, fontWeight: 300, margin: '14px 0 6px',
                letterSpacing: '-0.02em',
              }}>
                <em style={{ fontStyle: 'italic', color: 'var(--primary-deep)' }}>{topView.archetype}</em>
                {topIsTranslated && (
                  <span style={{
                    marginLeft: 10, fontSize: 11, color: 'var(--ink-muted)',
                    fontFamily: 'Inter, sans-serif', fontStyle: 'italic', fontWeight: 400,
                    letterSpacing: 0,
                  }}>
                    · {t('dashboard.history.translated')}
                  </span>
                )}
              </h3>
              <p style={{ color: 'var(--ink-soft)', fontSize: 14, lineHeight: 1.55, margin: 0 }}>
                {topView.subtitle}
              </p>
            </div>
            <div style={{ marginTop: 18, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {topView.themes.map((th, i) => (
                <span key={i} style={{
                  fontSize: 12, padding: '5px 11px', borderRadius: 999,
                  background: 'var(--accent-soft)', color: 'var(--accent-deep)',
                }}>{th.label}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Trend */}
        <div className="mf-rise mf-rise-3 mf-card-hover" style={{
          marginTop: 20, padding: 'clamp(20px, 3vw, 32px)', borderRadius: 22,
          background: 'var(--bg-raised)', border: '1px solid var(--line)',
        }}>
          <div className="mf-bar" style={{ alignItems: 'baseline', marginBottom: 28 }}>
            <div>
              <div style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>
                {t('dashboard.trend.eyebrow')}
              </div>
              <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: 28, fontWeight: 300, margin: '10px 0 0', letterSpacing: '-0.01em' }}>
                {trend.length ? t('dashboard.trend.recentN', { n: trend.length }) : t('dashboard.trend.startWithOne')}
              </h3>
            </div>
          </div>

          {trend.length >= 2 ? (
            <>
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
                      <path className="mf-trend-area" d={area} fill="var(--primary-soft)" opacity="0.6" />
                      <path className="mf-trend-line" d={d} stroke="var(--primary-deep)" strokeWidth="2" fill="none" strokeLinecap="round" />
                      {pts.map(([x, y], i) => (
                        <circle
                          key={i} cx={x} cy={y}
                          r={i === pts.length - 1 ? 6 : 3}
                          fill="var(--primary-deep)"
                          className="mf-trend-dot"
                          style={{ animationDelay: `${1100 + i * 90}ms` }}
                        />
                      ))}
                    </>
                  );
                })()}
              </svg>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--ink-muted)', marginTop: 10 }}>
                <span>{t('dashboard.trend.session1')}</span>
                <span>{t('dashboard.trend.sessionLatest', { n: trend.length })}</span>
              </div>
            </>
          ) : (
            <div style={{
              padding: '40px 20px', textAlign: 'center', color: 'var(--ink-soft)',
              fontFamily: 'Fraunces, serif', fontStyle: 'italic', fontSize: 16, lineHeight: 1.6,
            }}>
              {t('dashboard.trend.empty')}
            </div>
          )}
        </div>

        {/* Past sessions + active recs */}
        <div className="mf-2col mf-rise mf-rise-4" style={{ marginTop: 20 }}>
          <div className="mf-card-hover" style={{
            padding: 'clamp(20px, 3vw, 32px)', borderRadius: 22, background: 'var(--bg-raised)', border: '1px solid var(--line)',
          }}>
            <div style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: 20 }}>
              {t('dashboard.history.eyebrow')}
            </div>
            {history?.length ? (
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {[...history].reverse().map((s, i) => {
                  const ket = s.analysis.dimensions?.ketenangan ?? 0;
                  const isLatest = i === 0;
                  const toneKey = toneFromKetenangan(ket);
                  const view = displayedAnalysis(s, lang);
                  const sourceLang = s.lang || 'id';
                  const isTranslating = translatingId === s.id;
                  const hasTranslation = sourceLang !== lang && !!s.translations?.[lang];
                  const canTranslate = sourceLang !== lang && !hasTranslation;
                  return (
                    <li key={s.id} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      gap: 12, padding: '16px 0',
                      borderBottom: i < history.length - 1 ? '1px solid var(--line-soft)' : 'none',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0 }}>
                        <span style={{
                          width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                          background: isLatest ? 'var(--accent)' : 'var(--primary)',
                        }} />
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontFamily: 'Fraunces, serif', fontSize: 17, fontWeight: 400, letterSpacing: '-0.005em' }}>
                            {view.archetype}
                            {isLatest && <span style={{ fontSize: 11, color: 'var(--accent-deep)', marginLeft: 6, fontStyle: 'italic' }}>{t('dashboard.history.latest')}</span>}
                            {hasTranslation && <span style={{ fontSize: 11, color: 'var(--ink-muted)', marginLeft: 6, fontStyle: 'italic' }}>· {t('dashboard.history.translated')}</span>}
                          </div>
                          <div style={{ fontSize: 12, color: 'var(--ink-muted)', marginTop: 2 }}>
                            {dateFmt.format(new Date(s.savedAt))} · {t('dashboard.history.tone', { tone: t(`dashboard.tone.${toneKey}`) })}
                          </div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0 }}>
                        {isTranslating ? (
                          <ThinkingIndicator label={t('dashboard.history.translate')} />
                        ) : canTranslate ? (
                          <QuietLink onClick={() => handleTranslate(s)}>
                            {t('dashboard.history.translate')}
                          </QuietLink>
                        ) : null}
                        <div style={{ fontSize: 13, color: 'var(--ink-soft)', fontVariantNumeric: 'tabular-nums' }}>
                          {ket}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p style={{ color: 'var(--ink-soft)', fontSize: 14, lineHeight: 1.6, margin: 0 }}>
                {t('dashboard.history.empty')}
              </p>
            )}
            {translateError && (
              <div style={{
                marginTop: 12, fontSize: 12, color: 'var(--ink-soft)', fontStyle: 'italic',
              }}>
                {translateError}
              </div>
            )}
          </div>

          <div className="mf-card-hover" style={{
            padding: 'clamp(20px, 3vw, 32px)', borderRadius: 22, background: 'var(--accent-soft)',
            border: '1px solid color-mix(in oklab, var(--accent) 22%, transparent)',
          }}>
            <div style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--accent-deep)', marginBottom: 20 }}>
              {t('dashboard.activeRecs')}
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {topView.recommendations.slice(0, 3).map((r, i) => (
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

        {/* Data card — export / import / clear */}
        <div className="mf-rise mf-rise-5 mf-card-hover" style={{
          marginTop: 20, padding: 'clamp(20px, 3vw, 32px)', borderRadius: 22,
          background: 'var(--bg-raised)', border: '1px solid var(--line)',
        }}>
          <div style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: 12 }}>
            {t('dashboard.data.eyebrow')}
          </div>
          <p style={{ color: 'var(--ink-soft)', fontSize: 14, lineHeight: 1.6, margin: '0 0 18px' }}>
            {t('dashboard.data.body')}
          </p>
          <div className="mf-row-stack" style={{ gap: 10 }}>
            <PrimaryButton ghost onClick={handleExport}>{t('dashboard.data.export')}</PrimaryButton>
            <PrimaryButton ghost onClick={handleImportClick}>{t('dashboard.data.import')}</PrimaryButton>
            <PrimaryButton ghost onClick={handleClear}>{t('dashboard.data.clear')}</PrimaryButton>
          </div>
          <input
            ref={fileInput} type="file" accept="application/json,.json"
            onChange={handleImportFile} style={{ display: 'none' }}
          />
          {notice && (
            <div style={{
              marginTop: 14, fontSize: 13, color: 'var(--ink-soft)', fontStyle: 'italic',
            }}>
              {notice}
            </div>
          )}
        </div>

        {/* Gentle reminder */}
        <div className="mf-row-stack mf-rise mf-rise-6" style={{
          marginTop: 36, padding: 'clamp(20px, 3vw, 28px) clamp(20px, 3vw, 32px)', borderRadius: 18,
          border: '1px dashed var(--line)', gap: 20,
        }}>
          <div style={{
            flexShrink: 0, width: 44, height: 44, borderRadius: '50%',
            background: 'var(--bg-sunken)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <BreathDot size={10} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'Fraunces, serif', fontSize: 17, fontWeight: 400, marginBottom: 4, color: 'var(--ink)' }}>
              {t('dashboard.help.title')}
            </div>
            <div style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.55 }}>
              {t('dashboard.help.body')}
            </div>
          </div>
          <button style={{
            appearance: 'none', border: '1px solid var(--line)', background: 'var(--bg-raised)',
            color: 'var(--ink)', padding: '10px 18px', borderRadius: 999,
            fontSize: 13, fontFamily: 'Inter, sans-serif', cursor: 'pointer',
          }}>{t('dashboard.help.cta')}</button>
        </div>
      </main>
    </div>
  );
};

export { DashboardScreen };
