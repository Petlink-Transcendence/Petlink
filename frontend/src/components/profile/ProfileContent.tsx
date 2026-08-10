import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './ProfileContent.css';
import '../Comments.css';
import CreatePost from '../homepage/CreatePostContainer';
import Post from '../homepage/Post';
import { resolveMediaUrl } from '../../utils/mediaUrl';

type BackendPost = {
  id: number;
  user_id: number;
  purpose: string;
  text?: string | null;
  pet_type?: string | null;
  image?: string | null;
  like_count: number;
  user_liked: boolean;
  created_at: string;
};

type BackendReview = {
  id: number;
  reviewer: number;
  reviewer_name?: string;
  reviewer_username?: string;
  reviewer_user_type?: string;
  reviewer_avatar?: string | null;
  rating: number;
  comment?: string | null;
  created_at: string;
};

type ProfileContentProps = {
  profileUserId: number;
  authorName: string;
  authorInitials: string;
  showCreatePost?: boolean;
  onPostCreated?: () => void;
  onPostDeleted?: () => void;
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function reviewerInitials(name: string): string {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

function reviewerProfilePath(review: BackendReview): string {
  return review.reviewer_user_type === 'provider'
    ? `/sitterprofile/${review.reviewer}`
    : `/ownerprofile/${review.reviewer}`;
}

function ProfileReviewCard({ review }: { review: BackendReview }) {
  const reviewerName = review.reviewer_name || review.reviewer_username || `User ${review.reviewer}`;
  const profilePath = reviewerProfilePath(review);
  const avatarUrl = resolveMediaUrl(review.reviewer_avatar);

  return (
    <div className="profile-review-card">
      <div className="profile-review-header">
        <Link to={profilePath} className="profile-review-avatar-link" aria-label={`Open profile of ${reviewerName}`}>
          <div className="profile-review-avatar">
            {avatarUrl ? <img src={avatarUrl} alt={reviewerName} /> : reviewerInitials(reviewerName)}
          </div>
        </Link>
        <div className="profile-review-author-info">
          <Link to={profilePath} className="profile-review-author">{reviewerName}</Link>
          <span className="profile-review-stars">{'⭐'.repeat(review.rating)}</span>
        </div>
        <span className="profile-review-time">{timeAgo(review.created_at)}</span>
      </div>
      <p className="profile-review-text">{review.comment}</p>
    </div>
  );
}

export default function ProfileContent({
  profileUserId,
  showCreatePost = true,
}: ProfileContentProps) {
  const [activeTab, setActiveTab] = useState<'posts' | 'reviews'>('posts');
  const [posts, setPosts] = useState<BackendPost[]>([]);
  const [reviews, setReviews] = useState<BackendReview[]>([]);

  const fetchPosts = async () => {
    const token = localStorage.getItem('access');
    try {
      const res = await fetch(`/posts/?user_id=${profileUserId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) setPosts(await res.json());
    } catch {}
  };

  const fetchReviews = async () => {
    const token = localStorage.getItem('access');
    try {
      const res = await fetch(`/api/users/${profileUserId}/reviews/`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) setReviews(await res.json());
    } catch {}
  };

  useEffect(() => {
    fetchPosts();
    fetchReviews();

    const handlePostsUpdate = () => {
      fetchPosts();
    };
    window.addEventListener('postsUpdated', handlePostsUpdate);
    return () => window.removeEventListener('postsUpdated', handlePostsUpdate);
  }, [profileUserId]);

  return (
    <div className="profile-right">
      {showCreatePost && <CreatePost onPostCreated={fetchPosts} />}
      <div className="profile-tabs">
        <button
          className={`tab-btn ${activeTab === 'posts' ? 'active' : ''}`}
          onClick={() => setActiveTab('posts')}
        >
          Posts
        </button>
        <button
          className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
          onClick={() => setActiveTab('reviews')}
        >
          Reviews
        </button>
      </div>

      {activeTab === 'posts' && (
        <div className="tab-content">
          {posts.length === 0 ? (
            <p className="no-comments-placeholder">No posts yet.</p>
          ) : (
            posts.map(p => (
              <Post
                key={p.id}
                postId={p.id}
                userId={p.user_id}
                purpose={p.purpose}
                text={p.text}
                petType={p.pet_type}
                image={p.image}
                createdAt={p.created_at}
                likeCount={p.like_count}
                userLiked={p.user_liked}
                onDeleted={fetchPosts}
              />
            ))
          )}
        </div>
      )}

      {activeTab === 'reviews' && (
        <div className="tab-content">
          {reviews.length === 0 ? (
            <p className="no-comments-placeholder">No reviews yet.</p>
          ) : (
            reviews.map(r => <ProfileReviewCard key={r.id} review={r} />)
          )}
        </div>
      )}
    </div>
  );
}
