import { tokenize, type Tok } from './kana'

export type Word = {
  kana: string
  kanji?: string
  en: string
  note?: string
  read?: Record<number, string[]>
}

export const WORDS: Word[] = [
  { kana: 'やま', kanji: '山', en: 'mountain', note: '山 is a picture of three peaks.' },
  { kana: 'かわ', kanji: '川', en: 'river', note: '川 is flowing water. Its cursive form became つ.' },
  { kana: 'あめ', kanji: '雨', en: 'rain', note: 'The kanji shows drops falling from a cloud.' },
  { kana: 'うみ', kanji: '海', en: 'sea' },
  { kana: 'いけ', kanji: '池', en: 'pond', note: 'Temple gardens nearly always have one, often with koi.' },
  { kana: 'き', kanji: '木', en: 'tree', note: '木: trunk, branches, roots.' },
  { kana: 'もり', kanji: '森', en: 'forest', note: '森 = three trees. 林 (はやし, grove) = two.' },
  { kana: 'たき', kanji: '滝', en: 'waterfall' },
  { kana: 'あき', kanji: '秋', en: 'autumn', note: 'Your trip is in あき.' },
  { kana: 'はな', kanji: '花 / 鼻', en: 'flower / nose', note: 'Same sound, different kanji. Kanji resolve the homophones.' },
  { kana: 'さくら', kanji: '桜', en: 'cherry blossom' },
  { kana: 'そら', kanji: '空', en: 'sky', note: '空 also means "empty". In Buddhism it renders śūnyatā, emptiness.' },
  { kana: 'くも', kanji: '雲 / 蜘蛛', en: 'cloud / spider' },
  { kana: 'ほし', kanji: '星', en: 'star' },
  { kana: 'つき', kanji: '月', en: 'moon; month' },
  { kana: 'おてら', kanji: 'お寺', en: 'Buddhist temple', note: 'Said with the polite, "beautifying" お (bikago), as in おちゃ. In names 寺 is read じ or でら: きんかくじ, きよみずでら.' },
  { kana: 'かみ', kanji: '神', en: 'god, kami', note: 'Shinto spirits living in mountains, rocks and waterfalls. Also 紙 paper, 髪 hair.' },
  { kana: 'おに', kanji: '鬼', en: 'ogre, demon' },
  { kana: 'ねこ', kanji: '猫', en: 'cat' },
  { kana: 'しか', kanji: '鹿', en: 'deer', note: 'At Nara they are considered messengers of the gods.' },
  { kana: 'ゆき', kanji: '雪', en: 'snow', note: 'Nagano hosted the 1998 Winter Olympics.' },
  { kana: 'ふね', kanji: '船', en: 'boat, ship' },
  { kana: 'みち', kanji: '道', en: 'road, way', note: '道 is also the "dō" of じゅうどう, しょどう: a Way of practice.' },
  { kana: 'とり', kanji: '鳥', en: 'bird' },
  { kana: 'とりい', kanji: '鳥居', en: 'shrine gate', note: 'Literally "bird perch". It marks the entry into sacred space.' },
  { kana: 'いぬ', kanji: '犬', en: 'dog' },
  { kana: 'へや', kanji: '部屋', en: 'room' },
  { kana: 'ほたる', kanji: '蛍', en: 'firefly' },
  { kana: 'よる', kanji: '夜', en: 'night' },
  { kana: 'むし', kanji: '虫', en: 'insect, bug' },
  { kana: 'えき', kanji: '駅', en: 'train station', note: '駅 contains 馬 (horse): it once meant a post-horse station.' },
  { kana: 'せかい', kanji: '世界', en: 'world' },
  { kana: 'すし', kanji: '寿司', en: 'sushi', note: 'The kanji are ateji: chosen for sound and good luck ("long life, managing").' },
  { kana: 'ふろ', kanji: '風呂', en: 'bath' },
  { kana: 'れきし', kanji: '歴史', en: 'history' },
  { kana: 'のはら', kanji: '野原', en: 'meadow, field', note: '野 (の, field) is also in ながの and くまの.' },
  { kana: 'ひ', kanji: '火 / 日', en: 'fire / sun, day' },
  { kana: 'おんせん', kanji: '温泉', en: 'hot spring' },
  { kana: 'にほん', kanji: '日本', en: 'Japan', note: '日 sun + 本 origin: "the origin of the sun".' },
  { kana: 'なら', kanji: '奈良', en: 'Nara', note: 'Capital 710–784. Its kanji 奈 and 良 are where な and ら come from.' },
  { kana: 'くまの', kanji: '熊野', en: 'Kumano', note: '熊 bear + 野 field.' },
  { kana: 'たぬき', kanji: '狸', en: 'tanuki (raccoon dog)', note: 'A real animal and a folklore shapeshifter. Look for statues outside restaurants.' },
  { kana: 'きのこ', kanji: '茸', en: 'mushroom', note: 'Folk etymology: 木の子, "child of the tree".' },
  { kana: 'まつもと', kanji: '松本', en: 'Matsumoto (Nagano)', note: '松 pine + 本 base. It has a famous black castle.' },
  { kana: 'しま', kanji: '島', en: 'island' },
  { kana: 'かぜ', kanji: '風', en: 'wind; a cold', note: '゛ (dakuten) voices the consonant: せ se → ぜ ze.' },
  { kana: 'みず', kanji: '水', en: 'water' },
  { kana: 'もみじ', kanji: '紅葉', en: 'autumn maple leaves', note: 'Nagano mountains peak around now; Tokyo in late November.' },
  { kana: 'ふじさん', kanji: '富士山', en: 'Mount Fuji', note: 'This さん is 山 (mountain), not the honorific -san.' },
  { kana: 'ながの', kanji: '長野', en: 'Nagano', note: '長 long + 野 field.' },
  { kana: 'やなぎ', kanji: '柳', en: 'willow' },
  { kana: 'どんぐり', kanji: '団栗', en: 'acorn' },
  { kana: 'げた', kanji: '下駄', en: 'wooden sandals' },
  { kana: 'ごはん', kanji: 'ご飯', en: 'cooked rice; meal' },
  { kana: 'ざる', kanji: '笊', en: 'bamboo strainer', note: 'ざるそば is cold soba served on one.' },
  { kana: 'ぞう', kanji: '象', en: 'elephant', note: 'う after o lengthens it: zō.' },
  { kana: 'だんご', kanji: '団子', en: 'rice dumplings on a skewer' },
  { kana: 'でぐち', kanji: '出口', en: 'exit', note: '出 out + 口 mouth. The entrance is いりぐち 入口.' },
  { kana: 'ことば', kanji: '言葉', en: 'word, language', note: 'Literally "speech leaves".' },
  { kana: 'へび', kanji: '蛇', en: 'snake', note: 'In Okinawa, watch out for the habu (はぶ).' },
  { kana: 'ぶし', kanji: '武士', en: 'samurai, warrior', note: 'ぶしどう 武士道: the way of the warrior.' },
  { kana: 'べんとう', kanji: '弁当', en: 'boxed lunch', note: 'Station ones are えきべん, a genre of their own.' },
  { kana: 'やま を のぼる', kanji: '山を登る', en: 'to climb a mountain', note: 'を marks the object and is read o. ぼ = ほ + ゛.' },
  { kana: 'ぱん', kanji: 'パン', en: 'bread', note: 'From Portuguese pão (16th c.). Normally written in katakana.' },
  { kana: 'さんぽ', kanji: '散歩', en: 'a walk, stroll', note: 'ん before p sounds like m: sampo.' },
  { kana: 'てんぷら', kanji: '天ぷら', en: 'tempura', note: 'Probably also from Portuguese.' },
  { kana: 'ぴかぴか', en: 'sparkling, shiny', note: 'Onomatopoeia is everywhere. Pikachu = ぴか (sparkle) + ちゅう (squeak).' },
  { kana: 'ぺこぺこ', en: 'starving (tummy rumbling)' },
  { kana: 'みかづき', kanji: '三日月', en: 'crescent moon', note: '"Third-day moon". つき → づき: rendaku voices the second part of a compound.' },
  { kana: 'はなぢ', kanji: '鼻血', en: 'nosebleed', note: 'はな + ち → はなぢ, rendaku again. One of the few words with ぢ.' },
  { kana: 'きっぷ', kanji: '切符', en: 'ticket', note: 'Small っ is a pause that doubles the next consonant.' },
  { kana: 'かっぱ', kanji: '河童', en: 'kappa (river yōkai)', note: 'A water imp with a dish of water on its head. Loves cucumbers, hence かっぱまき.' },
  { kana: 'おちゃ', kanji: 'お茶', en: 'tea', note: 'Small ゃ glides: ち + ゃ → cia. The お is the polite, "beautifying" お (bikago), as in おてら.' },
  { kana: 'まっちゃ', kanji: '抹茶', en: 'matcha' },
  { kana: 'じんじゃ', kanji: '神社', en: 'Shinto shrine', note: 'Shrine = Shinto (じんじゃ). Temple = Buddhist (おてら).' },
  { kana: 'きょう', kanji: '今日', en: 'today' },
  { kana: 'きょうと', kanji: '京都', en: 'Kyoto', note: '京 capital + 都 metropolis. In Polish: Kioto.' },
  { kana: 'とうきょう', kanji: '東京', en: 'Tokyo', note: '東 east + 京 capital: the eastern capital. In Polish: Tokio.' },
  { kana: 'りょかん', kanji: '旅館', en: 'traditional inn' },
  { kana: 'しゅくぼう', kanji: '宿坊', en: 'temple lodging', note: 'Sleep at a temple and join the monks for morning prayers. Common on Kōyasan (こうやさん).' },
  { kana: 'りゅう', kanji: '竜', en: 'dragon' },
  { kana: 'くまの こどう', kanji: '熊野古道', en: 'Kumano Kodo (pilgrim trails)', note: '古 old + 道 way.' },
  { kana: 'なち の たき', kanji: '那智の滝', en: 'Nachi Falls', note: 'A 133 m drop, the tallest in Japan. The waterfall itself is worshipped as a kami.' },
  { kana: 'かみこうち', kanji: '上高地', en: 'Kamikōchi (alpine valley in Nagano)' },
  { kana: 'おきなわ', kanji: '沖縄', en: 'Okinawa', note: '沖 open sea + 縄 rope.' },
  { kana: 'ありがとう', en: 'thank you' },
  { kana: 'すみません', en: 'excuse me; sorry' },
  { kana: 'いただきます', en: '(said before eating)', note: 'Literally "I humbly receive".' },
  { kana: 'こんにちは', en: 'hello', read: { 4: ['ła', 'wa', 'ha'] }, note: 'The final は is the topic particle, read wa: "as for today…".' },
  { kana: 'わびさび', kanji: '侘寂', en: 'wabi-sabi', note: 'Beauty in the imperfect, impermanent and incomplete.' },
  { kana: 'いちご いちえ', kanji: '一期一会', en: 'one time, one meeting', note: 'A tea-ceremony idea: this moment will never happen again.' },
]

export const toks = (w: Word): Tok[] => tokenize(w.kana, w.read)

export const NEW_CHARS: Map<string, string[]> = (() => {
  const seen = new Set<string>()
  const m = new Map<string, string[]>()
  for (const w of WORDS) {
    const fresh = [...new Set([...w.kana.replace(/ /g, '')])].filter(c => !seen.has(c))
    fresh.forEach(c => seen.add(c))
    m.set(w.kana, fresh)
  }
  return m
})()

export const firstWordWith = (ch: string) => WORDS.find(w => w.kana.includes(ch))
