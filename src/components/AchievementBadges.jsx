// Achievement badges based on impact metrics
const AchievementBadges = ({ metrics }) => {
  const achievements = [];

  // Book Reused milestones
  if (metrics.total >= 1) achievements.push({ icon: '📚', label: 'Book Sharer', color: 'blue' });
  if (metrics.total >= 5) achievements.push({ icon: '🌟', label: 'Eco Champion', color: 'purple' });
  if (metrics.total >= 10) achievements.push({ icon: '👑', label: 'Reuse Legend', color: 'indigo' });
  if (metrics.total >= 25) achievements.push({ icon: '🚀', label: 'Sustainability Hero', color: 'green' });

  // Money Saved milestones
  if (metrics.moneySaved >= 5000) achievements.push({ icon: '💰', label: 'Saver', color: 'green' });
  if (metrics.moneySaved >= 25000) achievements.push({ icon: '💎', label: 'Money Master', color: 'yellow' });

  // Paper Saved milestones
  if (metrics.paperSavedKg >= 20) achievements.push({ icon: '🌱', label: 'Green Guardian', color: 'green' });
  if (metrics.paperSavedKg >= 50) achievements.push({ icon: '🌍', label: 'Planet Protector', color: 'teal' });

  // Recent activity streak (assuming 1 per day avg)
  if (metrics.total >= 7) achievements.push({ icon: '🔥', label: '7-Day Active', color: 'orange' });

  const colorMap = {
    blue: 'bg-blue-50 border-blue-200 text-blue-800',
    purple: 'bg-purple-50 border-purple-200 text-purple-800',
    indigo: 'bg-indigo-50 border-indigo-200 text-indigo-800',
    green: 'bg-green-50 border-green-200 text-green-800',
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    orange: 'bg-orange-50 border-orange-200 text-orange-800',
    teal: 'bg-teal-50 border-teal-200 text-teal-800',
  };

  if (achievements.length === 0) return null;

  return (
    <div className="glass-card-lg p-8 hover-glow transition-smooth-lg mb-8 text-slate-900">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl">🏆</span>
        <h3 className="text-2xl font-bold text-slate-900">Your Achievements</h3>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {achievements.map((achievement, idx) => (
          <div
            key={idx}
            className={`glass-card p-4 text-center border ${colorMap[achievement.color]} hover:shadow-lg transition-smooth animate-scale-in`}
            style={{ animationDelay: `${idx * 0.05}s` }}
          >
            <div className="text-3xl mb-2 animate-float" style={{ animationDelay: `${idx * 0.1}s` }}>
              {achievement.icon}
            </div>
            <p className="text-xs font-semibold">{achievement.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AchievementBadges;
