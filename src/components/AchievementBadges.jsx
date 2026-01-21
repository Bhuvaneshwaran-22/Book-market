const AchievementBadges = ({ metrics }) => {
  const achievements = [];

  // Book Reused milestones
  if (metrics.total >= 1) achievements.push({ icon: '📚', label: 'Book Sharer', color: 'blue' });
  if (metrics.total >= 5) achievements.push({ icon: '🌟', label: 'Eco Champion', color: 'purple' });
  if (metrics.total >= 10) achievements.push({ icon: '👑', label: 'Reuse Legend', color: 'indigo' });
  if (metrics.total >= 25) achievements.push({ icon: '🚀', label: 'Sustainability Hero', color: 'emerald' });

  // Money Saved milestones
  if (metrics.moneySaved >= 5000) achievements.push({ icon: '💰', label: 'Saver', color: 'emerald' });
  if (metrics.moneySaved >= 25000) achievements.push({ icon: '💎', label: 'Money Master', color: 'amber' });

  // Paper Saved milestones
  if (metrics.paperSavedKg >= 20) achievements.push({ icon: '🌱', label: 'Green Guardian', color: 'emerald' });
  if (metrics.paperSavedKg >= 50) achievements.push({ icon: '🌍', label: 'Planet Protector', color: 'cyan' });

  // Recent activity streak
  if (metrics.total >= 7) achievements.push({ icon: '🔥', label: '7-Day Active', color: 'amber' });

  const colorMap = {
    blue: 'bg-blue-500/20 border-blue-500/30 text-blue-300',
    purple: 'bg-purple-500/20 border-purple-500/30 text-purple-300',
    indigo: 'bg-indigo-500/20 border-indigo-500/30 text-indigo-300',
    emerald: 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300',
    amber: 'bg-amber-500/20 border-amber-500/30 text-amber-300',
    cyan: 'bg-cyan-500/20 border-cyan-500/30 text-cyan-300',
  };

  if (achievements.length === 0) return null;

  return (
    <div className="glass-card-lg p-8 mb-8 text-slate-50">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl">🏆</span>
        <h3 className="text-2xl font-bold text-slate-50">Your Achievements</h3>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {achievements.map((achievement, idx) => (
          <div
            key={idx}
            className={`glass-card p-4 text-center border hover:border-opacity-100 transition-all animate-scale-in ${colorMap[achievement.color]}`}
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
