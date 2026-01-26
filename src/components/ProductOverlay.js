import React, { useState, useRef, useEffect, useCallback } from 'react';
import { toAbsolute, toNormalized, createTransformString, constrainToBounds } from '../utils/coordinateUtils.js';

/**
 * ProductOverlay Component
 * Represents a draggable, resizable, and transformable product image overlay
 * Uses normalized coordinates (0-1) to maintain position across container resizes
 */
function ProductOverlay({ product, containerSize, onUpdate, onDelete, editable = true }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isTransforming, setIsTransforming] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const overlayRef = useRef(null);

  // Convert normalized position to absolute pixels for rendering
  const absolutePosition = toAbsolute(product.position, containerSize);
  
  // Handle dragging start
  const handleMouseDown = useCallback((e) => {
    if (!editable) return;
    if (e.target.classList.contains('resize-handle') || 
        e.target.classList.contains('transform-handle')) return;
    
    setIsDragging(true);
    setDragStart({
      x: e.clientX - absolutePosition.x,
      y: e.clientY - absolutePosition.y,
    });
    e.preventDefault();
  }, [editable, absolutePosition.x, absolutePosition.y]);

  // Handle resizing start
  const handleResizeMouseDown = useCallback((e) => {
    if (!editable) return;
    setIsResizing(true);
    setDragStart({
      x: e.clientX,
      y: e.clientY,
      width: absolutePosition.width,
      height: absolutePosition.height,
    });
    e.stopPropagation();
    e.preventDefault();
  }, [editable, absolutePosition.width, absolutePosition.height]);
  
  // Handle transform controls (rotation, skew)
  const handleTransformMouseDown = useCallback((e) => {
    if (!editable) return;
    setIsTransforming(true);
    setDragStart({
      x: e.clientX,
      y: e.clientY,
      rotation: product.transform.rotation || 0,
    });
    e.stopPropagation();
    e.preventDefault();
  }, [editable, product.transform.rotation]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) {
        // Calculate new absolute position
        const newAbsoluteX = e.clientX - dragStart.x;
        const newAbsoluteY = e.clientY - dragStart.y;
        
        // Convert to normalized and constrain to bounds
        const newNormalized = constrainToBounds(
          toNormalized(
            { 
              x: newAbsoluteX, 
              y: newAbsoluteY, 
              width: absolutePosition.width,
              height: absolutePosition.height 
            },
            containerSize
          )
        );
        
        onUpdate({
          ...product,
          position: newNormalized,
        });
      } else if (isResizing) {
        // Calculate size delta
        const deltaX = e.clientX - dragStart.x;
        const deltaY = e.clientY - dragStart.y;
        
        // Maintain aspect ratio if shift key is held
        let newWidth = Math.max(50, dragStart.width + deltaX);
        let newHeight = Math.max(50, dragStart.height + deltaY);
        
        if (e.shiftKey) {
          const aspectRatio = dragStart.width / dragStart.height;
          newHeight = newWidth / aspectRatio;
        }
        
        // Convert to normalized
        const newNormalized = constrainToBounds(
          toNormalized(
            {
              x: absolutePosition.x,
              y: absolutePosition.y,
              width: newWidth,
              height: newHeight,
            },
            containerSize
          )
        );
        
        onUpdate({
          ...product,
          position: newNormalized,
        });
      } else if (isTransforming) {
        // Calculate rotation based on mouse movement
        const deltaX = e.clientX - dragStart.x;
        const rotationDelta = deltaX * 0.5; // 0.5 degrees per pixel
        const newRotation = dragStart.rotation + rotationDelta;
        
        onUpdate({
          ...product,
          transform: {
            ...product.transform,
            rotation: newRotation,
          },
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
      setIsTransforming(false);
    };

    if (isDragging || isResizing || isTransforming) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [
    isDragging, 
    isResizing, 
    isTransforming, 
    dragStart, 
    product, 
    onUpdate, 
    absolutePosition,
    containerSize
  ]);

  // Build transform string
  const transformString = createTransformString(product.transform || {});

  return React.createElement('div', {
    ref: overlayRef,
    className: `product-overlay ${editable ? 'editable' : 'locked'} ${isDragging ? 'dragging' : ''} ${isResizing ? 'resizing' : ''}`,
    style: {
      position: 'absolute',
      left: absolutePosition.x,
      top: absolutePosition.y,
      width: absolutePosition.width,
      height: absolutePosition.height,
      cursor: !editable ? 'default' : (isDragging ? 'grabbing' : 'grab'),
      border: editable ? '2px solid #007bff' : '1px solid rgba(0, 123, 255, 0.3)',
      boxSizing: 'border-box',
      transform: transformString,
      transformOrigin: 'center center',
      transition: (isDragging || isResizing || isTransforming) ? 'none' : 'transform 0.1s ease',
      pointerEvents: editable ? 'auto' : 'none',
      zIndex: isDragging || isResizing || isTransforming ? 1000 : 10,
    },
    onMouseDown: handleMouseDown,
    'data-product-id': product.id,
  },
    // Product image
    React.createElement('img', {
      src: product.url,
      alt: product.name,
      style: {
        width: '100%',
        width: '100%',
        height: '100%',
        objectFit: 'contain',
        pointerEvents: 'none',
        userSelect: 'none',
      }
    }),
    
    // Editable controls (only shown when editable)
    editable && React.createElement('div', { className: 'overlay-controls' },
      // Resize handle (bottom-right)
      React.createElement('div', {
        className: 'resize-handle',
        onMouseDown: handleResizeMouseDown,
        style: {
          position: 'absolute',
          right: -8,
          bottom: -8,
          width: 16,
          height: 16,
          backgroundColor: '#007bff',
          cursor: 'se-resize',
          borderRadius: '50%',
          border: '2px solid white',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        }
      }),
      
      // Transform handle (top-right) for rotation
      React.createElement('div', {
        className: 'transform-handle',
        onMouseDown: handleTransformMouseDown,
        title: 'Drag to rotate',
        style: {
          position: 'absolute',
          right: -8,
          top: -8,
          width: 16,
          height: 16,
          backgroundColor: '#28a745',
          cursor: 'grab',
          borderRadius: '50%',
          border: '2px solid white',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        }
      }),
      
      // Delete button (top-left)
      React.createElement('button', {
        className: 'overlay-delete-btn',
        onClick: (e) => {
          e.stopPropagation();
          if (window.confirm('Delete this product overlay?')) {
            onDelete(product.id);
          }
        },
        style: {
          position: 'absolute',
          top: -12,
          left: -12,
          width: 24,
          height: 24,
          borderRadius: '50%',
          backgroundColor: '#dc3545',
          color: 'white',
          border: '2px solid white',
          cursor: 'pointer',
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        }
      }, '×')
    ),
    
    // Product info overlay (shown on hover)
    React.createElement('div', {
      className: 'product-info-overlay',
      style: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        color: 'white',
        padding: '4px 8px',
        fontSize: '12px',
        opacity: 0,
        transition: 'opacity 0.2s',
        pointerEvents: 'none',
      }
    }, product.name)
  );
}

export default ProductOverlay;
