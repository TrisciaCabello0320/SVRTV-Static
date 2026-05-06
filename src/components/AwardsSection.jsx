import { useMemo } from 'react';
import { DB, STRIPE_COLORS } from '../data/database';

export default function AwardsSection({ awards = [] }) {
  const awardData = awards.length > 0 ? awards : DB.awards;
  const sorted = useMemo(() => [...awardData].sort((a, b) => b.year - a.year), [awardData]);

  return (
    <section id="sec-awards" className="sec bg-w">
      <div className="wrap">
        <div className="eye">Recognition</div>
        <div className="h2" style={{ marginBottom: 28 }}>
          Awards &amp; Recognitions
        </div>

        <div className="award-list">
          {sorted.map((award) => (
            <div key={award.id} className="award-row reveal">
              <div
                className="award-stripe"
                style={{ background: STRIPE_COLORS[award.cat] || '#4338ca' }}
              />
              <div className="award-yr">
                <div className="award-yr-num">{award.year}</div>
              </div>
              <div className="award-main">
                <div className="award-name">{award.title}</div>
                <div className="award-org">{award.org}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
