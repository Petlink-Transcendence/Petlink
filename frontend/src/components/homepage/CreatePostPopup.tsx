import React, { useState, useRef } from 'react';

interface CreatePostContainerProps {
    onClose: () => void;
    onPostCreated?: () => void;
}

export default function CreatePostContainer({ onClose, onPostCreated }: CreatePostContainerProps) {
    const [text, setText] = useState('');
    const [goal, setGoal] = useState('');

    const [petType, setPetType] = useState('');
    const [petSize, setPetSize] = useState('');
    const [selectedPhoto, setPhoto] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhoto(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: { preventDefault: () => void }) => {
        e.preventDefault();

        if (!text.trim()) {
            alert("Please write something before posting.");
            return;
        }

        if (!goal) {
            alert("Please select a main goal for your post.");
            return;
        }

        const token = localStorage.getItem('access');
        const formData = new FormData();
        formData.append('purpose', goal);
        formData.append('text', text.trim());
        if (petType) formData.append('pet_type', petType);
        if (petSize) formData.append('pet_size', petSize);
        const imageFile = fileInputRef.current?.files?.[0];
        if (imageFile) formData.append('image', imageFile);

        try {
            const res = await fetch('/posts/create/', {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });
            if (res.ok) {
                onPostCreated?.();
                onClose();
            } else {
                alert('Failed to create post. Please try again.');
            }
        } catch {
            alert('Network error. Please try again.');
        }
    };

    return (
        <div className='post-overlay' onClick={onClose}>
            <div className='post-container' onClick={(e) => e.stopPropagation()}>
                <div className='post-header'>
                    <h2>Create a Petlink Post</h2>
                    <button type="button" className='close-btn' onClick={onClose}>&times;</button>
                </div>

                <form onSubmit={handleSubmit} className='post-form'>
                    <div 
                        contentEditable
                        className='post-text-input'
                        data-placeholder="What's on your mind? *"
                        onInput={(e) => setText(e.currentTarget.textContent || '')}
                        onBlur={(e) => {
                            if (!e.currentTarget.textContent?.trim()) {
                                e.currentTarget.innerHTML = '';
                                setText('');
                            }
                        }}
                    />

                    <div className='photo-upload-section'>
                        <input
                            type='file'
                            accept='image/*'
                            ref={fileInputRef}
                            onChange={handlePhotoChange}
                            style={{ display: 'none' }}
                        />

                        {selectedPhoto ? (
                            <div className='image-preview-container'>
                                <img src={selectedPhoto} alt='Preview' className='uploaded-preview' />
                                <button 
                                    type='button'
                                    className='remove-photo-btn'
                                    onClick={() => setPhoto(null)}
                                >
                                    Remove Photo
                                </button>
                            </div>
                        ) : (
                            <button
                                type='button'
                                className='add-photo-btn'
                                onClick={() => fileInputRef.current?.click()}
                            >
                                📸 Add a Photo to your post
                            </button>
                        )}
                    </div>

                    <hr className='post-divider' />

                    <div className='form-group'>
                        <label className='required-label'> What's the goal of this post? </label>
                        <select
                            value={goal}
                            onChange={(e) => setGoal(e.target.value)}
                            required
                        >
                            <option value=''>-- Select a purpose --</option>
                            <option value="sitting">Looking for a Sitter 🏡</option>
                            <option value="playdate">Looking for a Playdate 🦴</option>
                            <option value="advice">Pet Advice / Question ❓</option>
                            <option value="social">Just Sharing / Social 📸</option>
                        </select>
                    </div>

                    <div className='optional-tags-section'>
                        <h3>Add Filters</h3>
                        <div className='tags-grid'>
                            <div className='form-group'>
                                <label>Pet Type</label>
                                <select value={petType} onChange={(e) => setPetType(e.target.value)}>
                                    <option value="">-- Select--</option>
                                    <option value="dog">Dog 🐕</option>
                                    <option value="cat">Cat 🐈</option>
                                    <option value="bird">Bird 🦜</option>
                                    <option value="other">Other 🐹</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Pet Size</label>
                                <select value={petSize} onChange={(e) => setPetSize(e.target.value)}>
                                    <option value="">-- Select--</option>
                                    <option value="small">Small</option>
                                    <option value="medium">Medium</option>
                                    <option value="large">Large</option>
                                </select>
                            </div>
                        </div>

                    </div>

                    <button type='submit' className='submit-post-btn'>
                        Post to PetLink
                    </button>
                </form>
            </div>
        </div>
    );
}