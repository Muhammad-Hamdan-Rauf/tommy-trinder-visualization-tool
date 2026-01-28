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
  
  // Get glass background based on texture and preview state - realistic textures
  const getGlassBackground = (paneId) => {
    const paneGlass = glass[paneId] || defaultGlass;
    
    if (preview.windowState !== 'closed' && preview.backgroundImage) {
      return `url(${preview.backgroundImage})`;
    }
    
    // Realistic texture backgrounds like TommyTrinder
    const textureBackgrounds = {
      // Clear glass - realistic sky gradient
      'Clear': `linear-gradient(180deg, 
        #3a7ab8 0%, 
        #4a90d9 12%, 
        #6ba8e5 28%, 
        #87ceeb 45%, 
        #a8daf0 62%,
        #c5e8f5 78%, 
        #e0f4ff 100%)`,
      
      // Arctic - frosted/obscured with white tint
      'Arctic': `linear-gradient(180deg, 
        rgba(208, 213, 217, 0.95) 0%, 
        rgba(232, 235, 238, 0.9) 50%, 
        rgba(208, 213, 217, 0.95) 100%)`,
      
      // Contora - vertical reeded pattern
      'Contora': `repeating-linear-gradient(90deg, 
        rgba(190, 195, 200, 0.9) 0px, 
        rgba(220, 225, 230, 0.85) 3px, 
        rgba(190, 195, 200, 0.9) 6px)`,
      
      // Chantilly - lace/floral frosted pattern
      'Chantilly': `radial-gradient(circle at 25% 25%, rgba(240,240,240,0.95) 2px, transparent 2px),
        radial-gradient(circle at 75% 75%, rgba(240,240,240,0.95) 2px, transparent 2px),
        radial-gradient(circle at 50% 50%, rgba(230,230,230,0.9) 3px, transparent 3px),
        linear-gradient(180deg, #dcdcdc 0%, #e8e8e8 50%, #dcdcdc 100%)`,
      
      // Charcoal Sticks - dark reeded glass
      'Charcoal Sticks': `repeating-linear-gradient(90deg, 
        rgba(110, 110, 110, 0.95) 0px, 
        rgba(140, 140, 140, 0.9) 4px, 
        rgba(110, 110, 110, 0.95) 8px)`,
      
      // Everglade - green tinted frosted
      'Everglade': `linear-gradient(180deg, 
        rgba(160, 180, 160, 0.9) 0%, 
        rgba(184, 197, 184, 0.85) 50%, 
        rgba(160, 180, 160, 0.9) 100%)`,
      
      // Cotswold - warm amber/honey tinted
      'Cotswold': `linear-gradient(135deg, 
        rgba(201, 192, 181, 0.95) 0%, 
        rgba(213, 204, 193, 0.9) 25%, 
        rgba(225, 216, 205, 0.85) 50%, 
        rgba(213, 204, 193, 0.9) 75%, 
        rgba(201, 192, 181, 0.95) 100%)`,
      
      // Digital - modern geometric frosted
      'Digital': `linear-gradient(45deg, 
        rgba(168, 168, 168, 0.9) 25%, transparent 25%),
        linear-gradient(-45deg, rgba(168, 168, 168, 0.9) 25%, transparent 25%),
        linear-gradient(45deg, transparent 75%, rgba(168, 168, 168, 0.9) 75%),
        linear-gradient(-45deg, transparent 75%, rgba(168, 168, 168, 0.9) 75%),
        linear-gradient(180deg, #b0b0b0 0%, #c8c8c8 100%)`,
      
      // Mayflower - floral frosted pattern
      'Mayflower': `radial-gradient(circle at 30% 30%, rgba(213, 208, 200, 0.95) 5px, transparent 5px),
        radial-gradient(circle at 70% 70%, rgba(213, 208, 200, 0.95) 5px, transparent 5px),
        linear-gradient(180deg, #d5d0c8 0%, #e0dbd3 50%, #d5d0c8 100%)`,
      
      // Flemish - wavy distorted pattern
      'Flemish': `repeating-linear-gradient(180deg, 
        rgba(204, 200, 192, 0.95) 0px, 
        rgba(224, 220, 212, 0.9) 8px, 
        rgba(204, 200, 192, 0.95) 16px)`,
      
      // Minster - traditional cathedral pattern
      'Minster': `radial-gradient(ellipse at 50% 0%, rgba(200, 196, 188, 0.95) 0%, transparent 50%),
        radial-gradient(ellipse at 50% 100%, rgba(200, 196, 188, 0.95) 0%, transparent 50%),
        linear-gradient(180deg, #c8c4bc 0%, #d8d4cc 50%, #c8c4bc 100%)`,
      
      // Oak - warm wood-tinted frosted
      'Oak': `linear-gradient(180deg, 
        rgba(181, 165, 144, 0.95) 0%, 
        rgba(197, 181, 160, 0.9) 50%, 
        rgba(181, 165, 144, 0.95) 100%)`,
      
      // Satin - smooth frosted white
      'Satin': `linear-gradient(180deg, 
        rgba(240, 240, 245, 0.95) 0%, 
        rgba(250, 250, 255, 0.9) 50%, 
        rgba(240, 240, 245, 0.95) 100%)`,
      
      // Stippolyte - fine stippled pattern  
      'Stippolyte': `radial-gradient(circle at 2px 2px, rgba(200,200,200,0.8) 1px, transparent 1px),
        linear-gradient(180deg, #d0d0d0 0%, #e0e0e0 100%)`,
      
      // Taffeta - silk-like smooth frosted
      'Taffeta': `linear-gradient(135deg, 
        rgba(220, 220, 225, 0.95) 0%, 
        rgba(235, 235, 240, 0.9) 50%, 
        rgba(220, 220, 225, 0.95) 100%)`,
    };
    
    return textureBackgrounds[paneGlass.texture] || textureBackgrounds['Clear'];
  };
  
  // Draw opener indicator - Monkey tail / decorative handle style
  const renderOpenerIndicator = (pane, opener) => {
    if (!opener || opener.type === 'dummy' || opener.type === 'fixed') return null;
    
    const paneWidth = pane.width * scale;
    const paneHeight = pane.height * scale;
    
    // Calculate handle position and rotation based on opener type
    let handleX, handleY, rotation, flipY;
    
    if (opener.type.includes('side-hung')) {
      if (opener.hinge === 'left') {
        // Hinge on left, handle on right edge
        handleX = paneWidth - sashWidth - 12;
        handleY = paneHeight / 2;
        rotation = -90;
        flipY = false;
      } else {
        // Hinge on right, handle on left edge
        handleX = sashWidth + 12;
        handleY = paneHeight / 2;
        rotation = 90;
        flipY = true;
      }
    } else if (opener.type === 'top-hung') {
      // Hinge on top, handle on bottom edge
      handleX = paneWidth / 2;
      handleY = paneHeight - sashWidth - 12;
      rotation = 0;
      flipY = false;
    }
    
    // Scale handle size based on pane size
    const handleScale = Math.min(1, Math.max(0.5, scale * 1.5));
    const handleSize = 40 * handleScale;
    
    return React.createElement('div', {
      className: 'opener-handle',
      style: {
        position: 'absolute',
        left: handleX,
        top: handleY,
        transform: `translate(-50%, -50%) rotate(${rotation}deg) ${flipY ? 'scaleX(-1)' : ''}`,
        zIndex: 10
      }
    },
      // Monkey tail handle SVG - decorative traditional style
      React.createElement('svg', {
        width: handleSize,
        height: handleSize * 0.6,
        viewBox: '0 0 50 30',
        style: { filter: 'drop-shadow(2px 2px 2px rgba(0,0,0,0.4))' }
      },
        // Handle mounting plate (escutcheon)
        React.createElement('ellipse', {
          cx: '10',
          cy: '15',
          rx: '8',
          ry: '10',
          fill: '#3a3a3a',
          stroke: '#2a2a2a',
          strokeWidth: '1'
        }),
        // Plate highlight
        React.createElement('ellipse', {
          cx: '8',
          cy: '12',
          rx: '4',
          ry: '5',
          fill: '#5a5a5a',
          opacity: '0.5'
        }),
        // Handle stem
        React.createElement('path', {
          d: 'M 16 15 Q 25 15, 32 10 Q 38 6, 42 8 Q 48 12, 45 18 Q 42 24, 35 22 Q 30 20, 28 15',
          fill: 'none',
          stroke: '#2a2a2a',
          strokeWidth: '4',
          strokeLinecap: 'round'
        }),
        // Handle stem highlight
        React.createElement('path', {
          d: 'M 17 14 Q 24 14, 30 10 Q 35 7, 40 9',
          fill: 'none',
          stroke: '#5a5a5a',
          strokeWidth: '1.5',
          strokeLinecap: 'round'
        }),
        // Curl end
        React.createElement('circle', {
          cx: '35',
          cy: '20',
          r: '3',
          fill: '#2a2a2a'
        })
      )
    );
  };
  
  // Render glazing bars
  const renderGlazingBars = (pane) => {
    if (!glazing.type) return null;
    
    const paneWidth = (pane.width * scale) - sashWidth * 2;
    const paneHeight = (pane.height * scale) - sashWidth * 2;
    const barWidth = glazing.type === 'Leaded' ? 2 * scale : 4 * scale;
    
    // Get bar counts from glazing settings
    const hBars = glazing.horizontalBars || 1;
    const vBars = glazing.verticalBars || 1;
    
    const bars = [];
    
    if (glazing.type === 'Astragal' || glazing.type === 'Georgian') {
      // Vertical bars
      if (vBars > 0) {
        const vBarSpacing = paneWidth / (vBars + 1);
        for (let i = 1; i <= vBars; i++) {
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
                boxShadow: `
                  inset 1px 0 2px rgba(255,255,255,0.5),
                  inset -1px 0 2px rgba(0,0,0,0.15),
                  1px 0 3px rgba(0,0,0,0.2)
                `,
                borderRadius: '1px'
              }
            })
          );
        }
      }
      
      // Horizontal bars
      if (hBars > 0) {
        const hBarSpacing = paneHeight / (hBars + 1);
        for (let i = 1; i <= hBars; i++) {
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
                boxShadow: `
                  inset 0 1px 2px rgba(255,255,255,0.5),
                  inset 0 -1px 2px rgba(0,0,0,0.15),
                  0 1px 3px rgba(0,0,0,0.2)
                `,
                borderRadius: '1px'
              }
            })
          );
        }
      }
    } else if (glazing.type === 'Leaded') {
      // Leaded glass - thinner darker lines
      const leadColor = glazing.leadColor?.includes('Silver') ? '#8a8a8a' : '#4a4a5a';
      
      // Vertical lines
      if (vBars > 0) {
        const vBarSpacing = paneWidth / (vBars + 1);
        for (let i = 1; i <= vBars; i++) {
          bars.push(
            React.createElement('div', {
              key: `v-${i}`,
              className: 'glazing-bar vertical leaded',
              style: {
                position: 'absolute',
                left: vBarSpacing * i - barWidth / 2,
                top: 0,
                width: barWidth,
                height: paneHeight,
                backgroundColor: leadColor,
                boxShadow: '0 0 2px rgba(0,0,0,0.3)'
              }
            })
          );
        }
      }
      
      // Horizontal lines
      if (hBars > 0) {
        const hBarSpacing = paneHeight / (hBars + 1);
        for (let i = 1; i <= hBars; i++) {
          bars.push(
            React.createElement('div', {
              key: `h-${i}`,
              className: 'glazing-bar horizontal leaded',
              style: {
                position: 'absolute',
                left: 0,
                top: hBarSpacing * i - barWidth / 2,
                width: paneWidth,
                height: barWidth,
                backgroundColor: leadColor,
                boxShadow: '0 0 2px rgba(0,0,0,0.3)'
              }
            })
          );
        }
      }
    }
    
    return React.createElement('div', { className: 'glazing-bars-container' }, bars);
  };
  
  // Get sash frame style based on profile type
  const getSashFrameStyle = () => {
    const baseStyle = {
      position: 'absolute',
      inset: 0,
      border: `${sashWidth}px solid ${sashColor}`,
      boxSizing: 'border-box',
      background: `linear-gradient(135deg, ${sashColor} 0%, ${adjustBrightness(sashColor, -10)} 100%)`
    };
    
    // Profile-specific styling
    const profileType = state.productType.toLowerCase();
    
    if (profileType.includes('flush')) {
      // Flush Casement - flat, modern, minimal shadows
      return {
        ...baseStyle,
        boxShadow: `
          inset 0 2px 4px rgba(255,255,255,0.6),
          inset 0 -2px 4px rgba(0,0,0,0.15),
          inset 2px 0 4px rgba(255,255,255,0.4),
          inset -2px 0 4px rgba(0,0,0,0.1),
          0 2px 8px rgba(0,0,0,0.2)
        `,
        borderRadius: '3px'
      };
    } else if (profileType.includes('sculptured')) {
      // Sculptured - rounded, ornate with more depth
      return {
        ...baseStyle,
        boxShadow: `
          inset 0 3px 6px rgba(255,255,255,0.7),
          inset 0 -3px 6px rgba(0,0,0,0.25),
          inset 3px 0 6px rgba(255,255,255,0.5),
          inset -3px 0 6px rgba(0,0,0,0.2),
          0 3px 12px rgba(0,0,0,0.3)
        `,
        borderRadius: '8px', // More rounded for sculptured look
        border: `${sashWidth}px ridge ${sashColor}`, // Ridge border for 3D effect
      };
    } else if (profileType.includes('chamfered')) {
      // Chamfered - angular, beveled edges
      return {
        ...baseStyle,
        boxShadow: `
          inset 2px 2px 4px rgba(255,255,255,0.7),
          inset -2px -2px 4px rgba(0,0,0,0.3),
          0 2px 8px rgba(0,0,0,0.25)
        `,
        borderRadius: '2px', // Sharper corners for chamfered look
        borderStyle: 'solid',
        borderImage: `linear-gradient(135deg, ${adjustBrightness(sashColor, 15)} 0%, ${sashColor} 50%, ${adjustBrightness(sashColor, -15)} 100%) 1`
      };
    }
    
    return baseStyle;
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
      // Sash frame with inner rebate detail
      React.createElement('div', {
        className: 'sash-frame',
        style: getSashFrameStyle()
      },
        // Inner rebate (step between sash and glass)
        React.createElement('div', {
          className: 'sash-rebate',
          style: {
            position: 'absolute',
            left: sashWidth - 4,
            top: sashWidth - 4,
            right: sashWidth - 4,
            bottom: sashWidth - 4,
            border: `3px solid ${adjustBrightness(sashColor, -15)}`,
            boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.2)',
            borderRadius: '2px',
            pointerEvents: 'none'
          }
        })
      ),
      
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
          boxShadow: 'inset 0 2px 15px rgba(255,255,255,0.3), inset 0 -2px 15px rgba(0,0,0,0.08)',
          overflow: 'hidden',
          borderRadius: '2px'
        }
      },
        // Glass reflection overlay - subtle diagonal shine
        React.createElement('div', {
          style: {
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(
              135deg, 
              rgba(255,255,255,0.25) 0%, 
              rgba(255,255,255,0.08) 20%,
              transparent 35%, 
              transparent 65%, 
              rgba(255,255,255,0.05) 80%,
              rgba(255,255,255,0.15) 100%
            )`,
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
    
    const totalWidth = scaledWidth + frameWidth * 2;
    const totalHeight = scaledHeight + frameWidth * 2;
    const dimLabels = [];
    
    // Arrow end markers for dimension lines
    const arrowSize = 6;
    
    // Spacing from window edge
    const topOffset = -55;      // Overall width above window
    const rightOffset = -70;    // Overall height right of window
    const leftOffset = -70;     // Internal heights left of window
    const bottomOffset = -55;   // Internal widths below window (accounting for cill)
    
    // === OVERALL WIDTH (top - red) ===
    dimLabels.push(
      React.createElement('div', {
        key: 'width-top',
        className: 'dimension-line horizontal',
        style: {
          position: 'absolute',
          top: topOffset,
          left: 0,
          width: totalWidth,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }
      },
        // Line with arrows
        React.createElement('svg', {
          width: totalWidth,
          height: 20,
          style: { marginBottom: '4px' }
        },
          // Left vertical end line
          React.createElement('line', {
            x1: 0, y1: 0,
            x2: 0, y2: 20,
            stroke: '#c0392b', strokeWidth: 1.5
          }),
          // Horizontal line
          React.createElement('line', {
            x1: 0, y1: 10,
            x2: totalWidth, y2: 10,
            stroke: '#c0392b', strokeWidth: 1.5
          }),
          // Right vertical end line
          React.createElement('line', {
            x1: totalWidth, y1: 0,
            x2: totalWidth, y2: 20,
            stroke: '#c0392b', strokeWidth: 1.5
          }),
          // Left arrow
          React.createElement('polygon', {
            points: `0,10 ${arrowSize+2},${10-arrowSize/2} ${arrowSize+2},${10+arrowSize/2}`,
            fill: '#c0392b'
          }),
          // Right arrow
          React.createElement('polygon', {
            points: `${totalWidth},10 ${totalWidth-arrowSize-2},${10-arrowSize/2} ${totalWidth-arrowSize-2},${10+arrowSize/2}`,
            fill: '#c0392b'
          })
        ),
        // Label
        React.createElement('span', { 
          style: { 
            background: '#c0392b', 
            color: 'white', 
            padding: '4px 14px', 
            borderRadius: '4px', 
            fontSize: '13px', 
            fontWeight: '600',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
          } 
        }, Math.round(state.dimensions.width))
      )
    );
    
    // === OVERALL HEIGHT (right - red) ===
    dimLabels.push(
      React.createElement('div', {
        key: 'height-right',
        className: 'dimension-line vertical',
        style: {
          position: 'absolute',
          right: rightOffset,
          top: 0,
          height: totalHeight,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center'
        }
      },
        // Line with arrows
        React.createElement('svg', {
          width: 20,
          height: totalHeight,
          style: { marginRight: '4px' }
        },
          // Top horizontal end line
          React.createElement('line', {
            x1: 0, y1: 0,
            x2: 20, y2: 0,
            stroke: '#c0392b', strokeWidth: 1.5
          }),
          // Vertical line
          React.createElement('line', {
            x1: 10, y1: 0,
            x2: 10, y2: totalHeight,
            stroke: '#c0392b', strokeWidth: 1.5
          }),
          // Bottom horizontal end line
          React.createElement('line', {
            x1: 0, y1: totalHeight,
            x2: 20, y2: totalHeight,
            stroke: '#c0392b', strokeWidth: 1.5
          }),
          // Top arrow
          React.createElement('polygon', {
            points: `10,0 ${10-arrowSize/2},${arrowSize+2} ${10+arrowSize/2},${arrowSize+2}`,
            fill: '#c0392b'
          }),
          // Bottom arrow
          React.createElement('polygon', {
            points: `10,${totalHeight} ${10-arrowSize/2},${totalHeight-arrowSize-2} ${10+arrowSize/2},${totalHeight-arrowSize-2}`,
            fill: '#c0392b'
          })
        ),
        // Label
        React.createElement('span', { 
          style: { 
            background: '#c0392b', 
            color: 'white', 
            padding: '4px 14px', 
            borderRadius: '4px', 
            fontSize: '13px', 
            fontWeight: '600',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
          } 
        }, Math.round(state.dimensions.height))
      )
    );
    
    // === INTERNAL ROW HEIGHTS (left - green) ===
    if (grid.rows > 1) {
      const rowPanes = panes.filter(p => p.col === 0).sort((a, b) => a.row - b.row);
      let currentY = frameWidth;
      
      rowPanes.forEach((pane, index) => {
        const rowHeight = pane.height * scale;
        
        dimLabels.push(
          React.createElement('div', {
            key: `row-height-${index}`,
            className: 'dimension-line vertical internal',
            style: {
              position: 'absolute',
              left: leftOffset,
              top: currentY,
              height: rowHeight,
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center'
            }
          },
            // Line with arrows
            React.createElement('svg', {
              width: 20,
              height: rowHeight,
              style: { marginRight: '4px' }
            },
              // Top horizontal end line
              React.createElement('line', {
                x1: 0, y1: 0,
                x2: 20, y2: 0,
                stroke: '#27ae60', strokeWidth: 1.5
              }),
              // Vertical line
              React.createElement('line', {
                x1: 10, y1: 0,
                x2: 10, y2: rowHeight,
                stroke: '#27ae60', strokeWidth: 1.5
              }),
              // Bottom horizontal end line
              React.createElement('line', {
                x1: 0, y1: rowHeight,
                x2: 20, y2: rowHeight,
                stroke: '#27ae60', strokeWidth: 1.5
              }),
              // Top arrow
              React.createElement('polygon', {
                points: `10,0 ${10-arrowSize/2},${arrowSize+2} ${10+arrowSize/2},${arrowSize+2}`,
                fill: '#27ae60'
              }),
              // Bottom arrow
              React.createElement('polygon', {
                points: `10,${rowHeight} ${10-arrowSize/2},${rowHeight-arrowSize-2} ${10+arrowSize/2},${rowHeight-arrowSize-2}`,
                fill: '#27ae60'
              })
            ),
            // Label
            React.createElement('span', { 
              style: { 
                background: '#27ae60', 
                color: 'white', 
                padding: '3px 10px', 
                borderRadius: '4px', 
                fontSize: '12px', 
                fontWeight: '600',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
              } 
            }, Math.round(pane.height))
          )
        );
        
        currentY += rowHeight;
      });
    }
    
    // === INTERNAL COLUMN WIDTHS (bottom - blue) ===
    if (grid.cols > 1) {
      const colPanes = panes.filter(p => p.row === 0).sort((a, b) => a.col - b.col);
      let currentX = frameWidth;
      const cillOffset = extras.cill.enabled ? 30 : 0; // Extra space if cill is enabled
      
      colPanes.forEach((pane, index) => {
        const colWidth = pane.width * scale;
        // Column letters like TommyTrinder (A, B, C...)
        const colLetter = String.fromCharCode(65 + (colPanes.length - 1 - index)); // Reverse: rightmost is A
        
        dimLabels.push(
          React.createElement('div', {
            key: `col-width-${index}`,
            className: 'dimension-line horizontal internal',
            style: {
              position: 'absolute',
              bottom: bottomOffset - cillOffset,
              left: currentX,
              width: colWidth,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }
          },
            // Line with arrows
            React.createElement('svg', {
              width: colWidth,
              height: 20,
              style: { marginBottom: '4px' }
            },
              // Left vertical end line
              React.createElement('line', {
                x1: 0, y1: 0,
                x2: 0, y2: 20,
                stroke: '#2980b9', strokeWidth: 1.5
              }),
              // Horizontal line
              React.createElement('line', {
                x1: 0, y1: 10,
                x2: colWidth, y2: 10,
                stroke: '#2980b9', strokeWidth: 1.5
              }),
              // Right vertical end line
              React.createElement('line', {
                x1: colWidth, y1: 0,
                x2: colWidth, y2: 20,
                stroke: '#2980b9', strokeWidth: 1.5
              }),
              // Left arrow
              React.createElement('polygon', {
                points: `0,10 ${arrowSize+2},${10-arrowSize/2} ${arrowSize+2},${10+arrowSize/2}`,
                fill: '#2980b9'
              }),
              // Right arrow
              React.createElement('polygon', {
                points: `${colWidth},10 ${colWidth-arrowSize-2},${10-arrowSize/2} ${colWidth-arrowSize-2},${10+arrowSize/2}`,
                fill: '#2980b9'
              })
            ),
            // Label with dimension and column letter
            React.createElement('div', {
              style: {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2px'
              }
            },
              React.createElement('span', { 
                style: { 
                  background: '#2980b9', 
                  color: 'white', 
                  padding: '3px 10px', 
                  borderRadius: '4px', 
                  fontSize: '12px', 
                  fontWeight: '600',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                } 
              }, Math.round(pane.width)),
              React.createElement('span', { 
                style: { 
                  color: '#2980b9', 
                  fontSize: '11px', 
                  fontWeight: '600'
                } 
              }, colLetter)
            )
          )
        );
        
        currentX += colWidth;
      });
    }
    
    return React.createElement('div', { className: 'dimension-labels' }, ...dimLabels);
  };
  
  // Render cill
  const renderCill = () => {
    if (!extras.cill.enabled) return null;
    
    const cillHeight = 20 * scale;
    const leftHorn = (extras.cill.leftHorn || 50) * scale;
    const rightHorn = (extras.cill.rightHorn || 50) * scale;
    const cillColor = finish.cill?.colorHex || finish.frame.colorHex || '#f8f6f0';
    
    // Container width is scaledWidth + frameWidth * 2
    // Cill should extend beyond the container by the horn amounts
    const containerWidth = scaledWidth + frameWidth * 2;
    
    return React.createElement('div', {
      className: 'window-cill',
      style: {
        position: 'absolute',
        bottom: -cillHeight,
        left: -leftHorn,
        width: containerWidth + leftHorn + rightHorn,
        height: cillHeight,
        background: `linear-gradient(180deg, 
          ${adjustBrightness(cillColor, 5)} 0%, 
          ${cillColor} 30%, 
          ${adjustBrightness(cillColor, -8)} 70%,
          ${adjustBrightness(cillColor, -20)} 100%
        )`,
        boxShadow: `
          0 6px 16px rgba(0,0,0,0.25),
          0 3px 6px rgba(0,0,0,0.15),
          inset 0 3px 6px rgba(255,255,255,0.5),
          inset 0 -2px 4px rgba(0,0,0,0.15)
        `,
        borderRadius: '0 0 8px 8px',
        border: '1px solid rgba(0,0,0,0.08)',
        borderTop: 'none'
      }
    },
      // Drip edge / nose detail
      React.createElement('div', {
        style: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: `linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.2) 100%)`,
          borderRadius: '0 0 8px 8px'
        }
      })
    );
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
  
  // Get main frame style based on profile type
  const getMainFrameStyle = () => {
    const baseStyle = {
      position: 'absolute',
      inset: 0,
      background: `linear-gradient(145deg, ${frameColor} 0%, ${adjustBrightness(frameColor, -8)} 100%)`,
      border: '2px solid rgba(0,0,0,0.1)'
    };
    
    const profileType = state.productType.toLowerCase();
    
    if (profileType.includes('flush')) {
      // Flush Casement - clean, minimal
      return {
        ...baseStyle,
        boxShadow: `
          0 8px 32px rgba(0,0,0,0.25),
          0 4px 12px rgba(0,0,0,0.15),
          inset 0 2px 4px rgba(255,255,255,0.3),
          inset 0 -2px 4px rgba(0,0,0,0.2)
        `,
        borderRadius: '4px'
      };
    } else if (profileType.includes('sculptured')) {
      // Sculptured - rounded, deeper shadows
      return {
        ...baseStyle,
        boxShadow: `
          0 10px 40px rgba(0,0,0,0.3),
          0 6px 16px rgba(0,0,0,0.2),
          inset 0 3px 6px rgba(255,255,255,0.4),
          inset 0 -3px 6px rgba(0,0,0,0.25)
        `,
        borderRadius: '12px', // More rounded
        border: '3px ridge rgba(0,0,0,0.15)' // Ridge effect
      };
    } else if (profileType.includes('chamfered')) {
      // Chamfered - angular, beveled
      return {
        ...baseStyle,
        boxShadow: `
          0 8px 32px rgba(0,0,0,0.3),
          0 4px 12px rgba(0,0,0,0.2),
          inset 2px 2px 6px rgba(255,255,255,0.4),
          inset -2px -2px 6px rgba(0,0,0,0.25)
        `,
        borderRadius: '3px', // Sharper corners
        border: '2px solid rgba(0,0,0,0.15)'
      };
    }
    
    return baseStyle;
  };
  
  return React.createElement('div', {
    className: 'window-renderer',
    style: {
      position: 'relative',
      width: scaledWidth + frameWidth * 2,
      height: scaledHeight + frameWidth * 2,
      margin: '120px auto 140px'
    }
  },
    // Main frame (outer border)
    React.createElement('div', {
      className: 'window-frame',
      style: getMainFrameStyle()
    },
      // Frame inner edge highlight (bevel effect)
      React.createElement('div', {
        style: {
          position: 'absolute',
          left: frameWidth - 6,
          top: frameWidth - 6,
          right: frameWidth - 6,
          bottom: frameWidth - 6,
          border: `4px solid ${adjustBrightness(frameColor, -12)}`,
          boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.2), 0 1px 2px rgba(255,255,255,0.3)',
          borderRadius: '2px',
          pointerEvents: 'none'
        }
      })
    ),
    
    // Inner frame area (where panes sit)
    React.createElement('div', {
      className: 'window-inner',
      style: {
        position: 'absolute',
        left: frameWidth,
        top: frameWidth,
        width: scaledWidth,
        height: scaledHeight,
        overflow: 'hidden',
        boxShadow: 'inset 0 3px 8px rgba(0,0,0,0.3), inset 0 -1px 4px rgba(0,0,0,0.15)'
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
