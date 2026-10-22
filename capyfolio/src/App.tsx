import { useEffect, useMemo, useState } from 'react';
import { BrowserRouter, Link, Navigate, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import { CheckCircle2, ChevronRight, Plus, Search } from 'lucide-react';

import { AppDataProvider, useAppData } from './context/AppDataContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider, useToast } from './context/ToastContext';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Toast } from './components/Toast';
import { CreateContentModal } from './components/CreateContentModal';
import { EventCard } from './components/EventCard';
import { PostCard } from './components/PostCard';
import { ProjectCard } from './components/ProjectCard';
import { UserCard } from './components/UserCard';
import Badge from './components/Badge';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { postService } from './services/postService';
import { projectService } from './services/projectService';
import type { Event, Post, Project, User } from './types';

function AppShell() {
  const { currentUser, isAuthenticated, login, register, logout } = useAuth();
  const { users, projects, events, posts, setUsers, setProjects, setPosts } = useAppData();
  const { toastMessage, showToast, clearToast } = useToast();
  const navigate = useNavigate();
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createModalDefaultTab, setCreateModalDefaultTab] = useState<'project' | 'post'>('project');
  const [favoritedProjectIds, setFavoritedProjectIds] = useState<string[]>([]);
  const [registeredEventIds, setRegisteredEventIds] = useState<string[]>([]);
  const [connectedUserIds, setConnectedUserIds] = useState<string[]>([]);

  useEffect(() => {
    setFavoritedProjectIds(JSON.parse(localStorage.getItem('capyfolio_favorites') ?? '[]'));
    setRegisteredEventIds(JSON.parse(localStorage.getItem('capyfolio_registrations') ?? '[]'));
    setConnectedUserIds(JSON.parse(localStorage.getItem('capyfolio_connections') ?? '[]'));
  }, []);

  const handleLogin = async (email: string, password: string) => {
    const sessionUser = await login(email, password);
    if (!sessionUser) return false;
    showToast(`Sessão iniciada como ${sessionUser.name}.`);
    return true;
  };

  const handleRegister = async (data: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    institution: string;
    course: string;
    period: string;
    focus: string;
    tags: string[];
    bio: string;
  }) => {
    if (data.password !== data.confirmPassword) {
      return 'As senhas não conferem.';
    }

    try {
      const created = await register(data);
      setUsers((previous) => [...previous, created]);
      showToast('Conta institucional criada com sucesso!');
      return null;
    } catch {
      return 'Erro ao criar a conta.';
    }
  };

  const persistFavoriteProjects = (next: string[]) => {
    localStorage.setItem('capyfolio_favorites', JSON.stringify(next));
    setFavoritedProjectIds(next);
  };

  const persistEventRegistrations = (next: string[]) => {
    localStorage.setItem('capyfolio_registrations', JSON.stringify(next));
    setRegisteredEventIds(next);
  };

  const persistConnections = (next: string[]) => {
    localStorage.setItem('capyfolio_connections', JSON.stringify(next));
    setConnectedUserIds(next);
  };

  const handleToggleFavoriteProject = (projectId: string) => {
    const next = favoritedProjectIds.includes(projectId)
      ? favoritedProjectIds.filter((id) => id !== projectId)
      : [...favoritedProjectIds, projectId];
    persistFavoriteProjects(next);
    showToast(next.includes(projectId) ? 'Projeto salvo nos seus favoritos acadêmicos!' : 'Projeto removido dos favoritos.');
  };

  const handleToggleEventRegistration = (eventId: string) => {
    const next = registeredEventIds.includes(eventId)
      ? registeredEventIds.filter((id) => id !== eventId)
      : [...registeredEventIds, eventId];
    persistEventRegistrations(next);
    showToast(next.includes(eventId) ? 'Inscrição confirmada!' : 'Inscrição cancelada.');
  };

  const handleToggleConnect = (userId: string) => {
    const next = connectedUserIds.includes(userId)
      ? connectedUserIds.filter((id) => id !== userId)
      : [...connectedUserIds, userId];
    persistConnections(next);
    showToast(next.includes(userId) ? 'Conexão acadêmica adicionada!' : 'Conexão removida.');
  };

  const handleCreatePost = async (payload: { category: string; content: string; relatedProjectId?: string | null }) => {
    if (!currentUser) return;

    const created: Post = {
      id: `post-${Date.now()}`,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorRole: `${currentUser.course ?? 'Estudante'} • ${currentUser.period ?? 'Período'}`,
      authorInstitution: currentUser.shortInstitution || currentUser.institution,
      authorAvatar: currentUser.avatar || '',
      isOrganization: false,
      category: payload.category,
      timestamp: 'Agora mesmo',
      content: payload.content,
      relatedProjectId: payload.relatedProjectId ?? null,
      relatedEventId: null,
      likes: 1,
      likedByMe: true,
      comments: [],
    };

    const saved = await postService.create(created);
    setPosts((previous) => [saved, ...previous]);
    showToast('Publicação compartilhada com a comunidade.');
    setIsCreateModalOpen(false);
    navigate('/feed');
  };

  const handleCreateProject = async (payload: {
    title: string;
    shortDescription: string;
    summary: string;
    area: string;
    type: string;
    status: string;
    period: string;
    tags: string[];
    url: string;
    setAsFeatured: boolean;
    keyResults: string[];
  }) => {
    if (!currentUser) return;

    const nextProject: Project = {
      id: `p-${Date.now()}`,
      title: payload.title,
      shortDescription: payload.shortDescription,
      summary: payload.summary,
      keyResults: payload.keyResults.length ? payload.keyResults : ['Projeto publicado com resultados iniciais relevantes.'],
      methodology: payload.summary,
      files: [{ name: 'relatorio_tecnico.pdf', size: '1.2 MB', type: 'Relatório PDF' }],
      authorIds: [currentUser.id],
      authorNames: currentUser.name,
      institution: currentUser.institution,
      area: payload.area,
      type: payload.type,
      status: payload.status,
      date: new Date().toISOString().slice(0, 10),
      period: payload.period,
      tags: payload.tags,
      url: payload.url,
      visualType: 'standard',
      media: 'https://images.unsplash.com/photo-1516321165247-4aa89a48be28?w=1200&auto=format&fit=crop&q=80',
      favorites: 1,
    };

    const saved = await projectService.create(nextProject);
    setProjects((previous) => [saved, ...previous]);

    if (payload.setAsFeatured) {
      setUsers((previous) =>
        previous.map((user) => (user.id === currentUser.id ? { ...user, featuredProjectId: saved.id } : user)),
      );
    }

    showToast('Projeto publicado com sucesso!');
    setIsCreateModalOpen(false);
    navigate(`/projeto/${saved.id}`);
  };

  const handleToggleLikePost = async (postId: string) => {
    const nextPosts = posts.map((post) => {
      if (post.id !== postId) return post;
      const liked = !post.likedByMe;
      return {
        ...post,
        likedByMe: liked,
        likes: Math.max(0, liked ? post.likes + 1 : post.likes - 1),
      };
    });
    setPosts(nextPosts);
    await postService.replaceAll(nextPosts);
  };

  const handleAddComment = async (postId: string, text: string) => {
    if (!currentUser || !text.trim()) return;
    const nextPosts = posts.map((post) => {
      if (post.id !== postId) return post;
      return {
        ...post,
        comments: [
          ...post.comments,
          {
            id: `comment-${Date.now()}`,
            authorName: currentUser.name,
            authorInstitution: currentUser.shortInstitution || currentUser.institution,
            text: text.trim(),
            timestamp: 'Agora',
          },
        ],
      };
    });

    setPosts(nextPosts);
    await postService.replaceAll(nextPosts);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <>
      {isAuthenticated && currentUser ? (
        <Layout
          currentUser={currentUser}
          onOpenCreateModal={() => {
            setCreateModalDefaultTab('project');
            setIsCreateModalOpen(true);
          }}
          onLogout={handleLogout}
          globalSearchQuery={globalSearchQuery}
          onSearchChange={setGlobalSearchQuery}
          onSearchSubmit={() => navigate('/pessoas')}
        >
          <Routes>
            <Route path="/" element={<Navigate to="/feed" replace />} />
            <Route path="/feed" element={<ProtectedRoute><FeedPage currentUser={currentUser} posts={posts} projects={projects} events={events} users={users} onOpenCreateModal={(tab) => { setCreateModalDefaultTab(tab); setIsCreateModalOpen(true); }} onToggleLike={handleToggleLikePost} onAddComment={handleAddComment} /></ProtectedRoute>} />
            <Route path="/projetos" element={<ProtectedRoute><ProjectsPage projects={projects} users={users} favoritedProjectIds={favoritedProjectIds} onToggleFavorite={handleToggleFavoriteProject} /></ProtectedRoute>} />
            <Route path="/projeto/:id" element={<ProtectedRoute><ProjectDetailPage projects={projects} users={users} favoritedProjectIds={favoritedProjectIds} onToggleFavorite={handleToggleFavoriteProject} /></ProtectedRoute>} />
            <Route path="/eventos" element={<ProtectedRoute><EventsPage events={events} registeredEventIds={registeredEventIds} onToggleRegistration={handleToggleEventRegistration} /></ProtectedRoute>} />
            <Route path="/evento/:id" element={<ProtectedRoute><EventDetailPage events={events} registeredEventIds={registeredEventIds} onToggleRegistration={handleToggleEventRegistration} /></ProtectedRoute>} />
            <Route path="/pessoas" element={<ProtectedRoute><PeoplePage users={users} connectedUserIds={connectedUserIds} onToggleConnect={handleToggleConnect} initialSearch={globalSearchQuery} /></ProtectedRoute>} />
            <Route path="/perfil" element={<ProtectedRoute><ProfilePage currentUser={currentUser} users={users} projects={projects} connectedUserIds={connectedUserIds} onToggleConnect={handleToggleConnect} onSetFeaturedProject={(projectId) => { setUsers((previous) => previous.map((user) => (user.id === currentUser.id ? { ...user, featuredProjectId: projectId } : user))); showToast('Projeto em destaque atualizado.'); }} onOpenNewProject={() => { setCreateModalDefaultTab('project'); setIsCreateModalOpen(true); }} /></ProtectedRoute>} />
            <Route path="/perfil/:id" element={<ProtectedRoute><ProfilePage currentUser={currentUser} users={users} projects={projects} connectedUserIds={connectedUserIds} onToggleConnect={handleToggleConnect} onSetFeaturedProject={(projectId) => { setUsers((previous) => previous.map((user) => (user.id === currentUser.id ? { ...user, featuredProjectId: projectId } : user))); showToast('Projeto em destaque atualizado.'); }} onOpenNewProject={() => { setCreateModalDefaultTab('project'); setIsCreateModalOpen(true); }} /></ProtectedRoute>} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Layout>
      ) : (
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
          <Route path="/cadastro" element={<RegisterPage onRegister={handleRegister} />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      )}

      {isCreateModalOpen && currentUser && (
        <CreateContentModal
          currentUser={currentUser}
          projects={projects}
          defaultTab={createModalDefaultTab}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmitPost={handleCreatePost}
          onSubmitProject={handleCreateProject}
        />
      )}

      <Toast message={toastMessage} onClose={clearToast} />
    </>
  );
}

