// direction-cozy.jsx — Direction 1: Cozy Scrapbook
// Single column, photo-led, warm taupe everywhere, chunky display headings,
// sticky-note discussion prompts, polaroid feel.

function CozyScrapbook() {
  const [active, setActive] = React.useState(0); // tab: current / archive
  const [voted, setVoted] = React.useState('t2');
  const [readBookA, setReadBookA] = React.useState(DATA.books[0].current); // Sofia's
  const [readBookB, setReadBookB] = React.useState(DATA.books[1].current); // Andrei's
  const days = daysUntil(DATA.discussion.date);
  const [Andrei, Sofia] = DATA.readers;
  const [bookForSofia, bookForAndrei] = DATA.books;

  const bookA = { ...bookForSofia, current: readBookA };
  const bookB = { ...bookForAndrei, current: readBookB };

  return (
    <div className="pbc-body" style={{
      width: '100%', minHeight: '100%',
      background: PALETTE.taupe,
      color: PALETTE.espresso,
      fontFamily: 'Nunito,system-ui,sans-serif',
      padding: '40px 56px 64px',
      boxSizing: 'border-box',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* tiny brain bulb + book corner echoes */}
      <CornerDoodle position="tl" />
      <CornerDoodle position="tr" />

      {/* ─── HERO ─── */}
      <header style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 8 }}>
        <PolaroidPhoto />
        <h1 className="pbc-display" style={{
          fontSize: 92, color: PALETTE.espresso, margin: '20px 0 6px',
          textAlign: 'center',
        }}>
          Pookers<br />bookclub
        </h1>
        <div className="pbc-hand" style={{
          fontSize: 26, color: PALETTE.midBrown, marginTop: 4,
        }}>
          a tiny book club for two · since May 2026
        </div>
      </header>

      {/* ─── TABS ─── */}
      <nav style={{
        marginTop: 36, display: 'flex', justifyContent: 'center', gap: 12,
      }}>
        {['This month', 'Discussion night', 'Vote next topic', 'Our shelf'].map((label, i) => (
          <button key={label} onClick={() => setActive(i)} style={{
            background: i === active ? PALETTE.espresso : 'transparent',
            color: i === active ? PALETTE.cream : PALETTE.espresso,
            border: `2px solid ${PALETTE.espresso}`,
            borderRadius: 999, padding: '10px 22px',
            fontFamily: 'Nunito,sans-serif', fontWeight: 800, fontSize: 15,
            cursor: 'pointer', letterSpacing: '.02em',
            transition: 'all .15s',
          }}>{label}</button>
        ))}
      </nav>

      {/* ─── MONTH TOPIC STRIP ─── */}
      <section style={{
        marginTop: 36, background: PALETTE.cream,
        borderRadius: 28, padding: '28px 32px',
        boxShadow: '0 18px 40px rgba(45,31,21,.18)',
        display: 'grid', gridTemplateColumns: 'auto 1fr auto', alignItems: 'center', gap: 28,
      }}>
        <div style={{
          width: 88, height: 88, borderRadius: 22, background: PALETTE.taupe,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 50,
        }}>🧫</div>
        <div>
          <div className="pbc-hand" style={{ fontSize: 22, color: PALETTE.taupeDeep }}>
            this month we're reading about
          </div>
          <div className="pbc-display" style={{ fontSize: 56, color: PALETTE.espresso, marginTop: -4 }}>
            {DATA.month.topic}.
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div className="pbc-hand" style={{ fontSize: 22, color: PALETTE.taupeDeep }}>discussion in</div>
          <div className="pbc-display" style={{ fontSize: 64, color: PALETTE.teal, lineHeight: .95 }}>
            {days}<span style={{ fontSize: 24, marginLeft: 6 }}>days</span>
          </div>
        </div>
      </section>

      {/* ─── TWO BOOK CARDS ─── */}
      <section style={{
        marginTop: 32, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28,
      }}>
        <BookSlab
          reader={Sofia} picker={Andrei} book={bookA} tilt={-1.5}
          onUpdate={(v) => setReadBookA(v)}
          ribbon="picked by him, for her"
          ribbonColor={Andrei.color}
        />
        <BookSlab
          reader={Andrei} picker={Sofia} book={bookB} tilt={1.5}
          onUpdate={(v) => setReadBookB(v)}
          ribbon="picked by her, for him"
          ribbonColor={Sofia.color}
        />
      </section>

      {/* ─── DISCUSSION PROMPTS as sticky notes ─── */}
      <section style={{ marginTop: 56 }}>
        <SectionTitle eyebrow="things to talk about" title="discussion prompts" />
        <div style={{
          marginTop: 24,
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18,
          paddingBottom: 12,
        }}>
          {DATA.prompts.map((q, i) => (
            <StickyNote key={i} index={i} text={q} />
          ))}
        </div>
      </section>

      {/* ─── DISCUSSION NIGHT + VOTE row ─── */}
      <section style={{
        marginTop: 56, display: 'grid', gridTemplateColumns: '1.05fr 1fr', gap: 28,
      }}>
        <DiscussionCard days={days} />
        <VoteCard voted={voted} setVoted={setVoted} />
      </section>

      {/* ─── ARCHIVE / SHELF ─── */}
      <section style={{ marginTop: 56 }}>
        <SectionTitle eyebrow="our shelf so far" title="past months" />
        <div style={{
          marginTop: 24, background: PALETTE.creamSoft,
          borderRadius: 28, padding: '36px 32px',
          display: 'flex', alignItems: 'center', gap: 28,
          border: `2px dashed ${PALETTE.taupeDeep}`,
        }}>
          <div style={{ fontSize: 64 }}>📖</div>
          <div>
            <div className="pbc-display" style={{ fontSize: 32, color: PALETTE.espresso }}>
              this is month one.
            </div>
            <div className="pbc-hand" style={{ fontSize: 22, color: PALETTE.midBrown, marginTop: 4 }}>
              after discussion night, biology lands on the shelf and we start filling this row.
            </div>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer style={{
        marginTop: 56, textAlign: 'center', color: PALETTE.midBrown,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
      }}>
        <div className="pbc-display" style={{ fontSize: 28, color: PALETTE.espresso }}>
          A &nbsp;♡&nbsp; S
        </div>
        <div style={{ fontSize: 13, opacity: .7, letterSpacing: '.05em' }}>
          two pooks · one shelf · forever reading
        </div>
      </footer>
    </div>
  );
}

