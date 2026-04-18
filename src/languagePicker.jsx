import { LANGS, LANG_META } from './i18n.js';
import { BreathDot } from './primitives.jsx';

const LanguagePickerScreen = ({ onSelect }) => {
  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: 'clamp(24px, 5vw, 48px)',
    }}>
      <div style={{ maxWidth: 720, width: '100%' }}>
        <div className="mf-rise mf-rise-1" style={{ textAlign: 'center', marginBottom: 'clamp(28px, 5vw, 44px)' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            padding: '7px 14px', borderRadius: 999, background: 'var(--primary-soft)',
            fontFamily: 'Inter, sans-serif', fontSize: 12, color: 'var(--primary-deep)',
            letterSpacing: '0.04em', marginBottom: 22,
          }}>
            <BreathDot size={8} color="var(--primary-deep)" />
            Mindful AI
          </div>
          <h1 className="mf-h2" style={{
            fontFamily: 'Fraunces, serif', fontWeight: 300,
            letterSpacing: '-0.02em', margin: 0, lineHeight: 1.25,
          }}>
            Pilih bahasa<br />
            <span style={{ fontStyle: 'italic', color: 'var(--ink-soft)' }}>· Choose language ·</span><br />
            选择语言 · 選擇語言
          </h1>
          <p style={{
            marginTop: 18, color: 'var(--ink-soft)', fontFamily: 'Inter, sans-serif',
            fontSize: 14,
          }}>
            Pilihan ini bisa kamu ubah lagi nanti.
          </p>
        </div>

        <div className="mf-2col mf-rise mf-rise-2">
          {LANGS.map((code) => {
            const meta = LANG_META[code];
            return (
              <button
                key={code}
                onClick={() => onSelect(code)}
                className="mf-card-hover mf-press"
                style={{
                  appearance: 'none', textAlign: 'left',
                  background: 'var(--bg-raised)',
                  border: '1px solid var(--line)',
                  borderRadius: 22,
                  padding: 'clamp(20px, 3vw, 28px)',
                  cursor: 'pointer',
                  display: 'flex', flexDirection: 'column', gap: 10,
                  fontFamily: 'Inter, sans-serif',
                  color: 'var(--ink)',
                  minHeight: 140,
                }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--primary)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--line)')}
              >
                <div style={{
                  fontFamily: 'Fraunces, serif', fontSize: 'clamp(22px, 3vw, 28px)',
                  fontWeight: 400, letterSpacing: '-0.01em', color: 'var(--ink)',
                  lineHeight: 1.2,
                }}>
                  {meta.native}
                </div>
                <div style={{ fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.5 }}>
                  {meta.sample}
                </div>
                <div style={{
                  marginTop: 'auto', fontSize: 12, color: 'var(--primary-deep)',
                  letterSpacing: '0.06em', textTransform: 'uppercase', paddingTop: 12,
                }}>
                  {code}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export { LanguagePickerScreen };
