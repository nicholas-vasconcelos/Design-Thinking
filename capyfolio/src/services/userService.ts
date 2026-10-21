import type { User } from '../types';
import usersData from '../data/users.json';
import arthurAvatar from '../assets/artur.png';

const STORAGE_KEY = 'capyfolio_users';

const REQUIRED_USERS: User[] = [
  {
    id: 'u-test',
    name: 'Usuário de Teste',
    focus: 'Desenvolvimento Web e Design',
    institution: 'Universidade de Teste',
    shortInstitution: 'UT',
    course: 'Engenharia de Software',
    period: '4º Período',
    location: 'São Paulo, SP',
    bio: 'Conta de teste do CapyFolio para validação de login, feed e navegação da aplicação.',
    tags: ['React', 'TypeScript', 'Design', 'UX', 'Pesquisa'],
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    featuredProjectId: null,
    email: 'teste@capyfolio.com',
    password: '123456',
    github: 'github.com/teste-capyfolio',
    linkedin: 'linkedin.com/in/teste-capyfolio',
    lattes: 'lattes.cnpq.br/testecapyfolio',
    connections: 24,
  },
  {
    id: 'u_arthur',
    name: 'Arthur',
    role: 'Estudante de Engenharia de Software',
    focus: 'Fullstack & IA',
    institution: 'Ibmec Rio',
    shortInstitution: 'Ibmec',
    course: 'Engenharia de Software',
    period: '2º Período',
    location: 'Barra da Tijuca, RJ',
    bio: 'Estudante de Engenharia de Software no Ibmec (Barra da Tijuca). Ambicioso, focado em carreira e em transformar projetos acadêmicos e práticos em visibilidade e oportunidades profissionais reais.',
    tags: ['React', 'Node.js', 'Python', 'LLMs', 'GitHub', 'TypeScript'],
    badges: ['tech', 'career', 'academic', 'verified'],
    avatar: '/src/assets/artur.png',
    featuredProjectId: 'p_arthur_1',
    email: 'arthur@ibmec.br',
    password: '123456',
    github: 'github.com/arthur',
    linkedin: 'linkedin.com/in/arthur',
    lattes: 'lattes.cnpq.br/arthur',
    connections: 88,
  },
];

const normalizeUserAvatar = (user: User): User => {
  if (user.id === 'u_arthur' && (!user.avatar || /artur\.png/i.test(user.avatar))) {
    return { ...user, avatar: arthurAvatar };
  }

  return user;
};

const ensureRequiredUsers = (users: User[]): User[] => {
  const result = [...users].map(normalizeUserAvatar);

  for (const required of REQUIRED_USERS) {
    const normalizedRequired = normalizeUserAvatar(required);
    const alreadyExists = result.some((user) => {
      const sameId = user.id === normalizedRequired.id;
      const sameEmail = user.email?.toLowerCase() === normalizedRequired.email.toLowerCase();
      return sameId || sameEmail;
    });

    if (!alreadyExists) {
      result.push(normalizedRequired);
    }
  }

  return result;
};

const readUsers = async (): Promise<User[]> => {
  const raw = localStorage.getItem(STORAGE_KEY);
  const seeded = raw ? (JSON.parse(raw) as User[]) : (usersData as User[]);
  const withRequiredUsers = ensureRequiredUsers(seeded);

  if (withRequiredUsers.length !== seeded.length) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(withRequiredUsers));
  }

  return withRequiredUsers;
};

export const userService = {
  async list(): Promise<User[]> {
    return readUsers();
  },

  async getById(id: string): Promise<User | undefined> {
    const users = await readUsers();
    return users.find((user) => user.id === id);
  },

  async getByEmail(email: string): Promise<User | undefined> {
    const users = await readUsers();
    return users.find((user) => user.email.toLowerCase() === email.toLowerCase());
  },

  async create(user: User): Promise<User> {
    const users = await readUsers();
    users.push(user);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    return user;
  },

  async update(user: User): Promise<User> {
    const users = await readUsers();
    const index = users.findIndex((entry) => entry.id === user.id);
    if (index === -1) return user;
    users[index] = user;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    return user;
  },

  async replaceAll(users: User[]): Promise<User[]> {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    return users;
  },
};
