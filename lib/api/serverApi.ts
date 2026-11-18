import { cookies } from 'next/headers';
import type { AxiosResponse } from 'axios';
import { api } from './api';
import type { Note } from '@/types/note';
import type { User } from '@/types/user';

interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

interface CheckSessionResponse {
  success: boolean;
}

async function getCookieHeader() {
  const cookieStore = await cookies();
  return { Cookie: cookieStore.toString() };
}

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
    headers: await getCookieHeader(),
  });
  return data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const { data } = await api.get<Note>(`/notes/${id}`, {
    headers: await getCookieHeader(),
  });
  return data;
}

export async function getMe(): Promise<User> {
  const { data } = await api.get<User>('/users/me', {
    headers: await getCookieHeader(),
  });
  return data;
}

export async function checkSession(): Promise<
  AxiosResponse<CheckSessionResponse>
> {
  return api.get<CheckSessionResponse>('/auth/session', {
    headers: await getCookieHeader(),
  });
}
