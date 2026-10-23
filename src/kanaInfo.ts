export const ORIGIN: Record<string, string> = {
  あ: '安', い: '以', う: '宇', え: '衣', お: '於',
  か: '加', き: '幾', く: '久', け: '計', こ: '己',
  さ: '左', し: '之', す: '寸', せ: '世', そ: '曽',
  た: '太', ち: '知', つ: '川', て: '天', と: '止',
  な: '奈', に: '仁', ぬ: '奴', ね: '祢', の: '乃',
  は: '波', ひ: '比', ふ: '不', へ: '部', ほ: '保',
  ま: '末', み: '美', む: '武', め: '女', も: '毛',
  や: '也', ゆ: '由', よ: '与',
  ら: '良', り: '利', る: '留', れ: '礼', ろ: '呂',
  わ: '和', を: '遠', ん: '无',
}

export const ORIGIN_MEANING: Record<string, string> = {
  安: 'peaceful', 以: 'by means of', 宇: 'eaves; universe', 衣: 'clothing', 於: 'at, in',
  加: 'add', 幾: 'how many', 久: 'long time', 計: 'measure', 己: 'self',
  左: 'left', 之: 'this; of', 寸: 'inch', 世: 'world', 曽: 'formerly',
  太: 'thick', 知: 'know', 川: 'river', 天: 'heaven', 止: 'stop',
  奈: 'Nara', 仁: 'benevolence', 奴: 'servant', 祢: 'ancestral shrine', 乃: 'thus',
  波: 'wave', 比: 'compare', 不: 'not', 部: 'part', 保: 'protect',
  末: 'end', 美: 'beauty', 武: 'military', 女: 'woman', 毛: 'fur, hair',
  也: 'also', 由: 'reason', 与: 'give',
  良: 'good', 利: 'profit', 留: 'stay', 礼: 'bow, thanks', 呂: 'spine',
  和: 'harmony', 遠: 'far', 无: 'nothing',
}

export const NOTE: Record<string, string> = {
  し: 's + i → si (Hepburn shi): s softens before i.',
  ち: 't + i → ci (Hepburn chi): t becomes ć before i.',
  つ: 't + u → cu (Hepburn tsu): t becomes ts before u.',
  ふ: 'h + u → fu: a soft f, lips barely touching.',
  じ: 'z + i → dzi (Hepburn ji), same softening as し.',
  ぢ: 'd + i → dzi, sounds like じ. Rare: mostly from rendaku (はな + ち → はなぢ).',
  づ: 'd + u → dzu, sounds like ず. Rare: mostly from rendaku (みか + つき → みかづき).',
  は: 'Read wa when it is the topic particle (こんにちは).',
  へ: 'Read e when it is the direction particle ("to").',
  を: 'w + o → just o today. Used only as the object particle.',
  ん: 'The only lone consonant. Sounds like m before p, b, m (さんぽ → sampo).',
  っ: 'Small つ: a short pause that doubles the next consonant (きっぷ → kippu).',
  ゃ: 'Small や: glides into the previous kana (き + ゃ → kia).',
  ゅ: 'Small ゆ: glides into the previous kana (し + ゅ → siu).',
  ょ: 'Small よ: glides into the previous kana (き + ょ → kio).',
  ぱ: '゜ (maru) turns h into p. Old Japanese h was once p.',
}
