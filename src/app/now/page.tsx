"use client";
import { books, readers, type Book } from "@/data/books";
import {
  MonthStrip,
  BookPanel,
  NotesPanel,
  VotePanel,
  ShelfRow,
} from "@/lib/views";
import {
  daysUntil,
  useDiscState,
  useLauraVotes,
  useMonthState,
  useNotes,
  usePedroVotes,
  useReadBookA,
  useReadBookB,
  useTopics,
  useVotingAs,
} from "@/lib/state";

export default function NowPage() {
  const [pedroVotes, setPedroVotes] = usePedroVotes();
  const [lauraVotes, setLauraVotes] = useLauraVotes();
  const [votingAs, setVotingAs] = useVotingAs();
  const [readBookA, setReadBookA] = useReadBookA();
  const [readBookB, setReadBookB] = useReadBookB();
  const [notesList, setNotesList] = useNotes();
  const [topics, setTopics] = useTopics();
  const [monthState, setMonthState] = useMonthState();
  const [discState, setDiscState] = useDiscState();

  const [Pedro, Laura] = readers;
  const [bookForLaura, bookForPedro] = books;
  const noteCounts = notesList.reduce<{ a: number; b: number }>(
    (acc, n) => {
      if (n.who === 0) acc.b += 1;
      else acc.a += 1;
      return acc;
    },
    { a: 0, b: 0 }
  );
  const bookA: Book = { ...bookForLaura, current: readBookA, notes: noteCounts.a };
  const bookB: Book = { ...bookForPedro, current: readBookB, notes: noteCounts.b };
  const days = daysUntil(new Date(discState.dateISO));

  const onVote = (topicId: string) => {
    const toggle = (votes: string[]) =>
      votes.includes(topicId) ? votes.filter((v) => v !== topicId) : [...votes, topicId];
    if (votingAs === "p") setPedroVotes(toggle);
    else setLauraVotes(toggle);
  };

  return (
    <>
      <MonthStrip
        days={days}
        monthState={monthState}
        setMonthState={setMonthState}
        discState={discState}
        setDiscState={setDiscState}
      />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22, marginBottom: 28 }}>
        <BookPanel reader={Laura} picker={Pedro} book={bookA} onUpdate={setReadBookA} accent={Pedro.color} />
        <BookPanel reader={Pedro} picker={Laura} book={bookB} onUpdate={setReadBookB} accent={Laura.color} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 22, marginBottom: 28 }}>
        <NotesPanel notes={notesList} setNotes={setNotesList} />
        <VotePanel
          topics={topics}
          setTopics={setTopics}
          pedroVotes={pedroVotes}
          lauraVotes={lauraVotes}
          votingAs={votingAs}
          setVotingAs={setVotingAs}
          onVote={onVote}
          dateLabel={discState.dateLabel}
        />
      </div>
      <ShelfRow />
    </>
  );
}
