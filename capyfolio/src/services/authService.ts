import type { User } from '../types';
import { userService } from './userService';

const SESSION_KEY = 'capyfolio_session_user';

export const authService = {
  async login(email: string, password: string): Promise<User | null> {
    const user = await userService.getByEmail(email);
    if (!user || !user.password) return null;
    if (user.password !== password) return null;
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    return user;
  },

  async register(data: {
    name: string;
    email: string;
    password: string;
    institution: string;
    course: string;
    period: string;
    focus: string;
    tags: string[];
    bio: string;
  }): Promise<User> {
    const existing = await userService.getByEmail(data.email);
    if (existing) {
      throw new Error('EMAIL_TAKEN');
    }

    const user: User = {
      id: `u-${Date.now()}`,
      name: data.name,
      focus: data.focus,
      institution: data.institution,
      shortInstitution: data.institution.split(' ')[0] || 'UFRJ',
      course: data.course,
      period: data.period,
      location: 'Rio de Janeiro, RJ',
      bio: data.bio || 'Estudante universitário desenvolvendo projetos de pesquisa e tecnologia no CapyFolio.',
      tags: data.tags.length ? data.tags : ['Python', 'Pesquisa Acadêmica', 'Dados e Análise'],
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80',
      featuredProjectId: null,
      email: data.email,
      password: data.password,
      github: 'github.com/estudante-capyfolio',
      linkedin: 'linkedin.com/in/estudante-capyfolio',
      lattes: 'lattes.cnpq.br/0000000000',
      connections: 1,
    };

    await userService.create(user);
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    return user;
  },

  async logout(): Promise<void> {
    localStorage.removeItem(SESSION_KEY);
  },

  async getCurrentUser(): Promise<User | null> {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  },
};
