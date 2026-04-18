// Cloudflare Pages Function — proxies the Anthropic API.
// Mirrored locally by the claudeApiDev middleware in vite.config.js.
// - mode "question": fast JSON (Sonnet 4.6).
// - mode "analysis": SSE stream — heartbeat keeps the connection warm,
//   then the parsed JSON is emitted in a `result` event.
// - mode "translate": fast JSON (Haiku 4.5).
import Anthropic from '@anthropic-ai/sdk';

const SUPPORTED_LANGS = ['id', 'en', 'zh-CN', 'zh-TW'];

// JSON keys (`ketenangan`, `kesadaranDiri`, ...) stay in Indonesian across all
// languages so saved sessions remain compatible cross-language.
const PROMPTS = {
  id: {
    question: `Kamu adalah Mindful AI — teman refleksi berbahasa Indonesia. Kamu TIDAK pernah memberi diagnosis. Tonemu hangat, jujur, tidak menjilat, menggunakan kata "kamu". Tugasmu: buat SATU pertanyaan reflektif berikutnya yang sedikit lebih dalam dari pertanyaan sebelumnya, berdasarkan jawaban pengguna. Jangan ulangi pertanyaan. Jangan beri nasihat. Fokus ke perasaan, pola, atau makna.

Output WAJIB JSON valid tanpa penjelasan lain:
{"question":"pertanyaannya...","options":["4 pilihan singkat","yang bisa mewakili","berbagai perasaan","termasuk 'aku belum tahu'"]}
Pilihan harus terasa manusiawi, bukan klinis. Panjang pertanyaan 12-24 kata.`,
    analysis: `Kamu adalah Mindful AI. Berdasarkan transkrip sesi refleksi di bawah, buat profil emosional pengguna dalam Bahasa Indonesia dengan tone hangat dan jujur (tanpa diagnosis klinis).

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
}`,
    questionUserPrefix: 'Konteks sesi sejauh ini',
    qWord: 'Pertanyaan', aWord: 'Jawaban', tShort: 'T', aShort: 'J',
    transcriptLabel: 'Transkrip:',
    qInstr: (depth, total, next) => `Buat pertanyaan ke-${next}. Harus lebih reflektif dari sebelumnya.`,
    depthLabel: (depth, total) => `(kedalaman ${depth}/${total})`,
  },

  en: {
    question: `You are Mindful AI — an English-speaking reflection companion. You NEVER give diagnoses. Your tone is warm, honest, never sycophantic, and you address the user as "you". Your task: write the SINGLE next reflective question, slightly deeper than the previous one, based on the user's answers. Do not repeat questions. Do not give advice. Focus on feelings, patterns, or meaning.

Output MUST be valid JSON with no other commentary:
{"question":"the question...","options":["4 short choices","that can represent","different feelings","including 'I don't know yet'"]}
Choices must feel human, not clinical. Question length 12-24 words. Write entirely in English.`,
    analysis: `You are Mindful AI. Based on the reflection session transcript below, build the user's emotional profile in English with a warm, honest tone (no clinical diagnoses). All text values must be in English.

IMPORTANT: The JSON keys for "dimensions" must remain in Indonesian exactly as listed (ketenangan, kesadaranDiri, resiliensi, koneksiSosial, regulasiEmosi, harapan) for storage compatibility. Only the values (text content) are translated.

Output MUST be valid JSON:
{
  "archetype": "poetic 2-4 word archetype name in English, not a clinical label",
  "subtitle": "one short explanatory sentence (max 12 words)",
  "narrative": "130-180 word narrative, use 'you', reflective and specific",
  "dimensions": {"ketenangan":0-100,"kesadaranDiri":0-100,"resiliensi":0-100,"koneksiSosial":0-100,"regulasiEmosi":0-100,"harapan":0-100},
  "themes": [{"label":"2-4 words in English","note":"one sentence in English"}],
  "strengths": ["3 short points in English"],
  "growth": ["3 points in English"],
  "recommendations": [{"kind":"Daily practice|Weekly reflection|Sign to seek help","title":"...","why":"..."}]
}`,
    questionUserPrefix: 'Session context so far',
    qWord: 'Question', aWord: 'Answer', tShort: 'Q', aShort: 'A',
    transcriptLabel: 'Transcript:',
    qInstr: (depth, total, next) => `Write question #${next}. It should be more reflective than the previous one.`,
    depthLabel: (depth, total) => `(depth ${depth}/${total})`,
  },

  'zh-CN': {
    question: `你是 Mindful AI——一位说简体中文的反思伙伴。你绝不给出诊断。你的语气温暖、诚实、不奉承，使用"你"称呼用户。任务：根据用户的回答，撰写下一道反思问题，比上一道稍微更深入一点。不要重复问题。不要给建议。聚焦在感受、模式或意义上。

输出必须是合法 JSON，且不得包含其他解释：
{"question":"问题内容...","options":["4 个简短选项","能代表不同的感受","保持人性化","包含「我还不知道」"]}
选项必须像真人在说话，而非临床式表述。问题长度 12-24 字。请使用简体中文（中国大陆用法）。`,
    analysis: `你是 Mindful AI。基于下面的反思会话记录，用简体中文（中国大陆用法）为用户构建情绪侧写，语气要温暖且诚实（不要做出临床诊断）。所有文本值必须使用简体中文。

重要：JSON 中 "dimensions" 的键名必须保持印尼语原样（ketenangan、kesadaranDiri、resiliensi、koneksiSosial、regulasiEmosi、harapan），以便保存数据兼容。只有值（文本内容）需要翻译。

输出必须是合法 JSON：
{
  "archetype": "诗意的 2-4 字简体中文原型名，非临床标签",
  "subtitle": "一句简短说明（最多 12 字）",
  "narrative": "130-180 字的叙述，使用「你」，反思而具体",
  "dimensions": {"ketenangan":0-100,"kesadaranDiri":0-100,"resiliensi":0-100,"koneksiSosial":0-100,"regulasiEmosi":0-100,"harapan":0-100},
  "themes": [{"label":"2-4 字简体中文","note":"一句话简体中文"}],
  "strengths": ["3 个简短要点（简体中文）"],
  "growth": ["3 个要点（简体中文）"],
  "recommendations": [{"kind":"每日练习|每周反思|寻求帮助的信号","title":"...","why":"..."}]
}`,
    questionUserPrefix: '当前会话上下文',
    qWord: '问题', aWord: '回答', tShort: '问', aShort: '答',
    transcriptLabel: '会话记录：',
    qInstr: (depth, total, next) => `撰写第 ${next} 题。要比上一题更具反思性。`,
    depthLabel: (depth, total) => `（深度 ${depth}/${total}）`,
  },

  'zh-TW': {
    question: `你是 Mindful AI——一位說正體中文的反思夥伴。你絕不給出診斷。你的語氣溫暖、誠實、不奉承，使用「你」稱呼使用者。任務：根據使用者的回答，撰寫下一道反思問題，比上一道稍微更深入一些。不要重複問題。不要給建議。聚焦在感受、模式或意義上。

輸出必須是合法 JSON，且不得包含其他說明：
{"question":"問題內容...","options":["4 個簡短選項","能代表不同感受","保持人性化","包含「我還不知道」"]}
選項必須像真人在說話，而非臨床式表述。問題長度 12-24 字。請使用正體中文（台灣／香港用法）。`,
    analysis: `你是 Mindful AI。根據下面的反思會話記錄，以正體中文（台灣／香港用法）為使用者建立情緒側寫，語氣要溫暖且誠實（不要做出臨床診斷）。所有文字值必須使用正體中文。

重要：JSON 中 "dimensions" 的鍵名必須保持印尼語原樣（ketenangan、kesadaranDiri、resiliensi、koneksiSosial、regulasiEmosi、harapan），以維持儲存資料的相容性。只有值（文字內容）需要翻譯。

輸出必須是合法 JSON：
{
  "archetype": "詩意的 2-4 字正體中文原型名，非臨床標籤",
  "subtitle": "一句簡短說明（最多 12 字）",
  "narrative": "130-180 字的敘述，使用「你」，反思而具體",
  "dimensions": {"ketenangan":0-100,"kesadaranDiri":0-100,"resiliensi":0-100,"koneksiSosial":0-100,"regulasiEmosi":0-100,"harapan":0-100},
  "themes": [{"label":"2-4 字正體中文","note":"一句話正體中文"}],
  "strengths": ["3 個簡短要點（正體中文）"],
  "growth": ["3 個要點（正體中文）"],
  "recommendations": [{"kind":"每日練習|每週反思|尋求協助的訊號","title":"...","why":"..."}]
}`,
    questionUserPrefix: '目前的會話脈絡',
    qWord: '問題', aWord: '回答', tShort: '問', aShort: '答',
    transcriptLabel: '會話記錄：',
    qInstr: (depth, total, next) => `撰寫第 ${next} 題。要比上一題更具反思性。`,
    depthLabel: (depth, total) => `（深度 ${depth}/${total}）`,
  },
};

