// Session screen — adaptive AI-powered reflective conversation
// Uses window.claude.complete for real AI; falls back to seed content.

const { useState: uS, useEffect: uE, useRef: uR } = React;

// Basic crisis detection — per PRD §6.1 safety note.
const CRISIS_KEYWORDS = [
  'bunuh diri', 'akhiri hidup', 'ingin mati', 'menyakiti diri', 'melukai diri',
  'tidak ingin hidup', 'lebih baik mati', 'gak mau hidup', 'overdosis',
];
const detectCrisis = (text) => {
  const t = (text || '').toLowerCase();
  return CRISIS_KEYWORDS.some(k => t.includes(k));
};

async function askAIForNextQuestion(transcript, depth, total) {
  // transcript: [{q, a}...]
  const sys = `Kamu adalah Mindful AI — teman refleksi berbahasa Indonesia. Kamu TIDAK pernah memberi diagnosis. Tonemu hangat, jujur, tidak menjilat, menggunakan kata "kamu". Tugasmu: buat SATU pertanyaan reflektif berikutnya yang sedikit lebih dalam dari pertanyaan sebelumnya, berdasarkan jawaban pengguna. Jangan ulangi pertanyaan. Jangan beri nasihat. Fokus ke perasaan, pola, atau makna.

Output WAJIB JSON valid tanpa penjelasan lain:
{"question":"pertanyaannya...","options":["4 pilihan singkat","yang bisa mewakili","berbagai perasaan","termasuk 'aku belum tahu'"]}
Pilihan harus terasa manusiawi, bukan klinis. Panjang pertanyaan 12-24 kata.`;

  const history = transcript.map(t => `- Pertanyaan: "${t.q}"\n  Jawaban: "${t.a}"`).join('\n');
  const user = `Konteks sesi sejauh ini (kedalaman ${depth}/${total}):\n${history}\n\nBuat pertanyaan ke-${depth + 1}. Harus lebih reflektif dari sebelumnya.`;

  try {
    const resp = await window.claude.complete({
      messages: [
        { role: 'user', content: sys + '\n\n' + user },
      ],
    });
    // extract JSON
    const match = resp.match(/\{[\s\S]*\}/);
    if (!match) throw new Error('no json');
    const parsed = JSON.parse(match[0]);
    if (!parsed.question || !Array.isArray(parsed.options)) throw new Error('bad shape');
    return { question: parsed.question, options: parsed.options.slice(0, 4), depth: depth + 1 };
  } catch (e) {
    console.warn('AI fallback:', e);
    const fb = window.MindfulSeed.fallbackFollowups;
    return fb[Math.min(depth - 1, fb.length - 1)];
  }
}

async function askAIForAnalysis(transcript) {
  const sys = `Kamu adalah Mindful AI. Berdasarkan transkrip sesi refleksi di bawah, buat profil emosional pengguna dalam Bahasa Indonesia dengan tone hangat dan jujur (tanpa diagnosis klinis).

Output WAJIB JSON valid:
{
  "archetype": "nama arketipe puitis 2-4 kata, bukan label klinis",
  "subtitle": "satu kalimat penjelasan singkat (maks 12 kata)",
  "narrative": "naratif 130-180 kata, pakai kata 'kamu', reflektif dan spesifik",
  "dimensions": {"ketenangan":0-100,"kesadaranDiri":0-100,"resiliensi":0-100,"koneksiSosial":0-100,"regulasiEmosi":0-100,"harapan":0-100},
  "themes": [{"label":"2-4 kata","note":"satu kalimat"}],
  "strengths": ["3 poin singkat"],
  "growth": ["3 poin"],
  "recommendations": [{"kind":"Latihan harian|Refleksi mingguan|Tanda untuk mencari bantuan","title":"...","why":"..."}]
}`;
  const body = transcript.map((t, i) => `${i+1}. T: ${t.q}\n   J: ${t.a}`).join('\n');
  try {
    const resp = await window.claude.complete({
      messages: [{ role: 'user', content: sys + '\n\nTranskrip:\n' + body }],
    });
    const match = resp.match(/\{[\s\S]*\}/);
    const parsed = JSON.parse(match[0]);
    // basic validation
    if (!parsed.archetype || !parsed.dimensions) throw new Error('bad');
    return parsed;
  } catch (e) {
    console.warn('Analysis fallback:', e);
    return window.MindfulSeed.fallbackAnalysis;
  }
}

