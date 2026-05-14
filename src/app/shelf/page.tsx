"use client";
import { FocusWrap, ShelfRow } from "@/lib/views";
import { useArchives } from "@/lib/state";

export default function ShelfPage() {
  const { months } = useArchives();
  return (
    <FocusWrap title="Our reading history" eyebrow="every month, two books">
      <ShelfRow months={months} />
    </FocusWrap>
  );
}
