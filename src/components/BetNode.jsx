import NodeCard from "./NodeCard";

/**
 * SVG Icons - inline to avoid extra dependencies
 */
const Icons = {
  bet: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M8 12h8M12 8v8" />
    </svg>
  ),
  user: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  hand: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 11V6a2 2 0 0 0-2-2 2 2 0 0 0-2 2" />
      <path d="M14 10V4a2 2 0 0 0-2-2 2 2 0 0 0-2 2v6" />
      <path d="M10 10.5V6a2 2 0 0 0-2-2 2 2 0 0 0-2 2v8" />
      <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2a8 8 0 0 1-8-8" />
    </svg>
  ),
  comment: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
};

/**
 * BetNode - "Bet" type card for workflow
 *
 * Displays a bet/hypothesis with status badge.
 * Data is passed via React Flow's `data` prop.
 */
export default function BetNode({ data }) {
  const footer = (
    <>
      <div className="node-footer-icons">
        {Icons.user}
        {Icons.hand}
        {Icons.comment}
      </div>
      <div className="node-status-badge">
        Active <span>▼</span>
      </div>
    </>
  );

  return (
    <NodeCard
      icon={Icons.bet}
      type="Bet"
      tag={data.tag}
      footer={footer}
      accentColor="#8b5cf6"
    >
      <h3 className="node-title">{data.title}</h3>
    </NodeCard>
  );
}
