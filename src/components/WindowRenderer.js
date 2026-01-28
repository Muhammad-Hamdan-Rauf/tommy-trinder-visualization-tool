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
  
  // Get glass background based on texture and preview state - realistic sky
  const getGlassBackground = (paneId) => {
    const paneGlass = glass[paneId] || defaultGlass;
    
    if (preview.windowState !== 'closed' && preview.backgroundImage) {
      return `url(${preview.backgroundImage})`;
    }
    
    // Texture backgrounds - more realistic sky gradient
    const textureBackgrounds = {
      'Clear': `linear-gradient(180deg, 
        #4A90D9 0%, 
        #6BA3E0 15%, 
        #87CEEB 35%, 
        #B0E0F0 55%, 
        #C5E8F5 75%, 
        #E0F4FF 100%)`,
      'Arctic': 'linear-gradient(135deg, #d0d5d9 0%, #e8ebee 50%, #d0d5d9 100%)',
      'Contora': 'repeating-linear-gradient(90deg, #c5c8cb 0px, #d8dadc 2px, #c5c8cb 4px)',
      'Chantilly': 'radial-gradient(circle, #e0e0e0 1px, #dcdcdc 1px)',
      'Cotswold': 'linear-gradient(45deg, #c9c0b5 25%, #d5ccc1 50%, #c9c0b5 75%)',
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
