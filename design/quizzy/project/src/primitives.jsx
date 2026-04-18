// Shared primitives: breathing dot, soft card, button, etc.
// Uses window.MindfulTokens via CSS vars set on :root.

const { useState, useEffect, useRef } = React;

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
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: 'Inter, sans-serif' }}>
      <span style={{ fontSize: 11, color: 'var(--ink-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
        Permukaan
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
        Inti
      </span>
    </div>
  );
};

// Radar chart for 6 emotional dimensions — hand-drawn SVG, no libs
const RadarChart = ({ values, size = 280 }) => {
  // values: { ketenangan, kesadaranDiri, resiliensi, koneksiSosial, regulasiEmosi, harapan } (0-100)
  const labels = [
    ['Ketenangan', 'ketenangan'],
    ['Kesadaran diri', 'kesadaranDiri'],
    ['Resiliensi', 'resiliensi'],
    ['Koneksi sosial', 'koneksiSosial'],
    ['Regulasi emosi', 'regulasiEmosi'],
    ['Harapan', 'harapan'],
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
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ overflow: 'visible' }}>
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
const ThinkingIndicator = ({ label = "Sedang mendengarkan" }) => (
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
    {label}…
  </div>
);

Object.assign(window, { BreathDot, SoftCard, PrimaryButton, QuietLink, DepthMeter, RadarChart, TypeSlow, ThinkingIndicator });