function pickLang(input) {
  return SUPPORTED_LANGS.includes(input) ? input : 'id';
}

const LANG_NAMES = {
  id: 'Indonesian (Bahasa Indonesia)',
  en: 'English',
  'zh-CN': 'Simplified Chinese (Mainland China usage)',
  'zh-TW': 'Traditional Chinese (Taiwan/Hong Kong usage)',
};

const KIND_ENUMS = {
  id: 'Latihan harian|Refleksi mingguan|Tanda untuk mencari bantuan',
  en: 'Daily practice|Weekly reflection|Sign to seek help',
  'zh-CN': '每日练习|每周反思|寻求帮助的信号',
  'zh-TW': '每日練習|每週反思|尋求協助的訊號',
};

function extractJson(text) {
  const stripped = text.replace(/```(?:json)?\s*([\s\S]*?)```/g, '$1');
  const match = stripped.match(/\{[\s\S]*\}/);
  if (!match) throw new Error('no json in response: ' + text.slice(0, 200));
  return JSON.parse(match[0]);
}

async function withRetry(fn, { tries = 4, baseDelay = 800 } = {}) {
  let lastErr;
  for (let i = 0; i < tries; i++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      const status = err?.status;
      const retryable = status === 529 || status === 503 || status === 502 || status === 504;
      if (!retryable || i === tries - 1) throw err;
      const delay = baseDelay * Math.pow(2, i) + Math.random() * 300;
      console.warn(`[claude proxy] ${status} — retry ${i + 1}/${tries - 1} in ${Math.round(delay)}ms`);
      await new Promise(r => setTimeout(r, delay));
    }
  }
  throw lastErr;
}

