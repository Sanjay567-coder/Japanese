// lib/translations.ts
// All bilingual copy for the Sensei farewell website
// Japanese uses JLPT N5/N4-level vocabulary throughout

export type Language = "en" | "ja";

export interface TranslationEntry {
  en: string;
  ja: string;
}

export const translations = {
  // --- Screen 1: Entrance ---
  entrance: {
    subtitle: {
      en: "Japanese Language Class",
      ja: "日本語のクラス",
    },
    heading1: {
      en: "A Farewell to",
      ja: "さようなら、",
    },
    heading2: {
      en: "Sensei Gowrisankar",
      ja: "ゴウリサンカル先生",
    },
    tagline: {
      en: "Thank you for every word, every song, every story.",
      ja: "先生のことばと歌と話、ありがとうございます。",
    },
    cta: {
      en: "Enter",
      ja: "入る",
    },
    ctaSubtext: {
      en: "Begin your journey",
      ja: "はじめましょう",
    },
  },

  // --- Screen 2: Hub Dashboard ---
  hub: {
    greeting: {
      en: "Welcome",
      ja: "いらっしゃいませ",
    },
    subgreeting: {
      en: "A small gift from your students.",
      ja: "先生へ、学生からのプレゼントです。",
    },
    memoryLane: {
      title: { en: "Memory Lane", ja: "おもいで" },
      desc: {
        en: "Our first day and the moments we treasure",
        ja: "はじめての日と、たいせつなきおく",
      },
    },
    arigatou: {
      title: { en: "Arigatou Board", ja: "ありがとうボード" },
      desc: {
        en: "Messages of gratitude from every student",
        ja: "みんなからのかんしゃのメッセージ",
      },
    },
    vocab: {
      title: { en: "Class Vocab Canvas", ja: "たんごキャンバス" },
      desc: {
        en: "Words we learned together in your class",
        ja: "いっしょにおぼえたことば",
      },
    },
  },

  // --- Screen 3: Memory Lane ---
  memoryLane: {
    title: { en: "Memory Lane", ja: "おもいでのみち" },
    subtitle: {
      en: "The First Day & Beyond",
      ja: "はじめての日、そしてそのあと",
    },
    audioLabel: { en: "Play the Song", ja: "うたをかける" },
    audioCaption: {
      en: "The song that started it all ♪",
      ja: "すべてのはじまりのうた ♪",
    },
    narrative: [
      {
        en: "On the very first day of Japanese class, before we even opened our textbooks, Sensei Gowrisankar stood at the front of the room and began to sing. It was the theme song from One Piece — Luffy's song — and we realized instantly that this was going to be unlike any class we had ever taken.",
        ja: "日本語のクラスのはじめての日、テキストを開くまえに、ゴウリサンカル先生はきょうしつのまえに立って、うたいはじめました。それはワンピースのうた、ルフィのうた。そのとき、わたしたちはすぐわかりました。このクラスは、ほかのクラスとちがう、と。",
      },
      {
        en: "Sensei never just taught us kanji — he told us their stories. Every character had a reason, a picture hidden inside it, a history. He would draw in the air, act out the meaning with his whole body, and suddenly the abstract symbol became something alive and unforgettable.",
        ja: "先生はかんじをただおしえませんでした。かんじのはなしをしてくれました。すべてのもじには、りゆうがあります。なかにえがかくれています。せんせいはからだぜんぶでいみをえんじました。そして、むずかしいもじは、いきているものになりました。",
      },
      {
        en: "His teaching was never passive. He had us stand up, mime actions, repeat phrases with energy, sing vocabulary, and laugh along the way. The classroom felt less like a lecture hall and more like a stage — a place where language was performed, not just memorized.",
        ja: "せんせいのじゅぎょうは、じっとすわるだけではありませんでした。立ちあがって、からだをうごかして、げんきよくことばをいいました。うたって、わらって、たのしいクラスでした。きょうしつはぶたいみたいでした。ことばはおぼえるものではなく、えんじるものでした。",
      },
      {
        en: "Thank you, Sensei, for making Japanese feel like a living, breathing world — not a subject to pass, but a language to love. We will carry your songs, your stories, and your energy with us wherever we go.",
        ja: "先生、ありがとうございます。日本語をいきいきとしたせかいにしてくれました。テストのためではなく、あいするためのことば。先生のうたと、はなしと、エネルギーを、わたしたちはずっとわすれません。",
      },
    ],
    photoCaption: {
      en: "Our class — a memory we'll carry forever",
      ja: "わたしたちのクラス、ずっとわすれない",
    },
  },

  // --- Screen 4: Arigatou Board ---
  arigatou: {
    title: { en: "Arigatou, Sensei", ja: "先生、ありがとう" },
    subtitle: {
      en: "Messages from your students",
      ja: "学生からのメッセージ",
    },
    from: { en: "A student", ja: "学生より" },
    tapHint: { en: "Tap to read", ja: "タップしてよむ" },
  },

  // --- Screen 5: Vocab Canvas ---
  vocab: {
    title: { en: "Class Vocab Canvas", ja: "クラスのたんごキャンバス" },
    subtitle: {
      en: "Words we learned — and the memories attached to them",
      ja: "おぼえたことばと、そのきおく",
    },
    clickHint: { en: "Click a word to learn more", ja: "ことばをクリックしてね" },
  },

  // --- Navigation ---
  nav: {
    home: { en: "Home", ja: "ホーム" },
    memory: { en: "Memories", ja: "おもいで" },
    arigatou: { en: "Arigatou", ja: "ありがとう" },
    vocab: { en: "Vocab", ja: "たんご" },
  },

  // --- Language toggle ---
  toggle: {
    switchTo: { en: "日本語", ja: "English" },
  },

  // --- Common ---
  common: {
    backToHub: { en: "← Back to Hub", ja: "← もどる" },
    loading: { en: "Loading…", ja: "よみこみちゅう…" },
  },
} as const;

export type TranslationKey = keyof typeof translations;

// Helper hook usage:
// const { lang } = useLanguage();
// const t = (entry: TranslationEntry) => entry[lang];
