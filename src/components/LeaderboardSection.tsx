import React, { useState } from 'react';
import { 
  Trophy, Award, ChevronUp, Zap, Flame, User, Skull, Star
} from 'lucide-react';
import { LeaderboardUser, UserStats } from '../types';
import { INITIAL_LEADERBOARD } from '../data';

interface LeaderboardSectionProps {
  stats: UserStats;
  lang: 'pt' | 'en';
}

export default function LeaderboardSection({ stats, lang }: LeaderboardSectionProps) {
  const [boardType, setBoardType] = useState<'geral' | 'mensal'>('geral');

  const t = {
    pt: {
      leaderTitle: 'Tabela de Classificação DevLingo',
      leaderSubtitle: 'Dispute as primeiras posições da Liga Diamante faturando XP de lições e duelos rápidos!',
      overall: 'Geral (Acumulado)',
      monthly: 'Mensal (Ofensiva)',
      you: 'VOCÊ',
      level: 'nível'
    },
    en: {
      leaderTitle: 'DevLingo Competitive Standings',
      leaderSubtitle: 'Fight for top spots in the Diamond League by accumulating XP from exercises and duels!',
      overall: 'Overall (Cumulative)',
      monthly: 'Monthly Standings',
      you: 'YOU',
      level: 'level'
    }
  }[lang];

  // Append user stats into the scoreboard lists dynamically
  const userRow: LeaderboardUser = {
    uid: stats.uid,
    displayName: `${stats.displayName} (${t.you})`,
    avatarUrl: stats.avatarUrl,
    level: stats.level,
    xp: stats.xp,
    gold: stats.gold,
    streak: stats.streak,
    monthlyXp: Math.floor(stats.xp * 0.75) // simulated monthly XP
  };

  const fullListList = [userRow, ...INITIAL_LEADERBOARD];

  // Sort list based on board type
  const sortedList = [...fullListList].sort((a, b) => {
    if (boardType === 'geral') {
      return b.xp - a.xp;
    } else {
      return b.monthlyXp - a.monthlyXp;
    }
  });

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-6">
      <div>
        <div className="flex items-center space-x-2.5">
          <Trophy className="w-6 h-6 text-cyan-400 animate-bounce" />
          <h3 className="text-lg font-serif italic text-zinc-900 dark:text-zinc-50">{t.leaderTitle}</h3>
        </div>
        <p className="text-xs text-zinc-400 mt-1">{t.leaderSubtitle}</p>
      </div>

      {/* Standings Category Selector Toggles */}
      <div className="grid grid-cols-2 gap-2 bg-zinc-50 dark:bg-zinc-950 p-1 rounded-xl border border-zinc-200 dark:border-zinc-800">
        <button
          onClick={() => setBoardType('geral')}
          id="btn-board-geral"
          className={`py-2 px-3 text-xs font-bold rounded-lg transition-all ${
            boardType === 'geral'
              ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 shadow-xs'
              : 'text-zinc-400 hover:text-zinc-700'
          }`}
        >
          {t.overall}
        </button>
        <button
          onClick={() => setBoardType('mensal')}
          id="btn-board-mensal"
          className={`py-2 px-3 text-xs font-bold rounded-lg transition-all ${
            boardType === 'mensal'
              ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 shadow-xs'
              : 'text-zinc-400 hover:text-zinc-700'
          }`}
        >
          {t.monthly}
        </button>
      </div>

      {/* Ranking List Table */}
      <div className="space-y-2">
        {sortedList.map((user, idx) => {
          const isMe = user.uid === stats.uid;
          const displayRank = idx + 1;
          const score = boardType === 'geral' ? user.xp : user.monthlyXp;

          return (
            <div
              key={user.uid}
              className={`p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                isMe
                  ? 'border-cyan-500 bg-cyan-500/5 dark:bg-cyan-500/10 ring-1 ring-cyan-500/30'
                  : 'border-zinc-150 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/60'
              }`}
            >
              {/* Placement + User identity details */}
              <div className="flex items-center space-x-3.5">
                {/* Ranking placement visual pill */}
                <div className="flex items-center justify-center w-6 text-center">
                  {displayRank === 1 ? (
                    <Trophy className="w-5 h-5 text-amber-500 fill-current" />
                  ) : displayRank === 2 ? (
                    <Star className="w-5 h-5 text-zinc-400 fill-current animate-pulse" />
                  ) : displayRank === 3 ? (
                    <Award className="w-5 h-5 text-amber-700" />
                  ) : (
                    <span className="font-mono text-xs text-zinc-400 font-bold">#{displayRank}</span>
                  )}
                </div>

                <img 
                  src={user.avatarUrl} 
                  alt={user.displayName} 
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-full border border-zinc-200 object-cover bg-zinc-100" 
                />

                <div>
                  <h4 className={`text-xs font-bold ${isMe ? 'text-cyan-600 dark:text-cyan-400' : 'text-zinc-800 dark:text-zinc-200'}`}>
                    {user.displayName}
                  </h4>
                  <div className="flex items-center space-x-2 text-[10px] text-zinc-400 font-medium">
                    <span>{t.level} {user.level}</span>
                    <span>•</span>
                    <span className="flex items-center text-orange-500 font-extrabold font-mono">
                      <Flame className="w-3 h-3 mr-0.5 fill-current" />
                      {user.streak}d
                    </span>
                  </div>
                </div>
              </div>

              {/* Score output */}
              <div className="text-right">
                <span className="text-xs font-black text-zinc-900 dark:text-zinc-50 font-mono">
                  {score} XP
                </span>
                <p className="text-[8px] text-zinc-400 uppercase font-bold tracking-wider">
                  {boardType === 'geral' ? 'TOTAL' : 'MENSAL'}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
