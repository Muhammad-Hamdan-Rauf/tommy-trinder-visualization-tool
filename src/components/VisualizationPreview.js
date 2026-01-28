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
    React.createElement('div', { 
      className: 'preview-controls',
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 24px',
        background: 'white',
        borderBottom: '1px solid #e5e7eb',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      }
    },
      React.createElement(Button, {
        variant: 'secondary',
        onClick: onBack,
        style: {
          padding: '10px 20px',
          fontSize: '15px',
          fontWeight: '500',
          border: '1px solid #d1d5db',
          borderRadius: '8px',
          background: 'white',
          cursor: 'pointer',
          transition: 'all 0.2s'
        }
      }, '← Back to Editor'),
      
      React.createElement('div', { 
        className: 'preview-actions',
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: '20px'
        }
      },
        React.createElement('input', {
          ref: fileInputRef,
          type: 'file',
          accept: 'image/*',
          onChange: handleFileUpload,
          style: { display: 'none' }
        }),
        React.createElement(Button, {
          variant: 'primary',
          onClick: () => fileInputRef.current.click(),
          style: {
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            color: 'white',
            padding: '10px 24px',
            fontSize: '15px',
            fontWeight: '600',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)',
            transition: 'all 0.2s'
          }
        }, '📷 Upload Background Photo'),
        
        React.createElement('div', { 
          className: 'scale-control',
          style: {
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '8px 16px',
            background: '#f9fafb',
            borderRadius: '8px',
            border: '1px solid #e5e7eb'
          }
        },
          React.createElement('label', { 
            style: {
              fontSize: '14px',
              fontWeight: '500',
              color: '#6b7280'
            }
          }, 'Scale:'),
          React.createElement('input', {
            type: 'range',
            min: '0.2',
            max: '1',
            step: '0.05',
            value: scale,
            onChange: (e) => setScale(parseFloat(e.target.value)),
            style: {
              width: '120px',
              cursor: 'pointer'
            }
          }),
          React.createElement('span', { 
            style: {
              fontSize: '14px',
              fontWeight: '600',
              color: '#3b82f6',
              minWidth: '45px',
              textAlign: 'right'
            }
          }, `${Math.round(scale * 100)}%`)
        )
      )
    ),
    
    // Window state selector
    React.createElement('div', { 
      className: 'window-state-selector',
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
        padding: '16px',
        background: 'linear-gradient(to bottom, #f9fafb, #f3f4f6)',
        borderBottom: '1px solid #e5e7eb'
      }
    },
      React.createElement('span', { 
        style: {
          fontSize: '15px',
          fontWeight: '600',
          color: '#374151',
          marginRight: '8px'
        }
      }, 'Window State:'),
      windowStates.map((ws) =>
        React.createElement('button', {
          key: ws.id,
          onClick: () => {
            setWindowState(ws.id);
            actions.setPreview({ windowState: ws.id });
          },
          style: {
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            minWidth: '120px',
            fontSize: '14px',
            fontWeight: '500',
            border: windowState === ws.id ? '2px solid #3b82f6' : '2px solid #e5e7eb',
            borderRadius: '8px',
            background: windowState === ws.id ? '#eff6ff' : 'white',
            color: windowState === ws.id ? '#3b82f6' : '#6b7280',
            cursor: 'pointer',
            transition: 'all 0.2s',
            boxShadow: windowState === ws.id ? '0 0 0 3px rgba(59, 130, 246, 0.1)' : 'none'
          }
        },
          React.createElement('span', { 
            style: { 
              fontSize: '18px'
            }
          }, ws.icon),
          React.createElement('span', null, ws.label)
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
                interactive: false,
                showDimensions: true
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
          interactive: false,
          showDimensions: true
        })
      )
    ),
    
    // Tips
    React.createElement('div', { 
      className: 'preview-tips',
      style: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '32px',
        padding: '12px 24px',
        background: 'linear-gradient(to right, #f9fafb, white, #f9fafb)',
        borderTop: '1px solid #e5e7eb',
        fontSize: '14px',
        color: '#6b7280'
      }
    },
      React.createElement('p', { 
        style: { 
          margin: 0,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        } 
      }, 
        React.createElement('span', { style: { fontSize: '16px' } }, '💡'),
        'Drag the window to position it on your photo'
      ),
      React.createElement('p', { 
        style: { 
          margin: 0,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        } 
      }, 
        React.createElement('span', { style: { fontSize: '16px' } }, '🔍'),
        'Use the scale slider to resize the window'
      )
    )
  );
}

export default VisualizationPreview;
