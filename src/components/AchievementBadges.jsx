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
    blue: 'bg-blue-500/20 border-blue-400/40 text-blue-300',
    purple: 'bg-purple-500/20 border-purple-400/40 text-purple-300',
    indigo: 'bg-indigo-500/20 border-indigo-400/40 text-indigo-300',
    green: 'bg-green-500/20 border-green-400/40 text-green-300',
    yellow: 'bg-yellow-500/20 border-yellow-400/40 text-yellow-300',
    orange: 'bg-orange-500/20 border-orange-400/40 text-orange-300',
    teal: 'bg-teal-500/20 border-teal-400/40 text-teal-300',
  };

  if (achievements.length === 0) return null;

  return (
    <div className="glass-card-lg p-8 hover-glow transition-smooth-lg mb-8">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl">🏆</span>
        <h3 className="text-2xl font-bold text-white">Your Achievements</h3>
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
