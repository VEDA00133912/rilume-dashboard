import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import ManageServersClient from './ManageServerPage';

export default async function ManageServersPage() {
  const cookieStore = await cookies();
  const auth = cookieStore.get('admin_auth');

  if (!auth || auth.value !== 'true') {
    redirect('/');
  }

  return <ManageServersClient />;
}
