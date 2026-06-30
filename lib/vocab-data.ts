// lib/vocab-data.ts
// Easily-editable vocabulary word list for the Class Vocab Canvas (Screen 5)
// Replace or extend this array without touching any layout code.

export interface VocabWord {
  id: string;
  word: string;      // The word/phrase (romanized or Japanese script)
  kana?: string;     // Hiragana/katakana reading (optional)
  meaning: string;  // English meaning
  memory?: string;  // A classroom memory tied to this word (optional)
  romaji?: string;  // Romanization for display
}

export const vocabWords: VocabWord[] = [
  {
    id: "v-01",
    word: "頑張って",
    kana: "がんばって",
    romaji: "Ganbatte",
    meaning: "Do your best! / Keep going!",
    memory: "Sensei shouted this every time we tried something hard.",
  },
  {
    id: "v-02",
    word: "お疲れ様",
    kana: "おつかれさまです",
    romaji: "Otsukaresama desu",
    meaning: "You've worked hard / Good work",
    memory: "We said this at the end of every class.",
  },
  {
    id: "v-03",
    word: "よろしく",
    kana: "よろしく",
    romaji: "Yoroshiku",
    meaning: "Nice to meet you / Please take care of me",
    memory: "The first phrase we learned — day one, bows and all.",
  },
  {
    id: "v-04",
    word: "楽しい",
    kana: "たのしい",
    romaji: "Tanoshii",
    meaning: "Fun / Enjoyable",
    memory: "This word described every class with Sensei.",
  },
  {
    id: "v-05",
    word: "分かった",
    kana: "わかった",
    romaji: "Wakatta",
    meaning: "I understood! / Got it!",
    memory: "The moment a kanji clicked — Sensei's face lit up every time.",
  },
  {
    id: "v-06",
    word: "先生",
    kana: "せんせい",
    romaji: "Sensei",
    meaning: "Teacher",
    memory: "The most important word we learned.",
  },
  {
    id: "v-07",
    word: "ありがとう",
    kana: "ありがとう",
    romaji: "Arigatou",
    meaning: "Thank you",
    memory: "We say this from the heart — to you, Sensei.",
  },
  {
    id: "v-08",
    word: "また会おう",
    kana: "またあおう",
    romaji: "Mata aou",
    meaning: "Let's meet again",
    memory: "The words we hope hold true for all of us.",
  },
];
