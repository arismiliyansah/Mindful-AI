// Local-first session history. Stored in localStorage under `mindful_history`.
// Shape: [{ id, savedAt, analysis, transcript, lang, translations? }]
// `lang` = origin language of the session. `translations` caches per-target-language
// copies of `analysis` (created on demand by user via Translate button).
// Export/import lets users carry their data across devices without an account.

const KEY = 'mindful_history';
const LEGACY_ANALYSIS_KEY = 'mindful_analysis';
const SCHEMA_VERSION = 1;
const DEFAULT_LANG = 'id';

function readRaw() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* fall through */ }
  return null;
}

function migrateFromLegacy() {
  try {
    const legacy = localStorage.getItem(LEGACY_ANALYSIS_KEY);
    if (!legacy) return [];
    const analysis = JSON.parse(legacy);
    if (!analysis?.archetype) return [];
    return [{
      id: 'legacy-' + Date.now(),
      savedAt: new Date().toISOString(),
      analysis,
      transcript: [],
      lang: DEFAULT_LANG,
    }];
  } catch { return []; }
}

function loadHistory() {
  const stored = readRaw();
  if (Array.isArray(stored)) {
    let mutated = false;
    const backfilled = stored.map(s => {
      if (s && typeof s === 'object' && !s.lang) {
        mutated = true;
        return { ...s, lang: DEFAULT_LANG };
      }
      return s;
    });
    if (mutated) writeHistory(backfilled);
    return backfilled;
  }
  // First load after the localStorage-only era — pull the lone analysis forward.
  const migrated = migrateFromLegacy();
  if (migrated.length) writeHistory(migrated);
  return migrated;
}

function writeHistory(history) {
  try { localStorage.setItem(KEY, JSON.stringify(history)); }
  catch (e) { console.warn('history write failed:', e); }
}

function saveSession({ analysis, transcript, lang }) {
  const history = loadHistory();
  const entry = {
    id: 'sess-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8),
    savedAt: new Date().toISOString(),
    analysis,
    transcript,
    lang: lang || DEFAULT_LANG,
  };
  const next = [...history, entry];
  writeHistory(next);
  return next;
}

function updateSessionTranslation(id, targetLang, translatedAnalysis) {
  const history = loadHistory();
  const next = history.map(s => {
    if (s.id !== id) return s;
    return {
      ...s,
      translations: { ...(s.translations || {}), [targetLang]: translatedAnalysis },
    };
  });
  writeHistory(next);
  return next;
}

// Returns the analysis to render for `currentLang` — translated copy if cached,
// otherwise the original.
function displayedAnalysis(session, currentLang) {
  if (!session) return null;
  const origin = session.lang || DEFAULT_LANG;
  if (currentLang === origin) return session.analysis;
  return session.translations?.[currentLang] || session.analysis;
}

function clearHistory() {
  try {
    localStorage.removeItem(KEY);
    localStorage.removeItem(LEGACY_ANALYSIS_KEY);
  } catch { /* ignore */ }
}

function exportHistory() {
  const history = loadHistory();
  const payload = {
    app: 'mindful-ai',
    schema: SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    history,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const stamp = new Date().toISOString().slice(0, 10);
  a.download = `mindful-ai-riwayat-${stamp}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// Replace mode: caller is expected to confirm with the user first.
async function importHistory(file) {
  const text = await file.text();
  let payload;
  try { payload = JSON.parse(text); }
  catch { throw new Error('File bukan JSON yang valid.'); }
  if (payload.app !== 'mindful-ai' || !Array.isArray(payload.history)) {
    throw new Error('File bukan ekspor riwayat Mindful AI.');
  }
  const cleaned = payload.history.filter(s => s?.analysis?.archetype && s?.analysis?.dimensions);
  writeHistory(cleaned);
  return cleaned;
}

// Latest session's analysis, for "current profile" cards.
function latestAnalysis(history) {
  if (!history.length) return null;
  return history[history.length - 1].analysis;
}

// Ketenangan over time, for the trend chart. Returns [] if <2 sessions.
function ketenanganTrend(history) {
  if (history.length < 2) return [];
  return history.map(s => s.analysis.dimensions?.ketenangan ?? 0);
}

export {
  loadHistory,
  saveSession,
  updateSessionTranslation,
  displayedAnalysis,
  clearHistory,
  exportHistory,
  importHistory,
  latestAnalysis,
  ketenanganTrend,
};
