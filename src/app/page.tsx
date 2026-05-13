import { PhotoHero } from "@/lib/views";
import Link from "next/link";
import { PALETTE } from "@/data/books";

export default function LandingPage() {
  return (
    <div>
      <PhotoHero />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 14,
          marginTop: 24,
          flexWrap: "wrap",
        }}
      >
        <span
          className="pbc-hand"
          style={{
            fontSize: 22,
            color: PALETTE.taupeDeep,
          }}
        >
          pick a corner of the shelf →
        </span>
        <Link
          href="/now"
          style={{
            background: PALETTE.espresso,
            color: PALETTE.cream,
            borderRadius: 999,
            padding: "10px 22px",
            textDecoration: "none",
            fontWeight: 800,
            fontSize: 14,
            letterSpacing: ".04em",
            boxShadow: "0 8px 18px rgba(45,31,21,.18)",
          }}
        >
          open this month →
        </Link>
      </div>
    </div>
  );
}
