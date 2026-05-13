"use client";
import { FocusWrap, DiscussionView } from "@/lib/views";
import { api, daysUntil, useAppState } from "@/lib/state";

export default function DiscussionPage() {
  const { data } = useAppState();
  return (
    <FocusWrap title="Discussion Night" eyebrow="when we sit down with our tea">
      {data ? (
        <DiscussionView
          days={daysUntil(new Date(data.month.dateISO))}
          month={data.month}
          prompts={data.prompts}
          onUpdateMonth={(p) => api.updateMonth(p)}
          onAddPrompt={(t) => api.addPrompt(t)}
          onUpdatePrompt={(id, t) => api.updatePrompt(id, t)}
          onDeletePrompt={(id) => api.deletePrompt(id)}
        />
      ) : (
        <div className="pbc-hand" style={{ fontSize: 22, color: "#6F5A4A" }}>loading…</div>
      )}
    </FocusWrap>
  );
}
