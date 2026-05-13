// direction-dashboard.jsx — Direction 2: Library Dashboard
// App-like feel: left sidebar nav, header strip w/ countdown, grid layout,
// progress rings, note counters. Still warm browns but tighter & more structured.

function LibraryDashboard() {
  const [tab, setTab] = React.useState('now');
  const [voted, setVoted] = React.useState('t2');
  const [readBookA, setReadBookA] = React.useState(DATA.books[0].current);
  const [readBookB, setReadBookB] = React.useState(DATA.books[1].current);
  const [Andrei, Sofia] = DATA.readers;
  const [bookForSofia, bookForAndrei] = DATA.books;
  const bookA = { ...bookForSofia, current: readBookA };
  const bookB = { ...bookForAndrei, current: readBookB };
  const days = daysUntil(DATA.discussion.date);

  const navItems = [
    { id: 'now',   label: 'Now Reading',   icon: '📖' },
    { id: 'notes', label: 'Notes',         icon: '✎' },
    { id: 'disc',  label: 'Discussion',    icon: '☕' },
    { id: 'vote',  label: 'Vote Next',     icon: '🗳' },
    { id: 'shelf', label: 'Shelf',         icon: '📚' },
    { id: 'us',    label: 'Two Readers',   icon: '♡' },
  ];

  return (
    <div className="pbc-body" style={{
      width: '100%', minHeight: '100%',
      background: PALETTE.taupe,
      color: PALETTE.espresso,
      fontFamily: 'Nunito,system-ui,sans-serif',
      display: 'grid',
      gridTemplateColumns: '260px 1fr',
      boxSizing: 'border-box',
      position: 'relative',
    }}>
      {/* ─── SIDEBAR ─── */}
      <aside style={{
        background: PALETTE.espresso, color: PALETTE.cream,
        padding: '28px 22px 32px',
        display: 'flex', flexDirection: 'column', gap: 8,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14,
            background: PALETTE.taupe, overflow: 'hidden', flexShrink: 0,
            boxShadow: '0 6px 14px rgba(0,0,0,.3)',
          }}>
            <img src="assets/logo.png" alt="" style={{
              width: '100%', height: '100%', objectFit: 'cover',
              transform: 'scale(1.6) translateY(8%)',
            }} />
          </div>
          <div>
            <div className="pbc-display" style={{ fontSize: 22, color: PALETTE.cream, lineHeight: .9 }}>Pookers</div>
            <div className="pbc-display" style={{ fontSize: 22, color: PALETTE.peach, lineHeight: .9 }}>bookclub</div>
          </div>
        </div>

        <div style={{
          fontSize: 10, letterSpacing: '.18em', textTransform: 'uppercase',
          color: 'rgba(242,234,224,.5)', margin: '8px 12px 6px',
        }}>Library</div>
        {navItems.map((n) => {
          const on = n.id === tab;
          return (
            <button key={n.id} onClick={() => setTab(n.id)} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              background: on ? PALETTE.taupe : 'transparent',
              color: on ? PALETTE.espresso : PALETTE.cream,
              border: 'none', borderRadius: 12, padding: '10px 14px',
              fontFamily: 'Nunito,sans-serif', fontWeight: 700, fontSize: 14,
              cursor: 'pointer', textAlign: 'left',
              transition: 'all .15s',
            }}>
              <span style={{ fontSize: 16, width: 20, textAlign: 'center' }}>{n.icon}</span>
              {n.label}
            </button>
          );
        })}

        <div style={{ flex: 1 }} />

        {/* mini members card */}
        <div style={{
          background: 'rgba(212,165,116,.12)', borderRadius: 14, padding: 14,
          border: '1px solid rgba(212,165,116,.2)',
        }}>
          <div style={{ display: 'flex', gap: -4, alignItems: 'center', marginBottom: 10 }}>
            <Avatar reader={Andrei} size={28} ring />
            <div style={{ marginLeft: -8 }}><Avatar reader={Sofia} size={28} ring /></div>
            <div style={{ marginLeft: 10, fontSize: 13, fontWeight: 700 }}>
              {Andrei.name} <span style={{ opacity: .5 }}>&</span> {Sofia.name}
            </div>
          </div>
          <div style={{ fontSize: 11, color: 'rgba(242,234,224,.7)', lineHeight: 1.4 }}>
            Membership: 2/2 · trading picks since May 2026
          </div>
        </div>
      </aside>

      {/* ─── MAIN ─── */}
      <main style={{ padding: '32px 40px 48px', overflow: 'hidden' }}>
        {/* Top strip */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
          marginBottom: 28,
        }}>
          <div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: PALETTE.cream, padding: '6px 14px', borderRadius: 999,
              fontSize: 12, fontWeight: 800, color: PALETTE.taupeDark,
              letterSpacing: '.1em', textTransform: 'uppercase',
            }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: PALETTE.sage }} />
              Month 1 · in progress
            </div>
            <h1 className="pbc-display" style={{
              fontSize: 64, color: PALETTE.espresso, margin: '12px 0 4px', lineHeight: .95,
            }}>{DATA.month.topic}.</h1>
            <div style={{ fontSize: 16, color: PALETTE.midBrown, maxWidth: 580 }}>
              Two books on what makes living things tick. Genes & fungi, the rules and the rebels.
            </div>
          </div>

          <CountdownTile days={days} />
        </div>

        {/* Two books grid */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22, marginBottom: 28,
        }}>
          <BookPanel
            reader={Sofia} picker={Andrei} book={bookA}
            onUpdate={setReadBookA}
            accent={Andrei.color}
          />
          <BookPanel
            reader={Andrei} picker={Sofia} book={bookB}
            onUpdate={setReadBookB}
            accent={Sofia.color}
          />
        </div>

        {/* Bottom row */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 22, marginBottom: 28,
        }}>
          <NotesPanel />
          <VotePanel voted={voted} setVoted={setVoted} />
        </div>

        {/* Shelf row */}
        <ShelfRow />
      </main>
    </div>
  );
}

