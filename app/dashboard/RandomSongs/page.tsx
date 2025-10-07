// app/dashboard/RandomSongs/page.tsx
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import RandomSongsClient from './RandomSongsPage';

export default async function RandomSongsPage() {
  const cookieStore = await cookies();
  const adminAuth = cookieStore.get('admin_auth');

  if (!adminAuth) {
    redirect('/');
  }

  return <RandomSongsClient />;
}
