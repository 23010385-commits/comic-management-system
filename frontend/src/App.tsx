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

  useEffect(() => {
    fetch('http://localhost:3000/api/comics')
      .then((res) => res.json())
      .then((data) => {
        setComics(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching comics:', error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="app">
      <h1>Comic Management System</h1>
      <p className="subtitle">Danh sách truyện tranh</p>

      {loading && <p>Đang tải dữ liệu...</p>}

      <div className="comic-grid">
        {comics.map((comic) => (
          <div className="comic-card" key={comic._id}>
            <img src={comic.coverImage} alt={comic.title} />
            <div className="comic-content">
              <h2>{comic.title}</h2>
              <p><strong>Tác giả:</strong> {comic.author}</p>
              <p><strong>Thể loại:</strong> {comic.genres.join(', ')}</p>
              <p><strong>Trạng thái:</strong> {comic.status}</p>
              <p>{comic.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;