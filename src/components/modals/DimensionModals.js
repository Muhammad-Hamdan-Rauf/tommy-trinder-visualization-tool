import React, { useState } from 'react';
import { Modal, Button, Input } from '../common/UIComponents.js';

/**
 * DimensionsModal Component
 * Modal for changing overall window dimensions
 */
function DimensionsModal({ isOpen, onClose, dimensions, onApply }) {
  const [width, setWidth] = useState(dimensions.width);
  const [height, setHeight] = useState(dimensions.height);
  
  // Update local state when dimensions prop changes
  React.useEffect(() => {
    setWidth(dimensions.width);
    setHeight(dimensions.height);
  }, [dimensions.width, dimensions.height, isOpen]);
  
  const handleApply = () => {
    onApply({ width: parseInt(width) || 1200, height: parseInt(height) || 1500 });
    onClose();
  };
  
  return React.createElement(Modal, {
    title: 'Change Overall Dimensions',
    isOpen,
    onClose,
    width: '450px'
  },
    React.createElement('div', { className: 'dimensions-form' },
      React.createElement('div', { className: 'dimensions-row' },
        React.createElement('div', { className: 'dimension-field-group' },
          React.createElement('label', null, 'Width (mm):'),
          React.createElement('input', {
            type: 'number',
            className: 'dimension-input-field',
            value: width,
            onChange: (e) => setWidth(e.target.value),
            placeholder: '1200'
          })
        ),
        React.createElement('div', { className: 'dimension-field-group' },
          React.createElement('label', null, 'Height (mm):'),
          React.createElement('input', {
            type: 'number',
            className: 'dimension-input-field',
            value: height,
            onChange: (e) => setHeight(e.target.value),
            placeholder: '1500'
          })
        )
      ),
      React.createElement('div', { className: 'modal-actions' },
        React.createElement(Button, {
          variant: 'secondary',
          onClick: onClose
        }, 'Close'),
        React.createElement(Button, {
          variant: 'success',
          onClick: handleApply
        }, 'Apply')
      )
    )
  );
}

/**
 * InternalHeightsModal Component
 * Modal for changing internal row heights
 */
function InternalHeightsModal({ isOpen, onClose, dimensions, grid, onApply }) {
  const [upperHeight, setUpperHeight] = useState(dimensions.upperHeight || 450);
  const [lowerHeight, setLowerHeight] = useState(dimensions.lowerHeight || 1050);
  
  const handleApply = () => {
    onApply({
      upperHeight: parseInt(upperHeight) || 450,
      lowerHeight: parseInt(lowerHeight) || 1050,
    });
    onClose();
  };
  
  const handleEqualise = () => {
    const totalHeight = dimensions.height;
    const equalHeight = Math.floor(totalHeight / grid.rows);
    setUpperHeight(equalHeight);
    setLowerHeight(totalHeight - equalHeight);
  };
  
  return React.createElement(Modal, {
    title: 'Change Internal Heights',
    isOpen,
    onClose,
    width: '500px'
  },
    React.createElement('div', { className: 'internal-heights-form' },
      React.createElement('div', { className: 'height-field-group' },
        React.createElement('label', null, 'Upper Height:'),
        React.createElement('input', {
          type: 'number',
          className: 'dimension-input-field',
          value: upperHeight,
          onChange: (e) => setUpperHeight(e.target.value)
        })
      ),
      React.createElement('div', { className: 'height-field-group' },
        React.createElement('label', null, 'Lower Height:'),
        React.createElement('input', {
          type: 'number',
          className: 'dimension-input-field',
          value: lowerHeight,
          onChange: (e) => setLowerHeight(e.target.value)
        })
      ),
      React.createElement('div', { className: 'equalise-buttons' },
        React.createElement(Button, {
          variant: 'outline',
          onClick: handleEqualise
        }, 'Equalise Internal Heights'),
        React.createElement(Button, {
          variant: 'outline',
          onClick: handleEqualise
        }, 'Equalise Glass Sightlines')
      ),
      React.createElement('div', { className: 'modal-actions' },
        React.createElement(Button, {
          variant: 'secondary',
          onClick: onClose
        }, 'Close'),
        React.createElement(Button, {
          variant: 'success',
          onClick: handleApply
        }, 'Apply')
      )
    )
  );
}

/**
 * GlazingDimensionsModal Component
 * Modal for changing glazing bar dimensions
 */
function GlazingDimensionsModal({ isOpen, onClose, dimensions = [], onApply }) {
  const [dims, setDims] = useState(dimensions.length ? dimensions : [283, 212, 212, 318]);
  
  const handleDimChange = (index, value) => {
    const newDims = [...dims];
    newDims[index] = parseInt(value) || 0;
    setDims(newDims);
  };
  
  const handleEqualise = () => {
    const total = dims.reduce((a, b) => a + b, 0);
    const equal = Math.floor(total / dims.length);
    setDims(dims.map(() => equal));
  };
  
  const handleApply = () => {
    onApply(dims);
    onClose();
  };
  
  return React.createElement(Modal, {
    title: 'Change Glazing Dimensions',
    isOpen,
    onClose,
    width: '450px'
  },
    React.createElement('div', { className: 'glazing-dims-form' },
      dims.map((dim, i) =>
        React.createElement('div', { key: i, className: 'glazing-dim-row' },
          React.createElement('label', null, `${i + 1}:`),
          React.createElement('input', {
            type: 'number',
            className: 'dimension-input-field',
            value: dim,
            onChange: (e) => handleDimChange(i, e.target.value)
          }),
          React.createElement('span', { className: 'sightline-info' }, `Glass sightline: ${(dim * 0.675).toFixed(1)}`)
        )
      ),
      React.createElement('div', { className: 'equalise-buttons' },
        React.createElement(Button, {
          variant: 'outline',
          onClick: handleEqualise
        }, 'Equalise Dimensions'),
        React.createElement(Button, {
          variant: 'primary',
          onClick: handleEqualise
        }, 'Equalise Glass Sightlines')
      ),
      React.createElement('div', { className: 'modal-actions' },
        React.createElement(Button, {
          variant: 'secondary',
          onClick: onClose
        }, 'Close'),
        React.createElement(Button, {
          variant: 'success',
          onClick: handleApply
        }, 'Apply')
      )
    )
  );
}

export { DimensionsModal, InternalHeightsModal, GlazingDimensionsModal };
