import React, { useState } from 'react';
import { Modal, Button, Card, Tabs, Toggle } from '../common/UIComponents.js';

/**
 * GlassModal Component
 * Modal for selecting glass options per pane
 */
function GlassModal({ isOpen, onClose, paneId, currentGlass, onApply, onApplyToAll }) {
  const [activeTab, setActiveTab] = useState('PANES');
  const [paneType, setPaneType] = useState(currentGlass?.paneType || 'Double Glazed');
  const [sealedUnit, setSealedUnit] = useState(currentGlass?.sealedUnit || 'Double Glazed (Annealed)');
  const [texture, setTexture] = useState(currentGlass?.texture || 'Clear');
  const [spacerBar, setSpacerBar] = useState(currentGlass?.spacerBars || 'Black');
  const [solarControl, setSolarControl] = useState(currentGlass?.solarControl || false);
  const [selfClean, setSelfClean] = useState(currentGlass?.selfClean || false);
  
  const tabs = [
    { id: 'PANES', label: 'PANES' },
    { id: 'TEXTURES', label: 'TEXTURES' },
    { id: 'SPACER BARS', label: 'SPACER BARS' },
    { id: 'SOLAR CONTROL', label: 'SOLAR CONTROL' },
    { id: 'SELF CLEAN', label: 'SELF CLEAN' },
  ];
  
  const paneTypes = ['Panel', 'Double Glazed', 'Triple Glazed'];
  
  const sealedUnits = [
    'Double Glazed (Annealed)',
    'Double Glazed (Laminated)',
    'Double Glazed (Toughened)',
  ];
  
  const textures = [
    { id: 'clear', name: 'Clear', preview: 'linear-gradient(135deg, #e8e8e8 0%, #f8f8f8 50%, #e0e0e0 100%)' },
    { id: 'arctic', name: 'Arctic', preview: '#d0d5d9' },
    { id: 'contora', name: 'Contora', preview: '#c5c8cb' },
    { id: 'chantilly', name: 'Chantilly', preview: '#dcdcdc' },
    { id: 'charcoal-sticks', name: 'Charcoal Sticks', preview: '#8a8a8a' },
    { id: 'everglade', name: 'Everglade', preview: '#b8c5b8' },
    { id: 'cotswold', name: 'Cotswold', preview: '#c9c0b5' },
    { id: 'digital', name: 'Digital', preview: '#a8a8a8' },
    { id: 'mayflower', name: 'Mayflower', preview: '#d5d0c8' },
    { id: 'flemish', name: 'Flemish', preview: '#ccc8c0' },
    { id: 'minster', name: 'Minster', preview: '#c8c4bc' },
    { id: 'oak', name: 'Oak', preview: '#b5a590' },
  ];
  
  const spacerBars = ['Black', 'Grey', 'White', 'Chrome'];
  
  const handleApply = (applyTo = 'pane') => {
    const glassConfig = {
      paneType,
      sealedUnit,
      texture,
      spacerBars: spacerBar,
      solarControl,
      selfClean,
    };
    
    if (applyTo === 'all') {
      onApplyToAll(glassConfig);
    } else {
      onApply(paneId, glassConfig);
    }
    onClose();
  };
  
  const renderPanesTab = () => {
    return React.createElement('div', { className: 'panes-options' },
      React.createElement('div', { className: 'pane-type-grid' },
        paneTypes.map((type) =>
          React.createElement(Card, {
            key: type,
            selected: paneType === type,
            onClick: () => setPaneType(type),
            className: `pane-type-card ${type === 'Double Glazed' ? 'recommended' : ''}`
          }, type)
        )
      ),
      
      paneType !== 'Panel' && React.createElement('div', { className: 'sealed-unit-section' },
        React.createElement('p', { className: 'sealed-unit-label' },
          `Choose a Standard Sealed Unit from ${sealedUnits.length} available:`
        ),
        React.createElement('div', { className: 'sealed-unit-grid' },
          sealedUnits.map((unit) =>
            React.createElement(Card, {
              key: unit,
              selected: sealedUnit === unit,
              onClick: () => setSealedUnit(unit),
              className: 'sealed-unit-card'
            }, unit)
          )
        ),
        React.createElement(Button, {
          variant: 'warning',
          className: 'view-more-btn'
        }, 'View More Units ↓')
      )
    );
  };
  
  const renderTexturesTab = () => {
    return React.createElement('div', { className: 'textures-grid' },
      textures.map((tex) =>
        React.createElement('div', {
          key: tex.id,
          className: `texture-card ${texture === tex.name ? 'selected' : ''}`,
          onClick: () => setTexture(tex.name)
        },
          React.createElement('div', {
            className: 'texture-preview',
            style: { background: tex.preview }
          }),
          React.createElement('span', { className: 'texture-name' }, tex.name)
        )
      )
    );
  };
  
  const renderSpacerBarsTab = () => {
    return React.createElement('div', { className: 'spacer-bars-options' },
      React.createElement('div', { className: 'spacer-grid' },
        spacerBars.map((bar) =>
          React.createElement(Card, {
            key: bar,
            selected: spacerBar === bar,
            onClick: () => setSpacerBar(bar),
            className: 'spacer-card'
          },
            React.createElement('div', {
              className: 'spacer-preview',
              style: { backgroundColor: bar.toLowerCase() === 'chrome' ? '#c0c0c0' : bar.toLowerCase() }
            }),
            React.createElement('span', null, bar)
          )
        )
      )
    );
  };
  
  const renderSolarControlTab = () => {
    return React.createElement('div', { className: 'solar-control-options' },
      React.createElement(Toggle, {
        label: 'Solar Control Glass',
        checked: solarControl,
        onChange: setSolarControl
      }),
      React.createElement('p', { className: 'info-text' },
        'Solar control glass helps reduce heat gain from sunlight, keeping your home cooler in summer.'
      )
    );
  };
  
  const renderSelfCleanTab = () => {
    return React.createElement('div', { className: 'self-clean-options' },
      React.createElement(Toggle, {
        label: 'Self-Cleaning Glass',
        checked: selfClean,
        onChange: setSelfClean
      }),
      React.createElement('p', { className: 'info-text' },
        'Self-cleaning glass has a special coating that breaks down dirt using UV light and washes away with rainwater.'
      )
    );
  };
  
  return React.createElement(Modal, {
    title: `Glass at ${paneId}`,
    isOpen,
    onClose,
    width: '700px'
  },
    React.createElement('div', { className: 'glass-modal' },
      React.createElement(Tabs, {
        tabs,
        activeTab,
        onTabChange: setActiveTab
      }),
      
      React.createElement('div', { className: 'glass-tab-content' },
        activeTab === 'PANES' && renderPanesTab(),
        activeTab === 'TEXTURES' && renderTexturesTab(),
        activeTab === 'SPACER BARS' && renderSpacerBarsTab(),
        activeTab === 'SOLAR CONTROL' && renderSolarControlTab(),
        activeTab === 'SELF CLEAN' && renderSelfCleanTab()
      ),
      
      React.createElement('div', { className: 'modal-actions four-buttons' },
        React.createElement(Button, {
          variant: 'secondary',
          onClick: onClose
        }, 'Done'),
        React.createElement(Button, {
          variant: 'success',
          onClick: () => handleApply('pane')
        }, 'Apply to Pane'),
        React.createElement(Button, {
          variant: 'success',
          onClick: () => handleApply('selected')
        }, 'Apply to Selected'),
        React.createElement(Button, {
          variant: 'success',
          onClick: () => handleApply('all')
        }, 'Apply to All')
      )
    )
  );
}

export default GlassModal;
