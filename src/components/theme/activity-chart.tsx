"use client";

import { useState } from "react";

type Day = { date: string; label: string; count: number };
export function ActivityChart({ days, labels }: {
  days: Day[];
  labels: { title: string; hint: string; days7: string; days14: string; posts: string; empty: string };
}) {
  const [range, setRange] = useState(7);
  const visible = days.slice(-range);
  const total = visible.reduce((sum, day) => sum + day.count, 0);
  const max = Math.max(1, ...visible.map((day) => day.count));
  return (
    <section className="neighborhood-panel activity-panel" aria-label={labels.title}>
      <div className="neighborhood-panel-head"><h3>{labels.title}</h3>
        <div className="chart-range" role="group" aria-label={labels.title}>
          {[7, 14].map((value) => <button key={value} type="button" aria-pressed={range === value} onClick={() => setRange(value)}>{value === 7 ? labels.days7 : labels.days14}</button>)}
        </div>
      </div>
      <p className="chart-total" aria-live="polite"><b>{total.toLocaleString()}</b> {labels.posts}</p>
      <div className="kinjo-bars" key={range}>
        {visible.map((day, index) => <div className="kinjo-day" key={day.date}>
          <div className="kinjo-bar-track" tabIndex={0} aria-label={`${day.label}: ${day.count} ${labels.posts}`}>
            <span className="kinjo-bar-value">{day.count}</span>
            <i style={{ height: `${day.count / max * 100}%`, animationDelay: `${index * 25}ms` }} />
          </div><span className="kinjo-day-label">{day.label}</span>
        </div>)}
      </div>
      <p className="chart-caption">{total ? labels.hint : labels.empty}</p>
    </section>
  );
}
