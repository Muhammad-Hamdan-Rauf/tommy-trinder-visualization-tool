import React, { useRef, useEffect, useState } from 'react';
import ProductOverlay from './ProductOverlay.js';
import { toNormalized, createDefaultTransform } from '../utils/coordinateUtils.js';

/**
 * CanvasArea Component
 * Display area where users compose visualizations with background photo and product overlays
 * Handles container resizing and maintains correct overlay positioning via normalized coordinates
 */
function CanvasArea({ backgroundPhoto, products, onUpdateProduct, onDeleteProduct, onAddProduct }) {
  const containerRef = useRef(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  
  // Track container size and update on resize
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerSize({
          width: rect.width,
          height: rect.height,
        });
      }
    };
    
    // Initial size
    updateSize();
    
    // Create ResizeObserver to watch for container size changes
    const resizeObserver = new ResizeObserver(() => {
      updateSize();
    });
    
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    
    // Also listen to window resize as fallback
    window.addEventListener('resize', updateSize);
    
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateSize);
    };
  }, [backgroundPhoto]);
  
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        // Create product at center of canvas with normalized coordinates
        const centerX = 0.35; // Center-ish, accounting for size
        const centerY = 0.35;
        const defaultWidth = 0.3; // 30% of container width
        const defaultHeight = 0.3; // 30% of container height
        
        const newProduct = {
          name: file.name,
          url: event.target.result,
          position: {
            x: centerX,
            y: centerY,
            width: defaultWidth,
            height: defaultHeight,
          },
          transform: createDefaultTransform(),
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
      backgroundPhoto && React.createElement('div', { className: 'canvas-actions' },
        React.createElement('input', {
          type: 'file',
          accept: 'image/*',
          onChange: handleFileUpload,
          id: 'product-upload',
          style: { display: 'none' }
        }),
        React.createElement('label', { htmlFor: 'product-upload', className: 'add-product-btn' },
          '+ Add Product Image'
        ),
        React.createElement('span', { className: 'canvas-info' },
          `${products.length} product${products.length !== 1 ? 's' : ''}`
        )
      )
    ),

    React.createElement('div', { 
      className: 'canvas-container',
      ref: containerRef,
      style: {
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
      }
    },
      !backgroundPhoto 
        ? React.createElement('div', { className: 'canvas-placeholder' },
            React.createElement('div', { className: 'placeholder-content' },
              React.createElement('div', { className: 'placeholder-icon' }, '🖼️'),
              React.createElement('h3', null, 'Select a Photo to Begin'),
              React.createElement('p', null, 'Choose a photo from the Photo Bank on the left to start creating your visualization')
            )
          )
        : React.createElement('div', { 
            className: 'canvas-workspace',
            style: {
              position: 'relative',
              width: '100%',
              height: '100%',
            }
          },
            // Background photo
            React.createElement('img', {
              src: backgroundPhoto.url,
              alt: backgroundPhoto.name,
              className: 'background-photo',
              style: {
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                userSelect: 'none',
                pointerEvents: 'none',
              }
            }),
            
            // Product overlays layer
            React.createElement('div', {
              className: 'overlays-layer',
              style: {
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
              }
            },
              // Render products only if container has valid size
              containerSize.width > 0 && containerSize.height > 0 && products.map((product) =>
                React.createElement(ProductOverlay, {
                  key: product.id,
                  product: product,
                  containerSize: containerSize,
                  onUpdate: onUpdateProduct,
                  onDelete: onDeleteProduct,
                  editable: true,
                })
              )
            ),
            
            // Canvas info overlay
            products.length === 0 && React.createElement('div', {
              className: 'canvas-hint',
              style: {
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                backgroundColor: 'rgba(0, 0, 0, 0.75)',
                color: 'white',
                padding: '16px 24px',
                borderRadius: '8px',
                textAlign: 'center',
                pointerEvents: 'none',
                maxWidth: '300px',
              }
            },
              React.createElement('p', { style: { margin: 0, fontSize: '14px' } },
                'Click "Add Product Image" above to embed a product onto this photo'
              )
            )
          )
    )
  );
}

export default CanvasArea;
