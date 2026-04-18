// Shared primitives: breathing dot, soft card, button, etc.
// Uses window.MindfulTokens via CSS vars set on :root.

import { useState, useEffect, useRef } from 'react';
import { useT, LANGS, LANG_META } from './i18n.js';

// A calming "breath" indicator — slow 4s in / 4s out.
const BreathDot = ({ size = 14, color }) => {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setPhase(p => p + 1), 4000);
    return () => clearInterval(id);
  }, []);
  return (
    <span
      style={{
        display: 'inline-block',
        width: size,
        height: size,
        borderRadius: '50%',
        background: color || 'var(--primary)',
        opacity: phase % 2 ? 0.55 : 1,
        transform: phase % 2 ? 'scale(0.78)' : 'scale(1)',
        transition: 'all 3800ms cubic-bezier(.42,0,.58,1)',
        boxShadow: '0 0 0 0 currentColor',
      }}
    />
  );
};

const SoftCard = ({ children, style, raised, ...rest }) => (
  <div
    style={{
      background: raised ? 'var(--bg-raised)' : 'var(--bg)',
      border: '1px solid var(--line)',
      borderRadius: 22,
      padding: 28,
      ...style,
    }}
    {...rest}
  >
    {children}
  </div>
);

const PrimaryButton = ({ children, onClick, disabled, style, ghost }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    style={{
      appearance: 'none',
      border: ghost ? '1px solid var(--line)' : 'none',
      background: ghost ? 'transparent' : 'var(--primary)',
      color: ghost ? 'var(--ink)' : '#0E3B2E',
      fontFamily: 'Inter, sans-serif',
      fontWeight: 500,
      fontSize: 15,
      letterSpacing: '-0.005em',
      padding: '14px 26px',
      borderRadius: 999,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      transition: 'transform 400ms cubic-bezier(.2,.8,.2,1), background 400ms',
      ...style,
    }}
    onMouseEnter={e => !disabled && (e.currentTarget.style.transform = 'translateY(-1px)')}
    onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
  >
    {children}
  </button>
);

const QuietLink = ({ children, onClick, style }) => (
  <button
    onClick={onClick}
    style={{
      appearance: 'none',
      background: 'transparent',
      border: 'none',
      color: 'var(--ink-soft)',
      fontFamily: 'Inter, sans-serif',
      fontSize: 14,
      cursor: 'pointer',
      textDecoration: 'underline',
      textUnderlineOffset: 4,
      textDecorationThickness: 1,
      textDecorationColor: 'var(--line)',
      ...style,
    }}
  >
    {children}
  </button>
);

