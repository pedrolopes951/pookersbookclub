"use client";
import { FocusWrap, VotePanel } from "@/lib/views";
import { api, useAppState, useVotingAs } from "@/lib/state";

export default function VotePage() {
  const { data } = useAppState();
  const [votingAs, setVotingAs] = useVotingAs();
  return (
    <FocusWrap title="Vote the next topic" eyebrow="june is wide open">
      {data ? (
        <VotePanel
          topics={data.topics}
          votingAs={votingAs}
          setVotingAs={setVotingAs}
          onToggle={(id) => api.toggleVote(id, votingAs)}
          onAddTopic={(b) => api.addTopic(b)}
          onUpdateTopic={(id, patch) => api.updateTopic(id, patch)}
          onDeleteTopic={(id) => api.deleteTopic(id)}
          dateLabel={data.month.dateLabel}
          wide
        />
      ) : (
        <div className="pbc-hand" style={{ fontSize: 22, color: "#6F5A4A" }}>loading…</div>
      )}
    </FocusWrap>
  );
}
