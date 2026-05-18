import { useEffect, useState } from 'react';
import './App.css';

type Comic = {
  _id: string;
  title: string;
  author: string;
  genres: string[];
  description: string;
  coverImage: string;
  status: string;
};

function App() {
  const [comics, setComics] = useState<Comic[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');

  const fetchComics = async () => {
    try {
      setLoading(true);

      const url = keyword
        ? `http://localhost:3005/search?keyword=${keyword}`
        : 'http://localhost:3000/api/comics';

      const response = await fetch(url);

      const data = await response.json();

      setComics(data);
    } catch (error) {
      console.error('Error fetching comics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComics();
  }, []);

  const handleSearch = () => {
    fetchComics();
  };

  return (
    <div className="app">
      <h1>Comic Management System</h1>

      <p className="subtitle">
        Distributed System Comic Platform
      </p>

      <div className="search-box">
        <input
          type="text"
          placeholder="Tìm truyện, tác giả, thể loại..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />

        <button onClick={handleSearch}>
          Search
        </button>
      </div>

      {loading && <p>Đang tải dữ liệu...</p>}

      {!loading && comics.length === 0 && (
        <p>Không tìm thấy truyện.</p>
      )}

      <div className="comic-grid">
        {comics.map((comic) => (
          <div className="comic-card" key={comic._id}>
            <img
              src={comic.coverImage}
              alt={comic.title}
            />

            <div className="comic-content">
              <h2>{comic.title}</h2>

              <p>
                <strong>Tác giả:</strong>{' '}
                {comic.author}
              </p>

              <p>
                <strong>Thể loại:</strong>{' '}
                {comic.genres.join(', ')}
              </p>

              <p>
                <strong>Trạng thái:</strong>{' '}
                {comic.status}
              </p>

              <p>{comic.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;