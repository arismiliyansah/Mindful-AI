// Info pages: How it works, Privacy & safety, For professionals.
// Shared layout — header bar + back link, scrollable narrow column body.
import { useEffect } from 'react';
import { NavBrand } from './landing.jsx';
import { BreathDot, ThemeToggle, LangToggle } from './primitives.jsx';
import { useT } from './i18n.js';

const InfoLayout = ({ eyebrow, titleItalic, titleRest, intro, children, onBack, onHome, dark, onToggleDark }) => {
  const { t } = useT();
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)', fontFamily: 'Inter, sans-serif' }}>
      <header className="mf-px mf-bar" style={{ paddingTop: 22, paddingBottom: 22 }}>
        <NavBrand onClick={onHome} iconSize={22} textSize={15} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <LangToggle />
          <ThemeToggle dark={dark} onToggle={onToggleDark} />
          <button
            onClick={onBack}
            className="mf-press"
            style={{
              appearance: 'none', background: 'transparent', border: '1px solid var(--line)',
              color: 'var(--ink-soft)', fontSize: 13, cursor: 'pointer',
              padding: '8px 14px', borderRadius: 999,
            }}
          >
            ← {t('info.back')}
          </button>
        </div>
      </header>

      <main className="mf-px" style={{
        maxWidth: 720, margin: '0 auto',
        paddingTop: 'clamp(24px, 5vw, 56px)',
        paddingBottom: 'clamp(48px, 7vw, 96px)',
      }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 10,
          padding: '7px 14px', borderRadius: 999,
          background: 'var(--primary-soft)', color: 'var(--primary-deep)',
          fontSize: 12, letterSpacing: '0.06em', marginBottom: 28,
        }}>
          <BreathDot size={7} color="var(--primary-deep)" />
          {eyebrow}
        </div>
        <h1 className="mf-h1" style={{
          fontFamily: 'Fraunces, serif', fontWeight: 300,
          letterSpacing: '-0.025em', margin: 0, color: 'var(--ink)',
        }}>
          <em style={{ fontStyle: 'italic' }}>{titleItalic}</em><br />
          {titleRest}
        </h1>
        <p style={{
          marginTop: 28, fontSize: 17, lineHeight: 1.65, color: 'var(--ink-soft)',
        }}>
          {intro}
        </p>
        <div style={{ marginTop: 44, display: 'flex', flexDirection: 'column', gap: 28 }}>
          {children}
        </div>
      </main>
    </div>
  );
};

const Section = ({ title, children }) => (
  <section style={{
    padding: 'clamp(20px, 3vw, 28px)',
    borderRadius: 18,
    background: 'var(--bg-raised)',
    border: '1px solid var(--line)',
  }}>
    <h2 style={{
      fontFamily: 'Fraunces, serif', fontSize: 22, fontWeight: 400,
      letterSpacing: '-0.01em', margin: '0 0 12px',
    }}>{title}</h2>
    <div style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--ink-soft)' }}>
      {children}
    </div>
  </section>
);

const StepRow = ({ n, title, body }) => (
  <div style={{ display: 'flex', gap: 18, alignItems: 'flex-start' }}>
    <div style={{
      flex: '0 0 auto',
      width: 36, height: 36, borderRadius: '50%',
      background: 'var(--primary-soft)', color: 'var(--primary-deep)',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Fraunces, serif', fontSize: 16, fontStyle: 'italic',
    }}>{n}</div>
    <div style={{ flex: '1 1 auto', minWidth: 0 }}>
      <h3 style={{
        fontFamily: 'Fraunces, serif', fontSize: 19, fontWeight: 400,
        margin: '4px 0 6px', letterSpacing: '-0.005em',
      }}>{title}</h3>
      <p style={{ margin: 0, fontSize: 15, lineHeight: 1.65, color: 'var(--ink-soft)' }}>{body}</p>
    </div>
  </div>
);

const HowItWorksScreen = ({ onBack, onHome, dark, onToggleDark }) => {
  const { t } = useT();
  return (
    <InfoLayout
      eyebrow={t('howItWorks.eyebrow')}
      titleItalic={t('howItWorks.title.italic')}
      titleRest={t('howItWorks.title.rest')}
      intro={t('howItWorks.intro')}
      onBack={onBack} onHome={onHome} dark={dark} onToggleDark={onToggleDark}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
        {[1, 2, 3, 4].map(n => (
          <StepRow key={n} n={n}
            title={t(`howItWorks.step.${n}.title`)}
            body={t(`howItWorks.step.${n}.body`)} />
        ))}
      </div>
      <Section title={t('howItWorks.techNote.title')}>
        {t('howItWorks.techNote.body')}
      </Section>
    </InfoLayout>
  );
};

const PrivacyScreen = ({ onBack, onHome, dark, onToggleDark }) => {
  const { t } = useT();
  const sections = ['storage', 'api', 'crisis', 'rights'];
  return (
    <InfoLayout
      eyebrow={t('privacy.eyebrow')}
      titleItalic={t('privacy.title.italic')}
      titleRest={t('privacy.title.rest')}
      intro={t('privacy.intro')}
      onBack={onBack} onHome={onHome} dark={dark} onToggleDark={onToggleDark}
    >
      {sections.map(key => (
        <Section key={key} title={t(`privacy.section.${key}.title`)}>
          {t(`privacy.section.${key}.body`)}
        </Section>
      ))}
      <p style={{
        margin: 0, fontSize: 13, lineHeight: 1.65, color: 'var(--ink-muted)',
        padding: '16px 18px', borderLeft: '2px solid var(--line)',
      }}>
        {t('privacy.disclaimer')}
      </p>
    </InfoLayout>
  );
};

