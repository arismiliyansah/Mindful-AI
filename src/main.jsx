import { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import { LandingScreen, RitualScreen } from './landing.jsx';
import { SessionScreen, askAIForAnalysis } from './session.jsx';
import { AnalyzingScreen, ResultScreen } from './result.jsx';
import { DashboardScreen } from './dashboard.jsx';
import { CrisisScreen } from './crisis.jsx';
import { TweaksPanel, ACCENT_PRESETS } from './tweaks.jsx';
import { LanguagePickerScreen } from './languagePicker.jsx';
import { QuestionCountPicker } from './questionPicker.jsx';
import { HowItWorksScreen, PrivacyScreen, ForProsScreen, AboutScreen, ForHoneyScreen } from './infoPages.jsx';
import { I18nProvider, isValidLang } from './i18n.js';
import { loadHistory, saveSession, latestAnalysis, updateSessionTranslation } from './history.js';

const SUPPORTED_LANGS = ['id', 'en', 'zh-CN', 'zh-TW'];

const TWEAK_DEFAULTS = {
  palette: 'sand',
  dark: false,
  questions: 9,
  tone: 'reflective',
  lang: null,
};

function applyPalette(paletteId, dark) {
  const p = ACCENT_PRESETS.find(x => x.id === paletteId) || ACCENT_PRESETS[0];
  const root = document.documentElement;
  root.style.setProperty('--primary', p.primary);
  root.style.setProperty('--accent', p.accent);
  if (dark) {
    root.style.setProperty('--primary-deep', p.primary);
    root.style.setProperty('--accent-deep', p.accent);
    root.style.setProperty('--primary-soft', `color-mix(in oklab, ${p.primary} 16%, #1A1B1A)`);
    root.style.setProperty('--accent-soft', `color-mix(in oklab, ${p.accent} 16%, #1A1B1A)`);
  } else {
    root.style.setProperty('--primary-deep', p.primaryDeep);
    root.style.setProperty('--accent-deep', p.accentDeep);
    root.style.setProperty('--primary-soft', p.primarySoft);
    root.style.setProperty('--accent-soft', p.accentSoft);
  }
}

function App() {
  const [tweaks, setTweaksState] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('mindful_tweaks') || 'null');
      return { ...TWEAK_DEFAULTS, ...(saved || {}) };
    } catch { return TWEAK_DEFAULTS; }
  });

  // Initial screen: language picker if no lang set yet, otherwise resume saved screen.
  const [screen, setScreen] = useState(() => {
    if (!isValidLang(tweaks.lang)) return 'languagePicker';
    const saved = typeof localStorage !== 'undefined' ? localStorage.getItem('mindful_screen') : null;
    if (saved && ['landing', 'dashboard'].includes(saved)) return saved;
    return 'landing';
  });

  const [history, setHistory] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [crisisCtx, setCrisisCtx] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const hasHistory = history.length > 0;

  useEffect(() => {
    document.documentElement.classList.toggle('dark', !!tweaks.dark);
    applyPalette(tweaks.palette, !!tweaks.dark);
    localStorage.setItem('mindful_tweaks', JSON.stringify(tweaks));
  }, [tweaks]);

  useEffect(() => {
    const stored = loadHistory();
    setHistory(stored);
    setAnalysis(latestAnalysis(stored));
  }, []);

  useEffect(() => {
    const skip = new Set(['languagePicker', 'questionPicker', 'howItWorks', 'privacy', 'forPros', 'about', 'forHoney']);
    if (!skip.has(screen)) {
      localStorage.setItem('mindful_screen', screen);
    }
  }, [screen]);

  useEffect(() => {
    const onMsg = (e) => {
      if (!e.data || !e.data.type) return;
      if (e.data.type === '__activate_edit_mode') setEditMode(true);
      if (e.data.type === '__deactivate_edit_mode') setEditMode(false);
    };
    window.addEventListener('message', onMsg);
    try { window.parent.postMessage({ type: '__edit_mode_available' }, '*'); } catch {}
    return () => window.removeEventListener('message', onMsg);
  }, []);

  const setTweaks = (partial) => {
    setTweaksState(prev => {
      const next = { ...prev, ...partial };
      try { window.parent.postMessage({ type: '__edit_mode_set_keys', edits: partial }, '*'); } catch {}
      return next;
    });
  };

  const setLang = (lang) => setTweaks({ lang });

  const startSession = () => setScreen('questionPicker');
  const beginAfterRitual = () => setScreen('session');
  const toggleDark = () => setTweaks({ dark: !tweaks.dark });
  const goHome = () => setScreen('landing');

  const handleQuestionPick = (n) => {
    setTweaks({ questions: n });
    setScreen('ritual');
  };

  const handleLanguagePick = (lang) => {
    setLang(lang);
    setScreen('landing');
  };

  const autoTranslateSession = async (session, sourceLang) => {
    const targets = SUPPORTED_LANGS.filter(l => l !== sourceLang);
    for (const targetLang of targets) {
      try {
        const resp = await fetch('/api/claude', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            mode: 'translate',
            analysis: session.analysis,
            sourceLang,
            targetLang,
          }),
        });
        if (!resp.ok) continue;
        const translated = await resp.json();
        const updated = updateSessionTranslation(session.id, targetLang, translated);
        setHistory(updated);
      } catch (e) {
        console.warn(`auto-translate ${targetLang} failed:`, e);
      }
    }
  };

  const handleFinish = async ({ transcript, lang }) => {
    const sessionLang = lang || tweaks.lang;
    setScreen('analyzing');
    const analysis = await askAIForAnalysis(transcript, sessionLang);
    const next = saveSession({ analysis, transcript, lang: sessionLang });
    setHistory(next);
    setAnalysis(analysis);
    setScreen('result');

    const newSession = next[next.length - 1];
    autoTranslateSession(newSession, sessionLang);
  };

  const handleCrisis = (ctx) => { setCrisisCtx(ctx); setScreen('crisis'); };

  return (
    <I18nProvider lang={tweaks.lang || 'id'} setLang={setLang}>
      {screen === 'languagePicker' && (
        <LanguagePickerScreen onSelect={handleLanguagePick} />
      )}
      {screen === 'landing' && (
        <LandingScreen
          onStart={startSession}
          onToDashboard={() => setScreen('dashboard')}
          onToHowItWorks={() => setScreen('howItWorks')}
          onToPrivacy={() => setScreen('privacy')}
          onToForPros={() => setScreen('forPros')}
          onToAbout={() => setScreen('about')}
          onToForHoney={() => setScreen('forHoney')}
          hasHistory={hasHistory}
          dark={tweaks.dark}
          onToggleDark={toggleDark}
        />
      )}
      {screen === 'howItWorks' && (
        <HowItWorksScreen onBack={goHome} onHome={goHome} dark={tweaks.dark} onToggleDark={toggleDark} />
      )}
      {screen === 'privacy' && (
        <PrivacyScreen onBack={goHome} onHome={goHome} dark={tweaks.dark} onToggleDark={toggleDark} />
      )}
      {screen === 'forPros' && (
        <ForProsScreen onBack={goHome} onHome={goHome} dark={tweaks.dark} onToggleDark={toggleDark} />
      )}
      {screen === 'about' && (
        <AboutScreen onBack={goHome} onHome={goHome} dark={tweaks.dark} onToggleDark={toggleDark} />
      )}
      {screen === 'forHoney' && (
        <ForHoneyScreen onBack={goHome} onHome={goHome} dark={tweaks.dark} onToggleDark={toggleDark} />
      )}
      {screen === 'questionPicker' && (
        <QuestionCountPicker
          initial={tweaks.questions}
          onConfirm={handleQuestionPick}
          onCancel={() => setScreen(hasHistory ? 'dashboard' : 'landing')}
          onHome={goHome}
        />
      )}
      {screen === 'ritual' && (
        <RitualScreen onReady={beginAfterRitual} onCancel={() => setScreen('questionPicker')} onHome={goHome} />
      )}
      {screen === 'session' && (
        <SessionScreen
          totalQuestions={tweaks.questions}
          onFinish={handleFinish}
          onCrisis={handleCrisis}
          onExit={goHome}
          onHome={goHome}
        />
      )}
      {screen === 'analyzing' && <AnalyzingScreen />}
      {screen === 'result' && analysis && (
        <ResultScreen
          analysis={analysis}
          onRestart={() => setScreen('questionPicker')}
          onToDashboard={() => setScreen('dashboard')}
          onSave={() => {}}
          onHome={goHome}
        />
      )}
      {screen === 'dashboard' && (
        <DashboardScreen
          analysis={analysis}
          history={history}
          onHistoryChange={(next) => {
            setHistory(next);
            setAnalysis(latestAnalysis(next));
          }}
          onNewSession={() => setScreen('questionPicker')}
          onBack={goHome}
          onHome={goHome}
          onMoodCheckin={() => setScreen('questionPicker')}
          dark={tweaks.dark}
          onToggleDark={toggleDark}
        />
      )}
      {screen === 'crisis' && (
        <CrisisScreen
          context={crisisCtx}
          onContinue={() => setScreen('session')}
          onPause={() => setScreen('landing')}
          onExit={() => setScreen('landing')}
        />
      )}

      {editMode && <TweaksPanel tweaks={tweaks} setTweaks={setTweaks} />}
    </I18nProvider>
  );
}

createRoot(document.getElementById('root')).render(<App />);
