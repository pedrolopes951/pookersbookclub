// direction-spread.jsx — Direction 3: Open Book Spread
// Page mimics an open book / journal. Two facing "pages" (one per reader),
// bookmark ribbons, marginalia, gutter shadow. Below the spread sits the
// "back matter": discussion night, prompts, vote, shelf.

function OpenBookSpread() {
  const [voted, setVoted] = React.useState('t2');
  const [readBookA, setReadBookA] = React.useState(DATA.books[0].current);
  const [readBookB, setReadBookB] = React.useState(DATA.books[1].current);
  const [Andrei, Sofia] = DATA.readers;
  const [bookForSofia, bookForAndrei] = DATA.books;
  const bookA = { ...bookForSofia, current: readBookA };
  const bookB = { ...bookForAndrei, current: readBookB };
  const days = daysUntil(DATA.discussion.date);

  return (
    <div className="pbc-body" style={{
      width: '100%', minHeight: '100%',
      background: `radial-gradient(circle at 50% 0%, ${PALETTE.taupeDeep} 0%, ${PALETTE.taupe} 60%)`,
      color: PALETTE.espresso,
      fontFamily: 'Nunito,system-ui,sans-serif',
      padding: '32px 40px 56px',
      boxSizing: 'border-box',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* ─── HEADER ─── */}
      <header style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: 28,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 14, overflow: 'hidden',
            boxShadow: '0 6px 14px rgba(0,0,0,.25)',
          }}>
            <img src="assets/logo.png" alt="" style={{
              width: '100%', height: '100%', objectFit: 'cover',
              transform: 'scale(1.6) translateY(8%)',
            }} />
          </div>
          <div>
            <div className="pbc-display" style={{ fontSize: 28, color: PALETTE.espresso, lineHeight: .9 }}>
              Pookers bookclub
            </div>
            <div style={{ fontSize: 13, color: PALETTE.midBrown, marginTop: 2, fontWeight: 600 }}>
              vol. 1 · {DATA.month.name} · the biology issue
            </div>
          </div>
        </div>
        <nav style={{ display: 'flex', gap: 4, background: 'rgba(45,31,21,.12)', padding: 4, borderRadius: 12 }}>
          {['Spread', 'Notes', 'Discussion', 'Shelf'].map((l, i) => (
            <button key={l} style={{
              background: i === 0 ? PALETTE.espresso : 'transparent',
              color: i === 0 ? PALETTE.cream : PALETTE.espresso,
              border: 'none', borderRadius: 8, padding: '8px 16px',
              fontFamily: 'Nunito', fontWeight: 700, fontSize: 13, cursor: 'pointer',
            }}>{l}</button>
          ))}
        </nav>
      </header>

      {/* ─── TOPIC TITLE strip across both pages ─── */}
      <div style={{
        textAlign: 'center', marginBottom: 16,
      }}>
        <div className="pbc-hand" style={{ fontSize: 22, color: PALETTE.cream, opacity: .85 }}>
          this month's topic
        </div>
        <div className="pbc-display" style={{
          fontSize: 72, color: PALETTE.cream, lineHeight: .95,
          textShadow: '0 2px 0 rgba(0,0,0,.18)',
        }}>
          {DATA.month.topic}
        </div>
      </div>

      {/* ─── THE SPREAD ─── */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr', position: 'relative',
        borderRadius: 12,
        boxShadow: '0 30px 60px rgba(45,31,21,.4), 0 0 0 1px rgba(45,31,21,.1)',
        overflow: 'hidden',
        background: PALETTE.paper,
      }}>
        <BookPage side="left"  reader={Sofia} picker={Andrei} book={bookA} onUpdate={setReadBookA} pageNum={154} />
        <BookPage side="right" reader={Andrei} picker={Sofia} book={bookB} onUpdate={setReadBookB} pageNum={211} />

        {/* gutter shadow */}
        <div style={{
          position: 'absolute', top: 0, bottom: 0, left: '50%', width: 60,
          transform: 'translateX(-50%)', pointerEvents: 'none',
          background: 'linear-gradient(to right, transparent, rgba(45,31,21,.22) 40%, rgba(45,31,21,.22) 60%, transparent)',
        }} />
        {/* center stitches */}
        <div style={{
          position: 'absolute', top: 24, bottom: 24, left: '50%',
          transform: 'translateX(-50%)', width: 1,
          backgroundImage: `repeating-linear-gradient(to bottom, ${PALETTE.taupeDark} 0 6px, transparent 6px 12px)`,
          opacity: .35, pointerEvents: 'none',
        }} />
      </div>

      {/* ─── BACK MATTER ─── */}
      <div style={{
        marginTop: 32, display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: 22,
      }}>
        <DiscussionTile days={days} />
        <PromptsTile />
        <VoteTile voted={voted} setVoted={setVoted} />
      </div>

      <ShelfStrip />

      <footer style={{
        marginTop: 28, textAlign: 'center', color: PALETTE.cream, opacity: .75,
        fontSize: 12, letterSpacing: '.1em', textTransform: 'uppercase', fontWeight: 700,
      }}>
        — printed (in spirit) at the kitchen table —
      </footer>
    </div>
  );
}

