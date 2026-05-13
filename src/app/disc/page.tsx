"use client";
import { FocusWrap, DiscussionView } from "@/lib/views";
import { daysUntil, useDiscState, usePrompts } from "@/lib/state";

export default function DiscussionPage() {
  const [discState, setDiscState] = useDiscState();
  const [discPrompts, setDiscPrompts] = usePrompts();
  const days = daysUntil(new Date(discState.dateISO));
  return (
    <FocusWrap title="Discussion Night" eyebrow="when we sit down with our tea">
      <DiscussionView
        days={days}
        discState={discState}
        setDiscState={setDiscState}
        discPrompts={discPrompts}
        setDiscPrompts={setDiscPrompts}
      />
    </FocusWrap>
  );
}
