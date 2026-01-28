import React, { useState, useEffect } from 'react';
import { Modal, Button, Card, Tabs } from '../common/UIComponents.js';

/**
 * HardwareModal Component
 * Modal for selecting hardware options (handles and ventilation)
 */
function HardwareModal({ isOpen, onClose, currentHardware, initialTab, onApply }) {
  const [activeTab, setActiveTab] = useState(initialTab || 'HANDLES');
  const [handleType, setHandleType] = useState(currentHardware?.handleType || 'Connoisseur Antique Black');
  const [ventilation, setVentilation] = useState(currentHardware?.ventilation || 'none');
  
  // Update tab when initialTab changes
  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);
  
  const tabs = [
    { id: 'HANDLES', label: 'HANDLES' },
    { id: 'VENTILATION', label: 'VENTILATION' },
  ];
  
  // Complete handle catalog from TommyTrinder
  const handleCategories = [
    {
      category: 'Connoisseur',
      description: 'Traditional monkey-tail style handles',
      handles: [
        { id: 'connoisseur-antique-black', name: 'Connoisseur Antique Black', color: '#1a1a1a', highlight: '#3a3a3a' },
        { id: 'connoisseur-chrome', name: 'Connoisseur Chrome', color: '#c0c0c0', highlight: '#e0e0e0' },
        { id: 'connoisseur-gold', name: 'Connoisseur Gold', color: '#d4af37', highlight: '#f0d060' },
        { id: 'connoisseur-graphite', name: 'Connoisseur Graphite', color: '#4a4a4a', highlight: '#6a6a6a' },
        { id: 'connoisseur-satin', name: 'Connoisseur Satin', color: '#b8b8b8', highlight: '#d8d8d8' },
        { id: 'connoisseur-white', name: 'Connoisseur White', color: '#f5f5f5', highlight: '#ffffff' },
      ]
    },
    {
      category: 'Teardrop',
      description: 'Elegant curved teardrop design',
      handles: [
        { id: 'teardrop-antique-black', name: 'Teardrop Antique Black', color: '#1a1a1a', highlight: '#3a3a3a' },
        { id: 'teardrop-chrome', name: 'Teardrop Chrome', color: '#c0c0c0', highlight: '#e0e0e0' },
        { id: 'teardrop-gold', name: 'Teardrop Gold', color: '#d4af37', highlight: '#f0d060' },
        { id: 'teardrop-graphite', name: 'Teardrop Graphite', color: '#5a5a5a', highlight: '#7a7a7a' },
      ]
    },
    {
      category: 'Maxim',
      description: 'Sleek modern inline handles',
      handles: [
        { id: 'maxim-black', name: 'Maxim Black', color: '#1a1a1a', highlight: '#3a3a3a' },
        { id: 'maxim-chrome', name: 'Maxim Chrome', color: '#c0c0c0', highlight: '#e0e0e0' },
        { id: 'maxim-gold', name: 'Maxim Gold', color: '#d4af37', highlight: '#f0d060' },
        { id: 'maxim-inline-black', name: 'Maxim Inline Black', color: '#1a1a1a', highlight: '#3a3a3a' },
        { id: 'maxim-inline-chrome', name: 'Maxim Inline Chrome', color: '#c0c0c0', highlight: '#e0e0e0' },
        { id: 'maxim-inline-gold', name: 'Maxim Inline Gold', color: '#d4af37', highlight: '#f0d060' },
      ]
    },
    {
      category: 'Ventiss 360',
      description: 'Modern minimalist L-shape handles',
      handles: [
        { id: 'ventiss-360-black', name: 'Ventiss 360 Black', color: '#1a1a1a', highlight: '#3a3a3a' },
        { id: 'ventiss-360-chrome', name: 'Ventiss 360 Chrome', color: '#c0c0c0', highlight: '#e0e0e0' },
        { id: 'ventiss-360-gold', name: 'Ventiss 360 Gold', color: '#d4af37', highlight: '#f0d060' },
        { id: 'ventiss-360-gunmetal', name: 'Ventiss 360 Gunmetal', color: '#505050', highlight: '#707070' },
        { id: 'ventiss-360-satin', name: 'Ventiss 360 Satin', color: '#b8b8b8', highlight: '#d8d8d8' },
        { id: 'ventiss-360-white', name: 'Ventiss 360 White', color: '#f5f5f5', highlight: '#ffffff' },
      ]
    },
    {
      category: 'Ventiss Designer 360',
      description: 'Premium designer L-shape handles',
      handles: [
        { id: 'ventiss-designer-360-black', name: 'Ventiss Designer 360 Black', color: '#1a1a1a', highlight: '#3a3a3a' },
        { id: 'ventiss-designer-360-gold', name: 'Ventiss Designer 360 Gold', color: '#d4af37', highlight: '#f0d060' },
        { id: 'ventiss-designer-360-gunmetal', name: 'Ventiss Designer 360 Gunmetal', color: '#505050', highlight: '#707070' },
        { id: 'ventiss-designer-360-satin', name: 'Ventiss Designer 360 Satin', color: '#b8b8b8', highlight: '#d8d8d8' },
        { id: 'ventiss-designer-360-white', name: 'Ventiss Designer 360 White', color: '#f5f5f5', highlight: '#ffffff' },
      ]
    },
    {
      category: 'SAC Signature',
      description: 'Classic signature range',
      handles: [
        { id: 'sac-signature-white', name: 'SAC Signature Range White', color: '#f5f5f5', highlight: '#ffffff' },
        { id: 'sac-signature-black', name: 'SAC Signature Range Black', color: '#1a1a1a', highlight: '#3a3a3a' },
        { id: 'sac-signature-chrome', name: 'SAC Signature Range Chrome', color: '#c0c0c0', highlight: '#e0e0e0' },
      ]
    },
  ];
  
  const ventilationTypes = [
    { 
      id: 'none', 
      name: 'No Ventilation', 
      description: 'Standard window without additional ventilation',
      icon: '✕'
    },
    { 
      id: 'trickle-vent', 
      name: 'Trickle Vent', 
      description: 'Small slot ventilator installed in the frame head for background ventilation',
      icon: '≡'
    },
    { 
      id: 'night-vent', 
      name: 'Night Vent Restrictor', 
      description: 'Allows secure partial opening for night-time ventilation',
      icon: '☾'
    },
    { 
      id: 'egress-hinges', 
      name: 'Egress Hinges', 
      description: 'Fire escape hinges allowing 90° opening for emergency exit',
      icon: '⬚'
    },
  ];
  
  const handleApply = () => {
    onApply({
      handleType,
      ventilation,
    });
    onClose();
  };
  
  // Render handle SVG icon based on category style
  const renderHandleIcon = (handle, category) => {
    const catName = category.category.toLowerCase();
    
    // Connoisseur - Monkey tail style
    if (catName.includes('connoisseur')) {
      return React.createElement('svg', {
        width: '100',
        height: '50',
        viewBox: '0 0 100 50'
      },
        React.createElement('ellipse', { cx: '18', cy: '28', rx: '10', ry: '4', fill: 'rgba(0,0,0,0.15)' }),
        React.createElement('ellipse', { cx: '16', cy: '25', rx: '10', ry: '10', fill: handle.color, stroke: '#333', strokeWidth: '0.5' }),
        React.createElement('ellipse', { cx: '16', cy: '25', rx: '7', ry: '7', fill: handle.highlight, opacity: '0.3' }),
        React.createElement('path', {
          d: 'M 22 25 Q 40 20, 55 15 Q 70 10, 80 18 Q 85 22, 82 28 Q 78 35, 70 32',
          fill: 'none',
          stroke: handle.color,
          strokeWidth: '5',
          strokeLinecap: 'round'
        }),
        React.createElement('path', {
          d: 'M 24 23 Q 42 18, 57 13 Q 70 9, 78 16',
          fill: 'none',
          stroke: handle.highlight,
          strokeWidth: '1.5',
          strokeLinecap: 'round',
          opacity: '0.5'
        }),
        React.createElement('circle', { cx: '72', cy: '30', r: '4', fill: handle.color, stroke: '#333', strokeWidth: '0.5' })
      );
    }
    
    // Teardrop style
    if (catName.includes('teardrop')) {
      return React.createElement('svg', {
        width: '100',
        height: '50',
        viewBox: '0 0 100 50'
      },
        React.createElement('ellipse', { cx: '18', cy: '30', rx: '10', ry: '4', fill: 'rgba(0,0,0,0.15)' }),
        React.createElement('ellipse', { cx: '16', cy: '26', rx: '10', ry: '10', fill: handle.color, stroke: '#333', strokeWidth: '0.5' }),
        React.createElement('path', {
          d: 'M 24 24 Q 45 12, 70 10 Q 85 10, 90 18',
          fill: 'none',
          stroke: handle.color,
          strokeWidth: '6',
          strokeLinecap: 'round'
        }),
        React.createElement('ellipse', { cx: '88', cy: '20', rx: '6', ry: '8', fill: handle.color, stroke: '#333', strokeWidth: '0.5', transform: 'rotate(-20 88 20)' }),
        React.createElement('path', {
          d: 'M 26 22 Q 47 10, 72 8',
          fill: 'none',
          stroke: handle.highlight,
          strokeWidth: '2',
          strokeLinecap: 'round',
          opacity: '0.4'
        })
      );
    }
    
    // Maxim style - inline/straight
    if (catName.includes('maxim')) {
      return React.createElement('svg', {
        width: '100',
        height: '50',
        viewBox: '0 0 100 50'
      },
        React.createElement('rect', { x: '12', y: '28', width: '80', height: '4', rx: '2', fill: 'rgba(0,0,0,0.15)' }),
        React.createElement('ellipse', { cx: '16', cy: '25', rx: '10', ry: '10', fill: handle.color, stroke: '#333', strokeWidth: '0.5' }),
        React.createElement('rect', { x: '24', y: '21', width: '65', height: '8', rx: '4', fill: handle.color, stroke: '#333', strokeWidth: '0.5' }),
        React.createElement('rect', { x: '26', y: '22', width: '60', height: '3', rx: '1.5', fill: handle.highlight, opacity: '0.4' })
      );
    }
    
    // Ventiss 360 style - L-shape
    if (catName.includes('ventiss')) {
      return React.createElement('svg', {
        width: '100',
        height: '50',
        viewBox: '0 0 100 50'
      },
        React.createElement('ellipse', { cx: '18', cy: '32', rx: '8', ry: '3', fill: 'rgba(0,0,0,0.15)' }),
        React.createElement('circle', { cx: '16', cy: '28', r: '6', fill: handle.color, stroke: '#333', strokeWidth: '0.5' }),
        React.createElement('rect', { x: '13', y: '8', width: '6', height: '22', rx: '2', fill: handle.color, stroke: '#333', strokeWidth: '0.5' }),
        React.createElement('rect', { x: '16', y: '6', width: '70', height: '6', rx: '3', fill: handle.color, stroke: '#333', strokeWidth: '0.5' }),
        React.createElement('circle', { cx: '83', cy: '9', r: '4', fill: handle.color, stroke: '#333', strokeWidth: '0.5' }),
        React.createElement('rect', { x: '18', y: '7', width: '60', height: '2', rx: '1', fill: handle.highlight, opacity: '0.4' })
      );
    }
    
    // SAC Signature style
    if (catName.includes('sac')) {
      return React.createElement('svg', {
        width: '100',
        height: '50',
        viewBox: '0 0 100 50'
      },
        React.createElement('ellipse', { cx: '18', cy: '30', rx: '10', ry: '4', fill: 'rgba(0,0,0,0.15)' }),
        React.createElement('ellipse', { cx: '16', cy: '26', rx: '10', ry: '10', fill: handle.color, stroke: '#333', strokeWidth: '0.5' }),
        React.createElement('path', {
          d: 'M 24 24 Q 50 18, 75 20 Q 88 22, 90 25',
          fill: 'none',
          stroke: handle.color,
          strokeWidth: '5',
          strokeLinecap: 'round'
        }),
        React.createElement('circle', { cx: '88', cy: '25', r: '5', fill: handle.color, stroke: '#333', strokeWidth: '0.5' }),
        React.createElement('path', {
          d: 'M 26 22 Q 52 16, 77 18',
          fill: 'none',
          stroke: handle.highlight,
          strokeWidth: '1.5',
          strokeLinecap: 'round',
          opacity: '0.4'
        })
      );
    }
    
    // Default fallback
    return React.createElement('svg', {
      width: '100',
      height: '50',
      viewBox: '0 0 100 50'
    },
      React.createElement('ellipse', { cx: '16', cy: '25', rx: '10', ry: '10', fill: handle.color }),
      React.createElement('rect', { x: '24', y: '20', width: '60', height: '10', rx: '5', fill: handle.color })
    );
  };
  
  const renderHandlesTab = () => {
    return React.createElement('div', { className: 'handles-container' },
      handleCategories.map((category) =>
        React.createElement('div', { key: category.category, className: 'handle-category' },
          React.createElement('div', { className: 'category-header' },
            React.createElement('h4', null, category.category),
            React.createElement('span', { className: 'category-description' }, category.description)
          ),
          React.createElement('div', { className: 'handles-grid' },
            category.handles.map((handle) =>
              React.createElement('div', {
                key: handle.id,
                className: `handle-card ${handleType === handle.name ? 'selected' : ''}`,
                onClick: () => setHandleType(handle.name)
              },
                React.createElement('div', { className: 'handle-preview' },
                  renderHandleIcon(handle, category)
                ),
                React.createElement('span', { className: 'handle-name' }, handle.name.replace(category.category + ' ', ''))
              )
            )
          )
        )
      )
    );
  };
  
  const renderVentilationTab = () => {
    return React.createElement('div', { className: 'ventilation-container' },
      React.createElement('p', { className: 'ventilation-intro' },
        'Select ventilation options for your window. These can help with air circulation and building regulations compliance.'
      ),
      React.createElement('div', { className: 'ventilation-grid' },
        ventilationTypes.map((vent) =>
          React.createElement('div', {
            key: vent.id,
            className: `ventilation-card ${ventilation === vent.id ? 'selected' : ''}`,
            onClick: () => setVentilation(vent.id)
          },
            React.createElement('div', { className: 'vent-icon' }, vent.icon),
            React.createElement('div', { className: 'vent-content' },
              React.createElement('span', { className: 'vent-name' }, vent.name),
              React.createElement('p', { className: 'vent-description' }, vent.description)
            ),
            ventilation === vent.id && React.createElement('div', { className: 'vent-check' }, '✓')
          )
        )
      )
    );
  };
  
  return React.createElement(Modal, {
    title: 'Manage Hardware',
    isOpen,
    onClose,
    width: '750px'
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
        }, 'Done'),
        React.createElement(Button, {
          variant: 'success',
          onClick: handleApply
        }, 'Apply')
      )
    )
  );
}

export default HardwareModal;
