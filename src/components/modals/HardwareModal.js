import React, { useState } from 'react';
import { Modal, Button, Card, Tabs } from '../common/UIComponents.js';

/**
 * HardwareModal Component
 * Modal for selecting hardware options (handles and ventilation)
 */
function HardwareModal({ isOpen, onClose, currentHardware, onApply }) {
  const [activeTab, setActiveTab] = useState('HANDLES');
  const [handleType, setHandleType] = useState(currentHardware?.handleType || 'Connoisseur Antique Black');
  const [ventilation, setVentilation] = useState(currentHardware?.ventilation || null);
  
  const tabs = [
    { id: 'HANDLES', label: 'HANDLES' },
    { id: 'VENTILATION', label: 'VENTILATION' },
  ];
  
  const handles = [
    { id: 'connoisseur-antique-black', name: 'Connoisseur Antique Black', color: '#1a1a1a', style: 'connoisseur' },
    { id: 'connoisseur-chrome', name: 'Connoisseur Chrome', color: '#c0c0c0', style: 'connoisseur' },
    { id: 'connoisseur-gold', name: 'Connoisseur Gold', color: '#d4af37', style: 'connoisseur' },
    { id: 'connoisseur-graphite', name: 'Connoisseur Graphite', color: '#4a4a4a', style: 'connoisseur' },
    { id: 'connoisseur-satin', name: 'Connoisseur Satin', color: '#b8b8b8', style: 'connoisseur' },
    { id: 'connoisseur-white', name: 'Connoisseur White', color: '#f5f5f5', style: 'connoisseur' },
    { id: 'maxim-black', name: 'Maxim Black', color: '#1a1a1a', style: 'maxim' },
    { id: 'maxim-chrome', name: 'Maxim Chrome', color: '#c0c0c0', style: 'maxim' },
    { id: 'maxim-gold', name: 'Maxim Gold', color: '#d4af37', style: 'maxim' },
    { id: 'maxim-inline-black', name: 'Maxim Inline Black', color: '#1a1a1a', style: 'maxim-inline' },
    { id: 'maxim-inline-chrome', name: 'Maxim Inline Chrome', color: '#c0c0c0', style: 'maxim-inline' },
    { id: 'maxim-inline-gold', name: 'Maxim Inline Gold', color: '#d4af37', style: 'maxim-inline' },
  ];
  
  const ventilationTypes = [
    { id: 'none', name: 'None', description: 'No ventilation' },
    { id: 'trickle-vent', name: 'Trickle Vent', description: 'Small vent for background ventilation' },
    { id: 'night-vent', name: 'Night Vent', description: 'Secure night-time ventilation' },
  ];
  
  const handleApply = () => {
    onApply({
      handleType,
      ventilation,
    });
    onClose();
  };
  
  const renderHandleIcon = (handle) => {
    return React.createElement('svg', {
      width: '120',
      height: '40',
      viewBox: '0 0 120 40'
    },
      // Base of handle
      React.createElement('ellipse', {
        cx: '20',
        cy: '20',
        rx: '12',
        ry: '12',
        fill: handle.color,
        stroke: '#333',
        strokeWidth: '1'
      }),
      // Handle arm
      React.createElement('rect', {
        x: '30',
        y: '15',
        width: '70',
        height: '10',
        rx: '3',
        fill: handle.color,
        stroke: '#333',
        strokeWidth: '1'
      }),
      // Handle tip
      handle.style === 'connoisseur' && React.createElement('path', {
        d: 'M 100 20 Q 110 15, 115 20 Q 110 25, 100 20',
        fill: handle.color,
        stroke: '#333',
        strokeWidth: '1'
      })
    );
  };
  
  const renderHandlesTab = () => {
    return React.createElement('div', { className: 'handles-grid' },
      handles.map((handle) =>
        React.createElement(Card, {
          key: handle.id,
          selected: handleType === handle.name,
          onClick: () => setHandleType(handle.name),
          className: 'handle-card'
        },
          React.createElement('div', { className: 'handle-preview' },
            renderHandleIcon(handle)
          ),
          React.createElement('span', { className: 'handle-name' }, handle.name)
        )
      )
    );
  };
  
  const renderVentilationTab = () => {
    return React.createElement('div', { className: 'ventilation-options' },
      ventilationTypes.map((vent) =>
        React.createElement(Card, {
          key: vent.id,
          selected: ventilation === vent.id,
          onClick: () => setVentilation(vent.id),
          className: 'ventilation-card'
        },
          React.createElement('span', { className: 'vent-name' }, vent.name),
          React.createElement('p', { className: 'vent-description' }, vent.description)
        )
      )
    );
  };
  
  return React.createElement(Modal, {
    title: 'Manage Hardware',
    isOpen,
    onClose,
    width: '650px'
  },
    React.createElement('div', { className: 'hardware-modal' },
      React.createElement(Tabs, {
        tabs,
        activeTab,
        onTabChange: setActiveTab
      }),
      
      React.createElement('div', { className: 'hardware-tab-content' },
        activeTab === 'HANDLES' && renderHandlesTab(),
        activeTab === 'VENTILATION' && renderVentilationTab()
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

export default HardwareModal;
