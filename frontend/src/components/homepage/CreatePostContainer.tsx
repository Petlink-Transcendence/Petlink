import { useState } from 'react'
import CreatePostContainer from './CreatePostPopup'
import './CreatePost.css'

interface CreatePostProps {
	onPostCreated?: () => void;
}

export default function CreatePost({ onPostCreated }: CreatePostProps) {
	const [isPostOpen, setIsPostOpen] = useState(false);

	return (
		<div className='create-post-container'>
			<div className="create-post" onClick={() => setIsPostOpen(true)}>
			<div
				className="create-post-input"
				data-placeholder="What's on your mind?"
			/>
		</div>
		{isPostOpen && (
			<CreatePostContainer onClose={() => setIsPostOpen(false)} onPostCreated={onPostCreated} />
		)}
		</div>
	);
}
