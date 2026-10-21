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
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-[#1E3C61] font-semibold">Feed acadêmico</p>
          <h1 className="text-3xl font-bold text-[#182536] mt-2">Bem-vindo, {currentUser.name}</h1>
        </div>
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => onOpenCreateModal('post')} className="px-4 py-2 rounded-lg border border-[#CBD3DA] bg-white text-[#1E3C61] text-sm font-semibold hover:bg-gray-50 cursor-pointer">
            Nova postagem
          </button>
          <button type="button" onClick={() => onOpenCreateModal('project')} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1E3C61] text-white text-sm font-semibold hover:bg-[#162D49] cursor-pointer">
            <Plus className="w-4 h-4" /> Publicar projeto
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-5">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} currentUserName={currentUser.name} onToggleLike={() => onToggleLike(post.id)} onAddComment={(text) => onAddComment(post.id, text)} />
          ))}
        </div>

        <aside className="space-y-5">
          <div className="bg-white border border-[#DDE2E6] rounded-2xl p-5">
            <h3 className="text-sm font-bold text-[#1E3C61]">Projetos em destaque</h3>
            <div className="mt-4 space-y-3">
              {projects.slice(0, 3).map((project) => (
                <div key={project.id} className="flex items-center gap-3 rounded-xl bg-[#FAF7F2] border border-[#DDE2E6] p-3">
                  <img src={project.media || ''} alt={project.title} className="w-12 h-12 rounded-lg object-cover border border-[#DDE2E6]" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-[#182536] truncate">{project.title}</p>
                    <p className="text-[11px] text-gray-500">{project.area}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-[#DDE2E6] rounded-2xl p-5">
            <h3 className="text-sm font-bold text-[#1E3C61]">Próximos eventos</h3>
            <div className="mt-4 space-y-3">
              {events.slice(0, 3).map((event) => (
                <div key={event.id} className="rounded-xl bg-[#FAF7F2] border border-[#DDE2E6] p-3">
                  <p className="text-sm font-semibold text-[#182536]">{event.title}</p>
                  <p className="text-[11px] text-gray-500 mt-1">{event.date} • {event.city}</p>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
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
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
      <nav className="flex items-center gap-2 text-xs text-gray-500">
        <Link to="/projetos" className="text-[#1E3C61] hover:underline font-medium">Projetos</Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-gray-600 truncate max-w-md">{project.title}</span>
      </nav>

      <div className="grid grid-cols-1 xl:grid-cols-[1.4fr_0.6fr] gap-8">
        <div className="space-y-6">
          <div className="rounded-3xl overflow-hidden border border-[#DDE2E6] bg-white p-3">
            <img src={project.media || ''} alt={project.title} className="w-full h-80 object-cover rounded-2xl" />
          </div>

          <div className="bg-white border border-[#DDE2E6] rounded-2xl p-5">
            <div className="flex flex-wrap gap-2 border-b border-[#DDE2E6] pb-3">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-2 text-xs font-semibold rounded-full ${activeTab === tab ? 'bg-[#1E3C61] text-white' : 'bg-[#FAF7F2] text-gray-600 border border-[#DDE2E6]'}`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="mt-5 text-sm text-gray-700 leading-7">
              {activeTab === 'Visão geral' && (
                <>
                  <p>{project.summary}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span key={tag} className="bg-[#FAF7F2] border border-[#DDE2E6] px-2 py-1 rounded-full text-[10px] text-gray-600">{tag}</span>
                    ))}
                  </div>
                </>
              )}
              {activeTab === 'Metodologia' && <p>{project.methodology}</p>}
              {activeTab === 'Resultados' && <ul className="list-disc pl-5 space-y-2">{project.keyResults.map((item) => <li key={item}>{item}</li>)}</ul>}
              {activeTab === 'Arquivos' && (
                <div className="space-y-2">
                  {project.files.map((file) => (
                    <div key={file.name} className="rounded-xl border border-[#DDE2E6] bg-[#FAF7F2] px-3 py-2">
                      {file.name} <span className="text-gray-500">({file.size})</span>
                    </div>
                  ))}
                </div>
              )}
              {activeTab === 'Autores' && (
                <div className="space-y-3">
                  {authors.map((author) => (
                    <div key={author.id} className="flex items-center gap-3 rounded-xl border border-[#DDE2E6] p-3 bg-[#FAF7F2]">
                      <img src={author.avatar || ''} alt={author.name} className="w-10 h-10 rounded-full object-cover" />
                      <div>
                        <p className="font-semibold text-[#182536]">{author.name}</p>
                        <p className="text-xs text-gray-500">{author.focus}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <aside className="space-y-5">
          <div className="bg-white border border-[#DDE2E6] rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.18em] text-[#1E3C61] font-semibold">Projeto</p>
              <button type="button" onClick={() => onToggleFavorite(project.id)} className="inline-flex items-center gap-2 text-xs font-medium text-[#1E3C61] cursor-pointer">
                <CheckCircle2 className={`w-4 h-4 ${favoritedProjectIds.includes(project.id) ? 'fill-[#1E3C61] text-[#1E3C61]' : ''}`} />
                {favoritedProjectIds.includes(project.id) ? 'Salvo' : 'Salvar'}
              </button>
            </div>
            <h2 className="mt-4 text-2xl font-bold text-[#182536] leading-tight">{project.title}</h2>
            <p className="mt-3 text-sm text-gray-600">{project.shortDescription}</p>
            <div className="mt-4 space-y-2 text-xs text-gray-600">
              <p><span className="font-semibold text-[#182536]">Instituição:</span> {project.institution}</p>
              <p><span className="font-semibold text-[#182536]">Tipo:</span> {project.type}</p>
              <p><span className="font-semibold text-[#182536]">Status:</span> {project.status}</p>
              <p><span className="font-semibold text-[#182536]">Período:</span> {project.period}</p>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-[#FAF7F2] border border-[#DDE2E6] px-2 py-1 text-[10px] text-gray-600">{tag}</span>
              ))}
            </div>
            {project.url && (
              <a href={project.url} target="_blank" rel="noreferrer" className="mt-5 inline-flex w-full justify-center rounded-lg bg-[#1E3C61] text-white px-4 py-2.5 text-sm font-semibold hover:bg-[#162D49]">
                Abrir repositório
              </a>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

function EventsPage({ events, registeredEventIds, onToggleRegistration }: {
  events: Event[];
  registeredEventIds: string[];
  onToggleRegistration: (eventId: string) => void;
}) {
  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-[#1E3C61] font-semibold">Eventos</p>
          <h1 className="text-3xl font-bold text-[#182536] mt-2">Agenda acadêmica e oportunidades</h1>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-[#DDE2E6] bg-white px-3 py-2 text-sm text-gray-500">
          <Search className="w-4 h-4" />
          <span>{events.length} eventos</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {events.map((event) => (
          <EventCard key={event.id} event={event} isRegistered={registeredEventIds.includes(event.id)} onToggleRegistration={() => onToggleRegistration(event.id)} />
        ))}
      </div>
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
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
      <nav className="flex items-center gap-2 text-xs text-gray-500">
        <Link to="/eventos" className="text-[#1E3C61] hover:underline font-medium">Eventos</Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-gray-600 truncate max-w-md">{event.title}</span>
      </nav>

      <div className="grid grid-cols-1 xl:grid-cols-[1.4fr_0.6fr] gap-8">
        <div className="space-y-5">
          <div className="rounded-3xl overflow-hidden border border-[#DDE2E6] bg-white p-3">
            <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1400&auto=format&fit=crop&q=80" alt={event.title} className="w-full h-80 object-cover rounded-2xl" />
          </div>

          <div className="bg-white border border-[#DDE2E6] rounded-2xl p-5">
            <h2 className="text-2xl font-bold text-[#182536]">{event.title}</h2>
            <p className="mt-3 text-sm text-gray-600 leading-relaxed">{event.aboutText}</p>
            <div className="mt-5 space-y-3">
              {event.schedule.map((item) => (
                <div key={`${event.id}-${item.time}-${item.title}`} className="rounded-xl border border-[#DDE2E6] bg-[#FAF7F2] p-3">
                  <p className="text-xs font-semibold text-[#1E3C61]">{item.time}</p>
                  <p className="mt-1 text-sm font-semibold text-[#182536]">{item.title}</p>
                  <p className="text-xs text-gray-500">{item.speaker}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="space-y-5">
          <div className="bg-white border border-[#DDE2E6] rounded-2xl p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-[#1E3C61] font-semibold">Evento</p>
            <h3 className="mt-4 text-2xl font-bold text-[#182536]">{event.title}</h3>
            <div className="mt-4 space-y-2 text-xs text-gray-600">
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
              className={`mt-5 w-full rounded-lg px-4 py-2.5 text-sm font-semibold ${event.status === 'Inscrições abertas' ? 'bg-[#1E3C61] text-white hover:bg-[#162D49] cursor-pointer' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
            >
              {registeredEventIds.includes(event.id) ? 'Inscrito' : 'Inscrever-se'}
            </button>
          </div>
        </aside>
      </div>
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
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="bg-white border border-[#DDE2E6] rounded-3xl p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex items-center gap-4">
            <img src={profileUser.avatar || ''} alt={profileUser.name} className="w-20 h-20 rounded-full object-cover border border-[#DDE2E6]" />
            <div>
              <h1 className="text-3xl font-bold text-[#182536]">{profileUser.name}</h1>
              <p className="text-sm text-[#1E3C61] font-medium">{profileUser.focus}</p>
              <p className="text-sm text-gray-500 mt-1">{profileUser.institution}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {isOwnProfile ? (
              <button type="button" onClick={onOpenNewProject} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1E3C61] text-white text-sm font-semibold hover:bg-[#162D49] cursor-pointer">
                <Plus className="w-4 h-4" /> Novo projeto
              </button>
            ) : (
              <button type="button" onClick={() => onToggleConnect(profileUser.id)} className="px-4 py-2 rounded-lg border border-[#CBD3DA] bg-white text-[#1E3C61] text-sm font-semibold hover:bg-gray-50 cursor-pointer">
                {connectedUserIds.includes(profileUser.id) ? 'Conectado' : 'Conectar'}
              </button>
            )}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-600">
          <div className="rounded-2xl bg-[#FAF7F2] border border-[#DDE2E6] p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-gray-500">Curso</p>
            <p className="mt-2 font-semibold text-[#182536]">{profileUser.course}</p>
          </div>
          <div className="rounded-2xl bg-[#FAF7F2] border border-[#DDE2E6] p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-gray-500">Período</p>
            <p className="mt-2 font-semibold text-[#182536]">{profileUser.period}</p>
          </div>
          <div className="rounded-2xl bg-[#FAF7F2] border border-[#DDE2E6] p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-gray-500">Conexões</p>
            <p className="mt-2 font-semibold text-[#182536]">{profileUser.connections ?? 0}</p>
          </div>
        </div>

        <div className="mt-6 text-sm text-gray-600 leading-relaxed">{profileUser.bio}</div>

        {profileUser.badges && profileUser.badges.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {profileUser.badges.map((badgeKey) => (
              <Badge key={badgeKey} type={badgeKey} />
            ))}
          </div>
        )}
      </div>

      <div className="mt-8 grid grid-cols-1 xl:grid-cols-[0.8fr_1.2fr] gap-8">
        <div className="space-y-6">
          <div className="bg-white border border-[#DDE2E6] rounded-2xl p-5">
            <h3 className="text-sm font-bold text-[#1E3C61]">Especialidades</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {profileUser.tags.map((tag) => (
                <span key={tag} className="bg-[#FAF7F2] border border-[#DDE2E6] px-2 py-1 rounded-full text-[10px] text-gray-600">{tag}</span>
              ))}
            </div>
          </div>

          {featuredProject && (
            <div className="bg-white border border-[#DDE2E6] rounded-2xl p-5">
              <h3 className="text-sm font-bold text-[#1E3C61]">Projeto em destaque</h3>
              <div className="mt-4 rounded-2xl overflow-hidden border border-[#DDE2E6]">
                <img src={featuredProject.media || ''} alt={featuredProject.title} className="w-full h-40 object-cover" />
              </div>
              <p className="mt-3 text-sm font-semibold text-[#182536]">{featuredProject.title}</p>
              <p className="mt-1 text-xs text-gray-500">{featuredProject.area}</p>
              {isOwnProfile && (
                <button type="button" onClick={() => onSetFeaturedProject(featuredProject.id)} className="mt-3 text-xs font-semibold text-[#1E3C61] hover:underline cursor-pointer">
                  Atualizar destaque
                </button>
              )}
            </div>
          )}
        </div>

        <div className="bg-white border border-[#DDE2E6] rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#182536]">Outros projetos</h3>
            {isOwnProfile && visibleProjects.length > 0 && (
              <button type="button" onClick={onOpenNewProject} className="text-xs font-semibold text-[#1E3C61] hover:underline cursor-pointer">Adicionar projeto</button>
            )}
          </div>

          {visibleProjects.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-dashed border-[#DDE2E6] bg-[#FAF7F2] p-8 text-center">
              <p className="text-sm text-gray-600">Você ainda não publicou nenhum projeto.</p>
              {isOwnProfile && (
                <button type="button" onClick={onOpenNewProject} className="mt-4 px-4 py-2 rounded-lg bg-[#1E3C61] text-white text-sm font-semibold hover:bg-[#162D49] cursor-pointer">
                  Criar meu primeiro projeto
                </button>
              )}
            </div>
          ) : (
            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
              {visibleProjects.map((project) => (
                <div key={project.id} className="rounded-2xl border border-[#DDE2E6] bg-[#FAF7F2] p-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#1E3C61]">{project.status}</span>
                    {profileUser.featuredProjectId === project.id && <span className="text-[10px] font-semibold text-[#1B8243]">Destaque</span>}
                  </div>
                  <p className="mt-3 text-sm font-semibold text-[#182536]">{project.title}</p>
                  <p className="mt-1 text-[11px] text-gray-500">{project.area}</p>
                  <div className="mt-4 flex gap-2">
                    <Link to={`/projeto/${project.id}`} className="flex-1 rounded-lg bg-[#1E3C61] text-white px-3 py-2 text-xs font-semibold text-center hover:bg-[#162D49]">Abrir</Link>
                    {isOwnProfile && (
                      <button type="button" onClick={() => onSetFeaturedProject(project.id)} className="rounded-lg border border-[#CBD3DA] bg-white px-3 py-2 text-xs font-semibold text-[#1E3C61] hover:bg-gray-50 cursor-pointer">
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
