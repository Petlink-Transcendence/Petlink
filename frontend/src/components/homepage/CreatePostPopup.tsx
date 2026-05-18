import React, { useState, useRef } from 'react';

interface CreatePostContainerProps {
    onClose: () => void;
}

export default function CreatePostContainer({ onClose }: CreatePostContainerProps) {
    const [text, setText] = useState('');
    const [goal, setGoal] = useState('');

    // optional filter tags
    const [petType, setPetType] = useState('');
    const [petSize, setPetSize] = useState('');
    const [customTag, setCustomTag] = useState('');
    const [customTagsList, setCustomTagsList] = useState<string[]>([]);

    // optional photo upload
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

    const handleAddCustomTag = (e: React.KeyboardEvent<HTMLInputElement>) => {        
        if (e.key === 'Enter' && customTag.trim()) {
            e.preventDefault();
            if (!customTagsList.includes(customTag.trim())) {
                setCustomTagsList([...customTagsList, customTag.trim()]);
            }
            setCustomTag('');
        }   
    };

    const handleRemoveCustomTag = (tagToRemove: string) => {
        setCustomTagsList(customTagsList.filter(tag => tag !== tagToRemove));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!goal) {
            alert("Please select a main goal for your post.");
            return;
        }

        const postData = {
            text,
            goal,
            photo: selectedPhoto,
            filters: {
                petType,
                petSize,
                customTags: customTagsList
            }
        };

        console.log("Submitting Petlink Post: ", postData);
        // 👈 Call backend route API here with axios/fetch
        
        onClose(); // 👈 Close the modal ONLY after a successful submit!
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
                        data-placeholder="What's on your pet's mind?"
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

                        <div className='form-group' style={{ marginTop: '0.75rem' }}>
                            <label>Custom tags (Press Enter to add)</label>
                            <input 
                                type="text" 
                                placeholder="e.g., puppy, urgent, weekend" 
                                value={customTag}
                                onChange={(e) => setCustomTag(e.target.value)}
                                onKeyDown={handleAddCustomTag}
                            />
                            <div className='tags-pill-container'>
                                {customTagsList.map(tag => (
                                    <span key={tag} className='tag-pill'>
                                        #{tag}
                                        <button type='button' onClick={() => handleRemoveCustomTag(tag)}>&times;</button>
                                    </span>
                                ))}
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