import type { Metadata } from 'next';
import { fetchNotes } from '@/lib/api/serverApi';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import NotesClient from './Notes.client';

interface NotesByTagPageProps {
  params: Promise<{ slug: string[] }>;
}

export async function generateMetadata({
  params,
}: NotesByTagPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tag = slug[0] ?? 'all';
  const filterName = tag === 'all' ? 'All notes' : `${tag} notes`;
  const title = `${filterName} | NoteHub`;
  const description =
    tag === 'all'
      ? 'Browse all your notes in NoteHub.'
      : `Browse your notes tagged "${tag}" in NoteHub.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `/notes/filter/${tag}`,
      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
  };
}

export default async function NotesByTagPage({ params }: NotesByTagPageProps) {
  const { slug } = await params;
  const tag = slug[0] ?? 'all';

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['notes', 1, '', tag],
    queryFn: () => fetchNotes(1, '', tag),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient key={tag} tag={tag} />
    </HydrationBoundary>
  );
}
