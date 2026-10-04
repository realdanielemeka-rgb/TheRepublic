(() => {
'use strict';
const $ = (s, r) => (r || document).querySelector(s);
const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
const body = document.body;
const RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
const lerp = (a, b, t) => a + (b - a) * t;
const sstep = (e0, e1, x) => { const t = clamp((x - e0) / (e1 - e0), 0, 1); return t * t * (3 - 2 * t); };
const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const backOut = t => { const c1 = 1.5, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };

/* ---------------- data ---------------- */
const G = 4.5;
const DISTRICTS = {
  food: { name: 'Food & Drink', n: 7, x: -22.5 },
  fin: { name: 'Insurance & Finance', n: 7, x: 0 },
  bank: { name: 'Banking & Travel', n: 3, x: 18 },
  home: { name: 'Home', n: 1, x: 29.25 }
};
const CASES = [
  { id: 'onga', s: 'Onga · Taste of Home', t: 'Taste of Home', b: 'Onga', c: 'Promasidor Nigeria', y: '2026', d: 'food', f: 1, img: 't-onga.webp', col: -7, row: 1, h: 12.5,
    line: "Wherever the taste feels like yours, that's home.", svc: 'Digital strategy · Social content · Creator engagement · Campaign amplification' },
  { id: 'cowbell', s: 'Cowbell · First Taste', t: 'Your First Taste', b: 'Cowbell', c: 'Promasidor Nigeria', d: 'food', f: 1, img: 't-cowbell-ramadan.webp', col: -6, row: 1, h: 11, line: 'Before the first taste, someone cared.' },
  { id: 'twisco', t: 'Everyday Hero', b: 'Twisco', c: 'Twisco', d: 'food', img: 't-twisco.webp', col: -5, row: 1, h: 6.6 },
  { id: 'chivita12', t: '12 Days of Christmas', b: 'Chivita', c: 'CHI Limited', d: 'food', img: 't-chivita-12-days-of-christmas.webp', col: -4, row: 1, h: 5.4 },
  { id: 'chivita2', t: "What's Your Chivita?", b: 'Chivita', c: 'CHI Limited', d: 'food', img: 't-chivita-2-campaign.webp', col: -7, row: 0, h: 4.2 },
  { id: 'ramadan', t: 'Ramadan TVCs', b: 'Chivita & Hollandia', c: 'CHI Limited', d: 'food', img: 't-chivita-hollandia-ramadan.webp', col: -6, row: 0, h: 3.4 },
  { id: 'sips', t: "Style N' Sips", b: 'Chivita', c: 'CHI Limited', d: 'food', img: 't-chivita-style-n-sips.webp', col: -5, row: 0, h: 3.8 },
  { id: 'dreams', t: 'We Do Dreams', b: 'Prudential Zenith Life', c: 'Prudential Zenith Life', d: 'fin', img: null, col: -2, row: 1, h: 5.2 },
  { id: 'pzl', s: 'PZL · Empowering Tomorrow', t: 'Empowering Tomorrow', b: 'Prudential Zenith Life', c: 'Prudential Zenith Life', d: 'fin', f: 1, img: 't-pzl-empowering-tomorrow.webp', col: -1, row: 1, h: 11.8, line: 'Boss in 2026. Boss in 2066.' },
  { id: 'youmatter', t: 'You Matter', b: 'Prudential Zenith Life', c: 'Prudential Zenith Life', d: 'fin', img: 't-pzl-you-matter.webp', col: 0, row: 1, h: 6.4 },
  { id: 'sanlam', t: 'Live with Confidence', b: 'Sanlam Allianz', c: 'Sanlam Allianz', d: 'fin', img: 't-sanlam-allianz.webp', col: 1, row: 1, h: 5.8 },
  { id: 'pzlsocial', t: 'Content & Social', b: 'Prudential Zenith Life', c: 'Prudential Zenith Life', d: 'fin', img: 't-pzl-social-content.webp', col: -2, row: 0, h: 3.6 },
  { id: 'heirs', t: 'Launch Video', b: 'Heirs Insurance', c: 'Heirs Insurance', d: 'fin', img: 't-heirs.webp', col: -1, row: 0, h: 3.3 },
  { id: 'iinvest', t: 'Secure the Bag', b: 'i-invest', c: 'i-invest', d: 'fin', img: 't-i-invest.webp', col: 1, row: 0, h: 3.9 },
  { id: 'zenith', s: 'Zenith · Homecoming', t: 'See Homecoming Differently', b: 'Zenith Bank', c: 'Zenith Bank', d: 'bank', f: 1, img: 't-zenith-bank-homecoming.webp', col: 3, row: 1, h: 11.2 },
  { id: 'zenith35', t: 'The Future of Zenith', b: 'Zenith Bank', c: 'Zenith Bank', d: 'bank', img: 't-zenith-bank-35th-anniversary.webp', col: 4, row: 1, h: 6.2 },
  { id: 'torrista', t: 'See for Yourself', b: 'Torrista', c: 'Sterling Bank', d: 'bank', img: 't-torrista.webp', col: 3, row: 0, h: 3.8 },
  { id: 'spruce', s: 'Spruce · True Colours', t: 'Show Your True Colours', b: 'Spruce by Dulux', c: 'CAP Plc', d: 'home', f: 1, img: 't-spruce-dulux.webp', col: 6, row: 1, h: 10.8, line: 'Which colour feels like you?' }
];
CASES.forEach((c, i) => {
  c.i = i;
  c.x = (c.col + .5) * G;
  c.z = c.row === 1 ? -G / 2 : G / 2;
  c.fp = c.f ? 3.2 : 2.6;
  c.low = .8 + ((i * 37) % 10) / 10;
});
const byId = Object.fromEntries(CASES.map(c => [c.id, c]));
byId.cowbell.svc = 'Social strategy · Content planning · Creator collaboration · Campaign amplification';
byId.cowbell.y = '2026';
byId.zenith.svc = 'Strategy · Creative platform · Campaign creative';
byId.zenith.line = 'They left to grow. They return to belong.';
byId.pzl.svc = 'Campaign strategy · Content and social · Integrated communications';
byId.pzl.y = '2025–26';
byId.spruce.svc = 'Digital strategy · Creator and clipper distribution · Pinterest room inspiration · Campaign amplification';
byId.spruce.y = '2026';
byId.spruce.c = 'CAP Plc';
const WORLDS = { onga: { world: 'onga', kase: 'onga-case', col: '#0F3A27' }, cowbell: { world: 'cowbell', kase: 'cowbell-case', col: '#0B1033' }, spruce: { world: 'spruce', kase: 'spruce-case', col: '#E4E2DC' }, pzl: { world: 'pzl', kase: 'pzl-case', col: '#C8202A' }, zenith: { world: 'zenith', kase: 'zenith-case', col: '#0A0A0C' } };
// the ten Spruce colour personalities, in the order the room is painted (colours sampled from the character-film stills)
const SPC = [
  { n: 'Steeze White', c: '#E4E2DC', img: 'sp-steeze.webp', a: 1.421 },
  { n: 'Baddie Pink', c: '#C66A93', img: 'sp-pink.webp', a: 1.479 },
  { n: 'Old Money Green', c: '#234B38', img: 'sp-green.webp', a: 1.48 },
  { n: 'Odogwu Red', c: '#BF121A', img: 'sp-red.webp', a: 1.565 },
  { n: 'Soft Life Blue', c: '#0A5AA4', img: 'sp-blue.webp', a: 1.479 },
  { n: 'IJGB Orange', c: '#E2581C', img: 'sp-orange.webp', a: 1.33 },
  { n: 'Shakara Purple', c: '#58298A', img: 'sp-purple.webp', a: 1.479 },
  { n: 'Ajebo Yellow', c: '#D6A514', img: 'sp-yellow.webp', a: 1.349 },
  { n: 'Sarki Brown', c: '#8B5236', img: 'sp-brown.webp', a: .803 },
  { n: 'Idan Black', c: '#141416', img: 'sp-black.webp', a: 1.479 }
];
SPC.forEach(o => {
  const h = o.c.replace('#', ''), rgb = [0, 2, 4].map(i => parseInt(h.substr(i, 2), 16) / 255);
  const lin = rgb.map(v => v <= .04045 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4));
  o.rgb = rgb; o.light = (.2126 * lin[0] + .7152 * lin[1] + .0722 * lin[2]) > .36;
});
const NOTES = {
  onga: [['01 · Business problem', 'Improved Beef and Chicken cubes needed renewed consideration after three years of share decline.'], ['02 · Human truth', 'Home is wherever the taste feels like yours.'], ['03 · Idea', 'Ask people what home means, then build the platform from their answers.'], ['04 · System', "The open question → answers returned to the feed → Stan Nze's meal for Lolo → Food Creator Icon at AMVCA Cultural Day → family films, Kitchen Court and World Jollof Day."], ['05 · Evidence', 'Instagram views and 1,470 follows from two July launch-film records. Lifetime post metrics, including repeat exposure.', '37.2M']],
  zenith: [['01 · Business problem', 'Coming home comes with friction: cards that fail, unfamiliar payments, banking not ready on landing.'], ['02 · Human truth', 'They left to grow. They return to belong.'], ['03 · Idea', 'Own the first impression: before travel, at the airport and across the first days back in Lagos.'], ['04 · System', 'Diaspora account by QR before travel → airport screens → street screens for the Lagos season → the Homecoming film → social, each ending in the same step.'], ['05 · Evidence', 'A strategy and creative platform for the December homecoming season.', '']],
  pzl: [['01 · Business problem', 'Make protection feel relevant while life is still being built, and give people a clear place to start.'], ['02 · Human truth', 'The future is a difficult family conversation.'], ['03 · Idea', 'Make tomorrow personal. Make planning practical: a 40-year plan gave insurance a human horizon.'], ['04 · System', 'Family conversation → creator invitation → live CEO session and podcast → Tomorrow Pledge → future-self film, billboard creative and radio → Ready Test and planning tools.'], ['05 · Evidence', 'YouTube views on the 49-second hero film, observed 8 September 2026. A public counter, not unique people.', '136,810']],
  spruce: [['01 · Business problem', 'Liking a colour is only the first decision. People still ask: will it feel like me, will it work in my space, which shade?'], ['02 · Human truth', 'People recognise an attitude before they choose a shade.'], ['03 · Idea', 'Put the personalities into conversation, then into rooms people could picture as their own. (Platform concept: 1879 Tech Hub / UACN.)'], ['04 · System', 'Teasers → hero and character films → live creator debates → a ten-clipper network → AI room inspiration on Pinterest → the Spruce website: repaint, quiz, shop with the shade.'], ['05 · Evidence', 'Clipper posts in week one against a target of 25, per the campaign report. A delivery figure, not reach.', '115']],
  cowbell: [['01 · Business problem', 'Stay relevant for the whole of Ramadan, not only in launch week.'], ['02 · Human truth', 'Before the first taste, someone cared.'], ['03 · Idea', 'What if the first taste recognised the person who made it possible?'], ['04 · System', 'Prepare → make → share → recognise: stock-up content, five-minute Sahoor ideas, regional dishes, creator recipes, share invitations, a 30-action calendar and thank-you prompts.'], ['05 · Evidence', 'Meta views across 44 Nigeria Facebook and Instagram posts, observed 8 September 2026. Counters, not unique people.', '99,999,862']]
};
// The other thirteen cases, carried over from the current site's case pages (copy lightly edited; no new claims)
const CASEFILES = {
  twisco: { seo: 'Everyday Hero, Everyday Twisco | The Republic', slug: 'twisco-everyday-hero', title: 'Everyday Hero, Everyday Twisco', line: 'Give a cocoa drink a real role in family life.', hero: 'cs-twisco-1.webp', cap: 'Twisco activation',
    facts: [['Client', 'Twisco'], ['Sector', 'Food & Drink'], ['Work', 'Strategy · Brand platform · Film · Key visuals · Retail · Activation · Social']],
    story: ['Nigerian parents quietly celebrate the small, everyday hero moments when kids hack their way out of problems with limited resources. Yet no cocoa brand was speaking to that, or actively enabling it.', 'Twisco had a strong micronutrient blend, Enerfort, but no clear emotional role. To mums, it was just one more brown drink. To kids, it wasn’t yet the exciting choice.', 'The job: give Twisco a distinct, memorable role in Nigerian family life, and make it a brand kids would actually ask for.'],
    steps: [['The insight', 'Everyday heroism: kids solving problems with what they have.'], ['The big idea', 'There’s a superhero in every home.'], ['The proposition', 'Nutritional empowerment for everyday superheroes, powered by the Enerfort vitamin-mineral blend.'], ['The role', 'Everyday Hero, Everyday Twisco: the drink behind those moments, signed off with Power your dream.'], ['The key visuals', 'Two expressions of one idea: an animated trio of young heroes with the Twisco mascot, and a real girl caught mid-thought and mid-sip.'], ['At the shelf', 'Every hero deserves Twisco: gondolas, shelf fins, wobblers, danglers and a sampling bar carry the line into the aisle, with a buy-and-win offer.'], ['Herovator City', 'An innovation challenge for students: buy Twisco to earn Hero Points, submit an innovation and compete at an exhibition. Recruitment posters, a Brain Box build kit, bus wraps, the stage, certificates and team kit all carry the hero.'], ['The system', 'One line across film, key visuals, retail, social and on-ground activation.']],
    gal: [['v:tw-film', 'The film', 1], ['cs-tw-kv-trio.webp', 'Key visual · Everyday Hero, Everyday Twisco', 1], ['cs-tw-kv-think.webp', 'Key visual'], ['cs-tw-kv-sip.webp', 'Key visual'], ['cs-twisco-2.webp', 'Activation'], ['cs-tw-gondola.webp', 'In store · gondola'], ['cs-tw-sampling.webp', 'Sampling bar'], ['cs-tw-wobbler.webp', 'Shelf wobbler'], ['cs-tw-hv-city.webp', 'Herovator City · the challenge', 1], ['cs-tw-hv-wanted.webp', 'Herovator · recruitment poster'], ['cs-tw-hv-box.webp', 'Herovator · the Brain Box kit'], ['cs-tw-hv-shirt.webp', 'Herovator · team kit'], ['cs-tw-hv-bus.webp', 'Herovator City · bus wrap', 1], ['cs-tw-hv-arch.webp', 'Herovator City · entrance arch'], ['cs-twisco-3.webp', 'Social'], ['v:tw-billboard', 'Billboard, Lagos']],
    stats: [['4.5M', 'Increase in Instagram views'], ['12.9M', 'Increase in Facebook views'], ['+585K', 'Meta reach']] },
  chivita12: { seo: 'Chivita: 12 Days of Christmas | The Republic', slug: 'chivita-12-days-of-christmas', title: '12 Days of Christmas', line: 'A festive season of live shows, challenges and hampers.', hero: 't-chivita-12-days-of-christmas.webp', cap: 'Chivita · 12 Days of Christmas',
    facts: [['Client', 'CHI Limited'], ['Brand', 'Chivita'], ['Sector', 'Food & Drink']],
    story: ['A festive campaign to boost Chivita’s engagement and awareness and to drive business during the holiday season.', 'Influencer-led Instagram Live sessions ran alongside a user-generated content challenge, deepening Chivita’s connection with its audience and putting the product in more hands.'],
    steps: [['Instagram Live Grotto Fiesta', 'Hosted by Jay On Air, with games, giveaways and lively conversation. Guest appearances from Elozonam, Eki, Emeneks, Akin Faminu and Noble Igwe widened the reach.'], ['Rewards', 'Early-bird viewers received product packs, and participants could win Christmas hampers, encouraging immediate trial.'], ['The Christmas Challenge', 'A user-generated content challenge invited the audience into the campaign.']],
    gal: [['cs-chivita12-1.webp', 'Christmas Challenge'], ['cs-chivita12-2.webp', 'Instagram Live']] },
  chivita2: { seo: 'Chivita 2.0 Campaign | The Republic', slug: 'chivita-2-campaign', title: 'What’s Your Chivita?', line: 'Turn consumers into storytellers.', hero: 't-chivita-2-campaign.webp', cap: 'Chivita 2.0',
    facts: [['Client', 'CHI Limited'], ['Brand', 'Chivita'], ['Sector', 'Food & Drink']],
    story: ['“What’s Your Chivita?” gave consumers a voice, with a network of influencers to spark, anchor and amplify their stories about Chivita.'],
    steps: [['Influencer-driven narratives', 'Dianne Russet, Elozonam and Teminikan built Chivita into their daily lives and invited followers to share their own moments with #WhatsYourChivita.'], ['User-generated content', 'Consumers shared their Chivita moments, building a broad body of stories.'], ['Momentum', 'Complementary content and social updates highlighted top stories and influencer interactions to keep the conversation going.']],
    gal: [['cs-chivita2-1.webp', '#WhatsYourChivita'], ['cs-chivita2-2.webp', 'Consumer stories']] },
  ramadan: { seo: 'Chivita & Hollandia Ramadan TVCs | The Republic', slug: 'chivita-hollandia-ramadan', title: 'Ramadan TVCs', line: 'Two commercials for a season of togetherness.', hero: 't-chivita-hollandia-ramadan.webp', cap: 'Chivita & Hollandia · Ramadan',
    facts: [['Client', 'CHI Limited'], ['Brands', 'Chivita & Hollandia'], ['Sector', 'Food & Drink']],
    story: ['For Ramadan, Chivita and Hollandia partnered with The Republic on two television commercials for Nigerian and African audiences during a spiritually significant season.', 'The films capture the essence of Ramadan, community and togetherness, and the role of Chivita and Hollandia in the season’s moments.'],
    steps: [['The theme', 'Rejuvenation and refreshment, from Iftar, the meal that breaks the fast, to Suhoor before dawn.'], ['The storytelling', 'Culturally relevant stories in familiar, traditional settings and scenarios.']],
    gal: [] },
  sips: { seo: 'Chivita Style N’ Sips | The Republic', slug: 'chivita-style-n-sips', title: 'Style N’ Sips', line: 'A YouTube series of style, humour and real talk.', hero: 't-chivita-style-n-sips.webp', cap: 'Chivita · Style N’ Sips',
    facts: [['Client', 'CHI Limited'], ['Brand', 'Chivita'], ['Format', 'YouTube series']],
    story: ['A series that celebrates the joy of Chivita’s drinks through stylish, light-hearted content, built to increase the brand’s visibility and engagement.', 'Everyday themes, local relevance and lively conversation position Chivita as a culturally attuned, fun-loving brand.'],
    steps: [['The episodes', 'Built around trending, relatable themes, from “Boys Will Be Boys” to “Classic Elegance”: a mix of style, humour and real talk.'], ['The hosts', 'Elozonam, Akin Faminu and Jay On Air, each bringing their own flair, as part of the story rather than just its reach.'], ['The rollout', 'Instagram, Facebook and YouTube, with paid promotion at peak times alongside organic growth.']],
    gal: [['cs-sips-1.webp', 'Episodes'], ['cs-sips-2.webp', 'Episodes']] },
  youmatter: { seo: 'You Matter — Prudential Zenith | The Republic', slug: 'prudential-zenith-you-matter', title: 'You Matter', line: 'A strategy campaign to make insurance feel human again.', hero: 'cs-ym-hero.webp', cap: 'Prudential Zenith Life · You Matter · the TVC',
    facts: [['Client', 'Prudential Zenith Life Insurance'], ['Sector', 'Insurance & Finance'], ['Work', 'Strategy · TVC · Out of home · Radio · Social · Search']],
    story: ['Insurance is supposed to be personal, but in Nigeria it rarely feels that way. People don’t wake up thinking about cover. They think about school fees, rent and the future they haven’t fully figured out.', 'The brief was to relaunch Prudential Zenith with a renewed identity and message, and to build awareness, reach and qualified leads. The challenge: remind people that planning ahead is an act of love, and make a financial product feel like an emotional decision.'],
    steps: [['A strategic reset, not just a campaign', 'This was about relevance, not visibility.'], ['A perspective, not a product', 'You Matter: Prudential Zenith’s promise to put its customers’ well-being first. Not a tagline, but a truth that cuts across media, culture and behaviour.'], ['The film', 'A TV commercial we took from pre-production to post: one family through the milestones they build together, from a dinner for two to a traditional wedding, a baby shower and a daughter’s birthday.'], ['Out of home', 'Supporting the life you’re building together: the family and the line on large-format billboards.'], ['Radio, social and search', 'A radio spot written and produced for national airwaves, customer testimonial content on social, and Google search and display ads that turned attention into visits and leads.']],
    gal: [['v:ym-tvc', 'The TVC', 1], ['cs-ym-ooh.webp', 'Out of home', 1], ['cs-ym-kv.webp', 'Key visual'], ['cs-ym-display.webp', 'Search and display'], ['cs-youmatter-1.webp', 'Social']],
    stats: [['2.05M', 'Search and display impressions'], ['507K', 'YouTube views'], ['370', 'Leads generated']], rnote: 'From the campaign report. Counters measure views and impressions, not unique people.' },
  sanlam: { seo: 'Sanlam Allianz: Live with Confidence | The Republic', slug: 'sanlam-allianz-live-with-confidence', title: 'Live with Confidence', line: 'Insurance, reframed around what people want.', hero: 'cs-sanlam-2.webp', cap: 'Outdoor creative',
    facts: [['Client', 'Sanlam Allianz'], ['Sector', 'Insurance & Finance'], ['Work', 'Strategy · Visual design']],
    story: ['A strategy-first communication platform that reframes insurance around what people truly want: the confidence to live, work and plan without fear.', 'Live with Confidence unifies brand storytelling and activation across touchpoints, making the promise tangible in everyday moments.'],
    steps: [['The platform', 'Confidence as the benefit, not cover as the product.'], ['Visual design', 'Outdoor, radio and brand storytelling carrying one promise.']],
    gal: [['v:sanlam-radio', 'Launch radio · Confidence is our right'], ['v:sanlam-time', 'Radio · time check'], ['cs-sanlam-1.webp', 'A new era of confidence'], ['cs-sanlam-3.webp', 'Sanlam and Allianz, together'], ['cs-sanlam-4.webp', 'Outdoor creative in Igbo'], ['cs-sanlam-5.webp', 'Launch radio']] },
  dreams: { seo: 'Prudential Zenith: We Do Dreams | The Republic', slug: 'prudential-zenith-we-do-dreams', title: 'We Do Dreams', line: 'Break through where insurance is misunderstood.', hero: 'cs-dreams-2.webp', cap: 'We Do Dreams · with Arese Ugwu',
    facts: [['Client', 'Prudential Zenith Life Insurance'], ['Sector', 'Insurance & Finance'], ['Work', 'Influencer partnership · Lead generation · Performance marketing']],
    story: ['Prudential Zenith Life Insurance needed to break through the clutter and drive meaningful engagement in a market where insurance is often misunderstood.', 'A trusted voice, content that resonates and targeted performance marketing worked as one system.'],
    steps: [['Influencer partnership', 'Arese Ugwu, a celebrated voice in financial literacy, carried the message to a broad, discerning audience.'], ['Lead generation', 'A dedicated landing page with an interactive form designed to filter and capture qualified leads.'], ['Content', 'Creatives that blended direct campaign messaging with contextual content.'], ['Performance marketing', 'Targeted Google Ads drove visibility and traffic to the landing page.']],
    gal: [['cs-dreams-1.webp', 'The landing page']] },
  pzlsocial: { seo: 'Prudential Zenith Social Media | The Republic', slug: 'prudential-zenith-social-content', title: 'Content & Social', line: 'Humour, relevance and relatability for an insurer.', hero: 't-pzl-social-content.webp', cap: 'Prudential Zenith Life · Social',
    facts: [['Client', 'Prudential Zenith Life Insurance'], ['Sector', 'Insurance & Finance'], ['Work', 'Content and social media management']],
    story: ['Content that blends humour, relevance and relatability to capture attention, reinforcing Prudential Zenith’s relevance in Nigerian and African markets.'],
    steps: [['Reels', 'Short, engaging reels built on humour, everyday office scenarios and relatable moments, using trending formats for discovery.'], ['Staff as the faces', 'Team members and real office dynamics made the brand feel approachable and trustworthy.'], ['Consistency', 'Regular posting with a platform-specific strategy.']],
    gal: [['cs-pzlsocial-1.webp', 'Reels'], ['cs-pzlsocial-2.webp', 'Reels'], ['cs-pzlsocial-3.webp', 'Reels']] },
  heirs: { seo: 'Heirs Insurance Launch Video | The Republic', slug: 'heirs-insurance-launch', title: 'Launch Video', line: 'A new insurer’s first impression.', hero: 't-heirs.webp', cap: 'Heirs Insurance · Launch video',
    facts: [['Client', 'Heirs Insurance'], ['Sector', 'Insurance & Finance'], ['Format', 'Launch film']],
    story: ['Heirs Insurance, a new entrant in the sector, partnered with The Republic on a launch video to establish a strong market presence in Nigeria.'],
    steps: [['The film', 'Communicated Heirs Insurance’s value proposition, built awareness and positioned the company as a modern, customer-centric choice.']],
    gal: [] },
  iinvest: { seo: 'i-invest: Secure the Bag TVC | The Republic', slug: 'i-invest-secure-the-bag', title: 'Secure the Bag', line: 'A TVC for young professionals building wealth.', hero: 't-i-invest.webp', cap: 'i-invest · Secure the Bag',
    facts: [['Client', 'i-invest'], ['Sector', 'Insurance & Finance'], ['Format', 'Television commercial']],
    story: ['i-invest, an investment platform in Nigeria, launched “Secure the Bag” to build visibility and trust among young professionals and middle-class investors.'],
    steps: [['The narrative', '“Securing the bag” spoke directly to the audience’s desire for financial security and growth.'], ['The look', 'Modern, sleek visuals reflected an innovative, user-friendly platform and matched the campaign’s aspirational tone.']],
    gal: [] },
  zenith35: { seo: 'Zenith Bank 35th Anniversary | The Republic', slug: 'zenith-bank-35th-anniversary', title: 'The Future of Zenith', eyebrowNote: '35th anniversary', line: 'Thirty-five years, walked through.', hero: 'cs-zenith35-1.webp', cap: 'The tunnel of time · 35th anniversary',
    facts: [['Client', 'Zenith Bank'], ['Occasion', '35th anniversary'], ['Work', 'Experiential · Film']],
    story: ['Zenith Bank’s 35th anniversary campaign celebrated the brand’s legacy while projecting its future.'],
    steps: [['A tunnel of time', 'Immersive wall branding took viewers from the bank’s inception to 35 years of excellence, with portraits and milestones along the way.'], ['The anniversary film', 'A cinematic film, styled like a television commercial, on innovation, leadership and resilience in Nigerian banking.']],
    gal: [['v:z35-film', 'The anniversary film', 1], ['v:z35-tunnel', 'Walking the tunnel of time', 1], ['cs-zenith35-2.webp', 'The founding years', 1], ['cs-zenith35-3.webp', 'Growth and global ambition', 1], ['cs-zenith35-4.webp', 'Zenith Bank today', 1], ['cs-zenith35-5.webp', 'Beyond borders', 1], ['cs-zenith35-6.webp', 'Anniversary film']] },
  torrista: { seo: 'Torrista: See for Yourself | The Republic', slug: 'torrista-see-for-yourself', title: 'See for Yourself', line: 'Travel, made accessible, affordable and authentic.', hero: 'cs-torrista-1.webp', cap: 'Outdoor creative',
    facts: [['Client', 'Sterling Bank'], ['Brand', 'Torrista'], ['Work', 'Brand development · Visual design']],
    story: ['A brand-building campaign to redefine travel for Nigerians and Africans: more accessible, affordable and authentic.', '“See for Yourself” showcased Torrista’s core values of credibility, cultural richness and seamless travel services, inviting travellers to explore first-hand.'],
    steps: [['The concept', 'See for Yourself: an invitation, not a promise.'], ['The visuals', 'Each element designed to tell a story and draw viewers in.']],
    gal: [] }
};
const isFile = r => /-case$/.test(r) && !!CASEFILES[r.replace('-case', '')];
function renderFile(id) {
  const c = byId[id], f = CASEFILES[id], n = ORDER.indexOf(id);
  const esc = x => String(x).replace(/[&<>"]/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[m]);
  $('#cf-k').textContent = `${DISTRICTS[c.d].name} · ${c.b}${f.eyebrowNote ? ' · ' + f.eyebrowNote : ''}`;
  $('#cf-h').textContent = f.title;
  $('#cf-line').textContent = f.line;
  const hero = $('.cfhero'), img = $('#cf-img');
  hero.classList.toggle('noimg', !f.hero);
  if (f.hero) { img.src = 'img/' + f.hero; img.alt = f.cap; $('#cf-cap').textContent = f.cap; }
  $('#cf-facts').innerHTML = f.facts.map(x => `<div><dt>${esc(x[0])}</dt><dd>${esc(x[1])}</dd></div>`).join('');
  $('#cf-story-b').innerHTML = f.story.map((p, i) => i === 0 ? `<p class="big" style="font-size:clamp(28px,3.2vw,48px)">${esc(p)}</p>` : `<p class="p">${esc(p)}</p>`).join('');
  $('#cf-steps').innerHTML = f.steps.map(x => `<li><span><b>${esc(x[0])}.</b> ${esc(x[1])}</span></li>`).join('');
  $('#cf-gal').innerHTML = f.gal.map(g => g[0].indexOf('v:') === 0 ? `<figure class="vid${g[2] ? ' wide' : ''}"><button type="button" class="vplay" data-film="${g[0].slice(2)}" aria-label="Play: ${esc(g[1])}"><img src="films/${g[0].slice(2)}.jpg" alt="" loading="lazy"><span class="vdur">▶ Film</span></button><figcaption>${esc(g[1])}</figcaption></figure>` : `<figure${g[2] ? ' class="wide"' : ''}><img src="img/${g[0]}" alt="${esc(f.title + ': ' + g[1])}" loading="lazy"><figcaption>${esc(g[1])}</figcaption></figure>`).join('');
  $('#cf-gal').hidden = !f.gal.length;
  const rs = $('#cf-results'); rs.hidden = !f.stats; $('#cf-tab-results').hidden = !f.stats;
  if (f.stats) { $('#cf-stats').innerHTML = f.stats.map(x => `<div class="stat"><span class="n">${esc(x[0])}</span><p>${esc(x[1])}</p></div>`).join(''); $('#cf-rnote').textContent = f.rnote || ''; $('#cf-rnote').hidden = !f.rnote; }
  $('#cf-ck').textContent = (f.stats ? '04' : '03') + ' · Credits';
  const cred = [['Client', f.facts[0][1]]];
  const brand = (c.b || '').split(' · ')[0];
  if (brand && brand !== f.facts[0][1]) cred.push(['Brand', brand]);
  cred.push(['Agency', 'The Republic']);
  $('#cf-cred').innerHTML = cred.map(x => `<div><dt>${esc(x[0])}</dt><dd>${esc(x[1])}</dd></div>`).join('');
  const nid = ORDER[n + 1];
  if (nid) {
    const nc = byId[nid], nf = CASEFILES[nid];
    $('#cf-nk').textContent = 'Next case';
    $('#cf-nt').textContent = `${nc.b.split(' · ')[0]} · ${nf ? nf.title : nc.t}`;
    $('#cf-nl').textContent = nf ? nf.line : '';
    $('#cf-nimg').src = 'img/' + (nf && nf.hero ? nf.hero : nc.img); $('#cf-nimg').alt = nc.t;
    $('#cf-ngo').textContent = 'Next case →'; $('#cf-ngo').setAttribute('href', pathOf(nid + '-case'));
  } else {
    $('#cf-nk').textContent = 'End of the portfolio';
    $('#cf-nt').textContent = 'Back to the City of Work';
    $('#cf-nl').textContent = 'Every world and case file, one click away.';
    $('#cf-nimg').src = 'img/lagos-collage.webp'; $('#cf-nimg').alt = 'Lagos';
    $('#cf-ngo').textContent = 'Back to the city →'; $('#cf-ngo').setAttribute('href', '/work');
  }
  document.title = f.seo || f.title + ' | The Republic';
}

function fillNotes(k) {
  if (!NOTES[k]) return;
  const html = n => `<div class="note"><p class="k">${n[0]}</p>${n[2] ? `<p class="n">${n[2]}</p>` : ''}<p>${n[1]}</p></div>`;
  $('#notes .l').innerHTML = NOTES[k].slice(0, 3).map(html).join('');
  $('#notes .r').innerHTML = NOTES[k].slice(3).map(html).join('');
}
fillNotes('onga');
const ORDER = ['onga', 'cowbell', 'spruce', 'pzl', 'zenith', 'twisco', 'chivita12', 'chivita2', 'ramadan', 'sips', 'youmatter', 'sanlam', 'dreams', 'pzlsocial', 'heirs', 'iinvest', 'zenith35', 'torrista'];
const COLLAGE = {
  onga: { p: [-8.2, 8.6, .6], w: 8.4, r: -.06 },
  spruce: { p: [.8, 9.4, -.6], w: 7.6, r: .05 },
  pzl: { p: [8.8, 7.6, .9], w: 7.4, r: -.035 },
  cowbell: { p: [-5.6, 3.1, 1.3], w: 8.6, r: .04 },
  zenith: { p: [4.6, 2.9, .4], w: 9.4, r: -.05 }
};
const TEAM = [
  { d: 'creative', n: 'Fredrick Aniekwe', r: 'Senior Art Director' },
  { d: 'creative', n: 'Caleb Ogiri', r: 'Art Director' },
  { d: 'creative', n: 'Nifemi Olotu', r: 'Art Director' },
  { d: 'lead', n: 'Ola Olowu', r: 'Chairman & Co-Founder' },
  { d: 'lead', n: 'Daniel Emeka', r: 'Managing Director & Co-Founder' },
  { d: 'lead', n: 'Aderoju Adeniji', r: 'Head of Operations & Client Service' },
  { d: 'client', n: 'Mmesoma Obikobe', r: 'Brand Manager' },
  { d: 'content', n: 'Wuraola Bamidele', r: 'Content Creator' },
  { d: 'content', n: 'Jemima Adedeji', r: 'Community Manager' },
  { d: 'client', n: 'Simi Lawal', r: 'Brand Management Executive' },
  { d: 'studio', n: 'Oluwadoyinsola Iyiola', r: 'Intern' },
  { d: 'studio', n: 'Flora Obigwe', r: 'Intern' }
];
const DISC = {
  lead: { name: 'Leadership', x: 0, z: 0 },
  strategy: { name: 'Strategy', x: -10.6, z: -3.2 },
  creative: { name: 'Creative', x: -5.7, z: -1.9 },
  client: { name: 'Client & Brand', x: 5.4, z: -1.9 },
  content: { name: 'Content & Community', x: 10.4, z: -3.2 },
  studio: { name: 'Studio', x: 0, z: -4.4 }
};
TEAM.forEach(p => {
  const D = DISC[p.d], mem = TEAM.filter(q => q.d === p.d), j = mem.indexOf(p);
  p.x = D.x + (j - (mem.length - 1) / 2) * 1.7; p.z = D.z;
});
const QUESTIONS = [
  { t: 'What makes you tick?', p: [-13.5, 0, 4.5] },
  { t: 'Why should you care?', p: [0, 0, -9] },
  { t: 'Who do you really trust?', p: [13.5, 0, 0] },
  { t: 'What do you say you want, and what do you actually choose?', p: [-4.5, 0, 9] },
  { t: 'What would make you stop scrolling?', p: [18, 0, -13.5] },
  { t: 'What would you tell a friend?', p: [9, 0, 9] }
];

/* ---------------- state ---------------- */
const S = {
  route: 'gate', p: 0, pS: 0, q: 0, qS: 0, lens: 0, lensS: 0,
  sel: null, hover: null, filter: 'all', list: false,
  panX: 0, phi: 1.1, drag: null, fly: null, word: '', cardT: -1,
  enterT: 0, transUntil: 0, px: 0, py: 0, pE: 0, qE: 0,
  sp: { from: 9, to: 9, paint: 1, auto: null, drag: false, picked: false }, spA: 0, spB: 1, spP: 0
};
let t = 0;

/* ---------------- small UI helpers ---------------- */
const toastEl = $('#toast');
let toastTimer = 0;
function toast(msg) {
  toastEl.textContent = msg;
  toastEl.classList.add('on');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('on'), 3600);
}
$$('[data-soon]').forEach(b => b.addEventListener('click', () => toast(b.dataset.soon + ' is storyboarded and comes in the next build.')));
$$('[data-soon-msg]').forEach(b => b.addEventListener('click', () => toast(b.dataset.soonMsg)));
$$('[data-go]').forEach(b => b.addEventListener('click', e => { e.preventDefault(); go(b.dataset.go); }));
// one footer everywhere: a closing chapter. WhatsApp stays hidden until the business number is confirmed.
// official accounts, checked 27 Sep 2026: each profile links back to therepublic.agency
const SOCIALS = [['Instagram', 'https://www.instagram.com/welcometotherepublic/'], ['LinkedIn', 'https://www.linkedin.com/company/welcometotherepublic/'], ['X', 'https://x.com/TheRepHQ'], ['TikTok', 'https://www.tiktok.com/@the.republic.hq'], ['Facebook', 'https://www.facebook.com/therepublicmarketing']];
const socialLinks = () => SOCIALS.map(([n, u]) => `<a href="${u}" target="_blank" rel="noopener">${n}<span class="sr"> (opens in a new tab)</span> <span aria-hidden="true">↗</span></a>`).join('');
const WHATSAPP = ''; // international format without +, e.g. '234XXXXXXXXXX'
const waLink = txt => WHATSAPP ? `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(txt || 'Hello, The Republic.')}` : '';
{ const ms = $('#msoc'); if (ms) ms.innerHTML = socialLinks(); }
$$('[data-foot]').forEach((el, i) => {
  const full = el.dataset.foot === 'full';
  el.outerHTML = `<footer class="sitefoot">
  <div class="sfcta">
    <p class="eyebrow">Your turn</p>
    <p class="sfbig">Let's talk.</p>
    ${full ? `<form data-turn class="sfturn"><label class="sr" for="turn-${i}">What are you trying to change?</label><input id="turn-${i}" name="change" type="text" placeholder="What are you trying to change?" autocomplete="off"><button class="send" type="submit">Start →</button></form>` : `<a class="btn primary" href="/contact">Start a conversation →</a>`}
    <p class="sfdirect"><a href="mailto:office@therepublic.agency">office@therepublic.agency</a><a href="/the-republic-credentials-2026.pdf" download>Our credentials <span class="sz">(PDF)</span> ↓</a>${WHATSAPP ? `<a href="${waLink()}" target="_blank" rel="noopener">WhatsApp</a>` : ''}</p>
  </div>
  <div class="sfgrid">
    <nav class="sfcol" aria-label="Footer"><p class="k">Explore</p><a href="/work">Work</a><a href="/services">Services</a><a href="/studio">Studio</a><a href="/method">Method</a><a href="/journal">Journal</a><a href="/contact" data-careers>Careers</a><a href="/contact">Contact</a></nav>
    <div class="sfcol"><p class="k">Visit</p><p>10 Onisiwo Road<br>Ikoyi, Lagos, Nigeria</p><p class="sfclock">Lagos --:--</p></div>
    <nav class="sfcol sfsoc" aria-label="The Republic on social media"><p class="k">Follow</p>${socialLinks()}</nav>
    <div class="sfcol sfnews"><p class="k">The Dispatch</p><p>New work and thinking from the studio, now and then.</p><form class="sfsub" novalidate><label class="sr" for="sub-${i}">Your email</label><input id="sub-${i}" type="email" placeholder="Your email" autocomplete="email"><button type="submit">Subscribe</button><p class="msg" role="status" hidden></p></form></div>
  </div>
  <div class="sfbase"><img src="img/logo.png" alt="The Republic" width="56" height="41" loading="lazy"><p>© 2026 The Republic Studios Ltd · RC 7371417 · <a href="/privacy">Privacy notice</a></p><p>Creating Tomorrow.</p></div>
</footer>`;
});
setInterval(() => $$('.sfclock').forEach(c => { c.textContent = clockEl ? clockEl.textContent : 'Lagos'; }), 20000);
$$('.sfsub').forEach(f => f.addEventListener('submit', e => {
  e.preventDefault();
  const i = $('input', f), m = $('.msg', f), ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(i.value.trim());
  m.hidden = false;
  m.textContent = ok ? 'Your email app is opening. Press send to join The Dispatch.' : 'Please enter a valid email address.';
  i.setAttribute('aria-invalid', String(!ok));
  if (ok) location.href = `mailto:office@therepublic.agency?subject=${encodeURIComponent('Subscribe to The Dispatch')}&body=${encodeURIComponent('Please add ' + i.value.trim() + ' to The Dispatch.')}`;
}));
// "Your turn" anywhere carries the line into the contact form
$$('form[data-turn]').forEach(f => f.addEventListener('submit', e => {
  e.preventDefault();
  const v = ($('input', f).value || '').trim();
  S.turnText = v;
  if (typeof wipeRoute === 'function' && S.route !== 'contact') wipeRoute('contact', innerWidth / 2, innerHeight / 2); else go('contact');
}));
// contact drawer
const drawer = $('#drawer'), veil = $('#veil');
let lastFocus = null;
function openDrawer() { lastFocus = document.activeElement; drawer.hidden = false; veil.hidden = false; $('#d-name').focus(); }
function closeDrawer() { drawer.hidden = true; veil.hidden = true; if (lastFocus) lastFocus.focus(); }
$$('[data-contact]').forEach(b => b.addEventListener('click', openDrawer));
$('#drawer-x').addEventListener('click', closeDrawer);
veil.addEventListener('click', closeDrawer);
$('#drawer-form').addEventListener('submit', e => {
  e.preventDefault();
  const m = $('.msg', e.target);
  const v = id => ($('#' + id).value || '').trim(), em = v('d-email');
  m.hidden = false;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(em) || !v('d-msg')) { m.textContent = 'Please add your email and a short message.'; return; }
  const body = `${v('d-msg')}\n\n${v('d-name')}${v('d-co') ? ', ' + v('d-co') : ''}\n${em}`;
  location.href = `mailto:office@therepublic.agency?subject=${encodeURIComponent('Enquiry from ' + (v('d-name') || em))}&body=${encodeURIComponent(body)}`;
  m.textContent = 'Your email app is opening with your message. Press send and it comes straight to the studio.';
});
// Lagos clock
const clockEl = $('#clock');
function tick() {
  try { clockEl.textContent = 'Lagos ' + new Intl.DateTimeFormat('en-GB', { timeZone: 'Africa/Lagos', hour: '2-digit', minute: '2-digit' }).format(new Date()); } catch (e) { clockEl.textContent = 'Lagos'; }
  const mc = $('#mclock'); if (mc) mc.textContent = clockEl.textContent;
  document.querySelectorAll('.sfclock').forEach(c => { c.textContent = clockEl.textContent; });
}
tick(); setInterval(tick, 20000);

/* ---------------- routing ---------------- */
// the service pages (keys and addresses come from scripts/services.py; the build checks this list matches)
const SVC_PAGES = ['svc-strategy', 'svc-brand', 'svc-content', 'svc-integrated', 'svc-digital', 'svc-experiences'];
const isSvc = r => r === 'services' || SVC_PAGES.includes(r);
const ROUTES = ['gate', 'work', 'onga', 'onga-case', 'cowbell', 'cowbell-case', 'spruce', 'spruce-case', 'pzl', 'pzl-case', 'zenith', 'zenith-case', 'studio', 'services'].concat(SVC_PAGES, ['method', 'journal', 'contact', 'privacy', 'lost'], Object.keys(CASEFILES).map(k => k + '-case'));
const PLACE = { gate: 'The Gate · Home', work: 'The City of Work · /work', onga: 'Onga world · Taste of Home', 'onga-case': 'Case · /onga-taste-of-home', cowbell: 'Cowbell world · Your First Taste', 'cowbell-case': 'Case · /cowbell-ramadan-your-first-taste', spruce: 'Spruce world · Show Your True Colours', 'spruce-case': 'Case · /spruce-dulux-digital-launch', pzl: 'Prudential Zenith world · Empowering Tomorrow', 'pzl-case': 'Case · /prudential-zenith-empowering-tomorrow', zenith: 'Zenith world · See Homecoming Differently', 'zenith-case': 'Case · /zenith-bank-homecoming', studio: 'The Capitol · /studio', services: 'What we do · /services', 'svc-strategy': 'Services · Communication Strategy', 'svc-brand': 'Services · Brand & Creative', 'svc-content': 'Services · Content & Social', 'svc-integrated': 'Services · Integrated Marketing', 'svc-digital': 'Services · Digital & Performance', 'svc-experiences': 'Services · Experiences', method: 'The Constitution · /method', journal: 'The Dispatch · /journal', contact: 'Your Turn · /contact', privacy: 'Your Rights · /privacy', lost: 'Unbuilt street · 404' };
Object.keys(CASEFILES).forEach(k => { PLACE[k + '-case'] = 'Case · /' + CASEFILES[k].slug; });
const TITLES = {
  gate: 'Creative & Marketing Agency in Lagos | The Republic', work: 'Portfolio: Campaigns & Creative Work | The Republic',
  studio: 'About Our Lagos Creative Agency | The Republic', contact: 'Contact The Republic | Marketing Agency in Lagos',
  method: 'How We Work: Strategy First | The Republic', journal: 'Journal: Articles, Case Films and News | The Republic', privacy: 'Privacy Notice | The Republic', lost: 'Page not found | The Republic',
  onga: 'Onga Taste of Home: Digital Campaign Case Study | The Republic', cowbell: 'Cowbell Ramadan Social Media Campaign | The Republic',
  spruce: 'Spruce by Dulux: Digital Campaign Case Study | The Republic', pzl: 'Prudential Zenith: Empowering Tomorrow | The Republic',
  zenith: 'Zenith Bank Homecoming Campaign | The Republic'
};
['onga', 'cowbell', 'spruce', 'pzl', 'zenith'].forEach(k => { TITLES[k + '-case'] = TITLES[k]; });
// the current site's addresses still land in the right place; people have their own links
const ALIAS = { portfolio: 'work', 'onga-taste-of-home': 'onga-case', 'cowbell-ramadan-your-first-taste': 'cowbell-case', 'spruce-dulux-digital-launch': 'spruce-case',
  'prudential-zenith-empowering-tomorrow': 'pzl-case', 'zenith-bank-homecoming': 'zenith-case' };
Object.keys(CASEFILES).forEach(k => { ALIAS[CASEFILES[k].slug] = k + '-case'; });
// every page has a real address (written into each page by scripts/build.py); older #links still work and move to the clean address
const PATHS = (window.SEO && SEO.paths) || {};
const ROUTE_OF = {}; Object.keys(PATHS).forEach(r => { if (PATHS[r]) ROUTE_OF[PATHS[r]] = r; });
const pathOf = r => PATHS[r] || '/';
function routeFromPath(p) {
  p = (p || '/').replace(/[?#].*$/, '').replace(/\.html$/, '').replace(/\/index$/, '').replace(/\/+$/, '') || '/';
  if (p.indexOf('/studio/') === 0) return { r: 'studio', person: decodeURIComponent(p.slice(8)) };
  if (ROUTE_OF[p]) return { r: ROUTE_OF[p] };
  const seg = decodeURIComponent(p.slice(1));
  if (ALIAS[seg]) return { r: ALIAS[seg] };
  if (ROUTES.includes(seg) && seg !== 'lost') return { r: seg };
  return p === '/' ? { r: 'gate' } : null;
}
function parseRoute() {
  const h = decodeURIComponent((location.hash || '').replace('#', '')).replace(/^\//, '');
  if (h && h !== 'main') {
    const person = h.indexOf('studio/') === 0 ? h.slice(7) : null;
    const r = person ? 'studio' : ALIAS[h] || (ROUTES.includes(h) ? h : null);
    if (r) {
      if (person) S.personSlug = person;
      try { history.replaceState(null, '', (r === 'lost' ? location.pathname : pathOf(r)) + (person ? '/' + person : '')); } catch (e) {}
      return r;
    }
  }
  const m = routeFromPath(location.pathname);
  if (!m) return 'lost';
  if (m.person) S.personSlug = m.person;
  return m.r;
}
function go(r) {
  const p = pathOf(r);
  if (r !== 'lost' && (location.pathname !== p || location.hash)) { try { history.pushState(null, '', p); } catch (e) {} }
  applyRoute(r);
}
window.addEventListener('popstate', () => applyRoute(parseRoute()));
window.addEventListener('hashchange', () => { if (location.hash !== '#main') applyRoute(parseRoute()); });
// exactly one h1 per page: the visible page's heading is the h1, the rest are h2
function setH1(r) {
  const key = isFile(r) ? 'file' : r;
  $$('[data-ph]').forEach(el => {
    const host = el.closest('[data-for]'), want = host && host.dataset.for === key ? 'H1' : 'H2';
    if (el.tagName === want) return;
    const n = document.createElement(want);
    for (const at of el.attributes) n.setAttribute(at.name, at.value);
    while (el.firstChild) n.appendChild(el.firstChild);
    el.replaceWith(n);
  });
}
const spacer = $('#spacer');
const BEATS = { gate: 6, onga: 3, cowbell: 4, spruce: 5, pzl: 5, zenith: 5 };
function spacerSpan() { return window.innerHeight * 1.15; }
function setSpacer() {
  const n = BEATS[S.route];
  spacer.style.height = n ? (window.innerHeight + n * spacerSpan()) + 'px' : '0px';
}
function beatY(i) { return i * spacerSpan(); }
$$('[data-next]').forEach(b => b.addEventListener('click', () => window.scrollTo({ top: beatY(+b.dataset.next) + 2, behavior: RM ? 'auto' : 'smooth' })));

/* ---------------- WebGL ---------------- */
let GL = !!window.THREE;
let renderer = null;
const canvas = $('#gl');
if (GL) {
  try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' }); }
  catch (e) { GL = false; }
}
if (!GL) document.documentElement.classList.add('nogl');
if (!GL) setTimeout(() => { const b = document.getElementById('boot'); if (b) b.remove(); }, 300);

const PHONE = Math.min(window.innerWidth, window.innerHeight) < 600;
// quality: 0 low, 1 mid, 2 high. Weak phones, low memory or data saver get fewer particles and fewer pixels.
const TIER = (() => {
  const q = new URLSearchParams(location.search).get('q'); if (q === 'low') return 0; if (q === 'mid') return 1; if (q === 'high') return 2;
  try {
    const nav = navigator, mem = nav.deviceMemory || 8, cores = nav.hardwareConcurrency || 8, save = !!(nav.connection && nav.connection.saveData);
    let gpu = '';
    if (GL) { const g = renderer.getContext(), ext = g.getExtension('WEBGL_debug_renderer_info'); if (ext) gpu = String(g.getParameter(ext.UNMASKED_RENDERER_WEBGL)); }
    const weak = /Mali-[4T]\d{2}|Mali-G(31|51|52|57|68)|Adreno \(TM\) [3-5]\d{2}|Adreno \(TM\) 6[01]\d|PowerVR|SGX/i.test(gpu);
    if (save || mem <= 2 || (PHONE && (cores <= 4 || weak))) return 0;
    if (mem <= 4 || weak) return 1;
    return 2;
  } catch (e) { return 1; }
})();
document.documentElement.dataset.tier = TIER;
let DPR = Math.min(window.devicePixelRatio || 1, TIER === 0 ? 1.25 : TIER === 1 ? 1.5 : PHONE ? 2 : 1.75);
let scene, camera, W = window.innerWidth, H = window.innerHeight;
const U = {}; // shared uniforms
let particles, pMat, grid, gridMat, gateGroup, cityGroup, ongaGroup, hq, hqRing;
const B = []; // buildings
const pickables = [];
const tapes = [];
const ongaLayers = [];
let answer, answerTex, spice, spiceMat, capGroup, mural, beam, updateVox, spark, bgCol, bgTex, cbGroup, spGroup, pzGroup, zbGroup;
const COL = {};

if (GL) {
  renderer.setPixelRatio(DPR);
  renderer.setSize(W, H, false);
  scene = new THREE.Scene();
  COL.ink = new THREE.Color('#0A0A0A'); COL.onga = new THREE.Color('#0F3A27'); COL.lens = new THREE.Color('#05051A');
  COL.blue = new THREE.Color('#1F1FFF'); COL.paper = new THREE.Color('#F4F2EE'); COL.grey = new THREE.Color('#8A8A93'); COL.yellow = new THREE.Color('#F4D31F');
  bgCol = COL.onga.clone();
  const bgc = document.createElement('canvas'); bgc.width = 4; bgc.height = 512;
  const bgx = bgc.getContext('2d'), bgg = bgx.createLinearGradient(0, 0, 0, 512);
  bgg.addColorStop(0, '#050507'); bgg.addColorStop(.46, '#0A0A1A'); bgg.addColorStop(.62, '#0C0C22'); bgg.addColorStop(1, '#070708');
  bgx.fillStyle = bgg; bgx.fillRect(0, 0, 4, 512);
  bgTex = new THREE.CanvasTexture(bgc);
  scene.background = bgTex;
  camera = new THREE.PerspectiveCamera(45, W / H, .1, 500);
  camera.position.set(0, 7, 30);
  U.uTime = { value: 0 };
  U.uLens = { value: 0 };
  U.uBlue = { value: COL.blue };
  U.uPaper = { value: COL.paper };
  U.uInk = { value: COL.lens };
  U.uScale = { value: H / (2 * Math.tan(THREE.MathUtils.degToRad(22.5))) };
  U.uPR = { value: DPR };

  gateGroup = new THREE.Group(); cityGroup = new THREE.Group(); ongaGroup = new THREE.Group();
  scene.add(gateGroup, cityGroup, ongaGroup);
  ongaGroup.visible = false;

  const loader = new THREE.TextureLoader();
  const texCache = {};
  const maxAniso = Math.min(4, renderer.capabilities.getMaxAnisotropy());
  // world images wait until someone heads for that world (or, on a fast connection, until the home page has settled)
  const LAZY = /^(sp-|zb-|pz-|cb-|onga|t-)/, pendTex = [], imgLoader = new THREE.ImageLoader();
  S.texOpen = {};
  const texGroup = n => /^t-/.test(n) ? 'city' : /^sp-/.test(n) ? 'spruce' : /^zb-/.test(n) ? 'zenith' : /^pz-/.test(n) ? 'pzl' : /^cb-/.test(n) ? 'cowbell' : 'onga';
  S.releaseTex = grp => {
    if (S.texOpen[grp]) return; S.texOpen[grp] = true;
    pendTex.filter(p => p.g === grp && !p.done).forEach(p => { p.done = true; imgLoader.load('img/' + p.name, im => { p.tx.image = im; p.tx.needsUpdate = true; if (p.onload) p.onload(p.tx); p.cbs.forEach(cb => cb(p.tx)); }); });
  };
  const tex = (name, onload) => {
    if (texCache[name]) {
      const c = texCache[name];
      if (onload) { if (c.image && c.image.width) onload(c); else if (c._pend) c._pend.cbs.push(onload); }
      return c;
    }
    if (LAZY.test(name)) {
      const tx = new THREE.Texture(); tx.anisotropy = maxAniso; texCache[name] = tx;
      const pnd = { name, tx, onload, cbs: [], g: texGroup(name), done: false }; tx._pend = pnd; pendTex.push(pnd);
      if (S.texOpen[pnd.g]) { S.texOpen[pnd.g] = false; S.releaseTex(pnd.g); }
      return tx;
    }
    const tx = loader.load('img/' + name, onload);
    tx.anisotropy = maxAniso;
    texCache[name] = tx;
    return tx;
  };

  /* ---------- torn paper material ---------- */
  const tornVS = `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`;
  const tornFS = `
    uniform sampler2D map; uniform float uHasMap, uOpacity, uLens, uSeed, uDim, uTear, uHover, uTornAmt, uDots, uDotN, uArch, uGlow, uBright;
    uniform vec2 uUvScale, uUvOff; uniform vec3 uGold;
    uniform vec2 uSize; uniform vec3 uBg, uBlue, uInk, uPaper;
    varying vec2 vUv;
    float h1(float n){ return fract(sin(n)*43758.5453123); }
    float n1(float x){ float i=floor(x); float f=fract(x); return mix(h1(i), h1(i+1.0), f*f*(3.0-2.0*f)); }
    float by2(vec2 a){ a=floor(a); return fract(a.x/2.0 + a.y*a.y*0.75); }
    float by4(vec2 a){ return by2(0.5*a)*0.25 + by2(a); }
    vec3 lensMix(vec3 c){
      float l = dot(c, vec3(0.299,0.587,0.114));
      l = clamp((l-0.5)*1.7+0.52, 0.0, 1.0);
      float th = by4(gl_FragCoord.xy/3.0);
      vec3 lc = mix(uInk, uBlue, step(th, l));
      lc = mix(lc, uPaper, step(0.9, l)*step(th, l)*0.7);
      return mix(c, lc, uLens);
    }
    void main(){
      vec2 tuv = uUvOff + (vUv - 0.5) * uUvScale + 0.5;
      if (uArch > 0.5) {
        // a pointed arch window with a glowing gold frame (the campaign's own motif)
        float m = 0.07 * uSize.x;
        vec2 q = vUv * uSize - vec2(m);
        float w = uSize.x - 2.0*m, hh = uSize.y - 2.0*m;
        float Rr = 0.62 * w;
        float rise = sqrt(Rr*Rr - (Rr - 0.5*w)*(Rr - 0.5*w));
        float ys = hh - rise;
        float ed = min(min(q.x, w - q.x), q.y);
        if (q.y > ys) ed = min(ed, min(Rr - distance(q, vec2(w - Rr, ys)), Rr - distance(q, vec2(Rr, ys))));
        if (ed < 0.0) {
          if (ed < -m) discard;
          float h = 1.0 + ed / m;
          gl_FragColor = vec4(mix(uGold, uBlue, uLens) * 1.25, h * h * (0.3 + 0.45 * uGlow) * uOpacity);
          return;
        }
        vec3 c = texture2D(map, tuv).rgb * uBright;
        c = lensMix(c);
        c = mix(c, uBg, uDim*(1.0-uLens));
        float fr = 1.0 - smoothstep(0.0, 0.045 * w + 0.02 * uGlow, ed);
        c = mix(c, mix(uGold, uBlue, uLens) * (1.1 + 0.6 * uGlow), fr);
        gl_FragColor = vec4(c, uOpacity);
        return;
      }
      vec2 p = vUv * uSize / uTear;
      vec2 sz = uSize / uTear;
      float dl = p.x, dr = sz.x - p.x, db = p.y, dt = sz.y - p.y;
      float tl = uTornAmt*(0.05 + 0.10*n1(p.y*5.0+uSeed) + 0.05*n1(p.y*21.0+uSeed*2.3));
      float tr = uTornAmt*(0.05 + 0.10*n1(p.y*5.0+uSeed+11.0) + 0.05*n1(p.y*21.0+uSeed*3.1));
      float tb = uTornAmt*(0.05 + 0.10*n1(p.x*5.0+uSeed+23.0) + 0.05*n1(p.x*21.0+uSeed*5.7));
      float tt = uTornAmt*(0.05 + 0.10*n1(p.x*5.0+uSeed+37.0) + 0.05*n1(p.x*21.0+uSeed*7.9));
      float e = min(min(dl-tl, dr-tr), min(db-tb, dt-tt));
      if (e < 0.0) discard;
      vec3 c = uHasMap > 0.5 ? texture2D(map, tuv).rgb : uPaper;
      float rim = uTornAmt*(0.05 + 0.06*n1((p.x+p.y)*7.0+uSeed));
      c = mix(uPaper*0.95, c, step(rim, e));
      if (uDots > 0.001) {
        vec2 gd = vec2(uDotN, floor(uDotN * uSize.y / uSize.x + 0.5));
        vec2 g = vUv * gd;
        vec2 cc = (floor(g) + 0.5) / gd;
        vec2 f = fract(g) - 0.5;
        vec3 sc = uHasMap > 0.5 ? texture2D(map, cc).rgb : uPaper;
        float lum = dot(sc, vec3(0.299,0.587,0.114));
        float rad = mix(0.2, 0.47, pow(lum, 0.7)) + uHover*0.05;
        float dm = 1.0 - smoothstep(rad - 0.07, rad + 0.02, length(f));
        vec3 led = sc * (1.12 + uHover*0.25) * dm + vec3(0.012, 0.012, 0.035);
        c = mix(c, led, uDots);
      }
      c += uHover*0.05*(1.0 - uDots);
      float l = dot(c, vec3(0.299,0.587,0.114));
      l = clamp((l-0.5)*1.7+0.52, 0.0, 1.0);
      float th = by4(gl_FragCoord.xy/3.0);
      vec3 lc = mix(uInk, uBlue, step(th, l));
      lc = mix(lc, uPaper, step(0.9, l)*step(th, l)*0.7);
      c = mix(c, lc, uLens);
      c = mix(c, uBg, uDim*(1.0-uLens));
      gl_FragColor = vec4(c, uOpacity);
    }`;
  function tornMat(opts) {
    return new THREE.ShaderMaterial({
      uniforms: {
        map: { value: opts.map || null }, uHasMap: { value: opts.map ? 1 : 0 }, uOpacity: { value: opts.opacity == null ? 1 : opts.opacity },
        uLens: opts.lens ? U.uLens : { value: 0 }, uSeed: { value: opts.seed || 1 }, uDim: { value: opts.dim || 0 }, uTear: { value: opts.tear || 1 },
        uHover: { value: 0 }, uTornAmt: { value: opts.torn == null ? 1 : opts.torn }, uDots: { value: 0 }, uDotN: { value: 40 }, uSize: { value: new THREE.Vector2(1, 1) },
        uArch: { value: opts.arch ? 1 : 0 }, uGlow: { value: 0 }, uBright: { value: 1 }, uUvScale: { value: new THREE.Vector2(1, 1) }, uUvOff: { value: new THREE.Vector2(0, 0) }, uGold: { value: new THREE.Color('#F5C45A') }, uBg: { value: opts.bg || COL.ink }, uBlue: U.uBlue, uInk: U.uInk, uPaper: U.uPaper
      },
      vertexShader: tornVS, fragmentShader: tornFS, transparent: true, side: THREE.DoubleSide
    });
  }
  const planeGeo = new THREE.PlaneGeometry(1, 1);

  /* ---------- ground grid ---------- */
  gridMat = new THREE.ShaderMaterial({
    uniforms: { uA: { value: 0 }, uG: { value: G }, uCol: U.uBlue, uC: { value: new THREE.Vector3() } },
    vertexShader: `varying vec3 vW; void main(){ vec4 w = modelMatrix*vec4(position,1.0); vW = w.xyz; gl_Position = projectionMatrix*viewMatrix*w; }`,
    fragmentShader: `
      uniform float uA, uG; uniform vec3 uCol; uniform vec3 uC; varying vec3 vW;
      float gl(vec2 c){ vec2 g = abs(fract(c-0.5)-0.5)/fwidth(c); return 1.0 - min(min(g.x,g.y),1.0); }
      void main(){
        float a = gl(vW.xz/uG)*0.6 + gl(vW.xz/(uG/3.0))*0.13;
        float d = length(vW.xz - uC.xz);
        a *= 1.0 - smoothstep(26.0, 105.0, d);
        gl_FragColor = vec4(uCol, a*uA);
      }`,
    transparent: true, depthWrite: false, extensions: { derivatives: true }
  });
  grid = new THREE.Mesh(new THREE.PlaneGeometry(260, 260), gridMat);
  grid.rotation.x = -Math.PI / 2;
  grid.renderOrder = -2;
  cityGroup.add(grid);

  // 10 Onisiwo Road marker
  hq = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 1.1), new THREE.MeshBasicMaterial({ color: COL.blue, transparent: true }));
  hq.rotation.x = -Math.PI / 2; hq.position.set(G / 2, .03, G / 2);
  hqRing = new THREE.Mesh(new THREE.RingGeometry(.9, 1.05, 4, 1), new THREE.MeshBasicMaterial({ color: COL.blue, transparent: true, side: THREE.DoubleSide }));
  hqRing.rotation.x = -Math.PI / 2; hqRing.rotation.z = Math.PI / 4; hqRing.position.copy(hq.position);
  cityGroup.add(hq, hqRing);

  // Point-cloud hands after Michelangelo's Creation of Adam (public domain composition).
  // Returns positions, per-point shade (0..1), side (-1 Adam / +1 the reaching hand), and the two fingertips.
  function buildHands(N, opts) {
    opts = opts || {};
    const S3 = opts.scale || 3.4, GAP = opts.gap || 0.9, CY = opts.cy || 7, TILT = opts.tilt == null ? .49 : opts.tilt;
    let seed = opts.seed || 777;
    const rnd = () => { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; };
    const v = (x, y, z) => [x, y, z];
    const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
    const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
    const mul = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
    const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
    const len = a => Math.sqrt(dot(a, a));
    const nrm = a => { const l = len(a) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
    const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
    const rotZ = (p, c, ang) => { const s = Math.sin(ang), co = Math.cos(ang), x = p[0] - c[0], y = p[1] - c[1]; return [c[0] + x * co - y * s, c[1] + x * s + y * co, p[2]]; };
    const rotX = (p, ang) => { const s = Math.sin(ang), c = Math.cos(ang); return [p[0], p[1] * c - p[2] * s, p[1] * s + p[2] * c]; };
    const rotY = (p, ang) => { const s = Math.sin(ang), c = Math.cos(ang); return [p[0] * c + p[2] * s, p[1], -p[0] * s + p[2] * c]; };
    const D = (pitch, yaw) => [Math.cos(pitch) * Math.cos(yaw), -Math.sin(pitch), Math.cos(pitch) * Math.sin(yaw)];

    // primitives in local hand space (fingers +x, back of hand +y, thumb +z)
    function handPrims(pose) {
      const P = [];
      // palm body and knuckle ridge
      P.push({ t: 'ell', c: v(0, 0, 0), r: v(.52, .15, .43), w: 1 });
      P.push({ t: 'cap', a: v(.47, .03, .3), b: v(.41, .01, -.3), ra: .115, rb: .1, w: 1 });
      P.push({ t: 'ell', c: v(-.12, -.05, .31), r: v(.3, .13, .16), w: 1 }); // thenar
      P.push({ t: 'cap', a: v(-.35, 0, 0), b: v(-.72, 0, 0), ra: .27, rb: .25, flat: .78, w: 1 }); // wrist
      const fingers = [
        { k: v(.5, .03, .3), yaw: .12, L: [.43, .27, .21], r: [.088, .08, .072, .064] },
        { k: v(.53, .03, .1), yaw: .02, L: [.47, .3, .22], r: [.092, .084, .075, .066] },
        { k: v(.5, .02, -.1), yaw: -.08, L: [.44, .28, .21], r: [.086, .078, .07, .062] },
        { k: v(.43, 0, -.29), yaw: -.2, L: [.34, .22, .18], r: [.076, .068, .062, .055] }
      ];
      let tip = null;
      fingers.forEach((f, i) => {
        const curl = pose.curl[i];
        let p = f.k, pitch = curl[0] * .55, yaw = f.yaw + (pose.spread ? pose.spread[i] : 0);
        for (let j = 0; j < 3; j++) {
          pitch += j === 0 ? curl[0] * .45 : curl[j];
          const q = add(p, mul(D(pitch, yaw), f.L[j]));
          P.push({ t: 'cap', a: p, b: q, ra: f.r[j], rb: f.r[j + 1], w: 1 });
          p = q;
        }
        if (i === 0) tip = add(p, mul(D(pitch, yaw), f.r[3] * .9));
      });
      // thumb
      let p = v(-.18, -.06, .38), pitch = pose.thumb[0], yaw = pose.thumb[1];
      const TL = [.34, .27, .21], TR = [.12, .1, .088, .075];
      for (let j = 0; j < 3; j++) {
        const q = add(p, mul(D(pitch, yaw), TL[j]));
        P.push({ t: 'cap', a: p, b: q, ra: TR[j], rb: TR[j + 1], w: 1 });
        p = q; pitch += pose.thumb[2]; yaw += pose.thumb[3];
      }
      return { P, tip };
    }

    function sampleSurface(pr) {
      if (pr.t === 'ell') {
        let d; do { d = [rnd() * 2 - 1, rnd() * 2 - 1, rnd() * 2 - 1]; } while (dot(d, d) > 1 || dot(d, d) < .01);
        d = nrm(d);
        const p = add(pr.c, [d[0] * pr.r[0], d[1] * pr.r[1], d[2] * pr.r[2]]);
        const n = nrm([d[0] / pr.r[0], d[1] / pr.r[1], d[2] / pr.r[2]]);
        return [p, n, 0];
      }
      const ax = sub(pr.b, pr.a), L = len(ax), u = nrm(ax);
      let up = Math.abs(u[1]) < .9 ? [0, 1, 0] : [1, 0, 0];
      const s1 = nrm(cross(u, up)), s2 = cross(s1, u);
      const fy = pr.flat || 1;
      const capA = 2 * Math.PI * pr.ra * pr.ra, capB = 2 * Math.PI * pr.rb * pr.rb, side = Math.PI * (pr.ra + pr.rb) * L;
      const r0 = rnd() * (capA + capB + side);
      if (r0 < side) {
        const tt = rnd(), th = rnd() * Math.PI * 2, rr = pr.ra + (pr.rb - pr.ra) * tt;
        const off = add(mul(s2, Math.cos(th) * rr * fy), mul(s1, Math.sin(th) * rr));
        const n = nrm(add(mul(s2, Math.cos(th) / fy), mul(s1, Math.sin(th))));
        return [add(add(pr.a, mul(ax, tt)), off), n, tt];
      }
      const atB = r0 >= side + capA;
      let d; do { d = [rnd() * 2 - 1, rnd() * 2 - 1, rnd() * 2 - 1]; } while (dot(d, d) > 1 || dot(d, d) < .01);
      d = nrm(d);
      if (dot(d, u) * (atB ? 1 : -1) < 0) d = mul(d, -1);
      const rr = atB ? pr.rb : pr.ra;
      return [add(atB ? pr.b : pr.a, mul(d, rr)), d, atB ? 1 : 0];
    }
    function area(pr) {
      if (pr.t === 'ell') { const [a, b, c] = pr.r; return 4 * Math.PI * Math.pow((Math.pow(a * b, 1.6) + Math.pow(a * c, 1.6) + Math.pow(b * c, 1.6)) / 3, 1 / 1.6); }
      const L = len(sub(pr.b, pr.a));
      return Math.PI * (pr.ra + pr.rb) * L + 2 * Math.PI * (pr.ra * pr.ra + pr.rb * pr.rb);
    }

    // the two poses
    const adamPose = { curl: [[-.04, .04, .08], [.34, .5, .34], [.95, 1.05, .6], [1.05, 1.05, .6]], spread: [.02, -.02, -.04, -.08], thumb: [.6, .5, .12, -.2] };
    const godPose = { curl: [[-.02, .04, .05], [.7, .85, .5], [.85, .95, .5], [.95, .95, .5]], spread: [0, -.02, -.05, -.1], thumb: [.55, .45, .15, -.25] };
    const L = { side: -1, pose: adamPose, wristBend: .02, roll: .42, fore: nrm([-1, -.2, -.12]), foreLen: 3.2, ry: [.25, .31], rz: [.32, .4] };
    const R = { side: 1, pose: godPose, wristBend: -.1, roll: .42, fore: nrm([1, .2, -.12]), foreLen: 3.2, ry: [.25, .3], rz: [.31, .38] };

    const out = { pos: new Float32Array(N * 3), shade: new Float32Array(N), side: new Float32Array(N), crack: new Float32Array(N), tipL: null, tipR: null };
    const HIT = [0, CY, 0];
    const tilt = p => { const c = Math.cos(TILT), s = Math.sin(TILT), x = p[0] - HIT[0], y = p[1] - HIT[1]; return [HIT[0] + x * c - y * s, HIT[1] + x * s + y * c, p[2]]; };
    const tiltN = n => { const c = Math.cos(TILT), s = Math.sin(TILT); return [n[0] * c - n[1] * s, n[0] * s + n[1] * c, n[2]]; };
    // cellular fissures, in hand space
    const h3 = (x, y, z) => { const a = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453, b = Math.sin(x * 269.5 + y * 183.3 + z * 246.1) * 43758.5453, c = Math.sin(x * 113.5 + y * 271.9 + z * 124.6) * 43758.5453; return [a - Math.floor(a), b - Math.floor(b), c - Math.floor(c)]; };
    const vor = (x, y, z) => { const px = Math.floor(x), py = Math.floor(y), pz = Math.floor(z); let d1 = 9, d2 = 9; for (let k = -1; k <= 1; k++) for (let j = -1; j <= 1; j++) for (let i = -1; i <= 1; i++) { const h = h3(px + i, py + j, pz + k); const dx = px + i + h[0] - x, dy = py + j + h[1] - y, dz = pz + k + h[2] - z; const d = dx * dx + dy * dy + dz * dz; if (d < d1) { d2 = d1; d1 = d; } else if (d < d2) d2 = d; } return Math.sqrt(d2) - Math.sqrt(d1); };
    const Ldir = nrm([-.35, .8, .55]);
    const handsData = [L, R].map(H => {
      const { P, tip } = handPrims(H.pose);
      const toWorld = (p, isNormal) => {
        let q = p;
        if (!isNormal) q = rotZ(q, [-.62, 0, 0], H.wristBend); else q = rotZ(q, [0, 0, 0], H.wristBend);
        if (H.side > 0) q = [-q[0], q[1], q[2]];
        q = rotX(q, H.roll);
        return isNormal ? q : mul(q, S3);
      };
      const wrist = toWorld(v(-.7, 0, 0));
      const fore = { t: 'fore', a: wrist, dir: H.fore, L: H.foreLen * S3, ry: H.ry.map(x => x * S3), rz: H.rz.map(x => x * S3) };
      return { H, P, tip: toWorld(tip), toWorld, fore };
    });
    // align fingertips: Adam at -GAP/2, God at +GAP/2 (God slightly higher)
    const tL = handsData[0].tip, tR = handsData[1].tip;
    const offL = sub(v(-GAP / 2, CY - .12, 0), tL), offR = sub(v(GAP / 2, CY + .12, 0), tR);
    handsData[0].off = offL; handsData[1].off = offR;
    out.tipL = tilt(add(tL, offL)); out.tipR = tilt(add(tR, offR)); out.hit = HIT;
    const rd = nrm(sub(out.tipR, out.tipL)); out.reachDir = rd;

    // area weights
    const items = [];
    handsData.forEach((hd, hi) => {
      hd.P.forEach(pr => items.push({ hd, pr, a: area(pr) * S3 * S3 }));
      const fa = Math.PI * (hd.fore.ry[0] + hd.fore.rz[0]) * hd.fore.L * .42; // forearms get a reduced share
      items.push({ hd, pr: hd.fore, a: fa });
    });
    const total = items.reduce((s, it) => s + it.a, 0);
    let k = 0;
    items.forEach((it, ii) => {
      let n = ii === items.length - 1 ? N - k : Math.round(N * it.a / total);
      for (let j = 0; j < n && k < N; j++, k++) {
        let p, nm, fade = 1, loc;
        if (it.pr.t === 'fore') {
          const f = it.pr, tt = Math.pow(rnd(), .8), th = rnd() * Math.PI * 2;
          const u = f.dir, s1 = nrm(cross(u, [0, 0, 1])), s2 = cross(s1, u);
          const ry = f.ry[0] + (f.ry[1] - f.ry[0]) * tt, rz = f.rz[0] + (f.rz[1] - f.rz[0]) * tt;
          const c = add(f.a, mul(u, f.L * tt));
          p = add(c, add(mul(s1, Math.cos(th) * ry), mul(s2, Math.sin(th) * rz)));
          nm = nrm(add(mul(s1, Math.cos(th) / ry), mul(s2, Math.sin(th) / rz)));
          fade = 1 - Math.min(1, Math.max(0, (tt - .15) / .8));
          loc = mul(p, 1 / S3);
        } else {
          const sm = sampleSurface(it.pr);
          loc = sm[0];
          p = it.hd.toWorld(sm[0]); nm = nrm(it.hd.toWorld(sm[1], true));
        }
        p = tilt(add(p, it.hd.off)); nm = tiltN(nm);
        const cr = vor(loc[0] * 3.2 + it.hd.H.side * 7, loc[1] * 3.2, loc[2] * 3.2);
        out.crack[k] = Math.max(0, 1 - cr / .07) * fade;
        const lam = Math.max(0, dot(nm, Ldir));
        const ff = Math.min(1, Math.max(0, (nm[2] + .45) / .8));
        out.pos[k * 3] = p[0]; out.pos[k * 3 + 1] = p[1]; out.pos[k * 3 + 2] = p[2];
        out.shade[k] = Math.min(1, (.22 + .78 * lam) * (.2 + .8 * ff) * fade);
        out.side[k] = it.hd.H.side;
      }
    });
    out.hands = handsData; out.tiltP = tilt; out.tiltN = tiltN; out.S3 = S3;
    return out;
  }

  // solid stone hands built from the same primitives (the dots solidify into these)
  function buildHandMeshes(HD) {
    const nrm3 = a => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
    const cross3 = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
    return HD.hands.map(hd => {
      const P = [], Nn = [], Lc = [], F = [], I = [];
      const push = (loc, nl, fade, wOver) => {
        let w, n;
        if (wOver) { w = wOver[0]; n = wOver[1]; } else { w = hd.toWorld(loc); n = hd.toWorld(nl, true); }
        w = HD.tiltP([w[0] + hd.off[0], w[1] + hd.off[1], w[2] + hd.off[2]]);
        n = HD.tiltN(n);
        P.push(w[0], w[1], w[2]); Nn.push(n[0], n[1], n[2]); Lc.push(loc[0] + hd.H.side * 7, loc[1], loc[2]); F.push(fade);
      };
      const grid = (rows, cols, fn) => {
        const base = P.length / 3;
        for (let i = 0; i <= rows; i++) for (let j = 0; j <= cols; j++) fn(i / rows, j / cols);
        for (let i = 0; i < rows; i++) for (let j = 0; j < cols; j++) { const a = base + i * (cols + 1) + j, b = a + cols + 1; I.push(a, b, a + 1, b, b + 1, a + 1); }
      };
      const sph = (c, r, fy) => grid(9, 16, (u, v) => {
        const th = u * Math.PI, ph = v * Math.PI * 2;
        const d = [Math.sin(th) * Math.cos(ph), Math.cos(th), Math.sin(th) * Math.sin(ph)];
        push([c[0] + d[0] * r[0], c[1] + d[1] * r[1], c[2] + d[2] * r[2]], nrm3([d[0] / r[0], d[1] / r[1], d[2] / r[2]]), 1);
      });
      hd.P.forEach(pr => {
        if (pr.t === 'ell') { sph(pr.c, pr.r); return; }
        const ax = [pr.b[0] - pr.a[0], pr.b[1] - pr.a[1], pr.b[2] - pr.a[2]], u = nrm3(ax);
        const up = Math.abs(u[1]) < .9 ? [0, 1, 0] : [1, 0, 0];
        const s1 = nrm3(cross3(u, up)), s2 = cross3(s1, u), fy = pr.flat || 1;
        grid(3, 18, (tt, v) => {
          const th = v * Math.PI * 2, rr = pr.ra + (pr.rb - pr.ra) * tt, c = Math.cos(th), sn = Math.sin(th);
          push([pr.a[0] + ax[0] * tt + (s2[0] * c * fy + s1[0] * sn) * rr, pr.a[1] + ax[1] * tt + (s2[1] * c * fy + s1[1] * sn) * rr, pr.a[2] + ax[2] * tt + (s2[2] * c * fy + s1[2] * sn) * rr],
            nrm3([s2[0] * c / fy + s1[0] * sn, s2[1] * c / fy + s1[1] * sn, s2[2] * c / fy + s1[2] * sn]), 1);
        });
        if (!pr.flat) { sph(pr.a, [pr.ra, pr.ra, pr.ra]); sph(pr.b, [pr.rb, pr.rb, pr.rb]); }
      });
      const f = hd.fore, u = f.dir, s1 = nrm3(cross3(u, [0, 0, 1])), s2 = cross3(s1, u);
      grid(14, 24, (tt, v) => {
        const th = v * Math.PI * 2, ry = f.ry[0] + (f.ry[1] - f.ry[0]) * tt, rz = f.rz[0] + (f.rz[1] - f.rz[0]) * tt, c = Math.cos(th), sn = Math.sin(th);
        const wp = [f.a[0] + u[0] * f.L * tt + s1[0] * c * ry + s2[0] * sn * rz, f.a[1] + u[1] * f.L * tt + s1[1] * c * ry + s2[1] * sn * rz, f.a[2] + u[2] * f.L * tt + s1[2] * c * ry + s2[2] * sn * rz];
        const wn = nrm3([s1[0] * c / ry + s2[0] * sn / rz, s1[1] * c / ry + s2[1] * sn / rz, s1[2] * c / ry + s2[2] * sn / rz]);
        push([wp[0] / HD.S3, wp[1] / HD.S3, wp[2] / HD.S3], null, 1 - sstep(.08, .95, tt), [wp, wn]);
      });
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3));
      g.setAttribute('normal', new THREE.Float32BufferAttribute(Nn, 3));
      g.setAttribute('aL', new THREE.Float32BufferAttribute(Lc, 3));
      g.setAttribute('aFade', new THREE.Float32BufferAttribute(F, 1));
      g.setIndex(I);
      return { geo: g, side: hd.H.side };
    });
  }

  // The citizen: a particle head sampled offline from the MakeHuman base mesh (CC0 1.0), with its CC0 African
  // macro targets applied. Outline contours, lit surface points, full eyes and a violet web, as in the reference.
  const HEAD_MESH = "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SgC9Bc8F0QVgAM8FYABnAEEAZQBkAEEAZABAALgFvAVmALgFZgA/AL8FzwVnAL8FZwBfAGwAZwBgAGwAYABoAGgAYABhAGgAYQBpAGkAYQBiAGkAYgBqAGoAYgBjAGoAYwBrAHYAcQBtAHYAbQByAHMAbgBvAHMAbwB0AHQAbwBwAHQAcAB1AHIAbQBuAHIAbgBzAHwAdgByAHwAcgB4AHgAcgBzAHgAcwB5AHkAcwB0AHkAdAB6AHoAdAB1AHoAdQB7AIIAfAB4AIIAeAB+AHcAfQCBAHcAgQB7AH4AeAB5AH4AeQB/AH8AeQB6AH8AegCAAIAAegB7AIAAewCBAIgAggB+AIgAfgCEAH0AgwCHAH0AhwCBAIQAfgB/AIQAfwCFAIUAfwCAAIUAgACGAIYAgACBAIYAgQCHAE4AjACNAE4AjQBPAI4AUABPAI4ATwCNAPoF+AVQAPoFUACOAIoATABLAIoASwCJAJMAVQBUAJMAVACSAJUAVwBWAJUAVgCUAJIAVABTAJIAUwCRAJQAVgBVAJQAVQCTAJEAUwBSAJEAUgCQAJoAXABbAJoAWwCZAJsAXQBeAJsAXgCcAJkAWwBZAJkAWQCXAJgAWgBdAJgAXQCbAJwAXgBfAJwAXwCdAJcAWQBaAJcAWgCYAGwAnQBfAGwAXwBnAFIAXACaAFIAmgCQAHEAdgCmAHEApgClAHYAfACnAHYApwCmAHwAggCoAHwAqACnAIIAiACpAIIAqQCoALQArgCvALQArwC1ALEAqwCuALEArgC0ALIArACqALIAqgCwALMArQCsALMArACyALAAqgCrALAAqwCxAKUApgC1AKUAtQCvAMIAugC5AMIAuQDBAMEAuQCeAMEAngC8AMMAuwC6AMMAugDCALwAngCfALwAnwC9AL0AnwCgAL0AoAC+AK0AswC+AK0AvgCgAM8AswCyAM8AsgDOALMAzwDUALMA1AC+AM0AsQC0AM0AtADQANAAtAC1ANAAtQDRANgAwgDBANgAwQDXANcAwQC8ANcAvADSANkAwwDCANkAwgDYANIAvAC9ANIAvQDTAMwAsACxAMwAsQDNAP8F/QXDAP8FwwDZANMAvQC+ANMAvgDUAM4AsgCwAM4AsADMAKYApwDRAKYA0QC1AKcAqADdAKcA3QDRAKgAqQDcAKgA3ADdAOEAzwDOAOEAzgDgAOAAzgDMAOAAzADeAN4AzADNAN4AzQDfAOQA3QDcAOQA3ADjAOkA0ADkAOkA5ADrAOUA3gDfAOUA3wDmANAA0QDdANAA3QDkAOgA4QDgAOgA4ADnAOsA5ADjAOsA4wDqAOcA4ADeAOcA3gDlAOwA6QDrAOwA6wDuAO4A6wDqAO4A6gDtAIwG8gDxAIwG8QCLBosG8QDvAIsG7wCNBo0G7wDwAI0G8ACOBgIB2QDYAAIB2AABAQAB1wDSAAAB0gD9AAEB2ADXAAEB1wAAAf4A0wDUAP4A1AD/AAEG/wXZAAEG2QACAf0A0gDTAP0A0wD+AAUB/gD/AAUB/wAGAQQB/QD+AAQB/gAFAQcBAAH9AAcB/QAEAeEA/wDUAOEA1ADPAOEA6AAGAeEABgH/AI8GCQEKAY8GCgGQBowG+QAQAYwGEAGQBmUG8gAKAWUGCgFuBpUGjwYPAZUGDwFiA2sDxgPFA2sDxQNpAyYBLAZ+AyYBfgMlARgBFgEXARgBFwEZAQQGGAEZAQQGGQEDBsYAygAZAcYAGQEXAQMGGQHKAAMGygD+BSEB7AV+AyEBfgMiASMByQDIACMByAAiAcgAxwAhAcgAIQEiAewFJAElAewFJQF+AywGIwEiASwGIgF+A8UAywDrBcUA6wUbAccAxgAXAccAFwEhARIBKgErARIBKwETAVABUQE+AVABPgE/ASwBMQEyASwBMgEtASoBLwEwASoBMAErATMBLgEtATMBLQEyATEBNgE3ATEBNwEyAS8BNAE1AS8BNQEwATgBMwEyATgBMgE3ATYBOwE8ATYBPAE3ATQBOQE6ATQBOgE1AT0BOAE3AT0BNwE8AU0BaAFnAU0BZwEdAR4BTQFOAR4BTgFAAW0BRwESAW0BEgFsAUQBQQFCAUQBQgFDAUUBRAFDAUUBQwFGASoBEgFHASoBRwFIAS8BKgFIAS8BSAFJATQBLwFJATQBSQFKATkBNAFKATkBSgFLAR0BOQFLAR0BSwFMAU0BHQFMAU0BTAFOAR4BQAFFAR4BRQFGAT4BRgFDAT4BQwE/AT8BQwFCAT8BQgEfAdwF2gUoAdwFKAEpAWwBbwEfAWwBHwFCARUBFgEYARUBGAFSAQQGGgFTAQQGUwEGBhoBHAFUARoBVAFTAWYBHgFGAWYBRgE+AekFOQY6BukFOgbqBTsBVQFWATsBVgE8AVcBPQE8AVcBPAFWAUABWAFbAUABWwFFAVgBQAFOAVgBTgFiAUoBXwFgAUoBYAFLAUcBXAFdAUcBXQFIAVoBRAFFAVoBRQFbAUgBXQFeAUgBXgFJAW0BbgFcAW0BXAFHAUsBYAFhAUsBYQFMAVkBQQFEAVkBRAFaAWIBTgFMAWIBTAFhAUkBXgFfAUkBXwFKAe4FVwFWAe4FVgHtBXkBegFwAXkBcAFrAZUBcwFyAZUBcgGWAR0BZwE6AR0BOgE5AWgBTQEeAWgBHgFmAUEBbQFsAUEBbAFCARIBEwFvARIBbwFsAUEBWQFuAUEBbgFtAZQBdQFzAZQBcwGVAccBagFlAccBZQHGAfwG7gXtBfwG7QX9BmABhQGGAWABhgFhAX8BWgFbAX8BWwGAAYcBYgFhAYcBYQGGAVgBfQGAAVgBgAFbAVwBgQGCAVwBggFdAV0BggGDAV0BgwFeAX0BWAFiAX0BYgGHAYgBbgFZAYgBWQF+AV4BgwGEAV4BhAFfAW4BiAGBAW4BgQFcAV8BhAGFAV8BhQFgAX4BWQFaAX4BWgF/AYsBiAF+AYsBfgGJAYkBfgF/AYkBfwGKAY4BiwGJAY4BiQGMAYwBiQGKAYwBigGNAYsBggGBAYsBgQGIAX8BgAF9AX8BfQGKAX0BhwGNAX0BjQGKAY0BhwGGAY0BhgGFAYwBjQGFAYwBhQGEAY4BjAGEAY4BhAGDAYsBjgGDAYsBgwGCAXUBjwGQAXUBkAFzAXMBkAGRAXMBkQFyAWsBcAGXAWsBlwGYAf4G/QbtBf4G7QXwBZgBnAGdAZgBnQGbAZwBngGfAZwBnwGdAfIBoAGhAfIBoQHxAaABogGjAaABowGhAaIBpAGlAaIBpQGjAakBpgGnAakBpwGqAfQBqQGqAfQBqgH1Aa8BrAGtAa8BrQGwAbIBrwGwAbIBsAGzAbcBugG5AbcBuQG4Ab4BvQG8Ab4BvAG1AagBnAGYAagBmAGXAZ4BnAGoAZ4BqAGrAfIBngGrAfIBqwHzAaIBoAGuAaIBrgGxAaQBogGxAaQBsQG0AXEBaQGTAXEBkwGSAfYB9wG6AfYBugG3AbUBvAG7AbUBuwG2AZQBlQG4AZQBuAG5AWQBYwHIAWQByAHCAQUHvwHAAQUHwAEGBw8H+AHBAQ8HwQEHB/8GMAbvBf8G7wUABxIH+gaaARIHmgEIB/oB+QHFAfoBxQHLAckBwwHEAckBxAHKAfsB+gHLAfsBywHOAcwByQHKAcwBygHNAfwB+wHOAfwBzgHRAc8BzAHNAc8BzQHQAf0B/AHRAf0B0QHUAdIBzwHQAdIB0AHTARAH1gHFARAHxQEHB8sBxQHWAcsB1gHXAc4BywHXAc4B1wHYAdEBzgHYAdEB2AHZAdQB0QHZAdQB2QHaAQgHmgG/AQgHvwEFB8MByQHIAcMByAGZAcIByAHJAcIByQHMAcwBzwHGAcwBxgHCAccBxgHPAccBzwHSAd0BtwG4Ad0BuAHeAdsBtQG2AdsBtgHcAf4B9gG3Af4BtwHdAZUBlgHeAZUB3gG4AeAB5AHeAeAB3gGWAd0B3gHkAd0B5AHjAf4B3QHjAf4B4wH/Af8B4gHcAf8B3AH+AdsB3AHiAdsB4gHhAQAC/wHjAQAC4wHpAekB4wHkAekB5AHqAfYG9QbfAfYG3wHlAeAB5gHqAeAB6gHkAecB4QHiAecB4gHoAZ4B8gHxAZ4B8QGfAawB9AH1AawB9QGtAaAB8gHzAaAB8wGuAbYBuwH3AbYB9wH2AQYHwAH4AQYH+AEPB8oBxAH5AcoB+QH6Ac0BygH6Ac0B+gH7AdABzQH7AdAB+wH8AdMB0AH8AdMB/AH9AdwBtgH2AdwB9gH+AeEBBgIHAuEBBwLbAegB4gH/AegB/wEAAgYC4QHnAQYC5wEFAtYBAwICAtYBAgLXAdcBAgIKAtcBCgLYARAHDgcDAhAHAwLWAQYCFwIYAgYCGAIHAr4BtQHbAb4B2wEHAtkBCQIIAtkBCALaAdgBCgIJAtgBCQLZAQ4CsgGzAQ4CswEPAgkCGgIZAgkCGQIIAgwCpAG0AQwCtAEQAgMCFAITAgMCEwICAhECvQG+ARECvgESAhcCKAIpAhcCKQIYAgoCGwIaAgoCGgIJAhcCBgIFAhcCBQIWAgICEwIbAgICGwIKAhICvgEHAhICBwIYAg4HDQcUAg4HFAIDAqQBDAINAqQBDQKlARoCKwIqAhoCKgIZAhMCJAIsAhMCLAIbAhsCLAIrAhsCKwIaAigCFwIWAigCFgInAg0HBAclAg0HJQIUAiICEQISAiICEgIjAh0CDAIQAh0CEAIhAgwCHQIeAgwCHgINAhQCJQIkAhQCJAITAjoCKQIoAjoCKAI5AiMCEgIYAiMCGAIpAh8CDgIPAh8CDwIgAjQCIwIpAjQCKQI6AjACHwIgAjACIAIxAisCPAI7AisCOwIqAiQCNQI9AiQCPQIsAiwCPQI8AiwCPAIrAjkCKAInAjkCJwI4AgQHAwc2AgQHNgIlAjMCIgIjAjMCIwI0Ai4CHQIhAi4CIQIyAh0CLgIvAh0CLwIeAiUCNgI1AiUCNQIkAjkCSgJLAjkCSwI6AlwCSwJKAlwCSgJbAkUCNAI6AkUCOgJLAkECMAIxAkECMQJCAjwCTQJMAjwCTAI7AjUCRgJOAjUCTgI9Aj0CTgJNAj0CTQI8AkoCOQI4AkoCOAJJAgMHAgdHAgMHRwI2AkQCMwI0AkQCNAJFAj8CLgIyAj8CMgJDAi4CPwJAAi4CQAIvAp4CpAK1Ap4CtQKvAjYCRwJGAjYCRgI1AlACPwJDAlACQwJUAj8CUAJRAj8CUQJAAo0CkwKkAo0CpAKeAkcCWAJXAkcCVwJGAlsCbAJtAlsCbQJcAlYCRQJLAlYCSwJcApMCjQJ8ApMCfAKCAlICQQJCAlICQgJTAk0CXgJdAk0CXQJMAoICfAJrAoICawJxAkYCVwJfAkYCXwJOAk4CXwJeAk4CXgJNAlsCSgJJAlsCSQJaAgIHAQdYAgIHWAJHAlUCRAJFAlUCRQJWAl4CbwJuAl4CbgJdAmsCWgJgAmsCYAJxAlcCaAJwAlcCcAJfAl8CcAJvAl8CbwJeAmwCWwJaAmwCWgJrAgEHDAdpAgEHaQJYAmYCVQJWAmYCVgJnAmECUAJUAmECVAJlAlACYQJiAlACYgJRAk8CYAJaAk8CWgJJAlgCaQJoAlgCaAJXAn4CbQJsAn4CbAJ9AmcCVgJcAmcCXAJtAkkCOAI+AkkCPgJPAmMCUgJTAmMCUwJkAngCZwJtAngCbQJ+AjgCJwItAjgCLQI+AnQCYwJkAnQCZAJ1Am8CgAJ/Am8CfwJuAicCFgIcAicCHAItAmgCeQKBAmgCgQJwAnACgQKAAnACgAJvAn0CbAJrAn0CawJ8AgwHCwd6AgwHegJpAncCZgJnAncCZwJ4AnICYQJlAnICZQJ2AmECcgJzAmECcwJiAhYCBQILAhYCCwIcAmkCegJ5AmkCeQJoAn4CfQKOAn4CjgKPAp8CoAKPAp8CjwKOAokCeAJ+AokCfgKPAgUC5wHtAQUC7QELAoUCdAJ1AoUCdQKGAoACkQKQAoACkAJ/AucB6AHuAecB7gHtAXkCigKSAnkCkgKBAoECkgKRAoECkQKAAo4CfQJ8Ao4CfAKNAgsHCgeLAgsHiwJ6AogCdwJ4AogCeAKJAoMCcgJ2AoMCdgKHAnICgwKEAnIChAJzAgEC7gHoAQEC6AEAAnoCiwKKAnoCigJ5ApECogKhApECoQKQAgAC6QHvAQAC7wEBAooCmwKjAooCowKSApICowKiApICogKRAp8CjgKNAp8CjQKeAgoHCQecAgoHnAKLApkCiAKJApkCiQKaApQCgwKHApQChwKYAoMClAKVAoMClQKEAukB6gHwAekB8AHvAYsCnAKbAosCmwKKArACsQKgArACoAKfApoCiQKPApoCjwKgAuwB8AHqAewB6gHmAZYChQKGApYChgKXAqUClAKYAqUCmAKpApQCpQKmApQCpgKVApwCrQKsApwCrAKbAqsCmgKgAqsCoAKxAqcClgKXAqcClwKoAqICswKyAqICsgKhApsCrAK0ApsCtAKjAqMCtAKzAqMCswKiArACnwKeArACngKvAgkHFAetAgkHrQKcAqoCmQKaAqoCmgKrArsCqgKrArsCqwK8AsECwgKxAsECsQKwAq8CtQLGAq8CxgLAArYCpQKpArYCqQK6AqUCtgK3AqUCtwKmAq4CpgK3Aq4CtwK/ArwCqwKxArwCsQLCArgCpwKoArgCqAK5ArMCxALDArMCwwKyAqwCvQLFAqwCxQK0ArQCxQLEArQCxAKzArACrwLAArACwALBAhQHEwe+AhQHvgKtAr4CvQKsAr4CrAKtAhMHvwK3AhMHtwK2ArsCvAK2ArsCtgK6Ao4G8AD6AI4G+gCbBtMC5QHfAdMC3wHSAsgC1QJ8AcgCfAF7AY8B2QLaAo8B2gKQAZIBkwGnAZIBpwGmAdoC0QKRAdoCkQGQAdYC1wLqAtYC6gLoAuUCeAN5A+UCeQPkAu0C6QLsAu0C7ALuAu8C7QLuAu8C7gLwAvEC7wLwAvEC8ALyAvMC8QLyAvMC8gL0AvUC8wL0AvUC9AL2AvcC9QL2AvcC9gL4AvsC+QL6AvsC+gL8Av0C+wL8Av0C/AL+Av8C/QL+Av8C/gIAAwED/wIAAwEDAAMCAwMDAQMCAwMDAgMEAwUDAwMEAwUDBAMGA+QCeQN6A+QCegPjAtkDDgMNA9kDDQPYAw4DEgMRAw4DEQMNAxIDFgMVAxIDFQMRAxYDGwMZAxYDGQMVAx8DJwMqAx8DKgMaAyYDIAMnAyYDJwMhAxsDIAMeAxsDHgMZAyADJgMkAyADJAMeAyUDIQMnAyUDJwMfAyADGwMqAyADKgMnAxoDCAQYAxoDGAMdAx4DJAMoAx4DKAMiAwMDBQMLAwMDCwMKAwEDAwMKAwEDCgMJA/8CAQMJA/8CCQMIAxEDFQMXAxEDFwMTA+YCdwN4A+YCeAPlAvkAjAaLBvkAiwb4AOkC7QL8AukC/AL6Au0C7wL+Au0C/gL8Au8C8QIAA+8CAAP+AvEC8wICA/ECAgMAA/MC9QIEA/MCBAMCA/UC9wIGA/UCBgMEA+4CLAMtA+4CLQPwAvYCMAMxA/YCMQP4AvQCLwMwA/QCMAP2AvICLgMvA/ICLwP0AvACLQMuA/ACLgPyAiwDMgMzAywDMwMtAzADNgM3AzADNwMxAy0DMwM0Ay0DNAMuAy4DNAM1Ay4DNQMvAy8DNQM2Ay8DNgMwAzIDOAM5AzIDOQMzAzYDPAM9AzYDPQM3AzMDOQM6AzMDOgM0AzQDOgM7AzQDOwM1AzUDOwM8AzUDPAM2AzgDPgM/AzgDPwM5AzwDQgNDAzwDQwM9AzkDPwNAAzkDQAM6AzoDQANBAzoDQQM7AzsDQQNCAzsDQgM8Az4DRANFAz4DRQM/A0IDSANJA0IDSQNDAz8DRQNGAz8DRgNAA0ADRgNHA0ADRwNBA0EDRwNIA0EDSANCA0QDSgNLA0QDSwNFA0gDTgNPA0gDTwNJA0UDSwNMA0UDTANGA0YDTANNA0YDTQNHA0cDTQNOA0cDTgNIA/UDUANRA/UDUQP2AwMEVANVAwMEVQP0A/YDUQNSA/YDUgMCBAIEUgNTAwIEUwMBBAEEUwNUAwEEVAMDBMMDWQMZB8MDGQcUBBQEGQcYBxQEGAf4A8EDFQdYA8EDWAPCA+oDFwdaA+oDWgO/A8IDWANZA8IDWQPDA78DWgNbA78DWwPAA5EGkgZeA5EGXgNfA5IGkwZhA5IGYQNeA8oDzAPNA8oDzQPWA5wGkQZfA5wGXwMIBqMDqgOrA6MDqwOkA5MGlQZiA5MGYgNhA2gDyQPGA2gDxgNrA8wDygPJA8wDyQNoA6sDrAOlA6sDpQOkA5YGlwZ6A5YGegN5A+4C7AJwA+4CcAMsAzIDLANwAzIDcANxAzgDMgNxAzgDcQNyAz4DOANyAz4DcgNzA0QDPgNzA0QDcwN0A0oDRAN0A0oDdAN1A9sA1QCAA9sAgAOBA/kFVwCVAPkFlQD7BYoAiQCCA4oAggO3AAkGgwOWAAkGlgD7BQkGuwDDAAkGwwD9BYQDtwCCA4QDggOFA4AD1QCEA4ADhAOFA5AAmgCtAJAArQCgAJMAkgCeAJMAngC5AGwAaABtAGwAbQBxAJUAlAC6AJUAugC7AJsAnACvAJsArwCuAGkAagBvAGkAbwBuAJcAmACrAJcAqwCqAJEAkACgAJEAoACfAGgAaQBuAGgAbgBtAJQAkwC5AJQAuQC6AJwAnQClAJwApQCvAJgAmwCuAJgArgCrAJoAmQCsAJoArACtAHEApQCdAHEAnQBsAJIAkQCfAJIAnwCeAJkAlwCqAJkAqgCsAGoAawBwAGoAcABvAOMCegOLA+MCiwOKA5cGmAaLA5cGiwN6AxUDGQMcAxUDHAMXAyIDHAMZAyIDGQMeA9cC1gKSA9cCkgORA40DjwOVA40DlQOUA5MDjAOUA5MDlAOVA3YDlQOPA3YDjwOQA3YD5wKTA3YDkwOVAxADFAOXAxADlwOWAyoDCQQIBCoDCAQaAxsDFgMJBBsDCQQqAyMDKQMlAyMDJQMfAx8DGgMdAx8DHQMjA5YDlwOYA5YDmAOZA90D3AOMA90DjAOTA90D3gMQA90DEAOWA44D4QJ4A44DeAN3AwUEmgMHAwUEBwMEBAgDCQOcAwgDnAObAwkDCgOdAwkDnQOcAwoDCwOeAwoDngOdA+ID5AP5AuID+QIHA+AD3wPsAuAD7ALpAuMD4gMHA+MDBwOaA+AD4QPjAuAD4wKKA+QD4QP6AuQD+gL5AtsDcAPsAtsD7ALfA74DVwMXB74DFwfqA2QDXANXA2QDVwO+AwcGCAZfAwcGXwNWA/gDGAcWB/gDFgfEA8ADWwMVB8ADFQfBA4oDiwNgA4oDYANdA7oDHwccB7oDHAe7A+UDcQNwA+UDcAPbA8EGwgahA8EGoQP6A8gHDgT/A8gH/wPHB8kHpwMOBMkHDgTIB74GvwZ1A74GdQN0A70GvgZ0A70GdANzA7wGvQZzA7wGcwNyA8MGvAZyA8MGcgNxAwoESgN1AwoEdQMNBKsDsgOzA6sDswOsA/4D/QO2A/4DtgOvA6oDsQOyA6oDsgOrA60DtAO1A60DtQOuA+cD6AOxA+cDsQOqA6wDswO0A6wDtAOtAy0H6QO4Ay0HuAMmBykHugO7AykHuwMoByoHuQO6AyoHugMpBy4H+QO9Ay4HvQMrByYHuAO5AyYHuQMqBygHuwO8AygHvAMsBxwHwgPDAxwHwwMbByIH6gO/AyIHvwMdBx8HwQPCAx8HwgMcByAHwAPBAyAHwQMfByMH+APEAyMHxAMhBx0HvwPAAx0HwAMgBwAEbQNsAwAEbAP7A8cDbgPFA8cDxQPGA/gA9gDPA/gAzwPLA8gDEQEQAcgDEAH5AMgD+QD4AMgD+ADLAxcEFQRpAxcEaQPFA6wDrQOmA6wDpgOlA60DrgOnA60DpwOmA5oG/AD7AJoG+wCZBs8D9gD3AM8D9wDQA5sG+gD8AJsG/ACaBs0HyAPLA80HywPKB80HzgcRAc0HEQHIA6cDrgMTBKcDEwQOBNcD1APKA9cDygPWA9QD1QPJA9QDyQPKA8oHywPPA8oHzwPLB+oC2QPYA+oC2APoAg4EEwT+Aw4E/gP/A5YDmQPcA5YD3APdA5MD5wLeA5MD3gPdA+UC5ALkA+UC5APiA4oD4gLfA4oD3wPgA+YC5QLiA+YC4gPjA+kC+gLhA+kC4QPgA+QC4wLhA+QC4QPkA28D2wPfA28D3wPiAqAD5QPbA6AD2wNvA7sGwwZxA7sGcQPlA6kDsAPoA6kD6APnAycHtwPpAycH6QMtBx4HvgPqAx4H6gMiB9QD7QPsA9QD7APVA9QD1wPuA9QD7gPtA/8D/gOvA/8DrwOoA9UD7APvA9UD7wPHA9IH8QPyA9IH8gPQBw8EAgQBBA8EAQQWBGwDagP8A2wD/AP7A9QH1QeiA9QHogPmAwwEbgPzAwwE8wMZBOYA3wDpAOYA6QDsAPED0wPSA/ED0gPyAxMEEgT9AxME/QP+A24DxwPvA24D7wPzAxgE9gMCBBgEAgQPBCQHFAT4AyQH+AMjB9UDxwPGA9UDxgPJA/cD8ANtA/cDbQMABAsEAwT0AwsE9AMQBAoE9QP2AwoE9gMYBC8HEQT5Ay8H+QMuB1AD9QP6A1AD+gOhAxYEAQQDBBYEAwQLBAwEAAT7AwwE+wMXBMsH0QfzA8sH8wPvA80A0ADpAM0A6QDfAHIBkQHfAXIB3wH1BtIC3wGRAdICkQHRAvYG5QHrAfYG6wH3BuUB0wLUAuUB1ALrAY0DlAPXAo0D1wKRA5QDjAPqApQD6gLXAtkD6gKMA9kDjAPcA9wDmQMOA9wDDgPZAxIDDgOZAxIDmQOYAw0DEQMTAw0DEwMPA9gDDQMPA9gDDwPaA9oDDAPoAtoD6ALYAwwD6wLWAgwD1gLoApID1gLrApID6wLcAioG2QaIAyoGiAOdBs0GkAOPA80GjwPMBswGjwONA8wGjQPLBssGjQORA8sGkQPKBsoGkQOSA8oGkgPJBhoBGwHrBRoB6wUcAQcEBQQEBAcEBAQGBPkC+wIEBPkCBAQHA/sC/QIGBPsCBgQEBJcDFAMYA5cDGAMIBJgDlwMIBJgDCAQJBBYDEgOYAxYDmAMJBAcEBgQIAwcECAObA/0C/wIIA/0CCAMGBLADqQNmA7ADZgNnAyUHZQO3AyUHtwMnB+kDIgcdB+kDHQe4A9MD8QPiANMD4gDRA9ED4gDQA9ED0AP3APUDCgQNBPUDDQT6A/sD/AMVBPsDFQQXBEwDDwQWBEwDFgRNAwAEDAQZBAAEGQT3A64DtQMSBK4DEgQTBEsDGAQPBEsDDwRMAxsHwwMUBBsHFAQkB04DCwQQBE4DEARPA0oDCgQYBEoDGARLAywHvAMRBCwHEQQvB00DFgQLBE0DCwROA24DDAQXBG4DFwTFA9IH9wMZBNIHGQTWB9YHGQTzA9YH8wPRB6oIGgQbBKoIGwSpCKwIDwASAKwIEgCrCK0IDAAPAK0IDwCsCK4ICQAMAK4IDACtCK8IBgAJAK8ICQCuCLAINgABALAIAQCpCLIISABFALIIRQCxCLUIMwQvBLUILwS0CLEIRQBCALEIQgC2CMMI9gU1AMMINQCzCLYIQgA/ALYIPwC0CLkILwAyALkIMgC4CLUIZgA8ALUIPAC6CLsILAAvALsILwC5CLoIPAA5ALoIOQC8CLwIOQA2ALwINgCwCL8IIQAkAL8IJAC+CMQI9AUeAMQIHgC3CMEIGAAbAMEIGwDACKoIAAAGAKoIBgCvCMIIFQAYAMIIGADBCKsIEgAVAKsIFQDCCEIEKAQpBEIEKQRDBD8EJQQmBD8EJgRABDoEIAQhBDoEIQQ7BDQEGgQcBDQEHAQ2BEgELgQtBEgELQRHBEMEKQQqBEMEKgREBDsEIQQiBDsEIgQ8BDYEHAQdBDYEHQQ3BDMETQRJBDMESQQvBE0EMwQuBE0ELgRIBA4GDAYrBA4GKwRFBDwEIgQjBDwEIwQ9BDcEHQQeBDcEHgQ4BEoEMAQvBEoELwRJBA0GCwYkBA0GJAQ+BDgEHgQfBDgEHwQ5BEsEMQQwBEsEMARKBEYELAQbBEYEGwQ1BDkEHwQgBDkEIAQ6BBoENAQ1BBoENQQbBEwEMgQxBEwEMQRLBEcELQQsBEcELARGBGEERwRGBGEERgRgBFwEQgRDBFwEQwRdBFkEPwRABFkEQARaBFQEOgQ7BFQEOwRVBE4ENAQ2BE4ENgRQBGIESARHBGIERwRhBF0EQwREBF0ERAReBFUEOwQ8BFUEPARWBFAENgQ3BFAENwRRBE0EZwRjBE0EYwRJBGcETQRIBGcESARiBBAGDgZFBBAGRQRfBFYEPAQ9BFYEPQRXBFEENwQ4BFEEOARSBGQESgRJBGQESQRjBA8GDQY+BA8GPgRYBFIEOAQ5BFIEOQRTBGUESwRKBGUESgRkBGAERgQ1BGAENQRPBFMEOQQ6BFMEOgRUBDQETgRPBDQETwQ1BGYETARLBGYESwRlBH8EZQRkBH8EZAR+BHoEYARPBHoETwRpBG0EUwRUBG0EVARuBE4EaARpBE4EaQRPBIAEZgRlBIAEZQR/BHsEYQRgBHsEYAR6BHYEXARdBHYEXQR3BHMEWQRaBHMEWgR0BG4EVARVBG4EVQRvBGgETgRQBGgEUARqBHwEYgRhBHwEYQR7BHcEXQReBHcEXgR4BG8EVQRWBG8EVgRwBGoEUARRBGoEUQRrBGcEgQR9BGcEfQRjBIEEZwRiBIEEYgR8BBIGEAZfBBIGXwR5BHAEVgRXBHAEVwRxBGsEUQRSBGsEUgRsBH4EZARjBH4EYwR9BBEGDwZYBBEGWARyBGwEUgRTBGwEUwRtBIIEaARqBIIEagSEBJYEfAR7BJYEewSVBJEEdwR4BJEEeASSBIkEbwRwBIkEcASKBIQEagRrBIQEawSFBIEEmwSXBIEElwR9BJsEgQR8BJsEfASWBBQGEgZ5BBQGeQSTBIoEcARxBIoEcQSLBIUEawRsBIUEbASGBJgEfgR9BJgEfQSXBBMGEQZyBBMGcgSMBIYEbARtBIYEbQSHBJkEfwR+BJkEfgSYBJQEegRpBJQEaQSDBIcEbQRuBIcEbgSIBGgEggSDBGgEgwRpBJoEgAR/BJoEfwSZBJUEewR6BJUEegSUBJAEdgR3BJAEdwSRBI0EcwR0BI0EdASOBIgEbgRvBIgEbwSJBIIEnASdBIIEnQSDBLQEmgSZBLQEmQSzBK8ElQSUBK8ElASuBKoEkASRBKoEkQSrBKcEjQSOBKcEjgSoBKIEiASJBKIEiQSjBJwEggSEBJwEhASeBLAElgSVBLAElQSvBKsEkQSSBKsEkgSsBKMEiQSKBKMEigSkBJ4EhASFBJ4EhQSfBJsEtQSxBJsEsQSXBLUEmwSWBLUElgSwBBYGFAaTBBYGkwStBKQEigSLBKQEiwSlBJ8EhQSGBJ8EhgSgBLIEmASXBLIElwSxBBUGEwaMBBUGjASmBKAEhgSHBKAEhwShBLMEmQSYBLMEmASyBK4ElASDBK4EgwSdBKEEhwSIBKEEiASiBLoEoAShBLoEoQS7BKEEogTHBKEExwS7BKIEowS8BKIEvATHBKQEpQTEBKQExAS9BM4EtASzBM4EswTNBBUGpgS/BBUGvwQXBqcEqATBBKcEwQTABKoEqwS+BKoEvgTDBLYEnASeBLYEngS4BKsErATFBKsExQS+BK4EyQTIBK4EyASvBLwEowSkBLwEpAS9BLMEsgS3BLMEtwTNBLUEzwTLBLUEywSxBLIEsQTLBLIEywS3BBgGFgatBBgGrQTGBLUEsAS5BLUEuQTPBLAErwTIBLAEyAS5BK4EnQTMBK4EzATJBLYEzASdBLYEnQScBJ4EnwTKBJ4EygS4BJ8EoAS6BJ8EugTKBKYEpwTABKYEwAS/BI0EpwSmBI0EpgSMBHMEjQSMBHMEjARyBHIEWARZBHIEWQRzBLoE1ATkBLoE5ATKBM8E6QTlBM8E5QTLBLkE0wTpBLkE6QTPBBgGGgbfBBgG3wTFBL4E2ATdBL4E3QTDBMkE4wTiBMkE4gTIBMQE3gTXBMQE1wS9BLgE0gTQBLgE0AS2BMgE4gTTBMgE0wS5BBcGGQbeBBcG3gTEBLsE1QTUBLsE1AS6BMoE5ATSBMoE0gS4BMwE5gTjBMwE4wTJBLcE0QTnBLcE5wTNBMEE2wTaBMEE2gTABMcE4QTVBMcE1QS7BM0E5wToBM0E6ATOBMsE5QTRBMsE0QS3BMUE3wTYBMUE2AS+BLwE1gThBLwE4QTHBLYE0ATmBLYE5gTMBMAE2gTZBMAE2QS/BL0E1wTWBL0E1gS8BBkGGwb4BBkG+ATeBNUE7wTuBNUE7gTUBOME/QT8BOME/ATiBOcEAQUCBecEAgXoBNEE6wQBBdEEAQXnBNsE9QT0BNsE9ATaBOEE+wTvBOEE7wTVBNAE6gQABdAEAAXmBOUE/wTrBOUE6wTRBN8E+QTyBN8E8gTYBNYE8AT7BNYE+wThBOkEAwX/BOkE/wTlBNME7QQDBdMEAwXpBNoE9ATzBNoE8wTZBNcE8QTwBNcE8ATWBOQE/gTsBOQE7ATSBOIE/ATtBOIE7QTTBBoGHAb5BBoG+QTfBNgE8gT3BNgE9wTdBN4E+ATxBN4E8QTXBNIE7ATqBNIE6gTQBNQE7gT+BNQE/gTkBOYEAAX9BOYE/QTjBOsEBQUbBesEGwUBBfUEDwUOBfUEDgX0BPsEFQUJBfsECQXvBOoEBAUaBeoEGgUABf8EGQUFBf8EBQXrBPkEEwUMBfkEDAXyBPAECgUVBfAEFQX7BAMFHQUZBQMFGQX/BO0EBwUdBe0EHQUDBfQEDgUNBfQEDQXzBPEECwUKBfEECgXwBP4EGAUGBf4EBgXsBPwEFgUHBfwEBwXtBBwGHgYTBRwGEwX5BPIEDAURBfIEEQX3BPgEEgULBfgECwXxBOwEBgUEBewEBAXqBO4ECAUYBe4EGAX+BAAFGgUXBQAFFwX9BBsGHQYSBRsGEgX4BO8ECQUIBe8ECAXuBP0EFwUWBf0EFgX8BAEFGwUcBQEFHAUCBdoGQgVBBdoGQQUeBTEFLgUiBTEFIgU9BTkFJgXgBjkF4AYhBt8GIAYfBt8GHwbeBj4FIQUgBT4FIAU/BSAG3wYoBSAGKAU3BSEFPgVDBSEFQwXbBh4FQQVABR4FQAUfBScFOAU1BScFNQUqBd4GHwY6Bd4GOgUlBeMGJAYiBuMGIgbhBiQFOwUzBSQFMwUsBSYFOQU4BSYFOAUnBdsGQwU8BdsGPAUjBSwFMwU0BSwFNAUrBUUF3QYlBUUFJQU6BS8FMAU7BS8FOwUkBS4FMQVCBS4FQgXaBiQG4wYqBSQGKgU1Bd0GRQVEBd0GRAXcBjAFLwUjBTAFIwU8BSsFNAUjBisFIwbiBjIFLQUpBTIFKQU2BT0FIgXcBj0F3AZEBSEG4AYtBSEGLQUyBR8FQAU/BR8FPwUgBeIGIwY2BeIGNgUpBSQGBAUGBSQGBgUiBhIFPQVEBRIFRAULBUMFDAUTBUMFEwU8BRYFOQUhBhYFIQYHBSIGBgUYBSIGGAU3BR4GMAU8BR4GPAUTBUUFCgULBUUFCwVEBT4FEQUMBT4FDAVDBQcFIQYyBQcFMgUdBR0FMgU2BR0FNgUZBTEFHQYNBTEFDQVCBQoFRQU6BQoFOgUVBUIFDQUOBUIFDgVBBSMGBQUZBSMGGQU2BQQFJAY1BQQFNQUaBREFPgU/BREFPwUQBR8GCQUVBR8GFQU6BUEFDgUPBUEFDwVABTQFGwUFBTQFBQUjBtoAAwGBA9oAgQOAA5QGYAOLA5QGiwOYBl0DnwPiAl0D4gKKA8QA2gCAA8QAgAOFA4UDggODA4UDgwPEAIIDiQCWAIIDlgCDA1gAlgCJAFgAiQBLAM4FIwAgAM4FIADGBR8AIAAjAB8AIwAiAK0FHwAiAK0FIgCuBb8IJQQkBL8IJAS3CCUEPwQ+BCUEPgQkBD8EWQRYBD8EWAQ+BEcFBQMGA0cFBgNjBV4FPQNDA14FQwNdBVgFEAT0A1gF9ANZBV8FNwM9A18FPQNeBVkF9ANVA1kFVQNaBRAEWAVbBRAEWwVPA2AFMQM3A2AFNwNfBWIF9wL4AmIF+AJhBVwFSQNPA1wFTwNbBWEF+AIxA2EFMQNgBV0FQwNJA10FSQNcBU8FYQVgBU8FYAVQBVQFXAVbBVQFWwVVBU4FYgVhBU4FYQVPBVMFXQVcBVMFXAVUBVIFXgVdBVIFXQVTBVEFXwVeBVEFXgVSBVcFWAVZBVcFWQVWBVAFYAVfBVAFXwVRBVgFVwVVBVgFVQVbBVYFWQVaBUoFUgVTBUoFUwVJBUkFUwVUBUgFVAVVBU0FTwVQBUwFUAVRBUwFUQVLBUsFUQVSBUsFUgVKBQUDRgULA2IFYwUGA2IFBgP3AmQFZQWdA2QFnQOeA2UFZgWcA2UFnAOdA2YFZwWbA2YFmwOcA2cFaAUHBGcFBwSbA2gFaQUFBGgFBQQHBGkFagWaA2kFmgMFBGsFagUQA2sFEAPeA2sFbAXmAmsF5gLjA20FbAXnAm0F5wJ2A20FbgWOA20FjgN3A88GbgWQA88GkAPNBiYBJQHaBSYB2gXcBdsF2gUlAdsFJQEkAXEFcAXZAnEF2QKPAfgGcQWPAfgGjwF1AXMFcgWUAXMFlAG5AXQFcwW5AXQFuQG6AXUFdAW6AXUFugH3AXUFdgWtAXUFrQH1AXcFdgW7AXcFuwG8AXgFdwW8AXgFvAG9AXkFeAW9AXkFvQERAnkFegUgAnkFIAIPAnsFegUiAnsFIgIzAnwFewUzAnwFMwJEAnwFfQVTAnwFUwJCAn0FfgVkAn0FZAJTAn8FfgVmAn8FZgJ3AoAFfwV3AoAFdwKIAoAFgQWXAoAFlwKGAoEFggWoAoEFqAKXAoIFgwW5AoIFuQKoAoQFgwW7AoQFuwK6AoQFhQWnAoQFpwK4AoUFhgWWAoUFlgKnAocFhgWYAocFmAKHAocFiAV0AocFdAKFAokFiAV2AokFdgJlAooFiQVlAooFZQJUAooFiwVBAooFQQJSAosFjAUwAosFMAJBAo0FjAUyAo0FMgIhAo4FjQUhAo4FIQIQAo4FjwWyAY4FsgEOApAFjwW0AZAFtAGxAZEFkAWxAZEFsQGuAZIFkQWuAZIFrgHzAZIFkwWpAZIFqQH0AZQFkwWrAZQFqwGoAZQFlQWSAZQFkgGmAfkGlgV7AfkGewFxAZYFlwXIApYFyAJ7ARUB2AXbBRUB2wUkARUBUgHfBRUB3wXYBSsDKQNlBSkDIwNmBSkDZgVlBSMDHQNnBSMDZwVmBR0DGANoBR0DaAVnBRgDFANpBRgDaQVoBRQDEANqBRQDagVpBeMDmgNqBeMDagVrBd4D5wJsBd4DbAVrBXcD5gJsBXcDbAVtBXYDkANuBXYDbgVtBRQBTwFvARQBbwETASkG3wVSASkGUgEGBikGBgZTASkGUwHdBXwB1QJwBXwBcAVxBWkBfAFxBWkBcQX4BqcBkwFyBacBcgVzBaoBpwFzBaoBcwV0BfUBqgF0BfUBdAV1BfcBuwF2BfcBdgV1BbABrQF2BbABdgV3BbMBsAF3BbMBdwV4BQ8CswF4BQ8CeAV5BRECIgJ6BRECegV5BTECIAJ6BTECegV7BUICMQJ7BUICewV8BUQCVQJ9BUQCfQV8BVUCZgJ+BVUCfgV9BXUCZAJ+BXUCfgV/BYYCdQJ/BYYCfwWABYgCmQKBBYgCgQWABZkCqgKCBZkCggWBBaoCuwKDBaoCgwWCBbgCuQKDBbgCgwWEBboCqQKFBboChQWEBakCmAKGBakChgWFBYUClgKGBYUChgWHBYcCdgKIBYcCiAWHBWMCdAKIBWMCiAWJBVICYwKJBVICiQWKBVQCQwKLBVQCiwWKBUMCMgKMBUMCjAWLBR8CMAKMBR8CjAWNBQ4CHwKNBQ4CjQWOBRACtAGPBRACjwWOBa8BsgGPBa8BjwWQBawBrwGQBawBkAWRBfQBrAGRBfQBkQWSBfMBqwGTBfMBkwWSBaYBqQGTBaYBkwWUBagBlwGVBagBlQWUBXABegGWBXABlgX5BnoBxwKXBXoBlwWWBd4F3QVTAd4FUwFUAa4GrQaZBa4GmQWYBa0GrAaaBa0GmgWZBawGqwabBawGmwWaBaoGqQadBaoGnQWcBakGewOeBakGngWdBXsD5AafBXsDnwWeBeQGrwagBeQGoAWfBa8G5QahBa8GoQWgBeUG5gaiBeUGogWhBQIApAWjBQIAowUDAAYAAACkBQYApAWlBQkABgClBQkApQWmBQwACQCmBQwApgWnBQ8ADACnBQ8ApwWoBRIADwCoBRIAqAWpBRUAEgCpBRUAqQWqBRgAFQCqBRgAqgWrBRsAGACrBRsAqwWsBfQFGwCsBfQFrAUlBiQAIQCuBSQArgWvBS8ALACxBS8AsQWyBTIALwCyBTIAsgWzBfYFMgCzBfYFswUmBjcAAwCjBTcAowW1BToANwC1BToAtQW2BT0AOgC2BT0AtgW3BWQAPQC3BWQAtwW8BUMAQAC4BUMAuAW5BUYAQwC5BUYAuQW6BUkARgC6BUkAugW7BUAAZAC8BUAAvAW4BR4ArQWuBR4ArgUhAFoA1QXTBVoA0wVdAFMAwgXBBVMAwQVSAFAAzQXLBVAAywVPAEwAyQXOBUwAzgVLAFwA1gXABVwAwAVbAGEA0gXQBWEA0AViAGIA0AW9BWIAvQVjAA4ACwDWBQ4A1gXBBVUAxAXDBVUAwwVUAD4AZQDPBT4AzwW/BVYAxQXEBVYAxAVVAEsAzgXGBUsAxgVYAPkFJwbHBfkFxwVXAGAA0QXSBWAA0gVhAFsAwAXUBVsA1AVZAFkA1AXVBVkA1QVaAGUAQQDRBWUA0QXPBV4AvgW/BV4AvwVfAFQAwwXCBVQAwgVTAC0AKgDKBS0AygXLBV0A0wW+BV0AvgVeAPgFKAbNBfgFzQVQAFcAxwXFBVcAxQVWAB8A8wXyBR8A8gUgANkF3gVUAdkFVAEcAesFMQbZBesF2QUcAeIF4QXgBeIF4AXjBQoGtgDWAAoG1gAABqMA5AXmBaMA5gWiAPwFhgO2APwFtgAKBqMAogDHAKMAxwDIAFEBUAHdBVEB3QXeBaQA5QXkBaQA5AWjAKQAowDIAKQAyADJAOMF4AWGA+MFhgP8BVEBIAFmAVEBZgE+AdUG2AaeBtUGngZ3BqEFogX0AKEF9AD1AKAFoQX1AKAF9QDzAJ8FoAXzAJ8F8wDJAskCygKeBckCngWfBToBZwHvBToB7wUwBi0G7wVnAS0GZwFoAS4GLwZmAS4GZgEgATUBOgFVATUBVQE7ATABNQE7ATABOwE2ASsBMAE2ASsBNgExATEBLAETATEBEwErARMBLAEnARMBJwEUASQB7AUWASQBFgEVAXkBeAHHAnkBxwJ6ASwBLQEoASwBKAEnASkBKAEtASkBLQEuAa0FJQbzBa0F8wUfALQFJgb1BbQF9QU0ADQA9QX3BTQA9wUzAMwFMwD3BcwF9wUoBsYFIADyBcYF8gUnBo8AUQD4BY8A+AX6BdoAxAD9BdoA/QX/BQMB2gD/BQMB/wUBBhoBBAYDBhoBAwYbARsBAwb+BRsB/gXFAMoCywKdBcoCnQWeBcsAOAYxBssAMQbrBRgBBAYGBhgBBgZSAZQGnAYIBpQGCAZgA1gA+QX7BVgA+wWWALsACQb7BbsA+wWVAIMDCQb9BYMD/QXEAJ8G4gXjBZ8G4wXVBl0DYAMIBl0DCAYHBo4AjQB3Bo4AdwaeBrgIMgD2BbgI9gXDCMAIGwD0BcAI9AXECEQEKgQMBkQEDAYOBj0EIwQLBj0ECwYNBl4ERAQOBl4EDgYQBlcEPQQNBlcEDQYPBngEXgQQBngEEAYSBnEEVwQPBnEEDwYRBpIEeAQSBpIEEgYUBosEcQQRBosEEQYTBqwEkgQUBqwEFAYWBqUEiwQTBqUEEwYVBqUEFQYXBqUEFwbEBMUErAQWBsUEFgYYBsYE4AQaBsYEGgYYBr8E2QQZBr8EGQYXBtkE8wQbBtkEGwYZBuAE+gQcBuAEHAYaBvoEFAUeBvoEHgYcBvMEDQUdBvMEHQYbBjMFHAUbBTMFGwU0BTkFFgUXBTkFFwU4BSAGCAUJBSAGCQUfBh0GMQU9BR0GPQUSBUAFDwUQBUAFEAU/BTsFFAUcBTsFHAUzBTAFHgYUBTAFFAU7BcsCzAKcBcsCnAWdBR4A9AUlBh4AJQatBTUA9gUmBjUAJga0BVgAxgUnBlgAJwb5BVEAzAUoBlEAKAb4BdsC3QLUAtsC1ALTAoEGnwbVBoEG1QZ3BgUGUAE/AQUGPwEfAewFIQEXAewFFwEWAR8BbwFPAR8BTwEFBvAFVQE6AfAFOgEwBmIG7wauBmIGrgaYBS4GIAHZBS4G2QUxBlUB8AXtBVUB7QVWAdMC0gLYAtMC2ALbAjEGOAbxBTEG8QUuBt4C2ALSAt4C0gLRAtEC2gJ9A9ECfQPeAnwDfQPaAnwD2gLZAicBKAHaBScB2gXbBRQBJwHbBRQB2wXYBdgF3wVPAdgFTwEUAQUGTwHfBQUG3wUpBikG3QVQASkGUAEFBqEAuADLAKEAywDFACABUQHeBSAB3gXZBW8FfAPZAm8F2QJwBXAF1QI0BnAFNAZvBTUGNAbVAjUG1QLIAjYGNQbIAjYGyAKXBZcFxwI3BpcFNwY2BscCeAGoBscCqAY3BjgG6QXqBTgG6gXxBegGMwZ/A+gGfwPnBjgGywC4ADgGuADpBYgDAAZ7AIgDewB1AJsFnAXMApsFzALQAtACzwKaBdACmgWbBdkGCgYABtkGAAaIA88CzQKZBc8CmQWaBc0CzgKYBc0CmAWZBdgG/AUKBtgGCgbZBlcGcwZ0BlcGdAZABpgFzgJjBpgFYwZiBmAGXwZiBmAGYgZjBl8GYAZdBl8GXQZcBlwGXQZaBlwGWgZZBlcGVgZZBlcGWQZaBj4GVgZXBj4GVwZABs8G0AaOA88GjgNuBXwGeQZIBnwGSAZDBoMAfQDkBYMA5AXlBX0AdwDmBX0A5gXkBYAGdQZCBoAGQgZBBqcG5gV3AKcGdwDWAH0GTQZOBn0GTgZ8BnUGegZKBnUGSgZCBn8GUgZLBn8GSwZ4BnsGTAZNBnsGTQZ9BngGSwZMBngGTAZ7Bn4GegZPBn4GTwZQBoIGhwZRBoIGUQZOBn4GUAZSBn4GUgZ/Bk0GgwaCBk0GggZOBkwGhAaDBkwGgwZNBuoG6wZWBuoGVgY+BloGcgZzBloGcwZXBusG7AZZBusGWQZWBuwG7QZcBuwGXAZZBqUGpwbWAKUG1gC2ALYAhgOjBrYAowalBu0G7gZfBu0GXwZcBu4G7wZiBu4GYgZfBm8GcAYMAW8GDAENAXAGaQYLAXAGCwEMAQEBAAEHAQEBBwFhBgIBAQFhBgIBYQZeBgEGAgFeBgEGXgZbBlsGWAYDAVsGAwEBBlgGVQaBA1gGgQMDAVUG6AXbAFUG2wCBA3EGbwYNAXEGDQECBvwAZwZmBvwAZgb7APoAaAZnBvoAZwb8AO8AZAZqBu8AagbwAPIAZQZrBvIAawbxAPEAawZkBvEAZAbvAPAAagZoBvAAaAb6AAsBaQZsBgsBbAYIAQgBbAZtBggBbQYJAQkBbQZuBgkBbgYKAQIGDgFyBgIGcgZxBg4BiQNzBg4BcwZyBokD4AJ0BokDdAZzBowAgQZ3BowAdwaNAEAGdAZ2BkAGdgY/Bk4GUQZ5Bk4GeQZ8BlMGVAZ1BlMGdQaABkQGfQZ8BkQGfAZDBlQGTwZ6BlQGegZ1BkcGfwZ4BkcGeAZGBkUGewZ9BkUGfQZEBkYGeAZ7BkYGewZFBkkGSgZ6BkkGegZ+BkkGfgZ/BkkGfwZHBksGhQaEBksGhAZMBqEGowaGA6EGhgPgBaAGoQbgBaAG4AXhBdcFOQagBtcFoAbhBdcFPAY6BtcFOgY5BoAGQQY7BoAGOwYyBlIGhgaFBlIGhQZLBlAGiAaGBlAGhgZSBlAGTwaJBlAGiQaIBskGzgaHBskGhwaCBk8GVAaKBk8GigaJBtEG0AaJBtEGiQaKBnYGdAbgAnYG4ALfAvgAiwaNBvgAjQb2APYAjQaOBvYAjgb3AA8BjwaQBg8BkAYQAfIAjAaQBvIAkAYKAQgBCQGPBggBjwaVBvcAjgabBvcAmwbRAw0BDAGSBg0BkgaRBgwBCwGTBgwBkwaSBgIGDQGRBgIGkQacBgsBCAGVBgsBlQaTBt8C4AKXBt8ClwaWBuACiQOYBuACmAaXBtMDmgaZBtMDmQbSA9EDmwaaBtEDmgbTAw4BlAaYBg4BmAaJAw4BAgacBg4BnAaUBpYGeQN4A5YGeAPhAoYGzQbMBoYGzAaFBo4AngYqBo4AKgb6BfoFKgadBvoFnQaPAOMF/AXYBuMF2AbVBncAewAABncAAAbWAD4GQAY/Bj4GPwY9Bn8DMwYyBn8DMgY7BjkG6QW4ADkGuACgBjcGOwZBBjcGQQY2BkEGQgY1BkEGNQY2BqEGoAa4AKEGuAChAKEAogajBqEAowahBkIGSgY0BkIGNAY1BkoGSQZvBUoGbwU0Bv4FogahAP4FoQDFAEkGRwZ8A0kGfANvBaIGpAalBqIGpQajBn0DfANHBn0DRwZGBv4FygCkBv4FpAaiBqYGpAbKAKYGygDGAKIApgbGAKIAxgDHAKYGpwalBqYGpQakBqcGpgaiAKcGogDmBd4CfQNGBt4CRgZFBtgC3gJFBtgCRQZEBkQGQwbbAkQG2wLYAkMGSAbdAkMG3QLbAucGfwOoBucGqAbwBpwFmwWrBpwFqwaqBscHxgewBscHsAaxBsAGsgaxBsAGsQbBBr8GswayBr8GsgbABswHyQezBswHswa0Bs8HzAe0Bs8HtAa1BtMHzwe1BtMHtQa2BtcH0we2BtcHtga3BtQH1we3BtQHtwa4BrsGuga5BrsGuQa4BrQGswa/BrQGvwa+BrEGsAbCBrEGwgbBBrcGtga8BrcGvAbDBrgGtwbDBrgGwwa7Bg0EwAbBBg0EwQb6A7UGtAa+BrUGvga9BrYGtQa9BrYGvQa8BnUDvwbABnUDwAYNBOUDoAO6BuUDuga7BqgGfwM7BqgGOwY3BsYGxAbFBsYGxQbHBoAGMgbGBoAGxgZTBsQGxgYyBsQGMgYzBugG8gbEBugGxAYzBsYGxwbIBsYGyAZTBsgGigZUBsgGVAZTBoUGzAbLBoUGywaEBoQGywbKBoQGygaDBoMGygbJBoMGyQaCBogGzwbNBogGzQaGBogGiQbQBogG0AbPBpID3ALOBpIDzgbJBuECjgPQBuEC0AbRBj0GPwbTBj0G0wbUBtYG1wYrBtYGKwbnBdEGigbIBtEGyAbSBtcG4gXAANcGwAArBtEG0gZ2BtEGdgbfAtcF1wbWBtcF1gY8BuIF1wbXBeIF1wXhBdIG0wY/BtIGPwZ2BuEC0QbfAuEC3wKWBscG0wbSBscG0gbIBp4G2AbZBp4G2QYqBtMGxwbFBtMGxQbUBucFKwbbAOcF2wDoBdUA2wArBtUAKwbAAMAAhwOEA8AAhAPVAIcDvwC3AIcDtwCEA4oAtwC/AIoAvwCLAIsATQBMAIsATACKAMkFTABNAMkFTQDIBcgFJwAmAMgFJgDJBSUAJgAnACUAJwAoAK8FJQAoAK8FKACwBV0GcQZyBl0GcgZaBl0GYAZvBl0GbwZxBmAGYwZwBmAGcAZvBmkGcAZjBmkGYwbOAmwGaQbOAmwGzgLNAm0GbAbNAm0GzQLPAm4GbQbPAm4GzwLQAjgFFwUaBTgFGgU1BQ8F9QT2BA8F9gQQBfUE2wTcBPUE3AT2BMIE3ATbBMIE2wTBBKkEwgTBBKkEwQSoBKgEjgSPBKgEjwSpBI4EdAR1BI4EdQSPBHQEWgRbBHQEWwR1BFoEQARBBFoEQQRbBEAEJgQnBEAEJwRBBL0IJwQmBL0IJgS+CLAFKQAkALAFJACvBdACzAJlBtACZQZuBmsGZQbMAmsGzALLAmQGawbLAmQGywLKAmoGZAbKAmoGygLJAskC8wBoBskCaAZqBvMA9QBnBvMAZwZoBvUA9ABmBvUAZgZnBggFIAY3BQgFNwUYBRAF9gT3BBAF9wQRBQIFHAUUBQIFFAX6BIcDwADiBYcD4gWfBp8GgQa/AJ8GvwCHA4sAvwCBBosAgQaMAIwATgBNAIwATQCLAJ0GiAN1AJ0GdQBwAI8AnQZwAI8AcABrAFEAjwBrAFEAawBjAOEGIgY3BeEGNwUoBeMG4QYnBeMGJwUqBeEGKAUmBeEGJgUnBSgF3wbgBigF4AYmBd8G3gYtBd8GLQXgBt4GJQUpBd4GKQUtBeIGKQUlBeIGJQXdBt0G3AYrBd0GKwXiBiwFKwXcBiwF3AYiBSQFLAUiBSQFIgUuBS8FJAUuBS8FLgXaBtoGHgUjBdoGIwUvBR4FHwXbBh4F2wYjBSEF2wYfBSEFHwUgBfYE3ATdBPYE3QT3BMME3QTcBMME3ATCBMIEqQSqBMIEqgTDBJAEqgSpBJAEqQSPBI8EdQR2BI8EdgSQBHUEWwRcBHUEXAR2BEIEXARbBEIEWwRBBCgEQgRBBCgEQQQnBLsIKAQnBLsIJwS9CLEFLAApALEFKQCwBbAFKAArALAFKwCxBSgAJwAqACgAKgArAMoFKgAnAMoFJwDIBcgFTQBOAMgFTgDKBcwFUQBjAMwFYwC9Bb0FSgAzAL0FMwDMBTQAMwBKADQASgBJALQFNABJALQFSQC7BbsFSAA1ALsFNQC0BbIIMgQrBLIIKwSzCEUEKwQyBEUEMgRMBF8ERQRMBF8ETARmBGYEgAR5BGYEeQRfBJMEeQSABJMEgASaBJoEtAStBJoErQSTBLQEzgTGBLQExgStBOAExgTOBOAEzgToBOgEAgX6BOgE+gTgBD0G6QbqBj0G6gY+BsQG8gbxBsQG8QbFBtQGxQbxBtQG8QbzBtQG8wbpBtQG6QY9BvAGqAZ4AfAGeAF0AXYBdAF4AXYBeAF5AXcBawGYAXcBmAGbAcIBxgFlAcIBZQFkAXsBfAFpAXsBaQFxAf4G/wZjAf4GYwFkAcgBYwH0BsgB9AaZAfoG+wZ2AfoGdgF3AeYB4AH1BuYB9Qb2BpYBcgH1BpYB9QbgAeYB9gb3BuYB9wbsAXIF+AZ1AXIFdQGUAZUF+QZxAZUFcQGSAZMBaQH4BpMB+AZyBZcBcAH5BpcB+QaVBXYBeQFrAXYBawF3AaEBowHVAaEB1QHBAfEBoQHBAfEBwQH4AfgBwAGfAfgBnwHxAZ0BnwHAAZ0BwAG/AZsBnQG/AZsBvwGaAXcBmwGaAXcBmgH6BvAGdAEvBvAGLwYuBnYB+wYvBnYBLwZ0AS4G8QXnBi4G5wbwBvEF6gXoBvEF6AbnBuoFOgbyBuoF8gboBjoGPAbxBjoG8QbyBjwG1gbzBjwG8wbxBukG8wbWBukG1gbnBecF6AXqBucF6gbpBmoB/Ab9BmoB/QZlAWQBZQH9BmQB/Qb+BmMB/wYAB2MBAAf0BvAFMAb/BvAF/wb+BtUBBAIOB9UBDgcQB/kBDwcHB/kBBwfFAREHEgf0BhEH9AYAB8QBBgcPB8QBDwf5AZkBCAcFB5kBBQfDAfQGEgcIB/QGCAeZAcMBBQcGB8MBBgfEAdUBEAcHB9UBBwfBAQQCFQINBwQCDQcOBxUCJgIEBxUCBAcNByYCNwIDByYCAwcEBzcCSAICBzcCAgcDB0gCWQIBB0gCAQcCB1kCagIMB1kCDAcBB2oCewILB2oCCwcMB3sCjAIKB3sCCgcLB4wCnQIJB4wCCQcKB50CrgIUB50CFAcJB64CvwITB64CEwcUB/sG+gYSB/sGEgcRBy8GLQZoAS8GaAFmAS8G+wYRBy8GEQctBgAH7wUtBgAHLQYRB7wCwgITB7wCEwe2AsICwQK+AsICvgITB74CxALFAr4CxQK9AsECwALEAsECxAK+AsACxgLDAsACwwLEApUCpgKuApUCrgKdAp0CjAKEAp0ChAKVAowCewJzAowCcwKEAnsCagJiAnsCYgJzAmoCWQJRAmoCUQJiAkACUQJZAkACWQJIAkgCNwIvAkgCLwJAAjcCJgIeAjcCHgIvAiYCFQINAiYCDQIeAhUCBAKlARUCpQENAqMBpQEEAqMBBALVAesG6gboBesG6AVVBuwG6wZVBuwGVQZYBu0G7AZYBu0GWAZbBu4G7QZbBu4GWwZeBu8G7gZeBu8GXgZhBq4G7wZhBq4GYQYHAQcBBAGtBgcBrQauBgQBBQGsBgQBrAatBgUBBgGrBgUBqwasBqoGqwYGAaoGBgHoAOgA5wCpBugAqQaqBucA5QB7A+cAewOpBuUA5gDkBuUA5AZ7A+YA7ACvBuYArwbkBuwA7gDlBuwA5QavBu4A7QDmBu4A5gblBrsDHAcbB7sDGwe8A7kDIAcfB7kDHwe6A/kDIwchB/kDIQe9A7gDHQcgB7gDIAe5A7cDHgciB7cDIgfpAxEEJAcjBxEEIwf5A7wDGwckB7wDJAcRBGQDvgMeB2QDHgcaBx4HtwNlAx4HZQMaB+YD5wOqA+YDqgOjA6IDqQPnA6ID5wPmA84H2AcwB84HMAcRATMH7gPXAzMH1wMyB9YDMQcyB9YDMgfXAzEHNQc2BzEHNgcyB9gH2Qc0B9gHNAcwBzcHMwcyBzcHMgc2BzUHOQc6BzUHOgc2B9kH2gc4B9kHOAc0BzsHNwc2BzsHNgc6B7oGQAc/B7oGPwe5BtUH2wc+B9UHPgeiA28DPAc9B28DPQegA0AHugagA0AHoAM9B28D4gKfA28DnwM8B2YDqQOiA2YDogM+B2EDYgM0B2EDNAc4BzAHNAdiAzAHYgMPATkHNQfOAzkHzgNjA9YDzQPrA9YD6wMxB+sDzgM1B+sDNQcxBw8BEAERAQ8BEQEwB14DYQM4B14DOAdBB1YDXwNeA1YDXgNBB5wIXANkA5wIZAOSCJEIZwNmA5EIZgOTCJ0IBwZWA50IVgOUCIAIRwdMB4AITAd/CJ8InwNdA58IXQOWCKAIQAc9B6AIPQeXCIYITgdXB4YIVweFCIQIVgdVB4QIVQeHCKMIOwc6B6MIOgeZCJQIVgNBB5QIQQehCIwIRQdPB4wITweLCIIISgdSB4IIUgeNCIsITwdQB4sIUAeICJMIZgM+B5MIPgebCI0IUgdTB40IUweDCI8I3AdOB48ITgeGCIoITQdHB4oIRweACJIIZAMaB5IIGgeeCH4ISwdEB34IRAeBCJAI3QdUB5AIVAeOCGcHUQdQB2cHUAdmB2AHSgdEB2AHRAdaB1gHQgdXB1gHVwdtB1YHbAdrB1YHawdVB08HZQdmB08HZgdQB2EHSwdCB2EHQgdYB00HYwddB00HXQdHB0oHYAdoB0oHaAdSB9wH3gdkB9wHZAdOB1wHRgdMB1wHTAdiB18HSQdIB18HSAdeB14HSAdUB14HVAdqB1IHaAdpB1IHaQdTB0cHXQdiB0cHYgdMB0sHYQdaB0sHWgdEB0UHWwdlB0UHZQdPB90H3wdqB90HagdUB1kHQwdGB1kHRgdcB04HZAdtB04HbQdXB2wHVgdTB2wHUwdpB1sHcQd7B1sHewdlB98H4QeAB98HgAdqB28HWQdcB28HXAdyB2QHegeDB2QHgwdtB4IHbAdpB4IHaQd/B30HZwdmB30HZgd8B3YHYAdaB3YHWgdwB24HWAdtB24HbQeDB2wHggeBB2wHgQdrB2UHewd8B2UHfAdmB3cHYQdYB3cHWAduB2MHeQdzB2MHcwddB2AHdgd+B2AHfgdoB94H4Ad6B94HegdkB3IHXAdiB3IHYgd4B3UHXwdeB3UHXgd0B3QHXgdqB3QHageAB2gHfgd/B2gHfwdpB10Hcwd4B10HeAdiB2EHdwdwB2EHcAdaByQI4geQByQIkAc7CEEIlAeVB0EIlQc4CEAIiQeOB0AIjgcMCEcIjQeGB0cIhgc1CEYIhweRB0YIkQc0CCMI4weWByMIlgdCCDsIkAeZBzsImQcICAcImAeXBwcIlwdFCDQIkQeSBzQIkgdECDMIjweJBzMIiQdACA8IjAeUBw8IlAdBCGsIhAeZB2sImQdhCG4IjQeEB24IhAdrCHIIiAeOB3IIjgdnCHMIiweKB3MIigdoCGgIigeWB2gIlgdpCHYIhQeIB3YIiAdyCGIImAeVB2IIlQd0CGYIkweSB2YIkgdtCGUIjAeGB2UIhgd1CMEHJggRCMEHEQi5B7MHsAcLCLMHCwi9BwYIxQe/BwYIvwcTCCYIwQfnByYI5wcwCLEHsge2B7EHtgcbCL4HEggrCL4HKwjEByoIwwe3ByoItwccCLkHEQgQCLkHEAi4B8QHKwgTCMQHEwi/ByUIwAfpByUI6QcWCCcIwgfDBycIwwcqCOYHLwgKCOYHCgi8B7IHsQccCLIHHAi3B8MHoAesB8MHrAe3B8IHoQegB8IHoAfDB8UHngekB8UHpAe/B+QHswe9B+QHvQemB7MH5AepB7MHqQe6B6IHwQe5B6IHuQeqB6UHvgfEB6UHxAefB8AHoweaB8AHmgfpB6cHvAe7B6cHuweoB64HtQe2B64HtgetB+kHmgevB+kHrwe0B8EHogecB8EHnAfnB7oHqQeoB7oHqAe7B7UHrgerB7UHqwe4B6YHvQe0B6YHtAevB+gHmweeB+gHngfFB+UHsge3B+UHtwesB50H5ge8B50HvAenB0YINAh7B0YIewdxBzQIRAh8BzQIfAd7B30HfAdECH0HRAgNCOAHfQcNCOAHDQgkCCQIOwh6ByQIegfgBzsICAiDBzsIgwd6B24HgwcICG4HCAgOCLIGyAfHB7IGxwexBrMGyQfIB7MGyAeyBu0DzQfKB+0DygfsA+0D7gPOB+0DzgfNB+wDygfLB+wDywfvA/cD0gfQB/cD0AfwA7gGuQbVB7gG1QfUB88D0APRB88D0QfLB/ED0gfWB/ED1gfiAOIA1gfRB+IA0QfQA/8DqAPGB/8DxgfHB6YDpwPJB6YDyQfMB6UDpgPMB6UDzAfPB6QDpQPPB6QDzwfTB6MDpAPTB6MD0wfXB+YDowPXB+YD1wfUB+4DMwfYB+4D2AfOBzMHNwfZBzMH2QfYBzcHOwfaBzcH2gfZB7kGPwfbB7kG2wfVB4kIUQfcB4kI3AePCIcIVQfdB4cI3QeQCFEHZwfeB1EH3gfcB1UHawffB1UH3wfdB2sHgQfhB2sH4QffB2cHfQfgB2cH4AfeBw0IkwfiBw0I4gckCEUIlwfjB0UI4wcjCKMHwAfnB6MH5wecB58HxAe/B58HvwekB6oHuQe4B6oHuAerB7IH5QetB7IHrQe2B3cHbgcOCHcHDghHCEcINQhwB0cIcAd3B2II7gftB2II7QdsCGMI8AfvB2MI7wdtCGQI8wfyB2QI8gdvCGUI9Qf0B2UI9AdwCHcIAAj2B3cI9gdxCHAI9Af9B3AI/Qd0CG8I8gf4B28I+AdnCG4I8Qf+B24I/gd1CGoI6gfwB2oI8AdjCHgIAQj8B3gI/AdpCHEI9gfrB3EI6wdhCGYI9wcACGYIAAh3CGwI7QcBCGwIAQh4CIwHDwg1CIwHNQiGB3YHcAc1CHYHNQgPCA8IQQh+Bw8Ifgd2B0EIOAh/B0EIfwd+B4IHfwc4CIIHOAgHCAcIRQiBBwcIgQeCB4oHQwhCCIoHQgiWB+EHgQdFCOEHRQgjCLwHCggeCLwHHgi7BxYI6Qe0BxYItAcZCJgHBwg4CJgHOAiVBxUI6AfFBxUIxQcGCI0HRwgOCI0HDgiEB4sHOQhDCIsHQwiKByMIQgiAByMIgAfhB4gHOggMCIgHDAiOB3QHgAdCCHQHQghDCJMHDQhECJMHRAiSB4QHDggICIQHCAiZB3UHdAdDCHUHQwg5CIUHCQg6CIUHOgiIBzMIQAhzBzMIcwd5B0AIDAh4B0AIeAdzB3IHeAcMCHIHDAg6CG8Hcgc6CG8HOggJCLUHGggbCLUHGwi2B7AHswe6B7AHugcdCB0Iuge7Bx0IuwceCMAHJQgwCMAHMAjnBx0IHggFCB0IBQgECL0HCwgZCL0HGQi0B7AHHQgECLAHBAgtCC0IPQgLCC0ICwiwBz0IAwgZCD0IGQgLCBYIGQgDCBYIAwgyCCUIFggyCCUIMggoCCgIPwgwCCgIMAglCCYIMAg/CCYIPwgpCCkIIggRCCkIEQgmCCIIIQgQCCIIEAgRCBoIEAghCBoIIQgCCBoItQe4BxoIuAcQCAIINwgbCAIIGwgaCLEHGwg3CLEHNwguCC4INggcCC4IHAixByoIHAg2CCoINggXCCcIKggXCCcIFwgUCB8IGAgrCB8IKwgSCBgIIAgTCBgIEwgrCAYIEwggCAYIIAgsCBUIBggsCBUILAgxCD4IPAgKCD4ICggvCDwIBQgeCDwIHggKCF0IXgg2CF0INgguCFcIVQgFCFcIBQg8CJsHnQfqB5sH6gf/B1EIXQguCFEILgg3CFIIUQg3CFIINwgCCJsH6AfmB5sH5gedB1YIVQhKCFYISghJCFkIWwhKCFkISghICD4ILwgVCD4IFQgxCE0IVghJCE0ISQhLCFgITQhLCFgISwhMCFQIPwgoCFQIKAhMCEsISQhaCEsIWghTCOgHFQgvCOgHLwjmB0kISghbCEkIWwhaCFMIWghPCFMITwhfCEgISghVCEgIVQhXCAQIBQhVCAQIVQhWCC0IBAhWCC0IVghNCD0ILQhNCD0ITQhYCE8ITgheCE8IXghdCFAITghbCFAIWwhZCEwISwhTCEwIUwhUCDEILAhICDEISAhXCCwIIAhZCCwIWQhICFoIWwhOCFoITghPCFgIMggDCFgIAwg9CBQIFwhcCBQIXAgfCFAIWQggCFAIIAgYCFwIXghOCFwITghQCFQIUwhfCFQIXwhgCBcINgheCBcIXghcCGAIXwhRCGAIUQhSCF8ITwhdCF8IXQhRCGAIKQg/CGAIPwhUCEwIKAgyCEwIMghYCAIIIQgiCAIIIghSCFIIIggpCFIIKQhgCOwHawhhCOwHYQjrB/EHbghrCPEHawjsB/kHcghnCPkHZwj4B/sHcwhoCPsHaAj6B/oHaAhpCPoHaQj8B/8HdghyCP8Hcgj5B+4HYgh0CO4HdAj9B/cHZghtCPcHbQjvB/UHZQh1CPUHdQj+B5gHYghsCJgHbAiXB5EHYwhtCJEHbQiSB48HZAhvCI8HbwiJB4wHZQhwCIwHcAiUB+IHdwhxCOIHcQiQB5QHcAh0CJQHdAiVB4kHbwhnCIkHZwiOB40Hbgh1CI0HdQiGB4cHaghjCIcHYwiRB+MHeAhpCOMHaQiWB5AHcQhhCJAHYQiZB5MHZgh3CJMHdwjiB5cHbAh4CJcHeAjjB/cH7weoB/cHqAepBwAI9wepBwAIqQfkB+QHpgf2B+QH9gcACKYHrwfrB6YH6wf2B+wH6wevB+wHrweaB/EH7AeaB/EHmgejB6MHnAf+B6MH/gfxB/UH/gecB/UHnAeiB6IHqgf0B6IH9Af1B6oHqwf9B6oH/Qf0B+4H/QerB+4HqweuB64HrQftB64H7QfuBwEI7QetBwEIrQflB+UHrAf8B+UH/AcBCPoH/AesB/oHrAegB/sH+gegB/sHoAehB6UHnwfyB6UH8gfzB58HpAf4B58H+AfyB/kH+AekB/kHpAeeB/8H+QeeB/8HngebB50HpwfwB50H8AfqB6cHqAfvB6cH7wfwB0MHewh6CEMHeghGB0kHeQh8CEkHfAhIB0sHfgh9CEsHfQhCB5UIgAh/CJUIfwieCEoHggiBCEoHgQhEB1YHhAiDCFYHgwhTB28HCQhGCG8HRghxB5gIhgiFCJgIhQihCKAIhAiHCKAIhwiiCFEHiQiICFEHiAhQB0IHfQiFCEIHhQhXB5oIjAiLCJoIiwilCJ8IggiNCJ8IjQimCKUIiwiICKUIiAiZCAkIhQeHBwkIhwdGCEgHfAiOCEgHjghUB6YIjQiDCKYIgwiXCKcIjwiGCKcIhgiYCKQIigiACKQIgAiVCEYHegh/CEYHfwhMB50IfgiBCJ0IgQiWCKgIkAiOCKgIjgibCKMIiQiPCKMIjwinCKIIhwiQCKIIkAioCHsInAiSCHsIkgh6CHkIkQiTCHkIkwh8CH4InQiUCH4IlAh9CIIInwiWCIIIlgiBCIQIoAiXCIQIlwiDCIkIowiZCIkImQiICH0IlAihCH0IoQiFCHwIkwibCHwImwiOCHoIkgieCHoIngh/CB8IEggnCB8IJwgUCGUDlQieCGUDnggaB2oIhweFB2oIhQd2CDgHmAihCDgHoQhBB0AHoAiiCEAHogg/B2MDmgilCGMDpQg5B58DnwimCJ8Dpgg8BzkHpQiZCDkHmQg6B2oIdgj/B2oI/wfqBzwHpgiXCDwHlwg9B9oHpwiYCNoHmAg4ByUHpAiVCCUHlQhlAwcGnQiWCAcGlghdA9sHqAibCNsHmwg+BzsHowinCDsHpwjaBz8HogioCD8HqAjbB1wIUAgYCFwIGAgfCDEIVwg8CDEIPAg+CMIHJwgSCMIHEgi+B6EHwge+B6EHvgelB6UH8wf7B6UH+wehB3MI+wfzB3MI8wdkCGQIjweLB2QIiwdzCDkIiwePBzkIjwczCHUHOQgzCHUHMwh5B18HdQd5B18HeQdjB2MHTQdJB2MHSQdfB3kISQdNB3kITQeKCJEIeQiKCJEIigikCKQIJQdnA6QIZwORCCUHJwewAyUHsANnA+gDsAMnB+gDJwctBy0HJgexAy0HsQPoAyYHKgeyAyYHsgOxA3EHWwdZB3EHWQdvB0MHWQdbB0MHWwdFB3sIQwdFB3sIRQeMCJwIewiMCJwIjAiaCJoIYwNcA5oIXAOcCFcDXANjA1cDYwPOAxcHVwPOAxcHzgPrA1oDFwfrA1oD6wPNA1sDWgPNA1sDzQPMAxUHWwPMAxUHzANoA1gDFQdoA1gDaANrA1kDWANrA1kDawNpAxkHWQNpAxkHaQMVBBgHGQcVBBgHFQT8AxYHGAf8AxYH/ANqAyoHKQezAyoHswOyAykHKAe0AykHtAOzAygHLAe1AygHtQO0AxIEtQMsBxIELAcvBy8HLgf9Ay8H/QMSBC4HKwe2Ay4HtgP9AwAAqgipCAAAqQgBAB8ErAirCB8EqwggBB4ErQisCB4ErAgfBB0ErgitCB0ErQgeBBwErwiuCBwErggdBCwEsAipCCwEqQgbBDIEsgixCDIEsQgxBGYAtQi0CGYAtAg/ADEEsQi2CDEEtggwBAwGwwizCAwGswgrBDAEtgi0CDAEtAgvBCkEuQi4CCkEuAgqBDMEtQi6CDMEugguBCgEuwi5CCgEuQgpBC4Eugi8CC4EvAgtBC0EvAiwCC0EsAgsBCUEvwi+CCUEvggmBAsGxAi3CAsGtwgkBCIEwQjACCIEwAgjBBoEqgivCBoErwgcBCEEwgjBCCEEwQgiBCAEqwjCCCAEwgghBCEAvwi3CCEAtwgeACoEuAjDCCoEwwgMBiMEwAjECCMExAgLBikAvQi+CCkAvggkACwAuwi9CCwAvQgpAEgAsgizCEgAswg1AAwOCw7GCAwOxgjFCMkIygjICMkIyAjHCA0OzAjHCA0OxwgMDswIzQjJCMwIyQjHCM8I0AjNCM8IzQjMCA4OzwjMCA4OzAgNDtII0wjQCNII0AjPCA8O0gjPCA8OzwgODtUI1gjTCNUI0wjSCBAO1QjSCBAO0ggPDtgI2QjWCNgI1gjVCBEO2AjVCBEO1QgQDtsI3AjZCNsI2QjYCBIO2wjYCBIO2AgRDt4I3wjcCN4I3AjbCBMO3gjbCBMO2wgSDuEI4gjfCOEI3wjeCBQO4QjeCBQO3ggTDlgOVw7iCFgO4gjhCIoOWA7hCIoO4QgUDuoI6wjoCOoI6AjnCBcO6gjnCBcO5wgWDhoO8wjwCBoO8AgZDvMI8gjvCPMI7wjwCBsO9gjzCBsO8wgaDvYI9QjyCPYI8gjzCIsOWg72CIsO9ggbDloOXA71CFoO9Qj2CB0O+wjGCB0OxggLDv0I/AjICP0IyAjKCAAJ/wj8CAAJ/Aj9CB4O/gj7CB4O+wgdDgMJAgn/CAMJ/wgACR8OAQn+CB8O/ggeDioJKQkCCSoJAgkDCSQOKwkBCSQOAQkfDgkJCAkFCQkJBQkGCSEOBwkECSEOBAkgDgwJCwkICQwJCAkJCSIOCgkHCSIOBwkhDg8JDgkLCQ8JCwkMCSMODQkKCSMOCgkiDjEONg7oCDEO6AjrCI0ONQ71CI0O9QhcDjUOMw7yCDUO8gj1CDMOFAkTCTMOEwkyDowOLw7iCIwO4ghXDi8OLQ7fCC8O3wjiCC0OLA7cCC0O3AjfCCwOKw7ZCCwO2QjcCCsOKg7WCCsO1gjZCCoOKQ7TCCoO0wjWCD4OKA7NCD4OzQjQCDwOPQ7KCDwOygjJCD0OOw79CD0O/QjKCCgOPA7JCCgOyQjNCCYOJw4DCSYOAwkACTsOJg4ACTsOAAn9CCkOFwkhCSkOIQk+DjkOOg4JCTkOCQkGCToOOA4MCToODAkJCTgOJQ4PCTgODwkMCTcOLAklCTcOJQk5DgYJBQkpCQYJKQkqCSAOBAkrCSAOKwkkDicOJAksCScOLAk3DjEJLQklCTEJJQksCS0JLgkmCS0JJgklCS4JLwknCS4JJwkmCS8JMAkoCS8JKAknCTsJNwkyCTsJMgk2CTgJOQk0CTgJNAkzCTkJOgk1CTkJNQk0CTcJOAkzCTcJMwkyCUEJPQk3CUEJNwk7CT0JPgk4CT0JOAk3CT4JPwk5CT4JOQk4CT8JQAk6CT8JOgk5CUcJQwk9CUcJPQlBCTwJQAlGCTwJRglCCUMJRAk+CUMJPgk9CUQJRQk/CUQJPwk+CUUJRglACUUJQAk/CYgAhABDCYgAQwlHCUIJRgmHAEIJhwCDAIQAhQBECYQARAlDCYUAhgBFCYUARQlECYYAhwBGCYYARglFCRMJFAlMCRMJTAlLCU0JTAkUCU0JFAkVCV8OTQkVCV8OFQldDkkJSAkQCUkJEAkRCVIJUQkZCVIJGQkaCVQJUwkbCVQJGwkcCVEJUAkYCVEJGAkZCVMJUgkaCVMJGgkbCVAJTwkXCVAJFwkYCVkJWAkgCVkJIAkhCVoJWwkjCVoJIwkiCVgJVgkeCVgJHgkgCVcJWgkiCVcJIgkfCVsJXAkkCVsJJAkjCVYJVwkfCVYJHwkeCTEJLAkkCTEJJAlcCRcJTwlZCRcJWQkhCTYJYwlkCTYJZAk7CTsJZAllCTsJZQlBCUEJZQlmCUEJZglHCUcJZgmpAEcJqQCIAHEJcglsCXEJbAlrCW4JcQlrCW4JawloCW8JbQlnCW8JZwlpCXAJbwlpCXAJaQlqCW0JbgloCW0JaAlnCWMJbAlyCWMJcglkCX8Jfgl2CX8Jdgl3CX4JeQldCX4JXQl2CYAJfwl3CYAJdwl4CXkJegleCXkJXgldCXoJewlfCXoJXwleCWoJXwl7CWoJewlwCYsJiglvCYsJbwlwCXAJewmQCXAJkAmLCYkJjAlxCYkJcQluCYwJjQlyCYwJcglxCZQJkwl+CZQJfgl/CZMJjgl5CZMJeQl+CZUJlAl/CZUJfwmACY4Jjwl6CY4Jegl5CYgJiQluCYgJbgltCWQOlQmACWQOgAliDo8JkAl7CY8Jewl6CYoJiAltCYoJbQlvCWQJcgmNCWQJjQllCWUJjQmYCWUJmAlmCWYJmAncAGYJ3ACpAJwJmwmKCZwJigmLCZsJmQmICZsJiAmKCZkJmgmJCZkJiQmICaMJpAmeCaMJngmMCZ8JoAmaCZ8JmgmZCYwJngmYCYwJmAmNCaIJoQmbCaIJmwmcCaQJ6gDjAKQJ4wCeCaEJnwmZCaEJmQmbCaUJpgmkCaUJpAmjCaYJ7QDqAKYJ6gCkCesO6g6pCesOqQmqCeoO7A6nCeoOpwmpCewO7Q6oCewOqAmnCbgJtwmUCbgJlAmVCbYJswmOCbYJjgmTCbcJtgmTCbcJkwmUCbQJtQmQCbQJkAmPCWYOuAmVCWYOlQlkDrMJtAmPCbMJjwmOCbsJvAm1CbsJtQm0CboJuwm0CboJtAmzCb0JugmzCb0Jswm2CZwJiwmQCZwJkAm1CZwJtQm8CZwJvAmiCe4O7w7ACe4OwAm/CesO7w7GCesOxgmwCccOzw7ACccOwAmqCfQO2QvFCfQOxQnuDuEL4AszDOELMww0DCYB2gnyCyYB8gssBs4JzwnNCc4JzQnMCWkOaA7PCWkOzwnOCYMJzQnPCYMJzwmGCWgOYw6GCWgOhgnPCdcJ2AnyC9cJ8gtSDiMB2AmFCSMBhQnJAIUJ2AnXCYUJ1wmECVIO8gvaCVIO2gnZCSwG8gvYCSwG2AkjAYIJ0QlRDoIJUQ6HCYQJ1wnNCYQJzQmDCcgJyQneCcgJ3gndCf8J7gntCf8J7QkACt8J4AnkCd8J5AnjCd0J3gniCd0J4gnhCTMB5AngCTMB4AkuAeMJ5AnoCeMJ6AnnCeEJ4gnmCeEJ5gnlCTgB6AnkCTgB5AkzAecJ6AnsCecJ7AnrCeUJ5gnqCeUJ6gnpCT0B7AnoCT0B6Ak4AfwJ0wkVCvwJFQoWCtQJ7wn9CdQJ/Qn8CRoKGQrICRoKyAn2CfMJ8gnxCfMJ8QnwCfQJ9QnyCfQJ8gnzCd0J9wn2Cd0J9gnICeEJ+An3CeEJ9wndCeUJ+Qn4CeUJ+AnhCekJ+gn5CekJ+QnlCdMJ+wn6CdMJ+gnpCfwJ/Qn7CfwJ+wnTCdQJ9Qn0CdQJ9AnvCe0J7gnyCe0J8gn1Ce4J1QnxCe4J8QnyCdwFKQHcCdwF3AlCDhkK8QnVCRkK1QkcCssJAQrOCcsJzgnMCWkOaw4CCmkOAgrQCdAJAgoDCtAJAwrSCRQK7Qn1CRQK9QnUCU8OUA6eDk8Ong6dDusJ7AkFCusJBQoEClcBBQrsCVcB7Ak9Ae8J9AkJCu8JCQoGCgYKEAr9CQYK/QnvCfkJ+gkOCvkJDgoNCvYJ9wkLCvYJCwoKCggKCQr0CQgK9AnzCfcJ+AkMCvcJDAoLChoK9gkKChoKCgobCvoJ+wkPCvoJDwoOCgcKCArzCQcK8wnwCRAKDwr7CRAK+wn9CfgJ+QkNCvgJDQoMCu4FUw4FCu4FBQpXASYKGAodCiYKHQonCkIKQwofCkIKHwogCtMJ6QnqCdMJ6gkVChYKFArUCRYK1An8CfAJ8QkZCvAJGQoaCsgJGQocCsgJHArJCfAJGgobCvAJGwoHCkEKQgogCkEKIAoiCscBcwoTCscBEwpqAfwGVQ9TDvwGUw7uBQ4KDwozCg4KMwoyCiwKLQoJCiwKCQoICjQKMwoPCjQKDwoQCgYKCQotCgYKLQoqCgoKCwovCgoKLwouCgsKDAowCgsKMAovCioKNAoQCioKEAoGCjUKKwoHCjUKBwobCgwKDQoxCgwKMQowChsKCgouChsKLgo1Cg0KDgoyCg0KMgoxCisKLAoICisKCAoHCjgKNgorCjgKKwo1CjYKNwosCjYKLAorCjsKOQo2CjsKNgo4CjkKOgo3CjkKNwo2CjgKNQouCjgKLgovCiwKNwoqCiwKKgotCioKNwo6CioKOgo0CjoKMgozCjoKMwo0CjkKMQoyCjkKMgo6CjsKMAoxCjsKMQo5CjgKLwowCjgKMAo7CiIKIAo9CiIKPQo8CiAKHwo+CiAKPgo9ChgKRQpEChgKRAodClYPVQ5TDlYPUw5VD0UKSApKCkUKSgpJCkkKSgpMCkkKTApLCpQKkwpOCpQKTgpNCk0KTgpQCk0KUApPCk8KUApSCk8KUgpRClYKVwpUClYKVApTCpYKlwpXCpYKVwpWClwKXQpaClwKWgpZCl8KYApdCl8KXQpcCmQKZQpmCmQKZgpnCmsKYgppCmsKaQpqClUKRApFClUKRQpJCksKWApVCksKVQpJCpQKlQpYCpQKWApLCk8KXgpbCk8KWwpNClEKYQpeClEKXgpPCh4KPwpACh4KQAoXCpgKZApnCpgKZwqZCmIKYwpoCmIKaAppCkEKZgplCkEKZQpCChIKbwp0ChIKdAoRCl0PXg9tCl0PbQpsCmcPXw9uCmcPbgqaClcPWA9UDlcPVA6UDmoPYA9HCmoPRwpTD5wKdwpyCpwKcgqbCnUKdgpxCnUKcQpwCp0Kegp3Cp0KdwqcCngKeQp2CngKdgp1Cp4KfQp6Cp4KegqdCnsKfAp5CnsKeQp4Cv0B1AF9Cv0BfQqeCtIB0wF8CtIBfAp7CmgPXw9yCmgPcgp/CncKgAp/CncKfwpyCnoKgQqACnoKgAp3Cn0KggqBCn0KgQp6CtQB2gGCCtQBggp9CmAPXQ9sCmAPbApHCnAKRgp0CnAKdAp1Cm8KeAp1Cm8KdQp0CngKbwpzCngKcwp7CscB0gF7CscBewpzCoUKhgplCoUKZQpkCoMKhApjCoMKYwpiCp8KhQpkCp8KZAqYCkIKZQqGCkIKhgpDCogKQwqGCogKhgqMCoUKiwqMCoUKjAqGCp8KoAqLCp8KiwqFCqAKnwqECqAKhAqKCoMKiQqKCoMKigqECqEKkQqLCqEKiwqgCpEKkgqMCpEKjAqLClAPjQqHClAPhwpPD4gKjAqSCogKkgqOCo8KkAqKCo8KigqJCksKTAqTCksKkwqUClkKWgqXClkKlwqWCk0KWwqVCk0KlQqUCmMKmAqZCmMKmQpoCl4PZw+aCl4PmgptCnYKnAqbCnYKmwpxCnkKnQqcCnkKnAp2CnwKngqdCnwKnQp5CtMB/QGeCtMBngp8CoQKnwqYCoQKmApjCokKgwqnCokKpwqmCpAKoQqgCpAKoAqKCqYKpQqPCqYKjwqJCn8KgAqiCn8KogqjCoAKgQqpCoAKqQqiCmgPfwqjCmgPowpmD6YKpwq2CqYKtgq1CmsKpwqDCmsKgwpiCoIK2gEIAoIKCAKoCoEKggqoCoEKqAqpCqwKrQpgCqwKYApfCqUKCwLtAaUK7QGPCqoKrgphCqoKYQpRCqMKogqxCqMKsQqyCq8KsAprCq8KawpqCrUKtgrFCrUKxQrECqkKqAq3CqkKtwq4CrUKtAqlCrUKpQqmCqIKqQq4CqIKuAqxCrAKtgqnCrAKpwprCmYPowqyCmYPsgplD1EKUgqrClEKqwqqCrEKuArHCrEKxwrACrgKtwrGCrgKxgrHCsQKwwq0CsQKtAq1CmUPsgrBCmUPwQpcD74KvwqwCr4KsAqvCrkKvQquCrkKrgqqCqoKqwq6CqoKugq5CrIKsQrACrIKwArBCtQK0wrECtQKxArFCr8KxQq2Cr8KtgqwCrsKvAqtCrsKrQqsCs4K1ArFCs4KxQq/CsoKywq8CsoKvAq7CsYKKgI7AsYKOwLVCsAKxwrWCsAK1grPCscKxgrVCscK1QrWCtMK0grDCtMKwwrEClwPwQrQClwP0ApbD80Kzgq/Cs0Kvwq+CsgKzAq9CsgKvQq5CrkKugrJCrkKyQrICsEKwArPCsEKzwrQCtMK1ArjCtMK4wriCvIK8QriCvIK4grjCt0K4wrUCt0K1ArOCtkK2grLCtkKywrKCtUKOwJMAtUKTALkCs8K1grlCs8K5QreCtYK1QrkCtYK5ArlCuIK4QrSCuIK0grTClsP0ArfClsP3wpaD9wK3QrOCtwKzgrNCtcK2wrMCtcKzArICsgKyQrYCsgK2ArXCiwLOwu1AiwLtQKkAtAKzwreCtAK3grfCuYK6grbCuYK2wrXCtcK2ArnCtcK5wrmCh0LLAukAh0LpAKTAt8K3grtCt8K7QruCvEK8goBC/EKAQsAC+wK8grjCuwK4wrdCpMCggIOC5MCDgsdC+gK6QraCugK2grZCuQKTAJdAuQKXQLzCoICcQL/CoIC/woOC94K5Qr0Ct4K9ArtCuUK5ArzCuUK8wr0CvEK8ArhCvEK4QriCloP3wruCloP7gpZD+sK7ArdCusK3QrcCvMKXQJuAvMKbgICC/8KcQJgAv8KYALwCu0K9AoDC+0KAwv8CvQK8woCC/QKAgsDCwAL/wrwCgAL8ArxClkP7gr9ClkP/QpkD/oK+wrsCvoK7ArrCvUK+QrqCvUK6grmCuYK5wr2CuYK9gr1Ck8C4QrwCk8C8ApgAu4K7Qr8Cu4K/Ar9ChALDwsACxALAAsBC/sKAQvyCvsK8grsCuEKTwI+AuEKPgLSCvcK+ArpCvcK6QroCgoLEAsBCwoLAQv7CtIKPgItAtIKLQLDCgYLBwv4CgYL+Ar3CgILbgJ/AgILfwIRC8MKLQIcAsMKHAK0CvwKAwsSC/wKEgsLCwMLAgsRCwMLEQsSCw8LDgv/Cg8L/woAC2QP/QoMC2QPDAtjDwkLCgv7CgkL+wr6CgQLCAv5CgQL+Qr1CvUK9goFC/UKBQsEC/0K/AoLC/0KCwsMCxALHwseCxALHgsPCy0LHgsfCy0LHwsuCxkLHwsQCxkLEAsKC5EK7wHwAZEK8AGSChULFgsHCxULBwsGCxELfwKQAhELkAIgCwsLEgshCwsLIQsaCxILEQsgCxILIAshCx4LHQsOCx4LDgsPC2MPDAsbC2MPGwtiDxgLGQsKCxgLCgsJCxMLFwsICxMLCAsECwQLBQsUCwQLFAsTCwECoQqQCgECkAruAQwLCwsaCwwLGgsbCyALkAKhAiALoQIvCxoLIQswCxoLMAspCyELIAsvCyELLwswCy0LLAsdCy0LHQseC2IPGwsqC2IPKgthDycLKAsZCycLGQsYCyILJgsXCyILFwsTCxMLFAsjCxMLIwsiCxsLGgspCxsLKQsqCzwLLQsuCzwLLgs9CygLLgsfCygLHwsZC1AP9wbrAVAP6wGNCiQLJQsWCyQLFgsVCzELNQsmCzELJgsiCyILIwsyCyILMgsxCyoLKQs4CyoLOAs5CzcLPQsuCzcLLgsoCzMLNAslCzMLJQskCy8LoQKyAi8LsgI+CykLMAs/CykLPws4CzALLws+CzALPgs/CzwLOwssCzwLLAstC2EPKgs5C2EPOQtsDzYLNwsoCzYLKAsnC0ULRgs3C0ULNws2C0sLPAs9C0sLPQtMCzsLSgvGAjsLxgK1AkALRAs1C0ALNQsxCzELMgtBCzELQQtACzoLSQtBCzoLQQsyC0YLTAs9C0YLPQs3C0ILQws0C0ILNAszCz4LsgLDAj4LwwJNCzgLPwtOCzgLTgtHCz8LPgtNCz8LTQtOCzwLSwtKCzwLSgs7C2wPOQtIC2wPSAtrD0gLOQs4C0gLOAtHC2sPQAtBC2sPQQtJC0ULRAtAC0ULQAtGC+0O+Q6xCe0OsQmoCVsLWguHClsLhwqNClALKAopClALKQpcCzwKPQphCzwKYQtgCz8KUwpUCj8KVApACmELPQo+CmELPgpZC10LbQtvC10LbwteC2oLaQvtC2oL7QvsC3ELcgtwC3ELcAtuC3MLdAtyC3MLcgtxC3ULdgt0C3ULdAtzC3cLeAt2C3cLdgt1C3kLegt4C3kLeAt3C3sLfAt6C3sLegt5C38LgAt+C38Lfgt9C4ELgguAC4ELgAt/C4MLhAuCC4MLgguBC4ULhguEC4ULhAuDC4cLiAuGC4cLhguFC4kLiguIC4kLiAuHC2kLaAvuC2kL7gvtC0YMRQyQC0YMkAuRC5ELkAuTC5ELkwuUC5QLkwuWC5QLlguXC5cLlguZC5cLmQubC54LmgunC54LpwulC6QLoAulC6QLpQufC5sLmQudC5sLnQufC58LnQuiC58LogukC6MLngulC6MLpQugC58LpQunC58LpwubC5oLnAuYC5oLmAtyDJ0LIgMoA50LKAOiC4cLjguPC4cLjwuJC4ULjQuOC4ULjguHC4MLjAuNC4MLjQuFC5MLEwMXA5MLFwOWC2sLagvsC2sL7AvrC7AJrwnqDrAJ6g7rDm4LfguAC24LgAtxC3ELgAuCC3ELggtzC3MLgguEC3MLhAt1C3ULhAuGC3ULhgt3C3cLhguIC3cLiAt5C3kLiAuKC3kLigt7C3ILdAuqC3ILqgupC3oLfAuuC3oLrgutC3gLegutC3gLrQusC3YLeAusC3YLrAurC3QLdgurC3QLqwuqC6kLqguwC6kLsAuvC60Lrgu0C60LtAuzC6oLqwuxC6oLsQuwC6sLrAuyC6sLsguxC6wLrQuzC6wLswuyC68LsAu2C68Ltgu1C7MLtAu6C7MLugu5C7ALsQu3C7ALtwu2C7ELsgu4C7ELuAu3C7ILswu5C7ILuQu4C7ULtgu8C7ULvAu7C7kLugvAC7kLwAu/C7YLtwu9C7YLvQu8C7cLuAu+C7cLvgu9C7gLuQu/C7gLvwu+C7sLvAvCC7sLwgvBC78LwAvGC78LxgvFC7wLvQvDC7wLwwvCC70LvgvEC70LxAvDC74LvwvFC74LxQvEC8ELwgvIC8ELyAvHC8ULxgvMC8ULzAvLC8ILwwvJC8ILyQvIC8MLxAvKC8MLygvJC8QLxQvLC8QLywvKC18MYAxRA18MUQNQA20MXgxVA20MVQNUA2AMbAxSA2AMUgNRA2wMawxTA2wMUwNSA2sMbQxUA2sMVANTAzIMfgxwDzIMcA/QC34MYgxvD34Mbw9wDzAMMQzPCzAMzwttD1YMLgzRC1YM0QtuDzEMMgzQCzEM0AvPCy4MLwzSCy4M0gvRC/AO1gvVC/AO1QvxDvEO1QvYC/EO2AvyDjgMQww7DDgMOww6DPoObQ7WC/oO1gvwDhYMFwwdDBYMHQwcDPIO2AvZC/IO2Qv0Dt8L4Qs0DN8LNAw3DDoM3ws3DDoMNww4DB0MFwwYDB0MGAweDPUO7QvuC/UO7gv2DnILqQvkC3IL5AtwC68L5QvkC68L5AupC7UL5gvlC7UL5QuvC7sL5wvmC7sL5gu1C8EL6AvnC8EL5wu7C8cL6QvoC8cL6AvBC5cJ9Qv0C5cJ9AuRCV4OYA5UCV4OVAkcCUkJdAn2C0kJ9gtICW4OYA5VCW4OVQn3C24OYg6ACW4OgAl4CfgL+Qv2C/gL9gt0CfQL+Qv4C/QL+AuRCU8JXwlqCU8JaglZCVIJdgldCVIJXQlRCTEJNgkyCTEJMgktCVQJeAl3CVQJdwlTCVoJawlsCVoJbAlbCS4JMwk0CS4JNAkvCVYJZwloCVYJaAlXCVAJXglfCVAJXwlPCS0JMgkzCS0JMwkuCVMJdwl2CVMJdglSCVsJbAljCVsJYwlcCVcJaAlrCVcJawlaCVkJaglpCVkJaQlYCTYJMQlcCTYJXAljCVEJXQleCVEJXglQCVgJaQlnCVgJZwlWCS8JNAk1CS8JNQkwCWgL/gv/C2gL/wvuC/YO7gv/C/YO/wv3DpYLFwMcA5YLHAOZCyIDnQuZCyIDmQscA14LBQwGDF4LBgxdCwEMCAwJDAEMCQwDDAcMCQwIDAcMCAwADOoLBAwDDOoLAwwJDOoLCQwHDOoLBwxsC5ILCgwLDJILCwyVC6cLmgtyDKcLcgxzDJsLpwtzDJsLcwyXC6ELngujC6ELowumC54LoQucC54LnAuaCwoMDQwMDAoMDAwLDEkMBwwADEkMAAxIDEkMCgySC0kMkgtKDAIM6wvsCwIM7AtmC28MbgyLC28MiwsODIwLDwwQDIwLEAyNC40LEAwRDI0LEQyOC44LEQwSDI4LEgyPC04Miwt9C04MfQtQDEwMbgtwC0wMcAtLDE8MDgyLC08MiwtODEwM/gtoC0wMaAtNDFAMfQt+C1AMfgtNDEcMSwxwC0cMcAvkCy0MVgxuDy0Mbg/OC9sLLQzOC9sLzgvTC2wOzQvWC2wO1gttDmIMxAMWB2IMFgdvDy8MMAxtDy8MbQ/SC/4L1AvXC/4L1wv/CyoMKwxzDyoMcw92D1EMRwzkC1EM5AvlCx4PZAyhAx4PoQPCBhwQGxBpDBwQaQx4DB0QHBB4DB0QeAwaDBsP6AvpCxsP6QscDxoP5wvoCxoP6AsbDxkP5gvnCxkP5wsaDx8P5QvmCx8P5gsZD3QMdwzpC3QM6QvHCx0MHgwkDB0MJAwjDGgMrwO2A2gMtgNnDBwMHQwjDBwMIwwiDB8MIAwmDB8MJgwlDFMMHAwiDFMMIgxUDB4MHwwlDB4MJQwkDIIPfA8oDIIPKAxVDH8Pfg8rDH8PKwwqDIAPfw8qDIAPKgwpDIMPKwe9A4MPvQNjDHwPgA8pDHwPKQwoDH4PgQ8sDH4PLAwrDHMPcg8yDHMPMgwxDHgPdA8uDHgPLgxWDHYPcw8xDHYPMQwwDHcPdg8wDHcPMAwvDHkPIQfEA3kPxANiDHQPdw8vDHQPLwwuDGoMZQxsA2oMbANtAzUMNAwzDDUMMwziC68JOQw9DK8JPQytCTYMsAnGCTYMxgnHCTYMOQyvCTYMrwmwCYEMMwzgC4EM4At/DB4MGAwZDB4MGQwfDB8MGQwaDB8MGgwgDPgOmQb7APgO+wCyCT0MPgyuCT0MrgmtCfkO+A6yCfkOsgmxCSEQHhA5DCEQOQw2DCEQNgzHCSEQxwkiEBoMeAx9DBoMfQwgDEQMQww4DEQMOAxBDEEMOAw3DEEMNwxCDB4QHxA9DB4QPQw5DG8LbQtFDG8LRQxGDHgMaQxoDHgMaAx9DAoMSQxIDAoMSAwNDAcMSQxKDAcMSgxsC2oLTgxQDGoLUAxpC/4LTAxLDP4LSwxnC2sLTwxODGsLTgxqC24LTAxNDG4LTQx+C2kLUAxNDGkLTQxoC+MLZwtLDOMLSwxHDBQM4wtHDBQMRwxRDBgPUQzlCxgP5QsfDxsMUwxUDBsMVAwhDH0Pgg9VDH0PVQwnDHUPeA9WDHUPVgwtDEEMQgxYDEEMWAxZDEEMWQxaDEEMWgxEDGkMqAOvA2kMrwNoDEIMNQxbDEIMWwxYDCUQ0AfyAyUQ8gNcDHkMgAxrDHkMawxsDGwDZQxmDGwDZgxqAycQUgwVDCcQFQwoEHYMgwxdDHYMXQziC6AJpQmjCaAJowmaCVwM8gPSA1wM0gNADH0MaAxnDH0MZwx8DOILXQxbDOILWww1DIIMeQxsDIIMbAxgDHoPeQ9iDHoPYgx+DEIMNww0DEIMNAw1DGEMagxtA2EMbQPwA3UMegxeDHUMXgxtDHQMggxgDHQMYAxfDIQPgw9jDIQPYwx7DFADoQNkDFADZAxfDIAMdQxtDIAMbQxrDHYMgQxlDHYMZQxqDB8QWwxdDB8QXQwkEIkJmgmjCYkJowmMCR8KTw+HCh8Khwo+CloLWQs+CloLPgqHCmILWwvUAmIL1ALdAgEMBQxeCwEMXgsIDAgMXgtvCwgMbwsADEYMSAwADEYMAAxvC0gMRgyRC0gMkQsNDJQLDAwNDJQLDQyRC5ALDwMTA5ALEwOTC0UM2gMPA0UMDwOQC9oDRQxtC9oDbQsMAwwDbQtdCwwDXQvrAgYM3ALrAgYM6wJdC48O+w78C48O/As0DykPKA8DDCkPAwwEDCgPJw8BDCgPAQwDDCcPJg8FDCcPBQwBDCYPJQ8GDCYPBgwFDNAJ0glRDtAJUQ7RCXEMcAxuDHEMbgxvDH0LiwtuDH0Lbgx/C38LbgxwDH8LcAyBCwsMcgyYCwsMmAuVCwwMcwxyDAwMcgwLDJcLcwwMDJcLDAyUC3EMDwyMC3EMjAtwDIELcAyMC4ELjAuDCyEM3gvdCyEM3QsbDHsPfQ8nDHsPJwzcC1UMKAx0D1UMdA94D0AMPwydCUAMnQlcDD8Mrgk+DD8MPgydCV8MZAx3DF8Mdwx0DGUMgQx/DGUMfwxmDMkLyguADMkLgAx5DGoMYQyDDGoMgwx2DCAMfQx8DCAMfAwmDMgLyQt5DMgLeQyCDHIPeg9+DHIPfgwyDMsLzAt6DMsLegx1DMcLyAuCDMcLggx0DIEPhA97DIEPewwsDMoLywt1DMoLdQyADOILMwyBDOILgQx2DCUQKRCDDCUQgwxhDCkQJBBdDCkQXQyDDP0Q/BCFDP0QhQyEDP8Q/hDXCP8Q1wjUCAAR/xDUCAAR1AjRCAERABHRCAER0QjOCAIRARHOCAIRzgjLCAMR/BDGCAMRxgj7CAURBBEKCQURCgkNCQgRBxGZDAgRmQydDAQRCREHCQQRBwkKCRYRBhH6CBYR+ghbDgkRBxEECQkRBAkHCQwRCxH3CAwR9wj0CAgRDREBCQgRAQkrCQ4RDBH0CA4R9AjxCA0RDxH+CA0R/ggBCQ8RAxH7CA8R+wj+CBIRERHpCBIR6QjmCBcRChHjCBcR4whZDhQRExHgCBQR4AjdCP0QAhHLCP0QywjFCBURFBHdCBUR3QjaCP4QFRHaCP4Q2gjXCKwMrQyTDKwMkwySDKkMqgyQDKkMkAyPDKQMpQyLDKQMiwyKDJ4MoAyGDJ4MhgyEDLIMsQyXDLIMlwyYDK0MrgyUDK0MlAyTDKUMpgyMDKUMjAyLDKAMoQyHDKAMhwyGDJ0MmQyzDJ0Mswy3DLcMsgyYDLcMmAydDHMOrwyVDHMOlQxxDqYMpwyNDKYMjQyMDKEMogyIDKEMiAyHDLQMswyZDLQMmQyaDHIOqAyODHIOjgxwDqIMowyJDKIMiQyIDLUMtAyaDLUMmgybDLAMnwyFDLAMhQyWDKMMpAyKDKMMigyJDIQMhQyfDIQMnwyeDLYMtQybDLYMmwycDLEMsAyWDLEMlgyXDMsMygywDMsMsAyxDMYMxwytDMYMrQysDMMMxAyqDMMMqgypDL4MvwylDL4MpQykDLgMugygDLgMoAyeDMwMywyxDMwMsQyyDMcMyAyuDMcMrgytDL8MwAymDL8MpgylDLoMuwyhDLoMoQygDLcMswzNDLcMzQzRDNEMzAyyDNEMsgy3DHUOyQyvDHUOrwxzDsAMwQynDMAMpwymDLsMvAyiDLsMogyhDM4MzQyzDM4Mswy0DHQOwgyoDHQOqAxyDrwMvQyjDLwMowyiDM8Mzgy0DM8MtAy1DMoMuQyfDMoMnwywDL0MvgykDL0MpAyjDJ4Mnwy5DJ4MuQy4DNAMzwy1DNAMtQy2DOkM6AzODOkMzgzPDOQM0wy5DOQMuQzKDNcM2Ay+DNcMvgy9DLgMuQzTDLgM0wzSDOoM6QzPDOoMzwzQDOUM5AzKDOUMygzLDOAM4QzHDOAMxwzGDN0M3gzEDN0MxAzDDNgM2Qy/DNgMvwy+DNIM1Ay6DNIMugy4DOYM5QzLDOYMywzMDOEM4gzIDOEMyAzHDNkM2gzADNkMwAy/DNQM1Qy7DNQMuwy6DNEMzQznDNEM5wzrDOsM5gzMDOsMzAzRDHcO4wzJDHcOyQx1DtoM2wzBDNoMwQzADNUM1gy8DNUMvAy7DOgM5wzNDOgMzQzODHYO3AzCDHYOwgx0DtYM1wy9DNYMvQy8DOwM7gzUDOwM1AzSDAAN/wzlDAAN5QzmDPsM/AziDPsM4gzhDPMM9AzaDPMM2gzZDO4M7wzVDO4M1QzUDOsM5wwBDesMAQ0FDQUNAA3mDAUN5gzrDHkO/QzjDHkO4wx3DvQM9QzbDPQM2wzaDO8M8AzWDO8M1gzVDAINAQ3nDAIN5wzoDHgO9gzcDHgO3Ax2DvAM8QzXDPAM1wzWDAMNAg3oDAMN6AzpDP4M7QzTDP4M0wzkDPEM8gzYDPEM2AzXDNIM0wztDNIM7QzsDAQNAw3pDAQN6QzqDP8M/gzkDP8M5AzlDPoM+wzhDPoM4QzgDPcM+AzeDPcM3gzdDPIM8wzZDPIM2QzYDOwM7QwHDewMBw0GDR4NHQ0DDR4NAw0EDRkNGA3+DBkN/gz/DBQNFQ37DBQN+wz6DBENEg34DBEN+Az3DAwNDQ3zDAwN8wzyDAYNCA3uDAYN7gzsDBoNGQ3/DBoN/wwADRUNFg38DBUN/Az7DA0NDg30DA0N9AzzDAgNCQ3vDAgN7wzuDAUNAQ0bDQUNGw0fDR8NGg0ADR8NAA0FDXsOFw39DHsO/Qx5Dg4NDw31DA4N9Qz0DAkNCg3wDAkN8AzvDBwNGw0BDRwNAQ0CDXoOEA32DHoO9gx4DgoNCw3xDAoN8QzwDB0NHA0CDR0NAg0DDRgNBw3tDBgN7Qz+DAsNDA3yDAsN8gzxDCQNJQ0LDSQNCw0KDQsNJQ0xDQsNMQ0MDQwNMQ0mDQwNJg0NDQ4NJw0uDQ4NLg0PDTgNNw0dDTgNHQ0eDXoOfA4pDXoOKQ0QDRENKg0rDRENKw0SDRQNLQ0oDRQNKA0VDSANIg0IDSANCA0GDRUNKA0vDRUNLw0WDRgNGQ0yDRgNMg0zDSYNJw0ODSYNDg0NDR0NNw0hDR0NIQ0cDR8NGw01DR8NNQ05DRwNIQ01DRwNNQ0bDX0OMA0XDX0OFw17Dh8NOQ0jDR8NIw0aDRoNIw0yDRoNMg0ZDRgNMw02DRgNNg0HDSANBg0HDSANBw02DQgNIg00DQgNNA0JDQkNNA0kDQkNJA0KDRANKQ0qDRANKg0RDfcM9gwQDfcMEA0RDd0M3Az2DN0M9gz3DNwM3QzDDNwMwwzCDCQNNA1ODSQNTg0+DTkNNQ1PDTkNTw1TDSMNOQ1TDSMNUw09DX0OLw1JDX0OSQ1/DigNLQ1HDSgNRw1CDTMNMg1MDTMNTA1NDS4NJw1BDS4NQQ1IDSINIA06DSINOg08DTINIw09DTINPQ1MDXwOLg1IDXwOSA1+DiUNJA0+DSUNPg0/DTQNIg08DTQNPA1ODTYNMw1NDTYNTQ1QDSENNw1RDSENUQ07DSsNKg1EDSsNRA1FDTENJQ0/DTENPw1LDTcNOA1SDTcNUg1RDTUNIQ07DTUNOw1PDS8NKA1CDS8NQg1JDSYNMQ1LDSYNSw1ADSANNg1QDSANUA06DSoNKQ1DDSoNQw1EDScNJg1ADScNQA1BDX4OSA1iDX4OYg2ADj8NPg1YDT8NWA1ZDU0NTA1mDU0NZg1nDVENUg1sDVENbA1rDTsNUQ1rDTsNaw1VDUUNRA1eDUUNXg1fDUsNPw1ZDUsNWQ1lDToNUA1qDToNag1UDU8NOw1VDU8NVQ1pDUkNQg1cDUkNXA1jDUANSw1lDUANZQ1aDVMNTw1pDVMNaQ1tDT0NUw1tDT0NbQ1XDUQNQw1dDUQNXQ1eDUENQA1aDUENWg1bDU4NPA1WDU4NVg1oDUwNPQ1XDUwNVw1mDX8OSQ1jDX8OYw2BDkINRw1hDUINYQ1cDUgNQQ1bDUgNWw1iDTwNOg1UDTwNVA1WDT4NTg1oDT4NaA1YDVANTQ1nDVANZw1qDVUNaw2FDVUNhQ1vDV8NXg14DV8NeA15DWUNWQ1zDWUNcw1/DVQNag2EDVQNhA1uDWkNVQ1vDWkNbw2DDWMNXA12DWMNdg19DVoNZQ1/DVoNfw10DW0NaQ2DDW0Ngw2HDVcNbQ2HDVcNhw1xDV4NXQ13DV4Ndw14DVsNWg10DVsNdA11DWgNVg1wDWgNcA2CDWYNVw1xDWYNcQ2ADYEOYw19DYEOfQ2DDlwNYQ17DVwNew12DWINWw11DWINdQ18DVYNVA1uDVYNbg1wDVgNaA2CDVgNgg1yDWoNZw2BDWoNgQ2EDYAOYg18DYAOfA2CDlkNWA1yDVkNcg1zDWcNZg2ADWcNgA2BDWsNbA2GDWsNhg2FDTUPiA2rDTUPqw2sDZsNpw2MDZsNjA2YDaMNhg47D6MNOw+QDToPOQ+EDjoPhA6FDqgNqQ2KDagNig2LDYUOoQ2SDYUOkg06D4sNNg+tDYsNrQ2oDYgNiQ2qDYgNqg2rDZENlA2fDZENnw2iDTkPjw2kDTkPpA2EDj4PPA+HDj4Phw6JDo4Nlg2dDY4NnQ2lDZANkQ2iDZANog2jDTYPjQ2mDTYPpg2tDZYNlQ2eDZYNng2dDa8NpA2PDa8Njw04D5kNjg2lDZkNpQ2aDZgNNQ+sDZgNrA2bDYkOnw2UDYkOlA0+DzgPNw+uDTgPrg2vDZoNpg2NDZoNjQ2ZDZUNPQ+IDpUNiA6eDZwNoA2TDZwNkw2XDacNrg03D6cNNw+MDYYOnA2XDYYOlw07D4kNig2pDYkNqQ2qDT0Pkw2gDT0PoA2IDokOhw5wDYkOcA1uDXwNdQ2uDXwNrg2nDa0Npg19Da0NfQ12DYANcQ2GDoANhg6jDYcOoQ2CDYcOgg1wDYMOfQ2mDYMOpg2aDa8Nrg11Da8NdQ10DagNrQ12DagNdg17DXENhw2cDXENnA2GDocNgw2gDYcNoA2cDZsNrA13DZsNdw2CDnQNfw2kDXQNpA2vDawNqw14DawNeA13DYgOoA2DDYgOgw1vDW4NhA2fDW4Nnw2JDnsNeg2pDXsNqQ2oDYQOpA1/DYQOfw1zDasNqg15DasNeQ14DZ4NiA5vDZ4Nbw2FDZYJ9Av1C5YJ9Qu5CfMO9w7/C/MO/wvXC9QL/gtnC9QLZwsTDIEJ+Qv0C4EJ9AuWCfkLgQn3C/kL9wv2C/YL9wtVCfYLVQlICR0JEAlICR0JSAlVCTYOLg7lCDYO5QjoCOQI5wjoCOQI6AjlCBUOFg7nCBUO5wjkCBIRChGODBIRjgyPDI8MjgyoDI8MqAypDKkMqAzCDKkMwgzDDLENzA2KC7ENiguJC8cNxg3AC8cNwAu6C8INww1eDMINXgx6DMgNxw26C8gNugu0C8MNWgVVA8MNVQNeDHoMzAvEDXoMxA3CDckNyA20C8kNtAuuC8sNyg18C8sNfAt7C8UNxA3MC8UNzAvGC8oNyQ2uC8oNrgt8C8YNxQ3GC8YNxgvAC7kNug3JDbkNyQ3KDb4Nvw3EDb4NxA3FDbgNuQ3KDbgNyg3LDb0Nvg3FDb0NxQ3GDbwNvQ3GDbwNxg3HDbsNvA3HDbsNxw3IDcENwA3DDcENww3CDboNuw3IDboNyA3JDcINxA2/DcINvw3BDcANWgXDDbQNsw29DbQNvQ28DbMNvg29DbINvw2+DbcNug25DbYNtQ27DbYNuw26DbUNtA28DbUNvA27DYkLjwuwDcsNewuKC8sNigvMDc0NEgwRDM0NEQzODc4NEQwQDM4NEAzPDc8NEAwPDM8NDwzQDdANDwxxDNANcQzRDdENcQxvDNENbwzSDdINbwwODNINDgzTDdQNSgySC9QNkgvTDdQNTwxrC9QNawvVDdYN6gtsC9YNbAvVDdYN6wsCDNYNAgzXDSoPKQ8EDCoPBAzXDSYB3AVCDiYBQg7aCUMO2QnaCUMO2glCDtoNPApgC9oNYAvZDVEPIgo8ClEPPAraDdwNZgpBCtwNQQrbDd0NZwpmCt0NZgrcDd4NmQpnCt4NZwrdDd4NlwpaCt4NWgrfDeANaQpoCuANaArfDeENagppCuENaQrgDeINrwpqCuINagrhDeINrQq8CuINvArjDeQNzQq+CuQNvgrjDeUN3ArNCuUNzQrkDeUN2grpCuUN6QrmDeYN6Qr4CuYN+ArnDegNCQv6CugN+grnDekNGAsJC+kNCQvoDekNFgslC+kNJQvqDeoNJQs0C+oNNAvrDesNNAtDC+sNQwvsDe0NRAtFC+0NRQvsDe0NQgszC+0NMwvuDe4NMwskC+4NJAvvDfANFwsmC/ANJgvvDfANFQsGC/ANBgvxDfIN+QoIC/INCAvxDfMN6gr5CvMN+QryDfMN6ArZCvMN2Qr0DfQN2QrKCvQNygr1DfYNvQrMCvYNzAr1DfcNrgq9CvcNvQr2DfcNrApfCvcNXwr4DfkNXgphCvkNYQr4DfoNWwpeCvoNXgr5DfsNlQpbCvsNWwr6DfsNlgpWCvsNVgr8Df0NVQpYCv0NWAr8Df0NUwo/Cv0NPwr+DVIPHgooClIPKAr/Df8NKApQC/8NUAsADssJ2QlDDssJQw5ADssJQA5GDssJRg4BCqgLzg2mC6YLzg3PDaYLzw2hC6ELzw3QDaEL0A2cC5wL0A3RDZwL0Q2YC5gL0Q3SDZgL0g2VC5UL0g3TDZUL0w2SC08M1A3TDU8M0w0ODEoM1A3VDUoM1Q1sC+sL1g3VDesL1Q1rC+oL1g3XDeoL1w0EDMoJyQkcCsoJHAr+CY4Oaw4BCo4OAQpGDo4ORA4CCo4OAgprDikK2g3ZDSkK2Q1cCxcKUQ/aDRcK2g0pClQK3A3bDVQK2w1AClcK3Q3cDVcK3A1UCpcK3g3dDZcK3Q1XCpkK3g3fDZkK3w1oCl0K4A3fDV0K3w1aCmAK4Q3gDWAK4A1dCq0K4g3hDa0K4Q1gCq8K4g3jDa8K4w2+CssK5A3jDcsK4w28CtoK5Q3kDdoK5A3LCtwK5Q3mDdwK5g3rCusK5g3nDesK5w36CgcL6A3nDQcL5w34ChYL6Q3oDRYL6A0HCxgL6Q3qDRgL6g0nCycL6g3rDScL6w02CzYL6w3sDTYL7A1FC0IL7Q3sDUIL7A1DC0QL7Q3uDUQL7g01CzUL7g3vDTUL7w0mCxUL8A3vDRUL7w0kCxcL8A3xDRcL8Q0IC/cK8g3xDfcK8Q0GC+gK8w3yDegK8g33CuoK8w30DeoK9A3bCtsK9A31DdsK9Q3MCrsK9g31DbsK9Q3KCqwK9w32DawK9g27Cq4K9w34Da4K+A1hClwK+Q34DVwK+A1fClkK+g35DVkK+Q1cCpYK+w36DZYK+g1ZCpUK+w38DZUK/A1YClMK/Q38DVMK/A1WClUK/Q3+DVUK/g1ECh0KUg//DR0K/w0nCicK/w0ADicKAA5PC0UOAwoCCkUOAgpEDgwPAQ4CDgwPAg4LDwsPAg4DDgsPAw4KDwoPAw4EDgoPBA4JDwgPBQ4GDggPBg4HDwcPBg4HDgcPBw7vC+8LBw4IDu8LCA4/Dz8PCA4JDj8PCQ4NDw0PCQ4KDg0PCg5AD8cIyAgLDscICw4MDssIDQ4MDssIDA7FCM4IDg4NDs4IDQ7LCNEIDw4ODtEIDg7OCNQIEA4PDtQIDw7RCNcIEQ4QDtcIEA7UCNoIEg4RDtoIEQ7XCN0IEw4SDt0IEg7aCOAIFA4TDuAIEw7dCFkOig4UDlkOFA7gCOkIFw4WDukIFg7mCPQIGg4ZDvQIGQ7xCPcIGw4aDvcIGg70CFsOiw4bDlsOGw73CPwIHQ4LDvwICw7ICP8IHg4dDv8IHQ78CAIJHw4eDgIJHg7/CCkJJA4fDikJHw4CCQgJIQ4gDggJIA4FCQsJIg4hDgsJIQ4ICQ4JIw4iDg4JIg4LCQUJIA4kDgUJJA4pCeMI5ggWDuMIFg4VDh8JIgk7Dh8JOw49DhgJFwkpDhgJKQ4qDhUJFAkzDhUJMw41DhEJEAk2DhEJNg4xDiEJIAkoDiEJKA4+DiYJJwk4DiYJOA46DicJKAklDicJJQ44DtMIKQ4+DtMIPg7QCBoJGQkrDhoJKw4sDgMJJw43DgMJNw4qCRsJGgksDhsJLA4tDhAJHQkuDhAJLg42Dl4OHAkvDl4OLw6MDiUJJgk6DiUJOg45DiAJHgk8DiAJPA4oDh4JHwk9Dh4JPQ48DioJNw45DioJOQ4GCSMJJAknDiMJJw4mDhkJGAkqDhkJKg4rDvIIMw4yDvIIMg7vCCIJIwkmDiIJJg47Dl0OFQk1Dl0ONQ6NDhwJGwktDhwJLQ4vDuQI5QhXDuQIVw5YDkEO0gkDCkEOAwpFDlEO0glBDlEOQQ6VDkkOSg5HDkkORw5IDm8OZQ6SCW8OkglzCWIJYQlMDmIJTA5LDmEObw5zCWEOcwn6C2IJhQmECWIJhAlhCQAKRQ5EDgAKRA7/CaQAYglLDqQASw7lBaQAyQCFCaQAhQliCUoOYQ76C0oO+gtHDgAK7QkUCgAKFArWCTAP2A78DjAP/A4zDwoOrAn0AAoO9ACiBQkOqwmsCQkOrAkKDggOUQurCQgOqwkJDlELCA4HDlELBw5SC+oJlA5UDuoJVA4VCpEOFgoVCpEOFQpUDpIO1gkUCpIOFAqTDuYJ6wkECuYJBArqCeIJ5wnrCeIJ6wnmCd4J4wnnCd4J5wniCeMJ3gnJCeMJyQnfCckJygnbCckJ2wnfCdkJywnMCdkJzAlSDiYKJwpPCyYKTwslCt8J2wncCd8J3AngCSkBLgHgCSkB4AncCRUO5AhYDhUOWA6KDhwO+QhaDhwOWg6LDvkI+AhcDvkIXA5aDjQOjQ5cDjQOXA74CC4OjA5XDi4OVw7lCE4JXw5dDk4JXQ4WCZYJZA5iDpYJYg6BCbkJZg5kDrkJZA6WCdAJ0QloDtAJaA5pDtEJggljDtEJYw5oDlILBw4GDlILBg5TC4cJUQ6VDocJlQ6cDs4JAQprDs4Jaw5pDvMO1wttDvMObQ76Dh0JVQlgDh0JYA5eDngJVAlgDngJYA5uDvcLgQliDvcLYg5uDv0OMA9KDv0OSg5JDtQLbA5tDtQLbQ7XC00J/A7YDk0J2A5MCQsRFhFbDgsRWw73CBMRFxFZDhMRWQ7gCK4Mcw5xDq4McQ6UDKcMcg5wDqcMcA6NDMgMdQ5zDsgMcw6uDMEMdA5yDsEMcg6nDOIMdw51DuIMdQ7IDNsMdg50DtsMdA7BDPwMeQ53DvwMdw7iDPUMeA52DvUMdg7bDBYNew55DhYNeQ78DA8Neg54Dg8NeA71DA8NLg18Dg8NfA56Di8NfQ57Di8New4WDTANfQ5/DjANfw5KDSkNfA5+DikNfg5DDUMNfg6ADkMNgA5dDUoNfw6BDkoNgQ5kDWQNgQ6DDmQNgw5+DV0NgA6CDl0Ngg53DZ0Nng2FDZ0NhQ2GDaMNog2BDaMNgQ2ADYUOhA5zDYUOcw1yDYIOfA2nDYIOpw2bDaoNqQ16DaoNeg15DaUNnQ2GDaUNhg1+DZoNpQ1+DZoNfg2DDlMLBg4FDlMLBQ5UC+MIFQ6KDuMIig5ZDvoIHA6LDvoIiw5bDh0JXg6MDh0JjA4uDhYJXQ6NDhYJjQ40DtwOpw5IBtwOSAZ5BuEO2A4wD+EOMA/9DmoO1QnuCWoO7gn/CVIOzAnNCVIOzQnXCdUJag7+CdUJ/gkcClUOlA7qCVUO6gkECsQOAQ4MD8QODA9JD5IOlQ5BDpIOQQ7WCQQKBQpTDgQKUw5VDlsLYgtfC1sLXwtaC5UOkg5WDpUOVg6cDmMLWQtaC2MLWgtfC1kLYwvxC1kL8QthC/ALYAthC/ALYQvxC9sJQw5CDtsJQg7cCcoJQA5DDsoJQw7bCUAOygn+CUAO/glGDmoOjg5GDmoORg7+CY4Oag7/CY4O/wlEDmAJggmHCWAJhwl1CdYJQQ5FDtYJRQ4ACtgN2Q1gC9gNYAvwC9kN2A2YDtkNmA5cC5kOUAtcC5kOXAuYDpoOAA5QC5oOUAuZDgAOmg6bDgAOmw5PC08Lmw4GD08LBg8lCpwOVg5QDpwOUA5PDkIPQQ/zC0IP8wuXDpwOTw51CZwOdQmHCfwLOglACfwLQAllDgQOWAtUCwQOVAsFDlgLBA4DDlgLAw5XCzQP/AtlDjQPZQ5vDlcLAw4CDlcLAg5VC1ULAg4BDlULAQ5WCzMPNA9vDjMPbw5hDrkOpA7VDrkO1Q7UDgEOxA7FDgEOxQ5WC8IOxQ7EDsIOxA7BDsEOvg6/DsEOvw7CDr4Ouw68Dr4OvA6/DrkOvA67DrkOuw64DqIOpA65DqIOuQ64DioP1w0CDCoPAgwrD+IOsQ5RBuIOUQaHBoMA5QVLDoMASw5CCUIJSw5MDkIJTA48CeAOpQ6mDuAOpg7WDgUPkgk8CQUPPAlMDt0O3A6xDt0OsQ6wDtYOpg6tDtYOrQ7aDt8O2Q6uDt8Org60DtsO3Q6wDtsOsA6vDtkO2w6vDtkOrw6uDt4Osw6yDt4Osg7aDgYMJQ/OBgYMzgbcAt4O3w60Dt4OtA6zDrAOsQ7iDrAO4g7jDq8OsA7jDq8O4w7kDkQPog64DkQPuA5FD7wOuQ7UDrwO1A7TDkUPuA67DkUPuw5GD0YPuw6+DkYPvg5HDwMPcwmSCQMPkgkFD3MJAw8BD3MJAQ/6C0cPvg7BDkcPwQ5ID0gPwQ7EDkgPxA5JD9AOwwnCCdAOwgnRDtEOwgnBCdEOwQnKDrcJww69CbcJvQm2CbgJwA7DDrgJww63CWYOvQ7ADmYOwA64Cb0OZg65Cb0OuQm6DroOuQn1C7oO9Qu3DrcO9QuXCbcOlwlODtIOZw7DCdIOwwnQDrIJ+wBmBrIJZgbIDrEJsgnIDrEJyA7JDqcJqAnLDqcJyw7GDqoJqQnMDqoJzA7HDqkJpwnGDqkJxg7MDqgJsQnJDqgJyQ7LDsEJvgnNDsEJzQ7KDr4JvwnODr4Jzg7NDr8JwAnPDr8Jzw7ODmcO0g7TDmcO0w7ECcQJ0w7UDsQJ1A79C/0L1A7VDv0L1Q5lC0sJTAnYDksJ2A7hDqQOow7XDqQO1w7VDrUO4A7WDrUO1g62DqgOpw7cDqgO3A7dDrYO1g7aDrYO2g6yDqsOqg7ZDqsO2Q7fDqkOqA7dDqkO3Q7bDqoOqQ7bDqoO2w7ZDqwO3g7aDqwO2g6tDqwOqw7fDqwO3w7eDq4Orw7kDq4O5A7lDv8ORw76C/8O+gsBD/4OSA5HDv4ORw7/Dj8OSA7+Dj8O/g6dDj8OnQ6eDj8Ong6gDuAOlg6fDuAOnw6lDrQOrg7lDrQO5Q7mDrMOtA7mDrMO5g7nDrMO5w7oDrMO6A6yDrIO6A7pDrIO6Q62DiwP6Q7oDiwP6A4rD9cOZAtlC9cOZQvVDq8JrQnsDq8J7A7qDq0JrgntDq0J7Q7sDsUJxgnvDsUJ7w7uDqoJwAnvDqoJ7w7rDr4J9A7uDr4J7g6/Ca4JPwz5Dq4J+Q7tDsMJ8A7xDsMJ8Q7CCcIJ8Q7yDsIJ8g7BCWcO+g7wDmcO8A7DCcEJ8g70DsEJ9A6+CWQL9Q72DmQL9g5lC2UL9g73DmUL9w79C0AM0gOZBkAMmQb4Dj8MQAz4Dj8M+A75DsQJ/Qv3DsQJ9w7zDsQJ8w76DsQJ+g5nDvUOZgvsC/UO7AvtC+YO5Q4oD+YOKA8pD00JXw6PDk0Jjw78Dl8OTgn7Dl8O+w6PDkoOMA8zD0oOMw9hDjwJkgllDjwJZQ5ACaIOoQ6jDqIOow6kDvMLnw6WDvMLlg6XDp0O/g51CZ0OdQlPDpsOmg6lDpsOpQ6fDqUOmg6ZDqUOmQ6mDv8OYAl1Cf8OdQn+DmAJ/w4BD2AJAQ8AD6YOmQ6YDqYOmA6tDq0OmA7YDa0O2A2sDmMOgglgCWMOYAkAD6wO2A3wC6wO8AurDgAPAQ8DDwAPAw8CD/ELqg6rDvELqw7wC2MOAA8CD2MOAg+GCQQPgwmGCQQPhgkCD2EJhAmDCWEJgwkEDwQPAg8DDwQPAw8FDwUPTA5hCQUPYQkED2MLqQ6qDmMLqg7xC18LqA6pDl8LqQ5jC6gOXwtiC6gOYgunDkEPSg8GD0EPBg/zCwUOCA8JDwUOCQ8EDhsQDg+wBhsQsAbGBx0PHg8ODx0PDg8PDxwPHQ8PDxwPDw8QDyAQEQ8QDyAQEA8dECMQEg8RDyMQEQ8gECYQEw8SDyYQEg8jECoQFA8TDyoQEw8mECcQFQ8UDycQFA8qEBgPFQ8WDxgPFg8XDxEPGw8cDxEPHA8QDw4PHg/CBg4PwgawBhQPHw8ZDxQPGQ8TDxUPGA8fDxUPHw8UD3cMZAweD3cMHg8dDxIPGg8bDxIPGw8RDxMPGQ8aDxMPGg8SD+kLdwwdD+kLHQ8cD1EMGA8XD1EMFw8UDAYPmw6fDgYPnw7zCyIPIw8hDyIPIQ8gD+AOtQ4iD+AOIg+WDiAPlw6WDiAPlg4iD0IPlw4gD0IPIA9MDyIPtQ4kDyIPJA8jDyQPtQ62DiQPtg7pDuUO5A4nD+UOJw8oD+QO4w4mD+QOJg8nD+MO4g4lD+MOJQ8mD+cO5g4pD+cOKQ8qD+cOKg8rD+cOKw/oDmYLLA8rD2YLKw8CDKEOLw8uD6EOLg+jDjEPTQ6QDjEPkA4yDywPLQ8kDywPJA/pDjIPkA59CTIPfQlJDiwPZAvXDiwP1w4tDz8OoA4xDz8OMQ8yD0kOSA4/DkkOPw4yDy0P1w6jDi0Pow4uD2YL9Q5kC2YLZAssDyMPJA8tDyMPLQ8uD/wOjw40D/wONA8zDy4PLw8hDy4PIQ8jD00OTg6XCU0OlwmQDpEJfQmQDpEJkA6XCX0JkQn4C30J+Av7C/sL+At0CfsLdAl8CUkJSgl8CUkJfAl0CUoJSQkRCUoJEQkSCTEOMA4SCTEOEgkRCTAOMQ7rCDAO6wjsCOoI7QjsCOoI7AjrCBcOGA7tCBcO7QjqCL8OvA7TDr8O0w7SDr8O0g7QDr8O0A7CDsIO0A7RDsIO0Q7FDsoOVgvFDsoOxQ7RDs0OVQtWC80OVgvKDs4OVwtVC84OVQvNDs8OWAtXC88OVwvODqINnw2EDaINhA2BDXkNeg1gDXkNYA1fDV8NYA1GDV8NRg1FDSwNKw1FDSwNRQ1GDRMNEg0rDRMNKw0sDRINEw35DBIN+Qz4DPgM+QzfDPgM3wzeDN4M3wzFDN4MxQzEDMQMxQyrDMQMqwyqDKoMqwyRDKoMkQyQDBARERGQDBARkAyRDBgOFw7pCBgO6QjuCFgLzw7HDlgLxw5UC8wOUwtUC8wOVAvHDsYOUgtTC8YOUwvMDssOUQtSC8sOUgvGDlELyw7JDlELyQ6rCasJyQ7IDqsJyA6sCaYJQA/mBqYJ5gbtAHINgg2hDXINoQ2FDnoNew1hDXoNYQ1gDWwNZA1+DWwNfg2GDfsL/Q5JDvsLSQ59Cf0O+wt8Cf0OfAnhDkoJSwnhDkoJ4Q58CUsJSgkSCUsJEgkTCfsONQk6CfsOOgn8C04JMAk1CU4JNQn7DhYJKAkwCRYJMAlOCTwPkg2hDTwPoQ2HDj4PlA2RDT4PkQ08DzwPkQ2QDTwPkA2SDZINkA07D5INOw86DzoPOw+XDToPlw05DzkPlw2TDTkPkw2PDT0POA+PDT0Pjw2TDTgPPQ+VDTgPlQ03D5YNjA03D5YNNw+VDY4NmA2MDY4NjA2WDZkNNQ+YDZkNmA2ODTUPmQ2NDTUPjQ2IDYgNjQ02D4gNNg+JDYsNig2JDYsNiQ02D2ANYQ1HDWANRw1GDS0NLA1GDS0NRg1HDSwNLQ0UDSwNFA0TDfoM+QwTDfoMEw0UDfkM+gzgDPkM4AzfDN8M4AzGDN8MxgzFDKwMqwzFDKwMxQzGDJIMkQyrDJIMqwysDA4REBGRDA4RkQySDBkOGA7uCBkO7gjxCBgOGQ7wCBgO8AjtCO0I8AjvCO0I7wjsCDIOMA7sCDIO7AjvCDAOMg4TCTAOEwkSCTQOJQ4oCTQOKAkWCSUONA74CCUO+AgPCfkIDgkPCfkIDwn4CBwOIw4OCRwODgn5CCMOHA76CCMO+ggNCQURBhGVDAURlQycDK8MtgycDK8MnAyVDMkM0Ay2DMkMtgyvDNAMyQzjDNAM4wzqDP0MBA3qDP0M6gzjDAQN/QwXDQQNFw0eDR4NFw0wDR4NMA04DUoNUg04DUoNOA0wDVINSg1kDVINZA1sDaEOog5ED6EORA9DDyAPIQ9LDyAPSw9MDy8PTQ9LDy8PSw8hDy8PoQ5DDy8PQw9ND0oPIQolCkoPJQoGDyMKJgolCiMKJQohCiQKSApFCiQKRQoYCm8KEgoTCm8KEwpzCigKHgoXCigKFwopClYPEgoRClYPEQpXD3QKRgpOD3QKTg8RClMPJAojClMPIwpUD44KUA9PD44KTw+ICkMKiApPD0MKTw8fCtsNQQoiCtsNIgpRD/4NPwoeCv4NHgpSD0AK2w1RD0AKUQ8XCkQK/g1SD0QKUg8dCiMKJAoYCiMKGAomCk4Kbgp+Ck4KfgpQCpMKmgpuCpMKbgpOCpoKkwpMCpoKTAptCkoKbAptCkoKbQpMCkgKRwpsCkgKbApKCiQKUw9HCiQKRwpICkoPkg6TDkoPkw4hCiMKIQqTDiMKkw5UD5IOSg9BD5IOQQ9WDlYOQQ9CD1YOQg9QDlAOQg9MD1AOTA+eDp4OTA9LD54OSw+gDqAOSw9ND6AOTQ8xD0MPTQ4xD0MPMQ9ND00OQw9ED00ORA9ODmoBEwpVD2oBVQ/8BhIKVg9VDxIKVQ8TChEKTg9YDxEKWA9XD1UOVg9XD1UOVw+UDn4KaA9mD34KZg+kCpsKcgpfD5sKXw9nD2kPWA9OD2kPTg9qD3EKmwpnD3EKZw9eD0YKcApdD0YKXQ9gD04PRgpgD04PYA9qD3AKcQpeD3AKXg9dD34KbgpfD34KXw9oD6QKZg9lD6QKZQ+zCrMKZQ9cD7MKXA/CCsIKXA9bD8IKWw/RCtEKWw9aD9EKWg/gCuAKWg9ZD+AKWQ/vCu8KWQ9kD+8KZA/+Cv4KZA9jD/4KYw8NCw0LYw9iDw0LYg8cCxwLYg9hDxwLYQ8rCysLYQ9sDysLbA86CzoLbA9rDzoLaw9JC1QPaQ9qD1QPag9TD5MOFAoWCpMOFgqRDpMOkQ5pD5MOaQ9UD1gPaQ+RDlgPkQ5UDkYLQAtrD0YLaw9MC0wLaw9IC0wLSAtLC0gLRwtOC0gLTgtNC0sLSAtNC0sLTQtKC0oLTQvDAkoLwwLGAiMLKws6CyMLOgsyCysLIwsUCysLFAscCxwLFAsFCxwLBQsNCw0LBQv2Cg0L9gr+Cv4K9grnCv4K5wrvCtgK4ArvCtgK7wrnCuAK2ArJCuAKyQrRCtEKyQq6CtEKugrCCsIKugqrCsIKqwqzCrMKqwpSCrMKUgqkClAKfgqkClAKpApSCkUPtw5ODkUPTg5ED0YPug63DkYPtw5FD0cPvQ66DkcPug5GD0gPwA69DkgPvQ5HD0kPww7ADkkPwA5IDwwPvQnDDgwPww5JD70JDA8LD70JCw+6CboJCw8KD7oJCg+7CbsJCg8JD7sJCQ+8CQgPogm8CQgPvAkJD6IJCA8HD6IJBw+hCaEJBw/vC6EJ7wufCZ8J7ws/D58JPw+gCaAJPw8ND6AJDQ+lCaUJDQ9AD6UJQA+mCSsMLAxyDysMcg9zDykMKgx2DykMdg93D2MMvQMhB2MMIQd5DygMKQx3DygMdw90DycMVQx4DycM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bBBeEAUQgBBXEAUQVxBwEIAQBRBeEIAQXhCQEJAQXhBsEJAQbBBWEGkQhRBWEGkQVhBsEHgQexCFEHgQhRBpEHsQeBCDEHsQgxCSEHkQfBCSEHkQkhCDEHwQeRBkEHwQZBB1EHUQZBBjEHUQYxB0EG0QVRB0EG0QdBBjEG0QYxANEG0QDRAKEFUQbRBuEFUQbhCKEAYQgRCKEAYQihBuEIEQBhBvEIEQbxCJEH0QahCJEH0QiRBvEHoQZxBqEHoQahB9EHIQZRB+EHIQfhBrEGsQfhBmEGsQZhBzEFkQfxBzEFkQcxBmEGgQhBB/EGgQfxBZEJEQghBdEJEQXRCPEI8QXRBxEI8QcRBYELAQgRCJELAQiRCxEKoQjxBYEKoQWBCoEPAPUhA9EPAPPRDyD6QQihCBEKQQgRCwEKUQVRCKEKUQihCkEPAP8g85EPAPORA7EKkQnBCdEKkQnRCoEKwQmxCdEKwQnRCuEJEQhBBoEJEQaBCCEKAQnhCcEKAQnBCpEKsQnxCeEKsQnhCgEKcQnxB7EKcQexCSEJ4QphCtEJ4QrRCcEDsQORCCEDsQghBoEJwQrRCuEJwQrhCdEKYQshCiEKYQohCtEJsQqhCoEJsQqBCdEFcQqRCoEFcQqBBYEIAQoBCpEIAQqRBXEJAQqxCgEJAQoBCAEKIQsBCxEKIQsRChEKMQrBCuEKMQrhChEJ8QpxCmEJ8QphCeEIQQqhCbEIQQmxB/EH8QmxCsEH8QrBBzEK0QohChEK0QoRCuEKsQkBBWEKsQVhCFEGcQchCvEGcQrxBqEKMQaxBzEKMQcxCsEK8QoxChEK8QoRCxEKcQsxCyEKcQshCmEGoQrxCxEGoQsRCJELMQpRCkELMQpBCyELIQpBCwELIQsBCiELMQpxCSELMQkhB8EJ8QqxCFEJ8QhRB7EFUQpRB1EFUQdRB0EKUQsxB8EKUQfBB1ED8QPhC0ED8QtBC+EEQQPxC+EEQQvhDBEEwQSxC6EEwQuhDFEE4QTRC7EE4QuxDGEE0QTxC8EE0QvBC7EFIQTBDFEFIQxRDJEEEQUBDHEEEQxxC1EEoQQhDAEEoQwBC5EEgQURDIEEgQyBC4EO0P7A+/EO0PvxC1EOYP5w/AEOYPwBC2EOQP3g/CEOQPwhC3EOEP6Q/DEOEPwxC4EDUQ5Q/EEDUQxBDKEOkP6g/HEOkP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";
  // The head: a CC0 MakeHuman mesh (African young, male/female blend), embedded as a quantised mesh and
  // sampled here into N points: a lit surface that reads as a sculpted bust, a crisp outline built from
  // depth contours at the silhouette (as in the reference), and a thin halo. Local units, facing +z.
  function buildFace(N) {
    const bin = atob(HEAD_MESH), buf = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i);
    const dv = new DataView(buf.buffer), nv = dv.getUint16(0, true), nf = dv.getUint16(2, true);
    const V = new Float32Array(nv * 3), Fi = new Uint16Array(nf * 3), fo = 4 + nv * 6;
    for (let i = 0; i < nv * 3; i++) V[i] = dv.getInt16(4 + i * 2, true) / 8000;
    for (let i = 0; i < nf * 3; i++) Fi[i] = dv.getUint16(fo + i * 2, true);
    let seed = 20260927;
    const rnd = () => { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; };
    const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
    const VN = new Float32Array(nv * 3), FA = new Float32Array(nf), FNm = new Float32Array(nf * 3);
    for (let f = 0; f < nf; f++) {
      const a = Fi[f * 3] * 3, b = Fi[f * 3 + 1] * 3, c = Fi[f * 3 + 2] * 3;
      const ux = V[b] - V[a], uy = V[b + 1] - V[a + 1], uz = V[b + 2] - V[a + 2], vx = V[c] - V[a], vy = V[c + 1] - V[a + 1], vz = V[c + 2] - V[a + 2];
      const nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx, l = Math.hypot(nx, ny, nz) || 1e-9;
      FA[f] = l / 2; FNm[f * 3] = nx / l; FNm[f * 3 + 1] = ny / l; FNm[f * 3 + 2] = nz / l;
      for (const k of [a, b, c]) { VN[k] += nx; VN[k + 1] += ny; VN[k + 2] += nz; }
    }
    for (let i = 0; i < nv; i++) { const l = Math.hypot(VN[i * 3], VN[i * 3 + 1], VN[i * 3 + 2]) || 1; VN[i * 3] /= l; VN[i * 3 + 1] /= l; VN[i * 3 + 2] /= l; }
    const dotN = (i, j) => VN[i * 3] * VN[j * 3] + VN[i * 3 + 1] * VN[j * 3 + 1] + VN[i * 3 + 2] * VN[j * 3 + 2];
    const pick = (cdf, u) => { let lo = 0, hi = cdf.length - 1; const x = u * cdf[hi]; while (lo < hi) { const m = (lo + hi) >> 1; if (cdf[m] < x) lo = m + 1; else hi = m; } return lo; };
    const pos = new Float32Array(N * 3), col = new Float32Array(N * 3), alp = new Float32Array(N), nor = new Float32Array(N * 3);
    const BLUE = [.1, .2, 1], CYAN = [.28, .88, 1], ICE = [.72, .86, 1];
    let k = 0;
    const put = (x, y, z, nx, ny, nz, rgb, br, a) => {
      pos[k * 3] = x; pos[k * 3 + 1] = y; pos[k * 3 + 2] = z;
      const l = Math.hypot(nx, ny, nz) || 1; nor[k * 3] = nx / l; nor[k * 3 + 1] = ny / l; nor[k * 3 + 2] = nz / l;
      const neck = clamp((y + 1.78) / .55, 0, 1);
      col[k * 3] = rgb[0] * br; col[k * 3 + 1] = rgb[1] * br; col[k * 3 + 2] = rgb[2] * br; alp[k] = a * neck; k++;
    };
    const mix3 = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
    // 1 · outline: depth contours kept only near the silhouette, where they crowd into a crisp edge
    const cy = -.25, NB = 96, maxR = new Float32Array(NB);
    const bin_ = (x, y) => ((Math.floor((Math.atan2(y - cy, x) + Math.PI) / (2 * Math.PI) * NB) % NB) + NB) % NB;
    for (let i = 0; i < nv; i++) { const x = V[i * 3], y = V[i * 3 + 1], b = bin_(x, y); maxR[b] = Math.max(maxR[b], Math.hypot(x, y - cy)); }
    const seg = [], segW = [];
    for (let z0 = 1.3; z0 > -1; z0 -= .064) {
      for (let f = 0; f < nf; f++) {
        const ids = [Fi[f * 3], Fi[f * 3 + 1], Fi[f * 3 + 2]], ends = [];
        for (let e = 0; e < 3; e++) {
          const a = ids[e], b = ids[(e + 1) % 3], da = V[a * 3 + 2] - z0, db = V[b * 3 + 2] - z0;
          if ((da > 0) !== (db > 0)) { const u = da / (da - db); ends.push([a, b, u]); }
        }
        if (ends.length !== 2) continue;
        const P = ends.map(([a, b, u]) => [0, 1, 2].map(c => V[a * 3 + c] + (V[b * 3 + c] - V[a * 3 + c]) * u).concat([0, 1, 2].map(c => VN[a * 3 + c] + (VN[b * 3 + c] - VN[a * 3 + c]) * u)));
        const mx = (P[0][0] + P[1][0]) / 2, my = (P[0][1] + P[1][1]) / 2, band = Math.hypot(mx, my - cy) / (maxR[bin_(mx, my)] || 1);
        if (band < .8) continue;
        const L = Math.hypot(P[1][0] - P[0][0], P[1][1] - P[0][1], P[1][2] - P[0][2]);
        seg.push(P); segW.push((segW.length ? segW[segW.length - 1] : 0) + L * (band > .9 ? 1 : .5));
      }
    }
    const nO = Math.round(N * .2);
    for (let q = 0; q < nO && seg.length; q++) {
      const P = seg[pick(segW, rnd())], u = rnd(), s = [0, 1, 2, 3, 4, 5].map(c => P[0][c] + (P[1][c] - P[0][c]) * u);
      put(s[0], s[1], s[2], s[3], s[4], s[5], mix3(BLUE, ICE, .25 + .25 * rnd()), .95 + .3 * rnd(), .95);
    }
    // 2 · the surface as a stipple: even on screen, denser where a key light from the upper left falls,
    //     and along the creases (lids, lips, nostrils, ears), so the face reads by density as well as brightness
    const LK = [-.56, .34, .76], LF = [.72, -.05, .69];
    const lit = (x, y, z) => { const l = Math.hypot(x, y, z) || 1; return Math.max(0, (x * LK[0] + y * LK[1] + z * LK[2]) / l) + .22 * Math.max(0, (x * LF[0] + y * LF[1] + z * LF[2]) / l); };
    const lamF = f => lit(FNm[f * 3], FNm[f * 3 + 1], FNm[f * 3 + 2]);
    const cdf = new Float64Array(nf); let acc = 0;
    for (let f = 0; f < nf; f++) {
      const a = Fi[f * 3], b = Fi[f * 3 + 1], c = Fi[f * 3 + 2];
      const cr = clamp((3 - dotN(a, b) - dotN(b, c) - dotN(c, a)) / .22, 0, 1.4);
      const x = (V[a * 3] + V[b * 3] + V[c * 3]) / 3, y = (V[a * 3 + 1] + V[b * 3 + 1] + V[c * 3 + 1]) / 3, z = (V[a * 3 + 2] + V[b * 3 + 2] + V[c * 3 + 2]) / 3;
      const face = clamp((z - .1) / .4, 0, 1) * clamp((y + 1.25) / .3, 0, 1) * clamp((1 - Math.abs(x)) / .3, 0, 1);
      const nz = FNm[f * 3 + 2];
      acc += FA[f] * (nz > 0 ? .1 + nz : .05) * (.1 + .9 * Math.pow(lamF(f), 1.4)) * (1 + 1.1 * face) * (1 + 1.1 * cr) * (y < -1.2 ? .6 : 1) * (y > .55 ? .55 : 1);
      cdf[f] = acc;
    }
    const nH = Math.round(N * .04), R0 = .0095 * Math.sqrt(12600 / N), HC = R0 * 1.001, grid = new Map();
    const hk = (x, y, z) => (Math.floor(x / HC) + 512) * 1048576 + (Math.floor(y / HC) + 512) * 1024 + (Math.floor(z / HC) + 512);
    const near_ = p => {
      const gx = Math.floor(p[0] / HC), gy = Math.floor(p[1] / HC), gz = Math.floor(p[2] / HC);
      for (let i = -1; i <= 1; i++) for (let j = -1; j <= 1; j++) for (let l = -1; l <= 1; l++) {
        const cell = grid.get((gx + i + 512) * 1048576 + (gy + j + 512) * 1024 + (gz + l + 512)); if (!cell) continue;
        for (const q of cell) if ((q[0] - p[0]) ** 2 + (q[1] - p[1]) ** 2 + (q[2] - p[2]) ** 2 < R0 * R0) return true;
      }
      return false;
    };
    let tries = 0;
    while (k < N - nH) {
      const f = pick(cdf, rnd()), a = Fi[f * 3], b = Fi[f * 3 + 1], c = Fi[f * 3 + 2];
      const r1 = Math.sqrt(rnd()), r2 = rnd(), wa = 1 - r1, wb = r1 * (1 - r2), wc = r1 * r2;
      const p = [0, 1, 2].map(i => V[a * 3 + i] * wa + V[b * 3 + i] * wb + V[c * 3 + i] * wc);
      if (++tries < N * 6 && near_(p)) continue;
      { const key = hk(p[0], p[1], p[2]); let cell = grid.get(key); if (!cell) grid.set(key, cell = []); cell.push(p); }
      const n = [0, 1, 2].map(i => VN[a * 3 + i] * wa + VN[b * 3 + i] * wb + VN[c * 3 + i] * wc);
      const nose = Math.exp(-p[0] * p[0] / .012) * clamp((p[2] - 1.1) / .2, 0, 1) * clamp((p[1] + .45) / .12, 0, 1);
      const lk = Math.min(1, lit(n[0], n[1], n[2]));
      put(p[0], p[1], p[2], n[0], n[1], n[2], mix3(mix3(BLUE, ICE, .08 + .38 * lk * lk), CYAN, nose * .7), .3 + .95 * lk + .15 * rnd(), .45 + .5 * lk);
    }
    // 3 · a thin halo of loose points
    while (k < N) {
      const a = rnd() * Math.PI * 2, b = Math.acos(rnd() * 2 - 1), r = 1.35 + rnd() * 1.2;
      const d = [Math.sin(b) * Math.cos(a), Math.cos(b), Math.sin(b) * Math.sin(a)];
      put(d[0] * r * .95, d[1] * r * 1.1 - .25, d[2] * r * .85, d[0], d[1], d[2], BLUE, .3 + .3 * rnd(), .26);
    }
    return { pos, col, alp, nor, web: [] };
  }

  /* ---------- particles: a face → the Creation → Creating Tomorrow → grid ---------- */
  const COLS = TIER === 0 ? (PHONE ? 96 : 150) : TIER === 1 ? (PHONE ? 112 : 170) : (PHONE ? 120 : 184), ROWS = Math.round(COLS * 9 / 16);
  const N = COLS * ROWS;
  const PW = 32, PH = 18, PCY = 7, HGAP = .9;
  const aCrowd = new Float32Array(N * 3), aPhoto = new Float32Array(N * 3), aGrid = new Float32Array(N * 3), aCol = new Float32Array(N * 3);
  const aHands = new Float32Array(N * 3), cHands = new Float32Array(N * 3), aSide = new Float32Array(N), aDistH = new Float32Array(N), aHA = new Float32Array(N);
  const aRand = new Float32Array(N), aYou = new Float32Array(N), cFace = new Float32Array(N * 3), aFA = new Float32Array(N), nFace = new Float32Array(N * 3);
  const FC = buildFace(N);
  const youIdx = Math.floor(ROWS / 2) * COLS + Math.floor(COLS / 2);
  S.youPos = new THREE.Vector3(0, PCY - .4, 6);
  let seed = 12345;
  const rnd = () => { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; };
  const HD = buildHands(N, { scale: 3.4, gap: HGAP, cy: PCY, tilt: .49 });
  const perm = Array.from({ length: N }, (_, i) => i);
  for (let i = N - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); const tmp = perm[i]; perm[i] = perm[j]; perm[j] = tmp; }
  const tipL = new THREE.Vector3(HD.tipL[0], HD.tipL[1], HD.tipL[2]);
  S.hit = new THREE.Vector3(0, PCY, 0);
  S.reachDir = new THREE.Vector3(HD.reachDir[0], HD.reachDir[1], HD.reachDir[2]);
  // grid lines for the "grid" formation
  const lines = [];
  for (let k = -8; k <= 8; k++) lines.push({ x: k * G, z0: -27, z1: 18 });
  for (let m = -6; m <= 4; m++) lines.push({ z: m * G, x0: -38, x1: 38 });
  for (let i = 0; i < N; i++) {
    const col = i % COLS, row = Math.floor(i / COLS);
    const r = rnd();
    aRand[i] = r;
    aPhoto[i * 3] = (col / (COLS - 1) - .5) * PW;
    aPhoto[i * 3 + 1] = PCY + (.5 - row / (ROWS - 1)) * PH;
    aPhoto[i * 3 + 2] = 0;
    aCol[i * 3] = aCol[i * 3 + 1] = aCol[i * 3 + 2] = .3;
    if (i === youIdx) aYou[i] = 1;
    const h = perm[i], fi = perm[(i * 7919) % N];
    for (let c = 0; c < 3; c++) { aCrowd[i * 3 + c] = FC.pos[fi * 3 + c]; cFace[i * 3 + c] = FC.col[fi * 3 + c]; nFace[i * 3 + c] = FC.nor[fi * 3 + c]; }
    aFA[i] = FC.alp[fi];
    let hx = HD.pos[h * 3], hy = HD.pos[h * 3 + 1], hz = HD.pos[h * 3 + 2], sh = HD.shade[h], sd = HD.side[h], cr = HD.crack[h];
    if (i === youIdx) { hx = tipL.x; hy = tipL.y; hz = tipL.z + .05; sh = 1; sd = -1; cr = 0; }
    aHands[i * 3] = hx; aHands[i * 3 + 1] = hy; aHands[i * 3 + 2] = hz; aSide[i] = sd;
    const st = .035 + .33 * sh * sh;
    cHands[i * 3] = lerp(st, .2 * (.5 + .5 * sh), cr); cHands[i * 3 + 1] = lerp(st * 1.03, .22 * (.5 + .5 * sh), cr); cHands[i * 3 + 2] = lerp(st * 1.2, 1.35 * (.5 + .5 * sh), cr);
    aHA[i] = .18 + .82 * Math.max(sh, cr);
    const ddx = hx - tipL.x, ddy = hy - tipL.y, ddz = hz - tipL.z;
    aDistH[i] = clamp(Math.sqrt(ddx * ddx + ddy * ddy + ddz * ddz) / 13, 0, 1);
    const L = lines[Math.floor(rnd() * lines.length)];
    if (L.x !== undefined) { aGrid[i * 3] = L.x + (rnd() - .5) * .12; aGrid[i * 3 + 2] = lerp(L.z0, L.z1, rnd()); }
    else { aGrid[i * 3 + 2] = L.z + (rnd() - .5) * .12; aGrid[i * 3] = lerp(L.x0, L.x1, rnd()); }
    aGrid[i * 3 + 1] = .06;
  }
  S.you = { crowd: S.youPos.clone(), hand: tipL.clone(), d: aRand[youIdx] * .3, gap: HGAP / 2 };
  S.HD = HD;
  const pg = new THREE.BufferGeometry();
  pg.setAttribute('position', new THREE.BufferAttribute(aCrowd, 3));
  pg.setAttribute('pHands', new THREE.BufferAttribute(aHands, 3));
  pg.setAttribute('pPhoto', new THREE.BufferAttribute(aPhoto, 3));
  pg.setAttribute('pGrid', new THREE.BufferAttribute(aGrid, 3));
  pg.setAttribute('cPhoto', new THREE.BufferAttribute(aCol, 3));
  pg.setAttribute('cHands', new THREE.BufferAttribute(cHands, 3));
  pg.setAttribute('aHA', new THREE.BufferAttribute(aHA, 1));
  pg.setAttribute('aSide', new THREE.BufferAttribute(aSide, 1));
  pg.setAttribute('aDistH', new THREE.BufferAttribute(aDistH, 1));
  pg.setAttribute('aRand', new THREE.BufferAttribute(aRand, 1));
  pg.setAttribute('aYou', new THREE.BufferAttribute(aYou, 1));
  pg.setAttribute('cFace', new THREE.BufferAttribute(cFace, 3));
  pg.setAttribute('aFA', new THREE.BufferAttribute(aFA, 1));
  pg.setAttribute('nFace', new THREE.BufferAttribute(nFace, 3));
  S.headM = new THREE.Matrix4(); S.hq = new THREE.Quaternion(); S.he = new THREE.Euler(); S.hs = new THREE.Vector3();
  S.head = { yaw: 0, pitch: 0, mx: 0, my: 0, scale: PHONE ? 7.6 : 6.8, x: PHONE ? 0 : 4.5, y: PHONE ? 8.9 : 7.8 };
  pMat = new THREE.ShaderMaterial({
    uniforms: {
      uT: { value: 0 }, uCit: { value: 0 }, uReach: { value: 0 }, uGap: { value: HGAP / 2 }, uHit: { value: S.hit }, uReachDir: { value: S.reachDir }, uFade: { value: 1 }, uSolid: { value: 0 },
      uHeadM: { value: S.headM }, uMouse: { value: new THREE.Vector2(9, 9) }, uRepel: { value: 1 }, uMV: { value: 0 }, uScan: { value: 9 }, uScanOn: { value: 0 }, uRev: { value: RM ? 1 : 0 }, uAspect: { value: W / H }, uRipple: { value: 0 }, uRipC: { value: new THREE.Vector2(G / 2, G / 2) }, uPulC: { value: new THREE.Vector2(G / 2, G / 2) }, uPulse: { value: 99 }, uNoise: { value: 0 }, uPeak: { value: 0 }, uRing: { value: 0 }, uShock: { value: 0 }, uPeakC: { value: new THREE.Vector2(0, -4.5) },
      uSize: { value: PW / COLS * .8 }, uTime: U.uTime, uScale: U.uScale, uPR: U.uPR, uBlue: U.uBlue, uPaper: U.uPaper, uGrey: { value: COL.grey }, uDrift: { value: RM ? 0 : 1 }
    },
    vertexShader: `
      attribute vec3 pHands; attribute vec3 pPhoto; attribute vec3 pGrid; attribute vec3 cPhoto; attribute vec3 cHands;
      attribute float aHA; attribute float aSide; attribute float aDistH; attribute float aRand; attribute float aYou;
      attribute vec3 cFace; attribute float aFA; attribute vec3 nFace;
      uniform float uT, uCit, uReach, uGap, uFade, uSize, uTime, uScale, uPR, uDrift, uSolid, uRepel, uMV, uAspect, uRipple, uScan, uScanOn, uRev, uPulse, uNoise, uPeak, uRing, uShock; uniform vec3 uBlue, uPaper, uGrey, uHit, uReachDir;
      uniform mat4 uHeadM; uniform vec2 uMouse, uRipC, uPulC, uPeakC;
      varying vec3 vCol; varying float vA; varying float vRound;
      float ez(float x){ return x < 0.5 ? 4.0*x*x*x : 1.0 - pow(-2.0*x+2.0, 3.0)/2.0; }
      void main(){
        float d = aRand*0.3;
        float t1 = ez(clamp((uT - d)/0.7, 0.0, 1.0));
        float t2 = ez(clamp((uT - 1.0 - d)/0.7, 0.0, 1.0));
        float t3 = ez(clamp((uT - 2.0 - d)/0.7, 0.0, 1.0));
        vec3 ph = pHands - aSide * uReach * uGap * uReachDir;
        // the face, turned by the cursor and pushed aside where the cursor touches it
        vec3 pf = (uHeadM * vec4(position, 1.0)).xyz;
        vec3 nf = normalize(mat3(uHeadM) * nFace);
        vec3 V = normalize(cameraPosition - pf);
        float fr = dot(nf, V), rim = 1.0 - abs(fr);
        float bf = smoothstep(-0.3, 0.12, fr);
        // arrival: the points drift in and settle into the head; then a violet scan line passes over it now and then
        float rev = clamp((uRev - aRand * 0.55) / 0.45, 0.0, 1.0); rev = rev * rev * (3.0 - 2.0 * rev);
        float scan = uScanOn * exp(-pow((position.y - uScan) / 0.045, 2.0));
        pf += (1.0 - rev) * vec3(fract(aRand * 53.0) - 0.5, fract(aRand * 97.0) - 0.5, fract(aRand * 31.0) - 0.15) * 10.0 + nf * scan * 0.05;
        vec4 cp = projectionMatrix * viewMatrix * vec4(pf, 1.0);
        vec2 dd = cp.xy / cp.w - uMouse; dd.x *= uAspect;
        float dl = length(dd) + 1e-4;
        float near = uRepel * (1.0 - smoothstep(0.0, 0.17, dl));
        float push = near * (0.12 + 0.88 * uMV);
        vec3 cR = vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]), cU = vec3(viewMatrix[0][1], viewMatrix[1][1], viewMatrix[2][1]);
        pf += (cR * dd.x / dl + cU * dd.y / dl) * push * (1.6 + 1.4 * aRand) + nf * push * 0.8;
        pf += nf * sin(uTime * 1.3 + position.y * 6.0) * 0.03 * uDrift;
        vec3 pos = mix(pf, ph, t1);
        pos = mix(pos, pPhoto, t2);
        pos = mix(pos, pGrid, t3);
        pos.y += t1 * (1.0 - t2) * uDrift * sin(uTime*0.9 + pHands.x*0.25) * 0.05;
        float f1 = sin(3.14159*t1) * (1.0 - t2);
        pos += f1 * vec3((aRand-0.5)*3.0, (fract(aRand*7.0)-0.5)*3.0, fract(aRand*13.0)*3.0);
        float f2 = sin(3.14159*t2);
        vec3 dir = normalize(ph - uHit + vec3(0.0, 0.0, 0.001));
        pos += f2 * (dir * (5.0 + 12.0*fract(aRand*17.0)) + vec3(0.0, 0.0, 4.0*fract(aRand*29.0)));
        float rd = length(pGrid.xz - uRipC), pd = length(pGrid.xz - uPulC), pk = pd - uPulse * 10.0;
        float wav = uRipple * t3 * (sin(rd * 0.55 - uTime * 2.6) * 0.5 * exp(-rd * 0.03) + 1.6 * exp(-pk * pk / 9.0) * exp(-uPulse * 0.42) * sin(pd * 0.8 - uPulse * 8.0));
        // how we work: restless ground while the questions run, then one summit, then rings from it
        vec2 gq = pGrid.xz;
        float nz = uNoise * t3 * (1.25 * sin(gq.x * 0.29 + uTime * 0.7) * sin(gq.y * 0.36 - uTime * 0.55) + 0.6 * sin(gq.x * 0.81 - gq.y * 0.63 + uTime * 1.15) + 0.35 * sin(length(gq) * 0.9 - uTime * 1.8));
        float pr = length(gq - uPeakC);
        float pkH = uPeak * t3 * 10.5 * exp(-pr * pr / 46.0);
        float rng = uRing * t3 * 1.5 * sin(pr * 0.5 - uTime * 3.2) * smoothstep(4.0, 10.0, pr) * exp(-pr * 0.022);
        float shk = t3 * step(0.001, uShock) * (1.0 - uShock) * 3.2 * exp(-pow(pr - 4.0 - uShock * 62.0, 2.0) / 14.0);
        pos.y += wav + nz * (1.0 - 0.9 * exp(-pr * pr / 60.0) * uPeak) + pkH + rng + shk;
        float f3 = sin(3.14159*t3);
        pos += f3 * vec3((aRand-0.5)*4.0, (fract(aRand*7.0)-0.5)*5.0, fract(aRand*13.0)*5.0);
        // colour: grey viewers; dark stone hands with blue fissures; the touch charges them from YOUR fingertip
        float tw = 0.78 + 0.22 * sin(uTime * 2.5 + aRand * 60.0);
        float lam = max(dot(nf, normalize(vec3(-0.45, 0.45, 0.77))), 0.0);
        vec3 cc = cFace * (0.45 + 0.8 * lam + 0.3 * pow(rim, 3.0)) * tw + vec3(0.2, 0.45, 0.8) * near * 0.9 + vec3(0.62, 0.3, 1.0) * scan * 1.2;
        float cit = step(0.001, uCit) * smoothstep(aDistH - 0.12, aDistH, uCit*1.15);
        vec3 ch = mix(cHands, uBlue*1.35, cit*0.55);
        ch = mix(ch, uPaper, aYou*(1.0 - cit)*t1);
        vec3 cg = mix(uBlue*1.2, uPaper, step(0.94, aRand)) + vec3(0.35, 0.42, 0.75) * clamp(wav + abs(nz) * 0.3 + rng + shk * 0.6, 0.0, 1.3) * 0.85;
        cg = mix(cg, uPaper * 1.1, clamp(pkH / 10.5, 0.0, 1.0) * uPeak * 0.8);
        vCol = mix(mix(mix(cc, ch, t1), cPhoto, t2), cg, t3);
        vec4 mv = modelViewMatrix * vec4(pos, 1.0);
        gl_Position = projectionMatrix * mv;
        float s = uSize * (1.0 + aYou*t1*(1.0 - t2)*1.6) * mix(0.3 + aRand*0.24, 1.0, t1) * mix(1.0, 0.7, t3);
        gl_PointSize = clamp(s * uScale * uPR / -mv.z, 1.0, 48.0);
        float aC = (aFA * (0.55 + 0.45 * lam) + near * 0.35 + scan * 0.4) * rev * bf;
        float aH = max(aHA, aYou) * (1.0 - 0.93*uSolid*(1.0 - aYou));
        vA = uFade * mix(mix(mix(aC, aH, t1), 1.0, t2), 0.45 + 0.55*aRand, t3);
        vRound = 1.0 - t1;
      }`,
    fragmentShader: `varying vec3 vCol; varying float vA; varying float vRound; void main(){ float r = length(gl_PointCoord - 0.5); float m = mix(1.0, 1.0 - smoothstep(0.18, 0.5, r), vRound); if (m < 0.02) discard; gl_FragColor = vec4(vCol, vA * m); }`,
    transparent: true, depthWrite: false
  });
  // a violet plexus across the face, as in the reference
  {
    const nodes = FC.web, seg = [], seen = new Set();
    nodes.forEach((a, ai) => {
      nodes.map((b, bi) => [bi, (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2]).filter(q => q[0] !== ai && q[1] < .06).sort((u, v) => u[1] - v[1]).slice(0, 3).forEach(q => {
        const key = Math.min(ai, q[0]) + ':' + Math.max(ai, q[0]); if (seen.has(key)) return; seen.add(key);
        const b = nodes[q[0]]; seg.push(a[0], a[1], a[2], b[0], b[1], b[2]);
      });
    });
    const lg = new THREE.BufferGeometry(); lg.setAttribute('position', new THREE.Float32BufferAttribute(seg, 3));
    S.plexus = new THREE.LineSegments(lg, new THREE.LineBasicMaterial({ color: new THREE.Color('#6B3BFF'), transparent: true, opacity: .3, depthWrite: false, blending: THREE.AdditiveBlending }));
    S.plexus.matrixAutoUpdate = false; S.plexus.frustumCulled = false;
    gateGroup.add(S.plexus);
  }
  particles = new THREE.Points(pg, pMat);
  particles.frustumCulled = false;
  gateGroup.add(particles);
  // the spark: a flash of light where the fingertips meet
  const fc = document.createElement('canvas'); fc.width = fc.height = 256;
  const fx = fc.getContext('2d');
  const gr = fx.createRadialGradient(128, 128, 0, 128, 128, 128);
  gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(.14, 'rgba(210,214,255,.95)'); gr.addColorStop(.38, 'rgba(60,60,255,.55)'); gr.addColorStop(1, 'rgba(31,31,255,0)');
  fx.fillStyle = gr; fx.fillRect(0, 0, 256, 256);
  spark = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(fc), blending: THREE.AdditiveBlending, transparent: true, depthWrite: false, opacity: 0 }));
  spark.position.copy(S.hit).add(new THREE.Vector3(0, 0, .3));
  spark.visible = false;
  S.summit = new THREE.Sprite(new THREE.SpriteMaterial({ map: spark.material.map, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false, opacity: 0 }));
  S.summit.position.set(0, 10.9, -4.5); S.summit.visible = false; gateGroup.add(S.summit);
  gateGroup.add(spark);
  // the dots solidify into dark stone with blue fissures
  const stoneMat = new THREE.ShaderMaterial({
    uniforms: { uSolid: { value: 0 }, uGlow: { value: .5 }, uCit: { value: 0 }, uTime: U.uTime, uBlue: U.uBlue, uHit: { value: S.hit } },
    vertexShader: `attribute vec3 aL; attribute float aFade; varying vec3 vW; varying vec3 vN; varying vec3 vL; varying float vF;
      void main(){ vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; vN = normalize(mat3(modelMatrix) * normal); vL = aL; vF = aFade; gl_Position = projectionMatrix * viewMatrix * w; }`,
    fragmentShader: `
      uniform float uSolid, uGlow, uCit, uTime; uniform vec3 uBlue, uHit;
      varying vec3 vW; varying vec3 vN; varying vec3 vL; varying float vF;
      vec3 hash3(vec3 p){ p = vec3(dot(p, vec3(127.1,311.7,74.7)), dot(p, vec3(269.5,183.3,246.1)), dot(p, vec3(113.5,271.9,124.6))); return fract(sin(p)*43758.5453); }
      float vorE(vec3 x){ vec3 p = floor(x), f = fract(x); float d1 = 8.0, d2 = 8.0;
        for (int k = -1; k <= 1; k++) for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
          vec3 b = vec3(float(i), float(j), float(k)); vec3 r = b + hash3(p + b) - f; float d = dot(r, r);
          if (d < d1) { d2 = d1; d1 = d; } else if (d < d2) { d2 = d; } }
        return sqrt(d2) - sqrt(d1); }
      float h1(vec3 p){ return fract(sin(dot(p, vec3(12.9898,78.233,37.719)))*43758.5453); }
      void main(){
        float blk = h1(floor(vL * 9.0));
        float thr = uSolid * (0.25 + 0.75 * vF) * 1.12;
        if (blk > thr) discard;
        vec3 N = normalize(vN); if (!gl_FrontFacing) N = -N;
        vec3 V = normalize(cameraPosition - vW);
        vec3 q = vL * 3.2 + 0.32 * vec3(sin(vL.y * 9.0 + vL.z * 3.0), sin(vL.z * 8.0 + vL.x * 2.0), sin(vL.x * 10.0 + vL.y * 4.0));
        float e1 = vorE(q);
        float crack = 1.0 - smoothstep(0.0, 0.026, e1);
        float halo = 1.0 - smoothstep(0.0, 0.13, e1);
        #ifdef FINE
        float fine = 1.0 - smoothstep(0.0, 0.018, vorE(vL * 8.5 + 3.7));
        #else
        float fine = 0.0;
        #endif
        vec3 Ld = normalize(vec3(-0.35, 0.8, 0.55));
        float dif = max(dot(N, Ld), 0.0);
        float spec = pow(max(dot(reflect(-Ld, N), V), 0.0), 22.0);
        float rim = pow(1.0 - max(dot(N, V), 0.0), 2.6);
        vec3 stone = vec3(0.028, 0.03, 0.036) + vec3(0.19, 0.195, 0.21) * dif + vec3(0.5) * spec * (0.45 + 0.55 * (1.0 - fine));
        float pulse = 0.72 + 0.28 * sin(uTime * 1.6 + vL.x * 4.0 + vL.y * 3.0);
        float dT = distance(vW, uHit);
        float charge = step(0.001, uCit) * (1.0 - smoothstep(uCit * 15.0 - 2.5, uCit * 15.0, dT));
        float g = (crack + fine * 0.35 + halo * 0.12) * pulse * (0.5 + 0.5 * uGlow) * (0.8 + 1.8 * charge);
        vec3 col = stone + uBlue * 2.2 * g + uBlue * 0.55 * rim * (0.25 + 0.3 * uGlow + 0.9 * charge);
        col += vec3(0.5, 0.56, 1.0) * (1.0 - smoothstep(0.0, 2.4, dT)) * uGlow * 0.85;
        col *= 0.2 + 0.8 * vF;
        col += uBlue * 1.5 * smoothstep(thr - 0.07, thr, blk) * step(0.02, uSolid);
        gl_FragColor = vec4(col, 1.0);
      }`,
    side: THREE.DoubleSide,
    defines: PHONE ? {} : { FINE: 1 }
  });
  S.stone = buildHandMeshes(HD).map(h => {
    const m = new THREE.Mesh(h.geo, stoneMat);
    m.userData.side = h.side; m.visible = false; m.frustumCulled = false;
    gateGroup.add(m);
    return m;
  });
  S.stoneMat = stoneMat;
  // blue dust along the line of the reach
  const DN = PHONE ? 260 : 520, dp = new Float32Array(DN * 3), dr = new Float32Array(DN);
  const rd = S.reachDir, pr = new THREE.Vector3(-rd.y, rd.x, 0);
  for (let i = 0; i < DN; i++) {
    const g1 = (rnd() + rnd() + rnd() - 1.5) * 9, g2 = (rnd() + rnd() + rnd() - 1.5) * 3.2 * (1 - Math.min(1, Math.abs(g1) / 14)), g3 = (rnd() - .5) * 5;
    dp[i * 3] = S.hit.x + rd.x * g1 + pr.x * g2; dp[i * 3 + 1] = S.hit.y + rd.y * g1 + pr.y * g2; dp[i * 3 + 2] = g3; dr[i] = rnd();
  }
  const dg = new THREE.BufferGeometry();
  dg.setAttribute('position', new THREE.BufferAttribute(dp, 3)); dg.setAttribute('aRand', new THREE.BufferAttribute(dr, 1));
  S.dustMat = new THREE.ShaderMaterial({
    uniforms: { uTime: U.uTime, uScale: U.uScale, uPR: U.uPR, uA: { value: 0 }, uBlue: U.uBlue, uHit: { value: S.hit }, uBurst: { value: 0 } },
    vertexShader: `attribute float aRand; uniform float uTime, uScale, uPR, uA, uBurst; uniform vec3 uHit; varying float vA; varying float vW;
      void main(){ vec3 p = position + normalize(position - uHit + vec3(0.0,0.0,0.001)) * uBurst * (4.0 + 8.0*aRand);
        p.y += sin(uTime*0.4 + aRand*30.0)*0.15; vec4 mv = modelViewMatrix*vec4(p,1.0); gl_Position = projectionMatrix*mv;
        gl_PointSize = clamp((0.035 + aRand*0.07) * uScale * uPR / -mv.z, 1.0, 10.0);
        float tw = 0.45 + 0.55*sin(uTime*(1.5 + aRand*3.0) + aRand*60.0);
        vA = uA * tw * (0.35 + 0.65*aRand) * (1.0 - smoothstep(4.0, 12.0, distance(position, uHit))*0.6); vW = step(0.9, aRand); }`,
    fragmentShader: `uniform vec3 uBlue; varying float vA; varying float vW; void main(){ vec2 c = gl_PointCoord - 0.5; if (dot(c,c) > 0.25) discard; gl_FragColor = vec4(mix(uBlue*1.5, vec3(0.8,0.85,1.0), vW), vA); }`,
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending
  });
  S.dust = new THREE.Points(dg, S.dustMat); S.dust.frustumCulled = false; S.dust.visible = false;
  gateGroup.add(S.dust);
  // the team film still, sampled into the citizens
  const teamImg = new Image();
  teamImg.onload = () => {
    const c = document.createElement('canvas'); c.width = COLS; c.height = ROWS;
    const x = c.getContext('2d');
    x.drawImage(teamImg, 0, 0, COLS, ROWS);
    let d;
    try { d = x.getImageData(0, 0, COLS, ROWS).data; } catch (e) { return; }
    for (let i = 0; i < N; i++) {
      const r0 = d[i * 4], g0 = d[i * 4 + 1], b0 = d[i * 4 + 2];
      const l = (r0 * .299 + g0 * .587 + b0 * .114) / 255;
      const v = Math.pow(l, 1.15);
      if (b0 > 110 && b0 > r0 * 1.5 && b0 > g0 * 1.5) { aCol[i * 3] = .14; aCol[i * 3 + 1] = .14; aCol[i * 3 + 2] = 1.1; }
      else { aCol[i * 3] = lerp(.03, .96, v); aCol[i * 3 + 1] = lerp(.03, .95, v); aCol[i * 3 + 2] = lerp(.06, .93, v); }
      aPhoto[i * 3 + 2] = (l - .5) * 1.6;
    }
    pg.attributes.cPhoto.needsUpdate = true;
    pg.attributes.pPhoto.needsUpdate = true;
  };
  teamImg.src = 'img/creating-tomorrow.webp';

  /* ---------- buildings ---------- */
  const boxGeo = new THREE.BoxGeometry(1, 1, 1); boxGeo.translate(0, .5, 0);
  const edgeGeo = new THREE.EdgesGeometry(boxGeo);
  const bVS = `varying vec3 vW; varying vec3 vN; varying float vY;
    void main(){ vec4 w = modelMatrix*vec4(position,1.0); vW = w.xyz; vN = normal; vY = position.y; gl_Position = projectionMatrix*viewMatrix*w; }`;
  const bFS = `
    uniform float uSeed, uHover, uTime, uDim, uLit; uniform vec3 uRoof, uBlue, uHaze;
    varying vec3 vW; varying vec3 vN; varying float vY;
    float h21(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453); }
    void main(){
      float top = step(0.5, vN.y);
      float side = step(0.5, abs(vN.x));
      vec3 base = vec3(0.075,0.075,0.09) * mix(1.0, 0.72, side) * mix(0.5, 1.0, vY);
      vec2 cell = mix(vW.xy, vW.zy, side);
      vec2 g = cell / vec2(0.36, 0.46);
      vec2 f = fract(g); vec2 id = floor(g);
      float win = step(0.22, f.x)*step(f.x, 0.78)*step(0.2, f.y)*step(f.y, 0.72);
      float r = h21(id + uSeed*7.1);
      float lit = step(1.0 - 0.22*uLit, r) * win * step(0.55, vW.y);
      float fl = 0.72 + 0.28*sin(uTime*(0.4 + r*1.8) + r*40.0);
      vec3 wc = mix(uBlue*1.25, vec3(0.96,0.95,0.93), step(0.84, h21(id*1.37 + uSeed)));
      vec3 c = base + win*0.02;
      c = mix(c, wc*fl, lit*0.92);
      c = mix(c, uRoof, top);
      c += uHover*vec3(0.05,0.05,0.14);
      c = mix(c, vec3(0.045,0.045,0.05), uDim*0.85);
      c = mix(c, uHaze, smoothstep(46.0, 125.0, length(vW - cameraPosition)) * 0.85);
      gl_FragColor = vec4(c, 1.0);
    }`;
  const weDream = () => {
    const c = document.createElement('canvas'); c.width = 900; c.height = 600;
    const x = c.getContext('2d');
    const draw = () => {
      x.fillStyle = '#1F1FFF'; x.fillRect(0, 0, 900, 600);
      x.fillStyle = '#F4F2EE'; x.font = '900 150px "Schibsted Grotesk", Arial, sans-serif'; x.textBaseline = 'alphabetic';
      x.fillText('WE DO', 60, 250); x.fillText('DREAMS', 60, 400);
      x.font = '500 44px Handjet, Arial, sans-serif'; x.fillText('PRUDENTIAL ZENITH LIFE', 64, 520);
    };
    draw();
    const tx = new THREE.CanvasTexture(c);
    if (document.fonts && document.fonts.load) Promise.all([document.fonts.load('900 150px "Schibsted Grotesk"'), document.fonts.load('500 44px Handjet')]).then(() => { draw(); tx.needsUpdate = true; }).catch(() => {});
    tx.userData = { ar: 1.5 };
    return tx;
  };
  CASES.forEach(c => {
    const mat = new THREE.ShaderMaterial({
      uniforms: { uSeed: { value: c.i + 1 }, uHover: { value: 0 }, uTime: U.uTime, uDim: { value: 0 }, uLit: { value: c.f ? 1 : .6 }, uRoof: { value: c.f ? COL.blue : new THREE.Color('#1A1A21') }, uBlue: U.uBlue, uHaze: { value: new THREE.Color('#0B0B1C') } },
      vertexShader: bVS, fragmentShader: bFS
    });
    const m = new THREE.Mesh(boxGeo, mat);
    m.position.set(c.x, 0, c.z);
    m.scale.set(c.fp, .001, c.fp);
    m.visible = false;
    m.userData.i = c.i;
    const edges = new THREE.LineSegments(edgeGeo, new THREE.LineBasicMaterial({ color: COL.blue, transparent: true, opacity: .55 }));
    m.add(edges);
    cityGroup.add(m);
    pickables.push(m);
    let map, ar = 1.6;
    if (c.img) map = tex(c.img, tx => { poster.userData.ar = tx.image.width / tx.image.height; });
    else { map = weDream(); ar = 1.5; }
    const pm = tornMat({ map, seed: c.i * 3.7 + 2, tear: c.f ? .75 : .45, bg: COL.ink });
    const poster = new THREE.Mesh(planeGeo, pm);
    poster.userData = { i: c.i, ar };
    poster.visible = false;
    cityGroup.add(poster);
    pickables.push(poster);
    B.push({ c, m, edges, poster, cur: 0, lift: 0, hov: 0, dim: 0, rev: 0 });
  });
  // district names set on the street grid, in the pixel face
  const groundMeshes = [];
  const drawGround = () => {
    groundMeshes.forEach(g => {
      const x = g.cv.getContext('2d');
      x.clearRect(0, 0, g.cv.width, g.cv.height);
      x.fillStyle = '#F4F2EE';
      x.textBaseline = 'alphabetic';
      x.font = '600 120px Handjet, "Arial Narrow", sans-serif';
      try { x.letterSpacing = '4px'; } catch (e) {}
      const label = g.name.toUpperCase();
      const tw = x.measureText(label + '  ' + g.n).width;
      const x0 = Math.max(8, (g.cv.width - tw) / 2);
      x.fillText(label, x0, 170);
      x.fillStyle = '#A9ABFF';
      x.fillText(g.n, x0 + x.measureText(label + '  ').width, 170);
      g.tex.needsUpdate = true;
    });
  };
  Object.entries(DISTRICTS).forEach(([k, d]) => {
    const xs = CASES.filter(c => c.d === k).map(c => c.x);
    const minX = Math.min(...xs) - 1.7, maxX = Math.max(...xs) + 1.7, w = Math.max(6.4, maxX - minX);
    const cv = document.createElement('canvas');
    const ratio = 8; cv.width = 2048; cv.height = 256;
    const texG = new THREE.CanvasTexture(cv);
    texG.anisotropy = maxAniso;
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, w / ratio), new THREE.MeshBasicMaterial({ map: texG, transparent: true, opacity: 0, depthWrite: false }));
    m.rotation.x = -Math.PI / 2;
    m.position.set((minX + maxX) / 2, .05, G / 2 + 3.9 + w / ratio / 2);
    cityGroup.add(m);
    groundMeshes.push({ k, m, cv, tex: texG, name: d.name, n: String(d.n).padStart(2, '0') });
  });
  S.ground = groundMeshes;
  drawGround();
  if (document.fonts && document.fonts.load) document.fonts.load('600 180px Handjet').then(drawGround).catch(() => {});

  // blue tape for the collage
  [[-11.4, 11.6, .9, -.4], [5.2, 12.3, -.3, .35], [-1.1, 6.6, 1.6, .22], [9.3, 5.2, 1.2, -.25]].forEach(tp => {
    const m = new THREE.Mesh(planeGeo, new THREE.MeshBasicMaterial({ color: COL.blue, transparent: true, opacity: 0, depthWrite: false }));
    m.position.set(tp[0], tp[1], tp[2]); m.rotation.z = tp[3]; m.scale.set(2.2, .55, 1);
    gateGroup.add(m); tapes.push(m);
  });

  /* ---------- Onga world ---------- */
  const OL = [
    { img: 'onga238371.webp', ar: 1.5, w: 40, p: [0, 3, -30], r: 0, dim: .38 },
    { img: 'onga239617.webp', ar: 1.25, w: 15, p: [-10.5, 2.5, -17], r: .045, dim: .14 },
    { img: 'onga238347.webp', ar: 1.5, w: 13, p: [10.5, 3.5, -13], r: -.05, dim: .1 },
    { img: 'onga238342.webp', ar: 1.5, w: 16, p: [-2, -4, -5], r: .02, dim: 0 },
    { img: 'onga-table-post.webp', ar: 506 / 900, w: 4.6, p: [10.5, -1, 1.5], r: -.06, dim: 0 },
    { img: 'onga-responses-post.webp', ar: .8, w: 5.4, p: [-11, .5, 2.5], r: .07, dim: 0 }
  ];
  OL.forEach((o, k) => {
    const mt = tornMat({ map: tex(o.img), seed: k * 5.3 + 1, tear: 1, lens: true, dim: o.dim, bg: COL.onga.clone() });
    const m = new THREE.Mesh(planeGeo, mt);
    const h = o.w / o.ar;
    m.scale.set(o.w, h, 1); mt.uniforms.uSize.value.set(o.w, h);
    m.position.set(o.p[0], o.p[1], o.p[2]); m.rotation.z = o.r;
    m.userData.base = m.position.clone();
    ongaGroup.add(m); ongaLayers.push(m);
  });
  [[-5, 6.4, -4.9, .5, COL.yellow], [7.4, 9.6, -12.9, -.3, COL.blue], [11.6, 2.9, 1.6, .28, COL.yellow]].forEach(tp => {
    const m = new THREE.Mesh(planeGeo, new THREE.MeshBasicMaterial({ color: tp[4], transparent: true, opacity: .92 }));
    m.position.set(tp[0], tp[1], tp[2]); m.rotation.z = tp[3]; m.scale.set(2.6, .6, 1);
    ongaGroup.add(m);
  });
  // the visitor's answer, on torn paper
  const ac = document.createElement('canvas'); ac.width = 1024; ac.height = 380;
  answerTex = new THREE.CanvasTexture(ac);
  const am = tornMat({ map: answerTex, seed: 9.1, tear: .7, lens: true, bg: COL.onga.clone() });
  answer = new THREE.Mesh(planeGeo, am);
  answer.scale.set(7.2, 7.2 * 380 / 1024, 1); am.uniforms.uSize.value.set(7.2, 7.2 * 380 / 1024);
  answer.position.set(-.6, -1.4, -2.2); answer.rotation.z = .03;
  answer.visible = false;
  ongaGroup.add(answer);
  S.drawAnswer = word => {
    const x = ac.getContext('2d');
    x.fillStyle = '#F4F2EE'; x.fillRect(0, 0, 1024, 380);
    x.fillStyle = '#1F1FFF'; x.font = '500 40px Handjet, Arial, sans-serif'; x.textBaseline = 'alphabetic';
    x.fillText('HOME, IN ONE WORD', 64, 76);
    let fs = 150;
    x.fillStyle = '#0A0A0A'; x.font = `800 ${fs}px "Schibsted Grotesk", Arial, sans-serif`;
    while (x.measureText(word).width > 900 && fs > 44) { fs -= 6; x.font = `800 ${fs}px "Schibsted Grotesk", Arial, sans-serif`; }
    x.fillText(word, 60, 200 + fs * .36);
    answerTex.needsUpdate = true;
  };
  // Onga yellow: steam and spice
  const SN = PHONE ? 180 : 320;
  const sp = new Float32Array(SN * 3), sr = new Float32Array(SN);
  for (let i = 0; i < SN; i++) { sp[i * 3] = (rnd() - .5) * 34; sp[i * 3 + 1] = (rnd() - .5) * 20; sp[i * 3 + 2] = -22 + rnd() * 30; sr[i] = rnd(); }
  const sg = new THREE.BufferGeometry();
  sg.setAttribute('position', new THREE.BufferAttribute(sp, 3));
  sg.setAttribute('aRand', new THREE.BufferAttribute(sr, 1));
  spiceMat = new THREE.ShaderMaterial({
    uniforms: { uTime: U.uTime, uScale: U.uScale, uPR: U.uPR, uLens: U.uLens, uY: { value: COL.yellow }, uBlue: U.uBlue, uDrift: { value: RM ? 0 : 1 } },
    vertexShader: `attribute float aRand; uniform float uTime, uScale, uPR, uDrift; varying float vA;
      void main(){ vec3 p = position; p.y = mod(p.y + 10.0 + uTime*(0.25 + aRand*0.5)*uDrift, 20.0) - 10.0; p.x += sin(uTime*0.4 + aRand*30.0)*0.6*uDrift;
        vec4 mv = modelViewMatrix*vec4(p,1.0); gl_Position = projectionMatrix*mv;
        gl_PointSize = clamp((0.08 + aRand*0.14) * uScale * uPR / -mv.z, 1.0, 26.0);
        vA = (0.35 + 0.6*aRand) * smoothstep(-10.0, -6.0, p.y) * (1.0 - smoothstep(6.0, 10.0, p.y)); }`,
    fragmentShader: `uniform vec3 uY, uBlue; uniform float uLens; varying float vA; void main(){ gl_FragColor = vec4(mix(uY, uBlue*1.3, uLens), vA); }`,
    transparent: true, depthWrite: false
  });
  spice = new THREE.Points(sg, spiceMat);
  spice.frustumCulled = false;
  ongaGroup.add(spice);

  /* ---------- the Capitol ---------- */
  capGroup = new THREE.Group(); capGroup.visible = false; scene.add(capGroup);
  scene.add(new THREE.HemisphereLight(0xffffff, 0x1a1a44, 1.0));
  const dl = new THREE.DirectionalLight(0xffffff, .55); dl.position.set(6, 12, 10); scene.add(dl);
  const MW = 30, MH = 30 * 1094 / 1600;
  const muralMat = tornMat({ map: tex('lagos-collage.webp'), seed: 4.2, tear: 1.3, bg: COL.ink });
  muralMat.uniforms.uSize.value.set(MW, MH);
  mural = new THREE.Mesh(planeGeo, muralMat);
  mural.scale.set(MW, MH, 1);
  mural.userData.y = MH / 2 + .15;
  mural.position.set(0, mural.userData.y, -14);
  capGroup.add(mural);
  beam = new THREE.Mesh(new THREE.CylinderGeometry(.07, .07, 40, 8, 1, true), new THREE.MeshBasicMaterial({ color: COL.blue, transparent: true, opacity: 0, depthWrite: false }));
  beam.position.set(G / 2, 20, G / 2);
  capGroup.add(beam);
  S.vox = { done: true };
  updateVox = () => true;

  /* ---------- the Cowbell world: Sahoor to Iftar ---------- */
  cbGroup = new THREE.Group(); cbGroup.visible = false; scene.add(cbGroup);
  const skyMat = new THREE.ShaderMaterial({
    uniforms: { uTop: { value: new THREE.Color() }, uHor: { value: new THREE.Color() }, uSun: { value: new THREE.Vector2(.7, .2) }, uSunA: { value: 0 }, uMoonA: { value: 1 }, uStars: { value: 1 }, uTime: U.uTime, uLens: U.uLens, uInk: U.uInk, uBlue: U.uBlue },
    vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: `
      uniform vec3 uTop, uHor, uInk, uBlue; uniform vec2 uSun; uniform float uSunA, uMoonA, uStars, uTime, uLens; varying vec2 vUv;
      float h(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
      void main(){
        vec3 c = mix(uHor, uTop, smoothstep(0.18, 0.8, vUv.y));
        vec2 a = vec2(2.0, 1.0);
        float d = distance(vUv * a, uSun * a);
        c += vec3(1.0, 0.86, 0.6) * (smoothstep(0.035, 0.028, d) * 1.2 + exp(-d * 7.0) * 0.45) * uSunA;
        vec2 mp = vec2(0.24, 0.72) * a;
        float m1 = distance(vUv * a, mp), m2 = distance(vUv * a, mp + vec2(0.012, 0.006));
        c += vec3(0.95, 0.93, 0.85) * smoothstep(0.024, 0.02, m1) * (1.0 - smoothstep(0.022, 0.018, m2)) * uMoonA;
        c += vec3(0.8, 0.82, 1.0) * exp(-m1 * 14.0) * 0.18 * uMoonA;
        vec2 g = floor(vUv * vec2(420.0, 210.0));
        float st = step(0.9965, h(g)) * smoothstep(0.35, 0.9, vUv.y) * (0.6 + 0.4 * sin(uTime * 2.0 + h(g + 3.0) * 30.0));
        c += st * uStars;
        c = mix(c, mix(uInk, uBlue * 0.35, smoothstep(0.1, 0.9, vUv.y)), uLens);
        gl_FragColor = vec4(c, 1.0);
      }`,
    depthWrite: false
  });
  const sky = new THREE.Mesh(new THREE.PlaneGeometry(420, 210), skyMat);
  sky.position.set(0, 40, -90); sky.renderOrder = -3;
  cbGroup.add(sky);
  const floorMat = new THREE.MeshBasicMaterial({ color: 0x0b0e24 });
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(400, 260), floorMat);
  floor.rotation.x = -Math.PI / 2; floor.position.set(0, 0, -40);
  cbGroup.add(floor);
  // the arches: the case film's own frames, day by day
  const ARCH = [
    { img: 'cb-01.webp', x: 5, z: 23, w: 7.6, h: 9.6, fx: .5, tt: 0 },
    { img: 'cb-02.webp', x: 7.5, z: 2, w: 6, h: 7.8, fx: .74, tt: .12 },
    { img: 'cb-11.webp', x: -8, z: -3, w: 6, h: 7.8, fx: .6, tt: .2 },
    { img: 'cb-07.webp', x: 8, z: -10, w: 5.6, h: 7.3, fx: .74, tt: .36 },
    { img: 'cb-08.webp', x: -8.5, z: -13, w: 5.6, h: 7.3, fx: .75, tt: .46 },
    { img: 'cb-06.webp', x: 7.5, z: -22, w: 5.4, h: 7, fx: .74, tt: .6 },
    { img: 'cb-iftar.webp', x: 0, z: -40, w: 13, h: 14.6, fx: .5, tt: .8 }
  ];
  S.arches = ARCH.map((a, k) => {
    const mt = tornMat({ map: tex(a.img), seed: k + 1, lens: true, arch: true, bg: new THREE.Color('#0b0e24') });
    mt.uniforms.uSize.value.set(a.w, a.h);
    const panelAR = a.w / a.h, imgAR = 16 / 9;
    mt.uniforms.uUvScale.value.set(panelAR / imgAR, 1);
    mt.uniforms.uUvOff.value.set(clamp(a.fx - .5, -(1 - panelAR / imgAR) / 2, (1 - panelAR / imgAR) / 2), 0);
    const m = new THREE.Mesh(planeGeo, mt);
    m.scale.set(a.w, a.h, 1);
    m.position.set(a.x, a.h / 2, a.z);
    m.rotation.y = a.x === 0 ? 0 : -Math.sign(a.x) * .22;
    m.userData = a;
    cbGroup.add(m);
    return m;
  });
  // the month, filling: a row of 30 day tiles
  const tc = document.createElement('canvas'); tc.width = 3000; tc.height = 128;
  const drawTiles = () => {
    const x = tc.getContext('2d');
    x.clearRect(0, 0, 3000, 128);
    x.fillStyle = '#fff'; x.textAlign = 'center'; x.textBaseline = 'middle';
    x.font = '600 34px Handjet, "Arial Narrow", sans-serif';
    for (let i = 0; i < 30; i++) { x.fillText('DAY', i * 100 + 50, 42); x.font = '700 46px Handjet, "Arial Narrow", sans-serif'; x.fillText(String(i + 1).padStart(2, '0'), i * 100 + 50, 88); x.font = '600 34px Handjet, "Arial Narrow", sans-serif'; }
    tileTex.needsUpdate = true;
  };
  const tileTex = new THREE.CanvasTexture(tc);
  drawTiles();
  if (document.fonts && document.fonts.load) document.fonts.load('700 46px Handjet').then(drawTiles).catch(() => {});
  S.tileMat = new THREE.ShaderMaterial({
    uniforms: { map: { value: tileTex }, uLit: { value: 0 }, uFlash: { value: 0 }, uOp: { value: 0 }, uLens: U.uLens, uBlue: U.uBlue, uTime: U.uTime },
    vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: `
      uniform sampler2D map; uniform float uLit, uFlash, uLens, uTime, uOp; uniform vec3 uBlue; varying vec2 vUv;
      void main(){
        float fx = fract(vUv.x * 30.0), idx = floor(vUv.x * 30.0);
        if (fx < 0.06 || fx > 0.94 || vUv.y < 0.04 || vUv.y > 0.96) discard;
        float lit = clamp(uLit - idx, 0.0, 1.0);
        lit = max(lit, uFlash * (0.6 + 0.4 * sin(uTime * 6.0 - idx * 0.5)));
        vec3 off = vec3(0.07, 0.08, 0.16), on = vec3(0.96, 0.77, 0.35);
        float txt = texture2D(map, vUv).a;
        vec3 bg = mix(off, on, lit);
        vec3 fg = mix(vec3(0.35, 0.37, 0.52), vec3(0.08, 0.06, 0.04), lit);
        vec3 c = mix(bg, fg, txt);
        c = mix(c, mix(vec3(0.02, 0.02, 0.1), uBlue * 1.2, lit), uLens);
        gl_FragColor = vec4(c, 0.92 * uOp);
      }`,
    transparent: true
  });
  const tiles = new THREE.Mesh(new THREE.PlaneGeometry(26, 1.12), S.tileMat);
  tiles.rotation.x = -1.05; tiles.scale.set(.46, 1.5, 1); tiles.position.set(6.2, .45, -31);
  cbGroup.add(tiles);
  // warm motes rising, like steam over the first cup
  const MN = PHONE ? 160 : 300, mp = new Float32Array(MN * 3), mr = new Float32Array(MN);
  for (let i = 0; i < MN; i++) { mp[i * 3] = (rnd() - .5) * 36; mp[i * 3 + 1] = rnd() * 16; mp[i * 3 + 2] = -44 + rnd() * 64; mr[i] = rnd(); }
  const mg = new THREE.BufferGeometry();
  mg.setAttribute('position', new THREE.BufferAttribute(mp, 3)); mg.setAttribute('aRand', new THREE.BufferAttribute(mr, 1));
  S.moteMat = new THREE.ShaderMaterial({
    uniforms: { uTime: U.uTime, uScale: U.uScale, uPR: U.uPR, uLens: U.uLens, uBlue: U.uBlue, uCol: { value: new THREE.Color('#F5C45A') }, uDrift: { value: RM ? 0 : 1 } },
    vertexShader: `attribute float aRand; uniform float uTime, uScale, uPR, uDrift; varying float vA;
      void main(){ vec3 p = position; p.y = mod(p.y + uTime * (0.2 + aRand * 0.4) * uDrift, 16.0); p.x += sin(uTime * 0.3 + aRand * 20.0) * 0.5 * uDrift;
        vec4 mv = modelViewMatrix * vec4(p, 1.0); gl_Position = projectionMatrix * mv;
        gl_PointSize = clamp((0.05 + aRand * 0.09) * uScale * uPR / -mv.z, 1.0, 16.0);
        vA = (0.25 + 0.6 * aRand) * smoothstep(0.0, 2.0, p.y) * (1.0 - smoothstep(12.0, 16.0, p.y)); }`,
    fragmentShader: `uniform vec3 uCol, uBlue; uniform float uLens; varying float vA; void main(){ vec2 c = gl_PointCoord - 0.5; if (dot(c, c) > 0.25) discard; gl_FragColor = vec4(mix(uCol, uBlue * 1.3, uLens), vA); }`,
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending
  });
  const motes = new THREE.Points(mg, S.moteMat); motes.frustumCulled = false;
  cbGroup.add(motes);
  S.sky = skyMat; S.floorMat = floorMat; S.cbBg = new THREE.Color('#0B1033');

  /* ---------- the Spruce world: a painted set ---------- */
  spGroup = new THREE.Group(); spGroup.visible = false; scene.add(spGroup);
  S.spBg = new THREE.Color('#0E0E10');
  S.spCols = SPC.map(o => new THREE.Color(o.c));
  const spU = { uA: { value: new THREE.Color() }, uB: { value: new THREE.Color() }, uP: { value: 0 }, uLens: U.uLens, uBlue: U.uBlue, uInk: U.uInk, uPaper: U.uPaper, uFrame: { value: new THREE.Vector3(4, 6.4, 5) } };
  S.spU = spU;
  const wallFS = `
    uniform vec3 uA, uB, uBlue, uInk, uPaper, uFrame; uniform float uP, uLens, uFloor; varying vec3 vW;
    float h1(float n){ return fract(sin(n) * 43758.5453123); }
    float n1(float x){ float i = floor(x), f = fract(x); return mix(h1(i), h1(i + 1.0), f * f * (3.0 - 2.0 * f)); }
    float by2(vec2 a){ a = floor(a); return fract(a.x / 2.0 + a.y * a.y * 0.75); }
    float by4(vec2 a){ return by2(0.5 * a) * 0.25 + by2(a); }
    void main(){
      // one coordinate runs left wall → back wall → right wall, so the paint sweeps the whole set
      float L;
      if (uFloor > 0.5) L = (36.0 + vW.x) / 72.0;
      else if (vW.x < -15.9) L = (12.0 - vW.z) / 72.0;
      else if (vW.x > 15.9) L = (60.0 + vW.z) / 72.0;
      else L = (36.0 + vW.x) / 72.0;
      L = clamp(L, 0.0, 1.0);
      float wob = (n1(vW.y * 1.1 + vW.z * 0.3) - 0.5) * 0.014 + (n1(vW.y * 7.0) - 0.5) * 0.004;
      if (uFloor > 0.5) wob = (n1(vW.z * 0.9) - 0.5) * 0.02;
      float e = L - (uP * 1.1 - 0.05) + wob;
      float painted = 1.0 - smoothstep(-0.0015, 0.0015, e);
      vec3 c = mix(uA, uB, painted);
      float wet = (1.0 - smoothstep(0.0, 0.03, -e)) * painted * step(0.001, uP) * step(uP, 0.999);
      float line = 1.0 - smoothstep(0.0, 0.0022, abs(e));
      float streak = 1.0 + (n1(vW.x * 5.0 + vW.z * 5.0) - 0.5) * 0.035 * painted;
      if (uFloor > 0.5) {
        float wd = min(min(vW.x + 16.0, 16.0 - vW.x), vW.z + 8.0);
        c *= (0.52 + 0.12 * smoothstep(-8.0, 14.0, vW.z)) * (0.8 + 0.2 * smoothstep(0.0, 2.5, wd));
      } else {
        float y = vW.y;
        float k = 0.7 + 0.36 * smoothstep(0.0, 6.5, y) - 0.5 * smoothstep(9.5, 17.0, y);
        float cd = vW.x < -15.9 || vW.x > 15.9 ? vW.z + 8.0 : 16.0 - abs(vW.x);
        k *= 0.72 + 0.28 * smoothstep(0.0, 3.2, cd);
        k *= 0.84 + 0.16 * smoothstep(0.0, 1.4, y);
        vec2 fd = (vW.xy - uFrame.xy) / vec2(9.0, 6.0);
        k += 0.16 * exp(-dot(fd, fd)) * step(vW.z, -7.9) * step(abs(vW.x), 15.9);
        c *= k * streak;
      }
      c += vec3(0.07) * wet;
      c *= 1.0 - 0.3 * line * step(0.001, uP) * step(uP, 0.999);
      float l = dot(c, vec3(0.299, 0.587, 0.114));
      l = clamp((l - 0.5) * 1.7 + 0.52, 0.0, 1.0);
      vec3 lc = mix(uInk, uBlue, step(by4(gl_FragCoord.xy / 3.0), l * 0.8));
      gl_FragColor = vec4(mix(c, lc, uLens), 1.0);
    }`;
  const wallVS = `varying vec3 vW; void main(){ vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`;
  const wallM = new THREE.ShaderMaterial({ uniforms: Object.assign({ uFloor: { value: 0 } }, spU), vertexShader: wallVS, fragmentShader: wallFS, side: THREE.DoubleSide });
  const floorM = new THREE.ShaderMaterial({ uniforms: Object.assign({ uFloor: { value: 1 } }, spU), vertexShader: wallVS, fragmentShader: wallFS, side: THREE.DoubleSide });
  const back = new THREE.Mesh(new THREE.PlaneGeometry(32, 17), wallM); back.position.set(0, 8.5, -8);
  const lw = new THREE.Mesh(new THREE.PlaneGeometry(40, 17), wallM); lw.rotation.y = Math.PI / 2; lw.position.set(-16, 8.5, 12);
  const rw = new THREE.Mesh(new THREE.PlaneGeometry(40, 17), wallM); rw.rotation.y = -Math.PI / 2; rw.position.set(16, 8.5, 12);
  const fl = new THREE.Mesh(new THREE.PlaneGeometry(32, 40), floorM); fl.rotation.x = -Math.PI / 2; fl.position.set(0, 0, 12);
  spGroup.add(back, lw, rw, fl);
  // the portrait on the back wall: two stacked pictures cross-fade between personalities
  const shadowM = new THREE.ShaderMaterial({
    uniforms: { uOp: { value: 1 } },
    vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: `uniform float uOp; varying vec2 vUv; void main(){ vec2 d = max(abs(vUv - 0.5) - vec2(0.38, 0.36), 0.0) / vec2(0.12, 0.14); gl_FragColor = vec4(0.0, 0.0, 0.0, 0.5 * uOp * (1.0 - smoothstep(0.0, 1.0, length(d)))); }`,
    transparent: true, depthWrite: false
  });
  const mkPic = (z, seed) => {
    const g = new THREE.Group();
    const sh = new THREE.Mesh(planeGeo, shadowM.clone()); sh.position.set(.28, -.42, -.02); g.add(sh);
    const bd = new THREE.Mesh(planeGeo, new THREE.MeshBasicMaterial({ color: 0x0c0c0c, transparent: true })); bd.position.z = -.01; g.add(bd);
    const pm = tornMat({ map: null, seed, torn: 0, lens: true }); pm.depthWrite = false;
    const pic = new THREE.Mesh(planeGeo, pm); g.add(pic);
    g.position.set(4, 6.4, z);
    g.userData = { sh, bd, pic, idx: -1 };
    spGroup.add(g);
    return g;
  };
  S.spPics = [mkPic(-7.9, 3), mkPic(-7.86, 5)];
  SPC.forEach(o => { o.tex = tex(o.img); });
  S.spSetPic = (g, i) => {
    const u = g.userData; if (u.idx === i) return; u.idx = i;
    const o = SPC[i], hgt = o.a < 1 ? 8.4 : 7.4, w = hgt * o.a;
    const pu = u.pic.material.uniforms; pu.map.value = o.tex; pu.uHasMap.value = 1;
    u.pic.scale.set(w, hgt, 1); u.bd.scale.set(w + .32, hgt + .32, 1); u.sh.scale.set(w + 2.4, hgt + 2.4, 1);
    g.userData.h = hgt;
  };
  S.spPicOp = (g, op) => {
    const u = g.userData;
    u.pic.material.uniforms.uOpacity.value = op; u.bd.material.opacity = op; u.sh.material.uniforms.uOp.value = op;
    g.visible = op > .005;
  };
  // the digital layer: creator debates and AI rooms pinned to the wall
  const MB = [
    { img: 'sp-clip-plug.webp', x: 3.1, w: 3.1, h: 5.5, d: 0 },
    { img: 'sp-clip-lawyer.webp', x: 6.6, w: 3.1, h: 5.5, d: .06 },
    { img: 'sp-room-pink.webp', x: 10.3, w: 3.7, h: 5.5, d: .12 },
    { img: 'sp-room-green.webp', x: 14.1, w: 3.7, h: 5.5, d: .18 }
  ];
  S.spMB = MB.map((m, k) => {
    const g = new THREE.Group();
    const sh = new THREE.Mesh(planeGeo, shadowM.clone()); sh.scale.set(m.w + 2, m.h + 2, 1); sh.position.set(.22, -.34, -.02); g.add(sh);
    const pm = tornMat({ map: tex(m.img), seed: 20 + k, torn: 0, lens: true }); pm.depthWrite = false;
    const pic = new THREE.Mesh(planeGeo, pm); pic.scale.set(m.w, m.h, 1); g.add(pic);
    g.position.set(m.x, 6.6, -7.88); g.userData = Object.assign({ sh, pic }, m); g.visible = false;
    spGroup.add(g);
    return g;
  });

  /* ---------- the Prudential Zenith world: the road to 2066 ---------- */
  pzGroup = new THREE.Group(); pzGroup.visible = false; scene.add(pzGroup);
  S.pzBg = new THREE.Color('#0B0B16');
  const pzU = { uTop: { value: new THREE.Color('#0D0B1E') }, uHor: { value: new THREE.Color('#6E2A3A') }, uDawn: { value: 0 }, uNight: { value: 0 }, uTime: U.uTime, uLens: U.uLens, uInk: U.uInk, uBlue: U.uBlue, uCam: { value: new THREE.Vector3() } };
  S.pzU = pzU;
  const ditherGL = `float by2(vec2 a){ a = floor(a); return fract(a.x / 2.0 + a.y * a.y * 0.75); }
    float by4(vec2 a){ return by2(0.5 * a) * 0.25 + by2(a); }
    vec3 lensOf(vec3 c){ float l = dot(c, vec3(0.299, 0.587, 0.114)); l = clamp((l - 0.5) * 1.7 + 0.52, 0.0, 1.0); return mix(uInk, uBlue, step(by4(gl_FragCoord.xy / 3.0), l)); }
    float hh(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }`;
  const pzSky = new THREE.Mesh(new THREE.PlaneGeometry(1400, 420), new THREE.ShaderMaterial({
    uniforms: pzU,
    vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: `uniform vec3 uTop, uHor, uInk, uBlue; uniform float uDawn, uNight, uTime, uLens; varying vec2 vUv;
      ${ditherGL}
      void main(){
        float y = vUv.y;
        vec3 c = mix(uHor, uTop, smoothstep(0.02, 0.55, y));
        float d = distance(vUv * vec2(3.3, 1.0), vec2(1.65, 0.0));
        c += vec3(1.0, 0.72, 0.42) * exp(-d * 6.0) * 0.55 * uDawn;
        c += vec3(1.0, 0.85, 0.6) * smoothstep(0.045, 0.035, distance(vUv * vec2(3.3, 1.0), vec2(1.65, 0.035 + 0.05 * uDawn))) * uDawn;
        vec2 g = floor(vUv * vec2(900.0, 270.0));
        c += step(0.9972, hh(g)) * smoothstep(0.2, 0.7, y) * (0.55 + 0.45 * sin(uTime * 2.0 + hh(g + 5.0) * 40.0)) * uNight;
        gl_FragColor = vec4(mix(c, lensOf(c) * 0.6, uLens), 1.0);
      }`,
    depthWrite: false
  }));
  pzSky.position.set(0, 190, -420); pzSky.renderOrder = -3; S.pzSky = pzSky;
  pzGroup.add(pzSky);
  // a Lagos skyline on the horizon, windows lit
  const pzCity = new THREE.Mesh(new THREE.PlaneGeometry(900, 60), new THREE.ShaderMaterial({
    uniforms: pzU,
    vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: `uniform vec3 uTop, uHor, uInk, uBlue; uniform float uDawn, uNight, uLens; varying vec2 vUv;
      ${ditherGL}
      void main(){
        float x = vUv.x * 900.0, col = floor(x / 7.0);
        float hgt = 0.08 + 0.5 * pow(hh(vec2(col, 1.0)), 2.2) + (abs(vUv.x - 0.5) < 0.04 ? 0.25 * hh(vec2(col, 7.0)) : 0.0);
        if (vUv.y > hgt) discard;
        vec3 c = mix(uHor, uTop, 0.5) * 0.28;
        vec2 wg = vec2(floor(x / 1.2), floor(vUv.y * 60.0 / 1.4));
        float lit = step(0.72, hh(wg + col)) * step(0.3, fract(x / 1.2)) * step(0.35, fract(vUv.y * 60.0 / 1.4));
        c += vec3(1.0, 0.78, 0.45) * lit * 0.55 * (0.4 + 0.6 * uNight);
        c = mix(c, uHor * 0.9, 0.35);
        gl_FragColor = vec4(mix(c, lensOf(c) * 0.7, uLens), 1.0);
      }`
  }));
  pzCity.position.set(0, 0, -390); S.pzCity = pzCity;
  pzGroup.add(pzCity);
  // the road: asphalt, lane dashes, black-and-white kerbs, pools of lamplight
  const pzRoad = new THREE.Mesh(new THREE.PlaneGeometry(1400, 520), new THREE.ShaderMaterial({
    uniforms: pzU,
    vertexShader: `varying vec3 vW; void main(){ vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,
    fragmentShader: `uniform vec3 uTop, uHor, uInk, uBlue, uCam; uniform float uLens, uNight, uDawn; varying vec3 vW;
      ${ditherGL}
      void main(){
        float ax = abs(vW.x), z = vW.z;
        vec3 c = vec3(0.075, 0.075, 0.09) * (0.85 + 0.3 * hh(floor(vW.xz * 6.0)));
        float dash = step(0.5, fract(z / 9.0)) * (1.0 - smoothstep(0.1, 0.16, abs(ax - 3.4)));
        float edge = 1.0 - smoothstep(0.09, 0.15, abs(ax - 9.3));
        c = mix(c, vec3(0.78), max(dash, edge) * 0.85);
        if (ax > 9.9 && ax < 10.6) c = mix(vec3(0.06), vec3(0.8), step(0.5, fract(z / 2.4)));
        if (ax >= 10.6 && ax < 15.0) c = vec3(0.19, 0.19, 0.21) * (0.9 + 0.2 * hh(floor(vW.xz * 1.5)));
        if (ax >= 15.0) c = vec3(0.05, 0.055, 0.06);
        float lz = fract((z + 14.0) / 28.0) - 0.5;
        float pool = exp(-lz * lz * 28.0) * exp(-pow(ax - 8.5, 2.0) / 30.0);
        c += vec3(1.0, 0.72, 0.42) * pool * 0.32 * (0.35 + 0.65 * uNight);
        c *= 0.75 + 0.35 * uDawn;
        float dist = distance(vW, uCam);
        c = mix(c, uHor * 0.75, smoothstep(40.0, 330.0, dist));
        gl_FragColor = vec4(mix(c, lensOf(c) * 0.8, uLens), 1.0);
      }`
  }));
  pzRoad.rotation.x = -Math.PI / 2; pzRoad.position.set(0, 0, -170);
  pzGroup.add(pzRoad);
  // street lamps every 28 units on both sides
  const lampZ = []; for (let z = 42; z > -400; z -= 28) lampZ.push(z);
  const poleGeo = new THREE.BoxGeometry(.22, 9, .22);
  const poles = new THREE.InstancedMesh(poleGeo, new THREE.MeshBasicMaterial({ color: 0x1a1a22 }), lampZ.length * 2);
  const lp = [], M4p = new THREE.Matrix4();
  lampZ.forEach((z, k) => [-1, 1].forEach((sd, j) => {
    M4p.makeTranslation(sd * 11, 4.5, z); poles.setMatrixAt(k * 2 + j, M4p);
    lp.push(sd * 10.2, 9, z);
  }));
  pzGroup.add(poles);
  const lg = new THREE.BufferGeometry(); lg.setAttribute('position', new THREE.Float32BufferAttribute(lp, 3));
  S.pzLampMat = new THREE.ShaderMaterial({
    uniforms: { uScale: U.uScale, uPR: U.uPR, uLens: U.uLens, uBlue: U.uBlue, uOn: { value: 1 } },
    vertexShader: `uniform float uScale, uPR; void main(){ vec4 mv = modelViewMatrix * vec4(position, 1.0); gl_Position = projectionMatrix * mv; gl_PointSize = clamp(1.1 * uScale * uPR / -mv.z, 2.0, 90.0); }`,
    fragmentShader: `uniform vec3 uBlue; uniform float uLens, uOn; void main(){ float d = length(gl_PointCoord - 0.5); float a = exp(-d * d * 22.0) + 0.5 * smoothstep(0.12, 0.0, d); gl_FragColor = vec4(mix(vec3(1.0, 0.78, 0.5), uBlue * 1.4, uLens) * a * uOn, 1.0); }`,
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending
  });
  const lamps = new THREE.Points(lg, S.pzLampMat); lamps.frustumCulled = false;
  pzGroup.add(lamps);
  // traffic: tail lights leaving, headlights arriving
  const CN = PHONE ? 26 : 44, cp = [], cr = [], ct = [];
  for (let i = 0; i < CN; i++) {
    const head = i % 3 === 0 ? 1 : 0, lane = head ? -(1.7 + 3.4 * (i % 2)) : (1.7 + 3.4 * ((i >> 1) % 2)), off = rnd() * 440;
    [-.45, .45].forEach(dx => { cp.push(lane + dx, .75, 0); cr.push(off); ct.push(head); });
  }
  const cg = new THREE.BufferGeometry();
  cg.setAttribute('position', new THREE.Float32BufferAttribute(cp, 3)); cg.setAttribute('aOff', new THREE.Float32BufferAttribute(cr, 1)); cg.setAttribute('aHead', new THREE.Float32BufferAttribute(ct, 1));
  S.pzCarMat = new THREE.ShaderMaterial({
    uniforms: { uTime: U.uTime, uScale: U.uScale, uPR: U.uPR, uLens: U.uLens, uBlue: U.uBlue, uDrift: { value: RM ? 0 : 1 } },
    vertexShader: `attribute float aOff, aHead; uniform float uTime, uScale, uPR, uDrift; varying float vH;
      void main(){ vH = aHead; vec3 p = position;
        float sp = aHead > 0.5 ? 13.0 : 9.0;
        float u = mod(aOff + uTime * sp * uDrift, 440.0);
        p.z = aHead > 0.5 ? -400.0 + u : 40.0 - u;
        vec4 mv = modelViewMatrix * vec4(p, 1.0); gl_Position = projectionMatrix * mv;
        gl_PointSize = clamp((aHead > 0.5 ? 0.55 : 0.4) * uScale * uPR / -mv.z, 1.5, 40.0); }`,
    fragmentShader: `uniform vec3 uBlue; uniform float uLens; varying float vH; void main(){ float d = length(gl_PointCoord - 0.5); float a = exp(-d * d * 18.0); vec3 c = vH > 0.5 ? vec3(1.0, 0.95, 0.85) : vec3(1.0, 0.12, 0.1); gl_FragColor = vec4(mix(c, uBlue * 1.4, uLens) * a, 1.0); }`,
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending
  });
  const cars = new THREE.Points(cg, S.pzCarMat); cars.frustumCulled = false;
  pzGroup.add(cars);
  // the billboards: the campaign's own chapters, lit from above
  const lightM = new THREE.ShaderMaterial({
    uniforms: { uOp: { value: 1 }, uLens: U.uLens, uBlue: U.uBlue },
    vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: `uniform float uOp, uLens; uniform vec3 uBlue; varying vec2 vUv; void main(){ float a = pow(vUv.y, 2.2) * (0.35 + 0.65 * pow(sin(3.14159 * fract(vUv.x * 3.0)), 2.0)); gl_FragColor = vec4(mix(vec3(1.0, 0.85, 0.6), uBlue, uLens) * a * 0.22 * uOp, 1.0); }`,
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending
  });
  const postM = new THREE.MeshBasicMaterial({ color: 0x15151c });
  S.pzFrameMat = new THREE.MeshBasicMaterial({ color: new THREE.Color('#C8202A') });
  const mkBoard = (b, k) => {
    const g = new THREE.Group();
    const w = b.h * b.a, hgt = b.h;
    const back = new THREE.Mesh(new THREE.BoxGeometry(w + 1.1, hgt + 1.1, .35), postM); back.position.z = -.24; g.add(back);
    const fr = new THREE.Mesh(planeGeo, S.pzFrameMat); fr.scale.set(w + .8, hgt + .8, 1); fr.position.z = -.05; g.add(fr);
    let pm;
    if (b.canvas) { pm = tornMat({ map: b.canvas, seed: 40 + k, torn: 0, lens: true }); }
    else pm = tornMat({ map: tex(b.img), seed: 40 + k, torn: 0, lens: true });
    const pic = new THREE.Mesh(planeGeo, pm); pic.scale.set(w, hgt, 1); g.add(pic);
    const lt = new THREE.Mesh(planeGeo, lightM); lt.scale.set(w + .8, hgt * .9, 1); lt.position.set(0, hgt * .02, .04); g.add(lt);
    const postH = b.y - hgt / 2;
    (b.gantry ? [-9.8, 9.8] : [-w * .3, w * .3]).forEach(px => { const pp = new THREE.Mesh(new THREE.BoxGeometry(.45, postH + .6, .45), postM); pp.position.set(px, -hgt / 2 - postH / 2, -.3); g.add(pp); });
    for (let i = 0; i < 3; i++) { const lamp = new THREE.Mesh(new THREE.BoxGeometry(.7, .18, .5), new THREE.MeshBasicMaterial({ color: 0xfff1d6 })); lamp.position.set((i - 1) * w / 3, hgt / 2 + .75, .45); g.add(lamp); }
    g.position.set(b.x, b.y, b.z); g.rotation.y = b.ry || 0;
    g.userData = { pic, b };
    pzGroup.add(g);
    return g;
  };
  // the pledge board: your sentence, drawn to a canvas
  const pc = document.createElement('canvas'); pc.width = 1600; pc.height = 528;
  const pledgeTex = new THREE.CanvasTexture(pc);
  S.pzDraw = (txt) => {
    const x = pc.getContext('2d');
    x.fillStyle = '#C8202A'; x.fillRect(0, 0, 1600, 528);
    x.fillStyle = 'rgba(255,255,255,.82)'; x.font = '600 40px Handjet, "Arial Narrow", sans-serif'; x.textBaseline = 'top';
    x.fillText('THE TOMORROW PLEDGE', 72, 56);
    x.textAlign = 'right'; x.fillText(txt ? 'BOSS IN 2066' : 'YOUR WORDS GO HERE', 1528, 56); x.textAlign = 'left';
    x.fillStyle = '#fff'; x.font = '800 74px "Schibsted Grotesk", Arial, sans-serif';
    x.fillText(txt ? "From today, I'm planning for" : "From today, I'm planning…", 72, 150);
    if (txt) {
      x.font = '850 104px "Schibsted Grotesk", Arial, sans-serif';
      const words = (txt + '.').split(' '); const lines = []; let line = '';
      words.forEach(wd => { const t2 = line ? line + ' ' + wd : wd; if (x.measureText(t2).width > 1450 && line) { lines.push(line); line = wd; } else line = t2; });
      lines.push(line);
      let fs = 104; if (lines.length > 2) { fs = 78; x.font = '850 78px "Schibsted Grotesk", Arial, sans-serif'; }
      lines.slice(0, 3).forEach((l, i) => x.fillText(l, 72, 262 + i * (fs + 8)));
    }
    pledgeTex.needsUpdate = true;
  };
  S.pzDraw('');
  if (document.fonts && document.fonts.load) Promise.all([document.fonts.load('800 74px "Schibsted Grotesk"'), document.fonts.load('600 40px Handjet')]).then(() => S.pzDraw(S.pzWord || '')).catch(() => {});
  const PZB = [
    { img: 'pz-oba.webp', a: 16 / 9, h: 6.8, x: 12.6, y: 8.6, z: -26, ry: -.42 },
    { img: 'pz-invite.webp', a: .558, h: 8.4, x: -12.2, y: 9.2, z: -50, ry: .42 },
    { img: 'pz-fireside.webp', a: 16 / 9, h: 6.8, x: 12.6, y: 8.6, z: -60, ry: -.42 },
    { img: 'pz-night.webp', a: 1.798, h: 6.8, x: -12.6, y: 8.6, z: -92, ry: .42 },
    { img: 'pz-bakery.webp', a: 1.798, h: 6.8, x: 12.6, y: 8.6, z: -100, ry: -.42 },
    { img: 'pz-boss-doctor.webp', a: 2.586, h: 7.6, x: 6.5, y: 12.2, z: -140, ry: -.1 },
    { img: 'pz-family.webp', a: 1.798, h: 6.8, x: -12.6, y: 8.6, z: -126, ry: .42 },
    { img: 'pz-boss-business.webp', a: 3.538, h: 5, x: -14, y: 8.2, z: -166, ry: .42 },
    { canvas: pledgeTex, a: 1600 / 528, h: 5.6, x: 7.5, y: 9.8, z: -184, ry: -.12 }
  ];
  S.pzBoards = PZB.map(mkBoard);

  /* ---------- the Zenith world: an arrivals hall ---------- */
  zbGroup = new THREE.Group(); zbGroup.visible = false; scene.add(zbGroup);
  S.zbBg = new THREE.Color('#060608');
  const zbU = { uLens: U.uLens, uInk: U.uInk, uBlue: U.uBlue, uTime: U.uTime, uCam: { value: new THREE.Vector3() }, uExit: { value: 0 } };
  S.zbU = zbU;
  const hallVS = `varying vec3 vW; void main(){ vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`;
  const hallFS = (body) => `uniform vec3 uInk, uBlue, uCam; uniform float uLens, uTime, uExit; varying vec3 vW;
    ${ditherGL}
    void main(){ vec3 c; ${body}
      float dist = distance(vW, uCam); c = mix(c, vec3(0.02, 0.02, 0.025), smoothstep(60.0, 150.0, dist));
      gl_FragColor = vec4(mix(c, lensOf(c) * 0.75, uLens), 1.0); }`;
  // polished floor: dark stone reflecting the ceiling strips and the exit glow
  const zbFloor = new THREE.Mesh(new THREE.PlaneGeometry(30, 180), new THREE.ShaderMaterial({ uniforms: zbU, vertexShader: hallVS, fragmentShader: hallFS(`
      c = vec3(0.045, 0.045, 0.05) * (0.9 + 0.2 * hh(floor(vW.xz * 0.5)));
      float seam = (1.0 - smoothstep(0.0, 0.04, abs(fract(vW.z / 3.0) - 0.5) - 0.46)) + (1.0 - smoothstep(0.0, 0.04, abs(fract(vW.x / 3.0) - 0.5) - 0.46));
      c *= 1.0 - 0.25 * clamp(seam, 0.0, 1.0);
      float strip = 0.0; for (int i = -1; i <= 1; i++) strip += exp(-pow(vW.x - float(i) * 6.0, 2.0) * 2.5) * (0.6 + 0.4 * step(0.35, fract(vW.z / 4.0)));
      c += vec3(0.75, 0.8, 0.9) * strip * 0.1;
      c += vec3(1.0, 0.55, 0.4) * exp(-pow((vW.z + 121.0) / 30.0, 2.0)) * exp(-vW.x * vW.x / 40.0) * 0.35 * (0.5 + 0.5 * uExit);`) }));
  zbFloor.rotation.x = -Math.PI / 2; zbFloor.position.set(0, 0, -50);
  zbGroup.add(zbFloor);
  const zbWallM = new THREE.ShaderMaterial({ uniforms: zbU, vertexShader: hallVS, side: THREE.DoubleSide, fragmentShader: hallFS(`
      c = vec3(0.07, 0.07, 0.08);
      float seam = 1.0 - smoothstep(0.0, 0.05, abs(fract(vW.z / 7.5) - 0.5) - 0.45);
      c *= 1.0 - 0.35 * seam;
      c *= 0.55 + 0.45 * smoothstep(0.0, 6.0, vW.y) * (1.0 - smoothstep(9.0, 14.0, vW.y) * 0.4);`) });
  [-15, 15].forEach(x => { const w = new THREE.Mesh(new THREE.PlaneGeometry(180, 14), zbWallM); w.rotation.y = Math.PI / 2; w.position.set(x, 7, -50); zbGroup.add(w); });
  const zbCeil = new THREE.Mesh(new THREE.PlaneGeometry(30, 180), new THREE.ShaderMaterial({ uniforms: zbU, vertexShader: hallVS, side: THREE.DoubleSide, fragmentShader: hallFS(`
      c = vec3(0.03, 0.03, 0.035);
      float strip = 0.0; for (int i = -1; i <= 1; i++) strip += (1.0 - smoothstep(0.12, 0.2, abs(vW.x - float(i) * 6.0))) * step(0.18, fract(vW.z / 4.0));
      c += vec3(0.62, 0.66, 0.72) * strip;`) }));
  zbCeil.rotation.x = Math.PI / 2; zbCeil.position.set(0, 14, -50);
  zbGroup.add(zbCeil);
  // the arrivals board: a split-flap display drawn to a canvas
  const ZFLAP = ' ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789:.-', ZFC = 39, ZFR = 6, ZSEP = [12, 19, 25];
  const fcv = document.createElement('canvas'); fcv.width = 2048; fcv.height = 1024;
  const flapTex = new THREE.CanvasTexture(fcv); flapTex.anisotropy = maxAniso;
  const ecv = document.createElement('canvas'); ecv.width = 1024; ecv.height = 300;
  const exitTex = new THREE.CanvasTexture(ecv);
  const mkCells = (n) => Array.from({ length: n }, () => ({ cur: ' ', tgt: ' ', t0: 0, dur: 0, col: '#F2F0EA' }));
  S.zbCells = mkCells(ZFC * ZFR); S.zbExit = mkCells(32);
  const pad = (str, n) => (str + ' '.repeat(n)).slice(0, n);
  S.zbSet = (cells, strs, cols, now) => {
    strs.forEach((str, r) => {
      const n = cells === S.zbExit ? 16 : ZFC;
      for (let c = 0; c < n; c++) {
        const cell = cells[r * n + c], ch = str[c] || ' ';
        cell.col = cols ? cols(r, c) : '#F2F0EA';
        if (cell.tgt !== ch) { cell.tgt = ch; cell.t0 = RM ? now : now + c * .022 + r * .05; cell.dur = RM ? 0 : .35 + ((r * 7 + c * 13) % 10) / 22; }
      }
    });
  };
  const drawCells = (ctx, cells, cols, rows, x0, y0, cw, ch, gap, now, sep) => {
    let busy = false;
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      if (sep && sep.includes(c)) continue;
      const cell = cells[r * cols + c];
      let chr = cell.cur;
      if (cell.cur !== cell.tgt) {
        if (now >= cell.t0 + cell.dur) { cell.cur = cell.tgt; chr = cell.cur; }
        else { busy = true; chr = now < cell.t0 ? cell.cur : ZFLAP[Math.floor((now * 30 + c * 7 + r * 3) % ZFLAP.length)]; }
      }
      const x = x0 + c * (cw + gap), y = y0 + r * (ch + gap * 3.2);
      ctx.fillStyle = '#18181B'; ctx.fillRect(x, y, cw, ch);
      ctx.fillStyle = '#0B0B0D'; ctx.fillRect(x, y + ch / 2 - 1.5, cw, 3);
      if (chr !== ' ') { ctx.fillStyle = cell.cur === cell.tgt ? cell.col : '#BDBBB5'; ctx.fillText(chr, x + cw / 2, y + ch / 2 + 2); }
    }
    return busy;
  };
  S.zbDraw = (now) => {
    const x = fcv.getContext('2d');
    x.fillStyle = '#0D0D10'; x.fillRect(0, 0, 2048, 1024);
    x.fillStyle = '#E3131B'; x.fillRect(0, 0, 2048, 118);
    x.fillStyle = '#fff'; x.textBaseline = 'middle'; x.textAlign = 'left'; x.font = '600 66px Handjet, "Arial Narrow", sans-serif';
    x.fillText('ARRIVALS · LAGOS', 64, 62);
    x.textAlign = 'right'; x.fillText('SEE HOMECOMING DIFFERENTLY', 1984, 62);
    x.fillStyle = '#9C9AA6'; x.font = '500 40px Handjet, "Arial Narrow", sans-serif'; x.textAlign = 'left';
    const cw = 44, gp = 6, x0 = 64;
    [['FROM', 0], ['FLIGHT', 13], ['TIME', 20], ['STATUS', 26]].forEach(([t2, c]) => x.fillText(t2, x0 + c * (cw + gp), 168));
    x.textAlign = 'center'; x.font = '700 64px "Schibsted Grotesk", Arial, sans-serif';
    const b1 = drawCells(x, S.zbCells, ZFC, ZFR, x0, 206, cw, 104, gp, now, ZSEP);
    flapTex.needsUpdate = true;
    const e = ecv.getContext('2d');
    e.fillStyle = '#0D0D10'; e.fillRect(0, 0, 1024, 300);
    e.fillStyle = '#E3131B'; e.fillRect(0, 0, 1024, 14);
    e.textAlign = 'center'; e.textBaseline = 'middle'; e.font = '700 70px "Schibsted Grotesk", Arial, sans-serif';
    const b2 = drawCells(e, S.zbExit, 16, 2, 40, 44, 54, 104, 5, now, null);
    exitTex.needsUpdate = true;
    return b1 || b2;
  };
  const board = new THREE.Group();
  const bz = new THREE.Mesh(new THREE.BoxGeometry(14.2, 7.35, .5), new THREE.MeshBasicMaterial({ color: 0x0a0a0c })); bz.position.z = -.3; board.add(bz);
  const bpm = tornMat({ map: flapTex, seed: 70, torn: 0, lens: true });
  const bp = new THREE.Mesh(planeGeo, bpm); bp.scale.set(13.7, 6.85, 1); board.add(bp);
  [-6, 6].forEach(cx => { const cb = new THREE.Mesh(new THREE.BoxGeometry(.06, 6, .06), new THREE.MeshBasicMaterial({ color: 0x2a2a30 })); cb.position.set(cx * .82, 6.6, -.3); board.add(cb); });
  board.position.set(7.2, 9.9, -18);
  zbGroup.add(board);
  // screens along the hall: the Homecoming creative
  const ZS = [
    { img: 'zb-airport.webp', a: 1.778, z: -40, side: 1 }, { img: 'zb-open.webp', a: 1.798, z: -40, side: -1 },
    { img: 'zb-party.webp', a: 1.848, z: -56, side: 1 }, { img: 'zb-mile.webp', a: 1.798, z: -56, side: -1 },
    { img: 'zb-friends.webp', a: 1.848, z: -72, side: 1 }, { img: 'zb-card.webp', a: 1.798, z: -72, side: -1 },
    { img: 'zb-social.webp', a: 1.778, z: -88, side: 1 }, { img: 'zb-boat.webp', a: 1.798, z: -88, side: -1 }
  ];
  S.zbScreens = ZS.map((m, k) => {
    const g = new THREE.Group(), h = 6.4, w = h * m.a;
    const bez = new THREE.Mesh(new THREE.BoxGeometry(w + .5, h + .5, .3), new THREE.MeshBasicMaterial({ color: 0x0b0b0d })); bez.position.z = -.2; g.add(bez);
    const pm = tornMat({ map: tex(m.img), seed: 80 + k, torn: 0, lens: true });
    const pic = new THREE.Mesh(planeGeo, pm); pic.scale.set(w, h, 1); g.add(pic);
    g.position.set(m.side * 14.6, 6.4, m.z); g.rotation.y = -m.side * Math.PI / 2;
    g.userData = { pic, m };
    zbGroup.add(g);
    return g;
  });
  // the exit: the Lagos season glowing through the doors, the sign above
  const exitView = new THREE.Mesh(planeGeo, tornMat({ map: tex('zb-concert.webp'), seed: 90, torn: 0, lens: true }));
  exitView.scale.set(16.2, 9, 1); exitView.position.set(0, 4.5, -121.5); zbGroup.add(exitView);
  const exitWall = new THREE.Mesh(new THREE.PlaneGeometry(30, 14), zbWallM); exitWall.position.set(0, 7, -122); zbGroup.add(exitWall);
  [-8.3, 8.3].forEach(x => { const jamb = new THREE.Mesh(new THREE.BoxGeometry(.4, 9.2, .4), new THREE.MeshBasicMaterial({ color: 0x1c1c20 })); jamb.position.set(x, 4.6, -121.3); zbGroup.add(jamb); });
  const sign = new THREE.Mesh(planeGeo, tornMat({ map: exitTex, seed: 91, torn: 0, lens: true }));
  sign.scale.set(9, 9 * 300 / 1024, 1); sign.position.set(0, 11.2, -121.2); zbGroup.add(sign);
  exitWall.position.z = -122.2;
  // board contents by chapter
  const CITIES = [['LONDON', 'ZB 101', '06:40'], ['HOUSTON', 'ZB 102', '07:15'], ['TORONTO', 'ZB 103', '08:05'], ['DUBAI', 'ZB 104', '09:30'], ['JOHANNESBURG', 'ZB 105', '10:10'], ['ATLANTA', 'ZB 106', '11:45']];
  const STAT = {
    0: ['EN ROUTE', 'EN ROUTE', 'EN ROUTE', 'EN ROUTE', 'EN ROUTE', 'EN ROUTE'],
    1: ['CARD DECLINED', 'PAYMENT ISSUE', 'BANK NOT READY', 'DELAYED', 'CARD DECLINED', 'DELAYED'],
    2: ['READY', 'READY', 'READY', 'READY', 'READY', 'READY'],
    3: ['LANDED', 'LANDED', 'LANDED', 'LANDED', 'LANDED', 'LANDED']
  };
  const SCOL = { 0: '#F5C542', 1: '#FF5A5F', 2: '#5BE39A', 3: '#F2F0EA' };
  S.zbState = -1;
  S.zbApply = (st, now) => {
    if (st === S.zbState) return; S.zbState = st; S.zbDirty = true;
    const rows = CITIES.map((c, i) => {
      const from = i === 0 && S.zbCity ? S.zbCity : c[0], fl = i === 0 && S.zbCity ? 'ZB 100' : c[1], tm = i === 0 && S.zbCity ? 'NOW' : c[2];
      const stt = i === 0 && S.zbCity ? 'WELCOME HOME' : STAT[st][i];
      return pad(from, 12) + ' ' + pad(fl, 6) + ' ' + pad(tm, 5) + ' ' + pad(stt, 13);
    });
    S.zbSet(S.zbCells, rows, (r, c) => c >= 26 ? (r === 0 && S.zbCity ? '#5BE39A' : SCOL[st]) : '#F2F0EA', now);
    S.zbSet(S.zbExit, S.zbCity ? [pad('FROM ' + S.zbCity, 16), pad('WELCOME HOME', 16)] : [pad('ARRIVALS EXIT', 16), pad('LAGOS', 16)], (r) => r === 1 && S.zbCity ? '#5BE39A' : '#F2F0EA', now);
  };
  S.zbApply(0, 0); S.zbDraw(99);
  if (document.fonts && document.fonts.load) Promise.all([document.fonts.load('700 64px "Schibsted Grotesk"'), document.fonts.load('600 66px Handjet')]).then(() => { S.zbDirty = true; }).catch(() => {});
}

/* ---------------- labels ---------------- */
const labelsEl = $('#labels');
const LB = [];
function label(cls, html, anchor, fn) {
  const el = document.createElement('div');
  el.className = 'lbl ' + cls;
  el.innerHTML = '<div class="in">' + html + '</div>';
  labelsEl.appendChild(el);
  const o = { el, anchor, fn, shown: false };
  LB.push(o);
  return o;
}
const V3 = GL ? new THREE.Vector3() : null;
function placeLabels() {
  for (const L of LB) {
    const op = L.fn();
    if (op < .02) { if (L.shown) { L.el.style.visibility = 'hidden'; L.shown = false; } continue; }
    V3.copy(typeof L.anchor === 'function' ? L.anchor() : L.anchor).project(camera);
    if (V3.z > 1 || V3.x < -1.3 || V3.x > 1.3 || V3.y < -1.3 || V3.y > 1.3) { if (L.shown) { L.el.style.visibility = 'hidden'; L.shown = false; } continue; }
    const x = (V3.x * .5 + .5) * W, y = (-V3.y * .5 + .5) * H;
    L.el.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0)`;
    L.el.style.opacity = op.toFixed(3);
    if (!L.shown) { L.el.style.visibility = 'visible'; L.shown = true; }
  }
}
if (GL) {
  const youV = new THREE.Vector3();
  label('you', '<span class="txt">YOU</span><span class="stem"></span>', () => {
    youV.copy(S.you.hand);
    youV.addScaledVector(S.reachDir, pMat.uniforms.uReach.value * S.you.gap);
    return youV;
  }, () => S.route === 'gate' ? sstep(.62, .85, S.pE) * (1 - sstep(1.2, 1.3, S.pE)) : 0);
  const QP = [[-4.5, 9], [4.5, 4.5], [-4.5, 0], [4.5, -4.5], [-4.5, -9], [4.5, -13.5]];
  label('hq', '<span class="txt">10 ONISIWO ROAD · IKOYI · HQ</span><span class="stem"></span>', new THREE.Vector3(G / 2, 0, G / 2),
    () => S.route === 'studio' ? sstep(2.4, 2.9, S.qE) : S.route === 'contact' ? 1 : (S.route === 'work' && !S.sel && !S.list ? .95 : 0));
  B.forEach(b => {
    const c = b.c;
    b.lbl = label('tag' + (c.f ? ' flag' : ''), `<span class="txt">${c.s || (c.b.split(' · ')[0] + ' · ' + c.t)}</span>`,
      () => V3b.set(c.x, b.cur + b.lift + .5, c.z),
      () => {
        if (S.route === 'gate') return c.f ? sstep(5.72, 5.98, S.pE) : 0;
        return 0;
      });
  });

}
const V3b = GL ? new THREE.Vector3() : null;

/* ---------------- the people: a lineup of equals, and one page each ---------------- */
const slug = n => n.toLowerCase().replace(/\s+/g, '-');
// leadership first (Chairman, MD, Head of Operations & Client Service); everyone else in alphabetical order
const LEAD = ['Ola Olowu', 'Daniel Emeka', 'Aderoju Adeniji'];
const PEOPLE = LEAD.map(n => TEAM.find(p => p.n === n)).concat(TEAM.filter(p => !LEAD.includes(p.n)).sort((a, b) => a.n.localeCompare(b.n)));
// one colour per person, each set against Republic blue
const PAL = { 'Aderoju Adeniji': '#FFB000', 'Caleb Ogiri': '#B6FF3B', 'Daniel Emeka': '#9A4DFF', 'Fredrick Aniekwe': '#00D1B2', 'Jemima Adedeji': '#FF2E88',
  'Mmesoma Obikobe': '#FF7A00', 'Ola Olowu': '#E8C547', 'Oluwadoyinsola Iyiola': '#3FD0FF', 'Flora Obigwe': '#FF3B3B', 'Simi Lawal': '#FF8FC0', 'Nifemi Olotu': '#FF5A36', 'Wuraola Bamidele': '#2BD46A' };
const lineup = $('#lineup');
const LGRP = [['Leadership', 0, LEAD.length], ['The studio', LEAD.length, PEOPLE.length]].map(([k, a, z]) => {
  const g = document.createElement('div'); g.className = 'lgrp'; g.dataset.n = (z - a) * (k === 'Leadership' ? 1.4 : 1); g.style.flexGrow = g.dataset.n;
  g.innerHTML = `<p class="lgk">${k}</p><div class="lgrow" role="list" aria-label="${k === 'Leadership' ? 'Leadership' : 'The studio, in alphabetical order'}"></div>`;
  lineup.appendChild(g); return { g, row: $('.lgrow', g), a, z };
});
const grow = on => LGRP.forEach(G => { const hit = on && G.row.contains(on); G.g.style.flexGrow = +G.g.dataset.n + (hit ? 3.4 : 0); });
PEOPLE.forEach((p, i) => {
  const b = document.createElement('button');
  b.type = 'button'; b.className = 'ln'; b.dataset.i = i;
  b.setAttribute('aria-label', `${p.n}, ${p.r}. Open their page.`);
  b.innerHTML = `<img src="img/tm-${slug(p.n)}.webp" alt="" loading="lazy"><span class="lnl"><b>${p.n}</b><span>${p.r}</span></span>`;
  const on = () => { lineup.classList.add('hov'); $$('.ln', lineup).forEach(o => { const t = o === b; o.classList.toggle('on', t); o.parentNode.classList.toggle('on', t); }); grow(b); };
  b.addEventListener('mouseenter', on); b.addEventListener('focus', on);
  b.addEventListener('click', () => openPerson(i));
  const li = document.createElement('div'); li.setAttribute('role', 'listitem'); li.className = 'lnw'; li.appendChild(b);
  LGRP.find(G => i >= G.a && i < G.z).row.appendChild(li);
});
const calm = () => { lineup.classList.remove('hov'); $$('.ln', lineup).forEach(o => { o.classList.remove('on'); o.parentNode.classList.remove('on'); }); grow(null); };
lineup.addEventListener('mouseleave', () => { if (!lineup.contains(document.activeElement)) calm(); });
lineup.addEventListener('focusout', e => { if (!lineup.contains(e.relatedTarget)) calm(); });
const dossier = $('#dossier'), dsPort = $('#ds-port');
// the portrait arrives tile by tile, some tiles flashing white first
const TILES = [];
for (let r = 0; r < 8; r++) for (let c = 0; c < 6; c++) {
  const t = document.createElement('i'); t.className = 't';
  t.dataset.c = c; t.dataset.r = r;
  dsPort.appendChild(t); TILES.push(t);
}
const dsFull = document.createElement('i'); dsFull.className = 'full'; dsPort.appendChild(dsFull);
function dsLayout() {
  const W = dsPort.clientWidth, H = dsPort.clientHeight, a = .75; if (!W || !H) return;
  let iw = W, ih = W / a; if (ih < H) { ih = H; iw = H * a; }
  const ox = (W - iw) / 2, oy = (H - ih) * .22, tw = W / 6, th = H / 8, sz = `${iw.toFixed(1)}px ${ih.toFixed(1)}px`;
  TILES.forEach(t => { t.style.backgroundSize = sz; t.style.backgroundPosition = `${(ox - t.dataset.c * tw).toFixed(1)}px ${(oy - t.dataset.r * th).toFixed(1)}px`; });
  dsFull.style.backgroundSize = sz; dsFull.style.backgroundPosition = `${ox.toFixed(1)}px ${oy.toFixed(1)}px`;
}
window.addEventListener('resize', () => { if (!dossier.hidden) dsLayout(); });
S.ds = { i: -1, back: null, raf: 0, gl: null };
function dsField(hex) {
  const cv = $('#ds-canvas'); let g = S.ds.gl;
  if (!g) {
    const gl = cv.getContext('webgl', { antialias: false, premultipliedAlpha: false });
    if (!gl) { cv.style.background = `linear-gradient(135deg,#0A0A2A,#1F1FFF 55%,${hex})`; S.ds.gl = { none: true }; return; }
    const sh = (type, src) => { const o = gl.createShader(type); gl.shaderSource(o, src); gl.compileShader(o); return o; };
    const pr = gl.createProgram();
    gl.attachShader(pr, sh(gl.VERTEX_SHADER, 'attribute vec2 a; void main(){ gl_Position = vec4(a, 0.0, 1.0); }'));
    gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, `precision highp float;
      uniform vec2 uR; uniform float uT; uniform vec3 uA, uB, uC;
      float h(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
      float n(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
        return mix(mix(h(i), h(i + vec2(1.0, 0.0)), f.x), mix(h(i + vec2(0.0, 1.0)), h(i + vec2(1.0, 1.0)), f.x), f.y); }
      float fbm(vec2 p){ float v = 0.0, a = 0.5; for (int k = 0; k < 5; k++) { v += a * n(p); p = p * 2.03 + 7.1; a *= 0.5; } return v; }
      void main(){
        vec2 uv = gl_FragCoord.xy / uR; float asp = uR.x / uR.y;
        float ribs = floor(uR.x / 13.0), fx = fract(uv.x * ribs), lens = fx - 0.5;
        vec2 p = vec2(uv.x * asp, uv.y);
        p.x += lens * 0.11; p.y += lens * lens * 0.05;
        vec2 q = vec2(fbm(p * 1.5 + vec2(0.0, uT * 0.05)), fbm(p * 1.5 + vec2(5.2, 1.3) - uT * 0.04));
        float v = fbm(p * 1.2 + 2.4 * q + vec2(uT * 0.025, 0.0));
        vec3 c = mix(uA, uB, smoothstep(0.28, 0.58, v));
        c = mix(c, uC, smoothstep(0.52, 0.82, v + 0.18 * q.x));
        c *= 1.0 - 0.32 * pow(abs(lens) * 2.0, 3.0);
        c += 0.05 * smoothstep(0.12, 0.0, abs(fx - 0.22));
        gl_FragColor = vec4(c, 1.0);
      }`));
    gl.linkProgram(pr); gl.useProgram(pr);
    const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(pr, 'a'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    g = S.ds.gl = { gl, u: n => gl.getUniformLocation(pr, n) };
  }
  if (g.none) { cv.style.background = `linear-gradient(135deg,#0A0A2A,#1F1FFF 55%,${hex})`; return; }
  const rgb = [1, 3, 5].map(k => parseInt(hex.slice(k, k + 2), 16) / 255);
  g.gl.uniform3f(g.u('uA'), .02, .02, .07); g.gl.uniform3f(g.u('uB'), .1, .1, .95); g.gl.uniform3f(g.u('uC'), rgb[0], rgb[1], rgb[2]);
}
function dsFrame(now) {
  const g = S.ds.gl; if (!g || g.none || dossier.hidden) { S.ds.raf = 0; return; }
  const cv = $('#ds-canvas'), dpr = Math.min(1.5, devicePixelRatio || 1), w = Math.round(cv.clientWidth * dpr), h = Math.round(cv.clientHeight * dpr);
  if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; g.gl.viewport(0, 0, w, h); }
  g.gl.uniform2f(g.u('uR'), w, h); g.gl.uniform1f(g.u('uT'), RM ? 8 : now / 1000);
  g.gl.drawArrays(g.gl.TRIANGLES, 0, 3);
  S.ds.raf = RM ? 0 : requestAnimationFrame(dsFrame);
}
function showPerson(i) {
  const n = PEOPLE.length; i = (i + n) % n; S.ds.i = i;
  const p = PEOPLE[i], img = `url(img/tm-${slug(p.n)}.webp)`;
  $('.dsn', dossier).textContent = p.n;
  $('#ds-name').classList.toggle('long', Math.max(...p.n.split(' ').map(w => w.length)) >= 12); // e.g. Oluwadoyinsola
  $('#ds-role').textContent = p.r;
  dsPort.setAttribute('aria-label', `Portrait of ${p.n}, ${p.r}`);
  const nx = PEOPLE[(i + 1) % n]; $('#ds-next span').textContent = nx.n;
  try { history.replaceState(null, '', '/studio/' + slug(p.n)); } catch (e) {}
  dsFull.style.backgroundImage = img;
  TILES.forEach(t => { t.style.backgroundImage = img; t.style.setProperty('--d', (Math.random() * .75 + .05).toFixed(2) + 's'); t.style.setProperty('--w', (Math.random() < .35 ? .12 + Math.random() * .25 : 0).toFixed(2) + 's'); });
  dsField(PAL[p.n] || '#1F1FFF');
  dsLayout();
  dossier.classList.remove('play'); void dossier.offsetWidth; dossier.classList.add('play');
  if (!S.ds.raf) S.ds.raf = requestAnimationFrame(dsFrame);
}
function openPerson(i) {
  S.ds.back = document.activeElement;
  dossier.hidden = false; document.documentElement.style.overflow = 'hidden';
  showPerson(i); dsLayout();
  $('#ds-close').focus();
}
function closePerson(leaving) {
  if (dossier.hidden) return;
  dossier.hidden = true; dossier.classList.remove('play'); document.documentElement.style.overflow = '';
  if (!leaving && S.route === 'studio') { try { history.replaceState(null, '', '/studio'); } catch (e) {} }
  if (S.ds.back && S.ds.back.focus) S.ds.back.focus();
}
$('#ds-close').addEventListener('click', () => closePerson());
$('#ds-next').addEventListener('click', () => showPerson(S.ds.i + 1));
$('#ds-next2').addEventListener('click', () => showPerson(S.ds.i + 1));
$('#ds-prev').addEventListener('click', () => showPerson(S.ds.i - 1));
document.addEventListener('keydown', e => {
  if (dossier.hidden) return;
  if (e.key === 'Escape') { e.preventDefault(); closePerson(); }
  else if (e.key === 'ArrowRight') showPerson(S.ds.i + 1);
  else if (e.key === 'ArrowLeft') showPerson(S.ds.i - 1);
  else if (e.key === 'Tab') {
    const f = $$('button, a[href]', dossier).filter(x => x.offsetParent !== null), a = f[0], z = f[f.length - 1];
    if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
    else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
  }
});
const subBtns = $$('.subnav [data-sjump]');
subBtns.forEach(b => b.addEventListener('click', () => {
  const v = b.dataset.sjump;
  const el = v === 'careers' ? $('#careers') : $('.ssec.s' + v);
  if (el) el.scrollIntoView({ behavior: RM ? 'auto' : 'smooth', block: v === 'careers' ? 'center' : 'start' });
}));
let studioCenters = [];
const PAGES = { method: 1, journal: 1, contact: 1, privacy: 1, lost: 1, services: 1 };
SVC_PAGES.forEach(k => { PAGES[k] = 1; });
const isPage = r => r === 'studio' || !!PAGES[r];
function measureStudio() {
  const art = $(`[data-for="${S.route}"]:not(.pscrim)`);
  studioCenters = (art ? $$('.ssec', art) : []).map(el => { const r = el.getBoundingClientRect(); return r.top + window.scrollY + r.height / 2; });
}

/* ---------------- index (list view) ---------------- */
const listCols = $('#list-cols');
$$('.districts [data-filter]').forEach(b => { const k = b.dataset.filter, n = k === 'all' ? CASES.length : CASES.filter(c => c.d === k).length; $('b', b).textContent = String(n).padStart(2, '0'); });
ORDER.forEach((id, n) => {
  const c = byId[id], li = document.createElement('li');
  li.innerHTML = `<button type="button" data-case="${c.id}"><span class="n">${String(n + 1).padStart(2, '0')}</span>${c.img ? `<img src="img/${c.img}" alt="" loading="lazy">` : '<span class="ph"></span>'}<span class="t">${c.t}</span><span class="c">${c.b}${c.c !== c.b ? ' · ' + c.c : ''}</span><span class="d">${DISTRICTS[c.d].name}</span><span class="f">${c.f ? 'Flagship' : ''}</span></button>`;
  listCols.appendChild(li);
});
$$('[data-case]', listCols).forEach(b => b.addEventListener('click', () => { setList(false); select(b.dataset.case); }));
const vCity = $('#v-city'), vList = $('#v-list'), listEl = $('#list');
function setList(on) {
  S.list = on; listEl.hidden = !on;
  vList.setAttribute('aria-expanded', String(on));
  if (on) { select(null); hovercap.classList.remove('on'); vCity.focus({ preventScroll: true }); }
}
vCity.addEventListener('click', () => { setList(false); vList.focus({ preventScroll: true }); });
vList.addEventListener('click', () => setList(true));
const filterBtns = $$('.districts [data-filter]');
filterBtns.forEach(ch => ch.addEventListener('click', () => {
  S.filter = ch.dataset.filter;
  filterBtns.forEach(o => o.setAttribute('aria-pressed', String(o === ch)));
  select(null);
  S.panX = S.filter === 'all' ? 0 : clamp(DISTRICTS[S.filter].x, -24, 26);
  if (S.list) setList(false);
}));
const hovercap = $('#hovercap');

/* ---------------- selection card ---------------- */
const card = $('#card'), workEl = $('.work'), workHead = $('.work .head');
function select(id) {
  S.sel = id;
  if (id && S.releaseTex && WORLDS[id]) S.releaseTex(id);
  workEl.classList.toggle('selected', !!id);
  if (id) hovercap.classList.remove('on');
  if (id && S.filter !== 'all' && byId[id].d !== S.filter) {
    S.filter = 'all';
    filterBtns.forEach(o => o.setAttribute('aria-pressed', String(o.dataset.filter === 'all')));
  }
  if (!id) { card.hidden = true; return; }
  const c = byId[id];
  const n = ORDER.indexOf(id) + 1;
  $('#card-k').textContent = `${DISTRICTS[c.d].name}${c.f ? ' · Flagship world' : ''}`;
  $('#card-t').textContent = c.t;
  $('#card-who').textContent = [c.b, c.c !== c.b ? c.c : null, c.y].filter(Boolean).join(' · ');
  $('#card-line').textContent = c.line || '';
  $('#card-line').hidden = !c.line;
  $('#card-svc').textContent = c.svc || '';
  $('#card-svc').hidden = !c.svc;
  const wd = WORLDS[id], cf = CASEFILES[id];
  $('#card-go').hidden = !wd && !cf;
  $('#card-enter').hidden = !wd;
  if (wd) { $('#card-enter').setAttribute('href', pathOf(wd.world)); $('#card-go .sec').setAttribute('href', pathOf(wd.kase)); }
  else if (cf) { $('#card-go .sec').setAttribute('href', pathOf(id + '-case')); }
  $('#card-go .sec').textContent = wd ? 'Read the case' : 'Read the case file →';
  const note = $('#card-note');
  note.hidden = !!wd || !!cf;
  note.textContent = 'This case becomes its own world in the full build.';
  card.hidden = false;
}
$('#card-x').addEventListener('click', () => select(null));
if (PHONE) $('#work-hint').textContent = 'Drag to travel · Tap a tower';
$('#card-enter').addEventListener('click', e => {
  if (!GL || RM || !S.sel) return;
  e.preventDefault();
  flyInto(S.sel);
});

/* ---------------- lens ---------------- */
const lensBtn = $('#lensbtn'), notes = $('#notes');
const isWorld = r => r === 'onga' || r === 'cowbell' || r === 'spruce' || r === 'pzl' || r === 'zenith', isCase = r => /-case$/.test(r);
function setLens(on) {
  const r = S.route;
  S.lens = on ? 1 : 0;
  lensBtn.setAttribute('aria-pressed', String(on));
  $$('.case-lens').forEach(b => b.setAttribute('aria-pressed', String(on)));
  $$('.case .hero').forEach(h => h.classList.toggle('lens', on && isCase(r) && h.closest('.case').dataset.for === r));
  if (!isWorld(r)) { S.lensS = S.lens; body.style.setProperty('--lensv', isCase(r) ? (on ? 1 : 0) : S.lens); }
  notes.classList.toggle('on', on && (isWorld(r) || isCase(r)));
}
function holdable(btn) {
  let held = false, downT = 0, wasOn = false;
  btn.addEventListener('pointerdown', e => {
    held = true; wasOn = !!S.lens; downT = performance.now(); setLens(true);
    try { btn.setPointerCapture(e.pointerId); } catch (err) {}
  });
  const up = () => {
    if (!held) return; held = false;
    const long = performance.now() - downT > 260;
    if (long || wasOn) setLens(false);
  };
  btn.addEventListener('pointerup', up); btn.addEventListener('pointercancel', up);
  btn.addEventListener('click', e => { if (e.detail === 0) setLens(!S.lens); });
}
holdable(lensBtn); $$('.case-lens').forEach(holdable);
window.addEventListener('keydown', e => {
  const tag = (e.target && e.target.tagName) || '';
  if (tag === 'INPUT' || tag === 'TEXTAREA') { if (e.key === 'Escape') e.target.blur(); return; }
  if ((e.key === 's' || e.key === 'S') && !e.repeat && (isWorld(S.route) || isCase(S.route)) && !isFile(S.route)) setLens(true);
  if (e.key === 'Escape') {
    if (!drawer.hidden) return closeDrawer();
    if (S.route === 'work') { if (S.list) setList(false); else if (S.sel) select(null); }
    else if (isWorld(S.route)) go('work');
  }
});
window.addEventListener('keyup', e => { if ((e.key === 's' || e.key === 'S') && S.lens) setLens(false); });

/* ---------------- case tabs ---------------- */
$$('.tabs [data-jump]').forEach(b => b.addEventListener('click', () => {
  const s = document.getElementById(b.dataset.jump);
  if (s) s.scrollIntoView({ behavior: RM ? 'auto' : 'smooth', block: 'start' });
}));

/* ---------------- onga word ---------------- */
$('#word-form').addEventListener('submit', e => {
  e.preventDefault();
  const v = $('#word-in').value.trim().replace(/\s+/g, ' ').slice(0, 28);
  if (!v) { $('#word-in').focus(); return; }
  S.word = v;
  $('#ob1-k').textContent = 'Your answer · ' + v;
  if (GL) { S.drawAnswer(v); answer.visible = true; S.cardT = t; }
  $('#word-in').blur();
  window.scrollTo({ top: beatY(1) + 2, behavior: RM ? 'auto' : 'smooth' });
});
if (GL && document.fonts && document.fonts.load) document.fonts.load('800 150px "Schibsted Grotesk"').then(() => { if (S.word) S.drawAnswer(S.word); }).catch(() => {});

/* ---------------- fly-in + wipe ---------------- */
const wipe = $('#wipe');
function flyInto(id) {
  const b = B[byId[id].i], route = WORLDS[id].world;
  wipe.style.background = WORLDS[id].col;
  S.fly = { t0: t, b };
  select(null);
  V3.copy(b.poster.position).project(camera);
  wipe.style.setProperty('--wx', ((V3.x * .5 + .5) * 100).toFixed(1) + '%');
  wipe.style.setProperty('--wy', ((-V3.y * .5 + .5) * 100).toFixed(1) + '%');
  setTimeout(() => {
    wipe.classList.remove('fade'); wipe.classList.add('run');
    requestAnimationFrame(() => wipe.classList.add('full'));
  }, 650);
  setTimeout(() => {
    S.fly = null;
    go(route);
    setTimeout(() => { wipe.classList.add('fade'); }, 120);
    setTimeout(() => { wipe.classList.remove('run', 'full', 'fade'); }, 700);
  }, 1450);
}

function wipeTo(route, x, y) {
  if (S.releaseTex && WORLDS[route]) S.releaseTex(route);
  wipe.style.background = WORLDS[route].col;
  wipe.style.setProperty('--wx', x + 'px'); wipe.style.setProperty('--wy', y + 'px');
  wipe.classList.remove('fade'); wipe.classList.add('run');
  requestAnimationFrame(() => wipe.classList.add('full'));
  setTimeout(() => {
    go(route);
    setTimeout(() => { wipe.classList.add('fade'); }, 120);
    setTimeout(() => { wipe.classList.remove('run', 'full', 'fade'); }, 700);
  }, 800);
}
$$('[data-world]').forEach(a => a.addEventListener('click', e => { if (RM) return; e.preventDefault(); wipeTo(a.dataset.world, e.clientX || W / 2, e.clientY || H / 2); }));
// the Iftar gesture
$('#cb-thank').addEventListener('click', () => {
  S.cbThank = t;
  $('#cb-thank-msg').textContent = 'Done. Recognising the person behind the first taste was one of the campaign\'s four actions.';
  $('#cb-thank').textContent = 'Thank you sent';
});

// Spruce: pick a personality, then paint the room
const spChips = $('#sp-chips'), spTurnH = $('#sp-turn-h'), spRange = $('#sp-paint');
SPC.forEach((o, i) => {
  const b = document.createElement('button');
  b.type = 'button'; b.className = 'chip'; b.style.setProperty('--c', o.c);
  b.setAttribute('aria-pressed', 'false'); b.setAttribute('aria-label', o.n);
  b.innerHTML = `<i></i>${o.n}`;
  b.addEventListener('click', () => spPick(i));
  spChips.appendChild(b);
});
function spPick(i) {
  const sp = S.sp;
  if (sp.picked && sp.to === i) return;
  if (!sp.picked) sp.from = 9; else if (sp.paint > .5) sp.from = sp.to;
  sp.to = i; sp.paint = 0; sp.picked = true; sp.done = false; sp.auto = S.qE > 3.5 ? t + .15 : null;
  if (S.qE <= 3.5) sp.paint = 0;
  spRange.disabled = false; spRange.value = 0;
  $$('.chip', spChips).forEach((c, k) => c.setAttribute('aria-pressed', String(k === i)));
  spTurnH.textContent = SPC[i].n + '. Now paint the room.';
}
spRange.addEventListener('input', () => { S.sp.paint = spRange.value / 100; S.sp.auto = null; });
function spPaintAt(x) { S.sp.paint = clamp((x / W - .06) / .88, 0, 1); spRange.value = Math.round(S.sp.paint * 100); }
canvas.addEventListener('pointerdown', e => {
  if (S.route !== 'spruce' || !S.sp.picked || Math.abs(S.qE - 4) > .45) return;
  S.sp.drag = true; S.sp.auto = null; body.classList.add('painting');
  try { canvas.setPointerCapture(e.pointerId); } catch (err) {}
  spPaintAt(e.clientX);
});
canvas.addEventListener('pointermove', e => { if (S.sp.drag) spPaintAt(e.clientX); });
const spUp = () => { if (S.sp.drag) { S.sp.drag = false; body.classList.remove('painting'); } };
canvas.addEventListener('pointerup', spUp); canvas.addEventListener('pointercancel', spUp);
$('#sp-swatches').innerHTML = SPC.map(o => `<div style="--c:${o.c};--fg:${o.light ? '#0A0A0A' : '#F4F2EE'}"><span>${o.n}</span></div>`).join('');

// Prudential Zenith: the Tomorrow Pledge
$('#pz-form').addEventListener('submit', e => {
  e.preventDefault();
  const v = $('#pz-in').value.replace(/\s+/g, ' ').trim().replace(/[.!?…]+$/, '').slice(0, 42);
  if (!v) { $('#pz-in').focus(); return; }
  S.pzWord = v;
  if (GL) S.pzDraw(v);
  $('#pz-in').blur();
  window.scrollTo({ top: beatY(5) + 2, behavior: RM ? 'auto' : 'smooth' });
});

// Zenith: land in your city
$('#zb-form').addEventListener('submit', e => {
  e.preventDefault();
  const v = $('#zb-in').value.toUpperCase().replace(/[^A-Z .-]/g, '').replace(/\s+/g, ' ').trim().slice(0, 12);
  if (!v) { $('#zb-in').focus(); return; }
  S.zbCity = v; S.zbState = -1;
  $('#zb-in').blur();
  window.scrollTo({ top: beatY(5) + 2, behavior: RM ? 'auto' : 'smooth' });
});

// Method, Journal, Contact
$$('[data-jf]').forEach(b => b.addEventListener('click', () => {
  const f = b.dataset.jf;
  $$('[data-jf]').forEach(o => o.setAttribute('aria-pressed', String(o === b)));
  $$('.jitem').forEach(it => { it.hidden = f !== 'all' && it.dataset.jt !== f; });
  measureStudio();
}));
$('#essay-open').addEventListener('click', () => {
  const e = $('#essay'), open = e.hidden;
  e.hidden = !open; $('#essay-open').setAttribute('aria-expanded', String(open)); e.closest('.jfeat').classList.toggle('open', open);
  $('#essay-open').textContent = open ? 'Close the article ↑' : 'Read the article ↓';
  measureStudio();
});
const pickTopic = v => { const i = $(`#cform input[name="topic"][value="${v}"]`); if (i) i.checked = true; };
$$('[data-topic]').forEach(b => b.addEventListener('click', () => { pickTopic(b.dataset.topic); window.scrollTo({ top: 0, behavior: RM ? 'auto' : 'smooth' }); setTimeout(() => $('#c-first').focus({ preventScroll: true }), RM ? 0 : 500); }));
$$('[data-careers]').forEach(a => a.addEventListener('click', () => { S.goCareers = true; }));
// the contact form: clear errors where they happen, and a confirmation with a route that works today
const cform = $('#cform'), cdone = $('#cdone');
function cErr(name, msg) {
  const inp = cform.elements[name], e = $('#e-' + name);
  inp.setAttribute('aria-invalid', String(!!msg)); e.textContent = msg || '';
  return !msg;
}
cform.addEventListener('submit', e => {
  e.preventDefault();
  const F = cform.elements, v = k => (F[k].value || '').trim();
  const ok = [cErr('first', v('first') ? '' : 'Please add your first name.'), cErr('last', v('last') ? '' : 'Please add your last name.'),
    cErr('email', /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v('email')) ? '' : 'Please enter a valid email address.'),
    cErr('msg', v('msg').length >= 10 ? '' : 'Tell us a little more: a sentence or two is enough.')];
  if (ok.includes(false)) { const bad = $('[aria-invalid="true"]', cform); if (bad) bad.focus(); return; }
  const topic = (cform.querySelector('input[name="topic"]:checked') || {}).value || 'project';
  const T = { project: 'A new project', retainer: 'A retainer', careers: 'Careers', press: 'Press' }[topic];
  const body = `${v('msg')}\n\n${v('first')} ${v('last')}\n${v('email')}`;
  $('#cdone-mail').href = `mailto:office@therepublic.agency?subject=${encodeURIComponent(T + ' · ' + v('first') + ' ' + v('last'))}&body=${encodeURIComponent(body)}`;
  const wa = $('#cdone-wa'); wa.hidden = !WHATSAPP; if (WHATSAPP) wa.href = waLink(`${T}: ${v('msg')} (${v('first')} ${v('last')})`);
  $('#cdone-h').textContent = `Thank you, ${v('first')}.`;
  cform.hidden = true; cdone.hidden = false; cdone.focus();
});
$$('input, textarea', cform).forEach(i => i.addEventListener('input', () => { if (i.getAttribute('aria-invalid') === 'true') cErr(i.name, ''); }));
$('#cdone-again').addEventListener('click', () => { cform.reset(); cdone.hidden = true; cform.hidden = false; $('#c-first').focus(); });

// Home: strike "viewers", then decode "citizens." in the pixel face
(function () {
  const el = $('#cz'); if (!el) return;
  const word = el.dataset.word, G = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#%&@/\\*+=0123456789';
  const run = () => {
    b0El.classList.add('ready');
    if (RM) return;
    let t0 = performance.now();
    const step = now => {
      const k = (now - t0 - 900) / 700;
      if (k >= 1) { el.textContent = word; return; }
      el.textContent = word.split('').map((c, i) => (k * word.length > i || c === '.') ? c : (k < 0 ? c : G[Math.floor(Math.random() * G.length)].toLowerCase())).join('');
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  setTimeout(run, 350);
})();

/* ---------------- apply route ---------------- */
const stageGate = $('.stage.gate'), stageOnga = $('.stage.onga'), stageCb = $('.stage.cb');
const routeEls = $$('[data-for]');
const placeEl = $('#place');
const navWork = $('#nav-work'), navStudio = $('#nav-studio'), navServices = $('#nav-services');
function applyRoute(r) {
  if (r !== 'studio') closePerson(true);
  if (S.releaseTex) { if (r === 'work') S.releaseTex('city'); else if (r === 'gate') setTimeout(() => S.releaseTex('city'), 3500); const w = r.replace('-case', ''); if (WORLDS[w]) S.releaseTex(w); }
  const prev = S.route;
  S.route = r;
  body.dataset.route = r;
  routeEls.forEach(el => { el.hidden = el.dataset.for !== (isFile(r) ? 'file' : r); });
  if (isFile(r)) renderFile(r.replace('-case', '')); else document.title = TITLES[r] || 'The Republic';
  { // title, description, canonical address and share card, from the same table the build writes into each page
    const m = window.SEO && SEO.meta[r];
    if (m) {
      document.title = m.t;
      const set = (sel, attr, v) => { const el = document.querySelector(sel); if (el) el.setAttribute(attr, v); };
      set('meta[name="description"]', 'content', m.d);
      if (r !== 'lost') { set('link[rel="canonical"]', 'href', SEO.domain + m.p); set('meta[property="og:url"]', 'content', SEO.domain + m.p); }
      set('meta[property="og:title"]', 'content', m.t); set('meta[property="og:description"]', 'content', m.d); set('meta[property="og:image"]', 'content', SEO.domain + m.o);
      set('meta[name="twitter:title"]', 'content', m.t); set('meta[name="twitter:description"]', 'content', m.d);
    }
  }
  setH1(r);
  placeEl.textContent = PLACE[r];
  if (r === 'work' || isWorld(r) || isCase(r)) navWork.setAttribute('aria-current', 'page'); else navWork.removeAttribute('aria-current');
  if (isWorld(r) || isCase(r)) fillNotes(r.replace('-case', ''));
  if (r !== 'cowbell') S.cbDay = null;
  if (r !== 'spruce') S.spTi = null;
  if (r !== 'cowbell' && r !== 'spruce') body.classList.remove('daylight');
  if (r === 'studio') navStudio.setAttribute('aria-current', 'page'); else navStudio.removeAttribute('aria-current');
  if (navServices) { if (isSvc(r)) navServices.setAttribute('aria-current', 'page'); else navServices.removeAttribute('aria-current'); }
  ['method', 'journal', 'contact'].forEach(k => { const a = $('#nav-' + k); if (r === k) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
  $$('.mlinks a').forEach(a => { const h = a.dataset.mgo || (routeFromPath(a.getAttribute('href')) || {}).r; if (h === r) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
  setCrumbs(r);
  if (r === 'studio' && S.personSlug) { const pi = PEOPLE.findIndex(q => slug(q.n) === S.personSlug); S.personSlug = null; if (pi >= 0) setTimeout(() => openPerson(pi), RM ? 0 : 450); }
  setSpacer();
  window.scrollTo(0, 0);
  S.p = S.pS = 0; S.q = S.qS = 0; S.over = 0; if (stageGate) stageGate.style.opacity = 1;
  setLens(false);
  select(null);
  if (S.list) setList(false);
  canvas.style.touchAction = r === 'work' ? 'none' : r === 'spruce' ? 'pan-y' : 'auto';
  S.transUntil = t + 1.8;
  if (GL) {
    gateGroup.visible = r === 'gate' || r === 'work' || isPage(r);
    cityGroup.visible = r === 'gate' || r === 'work' || isPage(r);
    ongaGroup.visible = r === 'onga';
    capGroup.visible = r === 'studio';
    cbGroup.visible = r === 'cowbell';
    spGroup.visible = r === 'spruce';
    pzGroup.visible = r === 'pzl';
    zbGroup.visible = r === 'zenith';
    scene.background = r === 'onga' ? bgCol : r === 'cowbell' ? S.cbBg : r === 'spruce' ? S.spBg : r === 'pzl' ? S.pzBg : r === 'zenith' ? S.zbBg : bgTex;
    if (r === 'studio') {
      S.capT = t; S.vox.done = false;
      if (!S.booted) { rig.pos.set(0, 30, 64); rig.look.set(0, 8, -14); }
    }
    if (r === 'work') {
      S.enterT = t;
      if (isWorld(prev) || isCase(prev)) { const o = byId[prev.replace('-case', '')]; rig.pos.set(o.x + 1, 7, o.z + 12); rig.look.set(o.x, 6, o.z); }
      if (!S.booted) { rig.pos.set(0, 60, 90); rig.look.set(0, 0, 0); }
    }
    if (r === 'onga') { rig.pos.set(0, 3, 44); rig.look.set(0, 1, -4); }
    if (r === 'cowbell') { rig.pos.set(0, 5.5, 56); rig.look.set(1, 5, 10); }
    if (r === 'spruce') { rig.pos.set(0, 6, 36); rig.look.set(0, 5.6, -8); }
    if (r === 'pzl') { rig.pos.set(0, 4, 52); rig.look.set(2, 4.5, -20); }
    if (r === 'zenith') { rig.pos.set(0, 8, 30); rig.look.set(1, 9, -18); }
    if (r === 'gate' && !S.booted) { rig.pos.set(0, 7, 34); rig.look.set(0, 7, 0); }
  }
  if (!GL && r === 'work') setList(true);
  if (isPage(r)) { measureStudio(); readScroll(); S.qS = S.q; }
  if (r === 'contact' && S.turnText != null) { const m = $('#c-msg'); if (m && S.turnText) m.value = S.turnText; S.turnText = null; setTimeout(() => $('#c-first').focus({ preventScroll: true }), 80); }
  if (r === 'contact' && S.goCareers) { S.goCareers = false; setTimeout(() => { const c = $('#careers-sec'); if (c) c.scrollIntoView({ behavior: 'auto', block: 'center' }); }, 60); }
  S.booted = true;
  const h = { gate: '#gate-h', work: '#work-h', onga: '#onga-h', 'onga-case': '#case-h', cowbell: '#cb-h', 'cowbell-case': '#cbcase-h', spruce: '#sp-h', 'spruce-case': '#spcase-h', pzl: '#pz-h', 'pzl-case': '#pzcase-h', zenith: '#zb-h', 'zenith-case': '#zbcase-h', studio: '#studio-h', method: '#method-h', journal: '#journal-h', contact: '#contact-h' }[r] || (isFile(r) ? '#cf-h' : isSvc(r) ? '#' + r + '-h' : null);
  if (prev !== r && S.hadRoute && h) { const el = $(h); if (el) el.focus({ preventScroll: true }); }
  S.hadRoute = true;
}

/* ---------------- scroll ---------------- */
function readScroll() {
  if (isPage(S.route)) {
    const c = studioCenters, y = window.scrollY + window.innerHeight / 2;
    if (!c.length) return;
    let q = 0;
    if (y <= c[0]) q = 0;
    else if (y >= c[c.length - 1]) q = c.length - 1;
    else for (let i = 0; i < c.length - 1; i++) if (y < c[i + 1]) { q = i + (y - c[i]) / (c[i + 1] - c[i]); break; }
    S.q = q;
    return;
  }
  const n = BEATS[S.route];
  if (!n) return;
  const span = n * spacerSpan();
  S.over = Math.max(0, window.scrollY - span);
  const v = clamp(window.scrollY / span, 0, 1) * n;
  if (S.route === 'gate') S.p = v; else S.q = v;
}
window.addEventListener('scroll', readScroll, { passive: true });

/* ---------------- pointer (city) ---------------- */
const ray = GL ? new THREE.Raycaster() : null;
const ndc = GL ? new THREE.Vector2() : null;
function pick(cx, cy) {
  ndc.set(cx / W * 2 - 1, -(cy / H) * 2 + 1);
  ray.setFromCamera(ndc, camera);
  const hit = ray.intersectObjects(pickables.filter(o => o.visible), false)[0];
  return hit ? hit.object.userData.i : null;
}
let hoverReq = null;
window.addEventListener('pointermove', e => { S.gp = [e.clientX / W * 2 - 1, -(e.clientY / H) * 2 + 1]; S.px = e.clientX / W - .5; S.py = e.clientY / H - .5; S.touch = e.pointerType === 'touch'; S.mNdc = S.touch ? null : [e.clientX / W * 2 - 1, -(e.clientY / H) * 2 + 1]; }, { passive: true });
document.addEventListener('pointerleave', () => { S.mNdc = null; });
window.addEventListener('blur', () => { S.mNdc = null; });
canvas.addEventListener('pointermove', e => {
  if (S.route !== 'work' || !GL) return;
  if (S.drag) {
    const dx = e.clientX - S.drag.x, dy = e.clientY - S.drag.y;
    if (Math.abs(dx) + Math.abs(dy) > 6) S.drag.moved = true;
    if (S.drag.moved) {
      if (S.sel) select(null);
      S.panX = clamp(S.drag.panX - dx * (PHONE ? .09 : .055), -26, 28);
      S.phi = clamp(S.drag.phi - dy * .004, .62, 1.2);
    }
    return;
  }
  hoverReq = [e.clientX, e.clientY];
  hovercap.style.transform = `translate3d(${Math.min(e.clientX + 18, W - 260)}px,${e.clientY + 20}px,0)`;
});
canvas.addEventListener('pointerdown', e => {
  if (S.route !== 'work' || !GL) return;
  S.drag = { x: e.clientX, y: e.clientY, panX: S.panX, phi: S.phi, moved: false, id: e.pointerId };
  try { canvas.setPointerCapture(e.pointerId); } catch (err) {}
});
const endDrag = e => {
  if (!S.drag) return;
  const d = S.drag; S.drag = null;
  if (!d.moved && e.type === 'pointerup') {
    const i = pick(e.clientX, e.clientY);
    if (i != null) select(CASES[i].id); else select(null);
  }
};
canvas.addEventListener('pointerup', endDrag);
canvas.addEventListener('pointercancel', endDrag);
canvas.addEventListener('pointerleave', () => { if (!S.drag) { S.hover = null; canvas.style.cursor = ''; hovercap.classList.remove('on'); } });
canvas.addEventListener('wheel', e => {
  if (S.route !== 'work') return;
  const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
  S.panX = clamp(S.panX + d * .03, -26, 28);
  if (S.sel) select(null);
}, { passive: true });

/* ---------------- camera rig ---------------- */
const rig = GL ? { pos: new THREE.Vector3(0, 7, 34), look: new THREE.Vector3(0, 7, 0) } : null;
const dPos = GL ? new THREE.Vector3() : null, dLook = GL ? new THREE.Vector3() : null;
const KG = [
  { p: [0, 7, 30], l: [0, 7, 0] },
  { p: [0, 7, 17.5], l: [0, 7, 0], h: [.55, .95] },
  { p: [0, 7, 27.5], l: [0, 7, 0] },
  { p: [0, 30, 34], l: [0, 0, -2] },
  { p: [0, 3.5, 53], l: [0, 8.6, -2] }
];
// how we work gets its own shots between beats 3 and 6: a low sweep over the questions, the summit from below, then a crane up as the rings spread
const KGS = [
  { at: 3, p: [0, 30, 34], l: [0, 0, -2] },
  { at: 3.9, p: [-17, 8.5, 21], l: [3, 1.2, -9] },
  { at: 4.75, p: [PHONE ? 0 : -7, 2.6, 25], l: [PHONE ? 0 : -6.4, PHONE ? 8.4 : 7.2, -4.5] },
  { at: 5.3, p: [PHONE ? -6 : -15, 21, 33], l: [PHONE ? -1 : -5.5, 2.5, -6] },
  { at: 6, p: [0, 3.5, 53], l: [0, 8.6, -2] }
];
function keyAtT(K, v, outP, outL) {
  let i = 0; while (i < K.length - 2 && v >= K[i + 1].at) i++;
  const a = K[i], b = K[i + 1], f = ease(sstep(.12, .88, (v - a.at) / (b.at - a.at)));
  outL.set(lerp(a.l[0], b.l[0], f), lerp(a.l[1], b.l[1], f), lerp(a.l[2], b.l[2], f));
  outP.set(lerp(a.p[0], b.p[0], f), lerp(a.p[1], b.p[1], f), lerp(a.p[2], b.p[2], f));
  outP.sub(outL).multiplyScalar(aspectK()).add(outL);
}
const KO = [
  { p: [0, 1.5, 28], l: [0, 1, -4] },
  { p: [-1.6, .6, 10], l: [-1.8, -1.6, -3] },
  { p: [3, 2, 21], l: [0, .5, -8] },
  { p: [0, 4.5, 3], l: [0, 6.5, -30] }
];
const KC = [
  { p: [1, 4.8, 45], l: [1.5, 5, 17] },
  { p: [1.5, 4.6, 20], l: [3, 4.4, -2] },
  { p: [1, 4.4, 6], l: [3, 4, -14] },
  { p: [.5, 3.4, -8], l: [2.5, 2.4, -28] },
  { p: [0, 6, -14], l: [0, 7, -40] }
];
const KSP = [
  { p: [0, 5.8, 25], l: [0, 5.6, -8] },
  { p: [-1.2, 5.6, 21], l: [1, 5.8, -8] },
  { p: [1.6, 6.2, 14.5], l: [2.6, 6.2, -8] },
  { p: [2, 6.2, 18], l: [4.2, 6.2, -8] },
  { p: [-.4, 6.4, 22], l: [1.2, 5.8, -8] },
  { p: [0, 7, 28], l: [1, 5.8, -8] }
];
const KPZ = [
  { p: [.5, 3.4, 34], l: [3, 5.2, -10] },
  { p: [1.2, 3.6, 3], l: [8.6, 7.2, -24] },
  { p: [0, 3.8, -30], l: [5, 7.4, -58] },
  { p: [0, 4.2, -100], l: [6, 11, -140] },
  { p: [-1, 4.4, -152], l: [5.5, 9.6, -184] },
  { p: [-1, 5.4, -156], l: [5.5, 9.8, -184] }
];
const KZB = [
  { p: [0, 7.6, 16], l: [2, 9.2, -18] },
  { p: [-.5, 8.4, 6], l: [3.4, 9.8, -18] },
  { p: [1, 8.4, 6], l: [3.6, 9.6, -18] },
  { p: [-3, 5.2, -32], l: [9, 6.2, -58] },
  { p: [0, 6.4, -88], l: [0, 8.8, -121] },
  { p: [0, 6.2, -102], l: [0, 8.4, -121] }
];
const KZBm = [
  { p: [5, 8, 30], l: [7, 8.4, -18] },
  { p: [4.5, 8, 22], l: [7, 8.8, -18] },
  { p: [4.5, 8, 22], l: [7, 8.8, -18] },
  { p: [-2, 4.6, -30], l: [12, 5.4, -56] },
  { p: [0, 6, -80], l: [0, 8.2, -121] },
  { p: [0, 6, -92], l: [0, 8, -121] }
];
const PZSKY = [[0, '#120D26', '#7A2E3C'], [.35, '#07081A', '#241A36'], [.62, '#05060F', '#171428'], [.84, '#16204A', '#B8543C'], [1, '#2C3F78', '#F0A25A']].map(k => [k[0], GL ? new THREE.Color(k[1]) : null, GL ? new THREE.Color(k[2]) : null]);
const SKY = [[0, '#04071C', '#131B45'], [.16, '#10205A', '#D98A5B'], [.34, '#6F94C8', '#F2DDB8'], [.56, '#86A8D6', '#F5E6CC'], [.78, '#3A2B5C', '#EE8A45'], [1, '#0A0D2A', '#6E3440']].map(k => [k[0], GL ? new THREE.Color(k[1]) : null, GL ? new THREE.Color(k[2]) : null]);
function skyAt(tt, top, hor) {
  let i = 0; while (i < SKY.length - 2 && tt > SKY[i + 1][0]) i++;
  const a = SKY[i], b = SKY[i + 1], f = clamp((tt - a[0]) / (b[0] - a[0]), 0, 1);
  top.copy(a[1]).lerp(b[1], f); hor.copy(a[2]).lerp(b[2], f);
}
const KM = [
  { p: [-6, 30, 44], l: [0, 2, -4] },
  { p: [-22, 22, 30], l: [-8, 2, -4] },
  { p: [-28, 12, 14], l: [-12, 3, -6] },
  { p: [0, 46, 26], l: [0, 0, -6] },
  { p: [22, 18, 30], l: [8, 3, -4] },
  { p: [9, 10, 22], l: [2.25, 1, 2.25] }
];
const KJ = [
  { p: [30, 10, 30], l: [12, 5, -4] },
  { p: [-6, 26, 40], l: [-2, 2, -4] }
];
const KCT = [
  { p: [9, 8, 18], l: [2.25, 1.2, 2.25] },
  { p: [-6, 16, 22], l: [2.25, 1, 2.25] }
];
const KS = [
  { p: [0, 3.6, 16], l: [0, 1.6, -4] },
  { p: [0, 1.3, 9.5], l: [0, 5, -14] },
  { p: [0, 14, 32], l: [0, 6, -10] },
  { p: [-5, 38, 17], l: [-5, 0, -1] }
];
function aspectK() { const a = camera.aspect; return a < 1 ? Math.min(1.8, .98 / a) : (a < 1.35 ? 1.18 : 1); }
function keyAt(K, v, outP, outL, noK) {
  const i = clamp(Math.floor(v), 0, K.length - 1), j = Math.min(i + 1, K.length - 1);
  const hw = K[i].h || [.1, .9];
  const f = ease(sstep(hw[0], hw[1], v - i));
  outL.set(lerp(K[i].l[0], K[j].l[0], f), lerp(K[i].l[1], K[j].l[1], f), lerp(K[i].l[2], K[j].l[2], f));
  outP.set(lerp(K[i].p[0], K[j].p[0], f), lerp(K[i].p[1], K[j].p[1], f), lerp(K[i].p[2], K[j].p[2], f));
  if (!noK) outP.sub(outL).multiplyScalar(aspectK()).add(outL);
}

/* ---------------- DOM beats ---------------- */
const gateBeats = $$('.beat', stageGate), ongaBeats = $$('.beat', stageOnga), cbBeats = $$('.beat', stageCb), spBeats = $$('.beat', $('.stage.sp'));
const scrimSp = $('#scrim-sp'), spNameEl = $('#sp-name'), spIdxEl = $('#sp-idx');
const zbBeats = $$('.beat', $('.stage.zb')), scrimZb = $('#scrim-zb');
const pzBeats = $$('.beat', $('.stage.pz')), scrimPz = $('#scrim-pz'), pzYear = $('#pz-year'), pzYl = $('#pz-yl');
const scrimCb = $('#scrim-cb'), cbTime = $('#cb-time'), cbPhase = $('#cb-phase');
const scrimGate = $('#scrim-gate'), scrimGateB = $('#scrim-gate-b'), scrimOnga = $('#scrim-onga');
const b0El = $('.b0'), scrimTop = $('#scrim-gate-t');
function beatOp(v, i, last) {
  if (last && v >= i) return 1;
  if (i === 0 && v <= 0) return 1;
  return clamp(1 - Math.abs(v - i) * 2.4, 0, 1);
}
const rayc = GL ? new THREE.Raycaster() : null, plane0 = GL ? new THREE.Plane(new THREE.Vector3(0, 1, 0), 0) : null, V2r = GL ? new THREE.Vector2() : null, V3r = GL ? new THREE.Vector3() : null;
if (PHONE) { const h = $('#sq-hint'); if (h) h.textContent = 'Touch the grid to stir it'; }
// How we work, in four acts: the title; the questions over restless ground; one true thing rises; everything around it moves
const win = (v, a, b, c, d) => sstep(a, b, v) * (1 - sstep(c, d, v));
const actEls = $$('.b2 .act'), reel = $('#reel'), reelLis = $$('#reel li'), reelWin = $('.reelwin'), sqHint = $('#sq-hint'), t4El = $('.b2 .t4');
let reelC = null;
addEventListener('resize', () => { reelC = null; });
if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { reelC = null; });
function styleSet(el, op, dy) {
  const o = op.toFixed(3); if (el._o !== o) { el._o = o; el.style.opacity = o; el.style.visibility = op > .004 ? 'visible' : 'hidden'; }
  const tr = RM || dy == null ? '' : `translate3d(0,${dy.toFixed(1)}px,0)`; if (el._t !== tr) { el._t = tr; el.style.transform = tr; }
}
function strategyFrame(p) {
  const o1 = win(p, 2.55, 2.8, 3.15, 3.34), o2 = win(p, 3.26, 3.44, 4.3, 4.48), o3 = win(p, 4.42, 4.64, 5.22, 5.45), o4 = sstep(4.9, 5.1, p);
  styleSet(actEls[0], o1, (2.9 - p) * 70);
  styleSet(actEls[1], o2, (3.8 - p) * 24);
  styleSet(actEls[2], o3, (4.75 - p) * 36);
  if (t4El._o !== o4.toFixed(3)) { t4El._o = o4.toFixed(3); t4El.style.opacity = RM ? '' : t4El._o; }
  if (sqHint) sqHint.style.opacity = (RM ? 0 : o2 * (S.touch ? .8 : 1)).toFixed(3);
  if (!RM && o2 > 0) {
    if (!reelC && reelWin.offsetHeight) reelC = reelLis.map(li => li.offsetTop + li.offsetHeight / 2);
    const qf = clamp((p - 3.42) / .86, 0, 1) * (reelLis.length - 1), i0 = Math.floor(qf), i1 = Math.min(i0 + 1, reelLis.length - 1);
    if (reelC) {
      const c = lerp(reelC[i0], reelC[i1], qf - i0), ty = (reelWin.offsetHeight / 2 - c).toFixed(1);
      if (reel._ty !== ty) { reel._ty = ty; reel.style.transform = `translate3d(0,${ty}px,0)`; }
    }
    reelLis.forEach((li, i) => { const o = Math.max(.12, 1 - Math.abs(i - qf) * .88).toFixed(3); if (li._o !== o) { li._o = o; li.style.opacity = o; } li.classList.toggle('on', Math.abs(i - qf) < .5); });
    const ai = Math.round(qf); // every new question lands somewhere on the ground and sends a pulse out
    if (o2 > .5 && ai !== S.sqI) { S.sqI = ai; if (GL && pMat) { const a = Math.random() * Math.PI * 2, rr = 5 + Math.random() * 10; pMat.uniforms.uPulC.value.set(Math.cos(a) * rr, -4.5 + Math.sin(a) * rr * .8); S.pulseT = t; } }
  } else if (o2 === 0) S.sqI = null;
  return [o1, o2, o3];
}
// clients: one list, one marquee, no tiers. Logos from the current site, turned into white marks.
const CLIENTS = [['cowbell', 'Cowbell', 1.04], ['kremela', 'Kremela', 2.73], ['chivita-hollandia', 'Chivita Hollandia International', 1.31], ['prudential-zenith', 'Prudential Zenith Life Insurance', 3.16],
  ['dulux', 'Dulux', 2.06], ['zenith-bank', 'Zenith Bank', .93], ['loya', 'Loya Milk', 1.25], ['twisco', 'Twisco', 2.98], ['sanlam-allianz', 'Sanlam Allianz', 8.37],
  ['cowbell-chocolate', 'Cowbell Chocolate', 1.54], ['i-invest', 'i-invest', 2.83], ['miksi', 'Miksi', 2.63], ['heirs-insurance', 'Heirs Insurance', 5.97]];
$$('[data-logos]').forEach(box => {
  const one = hide => `<div class="track"${hide ? ' aria-hidden="true"' : ' role="list" aria-label="Clients"'}>${CLIENTS.map(([f, n, a]) =>
    `<span${hide ? '' : ' role="listitem"'}><img src="img/cl-${f}.webp" alt="${hide ? '' : n}" loading="lazy" style="--h:${Math.max(24, Math.min(62, 46 * Math.sqrt(1.9 / a))).toFixed(0)}px"></span>`).join('')}</div>`;
  box.innerHTML = one(false) + one(true);
  box.style.display = 'flex';
});
$('#skip').addEventListener('click', e => { e.preventDefault(); const h = $(`[data-for="${S.route}"] h1`) || $(`[data-for="${isFile(S.route) ? 'file' : S.route}"] h1`) || $('main h1'); if (h) { h.setAttribute('tabindex', '-1'); h.focus(); } });
/* ---------- getting around: crumbs, progress, chapters, menu, transitions, cursor ---------- */
const FLAG = ['onga', 'cowbell', 'spruce', 'pzl', 'zenith'];
const routeOf = id => WORLDS[id] ? id : id + '-case';
function setCrumbs(r) {
  const cr = $('#crumb'), nx = $('#nextw');
  const inWorld = isWorld(r), inCase = isCase(r) || isFile(r);
  cr.hidden = !(inWorld || inCase); nx.hidden = cr.hidden;
  body.classList.toggle('crumbs', !cr.hidden);
  if (cr.hidden) return;
  let nid = null, label = '';
  if (inWorld) { const k = FLAG.indexOf(r); nid = FLAG[k + 1] || null; label = nid ? 'Next world →' : 'Case files →'; if (!nid) nid = ORDER.find(id => !WORLDS[id]); }
  else { const id = r.replace('-case', ''), n = ORDER.indexOf(id); nid = ORDER[n + 1] || null; label = nid ? 'Next case →' : 'Back to the city →'; }
  nx.textContent = label; nx.setAttribute('href', nid ? pathOf(routeOf(nid)) : '/work');
  nx.setAttribute('aria-label', nid ? label.replace(' →', '') + ': ' + (CASEFILES[nid] ? CASEFILES[nid].title : byId[nid].t) : 'Back to the City of Work');
}
const progI = $('#prog i');
function chromeTick() {
  const r = S.route; let f = 0;
  if (r === 'gate') f = Math.min(1, S.pE / BEATS.gate);
  else if (isWorld(r)) f = Math.min(1, S.qE / BEATS[r]);
  else if (r !== 'work') { const m = document.documentElement.scrollHeight - innerHeight; f = m > 0 ? Math.min(1, scrollY / m) : 0; }
  if (isCase(r) || isFile(r)) tabSpy();
  const fs = f.toFixed(4); if (progI._f !== fs) { progI._f = fs; progI.style.transform = `scaleX(${fs})`; }
}
// the menu
const menu = $('#menu'), menuBtn = $('#menubtn');
function setMenu(on) {
  menu.hidden = !on; menuBtn.setAttribute('aria-expanded', String(on));
  document.documentElement.style.overflow = on ? 'hidden' : '';
  if (on) $('#menu-x').focus(); else menuBtn.focus();
}
menuBtn.addEventListener('click', () => setMenu(true));
$('#menu-x').addEventListener('click', () => setMenu(false));
$$('.mlinks a').forEach(a => a.addEventListener('click', e => { menu.hidden = true; menuBtn.setAttribute('aria-expanded', 'false'); document.documentElement.style.overflow = ''; if (a.dataset.mgo) { e.preventDefault(); go(a.dataset.mgo); } }));
document.addEventListener('keydown', e => {
  if (menu.hidden) return;
  if (e.key === 'Escape') { e.preventDefault(); setMenu(false); }
  else if (e.key === 'Tab') { const f = $$('button, a[href]', menu), a = f[0], z = f[f.length - 1]; if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); } else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); } }
});
// every change of page gets the wipe, not just the worlds
const wipeEl = $('#wipe');
function wipeRoute(route, x, y) {
  if (RM || !wipeEl) { go(route); return; }
  wipeEl.style.background = WORLDS[route] ? WORLDS[route].col : '#1F1FFF';
  wipeEl.style.setProperty('--wx', x + 'px'); wipeEl.style.setProperty('--wy', y + 'px');
  wipeEl.classList.remove('fade'); wipeEl.classList.add('run', 'quick');
  requestAnimationFrame(() => wipeEl.classList.add('full'));
  setTimeout(() => {
    go(route);
    setTimeout(() => wipeEl.classList.add('fade'), 80);
    setTimeout(() => wipeEl.classList.remove('run', 'full', 'fade', 'quick'), 520);
  }, 440);
}
document.addEventListener('click', e => {
  const a = e.target.closest('a[href]');
  if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button || a.target === '_blank' || a.hasAttribute('data-world')) return;
  const url = new URL(a.href, location.href);
  if (url.origin !== location.origin) return;
  const hk = url.pathname === location.pathname && url.hash && url.hash !== '#main' ? decodeURIComponent(url.hash.slice(1)) : '';
  const m = hk ? (ALIAS[hk] ? { r: ALIAS[hk] } : ROUTES.includes(hk) ? { r: hk } : null) : routeFromPath(url.pathname);
  if (!m) return;
  e.preventDefault();
  if (m.person) { S.personSlug = m.person; if (m.r === S.route) { applyRoute('studio'); return; } }
  if (m.r === S.route) return;
  wipeRoute(m.r, e.clientX || W / 2, e.clientY || H / 2);
});
// a cursor that says what the 3D can do
const cur = $('#cur'), curS = $('span', cur), fine = matchMedia('(pointer:fine)').matches && !RM;
let cx = -99, cy = -99, tx = -99, ty = -99;
if (fine) {
  addEventListener('pointermove', e => {
    tx = e.clientX; ty = e.clientY; cur.classList.add('on');
    const el = e.target, onCanvas = el === canvas;
    let label = '';
    if (onCanvas && S.route === 'work') label = S.hover != null ? 'Open' : 'Drag';
    const link = !onCanvas && el.closest && el.closest('a, button, [role="button"], input, label, .ln');
    cur.classList.toggle('big', !!label); cur.classList.toggle('link', !label && !!link);
    if (curS.textContent !== label) curS.textContent = label;
  }, { passive: true });
  document.addEventListener('pointerleave', () => cur.classList.remove('on'));
  (function curLoop() { cx += (tx - cx) * .3; cy += (ty - cy) * .3; cur.style.transform = `translate3d(${cx.toFixed(1)}px,${cy.toFixed(1)}px,0)`; requestAnimationFrame(curLoop); })();
} else cur.remove();
// images open full screen, with their captions, in order
const lb = $('#lb'), lbImg = $('#lb-img');
let lbSet = [], lbI = 0, lbBack = null;
function lbShow(i) {
  lbI = (i + lbSet.length) % lbSet.length; const im = lbSet[lbI], fc = im.closest('figure') && $('figcaption', im.closest('figure'));
  lbImg.src = im.currentSrc || im.src; lbImg.alt = im.alt; $('#lb-cap').textContent = fc ? fc.textContent : im.alt;
  $('#lb-n').textContent = lbSet.length > 1 ? `${lbI + 1} / ${lbSet.length}` : '';
  $('#lb-prev').hidden = $('#lb-next').hidden = lbSet.length < 2;
}
function lbOpen(img) { const art = img.closest('article') || document; lbSet = $$('figure img', art).filter(x => x.offsetParent !== null && !x.closest('[data-film]')); lbBack = document.activeElement; lb.hidden = false; document.documentElement.style.overflow = 'hidden'; lbShow(Math.max(0, lbSet.indexOf(img))); $('#lb-x').focus(); }
function lbClose() { lb.hidden = true; document.documentElement.style.overflow = ''; if (lbBack && lbBack.focus) lbBack.focus(); }
document.addEventListener('click', e => { const im = e.target.closest('.case figure img, .cfile figure img'); if (im && lb.hidden && !im.closest('[data-film]')) { e.preventDefault(); lbOpen(im); } });
$('#lb-x').addEventListener('click', lbClose); lb.addEventListener('click', e => { if (e.target === lb) lbClose(); });
$('#lb-prev').addEventListener('click', () => lbShow(lbI - 1)); $('#lb-next').addEventListener('click', () => lbShow(lbI + 1));
document.addEventListener('keydown', e => { if (lb.hidden) return; if (e.key === 'Escape') lbClose(); else if (e.key === 'ArrowRight') lbShow(lbI + 1); else if (e.key === 'ArrowLeft') lbShow(lbI - 1); else if (e.key === 'Tab') { e.preventDefault(); const f = $$('button', lb).filter(b => !b.hidden); const k = f.indexOf(document.activeElement); f[(k + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus(); } });
// the article: reading time and sharing
{ const words = ($('#essay') ? $('#essay').textContent : '').trim().split(/\s+/).length; const et = $('#essay-time'); if (et) et.textContent = Math.max(1, Math.round(words / 220)) + ' min read'; }
const essayUrl = () => location.origin + '/journal';
$('#essay-share').addEventListener('click', async () => { if (navigator.share) { try { await navigator.share({ title: 'Write for the reply.', url: essayUrl() }); } catch (e) {} } else { try { await navigator.clipboard.writeText(essayUrl()); toast('Link copied.'); } catch (e) { toast(essayUrl()); } } });
$('#essay-copy').addEventListener('click', async () => { try { await navigator.clipboard.writeText(essayUrl()); toast('Link copied.'); } catch (e) { toast(essayUrl()); } });
if (!navigator.share) $('#essay-share').hidden = true;
// what each case shows of what we do, from the case records
const SVC = { onga: ['strategy', 'content', 'digital'], cowbell: ['strategy', 'content', 'digital'], spruce: ['strategy', 'content', 'digital'], pzl: ['strategy', 'content', 'integrated'],
  zenith: ['strategy', 'brand', 'integrated'], twisco: ['strategy', 'brand', 'content', 'integrated', 'experiences'], chivita12: ['content', 'experiences'], chivita2: ['content'], ramadan: ['brand'], sips: ['content'],
  youmatter: ['strategy', 'brand', 'integrated', 'digital'], sanlam: ['strategy', 'brand'], dreams: ['digital', 'content'], pzlsocial: ['content'], heirs: ['brand'], iinvest: ['brand'], zenith35: ['experiences', 'brand'], torrista: ['brand'] };
CASES.forEach(c => { c.sv = SVC[c.id] || []; });
S.svc = '';
$('#svc').addEventListener('change', e => {
  S.svc = e.target.value; select(null);
  $$('#list-cols [data-case]').forEach(b => { b.closest('li').hidden = !!S.svc && !byId[b.dataset.case].sv.includes(S.svc); });
});
function tabSpy() {
  const art = $(`[data-for="${isFile(S.route) ? 'file' : S.route}"]`); if (!art) return;
  const tabs = $$('.tabs [data-jump]', art); if (!tabs.length) return;
  let cur = null; tabs.forEach(b => { const sec = document.getElementById(b.dataset.jump); if (sec && !sec.hidden && sec.getBoundingClientRect().top < 160) cur = b; });
  tabs.forEach(b => b.classList.toggle('cur', b === cur));
}
// case films: the player is ready; each button appears once its film file is in the build
const FILMS = { onga: { src: 'films/onga.mp4', poster: 'films/onga-poster.jpg', t: 'Onga · Taste of Home · Case film' }, cowbell: { src: 'films/cowbell.mp4', poster: 'films/cowbell-poster.jpg', t: 'Cowbell · Your First Taste · Case film' },
  spruce: { src: 'films/spruce.mp4', poster: 'films/spruce-poster.jpg', t: 'Spruce by Dulux · Show Your True Colours · Case film' }, pzl: { src: 'films/pzl.mp4', poster: 'films/pzl-poster.jpg', t: 'Prudential Zenith Life · Empowering Tomorrow · Case film' },
  zenith: { src: 'films/zenith.mp4', poster: 'films/zenith-poster.jpg', t: 'Zenith Bank · Homecoming film' },
  'pzl-hero': { src: 'films/pzl-hero.mp4', poster: 'films/pzl-hero.jpg', t: 'The hero film · My 40-Year Goals' },
  'pzl-oba': { src: 'films/pzl-oba.mp4', poster: 'films/pzl-oba.jpg', t: 'Oba and his dad · the family conversation' },
  'pzl-invite': { src: 'films/pzl-invite.mp4', poster: 'films/pzl-invite.jpg', t: "Olushola's invitation to ask the CEO", tall: 1 },
  'pzl-pledge': { src: 'films/pzl-pledge.mp4', poster: 'films/pzl-pledge.jpg', t: 'The Tomorrow Pledge', tall: 1 },
  'sp-clip1': { src: 'films/sp-clip1.mp4', poster: 'films/sp-clip1.jpg', t: 'Live creator debate · clipper edit', tall: 1 },
  'sp-clip2': { src: 'films/sp-clip2.mp4', poster: 'films/sp-clip2.jpg', t: 'Live creator debate · a second edit', tall: 1 },
  'cb-hero': { src: 'films/cb-hero.mp4', poster: 'films/cb-hero.jpg', t: 'The hero film · Your First Taste' },
  'cb-kunun': { src: 'films/cb-kunun.mp4', poster: 'films/cb-kunun.jpg', t: "Make · a creator's kunun kwakwa recipe", tall: 1 },
  'zb-energy': { src: 'films/zb-energy.mp4', poster: 'films/zb-energy.jpg', t: 'Street screen creative · Same Lagos energy' },
  'zb-taste': { src: 'films/zb-taste.mp4', poster: 'films/zb-taste.jpg', t: 'Street screen creative · Taste that feels like home' },
  'zb-parties': { src: 'films/zb-parties.mp4', poster: 'films/zb-parties.jpg', t: 'Street screen creative · Parties loud, bold and unforgettable' },
  'zb-social': { src: 'films/zb-social.mp4', poster: 'films/zb-social.jpg', t: 'Social · the season in the feed' },
  'z35-film': { src: 'films/z35-film.mp4', poster: 'films/z35-film.jpg', t: 'The anniversary film' },
  'z35-tunnel': { src: 'films/z35-tunnel.mp4', poster: 'films/z35-tunnel.jpg', t: 'Walking the tunnel of time' },
  'sanlam-radio': { src: 'films/sanlam-radio.mp4', poster: 'films/sanlam-radio.jpg', t: 'Launch radio · Confidence is our right' },
  'sanlam-time': { src: 'films/sanlam-time.mp4', poster: 'films/sanlam-time.jpg', t: 'Radio · time check' },
  'ym-report': { src: 'films/ym-report.mp4', poster: 'films/ym-report.jpg', t: 'The campaign in market' },
  'tw-billboard': { src: 'films/tw-billboard.mp4', poster: 'films/tw-billboard.jpg', t: 'Billboard, Lagos', tall: 1 },
  'tw-film': { src: 'films/tw-film.mp4', poster: 'films/tw-film.jpg', t: 'Everyday Hero, Everyday Twisco · the film' },
  'ym-tvc': { src: 'films/ym-tvc.mp4', poster: 'films/ym-tvc.jpg', t: 'You Matter · the TVC' } };
const filmx = $('#filmx'), filmV = $('#film-v');
let filmBack = null;
function openFilm(k, from) {
  const f = FILMS[k]; if (!f || !f.src) return;
  filmBack = from || null; filmV.src = f.src; filmV.poster = f.poster || ''; filmV.innerHTML = f.vtt ? `<track kind="captions" src="${f.vtt}" srclang="en" label="English" default>` : '';
  filmx.classList.toggle('tall', !!f.tall);
  $('#film-t').textContent = f.t; filmx.hidden = false; document.documentElement.style.overflow = 'hidden'; $('#film-x').focus(); filmV.play().catch(() => {});
}
$$('.playbtn[data-film]').forEach(b => { const f = FILMS[b.dataset.film]; b.hidden = !(f && f.src); });
document.addEventListener('click', e => { const b = e.target.closest('[data-film]'); if (b) { e.preventDefault(); openFilm(b.dataset.film, b); } });
$$('[data-filmcard]').forEach(a => { a.classList.add('hasfilm'); a.addEventListener('click', e => {
  const f = FILMS[a.dataset.filmcard]; if (!f || !f.src) return;
  e.preventDefault(); e.stopImmediatePropagation(); openFilm(a.dataset.filmcard, a);
}, true); });
function filmClose() { filmV.pause(); filmV.removeAttribute('src'); filmV.load(); filmx.hidden = true; document.documentElement.style.overflow = ''; if (filmBack) filmBack.focus(); }
$('#film-x').addEventListener('click', filmClose);
document.addEventListener('keydown', e => { if (!filmx.hidden && e.key === 'Escape') filmClose(); });
function applyBeats(els, v) {
  els.forEach((el, k) => {
    const i = +el.dataset.beat;
    let op = beatOp(v, i, k === els.length - 1);
    if (el.classList.contains('b0')) op = 1 - sstep(1.22, 1.5, v);
    if (el.classList.contains('b2')) op = sstep(2.5, 2.75, v) * (1 - sstep(5.3, 5.5, v));
    const was = el._op;
    if (was !== undefined && Math.abs(was - op) < .002) return;
    el._op = op;
    el.style.opacity = op.toFixed(3);
    el.style.transform = RM || i === 3 ? '' : `translateY(${((i - v) * 26).toFixed(1)}px)`;
    const on = op > .06;
    el.classList.toggle('on', on);
    el.setAttribute('aria-hidden', String(!on));
  });
}

/* ---------------- frame loop ---------------- */
let last = performance.now();
function update(dt) {
  const r = S.route;
  chromeTick();
  // smoothed scroll positions
  const kS = RM ? 1 : 1 - Math.exp(-dt * 8);
  S.pS += (S.p - S.pS) * kS; S.qS += (S.q - S.qS) * kS;
  S.pE = RM ? Math.round(S.p) : S.pS;
  S.qE = RM ? Math.round(S.q) : S.qS;
  S.lensS += (S.lens - S.lensS) * (RM ? 1 : 1 - Math.exp(-dt * 12));

  if (r === 'gate') {
    const p = S.pE;
    applyBeats(gateBeats, p);
    { const hk = (1 - sstep(.18, .55, p)).toFixed(3); if (b0El._hk !== hk) { b0El._hk = hk; b0El.style.setProperty('--hk', hk); } }
    const fadeOut = 1 - sstep(0, window.innerHeight * .55, S.over || 0);
    stageGate.style.opacity = fadeOut.toFixed(3);
    const ac = strategyFrame(p);
    scrimGate.style.opacity = Math.max(beatOp(p, 2), ac[1] * .85).toFixed(3);
    scrimGateB.style.opacity = Math.max(ac[0] * .85, ac[2] * .85, sstep(5.5, 6, p) * .9).toFixed(3);
    scrimTop.style.opacity = ((1 - sstep(1.2, 1.5, p)) * .75).toFixed(3);
  } else if (r === 'studio') {
    const q = S.qE;
    scrimGate.style.opacity = (beatOp(q, 1) * .7).toFixed(3);
    scrimGateB.style.opacity = (beatOp(q, 3, true) * .75).toFixed(3);
    const cur = Math.round(q);
    if (cur !== S.subCur) { S.subCur = cur; subBtns.forEach((b, i) => b.setAttribute('aria-current', String(i === cur))); }
  } else { scrimGate.style.opacity = 0; scrimGateB.style.opacity = 0; }
  if (r !== 'gate') scrimTop.style.opacity = 0;
  if (r === 'onga') {
    applyBeats(ongaBeats, S.qE);
    scrimOnga.style.opacity = (Math.max(beatOp(S.qE, 0), beatOp(S.qE, 1), beatOp(S.qE, 2), beatOp(S.qE, 3, true)) * (1 - S.lensS)).toFixed(3);
    body.style.setProperty('--lensv', S.lensS.toFixed(3));
  } else scrimOnga.style.opacity = 0;
  if (r === 'cowbell') {
    const q = S.qE, tt = clamp(q / 4, 0, 1);
    applyBeats(cbBeats, q);
    body.style.setProperty('--lensv', S.lensS.toFixed(3));
    const day = sstep(.2, .34, tt) * (1 - sstep(.64, .76, tt)) > .5 && S.lensS < .5;
    if (day !== S.cbDay) {
      S.cbDay = day;
      body.classList.toggle('daylight', day);
      body.style.setProperty('--cbfg', day ? '#0A0A0A' : '#F4F2EE');
      body.style.setProperty('--cbsub', day ? '#3A3A48' : '#C9CBE8');
      body.style.setProperty('--cbscrim', day ? 'rgba(246,238,222,.92)' : 'rgba(7,11,36,.9)');
      body.style.setProperty('--cbscrim2', day ? 'rgba(246,238,222,.55)' : 'rgba(7,11,36,.55)');
    }
    scrimCb.style.opacity = ((1 - S.lensS) * .95).toFixed(3);
    const TK = [240, 390, 750, 1065, 1125];
    const qi = Math.min(3, Math.floor(q)), qf = clamp(q - qi, 0, 1);
    const mins = Math.round(lerp(TK[qi], TK[qi + 1], qf) / 5) * 5;
    const hh = String(Math.floor(mins / 60)).padStart(2, '0'), mm = String(mins % 60).padStart(2, '0');
    const ph = q < .5 ? 'Suhoor · Kano' : q < 1.5 ? 'Dawn' : q < 2.5 ? 'Midday' : q < 3.5 ? 'Before Iftar' : 'Iftar · Abuja';
    const txt = hh + ':' + mm;
    if (cbTime.textContent !== txt) cbTime.textContent = txt;
    if (cbPhase.textContent !== ph) cbPhase.textContent = ph;
  } else scrimCb.style.opacity = 0;
  if (r === 'spruce') {
    const q = S.qE, sp = S.sp;
    applyBeats(spBeats, q);
    body.style.setProperty('--lensv', S.lensS.toFixed(3));
    scrimSp.style.opacity = ((1 - S.lensS) * .95).toFixed(3);
    if (sp.auto != null && !sp.drag) {
      const a = RM ? 1 : clamp((t - sp.auto) / 1.8, 0, 1);
      sp.paint = ease(a); spRange.value = Math.round(sp.paint * 100);
      if (a >= 1) sp.auto = null;
    }
    // the cast: nine repaints between beats 1.55 and 2.5; then Idan Black; your pick from beat 3.55
    let A, Bc, P;
    const cast = clamp((q - 1.55) / .95, 0, 1) * 9;
    if (q < 3.55 || !sp.picked) {
      if (cast >= 9) { A = 8; Bc = 9; P = 1; }
      else { A = Math.floor(cast); Bc = A + 1; P = ease(sstep(.12, .88, cast - A)); }
    } else { A = sp.from; Bc = sp.to; P = sp.paint * sstep(3.55, 3.85, q); }
    S.spA = A; S.spB = Bc; S.spP = P;
    const ti = S.lensS > .5 ? -1 : (P > .3 ? Bc : A);
    if (ti !== S.spTi) {
      S.spTi = ti;
      const o = ti < 0 ? null : SPC[ti], light = o ? o.light : false;
      body.classList.toggle('daylight', light);
      const dk = o ? o.rgb.map(v => Math.round(v * 255 * (light ? 1 : .42))) : [10, 10, 10];
      const lt = light ? o.rgb.map(v => Math.round(255 * (v + (1 - v) * .35))) : dk;
      body.style.setProperty('--spfg', light ? '#0A0A0A' : '#F4F2EE');
      body.style.setProperty('--spsub', light ? '#2E2E34' : '#E2E0EA');
      body.style.setProperty('--spscrim', `rgba(${lt.join(',')},.9)`);
      body.style.setProperty('--spscrim2', `rgba(${lt.join(',')},.5)`);
    }
    const ni = P > .5 ? Bc : A;
    if (ni !== S.spNi) { S.spNi = ni; spNameEl.textContent = SPC[ni].n; spIdxEl.textContent = String(ni + 1).padStart(2, '0') + ' / 10'; }
    if (sp.picked && sp.paint > .985 && !sp.done) { sp.done = true; spTurnH.textContent = 'Your room is ' + SPC[sp.to].n + '.'; }
  } else scrimSp.style.opacity = 0;
  if (r === 'pzl') {
    const q = S.qE;
    applyBeats(pzBeats, q);
    body.style.setProperty('--lensv', S.lensS.toFixed(3));
    scrimPz.style.opacity = ((1 - S.lensS) * .95).toFixed(3);
    const yr = 2026 + Math.round(40 * clamp((q - .25) / 3.75, 0, 1));
    const yl = yr <= 2026 ? 'Today' : yr >= 2066 ? 'Tomorrow' : 'The 40-year plan';
    if (pzYear.textContent !== String(yr)) pzYear.textContent = yr;
    if (pzYl.textContent !== yl) pzYl.textContent = yl;
  } else scrimPz.style.opacity = 0;
  if (r === 'zenith') {
    applyBeats(zbBeats, S.qE);
    body.style.setProperty('--lensv', S.lensS.toFixed(3));
    scrimZb.style.opacity = ((1 - S.lensS) * .95).toFixed(3);
  } else scrimZb.style.opacity = 0;

  if (!GL) return;
  U.uTime.value = t;
  U.uLens.value = isWorld(r) ? S.lensS : 0;

  /* camera targets */
  const k = aspectK();
  if (r === 'gate') { if (S.pE >= 3) keyAtT(KGS, S.pE, dPos, dLook); else keyAt(KG, S.pE, dPos, dLook); }
  else if (r === 'onga') {
    keyAt(KO, S.qE, dPos, dLook);
    if (!RM) { dPos.x += S.px * 1.4; dPos.y -= S.py * .9; }
    if (PHONE) dLook.y -= 3.2;
  } else if (r === 'zenith') {
    if (PHONE) keyAt(KZBm, S.qE, dPos, dLook, true); else keyAt(KZB, S.qE, dPos, dLook);
    if (!RM) { dPos.x += S.px * 1.2; dPos.y -= S.py * .6; }
  } else if (r === 'pzl') {
    keyAt(KPZ, S.qE, dPos, dLook);
    if (PHONE) { dLook.y -= 2.6; dPos.y -= .6; dPos.x = dLook.x * .6; }
    if (!RM) { dPos.x += S.px * 1.4; dPos.y -= S.py * .7; }
  } else if (r === 'spruce') {
    keyAt(KSP, S.qE, dPos, dLook);
    if (PHONE) { const fx = S.qE > 2.5 && S.qE < 3.5 ? 8.6 : 4; dLook.x = fx; dPos.x = fx; dLook.y -= 3.2; dPos.y -= 1.2; }
    if (!RM) { dPos.x += S.px * 1.2; dPos.y -= S.py * .7; }
  } else if (r === 'cowbell') {
    keyAt(KC, S.qE, dPos, dLook);
    if (!RM) { dPos.x += S.px * 1.4; dPos.y -= S.py * .8; }
    if (PHONE) dLook.y -= 2.4;
  } else if (r === 'studio') {
    keyAt(KS, S.qE, dPos, dLook);
    if (!RM) { dPos.x += S.px * 1.2; dPos.y -= S.py * .6; }
  } else if (PAGES[r]) {
    keyAt(r === 'method' ? KM : r === 'journal' ? KJ : KCT, S.qE, dPos, dLook);
    if (!RM) { dPos.x += S.px * 1.6 + Math.sin(t * .05) * 3; dPos.y -= S.py * .8; }
  } else if (r === 'work') {
    let R, phi, th;
    if (S.fly) {
      const b = S.fly.b;
      dLook.copy(b.poster.position); R = 3.2; phi = 1.52; th = 0;
    } else if (S.sel) {
      const c = byId[S.sel], b = B[c.i];
      dLook.set(c.x + (PHONE ? 0 : 3.6 * k), Math.max(2, b.cur * .62) - (PHONE ? 2.5 : 0), c.z);
      R = (b.c.f ? 21 : 15) * k; phi = 1.2; th = .3;
    } else {
      dLook.set(S.panX, PHONE ? 3 : 4.6, PHONE ? 0 : -3.2); R = (PHONE ? 38 : 50) * k; phi = S.phi; th = RM ? 0 : S.px * .12;
      if (PHONE) R = Math.min(R, 64);
    }
    dPos.set(dLook.x + R * Math.sin(phi) * Math.sin(th), dLook.y + R * Math.cos(phi), dLook.z + R * Math.sin(phi) * Math.cos(th));
  }
  let rate = r === 'gate' ? 6.5 : (isWorld(r) || isPage(r)) ? 4.5 : 3;
  if (t < S.transUntil) rate = Math.min(rate, 2.4);
  if (S.fly) rate = 2.6;
  const kr = RM ? 1 : 1 - Math.exp(-dt * rate);
  rig.pos.lerp(dPos, kr); rig.look.lerp(dLook, kr);
  camera.position.copy(rig.pos); camera.lookAt(rig.look);
  gridMat.uniforms.uC.value.copy(rig.look);

  /* gate + city */
  if (r === 'gate' || r === 'work' || isPage(r)) {
    const p = r === 'gate' ? S.pE : 6;
    const pu = pMat.uniforms;
    const hd = S.head, idle = RM ? 0 : (S.touch || !S.mNdc ? Math.sin(t * .32) * .22 : 0);
    hd.yaw += ((RM ? 0 : S.px * .62) + idle - hd.yaw) * (1 - Math.exp(-dt * 4));
    hd.pitch += ((RM ? 0 : S.py * .36) - hd.pitch) * (1 - Math.exp(-dt * 4));
    S.headM.compose(V3b.set(hd.x, hd.y, 0), S.hq.setFromEuler(S.he.set(hd.pitch, hd.yaw - (PHONE ? 0 : .26), 0)), S.hs.setScalar(hd.scale));
    pu.uMouse.value.set(S.mNdc ? S.mNdc[0] : 9, S.mNdc ? S.mNdc[1] : 9);
    { // the cursor parts the face only while it moves; at rest it just lights what it touches
      const m = S.mNdc, pv = S.mPrev; let tgt = 0;
      if (m && pv) tgt = Math.min(1, Math.hypot(m[0] - pv[0], m[1] - pv[1]) / Math.max(dt, .008) * .7);
      S.mv = (S.mv || 0) + (tgt - (S.mv || 0)) * (1 - Math.exp(-dt * (tgt > (S.mv || 0) ? 14 : 1.8)));
      S.mPrev = m ? [m[0], m[1]] : null; pu.uMV.value = RM ? 0 : S.mv;
      if (S.revT === undefined) S.revT = t;
      const since = t - S.revT;
      pu.uRev.value = RM ? 1 : Math.min(1, since / 2.4);
      pu.uScanOn.value = RM || since < 2.8 ? 0 : 1;
      pu.uScan.value = 1.45 - ((since - 2.8) % 7.5);
    }
    pu.uRepel.value = r === 'gate' ? 1 - sstep(.05, .4, p) : 0;
    S.plexus.matrix.copy(S.headM); S.plexus.matrixWorldNeedsUpdate = true;
    S.plexus.material.opacity = r === 'gate' ? .34 * (1 - sstep(.04, .3, p)) : 0;
    pMat.blending = r === 'gate' && pu.uT.value < .45 ? THREE.AdditiveBlending : THREE.NormalBlending; S.plexus.visible = S.plexus.material.opacity > .005;
    { // how we work: the ground stirs, rises into one summit, then everything around it moves
      const g = r === 'gate', nz = g ? win(p, 3.05, 3.45, 4.3, 4.75) : 0;
      pu.uNoise.value = RM ? 0 : nz; pu.uRipple.value = RM ? 0 : nz;
      pu.uPeak.value = g ? win(p, 4.3, 4.82, 5.4, 5.9) : 0;
      pu.uRing.value = g && !RM ? win(p, 4.85, 5.1, 5.35, 5.8) : 0;
      pu.uShock.value = g && !RM ? sstep(4.9, 5.42, p) : 0;
      const sm = g ? win(p, 4.72, 4.98, 5.32, 5.7) : 0;
      S.summit.material.opacity = sm; S.summit.visible = sm > .01;
      const ss = (3.2 + 2.2 * sm) * (RM ? 1 : 1 + .12 * Math.sin(t * 2.2)); S.summit.scale.set(ss, ss, 1);
    }
    pu.uPulse.value = S.pulseT == null ? 99 : t - S.pulseT;
    if (r === 'gate' && pu.uRipple.value > .01 && S.gp) { // the wiggle follows the pointer across the grid
      rayc.setFromCamera(V2r.set(S.gp[0], S.gp[1]), camera);
      if (rayc.ray.intersectPlane(plane0, V3r)) { const k = 1 - Math.exp(-dt * 2.5); pu.uRipC.value.x += (V3r.x - pu.uRipC.value.x) * k; pu.uRipC.value.y += (V3r.z - pu.uRipC.value.y) * k; }
    }
    pu.uT.value = r === 'gate' ? sstep(.1, .85, p) + sstep(1.55, 2.0, p) + sstep(2.35, 2.95, p) : 3;
    pu.uCit.value = r === 'gate' ? sstep(1.29, 1.5, p) : 1;
    pu.uReach.value = r === 'gate' ? sstep(1.0, 1.3, p) : 1;
    const solid = r === 'gate' ? sstep(.8, 1.08, p) * (1 - sstep(1.5, 1.6, p)) : 0;
    pu.uSolid.value = solid;
    S.stoneMat.uniforms.uSolid.value = solid;
    S.stoneMat.uniforms.uGlow.value = .45 + .55 * sstep(1.0, 1.3, p);
    S.stoneMat.uniforms.uCit.value = pu.uCit.value * (r === 'gate' ? 1 : 0);
    S.stone.forEach(m => { m.visible = solid > .005; m.position.copy(S.reachDir).multiplyScalar(-m.userData.side * pu.uReach.value * pu.uGap.value); });
    const dA = r === 'gate' ? sstep(.6, .95, p) * (1 - sstep(1.62, 1.9, p)) : 0;
    S.dustMat.uniforms.uA.value = dA; S.dustMat.uniforms.uBurst.value = r === 'gate' ? sstep(1.5, 1.85, p) : 0; S.dust.visible = dA > .005;
    const fl = r === 'gate' ? sstep(1.26, 1.31, p) * (1 - sstep(1.52, 1.8, p)) : 0;
    spark.material.opacity = fl; spark.visible = fl > .01;
    const ss = 1.2 + 34 * sstep(1.26, 1.8, p); spark.scale.set(ss, ss, 1);
    const fadeTarget = r === 'gate' ? (1 - .5 * sstep(5.3, 6, p)) : (r === 'work' ? .3 : .24);
    pu.uFade.value += (fadeTarget - pu.uFade.value) * (RM ? 1 : 1 - Math.exp(-dt * 5));
    const gA = r === 'gate' ? sstep(2.45, 3.05, p) : 1;
    gridMat.uniforms.uA.value += (gA - gridMat.uniforms.uA.value) * (RM ? 1 : 1 - Math.exp(-dt * 6));
    const hqOp = r === 'gate' ? sstep(5.55, 5.95, p) : 1;
    hq.material.opacity = hqOp; hqRing.material.opacity = hqOp * (RM ? .6 : (.5 + .5 * Math.sin(t * 2.4)));
    const rs = RM ? 1 : 1 + ((t * .6) % 1) * .7; hqRing.scale.set(rs, rs, 1);
    const rise = 1;
    const attach = 1;
    const g4 = r === 'gate' ? sstep(5.52, 5.98, p) : 1;
    tapes.forEach(m => { m.material.opacity = 0; m.visible = m.material.opacity > .01; });
    S.ground.forEach(g => {
      const tgt = r === 'gate' ? .3 * sstep(5.55, 6, p) : r === 'work' ? (S.filter === 'all' || S.filter === g.k ? .42 : .1) * (S.sel ? .5 : 1) : 0;
      g.m.material.opacity += (tgt - g.m.material.opacity) * (RM ? 1 : 1 - Math.exp(-dt * 6));
      g.m.visible = g.m.material.opacity > .01;
    });
    const hv = S.hover;
    B.forEach(b => {
      const c = b.c;
      let target;
      if (r === 'gate') target = (c.f ? c.h : c.low) * g4;
      else if (r === 'studio') target = 0;
      else if (PAGES[r]) target = r === 'journal' ? c.low * 1.6 : c.h * (c.f ? 1 : .75);
      else {
        const since = t - S.enterT - (RM ? 0 : (c.f ? 0 : .35) + ORDER.indexOf(c.id) * .035);
        const match = S.filter === 'all' || S.filter === c.d;
        target = since < 0 ? b.cur : (match ? c.h : .7);
      }
      const kh = RM ? 1 : 1 - Math.exp(-dt * (r === 'gate' ? 14 : r === 'studio' ? 6 : 4.2));
      b.cur += (target - b.cur) * kh;
      const hot = r === 'work' && (hv === c.i || S.sel === c.id);
      b.lift += ((hot ? .6 : 0) - b.lift) * (RM ? 1 : 1 - Math.exp(-dt * 10));
      b.hov += ((hot ? 1 : 0) - b.hov) * (RM ? 1 : 1 - Math.exp(-dt * 10));
      const dimT = r === 'work' ? ((S.filter === 'all' || S.filter === c.d) && (!S.svc || c.sv.includes(S.svc)) ? 0 : 1) : r === 'studio' ? 0 : (c.f ? 0 : .6);
      b.dim += (dimT - b.dim) * (RM ? 1 : 1 - Math.exp(-dt * 6));
      b.m.visible = b.cur > .02;
      b.m.scale.y = Math.max(.001, b.cur);
      b.m.position.y = b.lift;
      b.m.material.uniforms.uHover.value = b.hov;
      b.m.material.uniforms.uDim.value = b.dim;
      b.edges.material.opacity = (.35 + .65 * b.hov) * (1 - b.dim * .7);
      b.edges.material.color.copy(b.hov > .5 ? COL.paper : COL.blue);
      // poster: attached to the building's face, or flying in the collage
      const ar = b.poster.userData.ar;
      let pw = c.fp, ph = pw / ar;
      const maxH = Math.max(.5, c.h * .6);
      if (ph > maxH) { ph = maxH; pw = ph * ar; }
      const ax = c.x, ay = b.cur + b.lift - .1 - ph / 2, az = c.z + c.fp / 2 + .02;
      let x = ax, y = ay, z = az, sx = pw, sy = ph, rz = 0, op;
      const col = COLLAGE[c.id];
      if (col && r === 'gate' && attach < 1) {
        const cw = col.w, chh = col.w / ar;
        const s = .6 + .4 * rise;
        const cx = col.p[0], cy = col.p[1] - (1 - rise) * 6, cz = col.p[2];
        const f = ease(attach);
        x = lerp(cx, ax, f); y = lerp(cy, ay, f); z = lerp(cz, az, f);
        sx = lerp(cw * s, pw, f); sy = lerp(chh * s, ph, f); rz = lerp(col.r, 0, f);
        op = rise;
      } else {
        op = r === 'gate' ? (c.f ? 1 : 0) : 1;
        op *= sstep(ph * .9, ph + .9, b.cur);
      }
      b.poster.position.set(x, y, z);
      b.poster.scale.set(sx, sy, 1);
      b.poster.rotation.z = rz;
      const pu2 = b.poster.material.uniforms;
      pu2.uSize.value.set(sx, sy);
      pu2.uOpacity.value = op;
      pu2.uDim.value = b.dim * .75;
      pu2.uHover.value = b.hov;
      const attachF = (col && r === 'gate') ? ease(attach) : 1;
      pu2.uTornAmt.value = 1 - attachF;
      pu2.uDots.value = r === 'gate' ? attachF : lerp(1, .18, b.hov);
      pu2.uDotN.value = Math.max(18, Math.round(sx * 15));
      b.poster.visible = op > .01;
    });
    // hover picking
    if (r === 'work' && hoverReq && !S.drag) {
      const i = pick(hoverReq[0], hoverReq[1]);
      hoverReq = null;
      if (i !== S.hover) {
        S.hover = i; canvas.style.cursor = i != null ? 'pointer' : '';
        if (i != null) { const c = CASES[i]; hovercap.firstChild.textContent = c.t; hovercap.lastChild.textContent = `${c.b.split(' · ')[0]} · ${DISTRICTS[c.d].name}`; }
        hovercap.classList.toggle('on', i != null && !S.sel && !S.list);
      }
    }
    if (r === 'gate') { S.hover = null; }
  }

  /* the Capitol */
  if (r === 'studio') {
    const el = t - S.capT;
    const mp = RM ? 1 : ease(clamp(el / 1.7, 0, 1));
    mural.position.y = lerp(-mural.userData.y - 2, mural.userData.y, mp);
    mural.material.uniforms.uDim.value = Math.max(.62 * sstep(3.3, 4, S.qE), .38 * beatOp(S.qE, 1), .66 * beatOp(S.qE, 2), .15 * beatOp(S.qE, 3));
    if (!S.vox.done) S.vox.done = updateVox(el);
    mural.visible = false;
    beam.material.opacity = .75 * sstep(2.3, 2.9, S.qE);
    beam.visible = beam.material.opacity > .01;
  }

  /* cowbell */
  if (r === 'cowbell') {
    const tt = clamp(S.qE / 4, 0, 1), su = S.sky.uniforms;
    skyAt(tt, su.uTop.value, su.uHor.value);
    const sunT = clamp((tt - .12) / .78, 0, 1);
    su.uSun.value.set(lerp(.6, .22, sunT), .14 + .5 * Math.sin(Math.PI * sunT));
    su.uSunA.value = sstep(.1, .2, tt) * (1 - sstep(.86, .95, tt));
    su.uMoonA.value = Math.max(1 - sstep(.08, .2, tt), .8 * sstep(.9, 1, tt));
    su.uStars.value = Math.max(1 - sstep(.06, .2, tt), .6 * sstep(.9, 1, tt));
    S.floorMat.color.copy(su.uHor.value).multiplyScalar(.16).lerp(COL.lens, S.lensS);
    S.cbBg.copy(su.uHor.value);
    const light = .55 + .45 * sstep(.14, .34, tt) * (1 - sstep(.78, .95, tt) * .5);
    const th = S.cbThank != null ? Math.max(0, 1 - (t - S.cbThank) / 2.8) : 0;
    S.arches.forEach(m => {
      const a = m.userData, rv = RM ? 1 : sstep(a.tt - .05, a.tt + .04, tt + .02);
      const u = m.material.uniforms;
      u.uOpacity.value = rv; m.visible = rv > .01;
      m.scale.set(a.w, a.h * (.7 + .3 * rv), 1);
      m.position.y = a.h * (.7 + .3 * rv) / 2 - (1 - rv) * 1.2;
      u.uBright.value = light;
      u.uGlow.value = .35 + .35 * (1 - light) + th * 1.2 + (a.img === 'cb-iftar.webp' ? .5 * sstep(.85, 1, tt) : 0);
      u.uBg.value.copy(S.floorMat.color);
    });
    S.tileMat.uniforms.uLit.value = tt * 30;
    S.tileMat.uniforms.uOp.value = RM ? 1 : sstep(2.3, 2.9, S.qE);
    S.tileMat.uniforms.uFlash.value = th;
  }

  /* zenith */
  if (r === 'zenith') {
    const q = S.qE;
    S.zbU.uCam.value.copy(camera.position);
    S.zbU.uExit.value = sstep(3.3, 4.5, q);
    S.zbApply(q < .5 ? 0 : q < 1.5 ? 1 : q < 2.6 ? 2 : 3, t);
    if (S.zbBusy || S.zbDirty || S.zbState !== S.zbDrawn) { S.zbBusy = S.zbDraw(t); S.zbDirty = false; S.zbDrawn = S.zbState; }
    S.zbBg.set('#060608').lerp(COL.lens, S.lensS);
    S.zbScreens.forEach(g => {
      const m = g.userData.m, a = RM ? 1 : sstep(-m.z / 16 - 1.1, -m.z / 16 - .7, q);
      g.userData.pic.material.uniforms.uOpacity.value = a; g.userData.pic.material.uniforms.uBright.value = .55 + .45 * a;
    });
  }

  /* prudential zenith */
  if (r === 'pzl') {
    const tt = clamp(S.qE / 5, 0, 1), u = S.pzU;
    let i = 0; while (i < PZSKY.length - 2 && tt > PZSKY[i + 1][0]) i++;
    const a = PZSKY[i], b = PZSKY[i + 1], f = clamp((tt - a[0]) / (b[0] - a[0]), 0, 1);
    u.uTop.value.copy(a[1]).lerp(b[1], f); u.uHor.value.copy(a[2]).lerp(b[2], f);
    u.uDawn.value = sstep(.7, 1, tt); u.uNight.value = sstep(.1, .4, tt) * (1 - sstep(.8, 1, tt) * .7);
    u.uCam.value.copy(camera.position);
    S.pzSky.position.z = camera.position.z - 420; S.pzCity.position.z = camera.position.z - 380;
    S.pzBg.copy(u.uTop.value).lerp(COL.lens, S.lensS);
    S.pzFrameMat.color.set('#C8202A').lerp(COL.blue, S.lensS);
    S.pzLampMat.uniforms.uOn.value = .35 + .65 * (1 - sstep(.88, 1, tt));
  }

  /* spruce */
  if (r === 'spruce') {
    const q = S.qE, u = S.spU;
    u.uA.value.copy(S.spCols[S.spA]); u.uB.value.copy(S.spCols[S.spB]); u.uP.value = S.spP;
    S.spBg.copy(S.spCols[S.spP > .5 ? S.spB : S.spA]).multiplyScalar(.25).lerp(COL.lens, S.lensS);
    const [ga, gb] = S.spPics;
    S.spSetPic(ga, S.spA); S.spSetPic(gb, S.spB);
    const show = 1 - sstep(2.5, 2.72, q) * (1 - sstep(3.45, 3.75, q));
    S.spPicOp(ga, show * (1 - sstep(.5, .72, S.spP))); S.spPicOp(gb, show * sstep(.3, .6, S.spP));
    const bob = RM ? 0 : Math.sin(t * .6) * .04;
    [ga, gb].forEach(g => { g.position.y = 6.8 + (g.userData.h > 8 ? .4 : 0) + bob; });
    u.uFrame.value.set(4, 6.8, 0);
    S.spMB.forEach(g => {
      const m = g.userData, a = RM ? 1 : sstep(2.52 + m.d, 2.82 + m.d, q) * (1 - sstep(3.4, 3.62, q));
      const op = RM ? (q > 2.5 && q < 3.5 ? 1 : 0) : a;
      m.pic.material.uniforms.uOpacity.value = op; m.sh.material.uniforms.uOp.value = op;
      g.visible = op > .005;
      g.position.y = 6.6 - (1 - op) * 1.2 + (RM ? 0 : Math.sin(t * .7 + m.x) * .05);
      g.rotation.z = (1 - op) * .08 * (m.x > 6 ? 1 : -1);
    });
  }

  /* onga */
  if (r === 'onga') {
    bgCol.copy(COL.onga).lerp(COL.lens, S.lensS);
    ongaLayers.forEach((m, k2) => {
      m.material.uniforms.uBg.value.copy(bgCol);
      if (!RM) { m.position.y = m.userData.base.y + Math.sin(t * .5 + k2) * .08; }
    });
    answer.material.uniforms.uBg.value.copy(bgCol);
    if (answer.visible) {
      const a = clamp((t - S.cardT) / .8, 0, 1);
      const s = RM ? 1 : backOut(a);
      answer.scale.set(7.2 * s, 7.2 * 380 / 1024 * s, 1);
      answer.position.y = -1.4 + (RM ? 0 : (1 - ease(a)) * 3);
      answer.rotation.z = .03 + (RM ? 0 : (1 - a) * .2);
    }
  }
}
const fpsW = []; let fpsNext = 0, booted = false;
function bootDone() { if (booted) return; booted = true; const b = $('#boot'); if (b) { $('#bootbar').style.transform = 'scaleX(1)'; setTimeout(() => b.classList.add('done'), 250); setTimeout(() => b.remove(), 1000); }
  // on a fast connection, prepare the worlds quietly once the home page has settled
  setTimeout(() => { const c = navigator.connection; if (S.releaseTex && TIER === 2 && !(c && (c.saveData || /2g|3g/.test(c.effectiveType || '')))) FLAG.forEach((k, i) => setTimeout(() => S.releaseTex(k), i * 1500)); }, 8000);
}
setTimeout(bootDone, 6000);
function frame(now) {
  requestAnimationFrame(frame);
  const raw = (now - last) / 1000;
  const dt = Math.min(.05, raw); last = now;
  if (document.hidden) return;
  if (!booted && t > .25) bootDone();
  // keep the frame rate up: if it sags, draw fewer pixels (never more)
  if (GL && raw < 1) { fpsW.push(raw); if (fpsW.length > 90) fpsW.shift();
    if (now > fpsNext && fpsW.length >= 60) { const avg = fpsW.reduce((a, b) => a + b, 0) / fpsW.length;
      if (avg > 1 / 34 && DPR > 1) { DPR = Math.max(1, +(DPR - .25).toFixed(2)); renderer.setPixelRatio(DPR); renderer.setSize(W, H, false); U.uPR.value = DPR; fpsW.length = 0; }
      fpsNext = now + 2500; } }
  t += dt;
  update(dt);
  if (GL && !isCase(S.route)) {
    renderer.render(scene, camera);
    placeLabels();
  }
}

/* ---------------- resize ---------------- */
function resize() {
  W = window.innerWidth; H = window.innerHeight;
  if (GL) {
    renderer.setSize(W, H, false);
    camera.aspect = W / H; camera.updateProjectionMatrix();
    U.uScale.value = H / (2 * Math.tan(THREE.MathUtils.degToRad(22.5)));
    pMat.uniforms.uAspect.value = W / H;
  }
  setSpacer();
  if (isPage(S.route)) measureStudio();
  readScroll();
}
window.addEventListener('resize', resize);
window.addEventListener('load', () => { if (isPage(S.route)) { measureStudio(); readScroll(); } });
if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { if (isPage(S.route)) { measureStudio(); readScroll(); } });

/* ---------------- boot ---------------- */
applyRoute(parseRoute());
resize();
if (GL) { camera.position.copy(rig.pos); camera.lookAt(rig.look); }
requestAnimationFrame(frame);
})();
