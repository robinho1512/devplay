import React, { useState } from 'react';
import { 
  BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { 
  BarChart2, Award, Flame, Zap, Calendar, Download, Target, Play, Heart, Clock, FileSpreadsheet, Printer
} from 'lucide-react';
import { UserStats } from '../types';

interface StatsTabProps {
  stats: UserStats;
  updateStats: (newStats: Partial<UserStats>) => void;
  lang: 'pt' | 'en';
  triggerNotification: (text: string, title?: string) => void;
}

export default function StatsTab({ stats, updateStats, lang, triggerNotification }: StatsTabProps) {
  const [xpGoal, setXpGoal] = useState<number>(stats.xpGoal || 50);
  const [minutesGoal, setMinutesGoal] = useState<number>(stats.minutesGoal || 15);

  const t = {
    pt: {
      statsTitle: 'Painel Analítico de Desempenho',
      subtitle: 'Monitore seus gráficos de tempo de estudo diários e ajuste suas metas.',
      xpProgress: 'Progresso da Meta de XP',
      minGoal: 'Tempo Estimado de Prática',
      dailyGoalSet: 'Configurar Metas Diárias',
      saveGoals: 'Salvar Novas Metas',
      exportReport: 'Exportar Relatório',
      exportCSV: 'Exportar para CSV',
      exportPDF: 'Imprimir Relatório (PDF)',
      toastGoalsSaved: 'Metas salvas com sucesso!',
      days: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
      weeklyTime: 'Tempo de Estudo Semanal (Minutos)',
      studyStreak: 'Ofensiva Ativa',
      goldBalance: 'Saldo de Ouro',
      conquistas: 'Conquistas Desbloqueadas',
      totalStudy: 'Tempo Total Estudado',
      apiIntegration: 'Métricas de Produtividade',
      currentGoals: 'Suas Metas Atuais',
      goldUnit: 'moedas',
      levelUnit: 'nível'
    },
    en: {
      statsTitle: 'Performance Analytics Dashboard',
      subtitle: 'Monitor your daily study hours charts and configure custom goals.',
      xpProgress: 'XP Milestone Progress',
      minGoal: 'Estimated Practice Time',
      dailyGoalSet: 'Configure Daily Milestones',
      saveGoals: 'Save Milestones',
      exportReport: 'Export Reports',
      exportCSV: 'Export as CSV',
      exportPDF: 'Print Report (PDF)',
      toastGoalsSaved: 'Success! Milestones saved.',
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      weeklyTime: 'Weekly Practice Volume (Minutes)',
      studyStreak: 'Active Fire Streak',
      goldBalance: 'Gold Coins Balance',
      conquistas: 'Unlocked Achievements',
      totalStudy: 'Cumulative Study Time',
      apiIntegration: 'Productivity Statistics',
      currentGoals: 'Current Milestones',
      goldUnit: 'coins',
      levelUnit: 'level'
    }
  }[lang];

  // Prepare standard last 7 days chart dataset
  const generateChartData = () => {
    const today = new Date();
    const dataList = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dayStr = d.toISOString().split('T')[0];
      const weekdayName = t.days[d.getDay() === 0 ? 6 : d.getDay() - 1];
      
      dataList.push({
        date: weekdayName,
        minutos: stats.history[dayStr] || 0,
        meta: minutesGoal
      });
    }
    return dataList;
  };

  const chartData = generateChartData();

  const handleSaveGoals = () => {
    updateStats({
      xpGoal,
      minutesGoal
    });
    triggerNotification(t.toastGoalsSaved, lang === 'pt' ? 'Sucesso' : 'Success');
  };

  // Perform a real CSV data exports
  const handleExportCSV = () => {
    const csvRows = [
      ['Data (Date)', 'Tempo Estudado (Minutes Studied)'],
      ...Object.entries(stats.history).map(([d, v]) => [d, v])
    ];
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + csvRows.map(e => e.join(",")).join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `devlingo_study_history_${stats.uid}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    triggerNotification(
      lang === 'pt' ? 'Arquivo CSV gerado e baixado com sucesso!' : 'CSV log exported and downloaded!',
      'Export'
    );
  };

  // Printable layout window trigger which is natively converted to PDF save option
  const handlePrintPDF = () => {
    window.print();
  };

  // Sum total studied time
  const totalMinutes = Object.values(stats.history).reduce((sum, current) => sum + current, 0);

  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Streak */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 rounded-2xl flex items-center space-x-3.5 shadow-xs">
          <div className="p-3 bg-orange-100 dark:bg-orange-950/20 rounded-xl text-orange-500">
            <Flame className="w-6 h-6 fill-current animate-pulse" />
          </div>
          <div>
            <p className="text-[10px] text-zinc-400 font-extrabold uppercase">{t.studyStreak}</p>
            <p className="text-lg font-black text-zinc-900 dark:text-zinc-50">{stats.streak} {lang === 'pt' ? 'dias' : 'days'}</p>
          </div>
        </div>

        {/* Level */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 rounded-2xl flex items-center space-x-3.5 shadow-xs">
          <div className="p-3 bg-indigo-100 dark:bg-indigo-950/20 rounded-xl text-indigo-500">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] text-zinc-400 font-extrabold uppercase">{lang === 'pt' ? 'Nível' : 'Level'}</p>
            <p className="text-lg font-black text-zinc-900 dark:text-zinc-50">{t.levelUnit} {stats.level}</p>
          </div>
        </div>

        {/* Gold */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 rounded-2xl flex items-center space-x-3.5 shadow-xs">
          <div className="p-3 bg-amber-100 dark:bg-amber-950/20 rounded-xl text-amber-500">
            <Zap className="w-6 h-6 fill-current" />
          </div>
          <div>
            <p className="text-[10px] text-zinc-400 font-extrabold uppercase">{t.goldBalance}</p>
            <p className="text-lg font-black text-zinc-900 dark:text-zinc-50">{stats.gold} {t.goldUnit}</p>
          </div>
        </div>

        {/* Total Time */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 rounded-2xl flex items-center space-x-3.5 shadow-xs">
          <div className="p-3 bg-emerald-100 dark:bg-emerald-950/20 rounded-xl text-emerald-500">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] text-zinc-400 font-extrabold uppercase">{t.totalStudy}</p>
            <p className="text-lg font-black text-zinc-900 dark:text-zinc-50">{totalMinutes} min</p>
          </div>
        </div>
      </div>

      {/* Main Chart Card */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 space-y-3 sm:space-y-0">
          <div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">{t.statsTitle}</h3>
            <p className="text-xs text-zinc-400 mt-1">{t.subtitle}</p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleExportCSV}
              id="btn-export-csv"
              className="flex items-center space-x-2 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-850 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 px-3.5 py-2 rounded-xl text-xs font-semibold select-none transition-all"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500" />
              <span>{t.exportCSV}</span>
            </button>

            <button
              onClick={handlePrintPDF}
              id="btn-print-pdf"
              className="flex items-center space-x-2 bg-indigo-650 hover:bg-indigo-600 text-white px-3.5 py-2 rounded-xl text-xs font-semibold select-none transition-all"
            >
              <Printer className="w-3.5 h-3.5 text-indigo-250" />
              <span>{t.exportPDF}</span>
            </button>
          </div>
        </div>

        {/* Recharts Container */}
        <div className="w-full h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorMinutos" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" className="dark:stroke-zinc-800" />
              <XAxis dataKey="date" stroke="#a1a1aa" fontSize={11} tickLine={false} />
              <YAxis stroke="#a1a1aa" fontSize={11} tickLine={false} />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '12px', 
                  backgroundColor: '#09090b', 
                  border: 'none', 
                  color: '#fff',
                  fontSize: '12px'
                }} 
              />
              <Area type="monotone" dataKey="minutos" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#colorMinutos)" />
              <Bar dataKey="meta" fill="#10b981" fillOpacity={0.15} stroke="#10b981" strokeDasharray="2 2" barSize={4} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <p className="text-[11px] text-zinc-400 italic text-center mt-3">
          {lang === 'pt' ? 'O gráfico compara minutos praticados diariamente (linha roxa) contra sua meta configurada (barras verdes).' : 'Chart displays practice minutes (purple line) against daily target milestones (dashed green bars).'}
        </p>
      </div>

      {/* Goal Config and Achievement Lists */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Goal Set */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center space-x-2.5">
            <Target className="w-5 h-5 text-indigo-500" />
            <h4 className="font-bold text-zinc-900 dark:text-zinc-50">{t.dailyGoalSet}</h4>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1">
                {lang === 'pt' ? 'Meta Diária de XP' : 'Daily target XP reward tracker'} ({xpGoal} XP)
              </label>
              <input 
                type="range" 
                min="10" 
                max="150" 
                step="5"
                value={xpGoal}
                onChange={(e) => setXpGoal(Number(e.target.value))}
                className="w-full h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full appearance-none cursor-pointer accent-indigo-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1">
                {lang === 'pt' ? 'Tempo de Estudo' : 'Practice duration standard'} ({minutesGoal} {lang === 'pt' ? 'minutos' : 'minutes'})
              </label>
              <input 
                type="range" 
                min="5" 
                max="60" 
                step="5"
                value={minutesGoal}
                onChange={(e) => setMinutesGoal(Number(e.target.value))}
                className="w-full h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full appearance-none cursor-pointer accent-emerald-500"
              />
            </div>

            <button
              onClick={handleSaveGoals}
              id="btn-save-meta"
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2.5 rounded-xl text-xs transition-all"
            >
              {t.saveGoals}
            </button>
          </div>
        </div>

        {/* Achievements list overview */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <Award className="w-5 h-5 text-indigo-500 animate-bounce" />
              <h4 className="font-bold text-zinc-900 dark:text-zinc-50">{t.conquistas}</h4>
            </div>
            <span className="text-[10px] bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 py-1 px-2.5 rounded-full font-bold">
              {stats.unlockedAchievements.length} {lang === 'pt' ? 'Ganhas' : 'Unlocked'}
            </span>
          </div>

          <div className="space-y-2 max-h-[190px] overflow-y-auto pr-1">
            {stats.unlockedAchievements.length === 0 ? (
              <p className="text-xs text-zinc-400 italic text-center py-4">
                {lang === 'pt' ? 'Nenhuma conquista desbloqueada ainda. Continue estudando!' : 'No badges unlocked yet. Keep up the dedication!'}
              </p>
            ) : (
              stats.unlockedAchievements.map((badgeId) => (
                <div key={badgeId} className="flex items-center space-x-3 p-2 bg-zinc-50 dark:bg-zinc-950/20 rounded-xl border border-zinc-250 dark:border-zinc-850">
                  <Flame className="w-4 h-4 text-amber-500 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200">{badgeId}</p>
                    <p className="text-[10px] text-zinc-400">Desbloqueado com sucesso</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
