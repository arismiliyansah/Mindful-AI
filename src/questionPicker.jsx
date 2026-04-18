import { useState } from 'react';
import { useT } from './i18n.js';
import { BreathDot, PrimaryButton, QuietLink } from './primitives.jsx';
import { NavBrand } from './landing.jsx';

const PRESETS = [
  { value: 7,  labelKey: 'questionPicker.short.label',    detailKey: 'questionPicker.short.detail',    noteKey: 'questionPicker.short.note' },
  { value: 9,  labelKey: 'questionPicker.standard.label', detailKey: 'questionPicker.standard.detail', noteKey: 'questionPicker.standard.note' },
  { value: 12, labelKey: 'questionPicker.deep.label',     detailKey: 'questionPicker.deep.detail',     noteKey: 'questionPicker.deep.note' },
];

const QuestionCountPicker = ({ initial, onConfirm, onCancel, onHome }) => {
  const { t } = useT();
  const safeInitial = PRESETS.find(p => p.value === initial)?.value ?? 9;
  const [picked, setPicked] = useState(safeInitial);

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)',
      display: 'flex', flexDirection: 'column',
    }}>
      <header className="mf-px mf-bar" style={{ paddingTop: 22, paddingBottom: 22, fontFamily: 'Inter, sans-serif' }}>
        <NavBrand onClick={onHome} iconSize={22} textSize={15} label={t('questionPicker.eyebrow')} />
        <QuietLink onClick={onCancel}>{t('questionPicker.cancel')}</QuietLink>
      </header>

      <main className="mf-px" style={{
        flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        paddingTop: 'clamp(20px, 4vw, 40px)', paddingBottom: 'clamp(36px, 8vw, 80px)',
      }}>
        <div style={{ maxWidth: 720, width: '100%' }}>
          <div className="mf-rise mf-rise-1" style={{ textAlign: 'center', marginBottom: 'clamp(24px, 4vw, 36px)' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              fontSize: 11, color: 'var(--ink-muted)', letterSpacing: '0.18em', textTransform: 'uppercase',
              marginBottom: 18,
            }}>
              <BreathDot size={7} />
              {t('questionPicker.eyebrow')}
            </div>
            <h1 className="mf-h2" style={{
              fontFamily: 'Fraunces, serif', fontWeight: 300,
              letterSpacing: '-0.02em', margin: 0,
            }}>
              {t('questionPicker.heading')}
            </h1>
            <p style={{
              marginTop: 14, color: 'var(--ink-soft)', fontFamily: 'Inter, sans-serif',
              fontSize: 15, lineHeight: 1.55,
            }}>
              {t('questionPicker.subheading')}
            </p>
          </div>

          <div className="mf-rise mf-rise-2 mf-3col">
            {PRESETS.map((p) => {
              const active = p.value === picked;
              return (
                <button
                  key={p.value}
                  onClick={() => setPicked(p.value)}
                  className="mf-press"
                  style={{
                    appearance: 'none', textAlign: 'left',
                    background: active ? 'var(--primary-soft)' : 'var(--bg-raised)',
                    border: `1px solid ${active ? 'var(--primary-deep)' : 'var(--line)'}`,
                    borderRadius: 18,
                    padding: 'clamp(16px, 2.5vw, 22px)',
                    cursor: 'pointer',
                    display: 'flex', flexDirection: 'column', gap: 8,
                    fontFamily: 'Inter, sans-serif',
                    color: 'var(--ink)',
                    transition: 'all 400ms cubic-bezier(.2,.8,.2,1)',
                  }}
                  onMouseEnter={e => !active && (e.currentTarget.style.borderColor = 'var(--primary)')}
                  onMouseLeave={e => !active && (e.currentTarget.style.borderColor = 'var(--line)')}
                >
                  <div style={{
                    fontFamily: 'Fraunces, serif', fontSize: 'clamp(20px, 2.6vw, 24px)',
                    fontWeight: 400, color: active ? 'var(--primary-deep)' : 'var(--ink)',
                    letterSpacing: '-0.01em',
                  }}>
                    {t(p.labelKey)}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--ink-soft)' }}>
                    {t(p.detailKey)}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--ink-muted)', fontStyle: 'italic', marginTop: 'auto', paddingTop: 6 }}>
                    {t(p.noteKey)}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mf-row-stack mf-rise mf-rise-3" style={{ marginTop: 32, justifyContent: 'center' }}>
            <PrimaryButton onClick={() => onConfirm(picked)}>
              {t('questionPicker.continue')}
            </PrimaryButton>
            <PrimaryButton ghost onClick={onCancel}>
              {t('questionPicker.cancel')}
            </PrimaryButton>
          </div>
        </div>
      </main>
    </div>
  );
};

export { QuestionCountPicker };
