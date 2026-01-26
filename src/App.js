import React from 'react';
import { useWindow } from './context/WindowContext.js';
import PhotoBank from './components/PhotoBank.js';
import CanvasArea from './components/CanvasArea.js';
import Controls from './components/Controls.js';
import CompletedImages from './components/CompletedImages.js';
import './App.css';

/**
 * Main App Component
 * Manages state for the entire photo visualization tool
 * Now uses centralized WindowContext for all state management
 */
function App() {
  const { state, actions } = useWindow();
  
  // Destructure state for easier access
  const photos = state.photoBank;
  const selectedPhotoId = state.selectedPhotoId;
  const draftProducts = state.draftVisualization.products;
  const completedVisualizations = state.completedVisualizations;
  const isDirty = state.draftVisualization.isDirty;

  // Photo Bank handlers (now dispatch to context)
  const handleAddPhoto = (photo) => {
    actions.addPhoto(photo);
  };

  const handleDeletePhoto = (photoId) => {
    actions.deletePhoto(photoId);
  };

  const handleRenamePhoto = (photoId, newName) => {
    actions.renamePhoto(photoId, newName);
  };

  const handleSelectPhoto = (photoId) => {
    // Warn if there are unsaved changes
    if (isDirty && draftProducts.length > 0) {
      const confirm = window.confirm(
        'You have unsaved changes. Selecting a new photo will clear your current work. Continue?'
      );
      if (!confirm) return;
      actions.clearDraft();
    }
    actions.selectPhoto(photoId);
  };

  // Canvas handlers
  const handleAddProduct = (product) => {
    actions.addProductToDraft(product);
  };

  const handleUpdateProduct = (updatedProduct) => {
    actions.updateProductInDraft(updatedProduct);
  };

  const handleDeleteProduct = (productId) => {
    actions.deleteProductFromDraft(productId);
  };

  // Save visualization
  const handleSaveVisualization = () => {
    if (!selectedPhotoId || draftProducts.length === 0) {
      alert('Cannot save: No photo selected or no products added.');
      return;
    }

    const selectedPhoto = photos.find(p => p.id === selectedPhotoId);
    if (!selectedPhoto) {
      alert('Selected photo not found.');
      return;
    }
    
    const name = prompt('Enter a name for this visualization:', `Visualization-${Date.now()}`);
    
    if (!name || !name.trim()) {
      return;
    }

    // Create a completed visualization
    const newVisualization = {
      name: name.trim(),
      thumbnail: selectedPhoto.url, // Use background as thumbnail
      backgroundPhotoId: selectedPhotoId,
      products: draftProducts.map(p => ({ ...p })), // Deep copy products
      attachedToQuote: false,
      locked: true, // Mark as immutable
    };

    actions.saveVisualization(newVisualization);
    
    alert('Visualization saved successfully!');
  };

  // Clear canvas
  const handleClearCanvas = () => {
    if (draftProducts.length > 0 || selectedPhotoId) {
      const confirm = window.confirm('Are you sure you want to clear the canvas? Any unsaved work will be lost.');
      if (!confirm) return;
    }
    actions.clearDraft();
  };

  // Completed images handlers
  const handleDeleteCompleted = (imageId) => {
    const viz = completedVisualizations.find(v => v.id === imageId);
    if (viz && viz.attachedToQuote) {
      alert('Cannot delete a visualization attached to a quote. Remove it from the quote first.');
      return;
    }
    
    const confirm = window.confirm('Delete this visualization? This action cannot be undone.');
    if (!confirm) return;
    
    actions.deleteVisualization(imageId);
  };

  const handleToggleQuoteAttachment = (imageId) => {
    actions.toggleQuoteAttachment(imageId);
  };
  
  const handleEditVisualization = (imageId) => {
    if (isDirty && draftProducts.length > 0) {
      const confirm = window.confirm(
        'Loading this visualization will replace your current work. Continue?'
      );
      if (!confirm) return;
    }
    
    actions.loadVisualizationToDraft(imageId);
    alert('Visualization loaded to canvas. You can now edit it. Remember to save when done!');
  };

  // Get selected photo object
  const selectedPhoto = photos.find(p => p.id === selectedPhotoId);

  return React.createElement('div', { className: 'app' },
    React.createElement('header', { className: 'app-header' },
      React.createElement('h1', null, 'Photo Visualization Tool'),
      React.createElement('p', null, 'Upload photos, embed product images, and create professional visualizations')
    ),

    React.createElement('div', { className: 'app-layout' },
      // Left sidebar - Photo Bank
      React.createElement('aside', { className: 'sidebar sidebar-left' },
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
          products: draftProducts,
          onAddProduct: handleAddProduct,
          onUpdateProduct: handleUpdateProduct,
          onDeleteProduct: handleDeleteProduct
        }),
        
        React.createElement(Controls, {
          onSave: handleSaveVisualization,
          onClear: handleClearCanvas,
          canSave: selectedPhotoId !== null && draftProducts.length > 0,
          isDirty: isDirty
        })
      ),

      // Right sidebar - Completed Images
      React.createElement('aside', { className: 'sidebar sidebar-right' },
        React.createElement(CompletedImages, {
          completedImages: completedVisualizations,
          onDelete: handleDeleteCompleted,
          onToggleQuoteAttachment: handleToggleQuoteAttachment,
          onEdit: handleEditVisualization
        })
      )
    )
  );
}

export default App;