function isAllowedOrigin(origin, env) {
  if (!origin) return true;
  let host;
  try { host = new URL(origin).hostname; } catch { return false; }
  if (host === 'localhost' || host === '127.0.0.1') return true;
  if (host.endsWith('.pages.dev')) return true;
  if (host.endsWith('.vercel.app')) return true;
  const extra = (env?.ALLOWED_ORIGINS || '')
    .split(',').map(s => s.trim()).filter(Boolean);
  return extra.some(allowed => {
    try { return new URL(allowed).hostname === host; } catch { return false; }
  });
}

async function generateQuestion(client, { transcript, depth, total, lang }) {
  const L = PROMPTS[lang];
  const history = (transcript || [])
    .map(t => `- ${L.qWord}: "${t.q}"\n  ${L.aWord}: "${t.a}"`)
    .join('\n');
  const user = `${L.questionUserPrefix} ${L.depthLabel(depth, total)}:\n${history}\n\n${L.qInstr(depth, total, depth + 1)}`;

  const resp = await withRetry(() => client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    temperature: 0.7,
    system: L.question,
    messages: [{ role: 'user', content: user }],
  }));
  const text = resp.content.filter(b => b.type === 'text').map(b => b.text).join('');
  const parsed = extractJson(text);
  if (!parsed.question || !Array.isArray(parsed.options)) throw new Error('bad shape');
  return { question: parsed.question, options: parsed.options.slice(0, 4), depth: depth + 1 };
}

async function runAnalysis(client, { transcript, lang }) {
  const L = PROMPTS[lang];
  const body = (transcript || [])
    .map((t, i) => `${i + 1}. ${L.tShort}: ${t.q}\n   ${L.aShort}: ${t.a}`)
    .join('\n');

  const final = await withRetry(async () => {
    const stream = client.messages.stream({
      model: 'claude-sonnet-4-6',
      max_tokens: 4096,
      temperature: 0.3,
      system: L.analysis,
      messages: [{ role: 'user', content: L.transcriptLabel + '\n' + body }],
    });
    return stream.finalMessage();
  });
  const text = final.content.filter(b => b.type === 'text').map(b => b.text).join('');
  const parsed = extractJson(text);
  if (!parsed.archetype || !parsed.dimensions) throw new Error('bad shape');
  return parsed;
}

