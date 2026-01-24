import React from 'react';
import { WindowProvider } from './context/WindowContext.js';
import WindowDesigner from './components/WindowDesigner.js';
import './App.css';

/**
 * Main App Component
 * Window Visualization Tool - Similar to TommyTrinder.com
 * 
 * Features:
 * - Draw window shapes on canvas that auto-convert to window frames
 * - Draw lines inside to create pane divisions
 * - Configure openers, profiles, finishes, glass, glazing, hardware, extras
 * - Preview window on uploaded background photos
 * - View window in different states (open/half-open/closed)
 */
function App() {
  return React.createElement(WindowProvider, null,
    React.createElement('div', { className: 'app' },
      React.createElement(WindowDesigner, null)
    )
  );
}

export default App;
