import React, { useState } from 'react';

/**
 * PhotoBank Component
 * Manages the collection of uploaded photos that can be used as backgrounds
 */
function PhotoBank({ photos, onAddPhoto, onDeletePhoto, onRenamePhoto, onSelectPhoto, selectedPhotoId }) {
  const [newPhotoName, setNewPhotoName] = useState('');

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newPhoto = {
          id: Date.now(),
          name: file.name,
          url: event.target.result,
        };
        onAddPhoto(newPhoto);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = ''; // Reset input
  };

  const handleRename = (photoId, currentName) => {
    const newName = prompt('Enter new name:', currentName);
    if (newName && newName.trim()) {
      onRenamePhoto(photoId, newName.trim());
    }
  };

  return React.createElement('div', { className: 'photo-bank' },
    React.createElement('h2', null, 'Photo Bank'),
    
    React.createElement('div', { className: 'upload-section' },
      React.createElement('input', {
        type: 'file',
        accept: 'image/*',
        onChange: handleFileUpload,
        id: 'photo-upload',
        style: { display: 'none' }
      }),
      React.createElement('label', { htmlFor: 'photo-upload', className: 'upload-btn' },
        '+ Add Photo'
      )
    ),

    React.createElement('div', { className: 'photos-grid' },
      photos.length === 0 
        ? React.createElement('p', { className: 'empty-message' }, 'No photos uploaded yet')
        : photos.map((photo) =>
            React.createElement('div', {
              key: photo.id,
              className: `photo-item ${selectedPhotoId === photo.id ? 'selected' : ''}`,
              onClick: () => onSelectPhoto(photo.id)
            },
              React.createElement('img', { src: photo.url, alt: photo.name }),
              React.createElement('div', { className: 'photo-info' },
                React.createElement('span', { className: 'photo-name', title: photo.name },
                  photo.name
                ),
                React.createElement('div', { className: 'photo-actions' },
                  React.createElement('button', {
                    className: 'rename-btn',
                    onClick: (e) => {
                      e.stopPropagation();
                      handleRename(photo.id, photo.name);
                    }
                  }, '✏️'),
                  React.createElement('button', {
                    className: 'delete-btn',
                    onClick: (e) => {
                      e.stopPropagation();
                      onDeletePhoto(photo.id);
                    }
                  }, '🗑️')
                )
              )
            )
          )
    )
  );
}

export default PhotoBank;