// Depth meter — "kedalaman refleksi"
const DepthMeter = ({ depth, total }) => {
  const { t } = useT();
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: 'Inter, sans-serif' }}>
      <span style={{ fontSize: 11, color: 'var(--ink-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
        {t('session.depthSurface')}
      </span>
      <div style={{ display: 'flex', gap: 3 }}>
        {Array.from({ length: total }).map((_, i) => (
          <span
            key={i}
            style={{
              width: 22,
              height: 3,
              borderRadius: 2,
              background: i < depth ? 'var(--primary)' : 'var(--line)',
              transition: 'background 900ms ease',
            }}
          />
        ))}
      </div>
      <span style={{ fontSize: 11, color: 'var(--ink-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
        {t('session.depthCore')}
      </span>
    </div>
  );
};

// Radar chart for 6 emotional dimensions — hand-drawn SVG, no libs
const RadarChart = ({ values, size = 280 }) => {
  // values: { ketenangan, kesadaranDiri, resiliensi, koneksiSosial, regulasiEmosi, harapan } (0-100)
  const { t } = useT();
  const labels = [
    [t('dim.ketenangan'),     'ketenangan'],
    [t('dim.kesadaranDiri'),  'kesadaranDiri'],
    [t('dim.resiliensi'),     'resiliensi'],
    [t('dim.koneksiSosial'),  'koneksiSosial'],
    [t('dim.regulasiEmosi'),  'regulasiEmosi'],
    [t('dim.harapan'),        'harapan'],
  ];
  const cx = size / 2, cy = size / 2;
  const r = size / 2 - 48;
  const N = labels.length;

  const point = (i, val) => {
    const angle = -Math.PI / 2 + (i * 2 * Math.PI) / N;
    const rr = r * (val / 100);
    return [cx + rr * Math.cos(angle), cy + rr * Math.sin(angle)];
  };
  const labelPos = i => {
    const angle = -Math.PI / 2 + (i * 2 * Math.PI) / N;
    const rr = r + 22;
    return [cx + rr * Math.cos(angle), cy + rr * Math.sin(angle)];
  };

  const poly = labels.map(([_, k], i) => point(i, values[k] ?? 0)).map(p => p.join(',')).join(' ');
  const rings = [0.25, 0.5, 0.75, 1];

  return (
    <svg viewBox={`0 0 ${size} ${size}`} style={{ width: '100%', height: 'auto', maxWidth: size, overflow: 'visible' }}>
      {rings.map((f, i) => (
        <polygon
          key={i}
          points={labels.map((_, j) => {
            const angle = -Math.PI / 2 + (j * 2 * Math.PI) / N;
            return [cx + r * f * Math.cos(angle), cy + r * f * Math.sin(angle)].join(',');
          }).join(' ')}
          fill="none"
          stroke="var(--line)"
          strokeWidth="1"
        />
      ))}
      {labels.map((_, i) => {
        const [x, y] = point(i, 100);
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="var(--line-soft)" strokeWidth="1" />;
      })}
      <polygon points={poly} fill="var(--primary)" fillOpacity="0.18" stroke="var(--primary)" strokeWidth="1.5" />
      {labels.map(([_, k], i) => {
        const [x, y] = point(i, values[k] ?? 0);
        return <circle key={k} cx={x} cy={y} r={3.5} fill="var(--primary-deep)" />;
      })}
      {labels.map(([label, k], i) => {
        const [x, y] = labelPos(i);
        const align = Math.abs(x - cx) < 10 ? 'middle' : x < cx ? 'end' : 'start';
        return (
          <text
            key={label}
            x={x}
            y={y}
            textAnchor={align}
            dominantBaseline="middle"
            fontFamily="Inter, sans-serif"
            fontSize="11"
            fill="var(--ink-soft)"
            letterSpacing="0.02em"
          >
            {label}
            <tspan x={x} dy="13" fontSize="10" fill="var(--ink-muted)" fontWeight="500">
              {values[k] ?? 0}
            </tspan>
          </text>
        );
      })}
    </svg>
  );
};

// Slow typing effect — for reveals
const TypeSlow = ({ text, speed = 22, onDone, style }) => {
  const [shown, setShown] = useState('');
  useEffect(() => {
    setShown('');
    let i = 0;
    const id = setInterval(() => {
      i++;
      setShown(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(id);
        onDone && onDone();
      }
    }, speed);
    return () => clearInterval(id);
  }, [text]);
  return <span style={style}>{shown}</span>;
};

// Gentle "AI sedang memikirkan..." indicator
const ThinkingIndicator = ({ label }) => {
  const { t } = useT();
  const finalLabel = label ?? t('session.thinking');
  return (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      color: 'var(--ink-muted)',
      fontFamily: 'Inter, sans-serif',
      fontSize: 13,
      fontStyle: 'italic',
    }}
  >
    <span style={{ display: 'inline-flex', gap: 4 }}>
      {[0, 1, 2].map(i => (
        <span
          key={i}
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: 'var(--primary)',
            animation: `mindfulPulse 2400ms ${i * 300}ms infinite ease-in-out`,
          }}
        />
      ))}
    </span>
    {finalLabel}…
  </div>
  );
};

