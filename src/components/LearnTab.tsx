import React, { useState } from 'react';
import { 
  Play, Award, Heart, Flame, Shield, CheckCircle2, XCircle, Sparkles, AlertCircle, ShoppingBag, ArrowRight, RotateCcw
} from 'lucide-react';
import { Exercise, ProgrammingLanguage, UserStats, ExerciseType } from '../types';
import { INITIAL_EXERCISES } from '../data';

interface LearnTabProps {
  stats: UserStats;
  updateStats: (newStats: Partial<UserStats>) => void;
  lang: 'pt' | 'en';
  triggerNotification: (text: string, title?: string) => void;
}

export default function LearnTab({ stats, updateStats, lang, triggerNotification }: LearnTabProps) {
  const [selectedLang, setSelectedLang] = useState<ProgrammingLanguage>(ProgrammingLanguage.HTML);
  const [activeExerciseIdx, setActiveExerciseIdx] = useState<number>(-1);
  const [exercisesList, setExercisesList] = useState<Exercise[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [orderedAnswer, setOrderedAnswer] = useState<string[]>([]);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showShop, setShowShop] = useState(false);

  const t = {
    pt: {
      selectTrack: 'Escolha sua Trilha de Estudos',
      startLesson: 'Começar Exercício',
      locked: 'Bloqueado',
      completed: 'Concluído',
      hearts: 'Vidas',
      gold: 'Moedas',
      level: 'Nível',
      noHeartsTitle: 'Sem Vidas Restantes!',
      noHeartsDesc: 'Recarregue 5 vidas por 150 moedas de ouro para continuar estudando.',
      buyHearts: 'Comprar Recarga de Vidas (150 Moedas)',
      close: 'Fechar',
      congrats: 'Excelente Trabalho!',
      explanation: 'Explicação:',
      next: 'Continuar',
      check: 'Verificar Resposta',
      fillBlankPlaceholder: 'Digite sua resposta aqui...',
      orderInstructions: 'Clique nos blocos para estruturar o código na ordem correspondente:',
      xpEarned: 'ganhou',
      correctToastTitle: 'Resposta Correta!',
      wrongToastTitle: 'Ops! Resposta incorreta',
      levelHeader: 'Nível de Dificuldade',
      streakBonus: 'Bônus de Ofensiva!'
    },
    en: {
      selectTrack: 'Choose your Learning Track',
      startLesson: 'Start Exercise',
      locked: 'Locked',
      completed: 'Completed',
      hearts: 'Hearts',
      gold: 'Gold Coins',
      level: 'Level',
      noHeartsTitle: 'No Hearts Left!',
      noHeartsDesc: 'Refill 5 hearts for 150 gold coins to continue your coding journey.',
      buyHearts: 'Buy Hearts Refill (150 Gold)',
      close: 'Close',
      congrats: 'Excellent Work!',
      explanation: 'Explanation:',
      next: 'Continue',
      check: 'Check Answer',
      fillBlankPlaceholder: 'Type your answer here...',
      orderInstructions: 'Click on blocks to structure the code in the correct order:',
      xpEarned: 'earned',
      correctToastTitle: 'Correct Answer!',
      wrongToastTitle: 'Oops! Wrong answer',
      levelHeader: 'Difficulty level',
      streakBonus: 'Streak Bonus!'
    }
  }[lang];

  // Group exercises by level for current language
  const currentExercises = INITIAL_EXERCISES.filter(ex => ex.language === selectedLang);
  const maxLevelUnlocked = Math.min(5, Math.floor(stats.completedExerciseIds.filter(id => {
    const ex = INITIAL_EXERCISES.find(e => e.id === id);
    return ex && ex.language === selectedLang;
  }).length + 1));

  const startLesson = (levelNum: number) => {
    if (stats.hearts <= 0) {
      setShowShop(true);
      return;
    }
    const filtered = currentExercises.filter(ex => ex.level === levelNum);
    if (filtered.length > 0) {
      setExercisesList(filtered);
      setActiveExerciseIdx(0);
      setSelectedAnswer('');
      setOrderedAnswer([]);
      setIsAnswerChecked(false);
      setIsCorrect(false);
    } else {
      triggerNotification(
        lang === 'pt' ? 'Nenhum exercício encontrado para este nível.' : 'No exercises found for this level.',
        'Info'
      );
    }
  };

  const handleOrderOptionClick = (option: string) => {
    if (isAnswerChecked) return;
    if (orderedAnswer.includes(option)) {
      setOrderedAnswer(orderedAnswer.filter(item => item !== option));
    } else {
      setOrderedAnswer([...orderedAnswer, option]);
    }
  };

  const checkAnswer = () => {
    const currentEx = exercisesList[activeExerciseIdx];
    let isAnsCorrect = false;

    if (currentEx.type === ExerciseType.ORDER_CODE) {
      const formattedAns = orderedAnswer.join(',');
      isAnsCorrect = formattedAns === currentEx.correctAnswer;
    } else {
      isAnsCorrect = selectedAnswer.trim().toLowerCase() === currentEx.correctAnswer.trim().toLowerCase();
    }

    setIsCorrect(isAnsCorrect);
    setIsAnswerChecked(true);

    if (isAnsCorrect) {
      // Reward user with XP and Gold
      const bonusStreak = stats.streak >= 3 ? 5 : 0;
      const finalXp = currentEx.xpReward + bonusStreak;
      const finalGold = Math.floor(currentEx.xpReward / 2);

      const updatedCompleted = Array.from(new Set([...stats.completedExerciseIds, currentEx.id]));
      
      // Update statistics history
      const todayString = new Date().toISOString().split('T')[0];
      const updatedHistory = { ...stats.history };
      updatedHistory[todayString] = (updatedHistory[todayString] || 0) + 3; // add 3 minutes of practice

      // Level check calculation
      const currentTotalXp = stats.xp + finalXp;
      const calculatedLevel = Math.max(stats.level, Math.floor(currentTotalXp / 100) + 1);

      updateStats({
        xp: currentTotalXp,
        gold: stats.gold + finalGold,
        completedExerciseIds: updatedCompleted,
        history: updatedHistory,
        level: calculatedLevel
      });

      triggerNotification(
        `+${finalXp} XP, +${finalGold} ${t.gold}! ${bonusStreak ? `(${t.streakBonus})` : ''}`,
        t.correctToastTitle
      );
    } else {
      // Deplete standard Heart
      const newHearts = Math.max(0, stats.hearts - 1);
      updateStats({ hearts: newHearts });
      triggerNotification(
        lang === 'pt' ? 'Você perdeu 1 vida! Estude a explicação abaixo.' : 'You lost 1 heart! Check the explanation below.',
        t.wrongToastTitle
      );
    }
  };

  const nextExercise = () => {
    if (activeExerciseIdx < exercisesList.length - 1) {
      setActiveExerciseIdx(activeExerciseIdx + 1);
      setSelectedAnswer('');
      setOrderedAnswer([]);
      setIsAnswerChecked(false);
      setIsCorrect(false);
    } else {
      // Completed current module
      setActiveExerciseIdx(-1);
      setExercisesList([]);
      triggerNotification(
        lang === 'pt' ? 'Parabéns por completar este nível de estudos!' : 'Congratulations on finishing this study module!',
        t.congrats
      );
    }
  };

  const buyHearts = () => {
    if (stats.gold >= 150) {
      updateStats({
        gold: stats.gold - 150,
        hearts: 5
      });
      setShowShop(false);
      triggerNotification(
        lang === 'pt' ? 'Vidas recarregadas com sucesso!' : 'Hearts refilled successfully!',
        'Shop'
      );
    } else {
      triggerNotification(
        lang === 'pt' ? 'Moedas de ouro insuficientes!' : 'Inadequate coins!',
        'Shop Error'
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Track Selection Bar */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-serif italic text-zinc-900 dark:text-zinc-50 mb-4">{t.selectTrack}</h2>
        <div className="grid grid-cols-3 gap-3">
          {[ProgrammingLanguage.HTML, ProgrammingLanguage.JAVASCRIPT, ProgrammingLanguage.PYTHON].map((langKey) => {
            const isSelected = selectedLang === langKey;
            const completedCount = stats.completedExerciseIds.filter(id => {
              const ex = INITIAL_EXERCISES.find(e => e.id === id);
              return ex && ex.language === langKey;
            }).length;
            const totalCount = INITIAL_EXERCISES.filter(ex => ex.language === langKey).length;
            const percent = Math.floor((completedCount / (totalCount || 1)) * 100);

            return (
              <button
                key={langKey}
                onClick={() => setSelectedLang(langKey)}
                id={`track-${langKey.toLowerCase()}`}
                className={`flex flex-col items-center justify-between p-4 rounded-xl border text-left transition-all relative ${
                  isSelected 
                    ? 'border-cyan-500 bg-cyan-500/10 dark:bg-cyan-950/25 text-cyan-900 dark:text-cyan-400 ring-2 ring-cyan-500/20' 
                    : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 hover:bg-zinc-100 dark:hover:bg-zinc-850 text-zinc-700 dark:text-zinc-300'
                }`}
              >
                <div className="w-full flex items-center justify-between mb-2">
                  <span className="font-semibold text-sm mr-2">{langKey}</span>
                  <span className="text-[10px] bg-zinc-200 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-600 dark:text-zinc-400">
                    {completedCount}/{totalCount}
                  </span>
                </div>
                {/* Micro Progress slider */}
                <div className="w-full h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-cyan-500 rounded-full transition-all duration-500" 
                    style={{ width: `${percent}%` }}
                  />
                </div>
                {isSelected && (
                  <span className="absolute -top-1.5 -right-1.5 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* active quiz section */}
      {activeExerciseIdx !== -1 && exercisesList.length > 0 ? (
        <div id="exercise-board" className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-md transition-all animate-fade-in relative overflow-hidden">
          {/* Header information */}
          <div className="flex items-center justify-between mb-4 border-b border-zinc-100 dark:border-zinc-800 pb-4">
            <div className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-emerald-500" />
              <span className="font-bold text-zinc-900 dark:text-zinc-100">
                {selectedLang} • {t.level} {exercisesList[activeExerciseIdx].level}
              </span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <div className="flex items-center text-rose-500 font-semibold">
                <Heart className="w-4 h-4 fill-current mr-1" />
                {stats.hearts}
              </div>
              <div className="bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-full text-xs text-zinc-600 dark:text-zinc-400">
                Quest {activeExerciseIdx + 1} / {exercisesList.length}
              </div>
            </div>
          </div>

          {/* Question Text */}
          <div className="my-6">
            <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-widest mb-1">{exercisesList[activeExerciseIdx].title}</h3>
            <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">{exercisesList[activeExerciseIdx].question}</p>
          </div>

          {/* Exercise Elements based on Type */}
          <div className="space-y-3 my-6">
            {/* MULTIPLE CHOICE / CODE SELECT */}
            {(exercisesList[activeExerciseIdx].type === ExerciseType.MULTIPLE_CHOICE || 
              exercisesList[activeExerciseIdx].type === ExerciseType.CODE_SELECT) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {exercisesList[activeExerciseIdx].options.map((option) => {
                  const isChosen = selectedAnswer === option;
                  return (
                    <button
                      key={option}
                      disabled={isAnswerChecked}
                      id={`option-${option.replace(/[^a-zA-Z0-9]/g, '_')}`}
                      onClick={() => setSelectedAnswer(option)}
                      className={`p-4 rounded-xl border text-left font-mono text-sm transition-all relative ${
                        isChosen
                          ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-900 dark:text-indigo-100 ring-2 ring-indigo-500/20'
                          : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200'
                      }`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            )}

            {/* FILL IN THE BLANKS */}
            {exercisesList[activeExerciseIdx].type === ExerciseType.FILL_IN_BLANKS && (
              <div className="relative">
                <input
                  type="text"
                  disabled={isAnswerChecked}
                  id="blank-input"
                  value={selectedAnswer}
                  onChange={(e) => setSelectedAnswer(e.target.value)}
                  placeholder={t.fillBlankPlaceholder}
                  className="w-full p-4 font-mono text-sm border rounded-xl border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-950 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
              </div>
            )}

            {/* ORDER CODE / SEGMENT GAME */}
            {exercisesList[activeExerciseIdx].type === ExerciseType.ORDER_CODE && (
              <div className="space-y-4">
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-2">{t.orderInstructions}</p>
                {/* Active assembled array visualizer */}
                <div className="min-h-[50px] p-3 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50/50 dark:bg-zinc-950/20 flex flex-wrap gap-2 items-center">
                  {orderedAnswer.length === 0 ? (
                    <span className="text-xs text-zinc-400 italic">...</span>
                  ) : (
                    orderedAnswer.map((part, i) => (
                      <span key={i} className="px-3 py-1.5 font-mono text-xs bg-indigo-500 text-white rounded-lg shadow-sm">
                        {part}
                      </span>
                    ))
                  )}
                </div>

                {/* Available options picker */}
                <div className="flex flex-wrap gap-2">
                  {exercisesList[activeExerciseIdx].options.map((option) => {
                    const isPicked = orderedAnswer.includes(option);
                    return (
                      <button
                        key={option}
                        disabled={isAnswerChecked}
                        onClick={() => handleOrderOptionClick(option)}
                        className={`px-3 py-2 font-mono text-xs border rounded-lg transition-all ${
                          isPicked
                            ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400 opacity-60 border-transparentLine'
                            : 'bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                        }`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Action Footer block */}
          <div className="border-t border-zinc-100 dark:border-zinc-800 pt-4 mt-6">
            {!isAnswerChecked ? (
              <button
                onClick={checkAnswer}
                disabled={
                  exercisesList[activeExerciseIdx].type === ExerciseType.ORDER_CODE 
                    ? orderedAnswer.length === 0 
                    : !selectedAnswer.trim()
                }
                id="btn-check-answer"
                className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-sm"
              >
                {t.check}
              </button>
            ) : (
              <div className="space-y-4 animate-fade-in">
                {/* Explanation text */}
                <div className={`p-4 rounded-xl flex items-start space-x-3 ${
                  isCorrect 
                    ? 'bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100' 
                    : 'bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900 text-rose-900 dark:text-rose-100'
                }`}>
                  {isCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-500 mt-0.5 shrink-0" />
                  )}
                  <div className="text-sm">
                    <p className="font-bold underline mb-1">{t.explanation}</p>
                    <p>{exercisesList[activeExerciseIdx].explanation}</p>
                  </div>
                </div>

                <button
                  onClick={nextExercise}
                  id="btn-next-exercise"
                  className="w-full flex items-center justify-center bg-zinc-900 hover:bg-zinc-850 dark:bg-zinc-100 dark:hover:bg-zinc-50 text-white dark:text-zinc-950 font-semibold py-3 px-4 rounded-xl transition-all shadow-sm"
                >
                  <span>{t.next}</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Levels list visual tree */
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-serif italic text-zinc-900 dark:text-zinc-50">
              {lang === 'pt' ? 'Módulos da Trilha' : 'Track Lessons Progress'}
            </h3>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 italic">
              {lang === 'pt' ? 'Complete cada nível sucessivamente para desbloquear' : 'Complete other levels to unlock next'}
            </span>
          </div>

          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((lvl) => {
              const exhibits = currentExercises.filter(ex => ex.level === lvl);
              const isUnlocked = lvl <= maxLevelUnlocked;
              const completedCountByLevel = exhibits.filter(ex => stats.completedExerciseIds.includes(ex.id)).length;
              const isLevelDone = exhibits.length > 0 && completedCountByLevel === exhibits.length;

              if (exhibits.length === 0) return null; // skip if no exercises inside this level

              return (
                <div 
                  key={lvl} 
                  className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                    isUnlocked 
                      ? isLevelDone
                        ? 'border-emerald-300 bg-emerald-50/20 dark:border-emerald-800/40' 
                        : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-indigo-300 dark:hover:border-indigo-800'
                      : 'border-zinc-100 dark:border-zinc-900 bg-zinc-100/55 dark:bg-zinc-950/40 opacity-60'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-xl ${
                      isUnlocked 
                        ? isLevelDone 
                          ? 'bg-emerald-500 text-white' 
                          : 'bg-indigo-500 text-white'
                        : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400'
                    }`}>
                      <Award className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-zinc-900 dark:text-zinc-50 flex items-center">
                        <span>{t.level} {lvl}</span>
                        {isLevelDone && (
                          <span className="ml-2 text-[10px] bg-emerald-500 text-white px-1.5 py-0.5 rounded-full font-bold">
                            {t.completed}
                          </span>
                        )}
                      </h4>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        {completedCountByLevel} / {exhibits.length} {lang === 'pt' ? 'exercícios completos' : 'exercises done'}
                      </p>
                    </div>
                  </div>

                  {isUnlocked ? (
                    <button
                      onClick={() => startLesson(lvl)}
                      id={`level-btn-${lvl}`}
                      className={`flex items-center space-x-2 py-2 px-4 rounded-lg font-semibold text-xs transition-all ${
                        isLevelDone
                          ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                          : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                      }`}
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{t.startLesson}</span>
                    </button>
                  ) : (
                    <div className="flex items-center space-x-1.5 text-xs text-zinc-400">
                      <Shield className="w-3.5 h-3.5" />
                      <span>{t.locked}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Lives Store Shop overlay */}
      {showShop && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 max-w-sm w-full rounded-2xl p-6 shadow-2xl relative">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-3 bg-rose-50 dark:bg-rose-950/20 rounded-full">
                <ShoppingBag className="w-12 h-12 text-rose-500" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">{t.noHeartsTitle}</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">{t.noHeartsDesc}</p>
              
              <div className="flex items-center justify-center bg-zinc-50 dark:bg-zinc-800 px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 w-full mb-2">
                <Sparkles className="w-4 h-4 text-amber-500 mr-2" />
                <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                  {lang === 'pt' ? 'Ouro Disponível:' : 'Available Gold:'} {stats.gold}
                </span>
              </div>

              <button
                onClick={buyHearts}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 px-4 rounded-xl transition-all"
              >
                {t.buyHearts}
              </button>
              
              <button
                onClick={() => setShowShop(false)}
                className="w-full text-zinc-500 dark:text-zinc-400 text-xs font-semibold hover:underline"
              >
                {t.close}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
