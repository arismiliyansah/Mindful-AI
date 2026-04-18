// Fallback content used when window.claude is unavailable or for demo seeding.
// All in Bahasa Indonesia, warm tone, using "kamu".

window.MindfulSeed = {
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

  // Used if AI call fails — still feels adaptive enough for a demo
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
    dimensions: {
      ketenangan: 68,
      kesadaranDiri: 82,
      resiliensi: 71,
      koneksiSosial: 54,
      regulasiEmosi: 63,
      harapan: 76,
    },
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
      {
        kind: "Latihan harian",
        title: "Body scan 7 menit sebelum tidur",
        why: "Membantu melepas ketegangan yang kamu simpan tanpa sadar di bahu dan dada.",
      },
      {
        kind: "Refleksi mingguan",
        title: "Tulis satu hal yang tidak kamu ucapkan minggu ini",
        why: "Memberi suara pada bagian dirimu yang sering diam.",
      },
      {
        kind: "Tanda untuk mencari bantuan",
        title: "Kalau perasaan kosong bertahan > 2 minggu",
        why: "Itu sinyal untuk bicara dengan profesional — bukan tanda kamu lemah.",
      },
    ],
  },

  // For the dashboard history (simulated past sessions)
  pastSessions: [
    { date: "04 Apr", archetype: "Pelari yang Lelah", tone: "cemas", dim: 58 },
    { date: "11 Apr", archetype: "Sang Pencari", tone: "bingung", dim: 62 },
    { date: "15 Apr", archetype: "Pengamat yang Lembut", tone: "tenang", dim: 71 },
  ],
};