// ─── sub-components ───

function CountdownTile({ days }) {
  return (
    <div style={{
      background: PALETTE.cream, borderRadius: 20, padding: '16px 22px',
      display: 'flex', alignItems: 'center', gap: 18,
      boxShadow: '0 10px 24px rgba(45,31,21,.14)',
    }}>
      <div style={{
        fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase',
        color: PALETTE.taupeDark, fontWeight: 800,
      }}>
        discussion<br />in
      </div>
      <div className="pbc-display" style={{ fontSize: 64, color: PALETTE.teal, lineHeight: .9 }}>
        {days}
      </div>
      <div>
        <div style={{ fontSize: 13, color: PALETTE.espresso, fontWeight: 700 }}>
          days · {DATA.discussion.dateLabel}
        </div>
        <div style={{ fontSize: 12, color: PALETTE.midBrown }}>
          {DATA.discussion.timeLabel}
        </div>
        <button style={{
          marginTop: 6, background: PALETTE.espresso, color: PALETTE.cream,
          border: 'none', borderRadius: 999, padding: '5px 12px',
          fontFamily: 'Nunito', fontWeight: 700, fontSize: 11, cursor: 'pointer',
          letterSpacing: '.05em',
        }}>+ add to calendar</button>
      </div>
    </div>
  );
}

function ProgressRing({ pct, size = 80, color, track = 'rgba(45,31,21,.1)' }) {
  const r = (size - 10) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} stroke={track} strokeWidth="6" fill="none" />
        <circle cx={size/2} cy={size/2} r={r} stroke={color} strokeWidth="6" fill="none"
          strokeDasharray={c} strokeDashoffset={offset}
          strokeLinecap="round" style={{ transition: 'stroke-dashoffset .4s ease' }} />
      </svg>
      <div className="pbc-display" style={{
        position: 'absolute', inset: 0, display: 'flex', alignItems: 'center',
        justifyContent: 'center', fontSize: size * .3, color: PALETTE.espresso,
      }}>{pct}<span style={{ fontSize: size * .15 }}>%</span></div>
    </div>
  );
}