async function translateAnalysis(client, { analysis, sourceLang, targetLang }) {
  if (!analysis || !analysis.archetype || !analysis.dimensions) {
    throw new Error('translate: missing analysis');
  }
  const target = pickLang(targetLang);
  const source = pickLang(sourceLang);
  if (source === target) return analysis;

  const targetName = LANG_NAMES[target];
  const kindEnum = KIND_ENUMS[target];

  const system = `You translate Mindful AI emotional-profile analyses between languages while preserving structure exactly.

TRANSLATE INTO: ${targetName}.

Rules:
- Output valid JSON only, no commentary, no markdown fences.
- Preserve the JSON structure and field names EXACTLY (archetype, subtitle, narrative, dimensions, themes, strengths, growth, recommendations).
- Translate ONLY string values into ${targetName}.
- "dimensions" object: keep BOTH the keys (ketenangan, kesadaranDiri, resiliensi, koneksiSosial, regulasiEmosi, harapan) AND the numeric values UNCHANGED.
- "recommendations[].kind" MUST be exactly one of: ${kindEnum}
- Keep tone warm, honest, non-clinical, non-sycophantic. Address the user as "you" / equivalent in target language.
- Keep narrative roughly the same length as the source.`;

  const resp = await withRetry(() => client.messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: 2048,
    temperature: 0.3,
    system,
    messages: [{ role: 'user', content: JSON.stringify(analysis) }],
  }));
  const text = resp.content.filter(b => b.type === 'text').map(b => b.text).join('');
  const parsed = extractJson(text);
  if (!parsed.archetype || !parsed.dimensions || !Array.isArray(parsed.themes)) {
    throw new Error('bad shape');
  }
  return parsed;
}

const json = (data, status = 200) => new Response(JSON.stringify(data), {
  status,
  headers: { 'content-type': 'application/json' },
});

function streamAnalysisResponse(client, body) {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (chunk) => {
        try { controller.enqueue(encoder.encode(chunk)); } catch { /* closed */ }
      };
      send(': open\n\n');
      const heartbeat = setInterval(() => send(': hb\n\n'), 5000);

      try {
        const result = await runAnalysis(client, body);
        send(`event: result\ndata: ${JSON.stringify(result)}\n\n`);
      } catch (err) {
        const status = err?.status || 500;
        console.error('[claude proxy] analysis error:', status, err?.message, err?.error || '');
        send(`event: error\ndata: ${JSON.stringify({
          error: err?.message || 'upstream error',
          status,
          detail: err?.error || null,
        })}\n\n`);
      } finally {
        clearInterval(heartbeat);
        try { controller.close(); } catch { /* already closed */ }
      }
    },
  });

  return new Response(stream, {
    status: 200,
    headers: {
      'content-type': 'text/event-stream',
      'cache-control': 'no-cache, no-transform',
      'connection': 'keep-alive',
      'x-accel-buffering': 'no',
    },
  });
}

export async function onRequestPost({ request, env }) {
  const origin = request.headers.get('origin') || request.headers.get('referer') || '';
  if (!isAllowedOrigin(origin, env)) {
    return json({ error: 'origin not allowed' }, 403);
  }

  const apiKey = env?.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return json({ error: 'ANTHROPIC_API_KEY not configured' }, 500);
  }

  let body;
  try { body = await request.json(); } catch { body = {}; }
  body = body || {};
  body.lang = pickLang(body.lang);

  const client = new Anthropic({ apiKey, maxRetries: 5 });

  if (body.mode === 'analysis') {
    return streamAnalysisResponse(client, body);
  }

  try {
    let result;
    if (body.mode === 'question') {
      result = await generateQuestion(client, body);
    } else if (body.mode === 'translate') {
      result = await translateAnalysis(client, body);
    } else {
      return json({ error: 'mode must be "question", "analysis", or "translate"' }, 400);
    }
    return json(result);
  } catch (err) {
    const status = err?.status || 500;
    console.error('[claude proxy] error:', status, err?.message, err?.error || '');
    return json({
      error: err?.message || 'upstream error',
      type: err?.constructor?.name,
      detail: err?.error || null,
    }, status);
  }
}

export async function onRequest({ request, env }) {
  if (request.method !== 'POST') {
    return json({ error: 'method not allowed' }, 405);
  }
  return onRequestPost({ request, env });
}