const SessionScreen = ({ totalQuestions, onFinish, onCrisis, onExit }) => {
  const [current, setCurrent] = uS(window.MindfulSeed.openingQuestion);
  const [transcript, setTranscript] = uS([]);
  const [freeText, setFreeText] = uS('');
  const [thinking, setThinking] = uS(false);
  const [paused, setPaused] = uS(false);
  const [selected, setSelected] = uS(null);
  const [enterKey, setEnterKey] = uS(0); // for re-animating question entry
  const scrollRef = uR(null);

  const submitAnswer = async (answer) => {
    if (detectCrisis(answer)) {
      onCrisis({ lastQuestion: current.question, lastAnswer: answer });
      return;
    }
    const nextTranscript = [...transcript, { q: current.question, a: answer }];
    setTranscript(nextTranscript);
    setFreeText('');
    setSelected(null);

    if (nextTranscript.length >= totalQuestions) {
      setThinking(true);
      const analysis = await askAIForAnalysis(nextTranscript);
      onFinish({ transcript: nextTranscript, analysis });
      return;
    }

    setThinking(true);
    const next = await askAIForNextQuestion(nextTranscript, current.depth, totalQuestions);
    // slow the transition intentionally (tenang + lambat per PRD §9.1)
    await new Promise(r => setTimeout(r, 900));
    setCurrent(next);
    setThinking(false);
    setEnterKey(k => k + 1);
  };

  const skip = () => submitAnswer('(dilewati)');
  const pick = (opt) => { setSelected(opt); setTimeout(() => submitAnswer(opt), 500); };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)', display: 'flex', flexDirection: 'column' }}>
      {/* Minimal session nav */}
      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '22px 40px', fontFamily: 'Inter, sans-serif',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <WordmarkMark size={20} />
          <span style={{ fontFamily: 'Fraunces, serif', fontSize: 14, color: 'var(--ink-soft)' }}>
            Sesi refleksi
          </span>
        </div>
        <DepthMeter depth={current.depth} total={totalQuestions} />
        <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
          <QuietLink onClick={() => setPaused(true)}>Jeda</QuietLink>
          <QuietLink onClick={onExit}>Keluar</QuietLink>
        </div>
      </header>

      {/* Body */}
      <main
        ref={scrollRef}
        style={{
          flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
          padding: '40px 24px 100px', justifyContent: 'center',
        }}
      >
        <div style={{ maxWidth: 640, width: '100%' }}>
          {/* Question eyebrow */}
          <div style={{
            fontFamily: 'Inter, sans-serif', fontSize: 11, letterSpacing: '0.2em',
            textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: 28,
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <BreathDot size={7} />
            Pertanyaan {current.depth} dari {totalQuestions}
          </div>

          {/* The question itself */}
          <div
            key={enterKey}
            style={{
              animation: 'mindfulFadeUp 1200ms cubic-bezier(.2,.8,.2,1)',
            }}
          >
            <h1 style={{
              fontFamily: 'Fraunces, serif', fontWeight: 300, fontSize: 40, lineHeight: 1.25,
              letterSpacing: '-0.02em', margin: 0, color: 'var(--ink)',
            }}>
              {current.question}
            </h1>
          </div>

          {/* Options */}
          <div style={{ marginTop: 40, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {current.options.map((opt, i) => (
              <button
                key={opt + i}
                disabled={thinking}
                onClick={() => pick(opt)}
                style={{
                  appearance: 'none', textAlign: 'left',
                  background: selected === opt ? 'var(--primary-soft)' : 'var(--bg-raised)',
                  border: `1px solid ${selected === opt ? 'var(--primary-deep)' : 'var(--line)'}`,
                  borderRadius: 14, padding: '16px 20px',
                  fontFamily: 'Inter, sans-serif', fontSize: 15, color: 'var(--ink)',
                  cursor: thinking ? 'default' : 'pointer', lineHeight: 1.4,
                  transition: 'all 500ms cubic-bezier(.2,.8,.2,1)',
                  animation: `mindfulFadeUp ${900 + i * 140}ms cubic-bezier(.2,.8,.2,1)`,
                  opacity: thinking ? 0.5 : 1,
                }}
                onMouseEnter={e => !thinking && (e.currentTarget.style.borderColor = 'var(--primary)')}
                onMouseLeave={e => !thinking && selected !== opt && (e.currentTarget.style.borderColor = 'var(--line)')}
              >
                {opt}
              </button>
            ))}
          </div>

          {/* Free text */}
          <div style={{ marginTop: 22 }}>
            <div style={{ fontSize: 12, color: 'var(--ink-muted)', fontFamily: 'Inter, sans-serif', marginBottom: 8 }}>
              atau — tulis dengan kata-katamu sendiri
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <input
                value={freeText}
                onChange={e => setFreeText(e.target.value)}
                disabled={thinking}
                onKeyDown={e => e.key === 'Enter' && freeText.trim() && submitAnswer(freeText.trim())}
                placeholder="Pelan saja, satu kalimat cukup…"
                style={{
                  flex: 1, padding: '14px 18px', borderRadius: 12,
                  border: '1px solid var(--line)', background: 'var(--bg-raised)',
                  fontFamily: 'Inter, sans-serif', fontSize: 15, color: 'var(--ink)',
                  outline: 'none',
                }}
                onFocus={e => (e.target.style.borderColor = 'var(--primary)')}
                onBlur={e => (e.target.style.borderColor = 'var(--line)')}
              />
              <PrimaryButton
                onClick={() => freeText.trim() && submitAnswer(freeText.trim())}
                disabled={thinking || !freeText.trim()}
              >
                Lanjut
              </PrimaryButton>
            </div>
          </div>

          {/* Skip + thinking row */}
          <div style={{
            marginTop: 22, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <QuietLink onClick={skip}>Lewati pertanyaan ini</QuietLink>
            {thinking && <ThinkingIndicator label="Sedang mendengarkan" />}
          </div>
        </div>
      </main>

      {/* Pause overlay */}
      {paused && (
        <div style={{
          position: 'fixed', inset: 0, background: 'color-mix(in oklab, var(--bg) 88%, transparent)',
          backdropFilter: 'blur(14px)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 40,
        }}>
          <div style={{ textAlign: 'center', maxWidth: 420, fontFamily: 'Inter, sans-serif' }}>
            <div style={{ margin: '0 auto 28px' }}>
              <div style={{
                width: 120, height: 120, borderRadius: '50%', margin: '0 auto',
                background: 'var(--primary-soft)',
                animation: 'mindfulBreathe 8s ease-in-out infinite',
              }} />
            </div>
            <h3 style={{ fontFamily: 'Fraunces, serif', fontWeight: 400, fontSize: 28, margin: '0 0 12px' }}>
              Sebentar saja, tidak apa-apa.
            </h3>
            <p style={{ color: 'var(--ink-soft)', fontSize: 15, lineHeight: 1.6 }}>
              Ambil napas. Refleksimu tidak hilang. Lanjutkan kapan kamu siap.
            </p>
            <div style={{ marginTop: 28, display: 'flex', justifyContent: 'center', gap: 12 }}>
              <PrimaryButton onClick={() => setPaused(false)}>Lanjutkan sesi</PrimaryButton>
              <PrimaryButton ghost onClick={onExit}>Simpan & keluar</PrimaryButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

Object.assign(window, { SessionScreen, askAIForAnalysis, detectCrisis });
