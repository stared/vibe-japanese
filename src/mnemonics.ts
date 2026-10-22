// These are recognition aids, not etymologies or pronunciation transcriptions.
// Start with the unmodified glyph. An added eye, face, colour or background cannot
// be the reason an analogy works. Each hook must name its distinguishing feature.
// A “bridge” has a useful shape anchor but needs an extra verbal association.
// Editorial checks: keep the kana upright; explain the rest of the silhouette;
// give the whole mora (not just its consonant); test against the nearest glyph.
// Colour is optional. Removing it must leave every recognition cue intact.
// Retained familiar anchors are intentional: novelty is not worth a worse cue.
export type Mnemonic = {
  hook: string
  shape: string
  sound: string
  kind: 'shape' | 'bridge'
  // Rectangles in the 100 × 100 glyph viewBox; colour existing ink only.
  focus: readonly [number, number, number, number][]
  feature: string
}

export const MNEMONICS: Record<string, Mnemonic> = {
  あ: {
    hook: 'An **a** tangled under a crossbar.',
    shape: 'Find the small a-like enclosure at lower left. A diagonal cuts through the broad lower curve; the upright continues up through a crossbar.',
    sound: 'Polish a, as in aparat. The letter resemblance is a memory aid, not a literal Latin a.',
    kind: 'shape', focus: [[10, 43, 43, 49]],
    feature: 'Top crossbar over a crossed lower oval; no separate dash.',
  },
  い: {
    hook: 'Two dotless **i**s; the left one is longer.',
    shape: 'Two separate strokes, like ii without dots. The left stroke bends inward at its foot; the right one is short.',
    sound: 'Polish i. Two strokes do not mean a long vowel: this is one i.',
    kind: 'shape', focus: [[56, 20, 28, 57]],
    feature: 'Short right stroke; the longer stroke is on the left.',
  },
  う: {
    hook: '**U**cho: an ear-shaped curve under a dash.',
    shape: 'The large curve bulges right like the outside of an ear. Keep the separate little dash above it: the dash is essential.',
    sound: 'Polish ucho → u. Japanese u is less rounded than Polish u.',
    kind: 'shape', focus: [[29, 8, 45, 20]],
    feature: 'Top dash; lower curve starts with a horizontal sweep, then bulges right.',
  },
  え: {
    hook: '**E**nergiczny runner: head, zigzag, trailing foot.',
    shape: 'The top dash is the head. Below it, an angular body runs down-left, then turns into a foot stretching right.',
    sound: 'Polish energiczny → e. Use the Polish vowel, not English “ee”.',
    kind: 'shape', focus: [[39, 55, 53, 34]],
    feature: 'Detached head; angular body ends in a rightward foot.',
  },
  お: {
    hook: '**O**sobno: a dash at upper right, two curls below.',
    shape: 'The upright curls into a small loop at lower left. The broad curve to its right and the separate upper-right dash make this the dotted member of the あ / お pair.',
    sound: 'Polish osobno → o: the upper-right dash stands separately. Remember the two lower curls too, since む also has a separate dash.',
    kind: 'shape', focus: [[68, 12, 25, 27]],
    feature: 'Separate upper-right dash; small left loop beside a rounded right arch.',
  },
  か: {
    hook: '**Ka**rate: a bent leg and a separate kick.',
    shape: 'The left side has a long slant crossing a bent, hooked stroke. The isolated slant at right is the kick. Remember both the hooked leg and the detached kick.',
    sound: 'Polish karate → ka. This is a stick-figure action, not a complete person.',
    kind: 'bridge', focus: [[66, 20, 28, 48]],
    feature: 'Hooked left part plus one separate slant on the right.',
  },
  き: {
    hook: 'A **key** with two teeth.',
    shape: 'Two crossbars cut the same sloping shaft. The curved bottom suggests the bow of a key. Both teeth matter; one tooth would point you toward さ.',
    sound: 'English key → ki. Shorten the vowel.',
    kind: 'shape', focus: [[10, 22, 79, 27]],
    feature: 'Two crossbars on a sloping stem; bottom curve opens right.',
  },
  く: {
    hook: '**Ku**rzy dziób: one sharp beak pointing left.',
    shape: 'The whole kana is the open beak: two straightish sides meeting at a left-facing point. No head or feathers are needed.',
    sound: 'Polish kurzy → ku, as in kurzy dziób.',
    kind: 'shape', focus: [[23, 33, 27, 33]],
    feature: 'One corner pointing left, with no curve or extra stroke.',
  },
  け: {
    hook: '**Ke**bab spit: knife at left, crossed skewer at right.',
    shape: 'The left upright, with its pointed foot, suggests a knife. The taller right upright is the spit, with one crosswise handle. Its lower end sweeps freely rather than curling into a closed loop.',
    sound: 'Polish kebab → ke. Kebab supplies the context; the paired knife and open-ended spit supply the shape.',
    kind: 'bridge', focus: [[51, 40, 32, 49]],
    feature: 'Separate left upright; one bar across the right upright; open tail.',
  },
  こ: {
    hook: '**Ko**rytarz: two walls, open at both ends.',
    shape: 'Two short horizontal curves bound an empty corridor. Nothing stands to their left and nothing crosses them.',
    sound: 'Polish korytarz → ko.',
    kind: 'shape', focus: [[16, 18, 71, 69]],
    feature: 'Only two horizontal strokes; no left upright.',
  },
  さ: {
    hook: '**Sa**nki: one crossbar above a curved runner.',
    shape: 'One bar crosses a sloping support; the bottom curls like a sled runner. Count one crossbar, not the two teeth of き.',
    sound: 'Polish sanki → sa. The runner is a side-view analogy, not a drawing of an entire sled.',
    kind: 'shape', focus: [[12, 23, 76, 18]],
    feature: 'One crossbar; lower curve opens toward the right.',
  },
  し: {
    hook: 'A fi**shi**ng hook with a bare stem.',
    shape: 'One long downstroke turns upward at the bottom. There are no crossbars on the stem: a completely bare hook.',
    sound: 'English fishing supplies shi in the middle of the word. Polish si, as in sito, is a closer guide to the Japanese consonant.',
    kind: 'shape', focus: [[23, 53, 59, 37]],
    feature: 'One upright hook; no crossbars and no enclosed loop.',
  },
  す: {
    hook: '**Su**peł: a hanging knot with a loose tail.',
    shape: 'A horizontal support crosses a hanging cord. The cord makes a small knot, then keeps going downward. The tail below the knot is part of the cue.',
    sound: 'Polish supeł → su.',
    kind: 'shape', focus: [[34, 42, 36, 47]],
    feature: 'One full crossbar; small central loop with a tail dropping below it.',
  },
  せ: {
    hook: '**Se**ven sitting inside a squared U.',
    shape: 'The top bar and short right downstroke suggest 7. A second, longer downstroke at left bends under it into a broad U-like base. There is no closed loop.',
    sound: 'English seven → se. The 7 is only one part of the kana; keep its enclosing U.',
    kind: 'shape', focus: [[15, 31, 60, 13], [60, 34, 15, 27]],
    feature: 'Two uprights through one bar; right one ends short, left one bends under.',
  },
  そ: {
    hook: '**So**fa nap: a Z over a curled armrest.',
    shape: 'The upper zigzag is a Z for sleep. Under it, the large C-shaped curve suggests a rolled sofa arm. Keep the Z and the curve opening right; without the Z the bottom resembles て.',
    sound: 'Polish sofa → so. “A nap on the sofa” connects the visible Z to the sound; this is a verbal bridge.',
    kind: 'bridge', focus: [[17, 12, 66, 36]],
    feature: 'Upper zigzag; lower curve opens right, like C.',
  },
  た: {
    hook: '**Ta**niec: a leaning dancer, two footprints at right.',
    shape: 'The left cross is a stick figure with outstretched arms and a leaning body. The two short curves on the right are footprints. Keep both prints separate: there is no closed loop on the right.',
    sound: 'Polish taniec → ta. The dance scene is a bridge; the reliable structure is a t-shaped left side and two separate right strokes.',
    kind: 'bridge', focus: [[9, 22, 45, 13], [15, 12, 28, 77]],
    feature: 'Crossed t at left; two separate horizontal curves at right.',
  },
  ち: {
    hook: '**Chi**lli (English): crossed stalk, curled belly.',
    shape: 'The top stalk sticks up through a crossbar. Below it, a plump pepper curves out to the right, then tapers back left. The silhouette also resembles a handwritten 5.',
    sound: 'English chilli → chi. Use the English word here: Polish chili starts with a different consonant. Polish ci, as in cichy, is closer to the Japanese sound.',
    kind: 'shape', focus: [[25, 44, 61, 44]],
    feature: 'Crossed top; lower belly bulges right and opens left.',
  },
  つ: {
    hook: '**Tsu**nami: one wave curling back left.',
    shape: 'The top sweeps right, then the curve turns back left below it. One continuous low wave, with no dash above.',
    sound: 'Tsunami → tsu. In Polish spelling, think cu; pronounce the initial ts rather than dropping it.',
    kind: 'shape', focus: [[55, 26, 34, 53]],
    feature: 'One low right-bulging curve, without a top dash.',
  },
  て: {
    hook: '**Te**: a T whose stem curls right.',
    shape: 'One broad top bar flows into a curved stem underneath. No zigzag sits above the bar.',
    sound: 'The Polish name of the letter T is te.',
    kind: 'shape', focus: [[13, 18, 75, 20]],
    feature: 'One top bar with a C-shaped bend below; no upper zigzag.',
  },
  と: {
    hook: '**To**rba: a tilted handle over an open bag.',
    shape: 'The short diagonal points into a broad, low bowl-shaped stroke. The diagonal is the handle; the lower curve is the bag seen from the side.',
    sound: 'Polish torba → to. Keep the handle slanted and the bowl open.',
    kind: 'shape', focus: [[28, 10, 28, 37]],
    feature: 'Short slanted stroke above a low, upward-opening bowl.',
  },
  な: {
    hook: '**Na** krzyż, then a loop and a dash.',
    shape: 'Start with the cross on the left: na krzyż. To its right are a detached dash and a dangling loop. The right side is not the two open curves of た.',
    sound: 'Polish na krzyż → na. The phrase names the strongest part of the shape; the loop and dash finish its fingerprint.',
    kind: 'bridge', focus: [[9, 14, 47, 49]],
    feature: 'Cross at upper left; separate dash and loop on the right.',
  },
  に: {
    hook: '**Ni**ci: a needle beside two lengths of thread.',
    shape: 'The long left stroke is the needle; the two separate right curves are the threads. Remember the needle as well as both threads.',
    sound: 'Polish nici → ni; English needle also begins with a similar sound.',
    kind: 'shape', focus: [[12, 14, 26, 76]],
    feature: 'Uncrossed upright on the left of two short horizontal strokes.',
  },
  ぬ: {
    hook: '**Nu**dle: crossed strands, then a little curl at the end.',
    shape: 'Two sloping strands cross above a broad oval. Follow the right end: it curls into an extra small loop. That final loop distinguishes it from め.',
    sound: 'Polish nudle → nu, or English noodles → noo. Shorten the English vowel.',
    kind: 'shape', focus: [[51, 60, 39, 29]],
    feature: 'Crossed sloping start and a small finishing loop at lower right.',
  },
  ね: {
    hook: 'Cursive **ne**, ending in a little e loop.',
    shape: 'The tall left stem and arch suggest n; the small curl at lower right suggests a cursive e. Keep both the tall stem and the final curl.',
    sound: 'Read the suggested ne with Polish vowels, as in neon.',
    kind: 'shape', focus: [[51, 59, 40, 30]],
    feature: 'Upright left stem; right arch ends in a small loop.',
  },
  の: {
    hook: '**NO**: a round sign with its slash built in.',
    shape: 'The diagonal inside the round outline suggests a prohibition sign. Both are already in the single stroke; no symbol needs to be added.',
    sound: 'The written word NO recalls the sound. Say a short Polish no, not English “noh” with a glide.',
    kind: 'shape', focus: [[27, 22, 32, 54]],
    feature: 'One round sweep with an inward diagonal; no projecting stem.',
  },
  は: {
    hook: '**Ha**: h and a sharing an upright.',
    shape: 'The two uprights and connecting bar suggest h. The right upright curls into an a-like loop. It extends above its single crossbar.',
    sound: 'Read ha with Polish vowels. As the topic particle this kana is read wa (Polish ła).',
    kind: 'shape', focus: [[43, 56, 47, 34]],
    feature: 'Left upright; one right crossbar; loop at the foot.',
  },
  ひ: {
    hook: '**Hi-hi!** A deep grin with two flicked-up corners.',
    shape: 'The stroke drops into a deep U, then rises back up. The short outward flicks at both upper ends are the corners of the grin.',
    sound: 'Polish hi-hi → hi. Japanese hi has a softer, more forward consonant than an ordinary Polish h.',
    kind: 'shape', focus: [[16, 45, 66, 44]],
    feature: 'One deep U-shaped curve, open upward, with flicks at both ends.',
  },
  ふ: {
    hook: '**Fu**ji: smoke between two sloping sides.',
    shape: 'The middle bends like drifting smoke, with a short dash above it. The strokes at lower left and right suggest the mountain slopes. In brush-style fonts, fine lines may connect them.',
    sound: 'Mount Fuji → fu. Japanese f here is blown between the lips, without the teeth touching the lower lip.',
    kind: 'shape', focus: [[8, 47, 26, 38], [70, 47, 24, 38]],
    feature: 'Central bend and top dash, flanked by two lower side strokes.',
  },
  へ: {
    hook: '**He**łm: one pointed ridge.',
    shape: 'Just the roof-like top of a pointed helmet: a short climb, a peak left of centre, then a longer descent. The kana supplies the whole ridge.',
    sound: 'Polish hełm → he. As the direction particle, へ is read e.',
    kind: 'shape', focus: [[19, 29, 40, 29]],
    feature: 'One upward peak, with the longer slope descending right.',
  },
  ほ: {
    hook: '**Ho**tel: two floors, round lobby, lift shaft at left.',
    shape: 'Two bars form the floors on the right; the loop below is the lobby. The separate left upright is the lift shaft. The right upright meets, but does not poke above, the top floor.',
    sound: 'Polish hotel → ho. All three parts matter: floors, lobby, lift shaft.',
    kind: 'bridge', focus: [[39, 15, 49, 32]],
    feature: 'Left upright plus two right crossbars and a bottom loop.',
  },
  ま: {
    hook: '**Ma**szt: two crossbars and a rope coiled at the foot.',
    shape: 'Two crossbars sit on one central mast. At the bottom the stroke coils into a loop, then trails right. No separate upright stands to the left.',
    sound: 'Polish maszt → ma.',
    kind: 'shape', focus: [[15, 23, 72, 27]],
    feature: 'One central stem, two crossbars, bottom loop; no left upright.',
  },
  み: {
    hook: '**Mi**krofon: small head at left, stand at right.',
    shape: 'The low left loop is the microphone head. Its long diagonal body meets the short upright stand at right. The upper-left stroke is a trailing cable. Keep the small head on the left.',
    sound: 'Polish mikrofon → mi. Imagine a microphone tilted down-left on its stand.',
    kind: 'shape', focus: [[12, 48, 34, 39]],
    feature: 'Low left loop and a separate short upright at right; no top crossbar.',
  },
  む: {
    hook: '**Mu**u: looped muzzle, sweeping jaw, ear at upper right.',
    shape: 'See a cow’s head in profile: a small loop for the muzzle on the left, a broad low sweep for the jaw, a separate dash for the ear at upper right. The crossed top suggests a horn.',
    sound: 'Polish muuu or English moo → mu. Use a short vowel when reading the kana.',
    kind: 'shape', focus: [[15, 40, 34, 33], [66, 17, 26, 24]],
    feature: 'Small loop at left, broad low sweep, separate upper-right dash.',
  },
  め: {
    hook: 'Japanese **me** = eye: crossed lashes, no final knot.',
    shape: 'The broad oval suggests an eye; the two strokes projecting above it are crossing lashes. Its right end stays open instead of curling into ぬ’s little knot.',
    sound: 'Japanese me means eye. Say it like me in Polish metal, not English “me”. This cue teaches one Japanese word as well as the kana.',
    kind: 'shape', focus: [[62, 49, 28, 38]],
    feature: 'Crossed sloping start, no top crossbar; broad oval has no finishing knot.',
  },
  も: {
    hook: '**Mo**cowanie: a hook held by two bands.',
    shape: 'Two horizontal fixing bands cross the stem of a large hook. The bottom remains open: the fixing is around the stem, not a knot tied at its foot.',
    sound: 'Polish mocowanie → mo. The two bands distinguish this mounted hook from the bare hook of し.',
    kind: 'shape', focus: [[13, 27, 60, 27]],
    feature: 'Two crossbars on a hook that opens upward; no closed loop.',
  },
  や: {
    hook: '**Ja**cht: a curved hull pierced by a slanting mast.',
    shape: 'The upper-right curve is the hull; the long diagonal mast crosses it and sticks out below. The short detached stroke above suggests a pennant.',
    sound: 'Polish jacht → ja; Hepburn writes ya. The “mast through the hull” is deliberately peculiar and belongs to this outline.',
    kind: 'shape', focus: [[28, 18, 31, 71]],
    feature: 'Upper-right bowl crossed by a slanting stem; detached short stroke above.',
  },
  ゆ: {
    hook: 'An English **U**-turn around a tall post.',
    shape: 'Enter from the short bent stroke on the left, curve around the large oval and return. A tall post passes through the middle. Think of a turning loop seen at an angle, with a post standing in its centre.',
    sound: 'The English name of the letter U is “you”: yu in Hepburn, ju in Polish. Shorten the vowel. The Polish name of U would give the wrong sound.',
    kind: 'shape', focus: [[49, 11, 24, 79]],
    feature: 'Large central oval pierced by an upright; short bent tail at left.',
  },
  よ: {
    hook: '**Jo**-jo: a finger, a string, a loop below.',
    shape: 'A short bar sticks out only to the right of the long string. At the bottom the string loops left around the yo-yo.',
    sound: 'Polish jo-jo → jo; Hepburn writes yo.',
    kind: 'shape', focus: [[49, 20, 34, 20]],
    feature: 'Top bar extends only right; a loop hangs at the foot.',
  },
  ら: {
    hook: '**Ra**kietka: a bent bat with the ball above.',
    shape: 'The detached top dash is the ball. Below, a short handle drops into a wide curved bat. The ball stays separate: it is not a bar crossing the handle.',
    sound: 'Polish rakietka → ra. The bat outline is open, so this is a shape suggestion rather than a complete drawing.',
    kind: 'shape', focus: [[29, 10, 45, 20]],
    feature: 'Separate top dash; lower stroke begins with a short upright then bulges right.',
  },
  り: {
    hook: '**Ri**ver: the right bank runs farther downstream.',
    shape: 'The left side is short. The right side descends much farther and sweeps left at its foot. Some typefaces connect the tops; the long right side still identifies it.',
    sound: 'English river → ri. The r is a light Japanese tap, not the usual English r.',
    kind: 'shape', focus: [[38, 47, 41, 43]],
    feature: 'Short left side; long right side sweeps down-left; no crossbar.',
  },
  る: {
    hook: '**Ru**lon: a zigzag ending in a rolled loop.',
    shape: 'The upper zigzag leads into a rounded lower curve. Its very end rolls up into a small loop at the bottom. Think of a rulon rolled at its end.',
    sound: 'Polish rulon → ru.',
    kind: 'shape', focus: [[25, 61, 44, 28]],
    feature: 'Upper zigzag and a small rolled loop at the bottom.',
  },
  れ: {
    hook: '**Re**ling: up, over, down, then a foot flicking out.',
    shape: 'A tall left upright and a high arch make a railing. The right leg comes down and flicks outward to the right; it never turns inward to form a belly or knot.',
    sound: 'Polish reling → re. The railing is a bridge to the sound; the outward foot is the decisive feature.',
    kind: 'bridge', focus: [[59, 57, 34, 32]],
    feature: 'Upright left stem; right leg ends in an outward foot.',
  },
  ろ: {
    hook: '**Ro**gal: a sharp top and an open crescent below.',
    shape: 'Below the upper zigzag is a broad crescent-like curve. Its end remains open; it does not roll into the small loop of る.',
    sound: 'Polish rogal → ro. The crescent is the useful part of the food analogy; no crumbs or plate are needed.',
    kind: 'shape', focus: [[26, 63, 53, 25]],
    feature: 'Upper zigzag; lower curve bulges right and ends without a little loop.',
  },
  わ: {
    hook: '**Ła**pka: a thumb beside one big rounded palm.',
    shape: 'The straight left stem suggests a thumb; the large right bulge a mitten-like palm. The right curve turns inward without a little terminal knot.',
    sound: 'Polish łapka → ła; Hepburn writes wa. Polish w would suggest the wrong consonant.',
    kind: 'shape', focus: [[46, 39, 44, 46]],
    feature: 'Upright left stem; big rounded right belly, no terminal knot.',
  },
  を: {
    hook: '**O**platam: a strand weaving through a fork, then under it.',
    shape: 'A crossed, forked top sits over a broad low curve. The final sweeping strand enters from upper right, passes through the fork and bends underneath.',
    sound: 'Polish oplatam → o: “I wind around”. Usually written wo when naming or typing this kana, but pronounced o as the object particle.',
    kind: 'bridge', focus: [[37, 39, 54, 51]],
    feature: 'Crossed fork on top; a third sweeping stroke passes through and underneath.',
  },
  ん: {
    hook: 'A handwritten **n** with a long entry stroke.',
    shape: 'Follow the long slant down into a lowercase n-like hump, then out to the right. There is no closed loop and no crossbar.',
    sound: 'N on its own, not na or nu. Its pronunciation adapts to the following sound.',
    kind: 'shape', focus: [[30, 43, 58, 44]],
    feature: 'Long slanted entry into one low hump and an upturned exit.',
  },
}