// ─── pieces ───

function BookPage({ side, reader, picker, book, onUpdate, pageNum }) {
  const pct = Math.round((book.current / book.pages) * 100);
  const isLeft = side === 'left';
  return (
    <div style={{
      padding: isLeft ? '40px 36px 40px 48px' : '40px 48px 40px 36px',
      background: PALETTE.paper,
      position: 'relative', minHeight: 720,
    }}>
      {/* page corner fold */}
      <div style={{
        position: 'absolute', [isLeft ? 'left' : 'right']: 0, top: 0,
        width: 36, height: 36,
        background: `linear-gradient(${isLeft ? 135 : 225}deg, rgba(45,31,21,.08) 0%, transparent 60%)`,
      }} />

      {/* who-for label + bookmark */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        marginBottom: 12,
      }}>
        <div>
          <div style={{
            fontSize: 10, letterSpacing: '.15em', textTransform: 'uppercase',
            color: PALETTE.taupeDark, fontWeight: 800,
          }}>
            {isLeft ? 'left page' : 'right page'} · for {reader.name.toLowerCase()}
          </div>
          <div className="pbc-serif" style={{ fontSize: 13, color: PALETTE.midBrown, fontStyle: 'italic', marginTop: 2 }}>
            picked by {picker.name}
          </div>
        </div>
        {/* bookmark ribbon */}
        <div style={{ position: 'relative', width: 32, height: 80, marginTop: -40 }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0,
            height: 64 + (pct/100)*16, background: picker.color,
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 88%, 0 100%)',
            boxShadow: '0 4px 8px rgba(0,0,0,.15)',
          }} />
          <div className="pbc-display" style={{
            position: 'absolute', top: 8, left: 0, right: 0,
            textAlign: 'center', color: '#fff', fontSize: 16,
            writingMode: 'vertical-rl', transform: 'rotate(180deg)',
            transformOrigin: 'center',
          }}>{pct}%</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 18, alignItems: 'flex-start', marginBottom: 24 }}>
        <BookCover book={book} w={130} h={196} tilt={isLeft ? -1.5 : 1.5} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <h2 className="pbc-display" style={{
            fontSize: 38, color: PALETTE.espresso, margin: 0, lineHeight: .95,
          }}>{book.title}</h2>
          <div className="pbc-serif" style={{ fontSize: 14, color: PALETTE.midBrown, fontStyle: 'italic', margin: '6px 0 10px' }}>
            {book.subtitle}
          </div>
          <div style={{ fontSize: 14, color: PALETTE.taupeDark, fontWeight: 700 }}>
            {book.author} · {book.year}
          </div>
          <div style={{ fontSize: 12, color: PALETTE.taupeDark, marginTop: 8, lineHeight: 1.5 }}>
            {book.pages} pages · about {Math.ceil(book.pages/30)} sittings if we read 30 a night
          </div>
        </div>
      </div>

      {/* reading status */}
      <div style={{
        background: 'rgba(45,31,21,.04)', borderRadius: 12, padding: 14,
        marginBottom: 18,
      }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
          marginBottom: 8,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Avatar reader={reader} size={28} />
            <div>
              <div style={{ fontSize: 12, fontWeight: 800, color: PALETTE.espresso }}>{reader.name}'s progress</div>
              <div style={{ fontSize: 11, color: PALETTE.midBrown }}>page {book.current} of {book.pages}</div>
            </div>
          </div>
          <span className="pbc-display" style={{ fontSize: 26, color: picker.color }}>
            {pct}<span style={{ fontSize: 14 }}>%</span>
          </span>
        </div>
        <Progress pct={pct} color={picker.color} />
        <input type="range" min={0} max={book.pages} value={book.current}
          onChange={(e) => onUpdate(Number(e.target.value))}
          style={{ width: '100%', marginTop: 8, accentColor: picker.color, cursor: 'pointer' }} />
      </div>

      {/* marginalia */}
      <div>
        <div style={{
          fontSize: 10, letterSpacing: '.15em', textTransform: 'uppercase',
          color: PALETTE.taupeDark, fontWeight: 800, marginBottom: 10,
        }}>marginalia</div>
        <Marginalia reader={reader} isLeft={isLeft} />
      </div>

      {/* page number */}
      <div style={{
        position: 'absolute', bottom: 16,
        [isLeft ? 'left' : 'right']: 48,
        fontFamily: 'Lora,serif', fontStyle: 'italic',
        fontSize: 13, color: PALETTE.taupeDark,
      }}>· {pageNum} ·</div>
    </div>
  );
}