// ─── sub-components ───

function PolaroidPhoto() {
  return (
    <div style={{
      background: '#fff', padding: '14px 14px 56px', borderRadius: 8,
      transform: 'rotate(-2deg)',
      boxShadow: '0 20px 50px rgba(45,31,21,.35), 0 0 0 1px rgba(45,31,21,.08)',
      position: 'relative', display: 'inline-block',
    }}>
      <img src="assets/logo.png" alt="us" style={{
        width: 320, height: 320, objectFit: 'cover', display: 'block',
        borderRadius: 2,
      }} />
      <div className="pbc-hand" style={{
        position: 'absolute', bottom: 14, left: 0, right: 0,
        textAlign: 'center', fontSize: 28, color: PALETTE.espresso,
      }}>the pooks ♡</div>
      {/* washi tape */}
      <div style={{
        position: 'absolute', top: -10, left: '40%', width: 70, height: 22,
        background: 'rgba(212,165,116,.7)', transform: 'rotate(-6deg)',
        boxShadow: '0 2px 6px rgba(0,0,0,.15)',
      }} />
    </div>
  );
}

function CornerDoodle({ position }) {
  const positions = {
    tl: { top: 24, left: 32 },
    tr: { top: 24, right: 32 },
  };
  return (
    <div style={{ position: 'absolute', ...positions[position], opacity: .9 }}>
      {position === 'tl' ? (
        <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
          <path d="M30 12c-7 0-12 5-12 12 0 5 3 8 5 10v5h14v-5c2-2 5-5 5-10 0-7-5-12-12-12z"
            stroke={PALETTE.espresso} strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M26 39v5h8v-5" stroke={PALETTE.espresso} strokeWidth="2.5" strokeLinecap="round" />
          <path d="M30 28v8M27 30l3 2 3-2" stroke={PALETTE.espresso} strokeWidth="2" strokeLinecap="round" />
          <g stroke={PALETTE.espresso} strokeWidth="2" strokeLinecap="round">
            <line x1="10" y1="22" x2="14" y2="22" /><line x1="46" y1="22" x2="50" y2="22" />
            <line x1="30" y1="2" x2="30" y2="6" />
          </g>
        </svg>
      ) : (
        <svg width="64" height="48" viewBox="0 0 64 48" fill="none">
          <path d="M4 8h26v34H4z M34 8h26v34H34z" fill={PALETTE.teal} />
          <path d="M4 8c8-4 18-4 26 0v34c-8-4-18-4-26 0z M60 8c-8-4-18-4-26 0v34c8-4 18-4 26 0z"
            fill="none" stroke={PALETTE.tealDeep} strokeWidth="2" />
          <line x1="32" y1="8" x2="32" y2="42" stroke={PALETTE.tealDeep} strokeWidth="2" />
          {[14, 20, 26].map((y) => (
            <React.Fragment key={y}>
              <line x1="10" y1={y} x2="26" y2={y} stroke="rgba(255,255,255,.5)" strokeWidth="1" />
              <line x1="38" y1={y} x2="54" y2={y} stroke="rgba(255,255,255,.5)" strokeWidth="1" />
            </React.Fragment>
          ))}
        </svg>
      )}
    </div>
  );
}

