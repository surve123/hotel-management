import React from 'react';

/**
 * SourcePerformanceBarChart Component (LMS PART 1 - Screen 3)
 * Grouped multi-series bar chart for marketing channels (Leads, Bookings, Revenue index).
 * 100% SVG Vector (Zero Emojis).
 */
export const SourcePerformanceBarChart = () => {
  const data = [
    { source: 'Instagram', leads: 350, bookings: 110, revenue: 65 },
    { source: 'WhatsApp', leads: 290, bookings: 95, revenue: 55 },
    { source: 'Website', leads: 220, bookings: 80, revenue: 48 },
    { source: 'Phone', leads: 150, bookings: 55, revenue: 35 },
    { source: 'Referral', leads: 120, bookings: 45, revenue: 28 },
    { source: 'Other', leads: 90, bookings: 30, revenue: 18 },
  ];

  const series = [
    { key: 'leads', label: 'Leads', color: '#1E56F0' },
    { key: 'bookings', label: 'Bookings', color: '#06B6D4' },
    { key: 'revenue', label: 'Revenue', color: '#F59E0B' },
  ];

  // SVG Chart Dimensions
  const svgWidth = 480;
  const svgHeight = 200;
  const margin = { top: 20, right: 15, bottom: 30, left: 35 };
  const chartWidth = svgWidth - margin.left - margin.right;
  const chartHeight = svgHeight - margin.top - margin.bottom;

  const maxY = 400;
  const yTicks = [0, 100, 200, 300, 400];

  const groupWidth = chartWidth / data.length;
  const barWidth = 10;
  const barGap = 3;

  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      border: '1px solid #E2E8F0',
      borderRadius: '12px',
      padding: '18px 20px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      height: '100%',
      boxSizing: 'border-box'
    }}>
      {/* Header with Legend */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '10px'
      }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
          Source Performance
        </h3>
        {/* Legend */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {series.map((s) => (
            <div key={s.key} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.72rem', color: '#64748B' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: s.color }} />
              <span style={{ fontWeight: 500 }}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* SVG Grouped Bar Chart */}
      <div style={{ width: '100%', height: '200px' }}>
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} width="100%" height="100%" style={{ overflow: 'visible' }}>
          {/* Y-Axis Gridlines & Labels */}
          {yTicks.map((val) => {
            const y = margin.top + chartHeight - (val / maxY) * chartHeight;
            return (
              <g key={val}>
                <line
                  x1={margin.left}
                  y1={y}
                  x2={svgWidth - margin.right}
                  y2={y}
                  stroke="#F1F5F9"
                  strokeWidth="1"
                  strokeDasharray={val === 0 ? "none" : "3,3"}
                />
                <text
                  x={margin.left - 8}
                  y={y + 3}
                  textAnchor="end"
                  fill="#94A3B8"
                  fontSize="10"
                  fontWeight="500"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* Bar Groups */}
          {data.map((item, idx) => {
            const groupX = margin.left + idx * groupWidth;
            const centerOffset = (groupWidth - (3 * barWidth + 2 * barGap)) / 2;

            return (
              <g key={item.source}>
                {series.map((s, sIdx) => {
                  const val = item[s.key];
                  const barH = (val / maxY) * chartHeight;
                  const x = groupX + centerOffset + sIdx * (barWidth + barGap);
                  const y = margin.top + chartHeight - barH;

                  return (
                    <rect
                      key={s.key}
                      x={x}
                      y={y}
                      width={barWidth}
                      height={Math.max(barH, 2)}
                      rx="3"
                      ry="3"
                      fill={s.color}
                      style={{ transition: 'height 0.3s ease, y 0.3s ease' }}
                    >
                      <title>{`${item.source} ${s.label}: ${val}`}</title>
                    </rect>
                  );
                })}

                {/* X-Axis Category Label */}
                <text
                  x={groupX + groupWidth / 2}
                  y={svgHeight - 10}
                  textAnchor="middle"
                  fill="#64748B"
                  fontSize="10.5"
                  fontWeight="500"
                >
                  {item.source}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

export default SourcePerformanceBarChart;
