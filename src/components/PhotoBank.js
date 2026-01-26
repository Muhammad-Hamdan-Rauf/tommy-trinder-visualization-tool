import React, { useState } from 'react';
import { generateUniqueId } from '../utils/coordinateUtils.js';

/**
 * PhotoBank Component
 * Manages the collection of uploaded photos that can be used as backgrounds
 * Photos are immutable once uploaded, can only be renamed or deleted
 */
function PhotoBank({ photos, onAddPhoto, onDeletePhoto, onRenamePhoto, onSelectPhoto, selectedPhotoId }) {
  const [newPhotoName, setNewPhotoName] = useState('');

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newPhoto = {
          id: generateUniqueId(),
          name: file.name,
          url: event.target.result,
          uploadedAt: new Date().toISOString(),
        };
        onAddPhoto(newPhoto);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = ''; // Reset input
  };

  const handleRename = (photoId, currentName) => {
    const newName = prompt('Enter new name:', currentName);
    if (newName && newName.trim() && newName.trim() !== currentName) {
      onRenamePhoto(photoId, newName.trim());
    }
  };
  
  const handleDelete = (photoId) => {
    if (window.confirm('Delete this photo? This will also clear any products placed on it.')) {
      onDeletePhoto(photoId);
    }
  };

  return React.createElement('div', { className: 'photo-bank' },
    React.createElement('div', { className: 'photo-bank-header' },
      React.createElement('h2', null, 'Photo Bank'),
      React.createElement('span', { className: 'photo-count' }, 
        `${photos.length} photo${photos.length !== 1 ? 's' : ''}`
      )
    ),
    
    React.createElement('div', { className: 'upload-section' },
      React.createElement('input', {
        type: 'file',
        accept: 'image/*',
        onChange: handleFileUpload,
        id: 'photo-upload',
        style: { display: 'none' }
      }),
      React.createElement('label', { 
        htmlFor: 'photo-upload', 
        className: 'upload-btn',
        title: 'Upload a background photo'
      }, '+ Add Photo')
    ),

    React.createElement('div', { className: 'photos-grid' },
      photos.length === 0 
        ? React.createElement('div', { className: 'empty-message' },
            React.createElement('p', null, '📷 No photos uploaded yet'),
            React.createElement('p', { className: 'empty-hint' }, 
              'Upload background photos to start creating visualizations'
            )
          )
        : photos.map((photo) =>
            React.createElement('div', {
              key: photo.id,
              className: `photo-item ${selectedPhotoId === photo.id ? 'selected' : ''}`,
              onClick: () => onSelectPhoto(photo.id),
              title: `Click to use: ${photo.name}`
            },
              React.createElement('div', { className: 'photo-thumbnail' },
                React.createElement('img', { 
                  src: photo.url, 
                  alt: photo.name,
                  loading: 'lazy'
                }),
                selectedPhotoId === photo.id && React.createElement('div', { 
                  className: 'selected-badge' 
                }, '✓')
              ),
              
              React.createElement('div', { className: 'photo-info' },
                React.createElement('span', { 
                  className: 'photo-name', 
                  title: photo.name 
                }, photo.name),
                
                React.createElement('div', { className: 'photo-actions' },
                  React.createElement('button', {
                    className: 'rename-btn',
                    onClick: (e) => {
                      e.stopPropagation();
                      handleRename(photo.id, photo.name);
                    },
                    title: 'Rename photo'
                  }, '✏️'),
                  React.createElement('button', {
                    className: 'delete-btn',
                    onClick: (e) => {
                      e.stopPropagation();
                      handleDelete(photo.id);
                    },
                    title: 'Delete photo'
                  }, '🗑️')
                )
              )
            )
          )
    )
  );
}

export default PhotoBank;
