import React, { useState } from 'react';
import { Modal, Button, Card, Tabs, Toggle } from '../common/UIComponents.js';

/**
 * FinishModal Component
 * Modal for selecting frame/sash finishes
 */
function FinishModal({ isOpen, onClose, currentFinish, part = 'frame', onApply }) {
  const [activeTab, setActiveTab] = useState('FRAME');
  const [finishType, setFinishType] = useState('Foils');
  const [selectedColor, setSelectedColor] = useState(currentFinish?.color || 'White Grain');
  
  const tabs = [
    { id: 'FRAME', label: 'FRAME' },
    { id: 'SASH', label: 'SASH' },
  ];
  
  const finishTypes = [
    { value: 'Foils', label: 'Foils' },
    { value: 'Spray', label: 'Spray' },
    { value: 'Standard', label: 'Standard' },
  ];
  
  const colors = [
    { id: 'smooth-white', name: 'Smooth White', color: '#ffffff', texture: null },
    { id: 'white-grain', name: 'White Grain', color: '#f8f6f0', texture: 'wood-grain' },
    { id: 'winchester-xc', name: 'Winchester XC', color: '#5D3A1A', texture: 'wood' },
    { id: 'winchester-xc-white', name: 'Winchester XC & Smooth White', color: '#5D3A1A', secondColor: '#ffffff', dual: true },
    { id: 'winchester-xc-grain', name: 'Winchester XC & White Grain', color: '#5D3A1A', secondColor: '#f8f6f0', dual: true },
    { id: 'windsor', name: 'Windsor', color: '#8B7355', texture: 'wood' },
    { id: 'windsor-white', name: 'Windsor & Smooth White', color: '#8B7355', secondColor: '#ffffff', dual: true },
    { id: 'windsor-grain', name: 'Windsor & White Grain', color: '#8B7355', secondColor: '#f8f6f0', dual: true },
    { id: 'wine-red', name: 'Wine Red', color: '#722F37', texture: null },
    { id: 'wine-red-white', name: 'Wine Red & Smooth White', color: '#722F37', secondColor: '#ffffff', dual: true },
    { id: 'wine-red-grain', name: 'Wine Red & White Grain', color: '#722F37', secondColor: '#f8f6f0', dual: true },
    { id: 'anthracite-grey', name: 'Anthracite Grey', color: '#383E42', texture: null },
    { id: 'chartwell-green', name: 'Chartwell Green', color: '#4A6741', texture: null },
    { id: 'cream', name: 'Cream', color: '#FFFDD0', texture: null },
    { id: 'irish-oak', name: 'Irish Oak', color: '#6B4423', texture: 'wood' },
    { id: 'golden-oak', name: 'Golden Oak', color: '#B8860B', texture: 'wood' },
    { id: 'rosewood', name: 'Rosewood', color: '#65000B', texture: 'wood' },
    { id: 'black', name: 'Black', color: '#1C1C1C', texture: null },
  ];
  
  const handleApply = () => {
    const selected = colors.find(c => c.name === selectedColor);
    onApply(activeTab.toLowerCase(), {
      type: finishType,
      color: selectedColor,
      colorHex: selected?.color,
      texture: selected?.texture,
    });
  };
  
  return React.createElement(Modal, {
    title: 'Manage Sash Finish',
    isOpen,
    onClose,
    width: '650px'
  },
    React.createElement('div', { className: 'finish-modal' },
      React.createElement(Tabs, {
        tabs,
        activeTab,
        onTabChange: setActiveTab
      }),
      
      React.createElement('div', { className: 'finish-type-select' },
        React.createElement('label', null, 'Type:'),
        React.createElement('select', {
          className: 'select-field',
          value: finishType,
          onChange: (e) => setFinishType(e.target.value)
        },
          finishTypes.map((t) =>
            React.createElement('option', { key: t.value, value: t.value }, t.label)
          )
        )
      ),
      
      React.createElement('div', { className: 'color-grid' },
        colors.map((color) =>
          React.createElement('div', {
            key: color.id,
            className: `color-swatch-card ${selectedColor === color.name ? 'selected' : ''}`,
            onClick: () => setSelectedColor(color.name)
          },
            React.createElement('div', { className: 'swatch-preview-box' },
              color.dual
                ? React.createElement('div', { className: 'swatch-dual-preview' },
                    React.createElement('div', {
                      className: 'swatch-half-top',
                      style: { backgroundColor: color.color }
                    }),
                    React.createElement('div', {
                      className: 'swatch-half-bottom',
                      style: { backgroundColor: color.secondColor }
                    })
                  )
                : React.createElement('div', {
                    className: 'swatch-full',
                    style: { backgroundColor: color.color }
                  })
            ),
            React.createElement('span', { className: 'swatch-label' }, color.name)
          )
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
        }, `Apply to ${activeTab === 'FRAME' ? 'Frame' : 'Sash'}`)
      )
    )
  );
}

