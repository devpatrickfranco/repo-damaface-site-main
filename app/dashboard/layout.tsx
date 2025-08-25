// app/dashboard/layout.tsx
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { LayoutDashboard, Newspaper, Power } from 'lucide-react';
import Link from 'next/link';

// Componente para o link de Logout
function SignOutButton() {
  return (
    <Link
      href="/api/auth/signout"
      className="flex items-center space-x-3 rounded-md px-3 py-2 text-gray-400 hover:bg-gray-700 hover:text-white"
    >
      <Power className="h-5 w-5" />
      <span>Sair</span>
    </Link>
  );
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 flex-shrink-0 bg-gray-800 p-4">
          <div className="flex flex-col h-full">
            <h1 className="text-2xl font-bold text-brand-pink mb-8">
              Admin
            </h1>
            <nav className="flex-grow space-y-2">
              <Link
                href="/dashboard"
                className="flex items-center space-x-3 rounded-md px-3 py-2 text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                <LayoutDashboard className="h-5 w-5" />
                <span>Dashboard</span>
              </Link>
              <Link
                href="/dashboard/blog"
                className="flex items-center space-x-3 rounded-md px-3 py-2 text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                <Newspaper className="h-5 w-5" />
                <span>Blog</span>
              </Link>
            </nav>
            <div className="mt-auto">
              <p className="text-sm text-gray-400 mb-2">
                Logado como {session.user?.name}
              </p>
              <SignOutButton />
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}