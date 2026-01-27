import React from 'react';
import { useWindow } from '../context/WindowContext.js';

/**
 * WindowRenderer Component
 * Renders the window visualization based on current configuration
 */
function WindowRenderer({ scale = 0.5, interactive = true }) {
  const { state, actions } = useWindow();
  
  const { dimensions, panes, grid, openers, finish, glass, glazing, hardware, extras, preview } = state;
  
  // Calculate scaled dimensions
  const scaledWidth = dimensions.width * scale;
  const scaledHeight = dimensions.height * scale;
  
  // Frame styling
  const frameColor = finish.frame.colorHex || '#f8f6f0';
  const sashColor = finish.sash.colorHex || '#f8f6f0';
  const frameWidth = 25 * scale;
  const sashWidth = 15 * scale;
  
  // Glass styling
  const defaultGlass = glass.default || {};
  const glassTexture = defaultGlass.texture || 'Clear';
  
  // Get glass background based on texture and preview state
  const getGlassBackground = (paneId) => {
    const paneGlass = glass[paneId] || defaultGlass;
    
    if (preview.windowState !== 'closed' && preview.backgroundImage) {
      return `url(${preview.backgroundImage})`;
    }
    
    // Texture backgrounds
    const textureBackgrounds = {
      'Clear': 'linear-gradient(180deg, #87CEEB 0%, #ADD8E6 50%, #87CEEB 100%)',
      'Arctic': 'linear-gradient(135deg, #d0d5d9 0%, #e8ebee 50%, #d0d5d9 100%)',
      'Contora': 'repeating-linear-gradient(90deg, #c5c8cb 0px, #d8dadc 2px, #c5c8cb 4px)',
      'Chantilly': 'radial-gradient(circle, #e0e0e0 1px, #dcdcdc 1px)',
      'Cotswold': 'linear-gradient(45deg, #c9c0b5 25%, #d5ccc1 50%, #c9c0b5 75%)',
    };
    
    return textureBackgrounds[paneGlass.texture] || textureBackgrounds['Clear'];
  };
  
  // Draw opener indicator
  const renderOpenerIndicator = (pane, opener) => {
    if (!opener || opener.type === 'dummy') return null;
    
    const paneWidth = (pane.width * scale) - sashWidth * 2;
    const paneHeight = (pane.height * scale) - sashWidth * 2;
    
    // Calculate handle position
    let handleX, handleY;
    
    if (opener.type === 'side-hung') {
      if (opener.hinge === 'left') {
        handleX = paneWidth - 15;
        handleY = paneHeight / 2;
      } else {
        handleX = 15;
        handleY = paneHeight / 2;
      }
    } else if (opener.type === 'top-hung') {
      handleX = paneWidth / 2;
      handleY = paneHeight - 15;
    }
    
    return React.createElement('div', {
      className: 'opener-handle',
      style: {
        position: 'absolute',
        left: handleX,
        top: handleY,
        transform: 'translate(-50%, -50%)'
      }
    },
      React.createElement('svg', {
        width: '30',
        height: '15',
        viewBox: '0 0 30 15'
      },
        React.createElement('ellipse', {
          cx: '5',
          cy: '7.5',
          rx: '4',
          ry: '4',
          fill: '#333'
        }),
        React.createElement('path', {
          d: 'M 8 6 Q 15 4, 25 7 Q 28 8, 25 9 Q 15 11, 8 9 Z',
          fill: '#333'
        })
      )
    );
  };
  
  // Render glazing bars
  const renderGlazingBars = (pane) => {
    if (!glazing.type) return null;
    
    const paneWidth = (pane.width * scale) - sashWidth * 2;
    const paneHeight = (pane.height * scale) - sashWidth * 2;
    const barWidth = 4 * scale;
    
    // For Astragal/Georgian - create grid pattern
    const bars = [];
    
    if (glazing.type === 'Astragal' || glazing.type === 'Georgian') {
      // Vertical bars (2 for 3-column look)
      const vBarSpacing = paneWidth / 3;
      for (let i = 1; i < 3; i++) {
        bars.push(
          React.createElement('div', {
            key: `v-${i}`,
            className: 'glazing-bar vertical',
            style: {
              position: 'absolute',
              left: vBarSpacing * i - barWidth / 2,
              top: 0,
              width: barWidth,
              height: paneHeight,
              backgroundColor: sashColor,
              boxShadow: '0 0 2px rgba(0,0,0,0.2)'
            }
          })
        );
      }
      
      // Horizontal bars
      const hBarSpacing = paneHeight / 4;
      for (let i = 1; i < 4; i++) {
        bars.push(
          React.createElement('div', {
            key: `h-${i}`,
            className: 'glazing-bar horizontal',
            style: {
              position: 'absolute',
              left: 0,
              top: hBarSpacing * i - barWidth / 2,
              width: paneWidth,
              height: barWidth,
              backgroundColor: sashColor,
              boxShadow: '0 0 2px rgba(0,0,0,0.2)'
            }
          })
        );
      }
    }
    
    return React.createElement('div', { className: 'glazing-bars-container' }, bars);
  };
  
  // Render individual pane
  const renderPane = (pane, index) => {
    const opener = openers[pane.id];
    const paneX = calculatePaneX(pane);
    const paneY = calculatePaneY(pane);
    
    return React.createElement('div', {
      key: pane.id,
      className: `window-pane ${state.ui.selectedPane === pane.id ? 'selected' : ''}`,
      style: {
        position: 'absolute',
        left: paneX,
        top: paneY,
        width: pane.width * scale,
        height: pane.height * scale,
      },
      onClick: () => interactive && actions.selectPane(pane.id)
    },
      // Sash frame
      React.createElement('div', {
        className: 'sash-frame',
        style: {
          position: 'absolute',
          inset: 0,
          border: `${sashWidth}px solid ${sashColor}`,
          boxShadow: 'inset 0 0 5px rgba(0,0,0,0.1), 0 0 3px rgba(0,0,0,0.1)',
          borderRadius: '2px',
          boxSizing: 'border-box'
        }
      }),
      
      // Glass
      React.createElement('div', {
        className: 'pane-glass',
        style: {
          position: 'absolute',
          left: sashWidth,
          top: sashWidth,
          right: sashWidth,
          bottom: sashWidth,
          background: getGlassBackground(pane.id),
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }
      },
        renderGlazingBars(pane)
      ),
      
      // Opener handle
      opener && renderOpenerIndicator(pane, opener)
    );
  };
  
  // Calculate pane X position
  const calculatePaneX = (pane) => {
    let x = frameWidth;
    for (let i = 0; i < pane.col; i++) {
      const prevPane = panes.find(p => p.row === pane.row && p.col === i);
      if (prevPane) {
        x += prevPane.width * scale;
      }
    }
    return x;
  };
  
  // Calculate pane Y position
  const calculatePaneY = (pane) => {
    let y = frameWidth;
    for (let i = 0; i < pane.row; i++) {
      const prevPane = panes.find(p => p.row === i && p.col === pane.col);
      if (prevPane) {
        y += prevPane.height * scale;
      }
    }
    return y;
  };
  
  // Render dimension labels
  const renderDimensions = () => {
    if (!preview.showDimensions) return null;
    
    const dimensions = [];
    
    // Overall width dimension (top, centered above window)
    dimensions.push(
      React.createElement('div', {
        key: 'width-top',
        className: 'dimension-label horizontal-dim top-dim',
        style: {
          position: 'absolute',
          top: -45,
          left: 0,
          width: scaledWidth,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }
      },
        React.createElement('div', { className: 'dim-line-horizontal', style: { width: '100%', height: '2px', background: '#e74c3c', marginBottom: '4px' } }),
        React.createElement('span', { className: 'dim-value', style: { background: '#e74c3c', color: 'white', padding: '4px 12px', borderRadius: '4px', fontSize: '13px', fontWeight: '600' } }, state.dimensions.width)
      )
    );
    
    // Overall height dimension (right side, middle)
    dimensions.push(
      React.createElement('div', {
        key: 'height-right',
        className: 'dimension-label vertical-dim right-dim',
        style: {
          position: 'absolute',
          right: -55,
          top: 0,
          height: scaledHeight,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center'
        }
      },
        React.createElement('div', { className: 'dim-line-vertical', style: { width: '2px', height: '100%', background: '#3498db', marginRight: '4px' } }),
        React.createElement('span', { className: 'dim-value', style: { background: '#3498db', color: 'white', padding: '4px 12px', borderRadius: '4px', fontSize: '13px', fontWeight: '600', whiteSpace: 'nowrap' } }, state.dimensions.height)
      )
    );
    
    // If there are multiple rows, show row heights on left
    if (grid.rows > 1 && state.dimensions.upperHeight) {
      // Upper height
      dimensions.push(
        React.createElement('div', {
          key: 'height-upper',
          className: 'dimension-label vertical-dim left-dim',
          style: {
            position: 'absolute',
            left: -55,
            top: 0,
            height: state.dimensions.upperHeight * scale,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start'
          }
        },
          React.createElement('span', { className: 'dim-value', style: { background: '#2ecc71', color: 'white', padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: '600', marginRight: '4px' } }, state.dimensions.upperHeight),
          React.createElement('div', { className: 'dim-line-vertical', style: { width: '2px', height: '100%', background: '#2ecc71' } })
        )
      );
      
      // Lower height
      if (state.dimensions.lowerHeight) {
        dimensions.push(
          React.createElement('div', {
            key: 'height-lower',
            className: 'dimension-label vertical-dim left-dim',
            style: {
              position: 'absolute',
              left: -55,
              top: state.dimensions.upperHeight * scale,
              height: state.dimensions.lowerHeight * scale,
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-start'
            }
          },
            React.createElement('span', { className: 'dim-value', style: { background: '#2ecc71', color: 'white', padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: '600', marginRight: '4px' } }, state.dimensions.lowerHeight),
            React.createElement('div', { className: 'dim-line-vertical', style: { width: '2px', height: '100%', background: '#2ecc71' } })
          )
        );
      }
    }
    
    // Column widths (bottom)
    if (grid.cols > 1) {
      const firstRowPanes = panes.filter(p => p.row === 0).sort((a, b) => a.col - b.col);
      firstRowPanes.forEach((pane, index) => {
        const paneX = calculatePaneX(pane);
        const paneWidth = pane.width * scale;
        
        dimensions.push(
          React.createElement('div', {
            key: `width-${pane.id}`,
            className: 'dimension-label horizontal-dim bottom-dim',
            style: {
              position: 'absolute',
              bottom: -45,
              left: paneX - frameWidth,
              width: paneWidth,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }
          },
            React.createElement('div', { className: 'dim-line-horizontal', style: { width: '100%', height: '2px', background: '#f39c12', marginTop: '4px' } }),
            React.createElement('span', { className: 'dim-value', style: { background: '#f39c12', color: 'white', padding: '3px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: '600', marginBottom: '4px' } }, pane.width)
          )
        );
      });
    }
    
    return React.createElement('div', { className: 'dimension-labels' }, ...dimensions);
  };
  
  // Render cill
  const renderCill = () => {
    if (!extras.cill.enabled) return null;
    
    const cillHeight = 15 * scale;
    const cillExtension = extras.cill.leftHorn * scale;
    
    return React.createElement('div', {
      className: 'window-cill',
      style: {
        position: 'absolute',
        bottom: -cillHeight,
        left: -cillExtension,
        width: scaledWidth + cillExtension * 2,
        height: cillHeight,
        backgroundColor: finish.cill?.colorHex || '#f8f6f0',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        borderRadius: '0 0 3px 3px'
      }
    });
  };
  
  // Show empty state if no panes designed
  if (!panes || panes.length === 0) {
    return React.createElement('div', {
      className: 'window-renderer-empty',
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 40px',
        textAlign: 'center',
        color: '#666',
        background: '#f9f9f9',
        borderRadius: '12px',
        border: '2px dashed #ddd',
        maxWidth: '500px',
        margin: '80px auto'
      }
    },
      React.createElement('div', {
        style: {
          fontSize: '64px',
          marginBottom: '20px',
          opacity: 0.5
        }
      }, '🪟'),
      React.createElement('h3', {
        style: {
          fontSize: '20px',
          fontWeight: '600',
          marginBottom: '12px',
          color: '#333'
        }
      }, 'No Window Designed Yet'),
      React.createElement('p', {
        style: {
          fontSize: '15px',
          lineHeight: '1.6',
          color: '#666',
          maxWidth: '380px'
        }
      }, 'Go back to the editor and draw a window frame with dividers to see it previewed here on your background photo.')
    );
  }
  
  return React.createElement('div', {
    className: 'window-renderer',
    style: {
      position: 'relative',
      width: scaledWidth,
      height: scaledHeight,
      margin: '80px auto'
    }
  },
    // Main frame
    React.createElement('div', {
      className: 'window-frame',
      style: {
        position: 'absolute',
        inset: 0,
        backgroundColor: frameColor,
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
        borderRadius: '3px'
      }
    }),
    
    // Panes
    panes.map((pane, index) => renderPane(pane, index)),
    
    // Cill
    renderCill(),
    
    // Dimensions
    renderDimensions()
  );
}

export default WindowRenderer;
