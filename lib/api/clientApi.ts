import { api } from './api';
import type { NewNote, Note } from '@/types/note';
import type { User } from '@/types/user';

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface AuthRequest {
  email: string;
  password: string;
}

export interface CheckSessionResponse {
  success: boolean;
}

export type UpdateMeRequest = Partial<Pick<User, 'username'>>;

export async function fetchNotes(
  page: number,
  search?: string,
  tag?: string
): Promise<FetchNotesResponse> {
  const { data } = await api.get<FetchNotesResponse>('/notes', {
    params: {
      page,
      perPage: 12,
      ...(search ? { search } : {}),
      ...(tag && tag !== 'all' ? { tag } : {}),
    },
  });
  return data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const { data } = await api.get<Note>(`/notes/${id}`);
  return data;
}

export async function createNote(noteData: NewNote): Promise<Note> {
  const { data } = await api.post<Note>('/notes', noteData);
  return data;
}

export async function deleteNote(id: string): Promise<Note> {
  const { data } = await api.delete<Note>(`/notes/${id}`);
  return data;
}

export async function register(body: AuthRequest): Promise<User> {
  const { data } = await api.post<User>('/auth/register', body);
  return data;
}

export async function login(body: AuthRequest): Promise<User> {
  const { data } = await api.post<User>('/auth/login', body);
  return data;
}

export async function logout(): Promise<void> {
  await api.post('/auth/logout');
}

export async function checkSession(): Promise<boolean> {
  const { data } = await api.get<CheckSessionResponse>('/auth/session');
  return data.success;
}

export async function getMe(): Promise<User> {
  const { data } = await api.get<User>('/users/me');
  return data;
}

export async function updateMe(body: UpdateMeRequest): Promise<User> {
  const { data } = await api.patch<User>('/users/me', body);
  return data;
}
