import React from 'react';
import ProductOverlay from './ProductOverlay.js';

/**
 * CanvasArea Component
 * Display area where users compose visualizations with background photo and product overlays
 */
function CanvasArea({ backgroundPhoto, products, onUpdateProduct, onDeleteProduct, onAddProduct }) {
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newProduct = {
          id: Date.now(),
          name: file.name,
          url: event.target.result,
          x: 100,
          y: 100,
          width: 200,
          height: 200,
        };
        onAddProduct(newProduct);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = ''; // Reset input
  };

  return React.createElement('div', { className: 'canvas-area' },
    React.createElement('div', { className: 'canvas-header' },
      React.createElement('h2', null, 'Canvas'),
      backgroundPhoto && React.createElement('div', null,
        React.createElement('input', {
          type: 'file',
          accept: 'image/*',
          onChange: handleFileUpload,
          id: 'product-upload',
          style: { display: 'none' }
        }),
        React.createElement('label', { htmlFor: 'product-upload', className: 'add-product-btn' },
          '+ Add Product Image'
        )
      )
    ),

    React.createElement('div', { className: 'canvas-container' },
      !backgroundPhoto 
        ? React.createElement('div', { className: 'canvas-placeholder' },
            React.createElement('p', null, 'Select a photo from the Photo Bank to start')
          )
        : React.createElement('div', { className: 'canvas-workspace' },
            // Background photo
            React.createElement('img', {
              src: backgroundPhoto.url,
              alt: backgroundPhoto.name,
              className: 'background-photo'
            }),
            
            // Product overlays
            products.map((product) =>
              React.createElement(ProductOverlay, {
                key: product.id,
                product: product,
                onUpdate: onUpdateProduct,
                onDelete: onDeleteProduct
              })
            )
          )
    )
  );
}

export default CanvasArea;
