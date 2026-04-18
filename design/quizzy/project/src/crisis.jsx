// Crisis screen — per PRD §7.4.
// Shown when crisis keywords detected. Warm, not alarmist.
const CrisisScreen = ({ context, onContinue, onPause, onExit }) => {
  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 40, fontFamily: 'Inter, sans-serif',
    }}>
      <div style={{ maxWidth: 620, width: '100%' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 10,
          padding: '7px 14px', borderRadius: 999,
          background: 'color-mix(in oklab, var(--crisis) 12%, transparent)',
          fontSize: 12, letterSpacing: '0.06em', color: 'var(--crisis)', marginBottom: 28,
        }}>
          <BreathDot size={7} color="var(--crisis)" />
          Sesi dijeda sebentar
        </div>

        <h1 style={{
          fontFamily: 'Fraunces, serif', fontWeight: 300, fontSize: 52,
          letterSpacing: '-0.025em', lineHeight: 1.12, margin: 0, color: 'var(--ink)',
        }}>
          <em style={{ fontStyle: 'italic' }}>Aku mendengarmu.</em><br/>
          Kamu tidak harus menghadapinya sendirian.
        </h1>

        <p style={{
          marginTop: 28, fontSize: 17, lineHeight: 1.65, color: 'var(--ink-soft)',
        }}>
          Apa yang kamu alami berat, dan keberanianmu untuk menuliskannya di sini berarti sesuatu.
          Sebelum kita lanjut, aku ingin memastikan kamu tahu — ada orang yang siap mendengarkan, kapan saja.
        </p>

        {/* Hotlines */}
        <div style={{
          marginTop: 34, padding: 28, borderRadius: 18, background: 'var(--bg-raised)',
          border: '1px solid var(--line)',
        }}>
          <div style={{
            fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase',
            color: 'var(--ink-muted)', marginBottom: 18,
          }}>
            Layanan krisis · 24 jam
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 18 }}>
            {[
              ['Into The Light Indonesia', '+62 119 ext. 8', 'Konseling krisis, bahasa Indonesia'],
              ['Kementerian Kesehatan RI', '119 ext. 8', 'Gratis, tersedia di seluruh Indonesia'],
              ['Yayasan Pulih', 'pulih.or.id', 'Layanan psikologi untuk berbagai kondisi'],
            ].map(([name, contact, desc]) => (
              <li key={name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 20 }}>
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

        <div style={{ marginTop: 36, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <PrimaryButton onClick={onPause}>Aku butuh jeda dulu</PrimaryButton>
          <PrimaryButton ghost onClick={onContinue}>Lanjutkan sesi perlahan</PrimaryButton>
          <PrimaryButton ghost onClick={onExit}>Keluar ke sumber bantuan</PrimaryButton>
        </div>

        <p style={{ marginTop: 28, fontSize: 12, color: 'var(--ink-muted)', lineHeight: 1.6 }}>
          Tidak ada data crisis yang dibagikan ke pihak ketiga tanpa persetujuanmu.
          Mindful AI bukan terapis — dan itulah sebabnya rujukan di atas penting.
        </p>
      </div>
    </div>
  );
};

Object.assign(window, { CrisisScreen });
