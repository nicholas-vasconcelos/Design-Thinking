import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { Event, Post, Project, User } from '../types';
import { userService } from '../services/userService';
import { projectService } from '../services/projectService';
import { eventService } from '../services/eventService';
import { postService } from '../services/postService';

type AppDataContextType = {
  users: User[];
  projects: Project[];
  events: Event[];
  posts: Post[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  setEvents: React.Dispatch<React.SetStateAction<Event[]>>;
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
  refreshData: () => Promise<void>;
};

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);

  const refreshData = async () => {
    const [userList, projectList, eventList, postList] = await Promise.all([
      userService.list(),
      projectService.list(),
      eventService.list(),
      postService.list(),
    ]);

    setUsers(userList);
    setProjects(projectList);
    setEvents(eventList);
    setPosts(postList);
  };

  useEffect(() => {
    refreshData();
  }, []);

  const value = useMemo<AppDataContextType>(
    () => ({
      users,
      projects,
      events,
      posts,
      setUsers,
      setProjects,
      setEvents,
      setPosts,
      refreshData,
    }),
    [users, projects, events, posts],
  );

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error('useAppData must be used within an AppDataProvider');
  }
  return context;
}
