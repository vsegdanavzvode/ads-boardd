import { useCallback, useEffect, useState } from 'react';
import { getAds } from './api';
import AdCard from './components/AdCard';
import AdForm from './components/AdForm';
import type { Ad } from './types';

const PAGE_SIZE = 8;

function App() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const loadAds = useCallback(async () => {
    setIsLoading(true);
    setError('');

    try {
      const data = await getAds(page, PAGE_SIZE);
      setAds(data.items);
      setTotal(data.total);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : 'Не удалось загрузить объявления.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  useEffect(() => {
    void loadAds();
  }, [loadAds]);

  async function handleCreated() {
    if (page !== 1) {
      setPage(1);
      return;
    }

    await loadAds();
  }

  return (
    <main className="page">
      <header className="page-header">
        <h1>Доска объявлений</h1>
      </header>

      <div className="page-layout">
        <AdForm onCreated={handleCreated} />

        <section className="ads-section">
          <div className="ads-heading">
            <h2>Объявления</h2>
            <span>{total} всего</span>
          </div>

          {isLoading && <p className="status-message">Загрузка объявлений...</p>}

          {!isLoading && error && (
            <div className="error-box">
              <p>{error}</p>
              <button type="button" onClick={() => void loadAds()}>
                Повторить
              </button>
            </div>
          )}

          {!isLoading && !error && ads.length === 0 && (
            <p className="status-message">Объявлений пока нет.</p>
          )}

          {!isLoading && !error && ads.length > 0 && (
            <div className="ads-grid">
              {ads.map((ad) => (
                <AdCard key={ad.id} ad={ad} />
              ))}
            </div>
          )}

          {!isLoading && !error && totalPages > 1 && (
            <div className="pagination">
              <button
                type="button"
                disabled={page === 1}
                onClick={() => setPage((currentPage) => currentPage - 1)}
              >
                Назад
              </button>
              <span>
                Страница {page} из {totalPages}
              </span>
              <button
                type="button"
                disabled={page === totalPages}
                onClick={() => setPage((currentPage) => currentPage + 1)}
              >
                Вперёд
              </button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default App;
