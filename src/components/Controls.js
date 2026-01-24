import React from 'react';

/**
 * Controls Component
 * Provides action buttons for saving visualizations and clearing canvas
 */
function Controls({ onSave, onClear, canSave }) {
  return React.createElement('div', { className: 'controls' },
    React.createElement('button', {
      className: 'save-btn',
      onClick: onSave,
      disabled: !canSave
    }, 'Save Visualization'),
    React.createElement('button', {
      className: 'clear-btn',
      onClick: onClear
    }, 'Clear Canvas')
  );
}

export default Controls;
