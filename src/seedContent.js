// Fallback content used when the AI proxy fails.
// 4 languages: id (default), en, zh-CN (Simplified), zh-TW (Traditional).

const id = {
  openingQuestion: {
    question: "Bagaimana keadaan batinmu hari ini — satu kata atau satu kalimat saja?",
    options: [
      "Tenang, tapi ada yang mengganjal",
      "Lelah, butuh didengar",
      "Cukup baik, rasanya biasa saja",
      "Ramai — banyak hal di kepala",
    ],
    depth: 1,
  },
  fallbackFollowups: [
    {
      question: "Kalau kamu tutup mata sebentar, perasaan apa yang paling terasa di dada?",
      options: ["Sesak", "Hangat", "Kosong", "Campur aduk"],
      depth: 2,
    },
    {
      question: "Kapan terakhir kali kamu merasa benar-benar menjadi dirimu sendiri?",
      options: [
        "Beberapa hari lalu",
        "Sudah lama — aku lupa rasanya",
        "Saat sendirian",
        "Bersama orang tertentu",
      ],
      depth: 3,
    },
    {
      question: "Apa yang biasanya kamu lakukan ketika perasaan itu muncul?",
      options: ["Menyibukkan diri", "Menangis diam-diam", "Bercerita ke seseorang", "Tidur"],
      depth: 4,
    },
    {
      question: "Kalau perasaan itu punya suara, apa yang ia bisikkan padamu?",
      options: ["\"Kamu tidak cukup\"", "\"Kamu sendirian\"", "\"Istirahatlah\"", "\"Kamu aman\""],
      depth: 5,
    },
    {
      question: "Bagian mana dari dirimu yang terasa paling ingin didengar belakangan ini?",
      options: [
        "Diriku yang kecil dulu",
        "Diriku yang lelah sekarang",
        "Diriku yang punya mimpi",
        "Aku belum tahu",
      ],
      depth: 6,
    },
    {
      question: "Apa satu hal kecil yang membuatmu tetap bertahan minggu ini?",
      options: ["Rutinitas pagi", "Seseorang yang peduli", "Secangkir kopi", "Aku sendiri"],
      depth: 7,
    },
    {
      question: "Kalau boleh memberi pesan pada dirimu sendiri setelah sesi ini, apa yang ingin kamu katakan?",
      options: [
        "Terima kasih sudah bertahan",
        "Tidak apa-apa pelan-pelan",
        "Kamu berhak istirahat",
        "Aku akan mendengarkanmu lagi",
      ],
      depth: 8,
    },
  ],
  fallbackAnalysis: {
    archetype: "Sang Pengamat yang Lembut",
    subtitle: "Kamu merasakan banyak, tapi sering menyimpannya sendiri.",
    narrative:
      "Dari caramu bercerita, terlihat jelas bahwa kamu adalah orang yang peka — terhadap suasana, terhadap orang-orang di sekitarmu, dan terhadap perubahan kecil dalam dirimu sendiri. Kepekaan ini adalah hadiah, tapi juga beban yang jarang kamu bagi. Kamu cenderung menahan dulu, memproses sendiri, baru bercerita setelah semuanya rapi. Ada kelelahan halus di balik ketenanganmu, bukan karena hidup sedang buruk, tetapi karena kamu terbiasa menjadi yang mengerti terlebih dahulu. Sesi ini mengingatkanmu bahwa memahami orang lain tidak harus berarti mengorbankan pemahaman atas dirimu sendiri.",
    dimensions: { ketenangan: 68, kesadaranDiri: 82, resiliensi: 71, koneksiSosial: 54, regulasiEmosi: 63, harapan: 76 },
    themes: [
      { label: "Kepekaan tinggi", note: "Kamu menangkap nuansa yang orang lain lewatkan." },
      { label: "Kebutuhan akan ruang", note: "Kamu pulih paling baik dalam keheningan." },
      { label: "Rasa tanggung jawab batin", note: "Kamu sering menyalahkan diri lebih dulu." },
    ],
    strengths: [
      "Kemampuan merefleksi diri di atas rata-rata",
      "Ketulusan dalam memperhatikan orang lain",
      "Daya tahan yang tenang — tidak gaduh, tapi konsisten",
    ],
    growth: [
      "Melatih keberanian meminta tolong sebelum kamu kelelahan",
      "Membedakan empati dan beban emosional yang bukan milikmu",
      "Memberi dirimu izin untuk merasa tanpa harus langsung memperbaiki",
    ],
    recommendations: [
      { kind: "Latihan harian", title: "Body scan 7 menit sebelum tidur", why: "Membantu melepas ketegangan yang kamu simpan tanpa sadar di bahu dan dada." },
      { kind: "Refleksi mingguan", title: "Tulis satu hal yang tidak kamu ucapkan minggu ini", why: "Memberi suara pada bagian dirimu yang sering diam." },
      { kind: "Tanda untuk mencari bantuan", title: "Kalau perasaan kosong bertahan > 2 minggu", why: "Itu sinyal untuk bicara dengan profesional — bukan tanda kamu lemah." },
    ],
  },
};

