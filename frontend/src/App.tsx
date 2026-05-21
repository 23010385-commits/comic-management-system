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
type Chapter = {
  _id: string;
  comicId: string;
  title: string;
  chapterNumber: number;
  images: string[];
};
type Comment = {
  _id: string;
  chapterId: string;
  userId: string;
  username: string;
  email: string;
  content: string;
  createdAt: string;
};
type HistoryItem = {
  comicId: string;
  comicTitle: string;
  comicCover: string;
  chapterId: string;
  chapterNumber: number;
  chapterTitle: string;
  readAt: string;
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
    useState<File | null>(null);
  const [status, setStatus] =
    useState('ONGOING');

  const [chapterTitle, setChapterTitle] =
    useState('');

  const [chapterNumber, setChapterNumber] =
    useState(1);

  const [chapterImages, setChapterImages] =
    useState<File[]>([]);

  const [selectedComic, setSelectedComic] =
    useState<Comic | null>(null);

  const [chapters, setChapters] = useState<
    Chapter[]
  >([]);

  const [selectedChapter, setSelectedChapter] =
    useState<Chapter | null>(null);

  const [showAddChapterForm, setShowAddChapterForm] =
    useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentContent, setCommentContent] = useState('');
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [readingHistory, setReadingHistory] = useState<HistoryItem[]>([]);

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
    try {
      const saved = localStorage.getItem('comic_reading_history');
      if (saved) {
        setReadingHistory(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Error loading reading history:', e);
    }
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
      const formData = new FormData();

      formData.append('title', title);
      formData.append('author', author);

      genres
        .split(',')
        .map((g) => g.trim())
        .forEach((genre) => {
          formData.append('genres', genre);
        });

      formData.append(
        'description',
        description,
      );

      formData.append('status', status);

      if (coverImage) {
        formData.append(
          'coverImage',
          coverImage,
        );
      }

      const response = await fetch(
        'http://localhost:3000/api/comics',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      );

      const data = await response.json();

      if (response.ok) {
        alert('Comic created successfully');

        setTitle('');
        setAuthor('');
        setGenres('');
        setDescription('');
        setCoverImage(null);
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

  const handleCreateChapter = async (comicId: string) => {
    try {
      const formData = new FormData();

      formData.append(
        'comicId',
        comicId,
      );

      formData.append(
        'title',
        chapterTitle,
      );

      formData.append(
        'chapterNumber',
        chapterNumber.toString(),
      );

      chapterImages.forEach((image) => {
        formData.append('images', image);
      });

      const response = await fetch(
        'http://localhost:3000/api/chapters',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      );

      const data = await response.json();

      if (response.ok) {
        alert('Chapter created successfully');

        setChapterTitle('');
        setChapterImages([]);
        setShowAddChapterForm(false);
        await fetchChapters(comicId);
      } else {
        alert(data.message || 'Create failed');
      }
    } catch (error) {
      console.error(error);

      alert('Create chapter error');
    }
  };

  const fetchChapters = async (
    comicId: string,
  ) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/chapters/comic/${comicId}`,
      );

      const data = await response.json();

      setChapters(data);
      if (Array.isArray(data)) {
        setChapterNumber(data.length + 1);
      } else {
        setChapterNumber(1);
      }
    } catch (error) {
      console.error(error);
      setChapterNumber(1);
    }
  };

  const handleSelectComic = async (
    comic: Comic,
  ) => {
    setSelectedComic(comic);

    setSelectedChapter(null);
    setShowAddChapterForm(false);
    setChapterTitle('');
    setChapterImages([]);

    await fetchChapters(comic._id);
  };

  const fetchComments = async (chapterId: string) => {
    try {
      setCommentsLoading(true);
      const response = await fetch(`http://localhost:3000/api/chapters/${chapterId}/comments`);
      const data = await response.json();
      setComments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setCommentsLoading(false);
    }
  };

  const handleCreateComment = async () => {
    if (!commentContent.trim() || !selectedChapter) return;

    try {
      const response = await fetch(
        `http://localhost:3000/api/chapters/${selectedChapter._id}/comments`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            content: commentContent,
          }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        setCommentContent('');
        fetchComments(selectedChapter._id);
      } else {
        alert(data.message || 'Failed to post comment');
      }
    } catch (error) {
      console.error('Error posting comment:', error);
      alert('Error posting comment');
    }
  };

  const handleSelectChapter = async (
    chapter: Chapter,
  ) => {
    setSelectedChapter(chapter);

    // Save to reading history
    if (selectedComic) {
      try {
        const saved = localStorage.getItem('comic_reading_history');
        let currentHistory: HistoryItem[] = saved ? JSON.parse(saved) : [];

        // Remove duplicates for this comic
        currentHistory = currentHistory.filter((item) => item.comicId !== selectedComic._id);

        // Prepend new history item
        const newItem: HistoryItem = {
          comicId: selectedComic._id,
          comicTitle: selectedComic.title,
          comicCover: selectedComic.coverImage,
          chapterId: chapter._id,
          chapterNumber: chapter.chapterNumber,
          chapterTitle: chapter.title,
          readAt: new Date().toISOString(),
        };

        const updatedHistory = [newItem, ...currentHistory].slice(0, 10);
        localStorage.setItem('comic_reading_history', JSON.stringify(updatedHistory));
        setReadingHistory(updatedHistory);
      } catch (e) {
        console.error('Error updating reading history:', e);
      }
    }

    await fetchComments(chapter._id);
  };

  const handleResumeReading = async (item: HistoryItem) => {
    try {
      const foundComic = comics.find((c) => c._id === item.comicId) || {
        _id: item.comicId,
        title: item.comicTitle,
        coverImage: item.comicCover,
        author: '',
        genres: [],
        description: '',
        status: '',
      } as Comic;

      setSelectedComic(foundComic);
      setShowAddChapterForm(false);
      
      const response = await fetch(
        `http://localhost:3000/api/chapters/comic/${item.comicId}`,
      );
      const data = await response.json();
      setChapters(data);

      if (Array.isArray(data)) {
        setChapterNumber(data.length + 1);
        const savedChapter = data.find((ch) => ch._id === item.chapterId);
        if (savedChapter) {
          setSelectedChapter(savedChapter);
          await fetchComments(savedChapter._id);
        } else {
          const savedChapterByNum = data.find((ch) => ch.chapterNumber === item.chapterNumber);
          if (savedChapterByNum) {
            setSelectedChapter(savedChapterByNum);
            await fetchComments(savedChapterByNum._id);
          } else {
            setSelectedChapter(null);
          }
        }
      }
    } catch (error) {
      console.error('Error resuming reading:', error);
      alert('Không thể tiếp tục đọc chương này. Có lỗi xảy ra.');
    }
  };

  const handleRemoveHistory = (comicId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const saved = localStorage.getItem('comic_reading_history');
      if (saved) {
        const currentHistory: HistoryItem[] = JSON.parse(saved);
        const updatedHistory = currentHistory.filter((item) => item.comicId !== comicId);
        localStorage.setItem('comic_reading_history', JSON.stringify(updatedHistory));
        setReadingHistory(updatedHistory);
      }
    } catch (err) {
      console.error('Error removing history item:', err);
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

      {!selectedComic && readingHistory.length > 0 && (
        <div className="reading-history-section">
          <h3>🕒 Truyện đã đọc gần đây</h3>
          <div className="history-carousel">
            {readingHistory.map((item) => (
              <div
                key={item.comicId}
                className="history-card"
                onClick={() => handleResumeReading(item)}
              >
                <button
                  className="remove-history-btn"
                  title="Xóa khỏi lịch sử"
                  onClick={(e) => handleRemoveHistory(item.comicId, e)}
                >
                  ×
                </button>
                <img
                  src={item.comicCover}
                  alt={item.comicTitle}
                  className="history-card-cover"
                />
                <div className="history-card-content">
                  <h4>{item.comicTitle}</h4>
                  <p className="history-chapter-info">
                    Đang đọc: Ch. {item.chapterNumber}
                  </p>
                  <button className="resume-btn">
                    Đọc tiếp →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                setCoverImage(
                  e.target.files[0],
                );
              }
            }}
          />

          {coverImage && (
            <img
              src={URL.createObjectURL(coverImage)}
              alt="Preview"
              className="preview-image"
            />
          )}

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

      {selectedComic && (
        <div className="detail-box">
          <button
            className="back-button"
            onClick={() => {
              setSelectedComic(null);
              setSelectedChapter(null);
              setShowAddChapterForm(false);
            }}
          >
            ← Back
          </button>

          <h2>{selectedComic.title}</h2>

          <img
            className="detail-cover"
            src={selectedComic.coverImage}
            alt={selectedComic.title}
          />

          <p>
            <strong>Author:</strong>{' '}
            {selectedComic.author}
          </p>

          <p>
            <strong>Genres:</strong>{' '}
            {selectedComic.genres.join(', ')}
          </p>

          <p>{selectedComic.description}</p>

          <h3>Chapters</h3>

          <div className="chapter-list">
            {chapters.map((chapter) => (
              <button
                key={chapter._id}
                onClick={() =>
                  handleSelectChapter(chapter)
                }
              >
                Chapter {chapter.chapterNumber} -{' '}
                {chapter.title}
              </button>
            ))}
          </div>

          {token && (
            <div className="admin-chapter-section">
              {!showAddChapterForm ? (
                <button
                  className="toggle-add-chapter-btn"
                  onClick={() => setShowAddChapterForm(true)}
                >
                  ➕ Thêm Chapter Mới
                </button>
              ) : (
                <div className="admin-add-chapter-container">
                  <div className="admin-add-chapter-header">
                    <h4>➕ Thêm Chapter Mới</h4>
                    <button
                      className="close-form-btn"
                      onClick={() => setShowAddChapterForm(false)}
                    >
                      Đóng ×
                    </button>
                  </div>

                  <div className="form-group">
                    <label>Tiêu đề Chapter:</label>
                    <input
                      type="text"
                      placeholder="Nhập tiêu đề chapter (ví dụ: Sự trỗi dậy)"
                      value={chapterTitle}
                      onChange={(e) => setChapterTitle(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Số Chapter:</label>
                    <input
                      type="number"
                      placeholder="Số chapter"
                      value={chapterNumber}
                      onChange={(e) => setChapterNumber(Number(e.target.value))}
                    />
                  </div>

                  <div className="form-group">
                    <label>Hình ảnh trang truyện:</label>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files) {
                          setChapterImages(Array.from(e.target.files));
                        }
                      }}
                    />
                  </div>

                  {chapterImages.length > 0 && (
                    <div className="preview-grid-container">
                      <p>Xem trước hình ảnh ({chapterImages.length} trang):</p>
                      <div className="preview-grid">
                        {chapterImages.map((image, index) => (
                          <img
                            key={index}
                            src={URL.createObjectURL(image)}
                            alt={`Preview ${index}`}
                            className="preview-image"
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  <button
                    className="submit-chapter-btn"
                    onClick={() => handleCreateChapter(selectedComic._id)}
                  >
                    Tạo Chapter
                  </button>
                </div>
              )}
            </div>
          )}

          {selectedChapter && (
            <div className="reader-box">
              <h2>
                Chapter{' '}
                {selectedChapter.chapterNumber}
              </h2>

              {selectedChapter.images.map(
                (image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Page ${index + 1}`}
                    className="reader-image"
                  />
                ),
              )}

              {/* Comments Section */}
              <div className="comments-section">
                <h3>Bình luận ({comments.length})</h3>

                {/* Form comment */}
                {token ? (
                  <div className="comment-form">
                    <textarea
                      placeholder="Viết bình luận của bạn..."
                      value={commentContent}
                      onChange={(e) => setCommentContent(e.target.value)}
                    />
                    <button onClick={handleCreateComment}>Gửi bình luận</button>
                  </div>
                ) : (
                  <p className="login-prompt">
                    Bạn cần đăng nhập để viết bình luận.
                  </p>
                )}

                {/* List comment */}
                {commentsLoading ? (
                  <p>Đang tải bình luận...</p>
                ) : comments.length === 0 ? (
                  <p className="no-comments">Chưa có bình luận nào. Hãy là người đầu tiên bình luận!</p>
                ) : (
                  <div className="comments-list">
                    {comments.map((comment) => (
                      <div key={comment._id} className="comment-item">
                        <div className="comment-avatar">
                          {comment.username ? comment.username[0].toUpperCase() : 'A'}
                        </div>
                        <div className="comment-content-box">
                          <div className="comment-header">
                            <span className="comment-author">{comment.username}</span>
                            <span className="comment-date">
                              {new Date(comment.createdAt).toLocaleString('vi-VN')}
                            </span>
                          </div>
                          <p className="comment-text">{comment.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {!selectedComic && (
        <div className="comic-grid">
          {comics.map((comic) => (
            <div
              className="comic-card"
              key={comic._id}
              onClick={() =>
                handleSelectComic(comic)
              }
            >
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
        </div>)}
    </div>
  );
}

export default App;