function BookSlab({ reader, picker, book, tilt, onUpdate, ribbon, ribbonColor }) {
  const pct = Math.round((book.current / book.pages) * 100);
  return (
    <div style={{
      background: PALETTE.paper, borderRadius: 24, padding: 28,
      boxShadow: '0 24px 50px rgba(45,31,21,.22), 0 0 0 1px rgba(45,31,21,.05)',
      transform: `rotate(${tilt}deg)`,
      position: 'relative', overflow: 'hidden',
    }}>
      {/* ribbon */}
      <div style={{
        position: 'absolute', top: 18, right: -36,
        background: ribbonColor, color: '#fff',
        padding: '4px 44px', transform: 'rotate(34deg)',
        fontFamily: 'Nunito,sans-serif', fontWeight: 800, fontSize: 11,
        letterSpacing: '.08em', textTransform: 'uppercase',
        boxShadow: '0 4px 10px rgba(0,0,0,.15)',
      }}>{ribbon}</div>

      <div style={{ display: 'flex', gap: 22, alignItems: 'flex-start' }}>
        <BookCover book={book} w={130} h={196} tilt={-2} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="pbc-hand" style={{ color: ribbonColor, fontSize: 22, marginBottom: -2 }}>
            for {reader.name.toLowerCase()} —
          </div>
          <h3 className="pbc-display" style={{
            fontSize: 36, color: PALETTE.espresso, margin: '4px 0 6px', lineHeight: .98,
          }}>{book.title}</h3>
          <div className="pbc-serif" style={{ fontSize: 14, color: PALETTE.midBrown, fontStyle: 'italic', marginBottom: 8, lineHeight: 1.3 }}>
            {book.subtitle}
          </div>
          <div style={{ fontSize: 14, color: PALETTE.taupeDark, fontWeight: 600 }}>
            {book.author} · {book.year}
          </div>
          <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Avatar reader={reader} size={26} />
            <span style={{ fontSize: 13, color: PALETTE.midBrown }}>{reader.name} is reading</span>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 18 }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
          marginBottom: 8,
        }}>
          <span style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: 14, letterSpacing: '.08em', color: PALETTE.taupeDark, textTransform: 'uppercase' }}>
            progress
          </span>
          <span className="pbc-display" style={{ fontSize: 28, color: PALETTE.espresso }}>
            {pct}<span style={{ fontSize: 16 }}>%</span>
          </span>
        </div>
        <Progress pct={pct} color={ribbonColor} withThumb />
        <div style={{
          display: 'flex', justifyContent: 'space-between', marginTop: 8,
          fontSize: 13, color: PALETTE.midBrown,
        }}>
          <span>page {book.current} of {book.pages}</span>
          <span>{book.pages - book.current} pages to go</span>
        </div>
        <input type="range" min={0} max={book.pages} value={book.current}
          onChange={(e) => onUpdate(Number(e.target.value))}
          style={{
            width: '100%', marginTop: 10, accentColor: ribbonColor, cursor: 'pointer',
          }} />
      </div>

      <div style={{
        marginTop: 16, padding: '10px 14px', borderRadius: 12,
        background: PALETTE.creamSoft,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <span style={{ fontSize: 13, color: PALETTE.midBrown }}>
          📝 <strong>{book.notes}</strong> notes · last on p. {Math.floor(book.current * .9)}
        </span>
        <button style={{
          background: PALETTE.espresso, color: PALETTE.cream, border: 'none',
          borderRadius: 999, padding: '6px 14px', fontFamily: 'Nunito,sans-serif',
          fontWeight: 700, fontSize: 12, cursor: 'pointer', letterSpacing: '.04em',
        }}>+ add note</button>
      </div>
    </div>
  );
}

