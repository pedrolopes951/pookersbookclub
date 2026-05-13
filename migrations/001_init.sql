-- Pookers Bookclub schema
-- One row per month (current + archived). Children are FK'd to month.

CREATE TABLE IF NOT EXISTS months (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  num           int  NOT NULL,
  name          text NOT NULL,
  topic         text NOT NULL,
  topic_short   text NOT NULL,
  blurb         text NOT NULL DEFAULT '',
  date_iso      timestamptz NOT NULL,
  date_label    text NOT NULL,
  time_label    text NOT NULL,
  location      text NOT NULL DEFAULT '',
  status        text NOT NULL CHECK (status IN ('current', 'archived')),
  winner_label  text,
  created_at    timestamptz NOT NULL DEFAULT now(),
  archived_at   timestamptz
);

CREATE UNIQUE INDEX IF NOT EXISTS one_current_month
  ON months ((status))
  WHERE status = 'current';

CREATE TABLE IF NOT EXISTS books (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  month_id      uuid NOT NULL REFERENCES months(id) ON DELETE CASCADE,
  reader_id     text NOT NULL CHECK (reader_id IN ('p', 'l')),
  picker_id     text NOT NULL CHECK (picker_id IN ('p', 'l')),
  title         text NOT NULL,
  subtitle      text NOT NULL DEFAULT '',
  author        text NOT NULL DEFAULT '',
  year          int,
  pages         int NOT NULL DEFAULT 0,
  current_page  int NOT NULL DEFAULT 0,
  cover_hue     text NOT NULL DEFAULT '#4A3D7A',
  cover_accent  text NOT NULL DEFAULT '#E8DDD0',
  cover_glyph   text NOT NULL DEFAULT '📖',
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS books_month_idx ON books(month_id);

CREATE TABLE IF NOT EXISTS notes (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  month_id    uuid NOT NULL REFERENCES months(id) ON DELETE CASCADE,
  who         int  NOT NULL CHECK (who IN (0, 1)),
  page        int  NOT NULL DEFAULT 0,
  text        text NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS notes_month_idx ON notes(month_id);

CREATE TABLE IF NOT EXISTS topics (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  month_id     uuid NOT NULL REFERENCES months(id) ON DELETE CASCADE,
  label        text NOT NULL,
  emoji        text NOT NULL DEFAULT '✦',
  base_votes   int  NOT NULL DEFAULT 0,
  position     int  NOT NULL DEFAULT 0,
  created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS topics_month_idx ON topics(month_id);

CREATE TABLE IF NOT EXISTS votes (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id    uuid NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  voter       text NOT NULL CHECK (voter IN ('p', 'l')),
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE(topic_id, voter)
);

CREATE INDEX IF NOT EXISTS votes_topic_idx ON votes(topic_id);

CREATE TABLE IF NOT EXISTS prompts (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  month_id    uuid NOT NULL REFERENCES months(id) ON DELETE CASCADE,
  position    int  NOT NULL DEFAULT 0,
  text        text NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS prompts_month_idx ON prompts(month_id);

-- Seed: May 2026 (current month) with the two books from src/data/books.ts.
-- Skipped automatically if a current month already exists.

DO $$
DECLARE
  m uuid;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM months WHERE status = 'current') THEN
    INSERT INTO months (num, name, topic, topic_short, blurb, date_iso, date_label, time_label, location, status)
    VALUES (1, 'May 2026', 'Biology', 'Biology',
            'Two books on what makes living things tick. Genes & minds, the rules and the rebels.',
            '2026-05-31 19:00:00+00', 'Sun, May 31', '7:00 PM',
            'Living room couch · two mugs of tea', 'current')
    RETURNING id INTO m;

    INSERT INTO books (month_id, reader_id, picker_id, title, subtitle, author, year, pages, cover_hue, cover_accent, cover_glyph)
    VALUES
      (m, 'l', 'p', 'The Conscious Mind', 'In Search of a Fundamental Theory', 'David J. Chalmers', 1996, 432, '#4A3D7A', '#E8DDD0', '🧠'),
      (m, 'p', 'l', 'The Selfish Gene',  'Genes are the unit of evolution',     'Richard Dawkins',   1976, 360, '#234A5E', '#D4A574', '🧬');

    INSERT INTO topics (month_id, label, emoji, base_votes, position) VALUES
      (m, 'Architecture',  '🏛', 1, 0),
      (m, 'Short Stories', '✦', 2, 1),
      (m, 'Cold War',      '☭', 0, 2),
      (m, 'Climate',       '🌿', 1, 3),
      (m, 'Poetry',        '✎', 1, 4),
      (m, 'Philosophy',    '🦉', 0, 5);

    INSERT INTO prompts (month_id, position, text) VALUES
      (m, 0, 'If a fungus can "think" without a brain, what does that say about intelligence?'),
      (m, 1, 'Where does heredity end and identity begin?'),
      (m, 2, 'Which chapter made you put the book down and stare at the wall?'),
      (m, 3, 'What''s one thing you want to look up after finishing?'),
      (m, 4, 'If you had to swap your book with mine right now, would you?');
  END IF;
END $$;
