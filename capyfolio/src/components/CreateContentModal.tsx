import { X } from 'lucide-react';
import { useState } from 'react';
import type { Project, User } from '../types';

export function CreateContentModal({
  currentUser,
  projects,
  defaultTab,
  onClose,
  onSubmitPost,
  onSubmitProject,
}: {
  currentUser: User;
  projects: Project[];
  defaultTab: 'project' | 'post';
  onClose: () => void;
  onSubmitPost: (data: { category: string; content: string; relatedProjectId?: string | null }) => void;
  onSubmitProject: (data: {
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
  }) => void;
}) {
  const [activeTab, setActiveTab] = useState<'project' | 'post'>(defaultTab || 'project');
  const [postDraft, setPostDraft] = useState({ category: 'Pesquisa Acadêmica', content: '' });
  const [projectDraft, setProjectDraft] = useState({
    title: '',
    shortDescription: '',
    summary: '',
    area: 'Dados e Análise',
    type: 'Projeto de pesquisa',
    status: 'Em andamento',
    period: '2025 - 2026',
    tags: 'Python, Dados e Análise',
    url: '',
    setAsFeatured: false,
    keyResults: [''],
  });

  const submitProject = () => {
    const tags = projectDraft.tags.split(',').map((t) => t.trim()).filter(Boolean);
    const keyResults = projectDraft.keyResults.map((value) => value.trim()).filter(Boolean);
    onSubmitProject({
      title: projectDraft.title.trim(),
      shortDescription: projectDraft.shortDescription.trim(),
      summary: projectDraft.summary.trim() || projectDraft.shortDescription.trim(),
      area: projectDraft.area,
      type: projectDraft.type,
      status: projectDraft.status,
      period: projectDraft.period,
      tags,
      url: projectDraft.url.trim(),
      setAsFeatured: projectDraft.setAsFeatured,
      keyResults,
    });
  };

  return (
    <div className="fixed inset-0 bg-[#182536]/35 backdrop-blur-[2px] flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl border border-[#DDE2E6] w-full max-w-2xl shadow-[0_20px_60px_rgba(0,0,0,0.12)] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#DDE2E6]">
          <div>
            <h3 className="text-lg font-bold text-[#1E3C61]">Publicar conteúdo</h3>
            <p className="text-xs text-gray-500">Compartilhe uma atualização ou um novo projeto acadêmico.</p>
          </div>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex border-b border-[#DDE2E6] px-6 pt-3">
          <button type="button" onClick={() => setActiveTab('project')} className={`px-4 py-2 text-sm font-semibold rounded-t-xl border-b-2 ${activeTab === 'project' ? 'border-[#1E3C61] text-[#1E3C61]' : 'border-transparent text-gray-500'}`}>
            Projeto
          </button>
          <button type="button" onClick={() => setActiveTab('post')} className={`px-4 py-2 text-sm font-semibold rounded-t-xl border-b-2 ${activeTab === 'post' ? 'border-[#1E3C61] text-[#1E3C61]' : 'border-transparent text-gray-500'}`}>
            Postagem
          </button>
        </div>

        {activeTab === 'project' ? (
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#182536] mb-1.5">Título do projeto</label>
              <input value={projectDraft.title} onChange={(event) => setProjectDraft((current) => ({ ...current, title: event.target.value }))} className="w-full bg-white border border-[#CBD3DA] rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#1E3C61]" placeholder="Ex: Observatório de dados urbanos e climáticos" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#182536] mb-1.5">Resumo curto</label>
              <input value={projectDraft.shortDescription} onChange={(event) => setProjectDraft((current) => ({ ...current, shortDescription: event.target.value }))} className="w-full bg-white border border-[#CBD3DA] rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#1E3C61]" placeholder="Descreva o contexto e a contribuição do projeto." />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#182536] mb-1.5">Descrição detalhada</label>
              <textarea value={projectDraft.summary} onChange={(event) => setProjectDraft((current) => ({ ...current, summary: event.target.value }))} rows={4} className="w-full bg-white border border-[#CBD3DA] rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#1E3C61]" placeholder="Descreva a metodologia, objetivos e principais resultados esperados." />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#182536] mb-1.5">Área</label>
                <input value={projectDraft.area} onChange={(event) => setProjectDraft((current) => ({ ...current, area: event.target.value }))} className="w-full bg-white border border-[#CBD3DA] rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#1E3C61]" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#182536] mb-1.5">Tipo</label>
                <input value={projectDraft.type} onChange={(event) => setProjectDraft((current) => ({ ...current, type: event.target.value }))} className="w-full bg-white border border-[#CBD3DA] rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#1E3C61]" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#182536] mb-1.5">Status</label>
                <select value={projectDraft.status} onChange={(event) => setProjectDraft((current) => ({ ...current, status: event.target.value }))} className="w-full bg-white border border-[#CBD3DA] rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#1E3C61]">
                  <option>Em andamento</option>
                  <option>Concluído</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#182536] mb-1.5">Período</label>
                <input value={projectDraft.period} onChange={(event) => setProjectDraft((current) => ({ ...current, period: event.target.value }))} className="w-full bg-white border border-[#CBD3DA] rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#1E3C61]" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#182536] mb-1.5">Tags</label>
              <input value={projectDraft.tags} onChange={(event) => setProjectDraft((current) => ({ ...current, tags: event.target.value }))} className="w-full bg-white border border-[#CBD3DA] rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#1E3C61]" placeholder="Python, IA, Dados, Pesquisa" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#182536] mb-1.5">URL externa</label>
              <input value={projectDraft.url} onChange={(event) => setProjectDraft((current) => ({ ...current, url: event.target.value }))} className="w-full bg-white border border-[#CBD3DA] rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#1E3C61]" placeholder="https://github.com/seu-projeto" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#182536] mb-1.5">Principais resultados</label>
              {projectDraft.keyResults.map((result, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    value={result}
                    onChange={(event) => {
                      const next = [...projectDraft.keyResults];
                      next[index] = event.target.value;
                      setProjectDraft((current) => ({ ...current, keyResults: next }));
                    }}
                    className="flex-1 bg-white border border-[#CBD3DA] rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#1E3C61]"
                    placeholder="Resultado-chave"
                  />
                  <button type="button" onClick={() => setProjectDraft((current) => ({ ...current, keyResults: current.keyResults.filter((_, i) => i !== index) }))} className="px-2 rounded-lg border border-[#CBD3DA] text-gray-500 hover:bg-gray-50 cursor-pointer">–</button>
                </div>
              ))}
              <button type="button" onClick={() => setProjectDraft((current) => ({ ...current, keyResults: [...current.keyResults, ''] }))} className="text-xs font-semibold text-[#1E3C61] hover:underline cursor-pointer">+ Adicionar resultado</button>
            </div>
            <label className="inline-flex items-center gap-2 text-sm text-[#182536]">
              <input type="checkbox" checked={projectDraft.setAsFeatured} onChange={(event) => setProjectDraft((current) => ({ ...current, setAsFeatured: event.target.checked }))} className="w-4 h-4 accent-[#1E3C61]" />
              Definir como projeto em destaque no meu perfil
            </label>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-lg border border-[#CBD3DA] text-sm font-medium text-gray-600 hover:bg-gray-50 cursor-pointer">Cancelar</button>
              <button type="button" onClick={submitProject} className="px-5 py-2.5 rounded-lg bg-[#1E3C61] hover:bg-[#162D49] text-white text-sm font-semibold cursor-pointer">Publicar projeto</button>
            </div>
          </div>
        ) : (
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#182536] mb-1.5">Categoria</label>
              <select value={postDraft.category} onChange={(event) => setPostDraft((current) => ({ ...current, category: event.target.value }))} className="w-full bg-white border border-[#CBD3DA] rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#1E3C61]">
                <option>Palestra Oficial</option>
                <option>Pesquisa Acadêmica</option>
                <option>Dados e Análise</option>
                <option>Visão Computacional</option>
                <option>Engenharia de Software</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#182536] mb-1.5">Conteúdo</label>
              <textarea value={postDraft.content} onChange={(event) => setPostDraft((current) => ({ ...current, content: event.target.value }))} rows={6} className="w-full bg-white border border-[#CBD3DA] rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#1E3C61]" placeholder="Compartilhe uma atualização, resultado ou oportunidade acadêmica..." />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-lg border border-[#CBD3DA] text-sm font-medium text-gray-600 hover:bg-gray-50 cursor-pointer">Cancelar</button>
              <button type="button" onClick={() => { if (postDraft.content.trim()) { onSubmitPost({ category: postDraft.category, content: postDraft.content.trim() }); } }} className="px-5 py-2.5 rounded-lg bg-[#1E3C61] hover:bg-[#162D49] text-white text-sm font-semibold cursor-pointer">Publicar atualização</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