const en = {
  openingQuestion: {
    question: "How is your inner world today — just one word or one sentence?",
    options: [
      "Calm, but something feels off",
      "Tired, need to be heard",
      "Pretty okay, just ordinary",
      "Crowded — lots in my head",
    ],
    depth: 1,
  },
  fallbackFollowups: [
    {
      question: "If you closed your eyes for a moment, what feeling shows up most in your chest?",
      options: ["Tightness", "Warmth", "Emptiness", "Mixed"],
      depth: 2,
    },
    {
      question: "When was the last time you felt truly like yourself?",
      options: [
        "A few days ago",
        "It's been a while — I've forgotten the feeling",
        "When I'm alone",
        "With certain people",
      ],
      depth: 3,
    },
    {
      question: "What do you usually do when that feeling shows up?",
      options: ["Keep busy", "Cry quietly", "Tell someone", "Sleep"],
      depth: 4,
    },
    {
      question: "If that feeling had a voice, what would it whisper to you?",
      options: ['"You\'re not enough"', '"You\'re alone"', '"Rest"', '"You are safe"'],
      depth: 5,
    },
    {
      question: "Which part of you most wants to be heard lately?",
      options: [
        "My younger self",
        "My tired self right now",
        "My self with dreams",
        "I don't know yet",
      ],
      depth: 6,
    },
    {
      question: "What's one small thing keeping you going this week?",
      options: ["Morning routine", "Someone who cares", "A cup of coffee", "Myself"],
      depth: 7,
    },
    {
      question: "If you could send one message to yourself after this session, what would it be?",
      options: [
        "Thank you for holding on",
        "It's okay to take it slow",
        "You deserve to rest",
        "I'll listen to you again",
      ],
      depth: 8,
    },
  ],
  fallbackAnalysis: {
    archetype: "The Gentle Observer",
    subtitle: "You feel a lot, but often keep it to yourself.",
    narrative:
      "From the way you tell your story, it's clear that you are someone sensitive — to atmospheres, to the people around you, and to small shifts in yourself. This sensitivity is a gift, but also a burden you rarely share. You tend to hold things first, process privately, and only speak when everything is tidy. There is a quiet tiredness behind your calm — not because life is bad, but because you've grown used to being the one who understands first. This session is a reminder that understanding others doesn't have to mean sacrificing understanding of yourself.",
    dimensions: { ketenangan: 68, kesadaranDiri: 82, resiliensi: 71, koneksiSosial: 54, regulasiEmosi: 63, harapan: 76 },
    themes: [
      { label: "High sensitivity", note: "You catch nuances others miss." },
      { label: "Need for space", note: "You restore best in stillness." },
      { label: "Inner sense of duty", note: "You often blame yourself first." },
    ],
    strengths: [
      "Above-average self-reflection",
      "Sincere attention to other people",
      "A quiet kind of resilience — not loud, but consistent",
    ],
    growth: [
      "Practicing the courage to ask for help before you're depleted",
      "Distinguishing empathy from emotional weight that isn't yours",
      "Giving yourself permission to feel without rushing to fix",
    ],
    recommendations: [
      { kind: "Daily practice", title: "7-minute body scan before bed", why: "Helps release tension you store unconsciously in your shoulders and chest." },
      { kind: "Weekly reflection", title: "Write down one thing you didn't say this week", why: "Gives voice to the part of you that often stays silent." },
      { kind: "Sign to seek help", title: "If the empty feeling persists > 2 weeks", why: "That's a signal to talk to a professional — not a sign you're weak." },
    ],
  },
};