const ForProsScreen = ({ onBack, onHome, dark, onToggleDark }) => {
  const { t } = useT();
  const email = t('info.contactEmail');
  const sections = ['useCase', 'share', 'limits'];
  return (
    <InfoLayout
      eyebrow={t('forPros.eyebrow')}
      titleItalic={t('forPros.title.italic')}
      titleRest={t('forPros.title.rest')}
      intro={t('forPros.intro')}
      onBack={onBack} onHome={onHome} dark={dark} onToggleDark={onToggleDark}
    >
      {sections.map(key => (
        <Section key={key} title={t(`forPros.section.${key}.title`)}>
          {t(`forPros.section.${key}.body`)}
        </Section>
      ))}
      <Section title={t('forPros.contact.title')}>
        <p style={{ margin: '0 0 10px' }}>{t('forPros.contact.body')}</p>
        <a
          href={`mailto:${email}`}
          style={{
            fontFamily: 'Fraunces, serif', fontStyle: 'italic',
            fontSize: 18, color: 'var(--primary-deep)',
            textDecoration: 'none', borderBottom: '1px dashed var(--primary-deep)',
            paddingBottom: 1,
          }}
        >{email}</a>
      </Section>
    </InfoLayout>
  );
};

const AboutScreen = ({ onBack, onHome, dark, onToggleDark }) => {
  const { t } = useT();
  const sections = ['story', 'approach', 'team'];
  return (
    <InfoLayout
      eyebrow={t('about.eyebrow')}
      titleItalic={t('about.title.italic')}
      titleRest={t('about.title.rest')}
      intro={t('about.intro')}
      onBack={onBack} onHome={onHome} dark={dark} onToggleDark={onToggleDark}
    >
      {sections.map(key => (
        <Section key={key} title={t(`about.section.${key}.title`)}>
          {t(`about.section.${key}.body`)}
        </Section>
      ))}
    </InfoLayout>
  );
};

// Personal dedication letter — content lives in i18n (forHoney.*).
const ForHoneyScreen = ({ onBack, onHome, dark, onToggleDark }) => {
  const { t } = useT();
  useEffect(() => { window.scrollTo(0, 0); }, []);
  const paragraphs = ['p1', 'p2', 'p3', 'p4'];
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)', fontFamily: 'Inter, sans-serif' }}>
      <header className="mf-px mf-bar" style={{ paddingTop: 22, paddingBottom: 22 }}>
        <NavBrand onClick={onHome} iconSize={22} textSize={15} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <LangToggle />
          <ThemeToggle dark={dark} onToggle={onToggleDark} />
          <button
            onClick={onBack}
            className="mf-press"
            style={{
              appearance: 'none', background: 'transparent', border: '1px solid var(--line)',
              color: 'var(--ink-soft)', fontSize: 13, cursor: 'pointer',
              padding: '8px 14px', borderRadius: 999,
            }}
          >
            ← {t('info.back')}
          </button>
        </div>
      </header>

      <main className="mf-px" style={{
        maxWidth: 620, margin: '0 auto',
        paddingTop: 'clamp(40px, 8vw, 88px)',
        paddingBottom: 'clamp(64px, 9vw, 112px)',
      }}>
        <div style={{
          fontFamily: 'Fraunces, serif', fontStyle: 'italic',
          fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase',
          color: 'var(--ink-muted)', marginBottom: 28,
        }}>
          {t('forHoney.eyebrow')}
        </div>

        <h1 style={{
          fontFamily: 'Fraunces, serif', fontWeight: 300, fontStyle: 'italic',
          fontSize: 'clamp(40px, 7vw, 64px)', letterSpacing: '-0.025em',
          margin: 0, color: 'var(--ink)', lineHeight: 1.1,
        }}>
          {t('forHoney.title')}
        </h1>

        <div style={{
          marginTop: 'clamp(36px, 5vw, 56px)',
          display: 'flex', flexDirection: 'column', gap: 22,
          maxWidth: 560,
        }}>
          <p style={{ margin: 0, fontSize: 17, lineHeight: 1.75, color: 'var(--ink-soft)' }}>
            {t('forHoney.greeting')}
          </p>
          {paragraphs.map((key) => (
            <p key={key} style={{ margin: 0, fontSize: 17, lineHeight: 1.75, color: 'var(--ink-soft)' }}>
              {t(`forHoney.${key}`)}
            </p>
          ))}
        </div>

        <div style={{ marginTop: 'clamp(40px, 6vw, 64px)' }}>
          <div style={{
            fontFamily: 'Fraunces, serif', fontStyle: 'italic',
            fontSize: 22, color: 'var(--ink)', marginBottom: 8,
          }}>
            {t('forHoney.signOff')}
          </div>
          <div style={{ fontSize: 13, color: 'var(--ink-muted)', letterSpacing: '0.04em' }}>
            {t('forHoney.location')}
          </div>
        </div>
      </main>
    </div>
  );
};

export { HowItWorksScreen, PrivacyScreen, ForProsScreen, AboutScreen, ForHoneyScreen };
