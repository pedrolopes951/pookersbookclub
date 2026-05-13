# Pookers Bookclub

Pedro & Laura's monthly two-book bookclub.

**The rule:** every month we pick a topic together. Pedro chooses a book for Laura. Laura chooses a book for Pedro.

## Adding a new month

Edit `src/data/books.ts`. Set the previous month's `status` to `"past"` and add a new entry with `status: "current"`:

```ts
{
  id: "2026-06",
  label: "June 2026",
  topic: "Cold War spy thrillers",
  status: "current",
  pedroReads: {
    title: "Tinker Tailor Soldier Spy",
    author: "John le Carré",
    pages: 384,
    currentPage: 0,
  },
  lauraReads: {
    title: "...",
    author: "...",
    pages: 0,
    currentPage: 0,
  },
}
```

Optional fields per book: `rating` (1–5), `notes`.

## Local dev

```bash
npm install
npm run dev
```

## Deploy to Vercel

1. Push this repo to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new), import the repo.
3. Defaults are fine (Next.js detected automatically). Click deploy.
4. To update the site: edit `src/data/books.ts`, commit, push — Vercel auto-deploys.