const zhCN = {
  openingQuestion: {
    question: "今天你的内心怎么样——一个词或一句话就好？",
    options: [
      "平静，但有些东西堵着",
      "累，想被听见",
      "还行，平常吧",
      "热闹——脑子里很多事",
    ],
    depth: 1,
  },
  fallbackFollowups: [
    {
      question: "闭上眼睛一会儿，胸口最强烈的感觉是什么？",
      options: ["压抑", "温暖", "空", "混杂"],
      depth: 2,
    },
    {
      question: "上一次真正感觉像自己，是什么时候？",
      options: [
        "几天前",
        "好久了——我都忘了那种感觉",
        "独处的时候",
        "和特定的人在一起时",
      ],
      depth: 3,
    },
    {
      question: "那种感觉出现时，你通常怎么做？",
      options: ["让自己忙起来", "悄悄哭", "找人倾诉", "睡觉"],
      depth: 4,
    },
    {
      question: "如果那种感觉有声音，它会对你低语什么？",
      options: ["「你不够好」", "「你是孤单的」", "「休息一下」", "「你是安全的」"],
      depth: 5,
    },
    {
      question: "最近，你哪一部分的自己最想被听见？",
      options: [
        "小时候的自己",
        "现在疲惫的自己",
        "怀有梦想的自己",
        "我还不知道",
      ],
      depth: 6,
    },
    {
      question: "这一周里，让你坚持下去的小事是什么？",
      options: ["早晨的例行", "有人在乎", "一杯咖啡", "我自己"],
      depth: 7,
    },
    {
      question: "结束这次会话后，你想给自己留下什么话？",
      options: [
        "谢谢你一直撑着",
        "慢慢来，没关系",
        "你值得休息",
        "我还会再听你说话",
      ],
      depth: 8,
    },
  ],
  fallbackAnalysis: {
    archetype: "温柔的观察者",
    subtitle: "你感受很多，却常常默默收起来。",
    narrative:
      "从你叙述的方式可以看出，你是一个敏感的人——对氛围、对身边的人、对自己内在细微的变化。这份敏感是天赋，也是你很少与人分享的负担。你倾向于先把情绪藏起来，独自消化，等一切看似整齐了才说出口。在你的平静背后，有一种安静的疲惫；不是因为生活很糟，而是因为你习惯先去理解别人。这一次会话提醒你：理解他人，不必以牺牲对自己的理解为代价。",
    dimensions: { ketenangan: 68, kesadaranDiri: 82, resiliensi: 71, koneksiSosial: 54, regulasiEmosi: 63, harapan: 76 },
    themes: [
      { label: "高度敏感", note: "你能捕捉到别人忽略的细微差别。" },
      { label: "需要空间", note: "你在安静中恢复得最好。" },
      { label: "内在的责任感", note: "你常常先责怪自己。" },
    ],
    strengths: [
      "高于平均的自我反思能力",
      "对他人真诚的关注",
      "一种安静的韧性——不张扬，但持续",
    ],
    growth: [
      "在筋疲力尽之前，练习开口求助的勇气",
      "区分同理心，与并不属于你的情绪重量",
      "允许自己感受，而不必立刻去解决",
    ],
    recommendations: [
      { kind: "每日练习", title: "睡前 7 分钟身体扫描", why: "帮助释放你无意识储存在肩膀与胸口的紧绷。" },
      { kind: "每周反思", title: "写下这一周你没说出口的一件事", why: "让那个常常沉默的自己有声音。" },
      { kind: "寻求帮助的信号", title: "如果空虚感持续超过 2 周", why: "这是该和专业人士谈谈的信号——不是你软弱。" },
    ],
  },
};

