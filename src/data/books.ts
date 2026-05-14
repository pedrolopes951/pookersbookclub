export const PALETTE = {
  taupe: "#A48871",
  taupeDeep: "#8E725F",
  taupeDark: "#6F5A4A",
  cream: "#F2EAE0",
  creamSoft: "#E8DDD0",
  paper: "#FBF6EE",
  espresso: "#2D1F15",
  ink: "#3D2C20",
  midBrown: "#4A3729",
  teal: "#234A5E",
  tealDeep: "#1A3848",
  peach: "#D4A574",
  rose: "#C67F62",
  sage: "#7A8B6F",
  postit: "#F4E4A8",
} as const;

export type Reader = {
  id: string;
  name: string;
  handle: string;
  color: string;
  initial: string;
  pickedFor: string;
};

export type Book = {
  readerId: string;
  pickerId: string;
  title: string;
  subtitle: string;
  author: string;
  year: number;
  pages: number;
  current: number;
  coverHue: string;
  coverAccent: string;
  coverGlyph: string;
  notes: number;
};

export type NoteEntry = {
  who: number; // index into readers[]
  page: number;
  text: string;
};

export type NextTopic = {
  id: string;
  label: string;
  emoji: string;
  votes: number;
};

export const readers: Reader[] = [
  {
    id: "p",
    name: "Pedro",
    handle: "pook 1",
    color: "#234A5E",
    initial: "P",
    pickedFor: "Laura",
  },
  {
    id: "l",
    name: "Laura",
    handle: "pook 2",
    color: "#C67F62",
    initial: "L",
    pickedFor: "Pedro",
  },
];

// books[0] = the book Pedro picked for Laura (so Laura reads it)
// books[1] = the book Laura picked for Pedro (so Pedro reads it)
export const books: Book[] = [
  {
    readerId: "l",
    pickerId: "p",
    title: "The Conscious Mind",
    subtitle: "In Search of a Fundamental Theory",
    author: "David J. Chalmers",
    year: 1996,
    pages: 432,
    current: 0,
    coverHue: "#4A3D7A",
    coverAccent: "#E8DDD0",
    coverGlyph: "🧠",
    notes: 0,
  },
  {
    readerId: "p",
    pickerId: "l",
    title: "The Selfish Gene",
    subtitle: "Genes are the unit of evolution",
    author: "Richard Dawkins",
    year: 1976,
    pages: 360,
    current: 0,
    coverHue: "#234A5E",
    coverAccent: "#D4A574",
    coverGlyph: "🧬",
    notes: 0,
  },
];

export const month = {
  name: "May 2026",
  topic: "Biology",
  topicShort: "Biology",
  monthNum: 1,
  blurb:
    "Two books on what makes living things tick. Genes & minds, the rules and the rebels.",
};

export const discussion = {
  date: new Date("2026-05-31T19:00:00"),
  dateLabel: "Sun, May 31",
  timeLabel: "7:00 PM",
  location: "Living room couch · two mugs of tea",
};

export const prompts: string[] = [
  'If a fungus can "think" without a brain, what does that say about intelligence?',
  "Where does heredity end and identity begin?",
  "Which chapter made you put the book down and stare at the wall?",
  "What's one thing you want to look up after finishing?",
  "If you had to swap your book with mine right now, would you?",
];

export const notes: NoteEntry[] = [];

export const nextTopics: NextTopic[] = [
  { id: "t1", label: "Architecture", emoji: "🏛", votes: 1 },
  { id: "t2", label: "Short Stories", emoji: "✦", votes: 2 },
  { id: "t3", label: "Cold War", emoji: "☭", votes: 0 },
  { id: "t4", label: "Climate", emoji: "🌿", votes: 1 },
  { id: "t5", label: "Poetry", emoji: "✎", votes: 1 },
  { id: "t6", label: "Philosophy", emoji: "🦉", votes: 0 },
];

