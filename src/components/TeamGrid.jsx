import { DB } from '../data/database';

export default function TeamGrid({ onSelectMember }) {
  return (
    <div className="team-grid">
      {DB.team.map((member) => (
        <div
          key={member.id}
          className="team-card"
          onClick={() => onSelectMember(member)}
        >
          {member.image && <img src={member.image} alt={member.name} className="team-photo" />}
          <div className="team-info">
            <div className="team-name">{member.name}</div>
            <div className="team-role">{member.role}</div>
          </div>
        </div>
      ))}
    </div>
  );
}