import React, { useState, useEffect } from 'react';
import { 
  Zap, Shield, Sword, Award, Check, X, Users, Trophy, Play, Skull, Heart, Clock
} from 'lucide-react';
import { ProgrammingLanguage, UserStats, DuelChallenge, Exercise } from '../types';
import { INITIAL_EXERCISES, INITIAL_LEADERBOARD } from '../data';

interface DuelsTabProps {
  stats: UserStats;
  updateStats: (newStats: Partial<UserStats>) => void;
  lang: 'pt' | 'en';
  triggerNotification: (text: string, title?: string) => void;
}

export default function DuelsTab({ stats, updateStats, lang, triggerNotification }: DuelsTabProps) {
  const [activeDuel, setActiveDuel] = useState<boolean>(false);
  const [selectedLang, setSelectedLang] = useState<ProgrammingLanguage>(ProgrammingLanguage.HTML);
  const [duelQuestions, setDuelQuestions] = useState<Exercise[]>([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [timeRemaining, setTimeRemaining] = useState<number>(15);
  const [opponentName, setOpponentName] = useState<string>('');
  const [opponentAvatar, setOpponentAvatar] = useState<string>('');
  const [opponentScore, setOpponentScore] = useState<number>(0);
  const [userScore, setUserScore] = useState<number>(0);
  const [duelEnded, setDuelEnded] = useState<boolean>(false);
  const [duelLog, setDuelLog] = useState<string[]>([]);

  const t = {
    pt: {
      title: 'Arena de Desafios Rápidos',
      subtitle: 'Enfrente amigos ou bots programadores em duelos cronometrados de 15 segundos!',
      ready: 'Iniciar Busca de Oponente',
      searching: 'Buscando oponente compatível...',
      matchFound: 'Confronto Encontrado!',
      score: 'Sua Pontuação',
      opponentScore: 'Pontuação do Oponente',
      secLeft: 'segundos restantes',
      next: 'Próxima Questão',
      finish: 'Concluir Duelo',
      victory: 'Vitória de Lavada!',
      defeat: 'Derrota Dolorosa!',
      draw: 'Empate Técnico!',
      backToLobby: 'Voltar para o Lobby',
      xpReward: 'Ganhou +30 XP de duelista!',
      goldReward: 'Ganhou +20 de Ouro!',
      duelAction: 'Ação do Duelo',
      matchSummary: 'Painel de Desempenho do Duelo',
      recentWinner: 'Mestre da Arena'
    },
    en: {
      title: 'Rapid Duel Arena',
      subtitle: 'Duel against friends or programmer bots in timed 15-second matches!',
      ready: 'Matchmaker',
      searching: 'Finding matching opponent...',
      matchFound: 'Match Found!',
      score: 'Your Score',
      opponentScore: 'Opponent Score',
      secLeft: 'seconds left',
      next: 'Next Question',
      finish: 'Finish Duel',
      victory: 'Crushing Victory!',
      defeat: 'Painful Defeat!',
      draw: 'Technical Draw!',
      backToLobby: 'Back to Lobby',
      xpReward: 'Earned +30 duelist XP!',
      goldReward: 'Earned +20 Gold!',
      duelAction: 'Arena Logs',
      matchSummary: 'Arena Battle Report',
      recentWinner: 'Arena Master'
    }
  }[lang];

  // Opponents picker list
  const OPPONENTS = INITIAL_LEADERBOARD.map(u => ({
    name: u.displayName,
    avatar: u.avatarUrl
  }));

  // Matchmaker simulator
  const [isSearching, setIsSearching] = useState(false);

  const startMatchmaking = () => {
    setIsSearching(true);
    setTimeout(() => {
      const luckyOpponent = OPPONENTS[Math.floor(Math.random() * OPPONENTS.length)];
      setOpponentName(luckyOpponent.name);
      setOpponentAvatar(luckyOpponent.avatar);
      
      // Select 3 random exercises for the current language
      const exercises = INITIAL_EXERCISES.filter(ex => ex.language === selectedLang);
      const shuffled = [...exercises].sort(() => 0.5 - Math.random()).slice(0, 3);
      
      setDuelQuestions(shuffled);
      setCurrentQuestionIdx(0);
      setUserScore(0);
      setOpponentScore(0);
      setActiveDuel(true);
      setIsSearching(false);
      setDuelEnded(false);
      setTimeRemaining(15);
      setSelectedAnswer('');
      setDuelLog([`O duelo de ${selectedLang} contra ${luckyOpponent.name} começou!`]);
    }, 1800);
  };

  // Timer run loop
  useEffect(() => {
    if (!activeDuel || duelEnded) return;

    if (timeRemaining <= 0) {
      handleNext(true); // time-out treated as incorrect
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, activeDuel, duelEnded]);

  const handleNext = (isTimeout = false) => {
    const currentQ = duelQuestions[currentQuestionIdx];
    let isUserCorrect = false;

    if (!isTimeout) {
      isUserCorrect = selectedAnswer.trim().toLowerCase() === currentQ.correctAnswer.trim().toLowerCase();
    }

    // Bot random logic: 60% chance of answering correctly
    const isOpponentCorrect = Math.random() < 0.65;

    // Log messages
    const logBatch: string[] = [];
    if (isUserCorrect) {
      logBatch.push(`Você respondeu corretamente a questão "${currentQ.title}"! [+1 Ponto]`);
    } else if (isTimeout) {
      logBatch.push(`Seu tempo acabou na questão "${currentQ.title}"!`);
    } else {
      logBatch.push(`Você errou a resposta para "${currentQ.title}".`);
    }

    if (isOpponentCorrect) {
      logBatch.push(`${opponentName} respondeu corretamente! [+1 Ponto]`);
    } else {
      logBatch.push(`${opponentName} errou a questão.`);
    }

    setDuelLog(prev => [...prev, ...logBatch]);

    // Update scores
    const finalUserScore = userScore + (isUserCorrect ? 1 : 0);
    const finalOpponentScore = opponentScore + (isOpponentCorrect ? 1 : 0);

    setUserScore(finalUserScore);
    setOpponentScore(finalOpponentScore);

    // Continue or complete duel
    if (currentQuestionIdx < duelQuestions.length - 1) {
      setCurrentQuestionIdx(currentQuestionIdx + 1);
      setSelectedAnswer('');
      setTimeRemaining(15);
    } else {
      // End duel
      setDuelEnded(true);
      
      // Determine final result & payout
      const userWon = finalUserScore > finalOpponentScore;
      const isDraw = finalUserScore === finalOpponentScore;
      
      if (userWon) {
        updateStats({
          xp: stats.xp + 40,
          gold: stats.gold + 25
        });
        triggerNotification(
          lang === 'pt' ? 'Você venceu o duelo de programação e faturou +40 XP!' : 'You won the coding duel and earned +40 XP!',
          'Duelo Concluído'
        );
      } else if (isDraw) {
        updateStats({
          xp: stats.xp + 15,
          gold: stats.gold + 10
        });
        triggerNotification(
          lang === 'pt' ? 'Empate! Ganhos reduzidos distribuídos.' : 'Tie! Balanced rewards distributed.',
          'Duelo Concluído'
        );
      } else {
        triggerNotification(
          lang === 'pt' ? 'Derrota! Não desanime e revise seus conhecimentos!' : 'Defeat! Study hard and try once again!',
          'Duelo Concluído'
        );
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Description */}
      {!activeDuel ? (
        <div className="bg-gradient-to-tr from-indigo-550 to-purple-650 rounded-2xl p-6 text-white shadow-lg space-y-4">
          <div className="flex items-center space-x-3">
            <Sword className="w-8 h-8 text-amber-300 animate-pulse" />
            <h2 className="text-2xl font-black tracking-tight">{t.title}</h2>
          </div>
          <p className="text-indigo-100 text-sm max-w-xl">{t.subtitle}</p>

          <div className="border-t border-indigo-500/35 pt-4">
            <label className="block text-xs font-semibold uppercase tracking-wider text-indigo-200 mb-2">
              {lang === 'pt' ? 'Selecione a Linguagem do Duelo' : 'Choose Duel Track'}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[ProgrammingLanguage.HTML, ProgrammingLanguage.JAVASCRIPT, ProgrammingLanguage.PYTHON].map((pLang) => (
                <button
                  key={pLang}
                  onClick={() => setSelectedLang(pLang)}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                    selectedLang === pLang
                      ? 'border-white bg-white text-indigo-950 ring-2 ring-white/20'
                      : 'border-indigo-400/50 bg-indigo-900/30 text-indigo-100 hover:bg-indigo-900/40'
                  }`}
                >
                  {pLang}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2">
            {!isSearching ? (
              <button
                onClick={startMatchmaking}
                id="btn-start-duel"
                className="w-full bg-amber-400 hover:bg-amber-300 text-indigo-950 font-extrabold py-3.5 px-6 rounded-xl flex items-center justify-center space-x-2 transition-all shadow-md text-sm uppercase tracking-wide"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>{t.ready}</span>
              </button>
            ) : (
              <div className="w-full bg-indigo-900/40 border border-indigo-400/30 py-3.5 rounded-xl flex items-center justify-center space-x-3">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span className="text-xs font-semibold text-indigo-100">{t.searching}</span>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* DUEL ACTIVE ARENA */
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
          
          {/* Duel Scoreboard Screen Header */}
          <div className="grid grid-cols-3 gap-4 pb-6 border-b border-zinc-100 dark:border-zinc-800">
            {/* Player */}
            <div className="flex flex-col items-center justify-center space-y-1">
              <div className="relative">
                <img 
                  src={stats.avatarUrl} 
                  alt={stats.displayName} 
                  className="w-12 h-12 rounded-full border-2 border-indigo-500 bg-zinc-200"
                />
                <span className="absolute -bottom-1 -right-1 bg-indigo-550 text-white rounded-full px-1 py-0.5 text-[8px] font-bold">
                  {stats.level}
                </span>
              </div>
              <p className="text-xs font-semibold text-zinc-950 dark:text-zinc-50 truncate max-w-[90px]">{stats.displayName}</p>
              <div className="text-xl font-bold text-indigo-600 dark:text-indigo-400 font-mono">
                {userScore} pts
              </div>
            </div>

            {/* Timer visual circle / versus */}
            <div className="flex flex-col items-center justify-center space-y-1">
              <div className="w-10 h-10 rounded-full bg-zinc-50 dark:bg-zinc-850 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center relative">
                <Clock className="w-4 h-4 text-amber-500 animate-spin" />
              </div>
              <span className={`text-sm font-extrabold font-mono ${timeRemaining <= 5 ? 'text-red-500 animate-pulse' : 'text-zinc-700 dark:text-zinc-300'}`}>
                {timeRemaining}s
              </span>
              <span className="text-[10px] bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-full font-bold">
                {selectedLang}
              </span>
            </div>

            {/* Rival opponent */}
            <div className="flex flex-col items-center justify-center space-y-1">
              <div className="relative">
                <img 
                  src={opponentAvatar} 
                  alt={opponentName} 
                  className="w-12 h-12 rounded-full border-2 border-rose-500 bg-zinc-200"
                />
                <span className="absolute -bottom-1 -right-1 bg-rose-550 text-white rounded-full px-1 py-0.5 text-[8px] font-bold">
                  BOT
                </span>
              </div>
              <p className="text-xs font-semibold text-rose-550 truncate max-w-[90px]">{opponentName}</p>
              <div className="text-xl font-bold text-rose-550 font-mono">
                {opponentScore} pts
              </div>
            </div>
          </div>

          {!duelEnded ? (
            /* ACTIVE QUESTION VIEW */
            <div className="py-6 space-y-6">
              <div>
                <h4 className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                  Questão {currentQuestionIdx + 1} de {duelQuestions.length}
                </h4>
                <p className="text-base font-bold text-zinc-850 dark:text-zinc-50 mt-1">
                  {duelQuestions[currentQuestionIdx]?.question}
                </p>
              </div>

              {/* Options array list */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {duelQuestions[currentQuestionIdx]?.options.map((opt) => {
                  const isPref = selectedAnswer === opt;
                  return (
                    <button
                      key={opt}
                      onClick={() => setSelectedAnswer(opt)}
                      id={`duel-option-${opt.replace(/[^a-zA-Z0-9]/g, '_')}`}
                      className={`p-3 text-left font-mono text-xs rounded-xl border transition-all ${
                        isPref
                          ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-900 dark:text-indigo-100 ring-2'
                          : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 hover:bg-zinc-100 dark:hover:bg-zinc-850 text-zinc-800 dark:text-zinc-300'
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  onClick={() => handleNext(false)}
                  disabled={!selectedAnswer}
                  id="btn-duel-submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold py-3 px-4 rounded-xl text-xs uppercase"
                >
                  Confirmar Resposta ({timeRemaining}s)
                </button>
              </div>
            </div>
          ) : (
            /* DUEL ENDED VIEW */
            <div className="py-6 space-y-6 animate-fade-in text-center">
              <div className="flex justify-center">
                <div className="p-4 rounded-full bg-amber-50 dark:bg-amber-950/20">
                  <Trophy className="w-16 h-16 text-amber-500 animate-bounce" />
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">
                  {userScore > opponentScore ? t.victory : userScore < opponentScore ? t.defeat : t.draw}
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">{t.matchSummary}</p>
              </div>

              {/* Reward stats summary */}
              <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
                <div className="p-3 bg-zinc-50 dark:bg-zinc-950/30 rounded-xl border border-zinc-200 dark:border-zinc-800">
                  <p className="text-xs text-zinc-400">{lang === 'pt' ? 'Seu Placar' : 'Your final'}</p>
                  <p className="text-xl font-bold text-zinc-800 dark:text-zinc-100 font-mono">{userScore}/{duelQuestions.length}</p>
                </div>
                <div className="p-3 bg-zinc-50 dark:bg-zinc-950/30 rounded-xl border border-zinc-200 dark:border-zinc-800">
                  <p className="text-xs text-zinc-400">{lang === 'pt' ? 'Oponente' : 'Opponent'}</p>
                  <p className="text-xl font-bold text-zinc-800 dark:text-zinc-100 font-mono">{opponentScore}/{duelQuestions.length}</p>
                </div>
              </div>

              {/* Arena logs */}
              <div className="p-4 bg-zinc-50 dark:bg-zinc-950/45 rounded-xl max-w-md mx-auto text-left border border-zinc-200 dark:border-zinc-800 font-mono text-[10px] space-y-1">
                <span className="font-bold text-zinc-400 uppercase">{t.duelAction}:</span>
                {duelLog.map((log, listId) => (
                  <p key={listId} className="text-zinc-650 dark:text-zinc-400 flex items-center">
                    <span className="text-emerald-500 mr-1.5">•</span>
                    {log}
                  </p>
                ))}
              </div>

              <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  onClick={() => setActiveDuel(false)}
                  id="btn-back-lobby"
                  className="bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-50 text-white dark:text-zinc-900 font-bold px-6 py-2.5 rounded-xl text-xs transition-all"
                >
                  {t.backToLobby}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
