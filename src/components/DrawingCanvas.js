import React, { useRef, useState, useEffect } from 'react';
import { useWindow } from '../context/WindowContext.js';

/**
 * DrawingCanvas Component
 * Interactive canvas for drawing window shapes
 * User draws outline -> becomes window frame
 * User draws lines inside -> creates pane divisions
 */
function DrawingCanvas({ onOpenDimensionsModal, onToolsReady }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const { state, actions } = useWindow();
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState([]);
  const [paths, setPaths] = useState([]);
  const [tool, setTool] = useState('draw'); // select, draw, erase - default to draw
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });
  
  // Grid settings
  const gridSize = 20;
  const showGrid = true;
  
  // Drawing state
  const [frameDrawn, setFrameDrawn] = useState(false);
  const [frameRect, setFrameRect] = useState(null);
  const [dividerLines, setDividerLines] = useState([]);
  const [drawingSegments, setDrawingSegments] = useState([]); // Keep track of all segments
  
  // Undo/Redo history
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  // Restore canvas state from context when component mounts
  useEffect(() => {
    // If we have panes in context but no canvas frame, restore the canvas state
    if (state.panes && state.panes.length > 0 && !frameRect) {
      // Reconstruct frame from dimensions
      const centerX = canvasSize.width / 2;
      const centerY = canvasSize.height / 2;
      const reconstructedFrame = {
        x: centerX - state.dimensions.width / 2,
        y: centerY - state.dimensions.height / 2,
        width: state.dimensions.width,
        height: state.dimensions.height
      };
      
      setFrameRect(reconstructedFrame);
      setFrameDrawn(true);
      
      // Reconstruct divider lines from grid
      const frameWidth = 15;
      const reconstructedDividers = [];
      
      // Add vertical dividers
      state.grid.verticalDividers.forEach(pos => {
        reconstructedDividers.push({
          orientation: 'vertical',
          x: reconstructedFrame.x + pos,
          y1: reconstructedFrame.y + frameWidth,
          y2: reconstructedFrame.y + reconstructedFrame.height - frameWidth
        });
      });
      
      // Add horizontal dividers
      state.grid.horizontalDividers.forEach(pos => {
        reconstructedDividers.push({
          orientation: 'horizontal',
          x1: reconstructedFrame.x + frameWidth,
          x2: reconstructedFrame.x + reconstructedFrame.width - frameWidth,
          y: reconstructedFrame.y + pos
        });
      });
      
      setDividerLines(reconstructedDividers);
      
      // Save initial state to history
      setTimeout(() => {
        saveToHistory({
          frameRect: reconstructedFrame,
          frameDrawn: true,
          dividerLines: reconstructedDividers,
          paths: [],
          drawingSegments: []
        });
      }, 100);
    }
  }, [state.panes, state.dimensions, state.grid, canvasSize]);
  
  // Expose tool functions to parent via callback
  useEffect(() => {
    if (onToolsReady) {
      onToolsReady({
        handleDelete,
        handleUndo,
        handleRedo,
        setTool,
        handleAutoGrid,
        tool
      });
    }
  }, [tool, historyIndex, history, frameRect, dividerLines]);
  
  // Resize observer to make canvas fill container
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setCanvasSize({ 
          width: Math.floor(width), 
          height: Math.floor(height) 
        });
      }
    });
    
    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, []);
  
  // Update frame dimensions when state.dimensions change
  useEffect(() => {
    if (frameRect && state.dimensions) {
      const oldWidth = frameRect.width;
      const oldHeight = frameRect.height;
      const newWidth = state.dimensions.width;
      const newHeight = state.dimensions.height;
      
      // Update frame dimensions
      setFrameRect(prev => ({
        ...prev,
        width: newWidth,
        height: newHeight
      }));
      
      // Scale divider lines proportionally
      if (dividerLines.length > 0 && (oldWidth !== newWidth || oldHeight !== newHeight)) {
        const frameWidth = 15;
        const scaledDividers = dividerLines.map(line => {
          if (line.orientation === 'vertical') {
            // Calculate relative position (0-1) and scale to new width
            const relativeX = (line.x - frameRect.x - frameWidth) / (oldWidth - frameWidth * 2);
            const newX = frameRect.x + frameWidth + (relativeX * (newWidth - frameWidth * 2));
            return {
              ...line,
              x: newX,
              y1: frameRect.y + frameWidth,
              y2: frameRect.y + newHeight - frameWidth
            };
          } else {
            // Calculate relative position (0-1) and scale to new height
            const relativeY = (line.y - frameRect.y - frameWidth) / (oldHeight - frameWidth * 2);
            const newY = frameRect.y + frameWidth + (relativeY * (newHeight - frameWidth * 2));
            return {
              ...line,
              y: newY,
              x1: frameRect.x + frameWidth,
              x2: frameRect.x + newWidth - frameWidth
            };
          }
        });
        
        setDividerLines(scaledDividers);
        
        // Sync context state with scaled dividers
        syncContextFromDividers(scaledDividers, {
          ...frameRect,
          width: newWidth,
          height: newHeight
        });
        
        // Save to history
        saveToHistory({
          frameRect: { ...frameRect, width: newWidth, height: newHeight },
          frameDrawn,
          dividerLines: scaledDividers,
          paths: [...paths],
          drawingSegments: [...drawingSegments]
        });
      }
    }
  }, [state.dimensions.width, state.dimensions.height]);
  
  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    renderCanvas(ctx);
  }, [paths, currentPath, frameRect, dividerLines, drawingSegments, state.preview.showDimensions, canvasSize]);
  
  // Render the canvas
  const renderCanvas = (ctx) => {
    const { width, height } = canvasSize;
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw grid background
    if (showGrid) {
      drawGrid(ctx);
    }
    
    // Draw existing paths (drawing segments before frame is detected)
    if (!frameDrawn && drawingSegments.length > 0) {
      ctx.strokeStyle = '#00a896';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      
      drawingSegments.forEach(path => {
        if (path.length > 1) {
          ctx.beginPath();
          ctx.moveTo(path[0].x, path[0].y);
          path.forEach(point => {
            ctx.lineTo(point.x, point.y);
          });
          ctx.stroke();
        }
      });
    }
    
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
    
    // Draw current path with different color if drawing divider vs frame
    if (currentPath.length > 1) {
      ctx.strokeStyle = frameDrawn ? '#ff6b6b' : '#00a896'; // Red for dividers, green for frame
      ctx.lineWidth = 3;
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
    const { width, height } = canvasSize;
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
      ctx.lineTo(canvasSize.width, y);
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
  
  // Check if all drawn segments form a closed rectangle
  const detectClosedRectangle = (segments) => {
    if (segments.length < 3) return null; // Need at least 3 segments for a rectangle
    
    // Get all endpoints
    const points = [];
    segments.forEach(seg => {
      if (seg.length > 0) {
        points.push(seg[0]);
        points.push(seg[seg.length - 1]);
      }
    });
    
    if (points.length < 6) return null;
    
    // Find bounding box
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    points.forEach(point => {
      minX = Math.min(minX, point.x);
      minY = Math.min(minY, point.y);
      maxX = Math.max(maxX, point.x);
      maxY = Math.max(maxY, point.y);
    });
    
    const width = maxX - minX;
    const height = maxY - minY;
    
    // Check if we have points near all 4 corners (within tolerance)
    const tolerance = 40;
    const corners = [
      { x: minX, y: minY }, // top-left
      { x: maxX, y: minY }, // top-right
      { x: maxX, y: maxY }, // bottom-right
      { x: minX, y: maxY }  // bottom-left
    ];
    
    let cornersMatched = 0;
    corners.forEach(corner => {
      const hasNearbyPoint = points.some(point => 
        Math.abs(point.x - corner.x) < tolerance && 
        Math.abs(point.y - corner.y) < tolerance
      );
      if (hasNearbyPoint) cornersMatched++;
    });
    
    // If we have points near all 4 corners and reasonable dimensions
    if (cornersMatched >= 4 && width > 100 && height > 100) {
      return {
        type: 'frame',
        x: minX,
        y: minY,
        width: width,
        height: height
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
      const updatedDividers = dividerLines.filter((_, i) => i !== lineIndex);
      setDividerLines(updatedDividers);
      
      // Sync context state - rebuild panes/grid from remaining dividers
      if (frameRect) {
        syncContextFromDividers(updatedDividers, frameRect);
      }
      
      // Save to history
      saveToHistory({
        frameRect,
        frameDrawn,
        dividerLines: updatedDividers,
        paths: [...paths],
        drawingSegments: [...drawingSegments]
      });
    }
  };
  
  // Handle mouse up
  const handleMouseUp = () => {
    if (!isDrawing) return;
    
    setIsDrawing(false);
    
    if (currentPath.length > 5) {
      if (!frameDrawn) {
        // Add this segment to drawing segments
        const newSegments = [...drawingSegments, currentPath];
        setDrawingSegments(newSegments);
        
        // Check if single path forms a closed frame
        const shape = analyzePath(currentPath);
        if (shape && shape.type === 'frame') {
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
          setDrawingSegments([]); // Clear segments
          
          // Update context dimensions
          actions.setDimensions({
            width: snappedRect.width,
            height: snappedRect.height
          });
          
          setCurrentPath([]);
          saveToHistory();
          return;
        }
        
        // Check if all segments together form a closed rectangle
        const closedRect = detectClosedRectangle(newSegments);
        if (closedRect) {
          // Snap to grid
          const snapped = snapToGrid(closedRect.x, closedRect.y);
          const snappedRect = {
            x: snapped.x,
            y: snapped.y,
            width: Math.round(closedRect.width / gridSize) * gridSize,
            height: Math.round(closedRect.height / gridSize) * gridSize
          };
          setFrameRect(snappedRect);
          setFrameDrawn(true);
          setDrawingSegments([]); // Clear all segments
          
          // Update context dimensions
          actions.setDimensions({
            width: snappedRect.width,
            height: snappedRect.height
          });
          
          setCurrentPath([]);
          saveToHistory();
          return;
        }
        
        // Keep the segment visible for potential frame detection
        setCurrentPath([]);
        return;
        
      } else if (frameDrawn && frameRect) {
        // Drawing dividers inside existing frame
        const shape = analyzePath(currentPath);
        const frameWidth = 15;
        
        if (shape) {
          if (shape.type === 'vertical-line') {
            // Check if line is inside frame
            if (shape.x > frameRect.x + frameWidth && shape.x < frameRect.x + frameRect.width - frameWidth) {
              const newLine = {
                orientation: 'vertical',
                x: Math.round(shape.x / gridSize) * gridSize,
                y1: frameRect.y + frameWidth,
                y2: frameRect.y + frameRect.height - frameWidth
              };
              const updatedDividers = [...dividerLines, newLine];
              setDividerLines(updatedDividers);
              
              // Update pane count
              actions.addVerticalDivider(shape.x - frameRect.x);
              
              setCurrentPath([]);
              // Save to history with updated state
              saveToHistory({
                frameRect,
                frameDrawn,
                dividerLines: updatedDividers,
                paths: [...paths],
                drawingSegments: [...drawingSegments]
              });
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
              const updatedDividers = [...dividerLines, newLine];
              setDividerLines(updatedDividers);
              
              // Update pane count
              actions.addHorizontalDivider(shape.y - frameRect.y);
              
              setCurrentPath([]);
              // Save to history with updated state
              saveToHistory({
                frameRect,
                frameDrawn,
                dividerLines: updatedDividers,
                paths: [...paths],
                drawingSegments: [...drawingSegments]
              });
              return;
            }
          }
        }
      }
      
      // Keep the path if it wasn't converted
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
  
  // Sync context state from divider lines
  const syncContextFromDividers = (dividers, frame) => {
    // Reset to empty grid first
    actions.setGrid({
      rows: 1,
      cols: 1,
      horizontalDividers: [],
      verticalDividers: []
    });
    actions.setPanes([]);
    
    // Rebuild from divider lines
    dividers.forEach(line => {
      if (line.orientation === 'vertical') {
        const position = line.x - frame.x;
        actions.addVerticalDivider(position);
      } else if (line.orientation === 'horizontal') {
        const position = line.y - frame.y;
        actions.addHorizontalDivider(position);
      }
    });
  };
  
  // Save state to history
  const saveToHistory = (overrideState = null) => {
    const state = overrideState || {
      frameRect,
      frameDrawn,
      dividerLines: [...dividerLines],
      paths: [...paths],
      drawingSegments: [...drawingSegments]
    };
    setHistory(prev => [...prev.slice(0, historyIndex + 1), state]);
    setHistoryIndex(prev => prev + 1);
  };
  
  // Erase last path - now uses history
  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const state = history[newIndex];
      setFrameRect(state.frameRect);
      setFrameDrawn(state.frameDrawn);
      setDividerLines(state.dividerLines);
      setPaths(state.paths);
      setDrawingSegments(state.drawingSegments || []);
      setHistoryIndex(newIndex);
      
      // Sync context state with canvas state
      if (!state.frameRect) {
        // No frame - reset everything
        actions.resetWindow();
      } else {
        // Frame exists - rebuild grid and panes from dividers
        syncContextFromDividers(state.dividerLines, state.frameRect);
      }
    } else if (historyIndex === 0) {
      // Go to completely empty state
      setFrameRect(null);
      setFrameDrawn(false);
      setDividerLines([]);
      setPaths([]);
      setDrawingSegments([]);
      setHistoryIndex(-1);
      // Reset window context to clear sidebar
      actions.resetWindow();
    }
  };
  
  // Redo functionality
  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      const state = history[newIndex];
      setFrameRect(state.frameRect);
      setFrameDrawn(state.frameDrawn);
      setDividerLines(state.dividerLines);
      setPaths(state.paths);
      setDrawingSegments(state.drawingSegments || []);
      setHistoryIndex(newIndex);
      
      // Sync context state with canvas state
      if (!state.frameRect) {
        actions.resetWindow();
      } else {
        syncContextFromDividers(state.dividerLines, state.frameRect);
      }
    }
  };
  
  // Handle delete - clears everything
  const handleDelete = () => {
    if (window.confirm('Clear all drawings?')) {
      setFrameRect(null);
      setFrameDrawn(false);
      setDividerLines([]);
      setPaths([]);
      setDrawingSegments([]);
      setHistory([]);
      setHistoryIndex(-1);
      actions.resetWindow();
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
    
    const newDividers = [verticalLine, horizontalLine];
    setDividerLines(newDividers);
    
    // Sync context state - this will properly rebuild grid and panes
    syncContextFromDividers(newDividers, frameRect);
    
    // Save to history
    saveToHistory({
      frameRect,
      frameDrawn,
      dividerLines: newDividers,
      paths: [...paths],
      drawingSegments: [...drawingSegments]
    });
  };
  
  return React.createElement('div', { 
    ref: containerRef,
    className: 'canvas-container'
  },
    React.createElement('canvas', {
      ref: canvasRef,
      width: canvasSize.width,
      height: canvasSize.height,
      className: 'drawing-canvas',
      onMouseDown: handleMouseDown,
      onMouseMove: handleMouseMove,
      onMouseUp: handleMouseUp,
      onMouseLeave: handleMouseUp,
      style: {
        cursor: tool === 'draw' ? 'crosshair' : tool === 'erase' ? 'url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSJ3aGl0ZSIgc3Ryb2tlPSIjZmY2YjZiIiBzdHJva2Utd2lkdGg9IjIiLz48bGluZSB4MT0iMCIgeTE9IjAiIHgyPSIyNCIgeTI9IjI0IiBzdHJva2U9IiNmZjZiNmIiIHN0cm9rZS13aWR0aD0iMiIvPjwvc3ZnPg==") 12 12, not-allowed' : 'default'
      }
    })
  );
}

export default DrawingCanvas;
