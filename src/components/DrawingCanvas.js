import React, { useRef, useState, useEffect } from 'react';
import { useWindow } from '../context/WindowContext.js';
import { IconButton } from './common/UIComponents.js';

/**
 * DrawingCanvas Component
 * Interactive canvas for drawing window shapes
 * User draws outline -> becomes window frame
 * User draws lines inside -> creates pane divisions
 */
function DrawingCanvas({ width = 800, height = 600, onOpenDimensionsModal }) {
  const canvasRef = useRef(null);
  const { state, actions } = useWindow();
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState([]);
  const [paths, setPaths] = useState([]);
  const [tool, setTool] = useState('select'); // select, draw, erase
  
  // Grid settings
  const gridSize = 20;
  const showGrid = true;
  
  // Drawing state
  const [frameDrawn, setFrameDrawn] = useState(false);
  const [frameRect, setFrameRect] = useState(null);
  const [dividerLines, setDividerLines] = useState([]);
  
  // Update frame dimensions when state.dimensions change
  useEffect(() => {
    if (frameRect && state.dimensions) {
      setFrameRect(prev => ({
        ...prev,
        width: state.dimensions.width,
        height: state.dimensions.height
      }));
    }
  }, [state.dimensions.width, state.dimensions.height]);
  
  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    renderCanvas(ctx);
  }, [paths, currentPath, frameRect, dividerLines, state.preview.showDimensions]);
  
  // Render the canvas
  const renderCanvas = (ctx) => {
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw grid background
    if (showGrid) {
      drawGrid(ctx);
    }
    
    // Draw existing paths (freehand drawing)
    ctx.strokeStyle = '#00a896';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    paths.forEach(path => {
      if (path.length > 1) {
        ctx.beginPath();
        ctx.moveTo(path[0].x, path[0].y);
        path.forEach(point => {
          ctx.lineTo(point.x, point.y);
        });
        ctx.stroke();
      }
    });
    
    // Draw current path
    if (currentPath.length > 1) {
      ctx.beginPath();
      ctx.moveTo(currentPath[0].x, currentPath[0].y);
      currentPath.forEach(point => {
        ctx.lineTo(point.x, point.y);
      });
      ctx.stroke();
    }
    
    // Draw window frame if detected
    if (frameRect) {
      drawWindowFrame(ctx, frameRect);
    }
    
    // Draw divider lines
    dividerLines.forEach(line => {
      drawDividerLine(ctx, line);
    });
  };
  
  // Draw grid background
  const drawGrid = (ctx) => {
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 0.5;
    
    for (let x = 0; x <= width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    
    for (let y = 0; y <= height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  };
  
  // Draw window frame
  const drawWindowFrame = (ctx, rect) => {
    const frameWidth = 15;
    
    // Outer frame shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    
    // Outer frame
    ctx.fillStyle = state.finish.frame.colorHex || '#f8f6f0';
    ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
    
    // Reset shadow
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    
    // Frame border
    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = 2;
    ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
    
    // Inner frame (glass area)
    ctx.fillStyle = '#2d3748';
    ctx.fillRect(
      rect.x + frameWidth,
      rect.y + frameWidth,
      rect.width - frameWidth * 2,
      rect.height - frameWidth * 2
    );
    
    // Inner frame border
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 1;
    ctx.strokeRect(
      rect.x + frameWidth,
      rect.y + frameWidth,
      rect.width - frameWidth * 2,
      rect.height - frameWidth * 2
    );
  };
  
  // Draw divider line with frame
  const drawDividerLine = (ctx, line) => {
    const barWidth = 12;
    
    ctx.fillStyle = state.finish.frame.colorHex || '#f8f6f0';
    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = 1;
    
    if (line.orientation === 'vertical') {
      ctx.fillRect(line.x - barWidth / 2, line.y1, barWidth, line.y2 - line.y1);
      ctx.strokeRect(line.x - barWidth / 2, line.y1, barWidth, line.y2 - line.y1);
    } else {
      ctx.fillRect(line.x1, line.y - barWidth / 2, line.x2 - line.x1, barWidth);
      ctx.strokeRect(line.x1, line.y - barWidth / 2, line.x2 - line.x1, barWidth);
    }
  };
  
  // Snap point to grid
  const snapToGrid = (x, y) => {
    return {
      x: Math.round(x / gridSize) * gridSize,
      y: Math.round(y / gridSize) * gridSize
    };
  };
  
  // Get mouse position relative to canvas
  const getMousePos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };
  
  // Analyze path to detect shape
  const analyzePath = (path) => {
    if (path.length < 10) return null;
    
    // Find bounding box
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    path.forEach(point => {
      minX = Math.min(minX, point.x);
      minY = Math.min(minY, point.y);
      maxX = Math.max(maxX, point.x);
      maxY = Math.max(maxY, point.y);
    });
    
    const rectWidth = maxX - minX;
    const rectHeight = maxY - minY;
    
    // Check if it's roughly rectangular (closed shape)
    const startPoint = path[0];
    const endPoint = path[path.length - 1];
    const distance = Math.sqrt(
      Math.pow(endPoint.x - startPoint.x, 2) + 
      Math.pow(endPoint.y - startPoint.y, 2)
    );
    
    // If start and end are close, it's a closed shape
    if (distance < 50 && rectWidth > 50 && rectHeight > 50) {
      return {
        type: 'frame',
        x: minX,
        y: minY,
        width: rectWidth,
        height: rectHeight
      };
    }
    
    // Check if it's a line (for dividers)
    if (rectWidth > rectHeight * 3) {
      return {
        type: 'horizontal-line',
        x1: minX,
        x2: maxX,
        y: (minY + maxY) / 2
      };
    }
    
    if (rectHeight > rectWidth * 3) {
      return {
        type: 'vertical-line',
        x: (minX + maxX) / 2,
        y1: minY,
        y2: maxY
      };
    }
    
    return null;
  };
  
  // Handle mouse down
  const handleMouseDown = (e) => {
    const pos = getMousePos(e);
    
    if (tool === 'draw') {
      setIsDrawing(true);
      setCurrentPath([pos]);
    } else if (tool === 'erase') {
      // Check if clicked near a divider line to remove it
      handleEraseClick(pos);
    }
  };
  
  // Handle mouse move
  const handleMouseMove = (e) => {
    if (!isDrawing || tool !== 'draw') return;
    
    const pos = getMousePos(e);
    setCurrentPath(prev => [...prev, pos]);
  };
  
  // Handle erase click - remove divider lines
  const handleEraseClick = (pos) => {
    const tolerance = 15;
    
    // Find and remove divider line near click
    const lineIndex = dividerLines.findIndex(line => {
      if (line.orientation === 'vertical') {
        return Math.abs(pos.x - line.x) < tolerance && 
               pos.y >= line.y1 && pos.y <= line.y2;
      } else {
        return Math.abs(pos.y - line.y) < tolerance && 
               pos.x >= line.x1 && pos.x <= line.x2;
      }
    });
    
    if (lineIndex !== -1) {
      setDividerLines(prev => prev.filter((_, i) => i !== lineIndex));
    }
  };
  
  // Handle mouse up
  const handleMouseUp = () => {
    if (!isDrawing) return;
    
    setIsDrawing(false);
    
    if (currentPath.length > 5) {
      const shape = analyzePath(currentPath);
      
      if (shape) {
        if (shape.type === 'frame' && !frameDrawn) {
          // Snap to grid
          const snapped = snapToGrid(shape.x, shape.y);
          const snappedRect = {
            x: snapped.x,
            y: snapped.y,
            width: Math.round(shape.width / gridSize) * gridSize,
            height: Math.round(shape.height / gridSize) * gridSize
          };
          setFrameRect(snappedRect);
          setFrameDrawn(true);
          
          // Update context dimensions
          actions.setDimensions({
            width: snappedRect.width,
            height: snappedRect.height
          });
          
          // Clear the green path since we converted it to a frame
          setCurrentPath([]);
          return;
          
        } else if (frameDrawn && frameRect) {
          // Add divider line if drawn inside frame
          const frameWidth = 15;
          
          if (shape.type === 'vertical-line') {
            // Check if line is inside frame
            if (shape.x > frameRect.x + frameWidth && shape.x < frameRect.x + frameRect.width - frameWidth) {
              const newLine = {
                orientation: 'vertical',
                x: Math.round(shape.x / gridSize) * gridSize,
                y1: frameRect.y + frameWidth,
                y2: frameRect.y + frameRect.height - frameWidth
              };
              setDividerLines(prev => [...prev, newLine]);
              
              // Update pane count
              actions.addVerticalDivider(shape.x - frameRect.x);
              
              // Clear the green path since we converted it to a divider
              setCurrentPath([]);
              return;
            }
          } else if (shape.type === 'horizontal-line') {
            if (shape.y > frameRect.y + frameWidth && shape.y < frameRect.y + frameRect.height - frameWidth) {
              const newLine = {
                orientation: 'horizontal',
                x1: frameRect.x + frameWidth,
                x2: frameRect.x + frameRect.width - frameWidth,
                y: Math.round(shape.y / gridSize) * gridSize
              };
              setDividerLines(prev => [...prev, newLine]);
              
              // Update pane count
              actions.addHorizontalDivider(shape.y - frameRect.y);
              
              // Clear the green path since we converted it to a divider
              setCurrentPath([]);
              return;
            }
          }
        }
      }
      
      // Only keep the path if it wasn't converted to a shape
      setPaths(prev => [...prev, currentPath]);
    }
    
    setCurrentPath([]);
  };
  
  // Clear all drawings
  const handleClear = () => {
    setPaths([]);
    setCurrentPath([]);
    setFrameRect(null);
    setFrameDrawn(false);
    setDividerLines([]);
    actions.resetWindow();
  };
  
  // Erase last path
  const handleUndo = () => {
    if (dividerLines.length > 0) {
      setDividerLines(prev => prev.slice(0, -1));
    } else if (paths.length > 0) {
      setPaths(prev => prev.slice(0, -1));
      if (paths.length === 1) {
        setFrameRect(null);
        setFrameDrawn(false);
      }
    }
  };
  
  // Auto grid - creates a 2x2 grid automatically
  const handleAutoGrid = () => {
    if (!frameRect) {
      alert('Please draw a window frame first');
      return;
    }
    
    const frameWidth = 15;
    const innerWidth = frameRect.width - frameWidth * 2;
    const innerHeight = frameRect.height - frameWidth * 2;
    
    // Clear existing dividers
    setDividerLines([]);
    
    // Add vertical divider in the middle
    const verticalX = frameRect.x + frameWidth + innerWidth / 2;
    const verticalLine = {
      orientation: 'vertical',
      x: Math.round(verticalX / gridSize) * gridSize,
      y1: frameRect.y + frameWidth,
      y2: frameRect.y + frameRect.height - frameWidth
    };
    
    // Add horizontal divider in the middle
    const horizontalY = frameRect.y + frameWidth + innerHeight / 2;
    const horizontalLine = {
      orientation: 'horizontal',
      x1: frameRect.x + frameWidth,
      x2: frameRect.x + frameRect.width - frameWidth,
      y: Math.round(horizontalY / gridSize) * gridSize
    };
    
    setDividerLines([verticalLine, horizontalLine]);
    
    // Update context
    actions.setGrid({ rows: 2, cols: 2 });
    actions.addVerticalDivider(verticalX - frameRect.x);
    actions.addHorizontalDivider(horizontalY - frameRect.y);
  };
  
  return React.createElement('div', { className: 'drawing-canvas-container' },
    // Toolbar
    React.createElement('div', { className: 'drawing-toolbar' },
      React.createElement(IconButton, {
        icon: '☝',
        label: 'SELECT & EDIT',
        active: tool === 'select',
        onClick: () => setTool('select')
      }),
      React.createElement(IconButton, {
        icon: '✏',
        label: 'DRAW',
        active: tool === 'draw',
        onClick: () => setTool('draw')
      }),
      React.createElement(IconButton, {
        icon: '⌫',
        label: 'ERASE',
        active: tool === 'erase',
        onClick: () => setTool('erase')
      }),
      React.createElement(IconButton, {
        icon: '📐',
        label: 'DIMENSIONS',
        active: frameRect !== null,
        onClick: () => {
          if (frameRect && onOpenDimensionsModal) {
            onOpenDimensionsModal();
          } else if (!frameRect) {
            alert('Please draw a window frame first');
          }
        }
      }),
      React.createElement(IconButton, {
        icon: '⊞',
        label: 'AUTO GRID',
        onClick: handleAutoGrid
      }),
      React.createElement('button', {
        className: 'toolbar-btn undo-btn',
        onClick: handleUndo,
        title: 'Undo'
      }, '↩'),
      React.createElement('button', {
        className: 'toolbar-btn clear-btn danger',
        onClick: handleClear,
        title: 'Clear'
      }, '🗑')
    ),
    
    // Canvas
    React.createElement('canvas', {
      ref: canvasRef,
      width: width,
      height: height,
      className: 'drawing-canvas',
      onMouseDown: handleMouseDown,
      onMouseMove: handleMouseMove,
      onMouseUp: handleMouseUp,
      onMouseLeave: handleMouseUp,
      style: {
        cursor: tool === 'draw' ? 'crosshair' : tool === 'erase' ? 'not-allowed' : 'default'
      }
    }),
    
    // Instructions
    !frameDrawn && React.createElement('div', { className: 'drawing-instructions' },
      React.createElement('p', null, '✏️ Select DRAW tool and draw a rectangle shape to create a window frame'),
      React.createElement('p', null, '📏 Draw vertical lines inside to create columns'),
      React.createElement('p', null, '📏 Draw horizontal lines inside to create rows')
    )
  );
}

export default DrawingCanvas;