/**
 * CillModal Component
 * Modal for managing cill/add-ons options
 */
function CillModal({ isOpen, onClose, extras, onApply }) {
  const [activeTab, setActiveTab] = useState('CILL');
  const [cillEnabled, setCillEnabled] = useState(extras?.cill?.enabled ?? true);
  const [cillType, setCillType] = useState(extras?.cill?.type || 'Standard');
  const [cillLength, setCillLength] = useState(extras?.cill?.length || 1300);
  const [leftHorn, setLeftHorn] = useState(extras?.cill?.leftHorn || 50);
  const [rightHorn, setRightHorn] = useState(extras?.cill?.rightHorn || 50);
  const [headDrip, setHeadDrip] = useState(extras?.headDrip || false);
  const [weatherBar, setWeatherBar] = useState(extras?.weatherBar || false);
  
  const tabs = [
    { id: 'ADD ONS', label: 'ADD ONS' },
    { id: 'CILL', label: 'CILL' },
    { id: 'HEAD DRIP', label: 'HEAD DRIP' },
    { id: 'WEATHER BAR', label: 'WEATHER BAR' },
  ];
  
  const cillTypes = ['Stub', 'Standard', 'Large', 'Extra Large'];
  
  const handleApply = () => {
    onApply({
      cill: {
        enabled: cillEnabled,
        type: cillType,
        length: parseInt(cillLength),
        leftHorn: parseInt(leftHorn),
        rightHorn: parseInt(rightHorn),
      },
      headDrip,
      weatherBar,
    });
    onClose();
  };
  
  const renderCillTab = () => {
    return React.createElement('div', { className: 'cill-options' },
      React.createElement(Toggle, {
        label: cillEnabled ? 'Cill' : 'No Cill',
        checked: cillEnabled,
        onChange: setCillEnabled
      }),
      
      cillEnabled && React.createElement('div', { className: 'cill-details' },
        React.createElement('div', { className: 'cill-type-grid' },
          cillTypes.map((type) =>
            React.createElement(Card, {
              key: type,
              selected: cillType === type,
              onClick: () => setCillType(type),
              className: 'cill-type-card'
            }, type)
          )
        ),
        
        React.createElement('div', { className: 'cill-dimensions' },
          React.createElement('div', { className: 'cill-dim-field' },
            React.createElement('label', null, 'Cill length'),
            React.createElement('input', {
              type: 'number',
              value: cillLength,
              onChange: (e) => setCillLength(e.target.value)
            }),
            React.createElement('span', { className: 'unit' }, 'mm')
          ),
          React.createElement('div', { className: 'cill-dim-field' },
            React.createElement('label', null, 'Left horn'),
            React.createElement('input', {
              type: 'number',
              value: leftHorn,
              onChange: (e) => setLeftHorn(e.target.value)
            }),
            React.createElement('span', { className: 'unit' }, 'mm')
          ),
          React.createElement('div', { className: 'cill-dim-field' },
            React.createElement('label', null, 'Right horn'),
            React.createElement('input', {
              type: 'number',
              value: rightHorn,
              onChange: (e) => setRightHorn(e.target.value)
            }),
            React.createElement('span', { className: 'unit' }, 'mm')
          )
        )
      )
    );
  };
  
  const renderAddOnsTab = () => {
    return React.createElement('div', { className: 'addons-options' },
      React.createElement(Toggle, {
        label: 'Cill',
        checked: cillEnabled,
        onChange: setCillEnabled
      }),
      React.createElement(Toggle, {
        label: 'Head Drip',
        checked: headDrip,
        onChange: setHeadDrip
      }),
      React.createElement(Toggle, {
        label: 'Weather Bar',
        checked: weatherBar,
        onChange: setWeatherBar
      })
    );
  };
  
  return React.createElement(Modal, {
    title: 'Manage Cill',
    isOpen,
    onClose,
    width: '600px'
  },
    React.createElement('div', { className: 'cill-modal' },
      React.createElement(Tabs, {
        tabs,
        activeTab,
        onTabChange: setActiveTab
      }),
      
      activeTab === 'CILL' && renderCillTab(),
      activeTab === 'ADD ONS' && renderAddOnsTab(),
      activeTab === 'HEAD DRIP' && React.createElement(Toggle, {
        label: 'Head Drip',
        checked: headDrip,
        onChange: setHeadDrip
      }),
      activeTab === 'WEATHER BAR' && React.createElement(Toggle, {
        label: 'Weather Bar',
        checked: weatherBar,
        onChange: setWeatherBar
      }),
      
      React.createElement('div', { className: 'modal-actions' },
        React.createElement(Button, {
          variant: 'secondary',
          onClick: onClose
        }, 'Close'),
        React.createElement(Button, {
          variant: 'success',
          onClick: handleApply
        }, 'Apply Cill Changes')
      )
    )
  );
}

export { FinishModal, CillModal };
