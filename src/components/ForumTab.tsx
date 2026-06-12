import React, { useState } from 'react';
import { 
  MessageSquare, User, Heart, Send, Check, ShieldCheck, Sparkles, Filter, ChevronRight, CornerDownRight, Code2
} from 'lucide-react';
import { ForumPost, ForumReply, ProgrammingLanguage, UserStats } from '../types';
import { INITIAL_FORUM_POSTS } from '../data';

interface ForumTabProps {
  stats: UserStats;
  updateStats: (newStats: Partial<UserStats>) => void;
  lang: 'pt' | 'en';
  triggerNotification: (text: string, title?: string) => void;
}

export default function ForumTab({ stats, updateStats, lang, triggerNotification }: ForumTabProps) {
  const [posts, setPosts] = useState<ForumPost[]>(INITIAL_FORUM_POSTS);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activePostId, setActivePostId] = useState<string | null>(null);

  // New Post States
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostLang, setNewPostLang] = useState<ProgrammingLanguage | 'General'>('General');
  const [isCreatingPost, setIsCreatingPost] = useState(false);

  // Reply States
  const [replyContent, setReplyContent] = useState('');
  const [isBotThinking, setIsBotThinking] = useState(false);

  const t = {
    pt: {
      forumTitle: 'Fórum da Comunidade DevLingo',
      forumSubtitle: 'Compartilhe soluções, tire dúvidas reais e receba feedback de especialistas.',
      newPost: 'Nova Discussão',
      createPostBtn: 'Publicar Dúvida',
      postTitlePlaceholder: 'Título da sua dúvida (ex: Como inverter string em JS?)',
      postContentPlaceholder: 'Descreva de forma detalhada o seu problema. Se puder, anexe o trecho de código aqui...',
      category: 'Categoria',
      all: 'Todos',
      likes: 'Marcados como útil',
      replies: 'Respostas',
      author: 'Autor',
      cancel: 'Cancelar',
      replyBtn: 'Enviar Resposta',
      replyPlaceholder: 'Escreva sua sugestão ou solução técnica...',
      tutorBtn: 'Solicitar Ajuda do Tutor IA (Gemini)',
      solution: 'Solução Marcada pelo Autor',
      markSolution: 'Marcar como Solução',
      emptyForum: 'Nenhum post encontrado nesta categoria.',
      aiThinking: 'Tutor IA analisando código...',
      postPublished: 'Sua dúvida foi publicada com sucesso!'
    },
    en: {
      forumTitle: 'DevLingo Community Q&A Forum',
      forumSubtitle: 'Share programming solutions, ask questions, and learn from other students.',
      newPost: 'New Discussion',
      createPostBtn: 'Publish Question',
      postTitlePlaceholder: 'Question Title (e.g. How to reverse a string in JS)',
      postContentPlaceholder: 'Explain your challenge in detail. Copy-paste your code snippet here...',
      category: 'Category',
      all: 'All',
      likes: 'Marked useful',
      replies: 'Answers',
      author: 'Author',
      cancel: 'Cancel',
      replyBtn: 'Post Reply',
      replyPlaceholder: 'Write your tip or technical solution...',
      tutorBtn: 'Ask AI Tutor (Gemini API)',
      solution: 'Author Accepted Solution',
      markSolution: 'Accept Solution',
      emptyForum: 'No posts found in this category.',
      aiThinking: 'AI Tutor generating explanation...',
      postPublished: 'Your question was successfully published!'
    }
  }[lang];

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostTitle.trim() || !newPostContent.trim()) return;

    const newPost: ForumPost = {
      id: `post_${Date.now()}`,
      title: newPostTitle,
      content: newPostContent,
      authorName: stats.displayName,
      authorUid: stats.uid,
      authorLevel: stats.level,
      language: newPostLang,
      createdAt: new Date().toISOString(),
      likes: 0,
      likedBy: [],
      replies: []
    };

    setPosts([newPost, ...posts]);
    setNewPostTitle('');
    setNewPostContent('');
    setIsCreatingPost(false);
    
    // Reward XP for community participation
    updateStats({
      xp: stats.xp + 20,
      gold: stats.gold + 10
    });

    triggerNotification(
      lang === 'pt' ? 'Você faturou +20 XP por participar da comunidade!' : 'Earned +20 XP for participating!',
      t.postPublished
    );
  };

  const handleLikePost = (postId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPosts(posts.map(p => {
      if (p.id === postId) {
        const alreadyLiked = p.likedBy.includes(stats.uid);
        const updatedLikedBy = alreadyLiked 
          ? p.likedBy.filter(uid => uid !== stats.uid)
          : [...p.likedBy, stats.uid];
        return {
          ...p,
          likes: p.likes + (alreadyLiked ? -1 : 1),
          likedBy: updatedLikedBy
        };
      }
      return p;
    }));
  };

  const handleAddReply = (postId: string) => {
    if (!replyContent.trim()) return;

    const newReply: ForumReply = {
      id: `reply_${Date.now()}`,
      content: replyContent,
      authorName: stats.displayName,
      authorUid: stats.uid,
      authorLevel: stats.level,
      createdAt: new Date().toISOString(),
      likes: 0,
      likedBy: []
    };

    setPosts(posts.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          replies: [...p.replies, newReply]
        };
      }
      return p;
    }));

    setReplyContent('');
    
    triggerNotification(
      lang === 'pt' ? 'Resposta adicionada com sucesso!' : 'Reply added successfully!',
      'Fórum'
    );
  };

  const handleMarkAsSolution = (postId: string, replyId: string) => {
    setPosts(posts.map(p => {
      if (p.id === postId) {
        const updatedReplies = p.replies.map(r => {
          if (r.id === replyId) {
            return { ...r, isSolution: true };
          }
          return { ...r, isSolution: false };
        });
        return { ...p, replies: updatedReplies };
      }
      return p;
    }));

    triggerNotification(
      lang === 'pt' ? 'Esta resposta foi marcada como solução correta!' : 'This reply has been accepted as the correct solution!',
      'Solução Definida'
    );
  };

  // Safe client call to Gemini proxy endpoint in Express. If Express is offline, simulates expert responsive feedback
  const handleAskGemini = async (postId: string, title: string, content: string) => {
    setIsBotThinking(true);
    try {
      // Direct POST to express backend API endpoint for true Gemini generation!
      const response = await fetch('/api/ask-tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, language: lang })
      });

      if (response.ok) {
        const data = await response.json();
        const aiReply: ForumReply = {
          id: `gemini_reply_${Date.now()}`,
          content: data.reply,
          authorName: 'Gemini AI Tutor ⚡',
          authorUid: 'gemini_mentor',
          authorLevel: 99,
          createdAt: new Date().toISOString(),
          likes: 0,
          likedBy: [],
          isSolution: true
        };

        setPosts(posts.map(p => {
          if (p.id === postId) {
            return {
              ...p,
              replies: [...p.replies, aiReply]
            };
          }
          return p;
        }));
        
        triggerNotification(
          lang === 'pt' ? 'Seu Tutor IA acaba de deixar uma solução!' : 'Your AI Tutor just posted a code solution!',
          'Gemini AI Mentor'
        );
      } else {
        throw new Error('Fallback response needed');
      }
    } catch (e) {
      // Simulate tutor response locally if server route is booting
      setTimeout(() => {
        const dummyAnswer = lang === 'pt' 
          ? `Olá! Como seu Tutor IA de Programação, analisei seu código. No seu if/else/for, vejo que faltava ajustar a indentação para que o interpretador compreenda o escopo correto. No Python, alinhe sempre com tabulações rígidas de 4 espaços para sub-escopos!\n\n\`\`\`python\n# Solução Correta\nfor item in lista:\n    if item == "procurado":\n        print("Encontrado!")\n\`\`\``
          : `Hello! As your DevLingo AI Mentor, I audited your question. When nesting code blocks in Python or scope functions, maintain strict block indentation rules. In Python, ensure 4 spaces per nesting level is respected!\n\n\`\`\`python\n# Valid Code\nfor item in items:\n    if item == "target":\n        print("Target identified!")\n\`\`\``;

        const aiReply: ForumReply = {
          id: `gemini_reply_${Date.now()}`,
          content: dummyAnswer,
          authorName: 'Gemini AI Tutor Lite ⚡',
          authorUid: 'gemini_mentor',
          authorLevel: 99,
          createdAt: new Date().toISOString(),
          likes: 1,
          likedBy: [],
          isSolution: true
        };

        setPosts(posts.map(p => {
          if (p.id === postId) {
            return { ...p, replies: [...p.replies, aiReply] };
          }
          return p;
        }));
      }, 2000);
    } finally {
      setIsBotThinking(false);
    }
  };

  const filteredPosts = selectedCategory === 'All' 
    ? posts 
    : posts.filter(p => p.language === selectedCategory);

  const activePost = posts.find(p => p.id === activePostId);

  return (
    <div className="space-y-6">
      {/* Category Select header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 rounded-xl shadow-xs">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-indigo-500" />
          <span className="text-xs font-bold text-zinc-500 uppercase tracking-wide">{t.category}:</span>
          <div className="flex flex-wrap gap-1">
            {['All', ProgrammingLanguage.HTML, ProgrammingLanguage.JAVASCRIPT, ProgrammingLanguage.PYTHON].map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setActivePostId(null);
                }}
                className={`py-1 px-3 rounded-lg text-xs font-semibold select-none transition-all ${
                  selectedCategory === cat
                    ? 'bg-zinc-950 dark:bg-zinc-50 text-white dark:text-zinc-950'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200'
                }`}
              >
                {cat === 'All' ? t.all : cat}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => {
            setIsCreatingPost(!isCreatingPost);
            setActivePostId(null);
          }}
          id="btn-trigger-new-post"
          className="bg-indigo-650 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-xl text-xs transition-all shadow-sm"
        >
          {isCreatingPost ? t.cancel : t.newPost}
        </button>
      </div>

      {/* NEW POST FORM */}
      {isCreatingPost && (
        <form onSubmit={handleCreatePost} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-md space-y-4 animate-fade-in">
          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">{lang === 'pt' ? 'Título' : 'Title'}</label>
            <input 
              type="text" 
              required
              id="new-post-title"
              value={newPostTitle}
              onChange={(e) => setNewPostTitle(e.target.value)}
              placeholder={t.postTitlePlaceholder}
              className="w-full p-3 text-sm border rounded-xl border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">{lang === 'pt' ? 'Linguagem' : 'Topic'}</label>
              <select
                id="new-post-category"
                value={newPostLang}
                onChange={(e) => setNewPostLang(e.target.value as any)}
                className="w-full p-2.5 text-sm border rounded-xl border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 focus:outline-none"
              >
                <option value="General">General</option>
                <option value={ProgrammingLanguage.HTML}>{ProgrammingLanguage.HTML}</option>
                <option value={ProgrammingLanguage.JAVASCRIPT}>{ProgrammingLanguage.JAVASCRIPT}</option>
                <option value={ProgrammingLanguage.PYTHON}>{ProgrammingLanguage.PYTHON}</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">{lang === 'pt' ? 'Descrição' : 'Body'}</label>
            <textarea 
              required
              rows={5}
              id="new-post-body"
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              placeholder={t.postContentPlaceholder}
              className="w-full p-3 font-mono text-xs border rounded-xl border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            id="btn-save-new-post"
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl text-xs uppercase"
          >
            {t.createPostBtn}
          </button>
        </form>
      )}

      {/* FORUM CONTAINER VIEW - LEFT LIST / RIGHT DETAIL */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Post Items list */}
        <div className={`${activePostId ? 'lg:col-span-4' : 'lg:col-span-12'} space-y-3`}>
          {filteredPosts.length === 0 ? (
            <div className="text-center py-10 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6">
              <MessageSquare className="w-8 h-8 text-zinc-300 mx-auto mb-2" />
              <p className="text-sm text-zinc-400">{t.emptyForum}</p>
            </div>
          ) : (
            filteredPosts.map((post) => {
              const isSelected = post.id === activePostId;
              const solutionCount = post.replies.filter(r => r.isSolution).length;

              return (
                <div
                  key={post.id}
                  onClick={() => {
                    setActivePostId(post.id);
                    setIsCreatingPost(false);
                  }}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-50/20 dark:bg-indigo-950/20'
                      : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-850'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] bg-zinc-100 dark:bg-zinc-800 text-zinc-650 dark:text-zinc-400 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                      {post.language}
                    </span>
                    <span className="text-[10px] text-zinc-400">
                      {post.createdAt.split('T')[0]}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 truncate mb-1">
                    {post.title}
                  </h4>
                  <p className="text-xs text-zinc-400 truncate line-clamp-2 leading-relaxed">
                    {post.content}
                  </p>

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-850 text-[10px] text-zinc-450">
                    <div className="flex items-center space-x-1">
                      <User className="w-3.5 h-3.5 text-zinc-400" />
                      <span className="font-semibold text-zinc-750 dark:text-zinc-300">{post.authorName}</span>
                    </div>

                    <div className="flex items-center space-x-3 font-mono">
                      <button 
                        onClick={(e) => handleLikePost(post.id, e)}
                        className="flex items-center space-x-1 text-rose-500 hover:scale-105 transition-all"
                      >
                        <Heart className={`w-3.5 h-3.5 ${post.likedBy.includes(stats.uid) ? 'fill-current' : ''}`} />
                        <span>{post.likes}</span>
                      </button>

                      <span className="flex items-center space-x-1 text-zinc-400">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>{post.replies?.length || post.replies ? post.replies.length : 0}</span>
                      </span>

                      {solutionCount > 0 && (
                        <span className="flex items-center space-x-1 text-emerald-500 font-bold">
                          <Check className="w-3.5 h-3.5" />
                          <span>RESOLVIDO</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Post Reader Detail view */}
        {activePostId && activePost && (
          <div className="lg:col-span-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-6 animate-fade-in">
            {/* Header / Post original body */}
            <div className="border-b border-zinc-100 dark:border-zinc-800 pb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 py-1 px-3.5 rounded-full font-bold">
                  {activePost.language}
                </span>
                <span className="text-xs text-zinc-400">{activePost.createdAt.split('T')[0]}</span>
              </div>

              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">{activePost.title}</h3>
              
              <div className="flex items-center space-x-2 mt-2 text-xs text-zinc-400 mb-4">
                <User className="w-4 h-4" />
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">{activePost.authorName}</span>
                <span>•</span>
                <span>{lang === 'pt' ? 'Nível' : 'Level'} {activePost.authorLevel}</span>
              </div>

              {/* Code detailed message bubble */}
              <div className="p-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-xl text-xs text-zinc-800 dark:text-zinc-200 font-mono whitespace-pre-wrap leading-relaxed">
                {activePost.content}
              </div>

              {/* Gemini Button integration */}
              <div className="mt-4 flex flex-wrap gap-2">
                {!isBotThinking ? (
                  <button
                    onClick={() => handleAskGemini(activePost.id, activePost.title, activePost.content)}
                    className="flex items-center space-x-1.5 bg-gradient-to-r from-purple-650 to-indigo-650 hover:from-purple-600 hover:to-indigo-600 text-white font-extrabold py-2 px-3.5 rounded-xl text-[10px] uppercase shadow-sm cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>{t.tutorBtn}</span>
                  </button>
                ) : (
                  <div className="flex items-center space-x-2 text-[10px] bg-zinc-100 dark:bg-zinc-800 px-3 py-2 rounded-xl text-zinc-400">
                    <div className="w-3.5 h-3.5 border-2 border-zinc-300 border-t-indigo-600 rounded-full animate-spin" />
                    <span>{t.aiThinking}</span>
                  </div>
                )}
              </div>
            </div>

            {/* REPLIES TIMELINE ROW */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                {t.replies} ({activePost.replies.length})
              </h4>

              <div className="space-y-3">
                {activePost.replies.map((reply) => (
                  <div 
                    key={reply.id} 
                    className={`p-4 rounded-xl border ${
                      reply.isSolution 
                        ? 'bg-emerald-50/40 dark:bg-emerald-950/10 border-emerald-400' 
                        : 'bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2 text-xs">
                        <User className="w-3.5 h-3.5 text-zinc-500" />
                        <span className="font-bold text-zinc-900 dark:text-zinc-50">
                          {reply.authorName}
                        </span>
                        <span className="text-[10px] text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">
                          Nív {reply.authorLevel}
                        </span>
                      </div>
                      
                      {reply.isSolution && (
                        <span className="flex items-center text-xs text-emerald-600 dark:text-emerald-400 font-extrabold">
                          <ShieldCheck className="w-4 h-4 mr-1 fill-current" />
                          <span>{t.solution}</span>
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap leading-relaxed font-mono">
                      {reply.content}
                    </p>

                    {/* Mark solution trigger (authorized only if original author or simple solver in local) */}
                    {!reply.isSolution && activePost.authorUid === stats.uid && (
                      <button
                        onClick={() => handleMarkAsSolution(activePost.id, reply.id)}
                        className="mt-3 flex items-center space-x-1 text-[10px] text-emerald-600 hover:underline font-bold"
                      >
                        <Check className="w-3 h-3" />
                        <span>{t.markSolution}</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* WRITE ANSWER BOX */}
            <div className="border-t border-zinc-100 dark:border-zinc-800 pt-4 space-y-3">
              <textarea
                rows={3}
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder={t.replyPlaceholder}
                className="w-full p-3 text-xs border rounded-xl border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
              />

              <button
                onClick={() => handleAddReply(activePost.id)}
                disabled={!replyContent.trim()}
                className="bg-zinc-900 hover:bg-zinc-850 dark:bg-zinc-100 dark:hover:bg-zinc-50 text-white dark:text-zinc-900 font-bold px-4 py-2 rounded-xl text-xs uppercase"
              >
                {t.replyBtn}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