function StickyNote({ index, text }) {
  const tilts = [-2, 1.5, -1, 2, -1.5];
  const colors = [PALETTE.postit, '#F8D6BC', '#D9E5C8', '#F4E4A8', '#F2C8B8'];
  return (
    <div style={{
      background: colors[index % colors.length],
      padding: '20px 18px 22px',
      borderRadius: 4,
      transform: `rotate(${tilts[index % tilts.length]}deg)`,
      boxShadow: '0 8px 22px rgba(45,31,21,.18), 0 0 0 1px rgba(0,0,0,.04)',
      position: 'relative',
      fontFamily: 'Caveat,cursive', fontSize: 22,
      color: PALETTE.espresso, lineHeight: 1.25,
    }}>
      <div style={{
        position: 'absolute', top: -8, left: '50%', transform: 'translateX(-50%) rotate(-3deg)',
        width: 50, height: 16, background: 'rgba(45,31,21,.18)',
        borderRadius: 2,
      }} />
      <div style={{
        fontFamily: 'Nunito,sans-serif', fontWeight: 800, fontSize: 11,
        letterSpacing: '.1em', color: PALETTE.taupeDark, textTransform: 'uppercase',
        marginBottom: 6,
      }}>prompt #{index + 1}</div>
      {text}
    </div>
  );
}

function DiscussionCard({ days }) {
  return (
    <div style={{
      background: PALETTE.espresso, borderRadius: 28, padding: 32,
      color: PALETTE.cream, position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: -40, right: -40, width: 200, height: 200,
        borderRadius: '50%', background: 'rgba(212,165,116,.18)',
      }} />
      <div className="pbc-hand" style={{ fontSize: 22, color: PALETTE.peach }}>
        discussion night
      </div>
      <div className="pbc-display" style={{ fontSize: 60, color: PALETTE.cream, lineHeight: .95, marginTop: 4 }}>
        {DATA.discussion.dateLabel}
      </div>
      <div style={{ fontSize: 18, color: PALETTE.peach, marginTop: 6, fontWeight: 600 }}>
        {DATA.discussion.timeLabel} · {DATA.discussion.location}
      </div>
      <div style={{ display: 'flex', gap: 10, marginTop: 22, position: 'relative' }}>
        {['T-' + days + ' days', 'tea ready', 'snacks tbd', 'phones away'].map((chip, i) => (
          <span key={i} style={{
            background: 'rgba(242,234,224,.12)',
            color: PALETTE.cream,
            padding: '8px 14px', borderRadius: 999, fontSize: 13, fontWeight: 700,
            border: '1.5px solid rgba(242,234,224,.18)',
          }}>{chip}</span>
        ))}
      </div>
    </div>
  );
}

function VoteCard({ voted, setVoted }) {
  return (
    <div style={{
      background: PALETTE.cream, borderRadius: 28, padding: 28, position: 'relative',
      boxShadow: '0 14px 30px rgba(45,31,21,.14)',
    }}>
      <SectionTitle eyebrow="june — pick our next topic" title="cast a vote" size="sm" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 18 }}>
        {DATA.nextTopics.map((t) => {
          const isVoted = voted === t.id;
          return (
            <button key={t.id} onClick={() => setVoted(t.id)} style={{
              background: isVoted ? PALETTE.taupe : PALETTE.paper,
              color: isVoted ? PALETTE.cream : PALETTE.espresso,
              border: `2px solid ${isVoted ? PALETTE.taupeDeep : 'transparent'}`,
              borderRadius: 14, padding: '12px 16px',
              fontFamily: 'Nunito,sans-serif', fontWeight: 800, fontSize: 16,
              cursor: 'pointer', textAlign: 'left',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              transition: 'all .15s',
            }}>
              <span><span style={{ marginRight: 10, fontSize: 18 }}>{t.emoji}</span>{t.label}</span>
              <span style={{ fontSize: 12, fontWeight: 700, opacity: .7 }}>
                {isVoted ? '✓ your pick' : `${t.votes} ${t.votes === 1 ? 'vote' : 'votes'}`}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SectionTitle({ eyebrow, title, size = 'lg' }) {
  return (
    <div>
      <div className="pbc-hand" style={{
        fontSize: 22, color: PALETTE.taupeDark,
      }}>{eyebrow}</div>
      <div className="pbc-display" style={{
        fontSize: size === 'lg' ? 48 : 32, color: PALETTE.espresso,
        marginTop: -2,
      }}>{title}</div>
    </div>
  );
}

window.CozyScrapbook = CozyScrapbook;