function BookPanel({ reader, picker, book, onUpdate, accent }) {
  const pct = Math.round((book.current / book.pages) * 100);
  return (
    <div style={{
      background: PALETTE.paper, borderRadius: 20, padding: 22,
      boxShadow: '0 12px 28px rgba(45,31,21,.14)',
      display: 'flex', flexDirection: 'column', gap: 16,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: PALETTE.taupeDark }}>
          <Avatar reader={picker} size={24} />
          <span style={{ fontWeight: 700 }}>{picker.name}</span>
          <span style={{ opacity: .6 }}>picked for</span>
          <Avatar reader={reader} size={24} />
          <span style={{ fontWeight: 700 }}>{reader.name}</span>
        </div>
        <span style={{
          fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase',
          fontWeight: 800, color: accent,
          background: 'rgba(0,0,0,.04)', padding: '4px 10px', borderRadius: 999,
        }}>currently reading</span>
      </div>

      <div style={{ display: 'flex', gap: 18 }}>
        <BookCover book={book} w={110} h={166} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 className="pbc-display" style={{
            fontSize: 32, color: PALETTE.espresso, margin: 0, lineHeight: .95,
          }}>{book.title}</h3>
          <div className="pbc-serif" style={{ fontSize: 13, color: PALETTE.midBrown, fontStyle: 'italic', margin: '4px 0 8px' }}>
            {book.subtitle}
          </div>
          <div style={{ fontSize: 13, color: PALETTE.taupeDark, fontWeight: 700 }}>
            {book.author}
          </div>
          <div style={{
            marginTop: 10, display: 'flex', gap: 12,
            fontSize: 12, color: PALETTE.midBrown,
          }}>
            <Stat label="pages" value={book.pages} />
            <Stat label="read" value={book.current} />
            <Stat label="notes" value={book.notes} />
          </div>
        </div>
        <ProgressRing pct={pct} color={accent} />
      </div>

      <div>
        <input type="range" min={0} max={book.pages} value={book.current}
          onChange={(e) => onUpdate(Number(e.target.value))}
          style={{ width: '100%', accentColor: accent, cursor: 'pointer' }} />
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          fontSize: 12, color: PALETTE.midBrown, marginTop: 2,
        }}>
          <span>p. {book.current}</span>
          <span>{book.pages - book.current} pages left · ~{Math.ceil((book.pages - book.current)/30)} sittings</span>
          <span>p. {book.pages}</span>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div>
      <div className="pbc-display" style={{ fontSize: 20, color: PALETTE.espresso, lineHeight: 1 }}>
        {value}
      </div>
      <div style={{ fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: PALETTE.taupeDark, fontWeight: 700 }}>
        {label}
      </div>
    </div>
  );
}