// Each group is a deliberate “could this cue fit its neighbour?” check.
// Features describe visible ink, so the comparison survives hiding the analogy.
export const LOOK_ALIKES = [
  { kana: 'あお', title: 'Crossing or separate dash?' },
  { kana: 'あめぬ', title: 'Top crossbar, plain oval, or finishing knot?' },
  { kana: 'いり', title: 'Which side is longer?' },
  { kana: 'りけ', title: 'Long right side: is there a crossbar?' },
  { kana: 'うつらちろ', title: 'Look above the right-bulging curve.' },
  { kana: 'きさち', title: 'Count the bars, then follow the belly.' },
  { kana: 'しも', title: 'Bare hook or loaded hook?' },
  { kana: 'すせ', title: 'Hanging knot or squared base?' },
  { kana: 'そてろ', title: 'Check the top, then the direction of the bend.' },
  { kana: 'たなにこ', title: 'What stands to the left? What sits to the right?' },
  { kana: 'ぬめ', title: 'Does the final stroke tie a knot?' },
  { kana: 'ねれわ', title: 'Small knot, outward foot, or rounded belly?' },
  { kana: 'ねぬ', title: 'Same final knot; different left side.' },
  { kana: 'けはほ', title: 'Open tail, one-bar loop, or two-bar loop?' },
  { kana: 'ほまよ', title: 'Look left; count the bars.' },
  { kana: 'まも', title: 'Closed loop or open hook?' },
  { kana: 'すむよ', title: 'Does the loop hang, spread out, or sit at the foot?' },
  { kana: 'みむゆ', title: 'Small left loop or large central oval?' },
  { kana: 'るろ', title: 'Rolled end or open end?' },
  { kana: 'くへ', title: 'Does the corner point left or up?' },
  { kana: 'えん', title: 'Detached head or one continuous stroke?' },
  { kana: 'えれ', title: 'Detached head or tall left stem?' },
  { kana: 'おむ', title: 'Same upper-right dash; different lower sweep.' },
  { kana: 'とひ', title: 'Separate handle or one deep U?' },
  { kana: 'かや', title: 'Separate right kick or upper-right bowl?' },
  { kana: 'ふへ', title: 'Smoke and side strokes, or one continuous ridge?' },
  { kana: 'をち', title: 'Extra sweeping strand or a simple right belly?' },
] as const

export function comparison(a: string, b: string): string | null {
  if (a === b || !MNEMONICS[a] || !MNEMONICS[b]) return null
  if (!LOOK_ALIKES.some(g => g.kana.includes(a) && g.kana.includes(b))) return null
  return `${a}: ${MNEMONICS[a].feature} ${b}: ${MNEMONICS[b].feature}`
}
