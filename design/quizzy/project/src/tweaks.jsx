// Tweaks panel — in-design controls surfaced when Edit mode is on.
const { useState: uSTw, useEffect: uETw } = React;

const ACCENT_PRESETS = [
  { id: 'teal', name: 'Teal · default', primary: '#5DCAA5', primaryDeep: '#3FA886', primarySoft: '#D8F0E5',
    accent: '#F0997B', accentDeep: '#D97B5C', accentSoft: '#FBE3D8' },
  { id: 'lavender', name: 'Lavender senja', primary: '#A598D4', primaryDeep: '#7D6FB3', primarySoft: '#EAE4F5',
    accent: '#E8A598', accentDeep: '#C68578', accentSoft: '#F6E2DC' },
  { id: 'sage', name: 'Sage pagi', primary: '#9AB88A', primaryDeep: '#75966A', primarySoft: '#E5EEDF',
    accent: '#D9A878', accentDeep: '#B88555', accentSoft: '#F0E1CF' },
  { id: 'sand', name: 'Pasir hangat', primary: '#C9A572', primaryDeep: '#A27F4F', primarySoft: '#F0E4CF',
    accent: '#8DA8B5', accentDeep: '#678291', accentSoft: '#DDE7EC' },
];

const TONES = [
  { id: 'reflective', label: 'Reflektif (default)' },
  { id: 'warm', label: 'Hangat & puitis' },
  { id: 'practical', label: 'Praktis & membumi' },
];

const TweaksPanel = ({ tweaks, setTweaks }) => {
  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24, width: 320,
      background: 'var(--bg-raised)', border: '1px solid var(--line)',
      borderRadius: 18, padding: 20,
      boxShadow: '0 30px 80px -30px rgba(0,0,0,0.25)',
      zIndex: 50, fontFamily: 'Inter, sans-serif',
    }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: 18,
      }}>
        <div style={{ fontFamily: 'Fraunces, serif', fontSize: 18, letterSpacing: '-0.01em' }}>Tweaks</div>
        <div style={{
          fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-muted)',
        }}>Live</div>
      </div>

      {/* Palette */}
      <div style={{ marginBottom: 18 }}>
        <div style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: 10 }}>
          Palet
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
          {ACCENT_PRESETS.map(p => (
            <button key={p.id}
              onClick={() => setTweaks({ palette: p.id })}
              title={p.name}
              style={{
                appearance: 'none', border: tweaks.palette === p.id ? `2px solid var(--ink)` : '1px solid var(--line)',
                borderRadius: 12, padding: 6, background: 'transparent', cursor: 'pointer',
                display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center',
              }}>
              <div style={{ display: 'flex', gap: 4 }}>
                <div style={{ width: 14, height: 14, borderRadius: '50%', background: p.primary }} />
                <div style={{ width: 14, height: 14, borderRadius: '50%', background: p.accent }} />
              </div>
              <div style={{ fontSize: 9, color: 'var(--ink-soft)', textAlign: 'center', lineHeight: 1.2 }}>
                {p.name.split(' ')[0]}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Dark mode */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
        <div style={{ fontSize: 13, color: 'var(--ink)' }}>Mode gelap</div>
        <button onClick={() => setTweaks({ dark: !tweaks.dark })}
          style={{
            width: 44, height: 24, borderRadius: 999, border: 'none',
            background: tweaks.dark ? 'var(--primary-deep)' : 'var(--line)',
            position: 'relative', cursor: 'pointer', transition: 'background 400ms',
          }}>
          <span style={{
            position: 'absolute', top: 3, left: tweaks.dark ? 23 : 3,
            width: 18, height: 18, borderRadius: '50%',
            background: 'var(--bg-raised)',
            transition: 'left 400ms cubic-bezier(.2,.8,.2,1)',
          }} />
        </button>
      </div>

      {/* Session length */}
      <div style={{ marginBottom: 18 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 10 }}>
          <span>Panjang sesi</span>
          <span style={{ color: 'var(--ink-muted)' }}>{tweaks.questions} pertanyaan</span>
        </div>
        <input type="range" min="7" max="12" value={tweaks.questions}
          onChange={e => setTweaks({ questions: +e.target.value })}
          style={{ width: '100%', accentColor: 'var(--primary-deep)' }} />
      </div>

      {/* Tone */}
      <div style={{ marginBottom: 8 }}>
        <div style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: 10 }}>
          Gaya bahasa AI
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {TONES.map(t => (
            <button key={t.id} onClick={() => setTweaks({ tone: t.id })}
              style={{
                appearance: 'none', textAlign: 'left', padding: '9px 12px',
                background: tweaks.tone === t.id ? 'var(--primary-soft)' : 'transparent',
                border: `1px solid ${tweaks.tone === t.id ? 'var(--primary-deep)' : 'var(--line)'}`,
                borderRadius: 10, fontSize: 13, cursor: 'pointer', color: 'var(--ink)',
                fontFamily: 'Inter, sans-serif',
              }}>
              {t.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { TweaksPanel, ACCENT_PRESETS });
