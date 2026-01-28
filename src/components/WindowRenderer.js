import React from 'react';
import { useWindow } from '../context/WindowContext.js';

/**
 * WindowRenderer Component
 * Renders the window visualization based on current configuration
 */

// Helper function to adjust color brightness
const adjustBrightness = (hex, percent) => {
  // Remove # if present
  hex = hex.replace('#', '');
  
  // Parse RGB
  const num = parseInt(hex, 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + percent));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + percent));
  const b = Math.min(255, Math.max(0, (num & 0x0000FF) + percent));
  
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
};

function WindowRenderer({ scale = 0.5, interactive = true, showDimensions = false }) {
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
    if (!opener || opener.type === 'dummy' || opener.type === 'fixed') return null;
    
    const paneWidth = pane.width * scale;
    const paneHeight = pane.height * scale;
    
    // Calculate handle position and rotation based on opener type
    let handleX, handleY, rotation;
    
    if (opener.type.includes('side-hung')) {
      if (opener.hinge === 'left') {
        // Hinge on left, handle on right edge
        handleX = paneWidth - sashWidth - 8;
        handleY = paneHeight / 2;
        rotation = 0; // Handle points left
      } else {
        // Hinge on right, handle on left edge
        handleX = sashWidth + 8;
        handleY = paneHeight / 2;
        rotation = 180; // Handle points right
      }
    } else if (opener.type === 'top-hung') {
      // Hinge on top, handle on bottom edge
      handleX = paneWidth / 2;
      handleY = paneHeight - sashWidth - 8;
      rotation = 90; // Handle points up
    }
    
    return React.createElement('div', {
      className: 'opener-handle',
      style: {
        position: 'absolute',
        left: handleX,
        top: handleY,
        transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
        zIndex: 10
      }
    },
      // Window handle SVG - more realistic
      React.createElement('svg', {
        width: '24',
        height: '8',
        viewBox: '0 0 24 8',
        style: { filter: 'drop-shadow(1px 1px 1px rgba(0,0,0,0.3))' }
      },
        // Handle base (round part)
        React.createElement('circle', {
          cx: '4',
          cy: '4',
          r: '3.5',
          fill: '#2c2c2c',
          stroke: '#1a1a1a',
          strokeWidth: '0.5'
        }),
        // Handle lever
        React.createElement('rect', {
          x: '6',
          y: '2',
          width: '16',
          height: '4',
          rx: '1.5',
          fill: '#2c2c2c',
          stroke: '#1a1a1a',
          strokeWidth: '0.5'
        }),
        // Highlight on lever
        React.createElement('rect', {
          x: '8',
          y: '3',
          width: '12',
          height: '1',
          fill: '#4a4a4a',
          rx: '0.5'
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
          boxShadow: `
            inset 0 2px 4px rgba(255,255,255,0.6),
            inset 0 -2px 4px rgba(0,0,0,0.15),
            inset 2px 0 4px rgba(255,255,255,0.4),
            inset -2px 0 4px rgba(0,0,0,0.1),
            0 2px 8px rgba(0,0,0,0.2)
          `,
          borderRadius: '3px',
          boxSizing: 'border-box',
          background: `linear-gradient(135deg, ${sashColor} 0%, ${adjustBrightness(sashColor, -10)} 100%)`
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
          backgroundPosition: 'center',
          boxShadow: 'inset 0 0 20px rgba(255,255,255,0.15)',
          overflow: 'hidden'
        }
      },
        // Glass reflection overlay
        React.createElement('div', {
          style: {
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 40%, transparent 60%, rgba(255,255,255,0.05) 100%)',
            pointerEvents: 'none'
          }
        }),
        renderGlazingBars(pane)
      ),
      
      // Opener handle
      opener && renderOpenerIndicator(pane, opener)
    );
  };
  
  // Calculate pane X position (relative to inner container, no frameWidth offset needed)
  const calculatePaneX = (pane) => {
    // Get all panes in the same row before this column
    const panesBeforeInRow = panes.filter(p => p.row === pane.row && p.col < pane.col);
    const totalWidthBefore = panesBeforeInRow.reduce((sum, p) => sum + (p.width * scale), 0);
    return totalWidthBefore;
  };
  
  // Calculate pane Y position (relative to inner container, no frameWidth offset needed)
  const calculatePaneY = (pane) => {
    // Get all panes in the same column before this row
    const panesBeforeInCol = panes.filter(p => p.col === pane.col && p.row < pane.row);
    const totalHeightBefore = panesBeforeInCol.reduce((sum, p) => sum + (p.height * scale), 0);
    return totalHeightBefore;
  };
  
  // Render dimension labels
  const renderDimensions = () => {
    // Only show dimensions when showDimensions prop is true
    if (!showDimensions) return null;
    
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
    
    const cillHeight = 20 * scale;
    const cillExtension = (extras.cill.leftHorn || 50) * scale;
    const cillColor = finish.cill?.colorHex || finish.frame.colorHex || '#f8f6f0';
    
    return React.createElement('div', {
      className: 'window-cill',
      style: {
        position: 'absolute',
        bottom: -cillHeight,
        left: -(cillExtension + frameWidth),
        width: scaledWidth + frameWidth * 2 + cillExtension * 2,
        height: cillHeight,
        background: `linear-gradient(180deg, ${cillColor} 0%, ${adjustBrightness(cillColor, -20)} 100%)`,
        boxShadow: `
          0 4px 12px rgba(0,0,0,0.3),
          inset 0 2px 4px rgba(255,255,255,0.4),
          inset 0 -1px 2px rgba(0,0,0,0.2)
        `,
        borderRadius: '0 0 6px 6px',
        border: '1px solid rgba(0,0,0,0.1)',
        borderTop: 'none'
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
      width: scaledWidth + frameWidth * 2,
      height: scaledHeight + frameWidth * 2,
      margin: '100px auto 120px'
    }
  },
    // Main frame (outer border)
    React.createElement('div', {
      className: 'window-frame',
      style: {
        position: 'absolute',
        inset: 0,
        background: `linear-gradient(145deg, ${frameColor} 0%, ${adjustBrightness(frameColor, -8)} 100%)`,
        boxShadow: `
          0 8px 32px rgba(0,0,0,0.25),
          0 4px 12px rgba(0,0,0,0.15),
          inset 0 2px 4px rgba(255,255,255,0.3),
          inset 0 -2px 4px rgba(0,0,0,0.2)
        `,
        borderRadius: '4px',
        border: '2px solid rgba(0,0,0,0.1)'
      }
    }),
    
    // Inner frame area (where panes sit)
    React.createElement('div', {
      className: 'window-inner',
      style: {
        position: 'absolute',
        left: frameWidth,
        top: frameWidth,
        width: scaledWidth,
        height: scaledHeight,
        overflow: 'hidden'
      }
    },
      // Panes
      panes.map((pane, index) => renderPane(pane, index))
    ),
    
    // Cill
    renderCill(),
    
    // Dimensions
    renderDimensions()
  );
}

export default WindowRenderer;
