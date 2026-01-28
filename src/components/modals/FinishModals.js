import React, { useState, useEffect } from 'react';
import { Modal, Button, Card, Tabs, Toggle } from '../common/UIComponents.js';

/**
 * FinishModal Component
 * Modal for selecting frame/sash/cill finishes
 */
function FinishModal({ isOpen, onClose, currentFinish, part = 'frame', onApply }) {
  const [finishType, setFinishType] = useState(currentFinish?.type || 'Foils');
  const [selectedColor, setSelectedColor] = useState(currentFinish?.color || 'White Grain');
  
  // Reset when modal opens with different part
  useEffect(() => {
    if (isOpen && currentFinish) {
      setFinishType(currentFinish.type || 'Foils');
      setSelectedColor(currentFinish.color || 'White Grain');
    }
  }, [isOpen, currentFinish]);
  
  const finishTypes = [
    { value: 'Foils', label: 'Foils', description: 'Wood-effect laminated films' },
    { value: 'Spray', label: 'Spray', description: 'Custom spray painted finish' },
    { value: 'Standard', label: 'Standard', description: 'Standard solid colours' },
  ];
  
  // Colors organized by finish type
  const colorsByType = {
    'Foils': [
      { id: 'white-grain', name: 'White Grain', color: '#f8f6f0', texture: 'wood-grain' },
      { id: 'cream-grain', name: 'Cream Grain', color: '#F5F5DC', texture: 'wood-grain' },
      { id: 'winchester-xc', name: 'Winchester XC', color: '#5D3A1A', texture: 'wood' },
      { id: 'irish-oak', name: 'Irish Oak', color: '#6B4423', texture: 'wood' },
      { id: 'golden-oak', name: 'Golden Oak', color: '#B8860B', texture: 'wood' },
      { id: 'rosewood', name: 'Rosewood', color: '#65000B', texture: 'wood' },
      { id: 'mahogany', name: 'Mahogany', color: '#C04000', texture: 'wood' },
      { id: 'walnut', name: 'Walnut', color: '#5D432C', texture: 'wood' },
      { id: 'cherrywood', name: 'Cherrywood', color: '#DE3163', texture: 'wood' },
      { id: 'anthracite-grey-foil', name: 'Anthracite Grey', color: '#383E42', texture: 'wood-grain' },
      { id: 'black-ash', name: 'Black Ash', color: '#1C1C1C', texture: 'wood' },
      { id: 'chartwell-green-foil', name: 'Chartwell Green', color: '#4A6741', texture: 'wood-grain' },
    ],
    'Spray': [
      { id: 'ral-9010', name: 'RAL 9010 Pure White', color: '#FFFFFF', texture: null },
      { id: 'ral-9001', name: 'RAL 9001 Cream', color: '#FFFDE6', texture: null },
      { id: 'ral-7016', name: 'RAL 7016 Anthracite', color: '#383E42', texture: null },
      { id: 'ral-7012', name: 'RAL 7012 Basalt Grey', color: '#4E5754', texture: null },
      { id: 'ral-7035', name: 'RAL 7035 Light Grey', color: '#D7D7D7', texture: null },
      { id: 'ral-6005', name: 'RAL 6005 Moss Green', color: '#114232', texture: null },
      { id: 'ral-6021', name: 'RAL 6021 Pale Green', color: '#89AC76', texture: null },
      { id: 'ral-5011', name: 'RAL 5011 Steel Blue', color: '#1A2B3C', texture: null },
      { id: 'ral-3005', name: 'RAL 3005 Wine Red', color: '#5E2028', texture: null },
      { id: 'ral-8014', name: 'RAL 8014 Sepia Brown', color: '#49392D', texture: null },
      { id: 'ral-9005', name: 'RAL 9005 Jet Black', color: '#0A0A0A', texture: null },
      { id: 'ral-1015', name: 'RAL 1015 Light Ivory', color: '#E6D2B5', texture: null },
    ],
    'Standard': [
      { id: 'smooth-white', name: 'Smooth White', color: '#ffffff', texture: null },
      { id: 'cream', name: 'Cream', color: '#FFFDD0', texture: null },
      { id: 'white-grain-std', name: 'White Grain', color: '#f8f6f0', texture: 'wood-grain' },
      { id: 'light-grey', name: 'Light Grey', color: '#D3D3D3', texture: null },
      { id: 'anthracite-grey', name: 'Anthracite Grey', color: '#383E42', texture: null },
      { id: 'black', name: 'Black', color: '#1C1C1C', texture: null },
    ],
  };
  
  const currentColors = colorsByType[finishType] || colorsByType['Foils'];
  
  const handleApply = () => {
    const selected = currentColors.find(c => c.name === selectedColor);
    onApply(part, {
      type: finishType,
      color: selectedColor,
      colorHex: selected?.color || '#f8f6f0',
      texture: selected?.texture,
    });
    onClose();
  };
  
  const partNames = {
    frame: 'Frame',
    sash: 'Sash',
    cill: 'Cill'
  };
  
  return React.createElement(Modal, {
    title: `${partNames[part]} Finish`,
    isOpen,
    onClose,
    width: '700px'
  },
    React.createElement('div', { className: 'finish-modal' },
      // Finish Type Selection
      React.createElement('div', { className: 'finish-type-section' },
        React.createElement('h4', { style: { marginBottom: '12px', color: '#333' } }, 'Finish Type'),
        React.createElement('div', { className: 'finish-type-grid', style: { display: 'flex', gap: '12px', marginBottom: '20px' } },
          finishTypes.map((type) =>
            React.createElement('div', {
              key: type.value,
              className: `finish-type-card ${finishType === type.value ? 'selected' : ''}`,
              onClick: () => {
                setFinishType(type.value);
                // Reset to first color of new type
                const firstColor = colorsByType[type.value][0];
                setSelectedColor(firstColor.name);
              },
              style: {
                flex: 1,
                padding: '16px',
                border: finishType === type.value ? '2px solid #10b981' : '2px solid #e5e7eb',
                borderRadius: '8px',
                cursor: 'pointer',
                background: finishType === type.value ? '#ecfdf5' : '#fff',
                textAlign: 'center',
                transition: 'all 0.2s'
              }
            },
              React.createElement('div', { style: { fontWeight: '600', marginBottom: '4px' } }, type.label),
              React.createElement('div', { style: { fontSize: '12px', color: '#666' } }, type.description)
            )
          )
        )
      ),
      
      // Color Selection Grid
      React.createElement('div', { className: 'color-section' },
        React.createElement('h4', { style: { marginBottom: '12px', color: '#333' } }, 'Select Colour'),
        React.createElement('div', { 
          className: 'color-grid',
          style: {
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '12px',
            maxHeight: '300px',
            overflowY: 'auto',
            padding: '4px'
          }
        },
          currentColors.map((color) =>
            React.createElement('div', {
              key: color.id,
              className: `color-swatch-card ${selectedColor === color.name ? 'selected' : ''}`,
              onClick: () => setSelectedColor(color.name),
              style: {
                border: selectedColor === color.name ? '3px solid #10b981' : '2px solid #e5e7eb',
                borderRadius: '8px',
                padding: '8px',
                cursor: 'pointer',
                background: selectedColor === color.name ? '#ecfdf5' : '#fff',
                transition: 'all 0.2s'
              }
            },
              React.createElement('div', {
                className: 'swatch-preview',
                style: {
                  width: '100%',
                  height: '50px',
                  backgroundColor: color.color,
                  borderRadius: '4px',
                  marginBottom: '8px',
                  border: '1px solid rgba(0,0,0,0.1)',
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
                }
              }),
              React.createElement('span', { 
                className: 'swatch-label',
                style: { fontSize: '11px', fontWeight: '500', color: '#333', textAlign: 'center', display: 'block' }
              }, color.name)
            )
          )
        )
      ),
      
      // Current Selection Preview
      React.createElement('div', { 
        className: 'selection-preview',
        style: {
          marginTop: '20px',
          padding: '16px',
          background: '#f9fafb',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }
      },
        React.createElement('div', {
          style: {
            width: '60px',
            height: '60px',
            backgroundColor: currentColors.find(c => c.name === selectedColor)?.color || '#f8f6f0',
            borderRadius: '8px',
            border: '2px solid #ddd',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }
        }),
        React.createElement('div', null,
          React.createElement('div', { style: { fontWeight: '600', fontSize: '16px' } }, selectedColor),
          React.createElement('div', { style: { color: '#666', fontSize: '14px' } }, `${finishType} finish for ${partNames[part]}`)
        )
      ),
      
      React.createElement('div', { className: 'modal-actions', style: { marginTop: '20px', display: 'flex', gap: '12px', justifyContent: 'flex-end' } },
        React.createElement(Button, {
          variant: 'secondary',
          onClick: onClose
        }, 'Cancel'),
        React.createElement(Button, {
          variant: 'success',
          onClick: handleApply
        }, `Apply to ${partNames[part]}`)
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
