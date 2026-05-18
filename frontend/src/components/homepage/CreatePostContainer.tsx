import React, {use, useState} from 'react'
import CreatePostContainer from './CreatePostPopup'
import './CreatePost.css'

export default function CreatePost() {
	const [isPostOpen, setIsPostOpen] = useState(false);

	return (
		<div className='create-post-container'>
			<div className="create-post" onClick={() => setIsPostOpen(true)}>
			<div
				className="create-post-input"
				data-placeholder="What's on your pet's mind?"
			/>
		</div>
		{isPostOpen && (
			<CreatePostContainer onClose={() => setIsPostOpen(false)} />
		)}
		</div>
	);
}