function NotesPanel() {
  const notes = [
    { who: 0, page: 142, text: 'The mycorrhizal "wood-wide web" — gorgeous metaphor, ask A if it actually communicates or just resource-shares.' },
    { who: 1, page: 88,  text: 'Mendel\'s peas vs. our messy lived inheritance. Where does temperament come from?' },
    { who: 0, page: 73,  text: 'Sheldrake on mushrooms as "horizontal beings". Need to look up Anna Tsing.' },
  ];
  return (
    <div style={{
      background: PALETTE.cream, borderRadius: 20, padding: 22,
      display: 'flex', flexDirection: 'column', gap: 12,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', color: PALETTE.taupeDark, fontWeight: 800 }}>
            discussion notebook
          </div>
          <div className="pbc-display" style={{ fontSize: 28, color: PALETTE.espresso, marginTop: -2 }}>
            things we want to bring up
          </div>
        </div>
        <button style={{
          background: PALETTE.espresso, color: PALETTE.cream, border: 'none',
          borderRadius: 999, padding: '8px 16px', fontFamily: 'Nunito',
          fontWeight: 800, fontSize: 13, cursor: 'pointer',
        }}>+ jot a note</button>
      </div>
      {notes.map((n, i) => {
        const r = DATA.readers[n.who];
        return (
          <div key={i} style={{
            background: PALETTE.paper, borderRadius: 14, padding: '12px 16px',
            display: 'flex', gap: 12, alignItems: 'flex-start',
            borderLeft: `4px solid ${r.color}`,
          }}>
            <Avatar reader={r} size={28} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontWeight: 800, fontSize: 13, color: PALETTE.espresso }}>{r.name}</span>
                <span style={{ fontSize: 11, color: PALETTE.taupeDark, fontWeight: 700 }}>p. {n.page}</span>
              </div>
              <div style={{ fontSize: 13, color: PALETTE.midBrown, marginTop: 2, lineHeight: 1.4 }}>
                {n.text}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function VotePanel({ voted, setVoted }) {
  const total = DATA.nextTopics.reduce((s, t) => s + t.votes, 0) + 1;
  return (
    <div style={{
      background: PALETTE.cream, borderRadius: 20, padding: 22,
    }}>
      <div style={{ fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', color: PALETTE.taupeDark, fontWeight: 800 }}>
        June topic
      </div>
      <div className="pbc-display" style={{ fontSize: 28, color: PALETTE.espresso, marginTop: -2, marginBottom: 12 }}>
        cast a vote
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {DATA.nextTopics.map((t) => {
          const on = voted === t.id;
          const w = ((t.votes + (on ? 1 : 0)) / total) * 100;
          return (
            <button key={t.id} onClick={() => setVoted(t.id)} style={{
              background: 'transparent', border: 'none', textAlign: 'left',
              cursor: 'pointer', padding: 0,
            }}>
              <div style={{
                position: 'relative', borderRadius: 10, overflow: 'hidden',
                background: PALETTE.paper, padding: '10px 14px',
                border: `2px solid ${on ? PALETTE.taupe : 'transparent'}`,
              }}>
                <div style={{
                  position: 'absolute', inset: 0, width: `${w}%`,
                  background: on ? 'rgba(164,135,113,.35)' : 'rgba(164,135,113,.18)',
                  transition: 'width .25s',
                }} />
                <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 700, fontSize: 14 }}>
                  <span><span style={{ marginRight: 8 }}>{t.emoji}</span>{t.label}</span>
                  <span style={{ fontSize: 12, color: PALETTE.taupeDark }}>{on ? '✓' : ''}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
      <div style={{ fontSize: 11, color: PALETTE.taupeDark, marginTop: 12, textAlign: 'center' }}>
        winner gets picked on May 31 after discussion
      </div>
    </div>
  );
}

function ShelfRow() {
  // Empty shelf with one slot already populated by the current month.
  const months = [
    { label: 'May 26', topic: 'Biology', book: DATA.books[0], filled: 'current' },
    { label: 'Jun 26', topic: '???', filled: false },
    { label: 'Jul 26', topic: '???', filled: false },
    { label: 'Aug 26', topic: '???', filled: false },
    { label: 'Sep 26', topic: '???', filled: false },
  ];
  return (
    <div style={{
      background: PALETTE.taupeDeep, borderRadius: 20, padding: 22,
      color: PALETTE.cream,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(242,234,224,.6)', fontWeight: 800 }}>
            the shelf
          </div>
          <div className="pbc-display" style={{ fontSize: 28, color: PALETTE.cream, marginTop: -2 }}>
            our reading history
          </div>
        </div>
        <span style={{ fontSize: 13, opacity: .8 }}>0 finished · 1 in progress · ∞ to go</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14 }}>
        {months.map((m, i) => (
          <div key={i} style={{
            background: m.filled === 'current' ? PALETTE.cream : 'rgba(0,0,0,.18)',
            color: m.filled === 'current' ? PALETTE.espresso : 'rgba(242,234,224,.5)',
            borderRadius: 14, padding: 14,
            border: m.filled ? 'none' : '2px dashed rgba(242,234,224,.25)',
            minHeight: 120, display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          }}>
            <div style={{ fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', fontWeight: 800, opacity: .8 }}>
              {m.label}
            </div>
            {m.filled === 'current' ? (
              <>
                <div className="pbc-display" style={{ fontSize: 20, marginTop: 8, color: PALETTE.espresso }}>{m.topic}</div>
                <div style={{ fontSize: 11, marginTop: 4, color: PALETTE.midBrown }}>currently reading</div>
              </>
            ) : (
              <div className="pbc-hand" style={{ fontSize: 20, marginTop: 12 }}>tbd</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

window.LibraryDashboard = LibraryDashboard;
