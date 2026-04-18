// Session screen — adaptive AI-powered reflective conversation
// Calls /api/claude (serverless proxy). Falls back to seed content on failure.

import { useState as uS, useRef as uR } from 'react';
import { BreathDot, DepthMeter, QuietLink, PrimaryButton, ThinkingIndicator } from './primitives.jsx';
import { NavBrand } from './landing.jsx';
import { getSeed } from './seedContent.js';
import { useT } from './i18n.js';

// Multilingual crisis detection — per PRD §6.1.
const CRISIS_KEYWORDS = [
  // id
  'bunuh diri', 'akhiri hidup', 'ingin mati', 'menyakiti diri', 'melukai diri',
  'tidak ingin hidup', 'lebih baik mati', 'gak mau hidup', 'overdosis',
  // en
  'kill myself', 'want to die', 'end my life', 'self harm', 'self-harm',
  'hurt myself', 'no reason to live', 'better off dead', 'suicide',
  // zh (simplified + traditional share most of these)
  '想死', '自杀', '自殺', '结束生命', '結束生命', '不想活', '伤害自己', '傷害自己',
];
const detectCrisis = (text) => {
  const t = (text || '').toLowerCase();
  return CRISIS_KEYWORDS.some(k => t.includes(k));
};

async function callClaude(payload) {
  const resp = await fetch('/api/claude', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!resp.ok) {
    const detail = await resp.text().catch(() => '');
    throw new Error(`api ${resp.status}: ${detail.slice(0, 200)}`);
  }
  return resp.json();
}

async function askAIForNextQuestion(transcript, depth, total, lang) {
  try {
    const result = await callClaude({ mode: 'question', transcript, depth, total, lang });
    if (!result.question || !Array.isArray(result.options)) throw new Error('bad shape');
    return result;
  } catch (e) {
    console.warn('AI fallback (question):', e);
    const fb = getSeed(lang).fallbackFollowups;
    return fb[Math.min(depth - 1, fb.length - 1)];
  }
}

// Reads an SSE stream and resolves with the payload of `event: result`.
// Heartbeats (`: hb`) are ignored. `event: error` rejects with the server's message.
async function consumeSSE(resp) {
  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    let idx;
    while ((idx = buffer.indexOf('\n\n')) !== -1) {
      const block = buffer.slice(0, idx);
      buffer = buffer.slice(idx + 2);
      let event = 'message';
      const dataLines = [];
      for (const line of block.split('\n')) {
        if (line.startsWith(':')) continue;
        if (line.startsWith('event:')) event = line.slice(6).trim();
        else if (line.startsWith('data:')) dataLines.push(line.slice(5).trim());
      }
      if (!dataLines.length) continue;
      const data = JSON.parse(dataLines.join('\n'));
      if (event === 'result') return data;
      if (event === 'error') throw new Error(data.error || 'stream error');
    }
  }
  throw new Error('stream ended without result');
}

async function askAIForAnalysis(transcript, lang) {
  try {
    const resp = await fetch('/api/claude', {
      method: 'POST',
      headers: { 'content-type': 'application/json', accept: 'text/event-stream' },
      body: JSON.stringify({ mode: 'analysis', transcript, lang }),
    });
    if (!resp.ok) {
      const detail = await resp.text().catch(() => '');
      throw new Error(`api ${resp.status}: ${detail.slice(0, 200)}`);
    }
    const result = await consumeSSE(resp);
    if (!result.archetype || !result.dimensions) throw new Error('bad shape');
    return result;
  } catch (e) {
    console.warn('AI fallback (analysis):', e);
    return getSeed(lang).fallbackAnalysis;
  }
}