function FeedPage({ currentUser, posts, projects, events, onOpenCreateModal, onToggleLike, onAddComment }: {
  currentUser: User;
  posts: Post[];
  projects: Project[];
  events: Event[];
  users: User[];
  onOpenCreateModal: (tab: 'project' | 'post') => void;
  onToggleLike: (postId: string) => void;
  onAddComment: (postId: string, text: string) => void;
}) {
  return (
    <div className="bg-[#FAF7F2]">
      <section className="capy-hero-shell border-b-[2px] border-[#182536] text-[#FAF7F2]">
        <div className="max-w-6xl mx-auto px-6 py-10 md:py-14">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="space-y-2">
              <span className="text-sm font-semibold tracking-[0.12em] uppercase text-[#FFD98A]">Feed acadêmico</span>
              <h1 className="text-4xl md:text-6xl font-extrabold leading-[0.95] tracking-[-0.04em] text-white">Bem-vindo, {currentUser.name}</h1>
            </div>
            <div className="flex flex-wrap gap-3">
              <button type="button" onClick={() => onOpenCreateModal('post')} className="capy-cta px-5 py-3 text-sm font-bold text-[#182536] bg-white shadow-[4px_4px_0_#182536] hover:shadow-[6px_6px_0_#FEA402]">
                Nova postagem
              </button>
              <button type="button" onClick={() => onOpenCreateModal('project')} className="capy-cta px-5 py-3 text-sm font-bold text-[#182536] shadow-[4px_4px_0_#182536]">
                + Publicar projeto
              </button>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-6 pb-16 pt-8 md:pt-10">
        <div className="flex flex-wrap gap-8 items-start">
          <div className="flex-1 min-w-0 space-y-6">
            {posts.map((post) => (
              <article key={post.id} className="capy-panel bg-white p-6 md:p-8">
                <div className="flex items-center gap-4">
                  <span aria-hidden="true" className="flex h-14 w-14 items-center justify-center rounded-full border-[2px] border-[#182536] bg-[#1E3C61] text-base font-extrabold text-[#FAF7F2]">
                    {post.authorName.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase()}
                  </span>
                  <div className="flex-1 min-w-0">
                    <strong className="block text-xl font-extrabold text-[#182536]">{post.authorName}</strong>
                    <span className="text-sm text-[#56616D]">{post.authorRole} • {post.authorInstitution}</span>
                  </div>
                  <span className="rounded-full border-[2px] border-[#182536] bg-[#EAF0F5] px-3 py-1 text-xs font-bold text-[#1E3C61]">
                    {post.category}
                  </span>
                </div>

                <p className="mt-5 text-lg leading-8 text-[#182536]">{post.content}</p>

                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <button type="button" onClick={() => onToggleLike(post.id)} className="inline-flex items-center gap-2 rounded-full border-[2px] border-[#182536] bg-[#FFF4D6] px-4 py-2 text-sm font-bold text-[#182536] shadow-[4px_4px_0_#FEA402] transition hover:-translate-y-0.5">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill={post.likedByMe ? '#182536' : 'none'} stroke="#182536" strokeWidth="2" strokeLinejoin="round" aria-hidden="true"><path d="M12 20s-8-5-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 9c0 6-8 11-8 11Z" /></svg>
                    {post.likes}
                  </button>
                  <button type="button" className="inline-flex items-center gap-2 rounded-full border-[2px] border-[#182536] bg-white px-4 py-2 text-sm font-bold text-[#182536] shadow-[4px_4px_0_#182536] transition hover:-translate-y-0.5">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#182536" strokeWidth="2" strokeLinejoin="round" aria-hidden="true"><path d="M4 5h16v11H9l-5 4V5Z" /></svg>
                    {post.comments.length}
                  </button>
                  <span className="ml-auto text-sm text-[#56616D]">{post.timestamp}</span>
                </div>

                {post.comments.length > 0 && (
                  <div className="mt-5 rounded-2xl border-[2px] border-[#182536] bg-[#EAF5EE] p-4 shadow-[4px_4px_0_#1B8243]">
                    {post.comments.slice(-1).map((comment) => (
                      <div key={comment.id} className="flex items-start gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-full border-[2px] border-[#182536] bg-[#1B8243] text-xs font-extrabold text-white">
                          {comment.authorName.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase()}
                        </span>
                        <div className="flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <strong className="text-base font-bold text-[#182536]">{comment.authorName}</strong>
                            <span className="text-xs text-[#56616D]">{comment.timestamp}</span>
                          </div>
                          <p className="mt-1 text-base leading-6 text-[#182536]">{comment.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    const form = event.currentTarget as HTMLFormElement;
                    const input = form.querySelector('input') as HTMLInputElement | null;
                    if (!input || !input.value.trim()) return;
                    onAddComment(post.id, input.value);
                    input.value = '';
                  }}
                  className="mt-5 flex flex-wrap gap-3"
                >
                  <input aria-label={`Responder como ${currentUser.name}`} placeholder="Responder como Arthur" className="min-w-[200px] flex-1 rounded-xl border-[2px] border-[#8A96A3] bg-[#FAF7F2] px-4 py-3 text-base text-[#182536] placeholder:text-[#56616D] focus:outline-none" />
                  <button type="submit" className="capy-cta px-5 py-3 text-sm font-bold text-white shadow-[4px_4px_0_#FEA402]">
                    Enviar
                  </button>
                </form>
              </article>
            ))}
          </div>

          <aside className="w-full max-w-[380px] space-y-6">
            <div className="rounded-[24px] border-[2px] border-[#182536] bg-[#FFF4D6] p-6 shadow-[8px_8px_0_#FEA402]">
              <h2 className="text-2xl font-extrabold leading-tight text-[#1E3C61]">Projetos em destaque</h2>
              <div className="mt-5 space-y-3">
                {projects.slice(0, 3).map((project) => (
                  <a key={project.id} href={`/projeto/${project.id}`} className="flex items-center gap-3 rounded-2xl border-[2px] border-[#182536] bg-white p-3 text-[#182536] shadow-[3px_3px_0_#182536] transition hover:-translate-y-0.5 hover:shadow-[5px_5px_0_#182536]">
                    <span className="flex h-14 w-14 items-center justify-center rounded-xl border-[2px] border-[#182536] bg-[#1E3C61] text-[#FAF7F2]">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><ellipse cx="12" cy="6" rx="7" ry="3"/><path d="M5 6v6c0 1.7 3 3 7 3s7-1.3 7-3V6M5 12v6c0 1.7 3 3 7 3s7-1.3 7-3v-6"/></svg>
                    </span>
                    <span className="min-w-0 flex-1">
                      <strong className="block truncate text-base font-bold">{project.title}</strong>
                      <span className="text-sm text-[#56616D]">{project.area}</span>
                    </span>
                  </a>
                ))}
              </div>
            </div>

            <div className="rounded-[24px] border-[2px] border-[#182536] bg-white p-6 shadow-[8px_8px_0_#1E3C61]">
              <h2 className="text-2xl font-extrabold leading-tight text-[#1E3C61]">Próximos eventos</h2>
              <div className="mt-5 space-y-3">
                {events.slice(0, 3).map((event) => (
                  <div key={event.id} className="rounded-2xl border-[2px] border-[#182536] bg-[#FAF7F2] p-3">
                    <p className="text-base font-bold text-[#182536]">{event.title}</p>
                    <p className="mt-1 text-sm text-[#56616D]">{event.date} • {event.city}</p>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

function ProjectsPage({ projects, users, favoritedProjectIds, onToggleFavorite }: {
  projects: Project[];
  users: User[];
  favoritedProjectIds: string[];
  onToggleFavorite: (projectId: string) => void;
}) {
  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-[#1E3C61] font-semibold">Projetos</p>
          <h1 className="text-3xl font-bold text-[#182536] mt-2">Explorar pesquisas e projetos</h1>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-[#DDE2E6] bg-white px-3 py-2 text-sm text-gray-500">
          <Search className="w-4 h-4" />
          <span>{projects.length} projetos</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            author={users.find((user) => user.id === project.authorIds[0])}
            isFavorited={favoritedProjectIds.includes(project.id)}
            onToggleFavorite={() => onToggleFavorite(project.id)}
          />
        ))}
      </div>
    </div>
  );
}

function ProjectDetailPage({ projects, users, favoritedProjectIds, onToggleFavorite }: {
  projects: Project[];
  users: User[];
  favoritedProjectIds: string[];
  onToggleFavorite: (projectId: string) => void;
}) {
  const { id } = useParams();
  const project = projects.find((item) => item.id === id) ?? projects[0];
  const [activeTab, setActiveTab] = useState('Visão geral');
  const authors = users.filter((user) => project.authorIds.includes(user.id));
  const tabs = ['Visão geral', 'Metodologia', 'Resultados', 'Arquivos', 'Autores'];

  if (!project) {
    return <NotFoundPage />;
  }

  return (
    <div className="bg-[#FAF7F2]">
      <section className="capy-hero-shell border-b-[2px] border-[#182536] text-[#FAF7F2]">
        <div className="mx-auto max-w-6xl px-6 pt-6 pb-10 md:pt-8 md:pb-16">
          <nav aria-label="Trilha" className="mb-8 flex flex-wrap items-center gap-2 text-sm text-[#DCE5EE]">
            <Link to="/projetos" className="font-semibold text-[#FFD98A] hover:underline">Projetos</Link>
            <span aria-hidden="true">/</span>
            <span className="truncate max-w-xl text-[#FAF7F2]">{project.title}</span>
          </nav>

          <div className="flex flex-wrap gap-8 md:gap-10 items-start">
            <div className="relative h-[260px] w-[260px] flex-none overflow-hidden rounded-[24px] border-[2px] solid border-[#FAF7F2] bg-[#1B8243] shadow-[8px_8px_0_#FEA402]" aria-label={project.title}>
              <svg viewBox="0 0 260 260" className="absolute inset-0 h-full w-full opacity-60" fill="none" stroke="#EAF5EE" strokeWidth="2" aria-hidden="true">
                <ellipse cx="140" cy="140" rx="30" ry="22" />
                <ellipse cx="140" cy="140" rx="70" ry="48" />
                <ellipse cx="138" cy="142" rx="115" ry="88" />
                <ellipse cx="135" cy="145" rx="160" ry="118" />
              </svg>
              <span className="absolute left-5 top-5 flex h-16 w-16 items-center justify-center rounded-2xl border-[2px] border-[#182536] bg-[#FEA402] text-[#182536]">
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><ellipse cx="12" cy="6" rx="7" ry="3"/><path d="M5 6v6c0 1.7 3 3 7 3s7-1.3 7-3V6M5 12v6c0 1.7 3 3 7 3s7-1.3 7-3v-6"/></svg>
              </span>
            </div>

            <div className="min-w-0 flex-1">
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <span className="rounded-full border-[2px] border-[#FAF7F2] bg-[#EAF0F5] px-3 py-1 text-xs font-bold text-[#1E3C61]">{project.area}</span>
                <span className="flex items-center gap-2 rounded-full border-[2px] border-[#FAF7F2] bg-[#FFF4D6] px-3 py-1 text-xs font-bold text-[#182536]">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#1B8243]" aria-hidden="true" />
                  {project.status}
                </span>
                <span className="ml-auto text-sm text-[#DCE5EE]">{project.date}</span>
              </div>

              <h1 className="max-w-3xl text-4xl font-extrabold leading-[0.95] tracking-[-0.04em] text-white md:text-5xl">{project.title}</h1>

              <div className="mt-5 flex flex-col gap-1">
                <strong className="text-xl font-bold text-[#FAF7F2]">{authors.map((author) => author.name).join(', ') || 'Equipe acadêmica'}</strong>
                <span className="text-base text-[#DCE5EE]">{project.institution}</span>
              </div>

              <p className="mt-5 max-w-3xl text-lg leading-8 text-[#EEF2F6]">{project.summary}</p>

              <div className="mt-5 flex flex-wrap items-center gap-2">
                {project.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-[#FAF7F2] px-3 py-1.5 text-sm font-semibold text-[#182536]">{tag}</span>
                ))}
                <button type="button" onClick={() => onToggleFavorite(project.id)} className="ml-auto rounded-xl border-[2px] border-[#182536] bg-[#FEA402] px-5 py-3 text-sm font-bold text-[#182536] shadow-[4px_4px_0_#FAF7F2] transition hover:-translate-y-0.5">
                  {favoritedProjectIds.includes(project.id) ? 'Salvo' : 'Favoritar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-6 pb-16 pt-8 md:pt-10">
        <div className="flex flex-wrap gap-4 border-b-[2px] border-[#182536]" role="tablist" aria-label="Seções do projeto">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={activeTab === tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-t-xl border-[2px] border-[#182536] px-5 py-3 text-sm font-bold transition ${activeTab === tab ? 'border-b-transparent bg-white text-[#182536]' : 'border-transparent bg-[#FAF7F2] text-[#56616D] hover:bg-[#EAF0F5]'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-10">
          <div className="min-w-0 flex-1">
            <div className="rounded-[24px] border-[2px] border-[#182536] bg-white p-6 shadow-[8px_8px_0_#1E3C61]">
              {activeTab === 'Visão geral' && (
                <>
                  <h2 className="text-3xl font-extrabold tracking-[-0.03em] text-[#1E3C61]">Resumo</h2>
                  <p className="mt-4 text-lg leading-8 text-[#182536]">{project.summary}</p>
                </>
              )}
              {activeTab === 'Metodologia' && <p className="text-lg leading-8 text-[#182536]">{project.methodology}</p>}
              {activeTab === 'Resultados' && (
                <ul className="space-y-3">
                  {project.keyResults.map((item) => (
                    <li key={item} className="flex items-center gap-4 rounded-2xl border-[2px] border-[#182536] bg-[#EAF5EE] p-4 text-lg font-medium shadow-[4px_4px_0_#1B8243]">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full border-[2px] border-[#182536] bg-[#1B8243] text-sm font-bold text-white">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
              {activeTab === 'Arquivos' && (
                <div className="space-y-3">
                  {project.files.map((file) => (
                    <div key={file.name} className="rounded-2xl border-[2px] border-[#182536] bg-[#FAF7F2] px-4 py-3 text-base font-medium text-[#182536]">
                      {file.name} <span className="text-[#56616D]">({file.size})</span>
                    </div>
                  ))}
                </div>
              )}
              {activeTab === 'Autores' && (
                <div className="space-y-3">
                  {authors.map((author) => (
                    <div key={author.id} className="flex items-center gap-3 rounded-2xl border-[2px] border-[#182536] bg-[#FAF7F2] p-3">
                      <img src={author.avatar || ''} alt={author.name} className="h-12 w-12 rounded-full border-[2px] border-[#182536] object-cover" />
                      <div>
                        <p className="text-lg font-bold text-[#182536]">{author.name}</p>
                        <p className="text-sm text-[#56616D]">{author.focus}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <aside className="w-full max-w-[360px]">
            <div className="rounded-[24px] border-[2px] border-[#182536] bg-white p-5 shadow-[8px_8px_0_#FEA402]">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#1E3C61]">Projeto</p>
              <h3 className="mt-4 text-3xl font-extrabold leading-tight text-[#182536]">{project.title}</h3>
              <div className="mt-4 space-y-2 text-sm text-[#56616D]">
                <p><span className="font-bold text-[#182536]">Tipo:</span> {project.type}</p>
                <p><span className="font-bold text-[#182536]">Status:</span> {project.status}</p>
                <p><span className="font-bold text-[#182536]">Período:</span> {project.period}</p>
                <p><span className="font-bold text-[#182536]">Instituição:</span> {project.institution}</p>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span key={tag} className="rounded-full border-[2px] border-[#182536] bg-[#FAF7F2] px-2.5 py-1 text-[11px] font-bold text-[#182536]">{tag}</span>
                ))}
              </div>
              {project.url && (
                <a href={project.url} target="_blank" rel="noreferrer" className="mt-5 inline-flex w-full items-center justify-center rounded-xl border-[2px] border-[#182536] bg-[#1E3C61] px-4 py-3 text-sm font-bold text-white shadow-[4px_4px_0_#FEA402] transition hover:-translate-y-0.5">
                  Abrir repositório
                </a>
              )}
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

function EventsPage({ events, registeredEventIds, onToggleRegistration }: {
  events: Event[];
  registeredEventIds: string[];
  onToggleRegistration: (eventId: string) => void;
}) {
  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#182536]">
      <section className="capy-hero-shell">
        <div className="mx-auto max-w-[1280px] px-6 py-10 md:px-12 md:py-14">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#DCE5EE]">Eventos</p>
              <h1 className="mt-2 text-4xl font-extrabold leading-tight tracking-[-0.04em] text-white md:text-5xl">Agenda acadêmica e oportunidades</h1>
            </div>
            <div className="flex items-center gap-2 rounded-full border-[2px] border-[#FAF7F2] bg-[#FAF7F2] px-3 py-2 text-sm font-semibold text-[#1E3C61] shadow-[4px_4px_0_#FEA402]">
              <Search className="h-4 w-4" />
              <span>{events.length} eventos</span>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto mt-10 max-w-[1280px] px-6 pb-16 pt-2 md:px-12">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {events.map((event) => (
            <EventCard key={event.id} event={event} isRegistered={registeredEventIds.includes(event.id)} onToggleRegistration={() => onToggleRegistration(event.id)} />
          ))}
        </div>
      </main>
    </div>
  );
}

function EventDetailPage({ events, registeredEventIds, onToggleRegistration }: {
  events: Event[];
  registeredEventIds: string[];
  onToggleRegistration: (eventId: string) => void;
}) {
  const { id } = useParams();
  const event = events.find((item) => item.id === id) ?? events[0];

  if (!event) {
    return <NotFoundPage />;
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#182536]">
      <section className="capy-hero-shell">
        <div className="mx-auto max-w-[1280px] px-6 py-10 md:px-12 md:py-14">
          <nav className="flex items-center gap-2 text-xs text-[#DCE5EE]">
            <Link to="/eventos" className="font-medium text-[#DCE5EE] hover:underline">Eventos</Link>
            <ChevronRight className="h-3.5 w-3.5 text-[#DCE5EE]/80" />
            <span className="max-w-md truncate text-[#F1F4F7]">{event.title}</span>
          </nav>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#DCE5EE]">Evento</p>
              <h1 className="mt-2 text-4xl font-extrabold leading-tight tracking-[-0.04em] text-white md:text-5xl">{event.title}</h1>
            </div>
            <span className="rounded-full border-[2px] border-[#FAF7F2] bg-[#FAF7F2] px-3 py-2 text-sm font-semibold text-[#1E3C61] shadow-[4px_4px_0_#FEA402]">
              {event.status}
            </span>
          </div>
        </div>
      </section>

      <main className="mx-auto mt-10 max-w-[1280px] px-6 pb-16 pt-2 md:px-12">
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1.4fr_0.6fr]">
          <div className="space-y-5">
            <div className="overflow-hidden rounded-[28px] border-[2px] border-[#182536] bg-white p-3 shadow-[8px_8px_0_#1B8243]">
              <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1400&auto=format&fit=crop&q=80" alt={event.title} className="h-80 w-full rounded-[22px] object-cover" />
            </div>

            <div className="rounded-[24px] border-[2px] border-[#182536] bg-white p-5 shadow-[8px_8px_0_#1E3C61]">
              <h2 className="text-2xl font-extrabold text-[#1E3C61]">Sobre o evento</h2>
              <p className="mt-3 text-sm leading-relaxed text-[#56616D]">{event.aboutText}</p>
              <div className="mt-5 space-y-3">
                {event.schedule.map((item) => (
                  <div key={`${event.id}-${item.time}-${item.title}`} className="rounded-[18px] border-[2px] border-[#182536] bg-[#FAF7F2] p-3 shadow-[4px_4px_0_#FEA402]">
                    <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#1E3C61]">{item.time}</p>
                    <p className="mt-1 text-sm font-semibold text-[#182536]">{item.title}</p>
                    <p className="text-xs text-[#56616D]">{item.speaker}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="space-y-5">
            <div className="rounded-[24px] border-[2px] border-[#182536] bg-[#FEF4D7] p-5 shadow-[8px_8px_0_#FEA402]">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1E3C61]">Resumo</p>
              <h3 className="mt-4 text-2xl font-extrabold text-[#182536]">{event.title}</h3>
              <div className="mt-4 space-y-2 text-xs text-[#56616D]">
                <p><span className="font-semibold text-[#182536]">Categoria:</span> {event.category}</p>
                <p><span className="font-semibold text-[#182536]">Status:</span> {event.status}</p>
                <p><span className="font-semibold text-[#182536]">Data:</span> {event.date}</p>
                <p><span className="font-semibold text-[#182536]">Local:</span> {event.location}</p>
                <p><span className="font-semibold text-[#182536]">Modalidade:</span> {event.modality}</p>
              </div>
              <button
                type="button"
                disabled={event.status !== 'Inscrições abertas'}
                onClick={() => onToggleRegistration(event.id)}
                className={`mt-5 w-full rounded-xl border-[2px] border-[#182536] px-4 py-2.5 text-sm font-bold ${event.status === 'Inscrições abertas' ? 'bg-[#1E3C61] text-white shadow-[4px_4px_0_#FEA402] hover:bg-[#162D49] cursor-pointer' : 'bg-[#F3F4F6] text-gray-500 cursor-not-allowed shadow-[4px_4px_0_#DDE2E6]'}`}
              >
                {registeredEventIds.includes(event.id) ? 'Inscrito' : 'Inscrever-se'}
              </button>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

function PeoplePage({ users, connectedUserIds, onToggleConnect, initialSearch }: {
  users: User[];
  connectedUserIds: string[];
  onToggleConnect: (userId: string) => void;
  initialSearch: string;
}) {
  const [searchTerm, setSearchTerm] = useState(initialSearch);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const target = `${user.name} ${user.focus} ${user.institution}`.toLowerCase();
      return target.includes(searchTerm.toLowerCase());
    });
  }, [searchTerm, users]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-[#1E3C61] font-semibold">Pessoas</p>
          <h1 className="text-3xl font-bold text-[#182536] mt-2">Conecte-se com estudantes e pesquisadores</h1>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-[#DDE2E6] bg-white px-3 py-2 text-sm text-gray-500 w-full max-w-sm">
          <Search className="w-4 h-4" />
          <input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} className="w-full bg-transparent focus:outline-none text-sm" placeholder="Buscar por nome ou foco" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredUsers.map((user) => (
          <UserCard key={user.id} user={user} isConnected={connectedUserIds.includes(user.id)} onToggleConnect={() => onToggleConnect(user.id)} />
        ))}
      </div>
    </div>
  );
}

function ProfilePage({ currentUser, users, projects, connectedUserIds, onToggleConnect, onSetFeaturedProject, onOpenNewProject }: {
  currentUser: User;
  users: User[];
  projects: Project[];
  connectedUserIds: string[];
  onToggleConnect: (userId: string) => void;
  onSetFeaturedProject: (projectId: string) => void;
  onOpenNewProject: () => void;
}) {
  const { id } = useParams();
  const profileUser = users.find((user) => user.id === id) ?? currentUser;
  const isOwnProfile = !id || id === currentUser.id;
  const visibleProjects = projects.filter((project) => project.authorIds.includes(profileUser.id));
  const featuredProject = projects.find((project) => project.id === profileUser.featuredProjectId) ?? visibleProjects[0];

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#182536]">
      <section className="capy-hero-shell overflow-hidden">
        <div className="mx-auto box-border max-w-[1344px] px-4 pb-16 pt-8 sm:px-6 md:px-12 md:pb-24 md:pt-16">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <img src={profileUser.avatar || ''} alt={profileUser.name} className="h-[200px] w-[200px] rounded-[32px] border-[3px] border-[#FAF7F2] object-cover shadow-[10px_10px_0_#FEA402] sm:h-[240px] sm:w-[240px] md:h-[280px] md:w-[280px]" />
              <div className="min-w-0">
                <h1 className="m-0 text-[clamp(2.9rem,9vw,6.5rem)] font-extrabold leading-[0.9] tracking-[-0.045em] text-white md:text-[104px]">{profileUser.name.split(' ')[0]}</h1>
                <p className="mt-2 text-base font-bold leading-[1.2] text-[#FFD98A] sm:text-[22px] md:text-[26px]">{profileUser.focus}</p>
                <p className="mt-1 text-sm text-[#DCE5EE] sm:text-base md:text-lg">{profileUser.institution}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 md:justify-end">
              {isOwnProfile ? (
                <button type="button" onClick={onOpenNewProject} className="inline-flex h-[52px] items-center gap-2 rounded-[14px] border-[2px] border-[#182536] bg-[#FEA402] px-4 text-[15px] font-bold text-[#182536] shadow-[4px_4px_0_#FAF7F2] transition hover:-translate-y-0.5 sm:px-5 sm:text-[17px]">
                  <Plus className="h-5 w-5" /> Novo projeto
                </button>
              ) : (
                <button type="button" onClick={() => onToggleConnect(profileUser.id)} className="inline-flex h-[52px] items-center rounded-[14px] border-[2px] border-[#FAF7F2] bg-transparent px-4 text-[15px] font-bold text-[#FAF7F2] shadow-[4px_4px_0_#FAF7F2] transition hover:-translate-y-0.5 sm:px-5 sm:text-[17px]">
                  {connectedUserIds.includes(profileUser.id) ? 'Conectado' : 'Conectar'}
                </button>
              )}
              <button type="button" className="inline-flex h-[52px] items-center gap-2 rounded-[14px] border-[2px] border-[#FAF7F2] bg-transparent px-4 text-[15px] font-bold text-[#FAF7F2] shadow-[4px_4px_0_#FAF7F2] transition hover:-translate-y-0.5 sm:px-5 sm:text-[17px]">
                Compartilhar portfólio
              </button>
            </div>
          </div>

          <p className="mt-8 max-w-[62ch] text-base leading-[1.6] text-[#F1F4F7] sm:text-[18px] md:text-[20px]">{profileUser.bio || 'Estudante com foco em projetos práticos, inovação e desenvolvimento de soluções digitais com impacto profissional real.'}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            {profileUser.tags.slice(0, 6).map((tag) => (
              <span key={tag} className="rounded-full border-[2px] border-[#FAF7F2] bg-transparent px-4 py-2 text-[15px] font-semibold text-[#FAF7F2]">{tag}</span>
            ))}
          </div>
        </div>
      </section>

      <main className="mx-auto -mt-14 max-w-[1344px] box-border px-4 pb-[88px] sm:px-6 md:px-12">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-[20px] border-[2px] border-[#182536] bg-white p-[18px_24px] shadow-[5px_5px_0_#1B8243]">
            <span className="text-[15px] text-[#56616D]">Curso</span>
            <strong className="mt-2 block text-[28px] font-extrabold leading-[1.1] tracking-[-0.02em] text-[#182536]">{profileUser.course}</strong>
          </div>
          <div className="rounded-[20px] border-[2px] border-[#182536] bg-white p-[18px_24px] shadow-[5px_5px_0_#FEA402]">
            <span className="text-[15px] text-[#56616D]">Período</span>
            <strong className="mt-2 block text-[28px] font-extrabold leading-[1.1] tracking-[-0.02em] text-[#182536]">{profileUser.period}</strong>
          </div>
          <div className="rounded-[20px] border-[2px] border-[#182536] bg-white p-[18px_24px] shadow-[5px_5px_0_#1E3C61]">
            <span className="text-[15px] text-[#56616D]">Conexões</span>
            <strong className="mt-2 block text-[28px] font-extrabold leading-[1.1] tracking-[-0.02em] text-[#182536]">{profileUser.connections ?? 0}</strong>
          </div>
        </div>

        {profileUser.badges && profileUser.badges.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-3">
            {profileUser.badges.map((badgeKey) => (
              <Badge key={badgeKey} type={badgeKey} />
            ))}
          </div>
        )}

        <div className="mt-10 grid grid-cols-1 gap-8 xl:grid-cols-[0.8fr_1.2fr]">
          <div className="rounded-[24px] border-[2px] border-[#182536] bg-white p-5 shadow-[8px_8px_0_#1E3C61]">
            <h3 className="text-2xl font-extrabold text-[#1E3C61]">Especialidades</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {profileUser.tags.map((tag) => (
                <span key={tag} className="rounded-full border-[2px] border-[#182536] bg-[#FAF7F2] px-3 py-1.5 text-xs font-bold text-[#182536]">{tag}</span>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            {featuredProject && (
              <div className="rounded-[24px] border-[2px] border-[#182536] bg-[#FEF4D7] p-5 shadow-[8px_8px_0_#FEA402]">
                <h3 className="text-2xl font-extrabold text-[#1E3C61]">Projeto em destaque</h3>
                <div className="mt-4 overflow-hidden rounded-[18px] border-[2px] border-[#182536] bg-white">
                  <img src={featuredProject.media || ''} alt={featuredProject.title} className="h-40 w-full object-cover" />
                </div>
                <p className="mt-3 text-lg font-bold text-[#182536]">{featuredProject.title}</p>
                <p className="text-sm text-[#56616D]">{featuredProject.area}</p>
                {isOwnProfile && (
                  <button type="button" onClick={() => onSetFeaturedProject(featuredProject.id)} className="mt-3 text-sm font-bold text-[#1E3C61] hover:underline">
                    Atualizar destaque
                  </button>
                )}
              </div>
            )}

            <div className="rounded-[24px] border-[2px] border-[#182536] bg-white p-5 shadow-[8px_8px_0_#1B8243]">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-2xl font-extrabold text-[#182536]">Outros projetos</h3>
                {isOwnProfile && visibleProjects.length > 0 && (
                  <button type="button" onClick={onOpenNewProject} className="text-sm font-bold text-[#1E3C61] hover:underline">Adicionar projeto</button>
                )}
              </div>

              {visibleProjects.length === 0 ? (
                <div className="mt-8 rounded-[20px] border-[2px] border-dashed border-[#DDE2E6] bg-[#FAF7F2] p-8 text-center">
                  <p className="text-base text-[#56616D]">Você ainda não publicou nenhum projeto.</p>
                  {isOwnProfile && (
                    <button type="button" onClick={onOpenNewProject} className="capy-cta mt-5 px-5 py-3 text-sm font-bold text-[#182536]">
                      Criar meu primeiro projeto
                    </button>
                  )}
                </div>
              ) : (
                <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                  {visibleProjects.map((project) => (
                    <div key={project.id} className="rounded-[20px] border-[2px] border-[#182536] bg-[#FAF7F2] p-4">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#1E3C61]">{project.status}</span>
                        {profileUser.featuredProjectId === project.id && <span className="text-[10px] font-bold text-[#1B8243]">Destaque</span>}
                      </div>
                      <p className="mt-3 text-lg font-bold text-[#182536]">{project.title}</p>
                      <p className="mt-1 text-xs text-[#56616D]">{project.area}</p>
                      <div className="mt-4 flex gap-2">
                        <Link to={`/projeto/${project.id}`} className="flex-1 rounded-xl border-[2px] border-[#182536] bg-[#1E3C61] px-3 py-2 text-center text-xs font-bold text-white">Abrir</Link>
                        {isOwnProfile && (
                          <button type="button" onClick={() => onSetFeaturedProject(project.id)} className="rounded-xl border-[2px] border-[#182536] bg-white px-3 py-2 text-xs font-bold text-[#1E3C61]">
                            Destaque
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function NotFoundPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-16 text-center">
      <h1 className="text-4xl font-bold text-[#1E3C61]">Página não encontrada</h1>
      <p className="mt-3 text-gray-600">A rota que você tentou acessar não existe ou foi removida.</p>
      <Link to="/feed" className="mt-6 inline-block rounded-lg bg-[#1E3C61] text-white px-5 py-3 text-sm font-semibold hover:bg-[#162D49]">Voltar ao feed</Link>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppDataProvider>
          <ToastProvider>
            <AppShell />
          </ToastProvider>
        </AppDataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
