// Poll prod for the new archives endpoint, then print current state + archives.
const HOST = "https://pookersbookclub.vercel.app";
const url = (p) => HOST + p;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function ready() {
  try {
    const r = await fetch(url("/api/months/archives"));
    return r.ok;
  } catch {
    return false;
  }
}

(async () => {
  let i = 0;
  while (!(await ready())) {
    i++;
    if (i > 50) { console.error("timed out waiting for deploy"); process.exit(1); }
    process.stdout.write("  ... still deploying\n");
    await sleep(6000);
  }
  console.log("Live\n");
  const state = await fetch(url("/api/state")).then((r) => r.json());
  console.log("month:", state.month.name, "|", state.month.topic);
  console.log("books:", state.books.map((b) => b.title));
  console.log("topics:", state.topics.map((t) => t.label));
  const arc = await fetch(url("/api/months/archives")).then((r) => r.json());
  console.log("archives count:", arc.months.length);
  for (const m of arc.months) {
    console.log(`  ${m.num}. ${m.name} (${m.status}) — ${m.topic}`);
  }
})();