const zhTW = {
  openingQuestion: {
    question: "今天你的內心如何——一個詞或一句話就好？",
    options: [
      "平靜，但有些東西卡著",
      "累，想被聽見",
      "還行，普通吧",
      "熱鬧——腦子裡很多事",
    ],
    depth: 1,
  },
  fallbackFollowups: [
    {
      question: "閉上眼睛一會兒，胸口最強烈的感覺是什麼？",
      options: ["緊繃", "溫暖", "空", "複雜"],
      depth: 2,
    },
    {
      question: "上一次真正感覺像自己，是什麼時候？",
      options: [
        "幾天前",
        "好久了——我都忘了那種感覺",
        "獨處的時候",
        "和特定的人在一起時",
      ],
      depth: 3,
    },
    {
      question: "那種感覺出現時，你通常怎麼做？",
      options: ["讓自己忙起來", "悄悄哭", "找人傾訴", "睡覺"],
      depth: 4,
    },
    {
      question: "如果那種感覺有聲音，它會對你低語什麼？",
      options: ["「你不夠好」", "「你是孤單的」", "「休息一下」", "「你是安全的」"],
      depth: 5,
    },
    {
      question: "最近，你哪一部分的自己最想被聽見？",
      options: [
        "小時候的自己",
        "現在疲憊的自己",
        "懷有夢想的自己",
        "我還不知道",
      ],
      depth: 6,
    },
    {
      question: "這一週裡，讓你堅持下去的小事是什麼？",
      options: ["早晨的例行", "有人在乎", "一杯咖啡", "我自己"],
      depth: 7,
    },
    {
      question: "結束這次會話後，你想給自己留下什麼話？",
      options: [
        "謝謝你一直撐著",
        "慢慢來，沒關係",
        "你值得休息",
        "我還會再聽你說話",
      ],
      depth: 8,
    },
  ],
  fallbackAnalysis: {
    archetype: "溫柔的觀察者",
    subtitle: "你感受很多，卻常常默默收起來。",
    narrative:
      "從你敘述的方式可以看出，你是一個敏感的人——對氛圍、對身邊的人、對自己內在細微的變化。這份敏感是天賦，也是你很少與人分享的重量。你傾向於先把情緒藏起來，獨自消化，等一切看似整齊了才說出口。在你的平靜背後，有一種安靜的疲憊；不是因為生活糟糕，而是因為你習慣先去理解別人。這次會話提醒你：理解他人，不必以犧牲對自己的理解為代價。",
    dimensions: { ketenangan: 68, kesadaranDiri: 82, resiliensi: 71, koneksiSosial: 54, regulasiEmosi: 63, harapan: 76 },
    themes: [
      { label: "高度敏感", note: "你能察覺別人忽略的細微差異。" },
      { label: "需要空間", note: "你在安靜中恢復得最好。" },
      { label: "內在的責任感", note: "你常常先責怪自己。" },
    ],
    strengths: [
      "高於平均的自我反思能力",
      "對他人真誠的關注",
      "一種安靜的韌性——不張揚，但持續",
    ],
    growth: [
      "在筋疲力盡之前，練習開口求助的勇氣",
      "區分同理心，與並不屬於你的情緒重量",
      "允許自己感受，而不必立刻去解決",
    ],
    recommendations: [
      { kind: "每日練習", title: "睡前 7 分鐘身體掃描", why: "幫助釋放你無意識儲存在肩膀與胸口的緊繃。" },
      { kind: "每週反思", title: "寫下這一週你沒說出口的一件事", why: "讓那個常常沉默的自己有聲音。" },
      { kind: "尋求幫助的訊號", title: "若空虛感持續超過 2 週", why: "這是該和專業人士談談的訊號——不是你軟弱。" },
    ],
  },
};

export const MindfulSeed = { id, en, 'zh-CN': zhCN, 'zh-TW': zhTW };

export function getSeed(lang) {
  return MindfulSeed[lang] || MindfulSeed.id;
}
