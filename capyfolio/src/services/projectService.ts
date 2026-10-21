import type { Project } from '../types';
import projectsData from '../data/projects.json';

const STORAGE_KEY = 'capyfolio_projects';

const readProjects = async (): Promise<Project[]> => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    return JSON.parse(raw) as Project[];
  }
  const seeded = projectsData as Project[];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
  return seeded;
};

export const projectService = {
  async list(): Promise<Project[]> {
    return readProjects();
  },

  async getById(id: string): Promise<Project | undefined> {
    const projects = await readProjects();
    return projects.find((project) => project.id === id);
  },

  async create(project: Project): Promise<Project> {
    const projects = await readProjects();
    projects.unshift(project);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    return project;
  },

  async update(project: Project): Promise<Project> {
    const projects = await readProjects();
    const index = projects.findIndex((entry) => entry.id === project.id);
    if (index === -1) return project;
    projects[index] = project;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    return project;
  },

  async remove(id: string): Promise<void> {
    const projects = await readProjects();
    const filtered = projects.filter((project) => project.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  },
};
