import React, { useState, useRef } from 'react';
import { useWindow } from '../context/WindowContext.js';
import WindowRenderer from './WindowRenderer.js';
import { Button, Card } from './common/UIComponents.js';

/**
 * VisualizationPreview Component
 * Allows users to upload background photo and preview window in different states
 */
function VisualizationPreview({ onBack }) {
  const { state, actions } = useWindow();
  const fileInputRef = useRef(null);
  const [windowState, setWindowState] = useState('closed');
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [scale, setScale] = useState(0.4);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  // Handle background image upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        actions.setPreview({ backgroundImage: event.target.result });
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };
  
  // Handle window drag
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };
  
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  // Window state options
  const windowStates = [
    { id: 'closed', label: 'Closed', icon: '▢' },
    { id: 'half-open', label: 'Half Open', icon: '◧' },
    { id: 'open', label: 'Open', icon: '☐' },
  ];
  
  return React.createElement('div', { className: 'visualization-preview' },
    // Controls bar
    React.createElement('div', { className: 'preview-controls' },
      React.createElement(Button, {
        variant: 'secondary',
        onClick: onBack
      }, '← Back to Editor'),
      
      React.createElement('div', { className: 'preview-actions' },
        React.createElement('input', {
          ref: fileInputRef,
          type: 'file',
          accept: 'image/*',
          onChange: handleFileUpload,
          style: { display: 'none' }
        }),
        React.createElement(Button, {
          variant: 'primary',
          onClick: () => fileInputRef.current.click()
        }, '📷 Upload Background Photo'),
        
        React.createElement('div', { className: 'scale-control' },
          React.createElement('label', null, 'Scale:'),
          React.createElement('input', {
            type: 'range',
            min: '0.2',
            max: '1',
            step: '0.05',
            value: scale,
            onChange: (e) => setScale(parseFloat(e.target.value))
          }),
          React.createElement('span', null, `${Math.round(scale * 100)}%`)
        )
      )
    ),
    
    // Window state selector
    React.createElement('div', { className: 'window-state-selector' },
      React.createElement('span', null, 'Window State:'),
      windowStates.map((ws) =>
        React.createElement(Card, {
          key: ws.id,
          selected: windowState === ws.id,
          onClick: () => {
            setWindowState(ws.id);
            actions.setPreview({ windowState: ws.id });
          },
          className: 'state-card'
        },
          React.createElement('span', { className: 'state-icon' }, ws.icon),
          React.createElement('span', { className: 'state-label' }, ws.label)
        )
      )
    ),
    
    // Preview area
    React.createElement('div', {
      className: 'preview-area',
      onMouseMove: handleMouseMove,
      onMouseUp: handleMouseUp,
      onMouseLeave: handleMouseUp
    },
      // Background image
      state.preview.backgroundImage
        ? React.createElement('div', { className: 'background-container' },
            React.createElement('img', {
              src: state.preview.backgroundImage,
              alt: 'Background',
              className: 'preview-background'
            }),
            
            // Draggable window
            React.createElement('div', {
              className: 'draggable-window',
              style: {
                position: 'absolute',
                left: position.x,
                top: position.y,
                cursor: isDragging ? 'grabbing' : 'grab',
                transform: windowState === 'half-open' ? 'perspective(500px) rotateY(-15deg)' :
                           windowState === 'open' ? 'perspective(500px) rotateY(-30deg)' : 'none'
              },
              onMouseDown: handleMouseDown
            },
              React.createElement(WindowRenderer, {
                scale: scale,
                interactive: false
              })
            )
          )
        : React.createElement('div', { 
            className: 'upload-prompt',
            style: {
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              textAlign: 'center',
              padding: '40px'
            }
          },
            React.createElement('div', { 
              className: 'upload-icon',
              style: {
                fontSize: '80px',
                marginBottom: '24px',
                opacity: 0.6
              }
            }, '📸'),
            React.createElement('h3', { 
              style: {
                fontSize: '24px',
                fontWeight: '600',
                marginBottom: '16px',
                color: '#333'
              }
            }, 'Upload a Background Photo'),
            React.createElement('p', { 
              style: {
                fontSize: '16px',
                color: '#666',
                maxWidth: '500px',
                lineHeight: '1.6',
                marginBottom: '24px'
              }
            }, 'Upload a photo of your home to visualize how the window will look'),
            React.createElement(Button, {
              variant: 'primary',
              onClick: () => fileInputRef.current.click(),
              style: {
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                padding: '12px 32px',
                fontSize: '16px',
                fontWeight: '600',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                transition: 'all 0.2s'
              }
            }, '📷 Choose Photo')
          ),
      
      // Window preview without background - show even without bg to preview the design
      !state.preview.backgroundImage && state.panes && state.panes.length > 0 && React.createElement('div', { 
        className: 'window-only-preview',
        style: {
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          marginTop: '60px'
        }
      },
        React.createElement(WindowRenderer, {
          scale: scale * 1.5,
          interactive: false
        })
      )
    ),
    
    // Tips
    React.createElement('div', { className: 'preview-tips' },
      React.createElement('p', null, '💡 Tip: Drag the window to position it on your photo'),
      React.createElement('p', null, '🔍 Use the scale slider to resize the window')
    )
  );
}

export default VisualizationPreview;
