import NodeCard from "./NodeCard";

/**
 * SVG Icons - inline to avoid extra dependencies
 */
const Icons = {
  chart: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 3v18h18" />
      <path d="M18 17V9" />
      <path d="M13 17V5" />
      <path d="M8 17v-3" />
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
  trendline: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 17l6-6 4 4L21 7" />
    </svg>
  ),
};

/**
 * MetricNode - "Metric / Input" type card for workflow
 *
 * Displays KPIs with time-based comparisons.
 * Expects data.metrics to be an array of { label, value, change } objects.
 */
export default function MetricNode({ data }) {
  const footer = (
    <>
      <div className="node-footer-icons">
        {Icons.user}
        {Icons.hand}
        {Icons.comment}
        {Icons.trendline}
      </div>
      <div className="node-dropdown">
        Sum <span>▼</span>
      </div>
    </>
  );

  return (
    <NodeCard
      icon={Icons.chart}
      type="Metric / Input"
      tag={data.tag}
      footer={footer}
      accentColor="#8b5cf6"
    >
      <h3 className="node-title">{data.title}</h3>

      {/* Metric Grid */}
      <div className="metric-grid">
        {data.metrics.map((metric, index) => (
          <div key={index} className="metric-item">
            <div className="metric-label">{metric.label}</div>
            <div className="metric-value">{metric.value}</div>
            <div className="metric-change">{metric.change} ↗</div>
          </div>
        ))}
      </div>
    </NodeCard>
  );
}
