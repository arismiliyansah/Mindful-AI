// Crisis screen — per PRD §7.4.
// Shown when crisis keywords detected. Warm, not alarmist.
import { BreathDot, PrimaryButton } from './primitives.jsx';
import { useT } from './i18n.js';

const HOTLINES = {
  id: [
    ['Into The Light Indonesia', '+62 119 ext. 8', 'Konseling krisis, bahasa Indonesia'],
    ['Kementerian Kesehatan RI', '119 ext. 8', 'Gratis, tersedia di seluruh Indonesia'],
    ['Yayasan Pulih', 'pulih.or.id', 'Layanan psikologi untuk berbagai kondisi'],
  ],
  en: [
    ['Befrienders Worldwide', 'befrienders.org', 'Find a helpline in your country'],
    ['Indonesia Ministry of Health', '119 ext. 8', 'Free 24h crisis line (Indonesia)'],
    ['Into The Light Indonesia', '+62 119 ext. 8', 'Crisis counseling (Indonesia)'],
  ],
  'zh-CN': [
    ['北京心理危机研究与干预中心', '010-82951332', '24 小时心理援助热线'],
    ['全国心理援助热线', '800-810-1117', '免费心理咨询 · 全国适用'],
    ['Befrienders Worldwide', 'befrienders.org', '查询你所在国家的求助热线'],
  ],
  'zh-TW': [
    ['安心專線', '1925', '24 小時免付費心理諮詢（台灣）'],
    ['生命線', '1995', '24 小時關懷協談專線'],
    ['張老師專線', '1980', '青年與心理協談服務'],
    ['Befrienders Worldwide', 'befrienders.org', '查詢所在地的求助熱線'],
  ],
};

const CrisisScreen = ({ context, onContinue, onPause, onExit }) => {
  const { t, lang } = useT();
  const hotlines = HOTLINES[lang] || HOTLINES.id;
  return (
    <div className="mf-px" style={{
      minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      paddingTop: 40, paddingBottom: 40, fontFamily: 'Inter, sans-serif',
    }}>
      <div style={{ maxWidth: 620, width: '100%' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 10,
          padding: '7px 14px', borderRadius: 999,
          background: 'color-mix(in oklab, var(--crisis) 12%, transparent)',
          fontSize: 12, letterSpacing: '0.06em', color: 'var(--crisis)', marginBottom: 28,
        }}>
          <BreathDot size={7} color="var(--crisis)" />
          {t('crisis.eyebrow')}
        </div>

        <h1 className="mf-h1" style={{
          fontFamily: 'Fraunces, serif', fontWeight: 300,
          letterSpacing: '-0.025em', margin: 0, color: 'var(--ink)',
        }}>
          <em style={{ fontStyle: 'italic' }}>{t('crisis.title.italic')}</em><br/>
          {t('crisis.title.rest')}
        </h1>

        <p style={{
          marginTop: 28, fontSize: 17, lineHeight: 1.65, color: 'var(--ink-soft)',
        }}>
          {t('crisis.body')}
        </p>

        {/* Hotlines */}
        <div style={{
          marginTop: 34, padding: 'clamp(18px, 3vw, 28px)', borderRadius: 18, background: 'var(--bg-raised)',
          border: '1px solid var(--line)',
        }}>
          <div style={{
            fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase',
            color: 'var(--ink-muted)', marginBottom: 18,
          }}>
            {t('crisis.hotlinesLabel')}
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 18 }}>
            {hotlines.map(([name, contact, desc]) => (
              <li key={name} className="mf-line-row">
                <div>
                  <div style={{ fontFamily: 'Fraunces, serif', fontSize: 20, fontWeight: 400, letterSpacing: '-0.005em' }}>{name}</div>
                  <div style={{ fontSize: 13, color: 'var(--ink-muted)', marginTop: 2 }}>{desc}</div>
                </div>
                <div style={{
                  fontFamily: 'Fraunces, serif', fontSize: 18, fontStyle: 'italic',
                  color: 'var(--primary-deep)', fontVariantNumeric: 'tabular-nums',
                }}>{contact}</div>
              </li>
            ))}
          </ul>
        </div>

        <div className="mf-row-stack" style={{ marginTop: 36, gap: 12 }}>
          <PrimaryButton onClick={onPause}>{t('crisis.pauseBtn')}</PrimaryButton>
          <PrimaryButton ghost onClick={onContinue}>{t('crisis.continueBtn')}</PrimaryButton>
          <PrimaryButton ghost onClick={onExit}>{t('crisis.exitBtn')}</PrimaryButton>
        </div>

        <p style={{ marginTop: 28, fontSize: 12, color: 'var(--ink-muted)', lineHeight: 1.6 }}>
          {t('crisis.disclaimer')}
        </p>
      </div>
    </div>
  );
};

export { CrisisScreen };
