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

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [token, setToken] = useState(
    localStorage.getItem('token') || '',
  );

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

  const handleLogin = async () => {
    try {
      const response = await fetch(
        'http://localhost:3000/api/auth/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
          }),
        },
      );

      const data = await response.json();

      if (data.accessToken) {
        localStorage.setItem(
          'token',
          data.accessToken,
        );

        setToken(data.accessToken);

        alert('Login successful');
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (error) {
      console.error(error);

      alert('Login error');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');

    setToken('');
  };

  return (
    <div className="app">
      <h1>Comic Management System</h1>

      <p className="subtitle">
        Distributed System Comic Platform
      </p>

      <div className="auth-box">
        {!token ? (
          <>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
            />

            <button onClick={handleLogin}>
              Login
            </button>
          </>
        ) : (
          <div className="logged-in">
            <span>Đã đăng nhập</span>

            <button onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </div>

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