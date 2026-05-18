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
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genres, setGenres] = useState('');
  const [description, setDescription] =
    useState('');
  const [coverImage, setCoverImage] =
    useState('');
  const [status, setStatus] =
    useState('ONGOING');
  const [chapterComicId, setChapterComicId] =
    useState('');

  const [chapterTitle, setChapterTitle] =
    useState('');

  const [chapterNumber, setChapterNumber] =
    useState(1);

  const [chapterImages, setChapterImages] =
    useState('');

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

  const handleCreateComic = async () => {
    try {
      const response = await fetch(
        'http://localhost:3000/api/comics',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title,
            author,
            genres: genres
              .split(',')
              .map((g) => g.trim()),
            description,
            coverImage,
            status,
          }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        alert('Comic created successfully');

        setTitle('');
        setAuthor('');
        setGenres('');
        setDescription('');
        setCoverImage('');
        setStatus('ONGOING');

        fetchComics();
      } else {
        alert(data.message || 'Create failed');
      }
    } catch (error) {
      console.error(error);

      alert('Create comic error');
    }
  };

  const handleCreateChapter = async () => {
    try {
      const response = await fetch(
        'http://localhost:3000/api/chapters',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            comicId: chapterComicId,
            title: chapterTitle,
            chapterNumber,
            images: chapterImages
              .split(',')
              .map((img) => img.trim()),
          }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        alert('Chapter created successfully');

        setChapterComicId('');
        setChapterTitle('');
        setChapterNumber(1);
        setChapterImages('');
      } else {
        alert(data.message || 'Create failed');
      }
    } catch (error) {
      console.error(error);

      alert('Create chapter error');
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

      {token && (
        <div className="admin-box">
          <h2>Admin - Thêm truyện</h2>

          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
          />

          <input
            type="text"
            placeholder="Author"
            value={author}
            onChange={(e) =>
              setAuthor(e.target.value)
            }
          />

          <input
            type="text"
            placeholder="Genres (comma separated)"
            value={genres}
            onChange={(e) =>
              setGenres(e.target.value)
            }
          />

          <input
            type="text"
            placeholder="Cover Image URL"
            value={coverImage}
            onChange={(e) =>
              setCoverImage(e.target.value)
            }
          />

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
          />

          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value)
            }
          >
            <option value="ONGOING">
              ONGOING
            </option>

            <option value="COMPLETED">
              COMPLETED
            </option>
          </select>

          <button onClick={handleCreateComic}>
            Create Comic
          </button>
        </div>
      )}

      {token && (
        <div className="admin-box">
          <h2>Admin - Thêm chapter</h2>

          <input
            type="text"
            placeholder="Comic ID"
            value={chapterComicId}
            onChange={(e) =>
              setChapterComicId(e.target.value)
            }
          />

          <input
            type="text"
            placeholder="Chapter Title"
            value={chapterTitle}
            onChange={(e) =>
              setChapterTitle(e.target.value)
            }
          />

          <input
            type="number"
            placeholder="Chapter Number"
            value={chapterNumber}
            onChange={(e) =>
              setChapterNumber(Number(e.target.value))
            }
          />

          <textarea
            placeholder="Image URLs (comma separated)"
            value={chapterImages}
            onChange={(e) =>
              setChapterImages(e.target.value)
            }
          />

          <button onClick={handleCreateChapter}>
            Create Chapter
          </button>
        </div>
      )}

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
                <strong>ID:</strong> {comic._id}
              </p>

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