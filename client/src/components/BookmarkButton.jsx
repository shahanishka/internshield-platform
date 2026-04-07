import { useState, useEffect } from 'react';
import axios from 'axios';
import './BookmarkButton.css';

export default function BookmarkButton({ internshipId, size = 'normal' }) {
  const [bookmarked, setBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [animating, setAnimating] = useState(false);

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) { setLoading(false); return; }
    axios.get(`http://localhost:5000/api/bookmarks/check/${internshipId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setBookmarked(res.data.bookmarked))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [internshipId]);

  async function toggle(e) {
    e.preventDefault();
    e.stopPropagation();
    if (!token) return;
    setAnimating(true);
    setTimeout(() => setAnimating(false), 400);

    try {
      if (bookmarked) {
        await axios.delete(`http://localhost:5000/api/bookmarks/${internshipId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBookmarked(false);
      } else {
        await axios.post(`http://localhost:5000/api/bookmarks/${internshipId}`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBookmarked(true);
      }
    } catch {}
  }

  if (loading) return null;

  return (
    <button
      className={`bookmark-btn ${bookmarked ? 'bookmarked' : ''} ${animating ? 'animating' : ''} size-${size}`}
      onClick={toggle}
      title={bookmarked ? 'Remove bookmark' : 'Save internship'}
    >
      {bookmarked ? '❤️' : '🤍'}
    </button>
  );
}