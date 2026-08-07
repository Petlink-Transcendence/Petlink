import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Post from '../components/homepage/Post';
import './PostDetail.css';

interface BackendPostDetail {
    id: number;
    user_id: number;
    purpose: string;
    text: string | null;
    tags: string[];
    pet_type: string | null;
    pet_size: string | null;
    image: string | null;
    like_count: number;
    user_liked: boolean;
    created_at: string;
}

export default function PostDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [post, setPost] = useState<BackendPostDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        document.title = 'Post | Petlink';
    }, []);

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        setError(null);
        
        const fetchPostData = () => {
            return fetch(`/posts/${id}/`)
                .then(res => {
                    if (!res.ok) {
                        throw new Error('Post not found');
                    }
                    return res.json() as Promise<BackendPostDetail>;
                })
                .then(data => {
                    setPost(data);
                })
                .catch(() => {
                    setError('This post is no longer available or was removed.');
                });
        };

        fetchPostData().finally(() => {
            setLoading(false);
        });

        const handlePostsUpdate = () => {
            fetchPostData();
        };

        window.addEventListener('postsUpdated', handlePostsUpdate);
        return () => window.removeEventListener('postsUpdated', handlePostsUpdate);
    }, [id]);

    return (
        <div className="post-detail-page">
            <div className="post-detail-shell">
                <div className="post-detail-header">
                    <button className="post-detail-back-btn" onClick={() => navigate(-1)}>
                        ← Back
                    </button>
                </div>

                {loading ? (
                    <div className="post-detail-message">Loading post...</div>
                ) : error || !post ? (
                    <div className="post-detail-message">
                        <p>{error || 'Post not found.'}</p>
                    </div>
                ) : (
                    <Post
                        postId={post.id}
                        userId={post.user_id}
                        purpose={post.purpose}
                        text={post.text}
                        petType={post.pet_type}
                        image={post.image}
                        createdAt={post.created_at}
                        likeCount={post.like_count}
                        userLiked={post.user_liked}
                        onDeleted={() => navigate('/notifications')}
                    />
                )}
            </div>
        </div>
    );
}
