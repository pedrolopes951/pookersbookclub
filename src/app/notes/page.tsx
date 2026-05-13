"use client";
import { FocusWrap, NotesPanel } from "@/lib/views";
import { useNotes } from "@/lib/state";

export default function NotesPage() {
  const [notes, setNotes] = useNotes();
  return (
    <FocusWrap title="Discussion Notebook" eyebrow="every page worth talking about">
      <NotesPanel notes={notes} setNotes={setNotes} />
    </FocusWrap>
  );
}
