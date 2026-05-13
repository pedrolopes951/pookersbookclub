// shared.jsx — palette tokens, data, and tiny shared components used by all 3 directions.

const PALETTE = {
  taupe: '#A48871',
  taupeDeep: '#8E725F',
  taupeDark: '#6F5A4A',
  cream: '#F2EAE0',
  creamSoft: '#E8DDD0',
  paper: '#FBF6EE',
  espresso: '#2D1F15',
  ink: '#3D2C20',
  midBrown: '#4A3729',
  teal: '#234A5E',
  tealDeep: '#1A3848',
  peach: '#D4A574',
  rose: '#C67F62',
  sage: '#7A8B6F',
  postit: '#F4E4A8',
};

// Inject one set of @font-face / global type defaults for the canvas page.
// Each artboard inherits these but scopes its own visual treatments.
function injectGlobalFonts() {
  if (document.getElementById('pbc-fonts')) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/css2?family=Bagel+Fat+One&family=Nunito:wght@300;400;500;600;700;800;900&family=Lora:ital,wght@0,400;0,500;0,600;1,400&family=Caveat:wght@400;500;600;700&display=swap';
  document.head.appendChild(link);
  const s = document.createElement('style');
  s.id = 'pbc-fonts';
  s.textContent = `
    .pbc-display{font-family:'Bagel Fat One',system-ui,sans-serif;font-weight:400;letter-spacing:-.01em;line-height:.95}
    .pbc-body{font-family:'Nunito',system-ui,sans-serif}
    .pbc-serif{font-family:'Lora',Georgia,serif}
    .pbc-hand{font-family:'Caveat',cursive}
  `;
  document.head.appendChild(s);
}

// Real-content placeholders. Two readers, one book each, Biology month.
const DATA = {
  month: { name: 'May 2026', topic: 'Biology', topicShort: 'Biology', monthNum: 1 },
  discussion: {
    // Future date so the countdown reads positively. Project date is May 12 2026.
    date: new Date('2026-05-31T19:00:00'),
    dateLabel: 'Sun, May 31',
    timeLabel: '7:00 PM',
    location: 'Living room couch · two mugs of tea',
  },
  readers: [
    {
      id: 'a',
      name: 'Andrei',
      handle: 'pook 1',
      color: '#234A5E',
      initial: 'A',
      pickedFor: 'Sofia',
    },
    {
      id: 's',
      name: 'Sofia',
      handle: 'pook 2',
      color: '#C67F62',
      initial: 'S',
      pickedFor: 'Andrei',
    },
  ],
  books: [
    {
      readerId: 's', // who is reading it
      pickerId: 'a', // who picked it
      title: 'Entangled Life',
      subtitle: 'How Fungi Make Our Worlds, Change Our Minds & Shape Our Futures',
      author: 'Merlin Sheldrake',
      year: 2020,
      pages: 358,
      current: 154,
      coverHue: '#5C8264',
      coverAccent: '#E9D5A3',
      coverGlyph: '🍄',
      notes: 3,
    },
    {
      readerId: 'a',
      pickerId: 's',
      title: 'The Gene',
      subtitle: 'An Intimate History',
      author: 'Siddhartha Mukherjee',
      year: 2016,
      pages: 495,
      current: 211,
      coverHue: '#234A5E',
      coverAccent: '#D4A574',
      coverGlyph: '🧬',
      notes: 5,
    },
  ],
  prompts: [
    'If a fungus can "think" without a brain, what does that say about intelligence?',
    'Where does heredity end and identity begin?',
    'Which chapter made you put the book down and stare at the wall?',
    "What's one thing you want to look up after finishing?",
    'If you had to swap your book with mine right now, would you?',
  ],
  nextTopics: [
    { id: 't1', label: 'Architecture', emoji: '🏛', votes: 1 },
    { id: 't2', label: 'Short Stories', emoji: '✦', votes: 2 },
    { id: 't3', label: 'Cold War', emoji: '☭', votes: 0 },
    { id: 't4', label: 'Climate', emoji: '🌿', votes: 1 },
    { id: 't5', label: 'Poetry', emoji: '✎', votes: 1 },
  ],
  // Empty so far; the page shows a sweet "first month" state.
  archive: [],
};

// Days until discussion, computed from the project date the page renders.
function daysUntil(date) {
  const ms = new Date(date).getTime() - Date.now();
  return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
}

// A consistent placeholder book cover. Hue/accent come from the book record.
function BookCover({ book, w = 120, h = 180, tilt = 0, style = {} }) {
  return (
    <div style={{
      width: w, height: h, borderRadius: 4, position: 'relative',
      background: `linear-gradient(135deg, ${book.coverHue} 0%, ${book.coverHue} 60%, rgba(0,0,0,.2) 100%)`,
      boxShadow: '0 12px 24px rgba(45,31,21,.28), inset 4px 0 0 rgba(0,0,0,.18), inset -2px 0 0 rgba(255,255,255,.08)',
      transform: `rotate(${tilt}deg)`,
      overflow: 'hidden',
      flexShrink: 0,
      ...style,
    }}>
      <div style={{
        position: 'absolute', left: 10, right: 10, top: 14,
        height: 2, background: book.coverAccent, opacity: .9,
      }} />
      <div style={{
        position: 'absolute', left: 10, right: 10, top: 20,
        height: 1, background: book.coverAccent, opacity: .5,
      }} />
      <div style={{
        position: 'absolute', left: 10, right: 10, bottom: 14,
        height: 1, background: book.coverAccent, opacity: .6,
      }} />
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', alignItems: 'center',
        justifyContent: 'center', fontSize: Math.min(w, h) * .42, opacity: .85,
        filter: 'saturate(.85)',
      }}>{book.coverGlyph}</div>
      <div style={{
        position: 'absolute', left: 10, right: 18, bottom: 24,
        color: book.coverAccent, fontFamily: 'Lora,serif', fontSize: Math.max(8, w * .08),
        fontWeight: 600, lineHeight: 1.1, textTransform: 'uppercase', letterSpacing: '.05em',
      }}>{book.title}</div>
    </div>
  );
}

function Avatar({ reader, size = 32, ring = false }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: reader.color,
      color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Nunito,sans-serif', fontWeight: 800,
      fontSize: size * .42,
      boxShadow: ring ? `0 0 0 3px ${PALETTE.paper}, 0 0 0 4px ${reader.color}` : 'none',
      flexShrink: 0,
    }}>{reader.initial}</div>
  );
}

// Simple horizontal progress bar w/ optional book-icon thumb.
function Progress({ pct, color = PALETTE.espresso, track = 'rgba(45,31,21,.12)', height = 8, withThumb = false }) {
  return (
    <div style={{ position: 'relative', height, background: track, borderRadius: 999 }}>
      <div style={{
        position: 'absolute', inset: 0, width: `${pct}%`,
        background: color, borderRadius: 999, transition: 'width .4s ease',
      }} />
      {withThumb && (
        <div style={{
          position: 'absolute', top: '50%', left: `calc(${pct}% - 9px)`,
          transform: 'translateY(-50%)',
          width: 18, height: 14, borderRadius: 2, background: color,
          boxShadow: '0 2px 4px rgba(0,0,0,.25)',
        }} />
      )}
    </div>
  );
}

Object.assign(window, { PALETTE, DATA, injectGlobalFonts, daysUntil, BookCover, Avatar, Progress });
