import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Trophy, BarChart3, MessageSquare, Settings, ShieldAlert,
  Bell, Heart, CircleDollarSign, Languages, Menu, X, Sparkles, ChevronRight, Check
} from 'lucide-react';
import { UserStats, ProgrammingLanguage } from './types';

// Tab components
import LearnTab from './components/LearnTab';
import DuelsTab from './components/DuelsTab';
import StatsTab from './components/StatsTab';
import ForumTab from './components/ForumTab';
import IntegrationTab from './components/IntegrationTab';
import SecurityTab from './components/SecurityTab';
import LeaderboardSection from './components/LeaderboardSection';

const LOCAL_STORAGE_KEY = 'devlingo_user_stats_v1';

const INITIAL_STATS: UserStats = {
  uid: 'devlingo_user_101',
  displayName: 'Davi Coder',
  avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
  level: 1,
  xp: 45,
  gold: 150,
  hearts: 5,
  streak: 3,
  completedExerciseIds: [],
  unlockedAchievements: [],
  history: {
    '2026-06-08': 10,
    '2026-06-09': 15,
    '2026-06-10': 20,
    '2026-06-11': 8,
    '2026-06-12': 12
  },
  xpGoal: 50,
  minutesGoal: 15,
  appLanguage: 'pt',
  theme: 'dark',
  githubUsername: '',
  apiKey: `dl_live_${Math.random().toString(36).substring(2, 18)}`,
  isBiometricEnabled: false,
  is2faEnabled: false
};

interface NotificationItem {
  id: string;
  title: string;
  text: string;
  time: string;
  read: boolean;
}

