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
    { id: 'clear', name: 'Clear', preview: 'linear-gradient(180deg, #4a90d9 0%, #87ceeb 50%, #e0f4ff 100%)', description: 'Standard clear glass' },
    { id: 'arctic', name: 'Arctic', preview: 'linear-gradient(180deg, #d0d5d9 0%, #e8ebee 50%, #d0d5d9 100%)', description: 'Frosted white' },
    { id: 'contora', name: 'Contora', preview: 'repeating-linear-gradient(90deg, #bec3c8 0px, #dce1e6 3px, #bec3c8 6px)', description: 'Vertical reeded' },
    { id: 'chantilly', name: 'Chantilly', preview: 'radial-gradient(circle, #f0f0f0 2px, #dcdcdc 2px)', description: 'Lace pattern' },
    { id: 'charcoal-sticks', name: 'Charcoal Sticks', preview: 'repeating-linear-gradient(90deg, #6e6e6e 0px, #8c8c8c 4px, #6e6e6e 8px)', description: 'Dark reeded' },
    { id: 'everglade', name: 'Everglade', preview: 'linear-gradient(180deg, #a0b4a0 0%, #b8c5b8 50%, #a0b4a0 100%)', description: 'Green tinted' },
    { id: 'cotswold', name: 'Cotswold', preview: 'linear-gradient(135deg, #c9c0b5 0%, #e1d8cd 50%, #c9c0b5 100%)', description: 'Warm honey' },
    { id: 'digital', name: 'Digital', preview: 'linear-gradient(45deg, #a8a8a8 25%, #c8c8c8 50%, #a8a8a8 75%)', description: 'Modern geometric' },
    { id: 'mayflower', name: 'Mayflower', preview: 'radial-gradient(circle at 30% 30%, #d5d0c8 5px, #e0dbd3 5px)', description: 'Floral pattern' },
    { id: 'flemish', name: 'Flemish', preview: 'repeating-linear-gradient(180deg, #ccc8c0 0px, #e0dcd4 8px, #ccc8c0 16px)', description: 'Wavy distorted' },
    { id: 'minster', name: 'Minster', preview: 'radial-gradient(ellipse at 50% 0%, #c8c4bc 0%, #d8d4cc 50%, #c8c4bc 100%)', description: 'Cathedral style' },
    { id: 'oak', name: 'Oak', preview: 'linear-gradient(180deg, #b5a590 0%, #c5b5a0 50%, #b5a590 100%)', description: 'Wood tinted' },
    { id: 'satin', name: 'Satin', preview: 'linear-gradient(180deg, #f0f0f5 0%, #fafaff 50%, #f0f0f5 100%)', description: 'Smooth frosted' },
    { id: 'stippolyte', name: 'Stippolyte', preview: 'radial-gradient(circle at 2px 2px, #c8c8c8 1px, #e0e0e0 1px)', description: 'Fine stippled' },
    { id: 'taffeta', name: 'Taffeta', preview: 'linear-gradient(135deg, #dcdce1 0%, #ebebf0 50%, #dcdce1 100%)', description: 'Silk-like' },
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
            style: { 
              background: tex.preview,
              backgroundSize: tex.id === 'stippolyte' || tex.id === 'chantilly' ? '4px 4px' : 'cover'
            }
          }),
          React.createElement('span', { className: 'texture-name' }, tex.name),
          React.createElement('span', { className: 'texture-description' }, tex.description)
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
