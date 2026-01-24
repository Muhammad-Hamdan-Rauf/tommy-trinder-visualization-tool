import React, { useState } from 'react';
import PhotoBank from './components/PhotoBank.js';
import CanvasArea from './components/CanvasArea.js';
import Controls from './components/Controls.js';
import CompletedImages from './components/CompletedImages.js';
import './App.css';

/**
 * Main App Component
 * Manages state for the entire photo visualization tool
 */
function App() {
  // Photo Bank state - stores all uploaded photos
  const [photos, setPhotos] = useState([]);
  const [selectedPhotoId, setSelectedPhotoId] = useState(null);
  
  // Canvas state - current working visualization
  const [products, setProducts] = useState([]);
  
  // Completed visualizations state
  const [completedImages, setCompletedImages] = useState([]);

  // Photo Bank handlers
  const handleAddPhoto = (photo) => {
    setPhotos([...photos, photo]);
  };

  const handleDeletePhoto = (photoId) => {
    setPhotos(photos.filter(p => p.id !== photoId));
    if (selectedPhotoId === photoId) {
      setSelectedPhotoId(null);
      setProducts([]); // Clear canvas if deleting selected photo
    }
  };

  const handleRenamePhoto = (photoId, newName) => {
    setPhotos(photos.map(p => 
      p.id === photoId ? { ...p, name: newName } : p
    ));
  };

  const handleSelectPhoto = (photoId) => {
    if (products.length > 0) {
      const confirm = window.confirm(
        'Selecting a new photo will clear your current work. Continue?'
      );
      if (!confirm) return;
      setProducts([]);
    }
    setSelectedPhotoId(photoId);
  };

  // Canvas handlers
  const handleAddProduct = (product) => {
    setProducts([...products, product]);
  };

  const handleUpdateProduct = (updatedProduct) => {
    setProducts(products.map(p => 
      p.id === updatedProduct.id ? updatedProduct : p
    ));
  };

  const handleDeleteProduct = (productId) => {
    setProducts(products.filter(p => p.id !== productId));
  };

  // Save visualization
  const handleSaveVisualization = () => {
    if (!selectedPhotoId || products.length === 0) return;

    const selectedPhoto = photos.find(p => p.id === selectedPhotoId);
    const name = prompt('Enter a name for this visualization:', `Viz-${Date.now()}`);
    
    if (!name) return;

    // Create a composite image by capturing the canvas state
    // In a real app, you'd use html2canvas or similar
    // For now, we'll just store the state
    const newVisualization = {
      id: Date.now(),
      name: name.trim(),
      thumbnail: selectedPhoto.url, // Simplified - use background as thumbnail
      backgroundPhoto: selectedPhoto,
      products: [...products],
      attachedToQuote: false,
      createdAt: new Date().toISOString(),
    };

    setCompletedImages([...completedImages, newVisualization]);
    
    // Clear canvas after saving
    setProducts([]);
    setSelectedPhotoId(null);
    
    alert('Visualization saved successfully!');
  };

  // Clear canvas
  const handleClearCanvas = () => {
    if (products.length > 0 || selectedPhotoId) {
      const confirm = window.confirm('Are you sure you want to clear the canvas?');
      if (!confirm) return;
    }
    setProducts([]);
    setSelectedPhotoId(null);
  };

  // Completed images handlers
  const handleDeleteCompleted = (imageId) => {
    const confirm = window.confirm('Delete this visualization?');
    if (!confirm) return;
    setCompletedImages(completedImages.filter(img => img.id !== imageId));
  };

  const handleToggleQuoteAttachment = (imageId) => {
    setCompletedImages(completedImages.map(img =>
      img.id === imageId 
        ? { ...img, attachedToQuote: !img.attachedToQuote }
        : img
    ));
  };

  // Get selected photo object
  const selectedPhoto = photos.find(p => p.id === selectedPhotoId);

  return React.createElement('div', { className: 'app' },
    React.createElement('header', { className: 'app-header' },
      React.createElement('h1', null, 'Photo Visualization Tool'),
      React.createElement('p', null, 'Upload photos, embed product images, and create visualizations')
    ),

    React.createElement('div', { className: 'app-layout' },
      // Left sidebar - Photo Bank
      React.createElement('aside', { className: 'sidebar' },
        React.createElement(PhotoBank, {
          photos: photos,
          onAddPhoto: handleAddPhoto,
          onDeletePhoto: handleDeletePhoto,
          onRenamePhoto: handleRenamePhoto,
          onSelectPhoto: handleSelectPhoto,
          selectedPhotoId: selectedPhotoId
        })
      ),

      // Main content - Canvas and Controls
      React.createElement('main', { className: 'main-content' },
        React.createElement(CanvasArea, {
          backgroundPhoto: selectedPhoto,
          products: products,
          onAddProduct: handleAddProduct,
          onUpdateProduct: handleUpdateProduct,
          onDeleteProduct: handleDeleteProduct
        }),
        
        React.createElement(Controls, {
          onSave: handleSaveVisualization,
          onClear: handleClearCanvas,
          canSave: selectedPhotoId !== null && products.length > 0
        })
      ),

      // Right sidebar - Completed Images
      React.createElement('aside', { className: 'sidebar-right' },
        React.createElement(CompletedImages, {
          completedImages: completedImages,
          onDelete: handleDeleteCompleted,
          onToggleQuoteAttachment: handleToggleQuoteAttachment
        })
      )
    )
  );
}

export default App;
