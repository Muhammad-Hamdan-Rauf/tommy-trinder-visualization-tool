import React, { useState, useRef, useEffect } from 'react';

/**
 * ProductOverlay Component
 * Represents a draggable and resizable product image overlay
 */
function ProductOverlay({ product, onUpdate, onDelete }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const overlayRef = useRef(null);

  // Handle dragging
  const handleMouseDown = (e) => {
    if (e.target.classList.contains('resize-handle')) return;
    
    setIsDragging(true);
    setDragStart({
      x: e.clientX - product.x,
      y: e.clientY - product.y,
    });
    e.preventDefault();
  };

  // Handle resizing
  const handleResizeMouseDown = (e) => {
    setIsResizing(true);
    setDragStart({
      x: e.clientX,
      y: e.clientY,
      width: product.width,
      height: product.height,
    });
    e.stopPropagation();
    e.preventDefault();
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) {
        // Update position during drag
        onUpdate({
          ...product,
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y,
        });
      } else if (isResizing) {
        // Update size during resize
        const deltaX = e.clientX - dragStart.x;
        const deltaY = e.clientY - dragStart.y;
        
        // Maintain aspect ratio or allow free resize
        const newWidth = Math.max(50, dragStart.width + deltaX);
        const newHeight = Math.max(50, dragStart.height + deltaY);
        
        onUpdate({
          ...product,
          width: newWidth,
          height: newHeight,
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, dragStart, product, onUpdate]);

  return React.createElement('div', {
    ref: overlayRef,
    className: 'product-overlay',
    style: {
      position: 'absolute',
      left: product.x,
      top: product.y,
      width: product.width,
      height: product.height,
      cursor: isDragging ? 'grabbing' : 'grab',
      border: '2px solid #007bff',
      boxSizing: 'border-box',
    },
    onMouseDown: handleMouseDown
  },
    React.createElement('img', {
      src: product.url,
      alt: product.name,
      style: {
        width: '100%',
        height: '100%',
        objectFit: 'contain',
        pointerEvents: 'none',
      }
    }),
    
    // Resize handle
    React.createElement('div', {
      className: 'resize-handle',
      onMouseDown: handleResizeMouseDown,
      style: {
        position: 'absolute',
        right: -5,
        bottom: -5,
        width: 15,
        height: 15,
        backgroundColor: '#007bff',
        cursor: 'se-resize',
        borderRadius: '50%',
      }
    }),
    
    // Delete button
    React.createElement('button', {
      className: 'overlay-delete-btn',
      onClick: (e) => {
        e.stopPropagation();
        onDelete(product.id);
      },
      style: {
        position: 'absolute',
        top: -10,
        right: -10,
        width: 24,
        height: 24,
        borderRadius: '50%',
        backgroundColor: '#dc3545',
        color: 'white',
        border: 'none',
        cursor: 'pointer',
        fontSize: '14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }
    }, '×')
  );
}

export default ProductOverlay;
