ALTER TABLE notes
  ADD COLUMN IF NOT EXISTS book_id uuid REFERENCES books(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS notes_book_idx ON notes(book_id);
