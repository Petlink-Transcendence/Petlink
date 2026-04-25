import './CreatePost.css'

export default function CreatePost() {
	return (
	<div className="create-post">
		<textarea
			className="create-post-input"
			placeholder="What's on your pet's mind?"
		/>

	<div className="create-post-btn-container">
		<button className="btn post">Post</button>
	</div>
	</div>
	);
}