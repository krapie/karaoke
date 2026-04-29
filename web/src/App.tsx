import { useState, useEffect } from 'react';
import { useAdmin } from './useAdmin';
import SongList from './pages/SongList';
import SongDetail from './pages/SongDetail';
import AddSong from './pages/AddSong';

export type Page =
  | { name: 'list' }
  | { name: 'detail'; id: number }
  | { name: 'add' };

function pageFromHistory(): Page {
  const state = window.history.state as Page | null;
  return state ?? { name: 'list' };
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="4" />
      <path strokeLinecap="round" d="M12 3v1.5M12 19.5V21M3 12h1.5M19.5 12H21M5.6 5.6l1.06 1.06M17.34 17.34l1.06 1.06M5.6 18.4l1.06-1.06M17.34 6.66l1.06-1.06" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z" />
    </svg>
  );
}

export default function App() {
  const [page, setPage] = useState<Page>(pageFromHistory);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const admin = useAdmin();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    function onPopState() {
      setPage(pageFromHistory());
    }
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  function navigate(next: Page) {
    window.history.pushState(next, '');
    setPage(next);
  }

  function goBack() {
    window.history.back();
  }

  function handleAdminToggle() {
    if (admin.isAdmin) {
      admin.logout();
    } else {
      const token = prompt('Enter admin token:');
      if (token) admin.login(token);
    }
  }

  return (
    <div className="page-root">
      <button
        className="theme-toggle"
        onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}
        aria-label="toggle theme"
        title="toggle theme"
      >
        {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
      </button>

      <header className="kp-header">
        <button className="brand" onClick={() => navigate({ name: 'list' })} aria-label="karaoke home">
          <span className="pi-mark">π</span>
          <span>Karaoke</span>
        </button>
        <div className="header-actions">
          {admin.isAdmin && (
            <button className="btn-primary" onClick={() => navigate({ name: 'add' })}>
              + Add Song
            </button>
          )}
          <button className="btn-secondary" onClick={handleAdminToggle}>
            {admin.isAdmin ? 'Exit Admin' : 'Admin'}
          </button>
        </div>
      </header>

      <main className="kp-main">
        {page.name === 'list' && (
          <SongList
            isAdmin={admin.isAdmin}
            token={admin.token}
            onSelect={(id) => navigate({ name: 'detail', id })}
          />
        )}
        {page.name === 'detail' && (
          <SongDetail
            id={page.id}
            isAdmin={admin.isAdmin}
            token={admin.token}
            onBack={goBack}
            onDeleted={() => navigate({ name: 'list' })}
          />
        )}
        {page.name === 'add' && (
          <AddSong
            token={admin.token!}
            onSaved={(id) => navigate({ name: 'detail', id })}
            onCancel={goBack}
          />
        )}
      </main>

      <footer className="kp-footer">
        <span>JPOP lyrics reference</span>
        <span className="pi" title="3.14">π</span>
      </footer>
    </div>
  );
}