function Marginalia({ reader, isLeft }) {
  const noteSets = {
    s: [
      { page: 47,  text: '"Fungi flicker between forms" — feels like the book mid-sentence.', stars: 5 },
      { page: 112, text: 'Read this paragraph aloud to A. He laughed. Cite for dinner.', stars: 4 },
      { page: 154, text: 'Stopped to look up: mycelium / mycorrhiza / lichen. Diagram needed.', stars: null },
    ],
    a: [
      { page: 38,  text: 'Mendel\'s peas chapter — what would our "phenotype" be on a chart?', stars: 5 },
      { page: 167, text: 'The chapter on identity vs. inheritance hit harder than expected.', stars: 5 },
      { page: 211, text: 'Wait — re-read pp. 198-210, the family-history section.', stars: null },
    ],
  };
  const notes = noteSets[reader.id];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {notes.map((n, i) => (
        <div key={i} style={{
          background: i % 2 === 0 ? PALETTE.postit : '#F4D6BC',
          padding: '10px 14px', borderRadius: 4,
          transform: `rotate(${(isLeft ? -1 : 1) * (i % 2 === 0 ? .8 : -.6)}deg)`,
          boxShadow: '0 4px 10px rgba(45,31,21,.12)',
          fontFamily: 'Caveat,cursive', fontSize: 18, color: PALETTE.espresso,
          lineHeight: 1.25,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 2 }}>
            <span style={{ fontFamily: 'Nunito', fontSize: 10, fontWeight: 800, letterSpacing: '.1em', color: PALETTE.taupeDark, textTransform: 'uppercase' }}>
              p. {n.page}
            </span>
            {n.stars && (
              <span style={{ color: PALETTE.rose, fontSize: 13 }}>{'★'.repeat(n.stars)}{'☆'.repeat(5-n.stars)}</span>
            )}
          </div>
          {n.text}
        </div>
      ))}
      <button style={{
        background: 'transparent', border: `2px dashed ${PALETTE.taupeDark}`,
        borderRadius: 8, padding: '8px 12px', color: PALETTE.taupeDark,
        fontFamily: 'Nunito', fontWeight: 800, fontSize: 12, cursor: 'pointer',
        letterSpacing: '.05em',
      }}>+ tuck a note here</button>
    </div>
  );
}

function DiscussionTile({ days }) {
  return (
    <div style={{
      background: PALETTE.espresso, color: PALETTE.cream, borderRadius: 18,
      padding: 24, position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        fontSize: 10, letterSpacing: '.18em', textTransform: 'uppercase',
        color: PALETTE.peach, fontWeight: 800,
      }}>discussion night</div>
      <div className="pbc-display" style={{ fontSize: 44, lineHeight: .95, marginTop: 4 }}>
        {DATA.discussion.dateLabel}
      </div>
      <div style={{ fontSize: 14, color: PALETTE.peach, fontWeight: 700, marginTop: 4 }}>
        {DATA.discussion.timeLabel}
      </div>
      <div style={{ fontSize: 12, color: 'rgba(242,234,224,.7)', marginTop: 6, lineHeight: 1.5 }}>
        {DATA.discussion.location}
      </div>
      <div style={{
        marginTop: 16, display: 'flex', alignItems: 'center', gap: 14,
      }}>
        <div className="pbc-display" style={{ fontSize: 56, color: PALETTE.peach, lineHeight: .9 }}>{days}</div>
        <div style={{ fontSize: 13, lineHeight: 1.3 }}>
          <div style={{ fontWeight: 800 }}>days to go</div>
          <div style={{ opacity: .7 }}>finish your book by then</div>
        </div>
      </div>
    </div>
  );
}

