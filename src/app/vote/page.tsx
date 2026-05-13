"use client";
import { FocusWrap, VotePanel } from "@/lib/views";
import {
  useDiscState,
  useLauraVotes,
  usePedroVotes,
  useTopics,
  useVotingAs,
} from "@/lib/state";

export default function VotePage() {
  const [pedroVotes, setPedroVotes] = usePedroVotes();
  const [lauraVotes, setLauraVotes] = useLauraVotes();
  const [votingAs, setVotingAs] = useVotingAs();
  const [topics, setTopics] = useTopics();
  const [discState] = useDiscState();

  const onVote = (topicId: string) => {
    const toggle = (votes: string[]) =>
      votes.includes(topicId) ? votes.filter((v) => v !== topicId) : [...votes, topicId];
    if (votingAs === "p") setPedroVotes(toggle);
    else setLauraVotes(toggle);
  };

  return (
    <FocusWrap title="Vote the next topic" eyebrow="june is wide open">
      <VotePanel
        topics={topics}
        setTopics={setTopics}
        pedroVotes={pedroVotes}
        lauraVotes={lauraVotes}
        votingAs={votingAs}
        setVotingAs={setVotingAs}
        onVote={onVote}
        dateLabel={discState.dateLabel}
        wide
      />
    </FocusWrap>
  );
}
