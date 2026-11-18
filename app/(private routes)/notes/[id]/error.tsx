'use client';

interface NoteDetailErrorProps {
  error: Error;
}

export default function NoteDetailError({ error }: NoteDetailErrorProps) {
  return <p>Could not fetch note details. {error.message}</p>;
}