function PromptsTile() {
  return (
    <div style={{
      background: PALETTE.cream, borderRadius: 18, padding: 24,
    }}>
      <div style={{ fontSize: 10, letterSpacing: '.18em', textTransform: 'uppercase', color: PALETTE.taupeDark, fontWeight: 800 }}>
        bring up at dinner
      </div>
      <div className="pbc-display" style={{ fontSize: 26, color: PALETTE.espresso, marginTop: -2, marginBottom: 12 }}>
        prompts
      </div>
      <ol style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {DATA.prompts.slice(0, 3).map((p, i) => (
          <li key={i} style={{ display: 'flex', gap: 10, fontSize: 13, color: PALETTE.midBrown, lineHeight: 1.4 }}>
            <span className="pbc-display" style={{ fontSize: 22, color: PALETTE.taupeDeep, lineHeight: 1, flexShrink: 0 }}>{i+1}.</span>
            <span>{p}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function VoteTile({ voted, setVoted }) {
  return (
    <div style={{
      background: PALETTE.creamSoft, borderRadius: 18, padding: 24,
    }}>
      <div style={{ fontSize: 10, letterSpacing: '.18em', textTransform: 'uppercase', color: PALETTE.taupeDark, fontWeight: 800 }}>
        next month
      </div>
      <div className="pbc-display" style={{ fontSize: 26, color: PALETTE.espresso, marginTop: -2, marginBottom: 12 }}>
        vote
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 8 }}>
        {DATA.nextTopics.map((t) => {
          const on = voted === t.id;
          return (
            <button key={t.id} onClick={() => setVoted(t.id)} style={{
              background: on ? PALETTE.espresso : PALETTE.paper,
              color: on ? PALETTE.cream : PALETTE.espresso,
              border: `2px solid ${on ? PALETTE.espresso : 'transparent'}`,
              borderRadius: 12, padding: '10px 8px',
              fontFamily: 'Nunito', fontWeight: 800, fontSize: 12, cursor: 'pointer',
              display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-start',
              transition: 'all .15s',
            }}>
              <span style={{ fontSize: 18 }}>{t.emoji}</span>
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ShelfStrip() {
  // Render a wooden shelf with one book leaning + empty space.
  return (
    <div style={{ marginTop: 28 }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
        marginBottom: 10, color: PALETTE.cream,
      }}>
        <div className="pbc-display" style={{ fontSize: 24 }}>our shelf</div>
        <div style={{ fontSize: 12, opacity: .8, fontWeight: 700, letterSpacing: '.05em' }}>
          1 in progress · ∞ to come
        </div>
      </div>
      <div style={{
        background: PALETTE.taupeDeep,
        borderRadius: 12,
        padding: '18px 22px 0',
        boxShadow: 'inset 0 8px 20px rgba(0,0,0,.2)',
        position: 'relative',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 120 }}>
          {/* current month books */}
          <SpineBook book={DATA.books[0]} h={108} label="May" />
          <SpineBook book={DATA.books[1]} h={116} label="May" />
          {/* empty slots */}
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} style={{
              width: 22, height: 90 + (i%3)*6,
              border: `2px dashed rgba(242,234,224,.2)`,
              borderRadius: 3,
              display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: 4,
              fontSize: 9, color: 'rgba(242,234,224,.4)', fontWeight: 800, letterSpacing: '.05em',
            }}>·</div>
          ))}
          <div style={{ flex: 1 }} />
          <div style={{ fontSize: 11, color: 'rgba(242,234,224,.55)', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', paddingBottom: 12 }}>
            ← oldest · newest →
          </div>
        </div>
        {/* shelf board */}
        <div style={{
          height: 10, background: PALETTE.midBrown,
          borderRadius: '0 0 12px 12px', margin: '0 -22px',
          boxShadow: '0 4px 10px rgba(0,0,0,.3)',
        }} />
      </div>
    </div>
  );
}

function SpineBook({ book, h = 110, label }) {
  return (
    <div style={{
      width: 28, height: h,
      background: `linear-gradient(to right, ${book.coverHue} 0%, ${book.coverHue} 75%, rgba(0,0,0,.25) 100%)`,
      borderRadius: '3px 3px 0 0',
      boxShadow: '2px 0 4px rgba(0,0,0,.2)',
      position: 'relative',
      display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: 8,
    }}>
      <div style={{
        writingMode: 'vertical-rl', transform: 'rotate(180deg)',
        fontFamily: 'Lora,serif', fontSize: 9, color: book.coverAccent,
        fontWeight: 600, letterSpacing: '.05em',
        textTransform: 'uppercase', whiteSpace: 'nowrap',
      }}>{book.title}</div>
      <div style={{
        position: 'absolute', top: 10, left: 0, right: 0, height: 1,
        background: book.coverAccent, opacity: .6,
      }} />
      <div style={{
        position: 'absolute', bottom: 4, left: 0, right: 0, textAlign: 'center',
        fontFamily: 'Nunito', fontSize: 7, color: book.coverAccent, fontWeight: 800,
        letterSpacing: '.05em',
      }}>{label}</div>
    </div>
  );
}

window.OpenBookSpread = OpenBookSpread;
