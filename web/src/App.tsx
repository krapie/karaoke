import { useState } from 'react';
import { useAdmin } from './useAdmin';
import SongList from './pages/SongList';
import SongDetail from './pages/SongDetail';
import AddSong from './pages/AddSong';

export type Page =
  | { name: 'list' }
  | { name: 'detail'; id: number }
  | { name: 'add' };

export default function App() {
  const [page, setPage] = useState<Page>({ name: 'list' });
  const admin = useAdmin();

  function handleAdminToggle() {
    if (admin.isAdmin) {
      admin.logout();
    } else {
      const token = prompt('Enter admin token:');
      if (token) admin.login(token);
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <header className="border-b border-gray-800 px-6 py-4 flex items-center justify-between max-w-3xl mx-auto">
        <button
          onClick={() => setPage({ name: 'list' })}
          className="text-xl font-bold tracking-tight hover:text-white transition-colors"
        >
          🎤 karaoke
        </button>
        <div className="flex items-center gap-3">
          {admin.isAdmin && (
            <button
              onClick={() => setPage({ name: 'add' })}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-medium transition-colors"
            >
              + Add Song
            </button>
          )}
          <button
            onClick={handleAdminToggle}
            className="px-3 py-1.5 rounded-lg text-sm font-medium border border-gray-700 hover:border-gray-500 transition-colors"
          >
            {admin.isAdmin ? 'Exit Admin' : 'Admin'}
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8">
        {page.name === 'list' && (
          <SongList
            isAdmin={admin.isAdmin}
            token={admin.token}
            onSelect={(id) => setPage({ name: 'detail', id })}
          />
        )}
        {page.name === 'detail' && (
          <SongDetail
            id={page.id}
            isAdmin={admin.isAdmin}
            token={admin.token}
            onBack={() => setPage({ name: 'list' })}
            onDeleted={() => setPage({ name: 'list' })}
          />
        )}
        {page.name === 'add' && (
          <AddSong
            token={admin.token!}
            onSaved={(id) => setPage({ name: 'detail', id })}
            onCancel={() => setPage({ name: 'list' })}
          />
        )}
      </main>
    </div>
  );
}
