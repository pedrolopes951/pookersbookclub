"use client";
import type React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PALETTE, readers } from "@/data/books";
import { Avatar } from "@/lib/views";

const navItems = [
  { href: "/now", label: "Now Reading", icon: "📖" },
  { href: "/notes", label: "Notes", icon: "✎" },
  { href: "/disc", label: "Discussion", icon: "☕" },
  { href: "/vote", label: "Vote Next", icon: "🗳" },
  { href: "/shelf", label: "Shelf", icon: "📚" },
  { href: "/us", label: "Two Readers", icon: "♡" },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [Pedro, Laura] = readers;

  return (
    <div
      className="pbc-body min-h-screen w-full grid"
      style={{
        background: PALETTE.taupe,
        color: PALETTE.espresso,
        gridTemplateColumns: "260px 1fr",
      }}
    >
      <aside
        style={{
          background: PALETTE.espresso,
          color: PALETTE.cream,
          padding: "28px 22px 32px",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <Link
          href="/"
          aria-label="go to landing"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 24,
            textDecoration: "none",
            color: "inherit",
            cursor: "pointer",
            borderRadius: 14,
            padding: 2,
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              background: PALETTE.taupe,
              overflow: "hidden",
              flexShrink: 0,
              boxShadow: "0 6px 14px rgba(0,0,0,.3)",
              position: "relative",
            }}
          >
            <Image
              src="/bookclub.jpeg"
              alt="Pookers"
              fill
              sizes="52px"
              style={{ objectFit: "cover", transform: "scale(1.6) translateY(8%)" }}
            />
          </div>
          <div>
            <div className="pbc-display" style={{ fontSize: 22, color: PALETTE.cream, lineHeight: 0.9 }}>Pookers</div>
            <div className="pbc-display" style={{ fontSize: 22, color: PALETTE.peach, lineHeight: 0.9 }}>bookclub</div>
          </div>
        </Link>

        <div
          style={{
            fontSize: 10,
            letterSpacing: ".18em",
            textTransform: "uppercase",
            color: "rgba(242,234,224,.5)",
            margin: "8px 12px 6px",
          }}
        >
          Library
        </div>
        {navItems.map((n) => {
          const on = pathname === n.href || pathname?.startsWith(n.href + "/");
          return (
            <Link
              key={n.href}
              href={n.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                background: on ? PALETTE.taupe : "transparent",
                color: on ? PALETTE.espresso : PALETTE.cream,
                borderRadius: 12,
                padding: "10px 14px",
                fontFamily: "var(--font-body), sans-serif",
                fontWeight: 700,
                fontSize: 14,
                textDecoration: "none",
                transition: "all .15s",
              }}
            >
              <span style={{ fontSize: 16, width: 20, textAlign: "center" }}>{n.icon}</span>
              {n.label}
            </Link>
          );
        })}

        <div style={{ flex: 1 }} />

        <div
          style={{
            background: "rgba(212,165,116,.12)",
            borderRadius: 14,
            padding: 14,
            border: "1px solid rgba(212,165,116,.2)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", marginBottom: 10 }}>
            <Avatar reader={Pedro} size={28} ring />
            <div style={{ marginLeft: -8 }}>
              <Avatar reader={Laura} size={28} ring />
            </div>
            <div style={{ marginLeft: 10, fontSize: 13, fontWeight: 700 }}>
              {Pedro.name} <span style={{ opacity: 0.5 }}>&</span> {Laura.name}
            </div>
          </div>
          <div style={{ fontSize: 11, color: "rgba(242,234,224,.7)", lineHeight: 1.4 }}>
            Membership: 2/2 · trading picks since May 2026
          </div>
        </div>
      </aside>

      <main style={{ padding: "32px 40px 48px", overflow: "hidden" }}>{children}</main>
    </div>
  );
}
