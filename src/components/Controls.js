import React from 'react';

/**
 * Controls Component
 * Provides action buttons for saving visualizations and clearing canvas
 */
function Controls({ onSave, onClear, canSave, isDirty }) {
  return React.createElement('div', { className: 'controls' },
    React.createElement('div', { className: 'controls-left' },
      isDirty && React.createElement('span', { 
        className: 'unsaved-indicator',
        title: 'You have unsaved changes'
      }, '● Unsaved changes')
    ),
    
    React.createElement('div', { className: 'controls-right' },
      React.createElement('button', {
        className: 'clear-btn',
        onClick: onClear,
        title: 'Clear all products from canvas'
      }, 'Clear Canvas'),
      
      React.createElement('button', {
        className: `save-btn ${canSave ? 'enabled' : 'disabled'}`,
        onClick: onSave,
        disabled: !canSave,
        title: canSave ? 'Save as completed visualization' : 'Add products to canvas before saving'
      }, canSave && isDirty ? '💾 Save Visualization' : 'Save Visualization')
    )
  );
}

export default Controls;