// Sun/moon theme toggle — visible everywhere so users can switch without entering edit mode.
const ThemeToggle = ({ dark, onToggle }) => {
  const { t } = useT();
  return (
  <button
    onClick={onToggle}
    aria-label={dark ? t('theme.toLight') : t('theme.toDark')}
    title={dark ? t('theme.light') : t('theme.dark')}
    className="mf-press"
    style={{
      appearance: 'none',
      width: 38, height: 38, borderRadius: 999,
      border: '1px solid var(--line)',
      background: 'var(--bg-raised)',
      color: 'var(--ink-soft)',
      cursor: 'pointer',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      padding: 0,
    }}
  >
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
      style={{
        transition: 'transform 500ms cubic-bezier(.2,.8,.2,1), opacity 400ms ease',
        transform: dark ? 'rotate(0deg)' : 'rotate(-40deg)',
      }}>
      {dark ? (
        // Sun
        <>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </>
      ) : (
        // Moon
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      )}
    </svg>
  </button>
  );
};

// Compact language switcher — pill button with short label, opens dropdown of 4 natives.
const LANG_SHORT = { id: 'ID', en: 'EN', 'zh-CN': '简', 'zh-TW': '繁' };

const LangToggle = () => {
  const { t, lang, setLang } = useT();
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState(null);
  const btnRef = useRef(null);
  const popRef = useRef(null);

  // Recompute popover position from button rect — keeps it on-screen even when
  // ancestors clip (body overflow-x:hidden, transformed wrappers, etc.).
  const place = () => {
    const btn = btnRef.current;
    if (!btn) return;
    const r = btn.getBoundingClientRect();
    const vw = window.innerWidth;
    const margin = 12;
    const popWidth = 200;
    let right = vw - r.right;
    if (right + popWidth > vw - margin) right = margin;
    setCoords({ top: r.bottom + 8, right });
  };

  useEffect(() => {
    if (!open) return;
    place();
    const onDoc = (e) => {
      if (btnRef.current?.contains(e.target)) return;
      if (popRef.current?.contains(e.target)) return;
      setOpen(false);
    };
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    const onResize = () => place();
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', onResize, true);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onResize, true);
    };
  }, [open]);

  return (
    <>
      <button
        ref={btnRef}
        onClick={() => setOpen(o => !o)}
        aria-label={t('lang.toggleLabel')}
        title={LANG_META[lang]?.native || ''}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="mf-press"
        style={{
          appearance: 'none',
          height: 38, minWidth: 38, padding: '0 12px', borderRadius: 999,
          border: '1px solid var(--line)',
          background: 'var(--bg-raised)',
          color: 'var(--ink-soft)',
          cursor: 'pointer',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'Inter, sans-serif', fontSize: 13, letterSpacing: '0.04em',
          lineHeight: 1,
        }}
      >
        {LANG_SHORT[lang] || 'ID'}
      </button>
      {open && coords && (
        <div
          ref={popRef}
          role="listbox"
          style={{
            position: 'fixed', top: coords.top, right: coords.right, zIndex: 100,
            background: 'var(--bg-raised)', border: '1px solid var(--line)',
            borderRadius: 14, padding: 6, minWidth: 200,
            boxShadow: '0 20px 60px -20px rgba(0,0,0,0.28)',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          {LANGS.map(code => {
            const active = code === lang;
            return (
              <button
                key={code}
                role="option"
                aria-selected={active}
                onClick={() => { setLang(code); setOpen(false); }}
                style={{
                  appearance: 'none', display: 'flex', width: '100%',
                  alignItems: 'center', justifyContent: 'space-between', gap: 12,
                  padding: '9px 12px', borderRadius: 10,
                  border: 'none', cursor: 'pointer',
                  background: active ? 'var(--primary-soft)' : 'transparent',
                  color: 'var(--ink)', fontSize: 13, textAlign: 'left',
                }}
              >
                <span>{LANG_META[code].native}</span>
                <span style={{ fontSize: 11, color: 'var(--ink-muted)' }}>{LANG_SHORT[code]}</span>
              </button>
            );
          })}
        </div>
      )}
    </>
  );
};

export { BreathDot, SoftCard, PrimaryButton, QuietLink, DepthMeter, RadarChart, TypeSlow, ThinkingIndicator, ThemeToggle, LangToggle };