const SessionScreen = ({ totalQuestions, onFinish, onCrisis, onExit, onHome }) => {
  const { t, lang } = useT();
  const seed = getSeed(lang);
  const [current, setCurrent] = uS(seed.openingQuestion);
  const [transcript, setTranscript] = uS([]);
  const [freeText, setFreeText] = uS('');
  const [thinking, setThinking] = uS(false);
  const [paused, setPaused] = uS(false);
  const [selected, setSelected] = uS(null);
  const [enterKey, setEnterKey] = uS(0);
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
      onFinish({ transcript: nextTranscript, lang });
      return;
    }

    setThinking(true);
    const next = await askAIForNextQuestion(nextTranscript, current.depth, totalQuestions, lang);
    await new Promise(r => setTimeout(r, 900));
    setCurrent(next);
    setThinking(false);
    setEnterKey(k => k + 1);
  };

  const skip = () => submitAnswer(t('session.skipText'));
  const pick = (opt) => { setSelected(opt); setTimeout(() => submitAnswer(opt), 500); };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)', display: 'flex', flexDirection: 'column' }}>
      {/* Minimal session nav */}
      <header className="mf-px mf-bar" style={{
        paddingTop: 22, paddingBottom: 22, fontFamily: 'Inter, sans-serif',
      }}>
        <NavBrand onClick={onHome} iconSize={22} textSize={15} label={t('session.navTitle')} />
        <DepthMeter depth={current.depth} total={totalQuestions} />
        <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
          <QuietLink onClick={() => setPaused(true)}>{t('session.pause')}</QuietLink>
          <QuietLink onClick={onExit}>{t('session.exit')}</QuietLink>
        </div>
      </header>

      {/* Body */}
      <main
        ref={scrollRef}
        className="mf-px"
        style={{
          flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
          paddingTop: 'clamp(24px, 5vw, 40px)', paddingBottom: 'clamp(48px, 10vw, 100px)',
          justifyContent: 'center',
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
            {t('session.eyebrow', { n: current.depth, total: totalQuestions })}
          </div>

          {/* The question itself */}
          <div
            key={enterKey}
            style={{
              animation: 'mindfulFadeUp 1200ms cubic-bezier(.2,.8,.2,1)',
            }}
          >
            <h1 className="mf-h2" style={{
              fontFamily: 'Fraunces, serif', fontWeight: 300,
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
              {t('session.orWriteOwn')}
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <input
                value={freeText}
                onChange={e => setFreeText(e.target.value)}
                disabled={thinking}
                onKeyDown={e => e.key === 'Enter' && freeText.trim() && submitAnswer(freeText.trim())}
                placeholder={t('session.placeholder')}
                style={{
                  flex: '1 1 200px', minWidth: 0, padding: '14px 18px', borderRadius: 12,
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
                {t('session.continue')}
              </PrimaryButton>
            </div>
          </div>

          {/* Skip + thinking row */}
          <div style={{
            marginTop: 22, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <QuietLink onClick={skip}>{t('session.skip')}</QuietLink>
            {thinking && <ThinkingIndicator />}
          </div>
        </div>
      </main>

      {/* Pause overlay */}
      {paused && (
        <div className="mf-px" style={{
          position: 'fixed', inset: 0, background: 'color-mix(in oklab, var(--bg) 88%, transparent)',
          backdropFilter: 'blur(14px)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 40,
        }}>
          <div style={{ textAlign: 'center', maxWidth: 420, width: '100%', fontFamily: 'Inter, sans-serif' }}>
            <div style={{ margin: '0 auto 28px' }}>
              <div style={{
                width: 120, height: 120, borderRadius: '50%', margin: '0 auto',
                background: 'var(--primary-soft)',
                animation: 'mindfulBreathe 8s ease-in-out infinite',
              }} />
            </div>
            <h3 className="mf-h3" style={{ fontFamily: 'Fraunces, serif', fontWeight: 400, margin: '0 0 12px' }}>
              {t('session.pause.title')}
            </h3>
            <p style={{ color: 'var(--ink-soft)', fontSize: 15, lineHeight: 1.6 }}>
              {t('session.pause.body')}
            </p>
            <div className="mf-row-stack" style={{ marginTop: 28, justifyContent: 'center' }}>
              <PrimaryButton onClick={() => setPaused(false)}>{t('session.pause.continue')}</PrimaryButton>
              <PrimaryButton ghost onClick={onExit}>{t('session.pause.exit')}</PrimaryButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export { SessionScreen, askAIForAnalysis, detectCrisis };
