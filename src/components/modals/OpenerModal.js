import React from 'react';
import { Modal, Button, Card } from '../common/UIComponents.js';

/**
 * OpenerModal Component
 * Modal for selecting window opener type
 */
function OpenerModal({ isOpen, onClose, paneId, currentOpener, onApply, onRemove }) {
  const openerTypes = [
    {
      id: 'side-hung-left',
      name: 'Side Hung Left',
      icon: '◧',
      description: 'Opens from left hinge'
    },
    {
      id: 'side-hung-right',
      name: 'Side Hung Right',
      icon: '◨',
      description: 'Opens from right hinge'
    },
    {
      id: 'top-hung',
      name: 'Top Hung',
      icon: '⬒',
      description: 'Opens from top hinge'
    },
    {
      id: 'dummy',
      name: 'Dummy',
      icon: '▢',
      description: 'Fixed dummy opener'
    },
  ];
  
  const [selectedType, setSelectedType] = React.useState(currentOpener?.type || 'side-hung-left');
  
  const handleApply = () => {
    const selected = openerTypes.find(t => t.id === selectedType);
    onApply(paneId, {
      type: selectedType,
      hinge: selectedType.includes('left') ? 'left' : selectedType.includes('right') ? 'right' : 'top',
      name: selected.name,
    });
    onClose();
  };
  
  const handleRemove = () => {
    onRemove(paneId);
    onClose();
  };
  
  return React.createElement(Modal, {
    title: `Opener at ${paneId}`,
    isOpen,
    onClose,
    width: '550px'
  },
    React.createElement('div', { className: 'opener-modal' },
      React.createElement('div', { className: 'opener-grid' },
        openerTypes.map((type) =>
          React.createElement(Card, {
            key: type.id,
            selected: selectedType === type.id,
            onClick: () => setSelectedType(type.id),
            className: 'opener-card'
          },
            React.createElement('div', { className: 'opener-icon' },
              // SVG representation of opener type
              React.createElement('svg', {
                width: '80',
                height: '80',
                viewBox: '0 0 80 80'
              },
                React.createElement('rect', {
                  x: '10',
                  y: '10',
                  width: '60',
                  height: '60',
                  fill: 'none',
                  stroke: '#333',
                  strokeWidth: '2'
                }),
                // Draw opener indicator based on type
                type.id === 'side-hung-left' && React.createElement('path', {
                  d: 'M 10 10 L 70 40 L 10 70',
                  fill: 'none',
                  stroke: '#333',
                  strokeWidth: '1'
                }),
                type.id === 'side-hung-right' && React.createElement('path', {
                  d: 'M 70 10 L 10 40 L 70 70',
                  fill: 'none',
                  stroke: '#333',
                  strokeWidth: '1'
                }),
                type.id === 'top-hung' && React.createElement('path', {
                  d: 'M 10 10 L 40 70 L 70 10',
                  fill: 'none',
                  stroke: '#333',
                  strokeWidth: '1'
                }),
                type.id === 'dummy' && React.createElement('text', {
                  x: '40',
                  y: '45',
                  textAnchor: 'middle',
                  fontSize: '12'
                }, 'Dummy')
              )
            ),
            React.createElement('span', { className: 'opener-name' }, type.name)
          )
        )
      ),
      React.createElement('div', { className: 'modal-actions three-buttons' },
        React.createElement(Button, {
          variant: 'danger',
          onClick: handleRemove
        }, 'Remove Opener'),
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

export default OpenerModal;
