import React from 'react';

/**
 * Modal Component - Reusable modal wrapper with consistent styling
 */
function Modal({ title, isOpen, onClose, children, width = '600px' }) {
  if (!isOpen) return null;
  
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  
  return React.createElement('div', {
    className: 'modal-backdrop',
    onClick: handleBackdropClick
  },
    React.createElement('div', {
      className: 'modal-container',
      style: { maxWidth: width }
    },
      React.createElement('div', { className: 'modal-header' },
        React.createElement('h3', { className: 'modal-title' }, title),
        React.createElement('button', {
          className: 'modal-close-btn',
          onClick: onClose
        }, '✕')
      ),
      React.createElement('div', { className: 'modal-content' }, children)
    )
  );
}

/**
 * Button Component - Reusable button with variants
 */
function Button({ children, onClick, variant = 'primary', disabled = false, className = '' }) {
  return React.createElement('button', {
    className: `btn btn-${variant} ${className}`,
    onClick,
    disabled
  }, children);
}

/**
 * Input Component - Reusable input field
 */
function Input({ label, value, onChange, type = 'text', placeholder = '', suffix = '' }) {
  return React.createElement('div', { className: 'input-group' },
    label && React.createElement('label', { className: 'input-label' }, label),
    React.createElement('div', { className: 'input-wrapper' },
      React.createElement('input', {
        type,
        className: 'input-field',
        value,
        onChange: (e) => onChange(e.target.value),
        placeholder
      }),
      suffix && React.createElement('span', { className: 'input-suffix' }, suffix)
    )
  );
}

/**
 * Select Component - Reusable dropdown
 */
function Select({ label, value, onChange, options }) {
  return React.createElement('div', { className: 'select-group' },
    label && React.createElement('label', { className: 'select-label' }, label),
    React.createElement('select', {
      className: 'select-field',
      value,
      onChange: (e) => onChange(e.target.value)
    },
      options.map((opt) =>
        React.createElement('option', {
          key: opt.value,
          value: opt.value
        }, opt.label)
      )
    )
  );
}

/**
 * Toggle Component - Reusable toggle switch
 */
function Toggle({ label, checked, onChange }) {
  return React.createElement('div', { className: 'toggle-group' },
    React.createElement('div', {
      className: `toggle-switch ${checked ? 'active' : ''}`,
      onClick: () => onChange(!checked)
    },
      React.createElement('div', { className: 'toggle-thumb' })
    ),
    label && React.createElement('span', { className: 'toggle-label' }, label)
  );
}

/**
 * Card Component - Selectable option card
 */
function Card({ children, selected, onClick, className = '' }) {
  return React.createElement('div', {
    className: `option-card ${selected ? 'selected' : ''} ${className}`,
    onClick
  }, children);
}

/**
 * ColorSwatch Component - Color/texture selection
 */
function ColorSwatch({ color, texture, name, selected, onClick, dual = false, secondColor = null }) {
  return React.createElement('div', {
    className: `color-swatch ${selected ? 'selected' : ''}`,
    onClick
  },
    React.createElement('div', { className: 'swatch-preview' },
      dual && secondColor
        ? React.createElement('div', { className: 'swatch-dual' },
            React.createElement('div', {
              className: 'swatch-half',
              style: { backgroundColor: color }
            }),
            React.createElement('div', {
              className: 'swatch-half swatch-half-second',
              style: { backgroundColor: secondColor }
            })
          )
        : React.createElement('div', {
            className: 'swatch-fill',
            style: { backgroundColor: color, backgroundImage: texture ? `url(${texture})` : 'none' }
          })
    ),
    React.createElement('span', { className: 'swatch-name' }, name)
  );
}

/**
 * Tabs Component - Tab navigation
 */
function Tabs({ tabs, activeTab, onTabChange }) {
  return React.createElement('div', { className: 'tabs-container' },
    tabs.map((tab) =>
      React.createElement('button', {
        key: tab.id,
        className: `tab-btn ${activeTab === tab.id ? 'active' : ''}`,
        onClick: () => onTabChange(tab.id)
      }, tab.label)
    )
  );
}

/**
 * IconButton Component - Button with icon
 */
function IconButton({ icon, label, onClick, active = false, className = '' }) {
  return React.createElement('button', {
    className: `icon-btn ${active ? 'active' : ''} ${className}`,
    onClick,
    title: label
  },
    React.createElement('span', { className: 'icon-btn-icon' }, icon),
    label && React.createElement('span', { className: 'icon-btn-label' }, label)
  );
}

/**
 * DimensionInput Component - Input for dimensions with label
 */
function DimensionInput({ label, value, onChange, color = 'green' }) {
  return React.createElement('div', { className: `dimension-input dimension-${color}` },
    React.createElement('input', {
      type: 'number',
      className: 'dimension-field',
      value,
      onChange: (e) => onChange(parseInt(e.target.value) || 0)
    }),
    label && React.createElement('span', { className: 'dimension-label' }, label)
  );
}

export { Modal, Button, Input, Select, Toggle, Card, ColorSwatch, Tabs, IconButton, DimensionInput };
