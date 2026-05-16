import './CreatePost.css'

/* it will send text to Post eventually */
export default function CreatePost() {
	return (
	<div className="create-post">
		<div
			contentEditable
			className="create-post-input"
			data-placeholder="What's on your pet's mind?"
		/>
	</div>
	);
}