export default function App() {
  // Global gamified stats hook
  const [stats, setStats] = useState<UserStats>(INITIAL_STATS);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'learn' | 'duels' | 'leaderboard' | 'stats' | 'forum' | 'integrations' | 'security'>('learn');
  
  // Interface utilities
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showHeartShop, setShowHeartShop] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  
  // Floating screen toasts
  const [toast, setToast] = useState<{ text: string; title?: string } | null>(null);

  // Load from local storage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        setStats(JSON.parse(stored));
      } else {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_STATS));
      }
    } catch (e) {
      console.warn("Could not access localStorage", e);
    } finally {
      setIsLoading(false);
    }

    // Populate initial notification cues
    setNotifications([
      { id: '1', title: 'Boas-vindas!', text: 'Bem-vindo ao DevLingo! Comece escolhendo sua linguagem favorita no mapa de conhecimentos.', time: 'Agora mesmo', read: false },
      { id: '2', title: 'Ofensiva Diária', text: 'Sua ofensiva é de 3 dias seguidos! Estude hoje para manter o fogo aceso.', time: '2 horas atrás', read: false }
    ]);
  }, []);

  // Update helper
  const updateStats = (newStats: Partial<UserStats>) => {
    setStats(prev => {
      const updated = { ...prev, ...newStats };
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn("Could not save stats", e);
      }
      return updated;
    });
  };

  // Toast trigger
  const triggerNotification = (text: string, title?: string) => {
    setToast({ text, title });
    
    // Append to our bell tray
    const newNotif: NotificationItem = {
      id: `nt_${Date.now()}`,
      title: title || 'Alerta',
      text,
      time: 'Agora mesmo',
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);

    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const handleBuyHeart = () => {
    if (stats.gold >= 30) {
      if (stats.hearts >= 5) {
        triggerNotification(
          stats.appLanguage === 'pt' ? 'Suas vidas já estão cheias!' : 'Hearts are already fully loaded!',
          stats.appLanguage === 'pt' ? 'Loja DevLingo' : 'DevLingo Shop'
        );
        return;
      }
      updateStats({
        gold: stats.gold - 30,
        hearts: stats.hearts + 1
      });
      triggerNotification(
        stats.appLanguage === 'pt' ? 'Você comprou +1 Coração por 30 ouros!' : 'Purchased +1 Heart with 30 gold!',
        stats.appLanguage === 'pt' ? 'Loja de Vidas' : 'Hearts Shop'
      );
    } else {
      triggerNotification(
        stats.appLanguage === 'pt' ? 'Ouro insuficiente! Complete mais lições para conseguir ouro.' : 'Insufficient Gold! Do more exercise challenges to gather coins.',
        stats.appLanguage === 'pt' ? 'Loja de Vidas' : 'Hearts Shop'
      );
    }
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    triggerNotification(
      stats.appLanguage === 'pt' ? 'Todas lidas!' : 'All read!',
      stats.appLanguage === 'pt' ? 'Alertas' : 'System Alerts'
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-400">
        <div className="text-center space-y-2 animate-pulse">
          <BookOpen className="w-10 h-10 text-indigo-500 mx-auto animate-spin" />
          <p className="text-sm font-mono tracking-widest">Carregando DevLingo...</p>
        </div>
      </div>
    );
  }

  const lang = stats.appLanguage || 'pt';

  const menuTranslations = {
    pt: {
      learn: 'Aprender',
      duels: 'Duelo Rápido',
      leaderboard: 'Liga Diamante',
      stats: 'Minhas Estatísticas',
      forum: 'Fórum da Comunidade',
      integrations: 'Integrações & API',
      security: 'Segurança & Conta',
      shopTitle: 'Mercado DevLingo',
      shopSubtitle: 'Compre corações extras para não perder sua ofensiva com erros difíceis de digitação.',
      oneHeart: 'Adquirir +1 Coração',
      oneHeartCost: 'Custo: 30 ouros',
      fullHeart: 'Seu recipiente de vidas está completo!',
      notifTitle: 'Notificações Inteligentes',
      noNotif: 'Nenhum lembrete novo por enquanto!',
      notifMarkRead: 'Marcar tudo como lido',
      githubWarning: 'Modo offline habilitado se o Firestore falhar.',
    },
    en: {
      learn: 'Learn Tracks',
      duels: 'Quick Challenges',
      leaderboard: 'Diamond League',
      stats: 'My Analytics',
      forum: 'Peer Forum',
      integrations: 'Integrations & API',
      security: 'Security & Auth',
      shopTitle: 'DevLingo Market Spot',
      shopSubtitle: 'Exchange your hard earned developers gold to reload available mistake shields.',
      oneHeart: 'Buy +1 Heart',
      oneHeartCost: 'Price: 30 gold',
      fullHeart: 'Heart containers fully restored!',
      notifTitle: 'Smart Push Notifications',
      noNotif: 'No new push alerts at the moment',
      notifMarkRead: 'Clear all notifications',
      githubWarning: 'Local simulation activated if Cloud Node is unconfigured.',
    }
  }[lang];

  return (
    <div className={`min-h-screen transition-all duration-300 ${stats.theme === 'dark' ? 'bg-zinc-950 sophisticated-gradient-bg text-zinc-200' : 'bg-zinc-50 text-zinc-900 group-light'}`}>
      {/* NAVBAR */}
      <header className="sticky top-0 z-40 bg-white/85 dark:bg-[#0a0a0a]/90 backdrop-blur-md border-b border-zinc-200 dark:border-white/10 px-4 md:px-8 py-3.5 flex items-center justify-between shadow-sm">
        
        {/* Left corner Brand */}
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-zinc-400 hover:text-zinc-100 p-1 transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('learn')}>
            <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center text-black font-black text-sm shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-transform hover:scale-105 active:scale-95">
              C
            </div>
            <span className="font-extrabold tracking-tight text-sm sm:text-lg font-sans text-zinc-900 dark:text-white uppercase">
              DEV<span className="text-cyan-400">LINGO</span>
            </span>
          </div>
        </div>

        {/* Dynamic score header badges */}
        <div className="flex items-center space-x-2 sm:space-x-3.5">
          {/* Level */}
          <div className="hidden sm:flex items-center space-x-1 px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850">
            <span className="text-[10px] uppercase font-extrabold text-zinc-400">Lvl</span>
            <span className="text-xs font-black text-indigo-500 font-mono">{stats.level}</span>
          </div>

          {/* Streak Flame */}
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-orange-50 dark:bg-orange-950/20 text-orange-600 dark:text-orange-400 font-extrabold font-mono text-xs select-none">
            <span className="animate-pulse">🔥</span>
            <span>{stats.streak}d</span>
          </div>

          {/* Coins / Gold */}
          <div className="flex items-center space-x-1 px-3 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/20 text-amber-500 select-none font-bold text-xs">
            <CircleDollarSign className="w-4 h-4" />
            <span className="font-mono">{stats.gold}</span>
          </div>

          {/* Hearts / Mistake shop */}
          <button
            onClick={() => setShowHeartShop(true)}
            id="btn-nav-hearts"
            className="flex items-center space-x-1 px-3 py-1.5 rounded-full bg-rose-50 dark:bg-rose-950/20 text-rose-500 cursor-pointer select-none font-bold text-xs hover:scale-105 active:scale-95 transition-all"
          >
            <Heart className="w-4 h-4 fill-current animate-bounce" />
            <span className="font-mono">{stats.hearts}</span>
          </button>

          {/* Language toggle flag button */}
          <button
            onClick={() => updateStats({ appLanguage: lang === 'pt' ? 'en' : 'pt' })}
            id="btn-nav-lang"
            className="p-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400 transition-colors cursor-pointer text-xs flex items-center space-x-1 font-bold"
          >
            <Languages className="w-3.5 h-3.5" />
            <span className="uppercase font-mono text-[10px]">{lang}</span>
          </button>

          {/* Notifications tray indicator */}
          <div className="relative">
            <button
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              id="btn-nav-notif"
              className="p-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400 transition-colors relative cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              {notifications.some(n => !n.read) && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full animate-ping" />
              )}
            </button>

            {/* Notifications Dropdown Drawer list */}
            {isNotificationOpen && (
              <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl p-4 space-y-3.5 z-50 text-left animate-fade-in">
                <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800/80 pb-2">
                  <span className="text-xs font-black text-zinc-800 dark:text-zinc-250 flex items-center">
                    <Bell className="w-3.5 h-3.5 mr-1 text-indigo-500" />
                    {menuTranslations.notifTitle}
                  </span>
                  <button 
                    onClick={markAllNotificationsAsRead}
                    className="text-[9px] font-bold text-indigo-500 hover:underline cursor-pointer"
                  >
                    {menuTranslations.notifMarkRead}
                  </button>
                </div>

                <div className="space-y-2.5 max-h-[220px] overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="text-[11px] text-zinc-400 text-center py-4">{menuTranslations.noNotif}</p>
                  ) : (
                    notifications.map(nt => (
                      <div 
                        key={nt.id} 
                        className={`p-2 rounded-xl transition-all ${nt.read ? 'bg-transparent text-zinc-400' : 'bg-zinc-50 dark:bg-zinc-950 border-l-2 border-indigo-500'}`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-extrabold text-zinc-950 dark:text-zinc-100">{nt.title}</span>
                          <span className="text-[8px] text-zinc-400 font-mono">{nt.time}</span>
                        </div>
                        <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5 leading-relaxed">{nt.text}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* BODY CONTENT - Split Sidebar + Screen view layouts */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* SIDEBAR NAVIGATION GRID */}
        <aside className="hidden md:block md:col-span-3 space-y-4">
          {/* Mockup Premium Current Path */}
          <div className="p-4 rounded-xl bg-cyan-950/20 dark:bg-cyan-500/10 border border-zinc-200 dark:border-cyan-500/20 shadow-sm relative overflow-hidden">
            <h2 className="font-serif text-sm italic text-zinc-700 dark:text-white/90 mb-2">
              {lang === 'pt' ? 'Caminho Atual' : 'Current Path'}
            </h2>
            <p className="text-[10px] text-cyan-500 dark:text-cyan-400 font-bold uppercase tracking-widest mb-0.5">
              Level {stats.level}
            </p>
            <p className="text-xs font-semibold text-zinc-950 dark:text-zinc-200">
              {lang === 'pt' ? 'Arquiteto JavaScript' : 'JavaScript Architect'}
            </p>
            <div className="w-full bg-zinc-200 dark:bg-white/10 h-1.5 mt-3 rounded-full overflow-hidden">
              <div 
                className="bg-cyan-400 h-full transition-all duration-500 shadow-[0_0_8px_rgba(34,211,238,0.5)]" 
                style={{ width: `${Math.min(100, Math.max(15, stats.xp % 100))}%` }}
              />
            </div>
          </div>

          {/* GitHub Activity Indicator Panel */}
          <div className="p-4 bg-zinc-50 dark:bg-[#080808] rounded-xl border border-zinc-200 dark:border-white/5 space-y-2">
            <h2 className="font-serif text-sm italic text-zinc-700 dark:text-white/90">
              {lang === 'pt' ? 'Atividade de Código' : 'Activity Log'}
            </h2>
            <div className="bg-zinc-100 dark:bg-white/5 rounded-lg p-3 border border-zinc-200 dark:border-white/5 text-xs font-mono space-y-1.5">
              <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                <span>{lang === 'pt' ? 'RESOLVIDOS:' : 'RESOLVED:'}</span>
                <span className="text-cyan-400 font-bold">{stats.completedExerciseIds.length}</span>
              </div>
              <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                <span>{lang === 'pt' ? 'OFC. ATIVA:' : 'STREAK:'}</span>
                <span className="text-orange-400 font-bold">🔥 {stats.streak}d</span>
              </div>
              <div className="mt-2.5 pt-2 border-t border-zinc-200 dark:border-white/10 flex gap-1.5 justify-center">
                <div className="w-2.5 h-2.5 bg-zinc-300 dark:bg-white/5 rounded-sm"></div>
                <div className="w-2.5 h-2.5 bg-cyan-900 rounded-sm"></div>
                <div className="w-2.5 h-2.5 bg-cyan-700 rounded-sm"></div>
                <div className="w-2.5 h-2.5 bg-cyan-500 rounded-sm shadow-[0_0_4px_#22d3ee]"></div>
                <div className="w-2.5 h-2.5 bg-cyan-400 rounded-sm shadow-[0_0_6px_#22d3ee] animate-pulse"></div>
              </div>
            </div>
          </div>

          <div className="h-[2px] bg-zinc-200 dark:bg-white/10 my-1" />

          {[
            { id: 'learn', label: menuTranslations.learn, icon: BookOpen },
            { id: 'duels', label: menuTranslations.duels, icon: Sparkles },
            { id: 'leaderboard', label: menuTranslations.leaderboard, icon: Trophy },
            { id: 'stats', label: menuTranslations.stats, icon: BarChart3 },
            { id: 'forum', label: menuTranslations.forum, icon: MessageSquare },
            { id: 'integrations', label: menuTranslations.integrations, icon: Settings },
            { id: 'security', label: menuTranslations.security, icon: ShieldAlert },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                id={`sidebar-link-${item.id}`}
                className={`w-full flex items-center justify-between p-3.5 rounded-xl font-bold text-xs select-none transition-all cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10 scale-102 font-extrabold'
                    : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 bg-transparent'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight className="w-3.5 h-3.5 opacity-90 animate-pulse" />}
              </button>
            );
          })}
        </aside>

        {/* MAIN SELECTED ACTIVE VIEW SCREEN */}
        <main className="col-span-1 md:col-span-9 space-y-6">
          {activeTab === 'learn' && (
            <LearnTab 
              stats={stats} 
              updateStats={updateStats} 
              lang={lang} 
              triggerNotification={triggerNotification} 
            />
          )}

          {activeTab === 'duels' && (
            <DuelsTab 
              stats={stats} 
              updateStats={updateStats} 
              lang={lang} 
              triggerNotification={triggerNotification} 
            />
          )}

          {activeTab === 'leaderboard' && (
            <LeaderboardSection 
              stats={stats} 
              lang={lang} 
            />
          )}

          {activeTab === 'stats' && (
            <StatsTab 
              stats={stats} 
              updateStats={updateStats} 
              lang={lang} 
              triggerNotification={triggerNotification} 
            />
          )}

          {activeTab === 'forum' && (
            <ForumTab 
              stats={stats} 
              updateStats={updateStats} 
              lang={lang} 
              triggerNotification={triggerNotification} 
            />
          )}

          {activeTab === 'integrations' && (
            <IntegrationTab 
              stats={stats} 
              updateStats={updateStats} 
              lang={lang} 
              triggerNotification={triggerNotification} 
            />
          )}

          {activeTab === 'security' && (
            <SecurityTab 
              stats={stats} 
              updateStats={updateStats} 
              lang={lang} 
              triggerNotification={triggerNotification} 
            />
          )}
        </main>
      </div>

      {/* MOBILE BAR DRAWER OVERLAY */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex md:hidden animate-fade-in">
          <div className="bg-white dark:bg-zinc-950 w-72 h-full p-6 space-y-6 shadow-2xl relative">
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-200"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex items-center space-x-2">
              <span className="bg-indigo-600 text-white p-2 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-amber-300" />
              </span>
              <span className="font-extrabold tracking-tight text-lg">DevLingo</span>
            </div>

            <nav className="space-y-1.5">
              {[
                { id: 'learn', label: menuTranslations.learn, icon: BookOpen },
                { id: 'duels', label: menuTranslations.duels, icon: Sparkles },
                { id: 'leaderboard', label: menuTranslations.leaderboard, icon: Trophy },
                { id: 'stats', label: menuTranslations.stats, icon: BarChart3 },
                { id: 'forum', label: menuTranslations.forum, icon: MessageSquare },
                { id: 'integrations', label: menuTranslations.integrations, icon: Settings },
                { id: 'security', label: menuTranslations.security, icon: ShieldAlert },
              ].map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id as any);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 p-3 rounded-lg font-bold text-xs text-left ${
                      isActive
                        ? 'bg-indigo-600 text-white'
                        : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      {/* HEART SHOP MODAL (GAMIFIED COIN SPENDING) */}
      {showHeartShop && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 max-w-sm w-full rounded-2xl p-6 shadow-2xl text-center space-y-4">
            <div className="flex justify-center">
              <Heart className="w-16 h-16 text-rose-500 fill-rose-500 animate-pulse ml-0.5" />
            </div>

            <div>
              <h3 className="font-bold text-zinc-950 dark:text-zinc-50 text-base">{menuTranslations.shopTitle}</h3>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                {menuTranslations.shopSubtitle}
              </p>
            </div>

            <div className="p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-850 dark:text-zinc-50">{menuTranslations.oneHeart}</span>
                <span className="text-[11px] text-amber-500 font-mono font-bold">30 gold coins</span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              {stats.hearts < 5 ? (
                <button
                  onClick={handleBuyHeart}
                  id="btn-buy-heart-shop"
                  className="w-full bg-rose-500 hover:bg-rose-600 font-extrabold text-white py-2.5 rounded-xl text-xs uppercase cursor-pointer"
                >
                  {menuTranslations.oneHeart}
                </button>
              ) : (
                <div className="flex items-center justify-center space-x-1.5 p-2 text-xs bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 font-bold rounded-xl border border-emerald-100">
                  <Check className="w-4 h-4" />
                  <span>{menuTranslations.fullHeart}</span>
                </div>
              )}

              <button
                onClick={() => setShowHeartShop(false)}
                className="block text-center text-zinc-400 text-xs hover:underline mx-auto"
              >
                {lang === 'pt' ? 'Voltar para os Estudos' : 'Back to Studying'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FLOATING FLOATER TOAST MESSAGE */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-indigo-600 dark:bg-zinc-900 border border-indigo-700 dark:border-zinc-800 text-white shadow-xl px-4 py-3 rounded-xl flex items-center space-x-3.5 max-w-sm animate-fade-in">
          <Sparkles className="w-4 h-4 text-amber-300 shrink-0 select-none" />
          <div className="flex-1">
            {toast.title && <p className="text-[10px] uppercase font-mono text-indigo-200 dark:text-zinc-400 font-black">{toast.title}</p>}
            <p className="text-xs font-bold">{toast.text}</p>
          </div>
          <button 
            onClick={() => setToast(null)}
            className="text-white/60 hover:text-white p-0.5"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
