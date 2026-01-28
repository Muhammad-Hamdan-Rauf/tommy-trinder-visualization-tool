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
function CillModal({ isOpen, onClose, extras, onApply, initialTab }) {
  const [activeTab, setActiveTab] = useState(initialTab || 'CILL');
  const [cillEnabled, setCillEnabled] = useState(extras?.cill?.enabled ?? true);
  const [cillType, setCillType] = useState(extras?.cill?.type || 'Standard');
  const [cillLength, setCillLength] = useState(extras?.cill?.length || 1300);
  const [leftHorn, setLeftHorn] = useState(extras?.cill?.leftHorn || 50);
  const [rightHorn, setRightHorn] = useState(extras?.cill?.rightHorn || 50);
  const [headDrip, setHeadDrip] = useState(extras?.headDrip || false);
  const [weatherBar, setWeatherBar] = useState(extras?.weatherBar || false);
  
  // Update active tab when initialTab changes
  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);
  
  const tabs = [
    { id: 'ADD ONS', label: 'ADD ONS' },
    { id: 'CILL', label: 'CILL' },
    { id: 'HEAD DRIP', label: 'HEAD DRIP' },
    { id: 'WEATHER BAR', label: 'WEATHER BAR' },
  ];
  
  const cillTypes = [
    { id: 'Stub', name: 'Stub', depth: '40mm', description: 'Minimal projection' },
    { id: 'Standard', name: 'Standard', depth: '85mm', description: 'Standard depth cill' },
    { id: 'Large', name: 'Large', depth: '150mm', description: 'Extended projection' },
    { id: 'Extra Large', name: 'Extra Large', depth: '225mm', description: 'Maximum projection' },
  ];
  
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
      // Enable/Disable toggle
      React.createElement('div', { className: 'cill-toggle-section' },
        React.createElement(Toggle, {
          label: cillEnabled ? 'Cill Enabled' : 'No Cill',
          checked: cillEnabled,
          onChange: setCillEnabled
        }),
        React.createElement('p', { className: 'toggle-hint' },
          cillEnabled ? 'Window will have a cill installed' : 'Window will be installed without a cill'
        )
      ),
      
      cillEnabled && React.createElement('div', { className: 'cill-details' },
        // Cill Type Selection
        React.createElement('div', { className: 'cill-type-section' },
          React.createElement('h4', null, 'Cill Type'),
          React.createElement('div', { className: 'cill-type-grid' },
            cillTypes.map((type) =>
              React.createElement(Card, {
                key: type.id,
                selected: cillType === type.id,
                onClick: () => setCillType(type.id),
                className: 'cill-type-card'
              },
                React.createElement('div', { className: 'cill-type-name' }, type.name),
                React.createElement('div', { className: 'cill-type-depth' }, type.depth),
                React.createElement('div', { className: 'cill-type-desc' }, type.description)
              )
            )
          )
        ),
        
        // Cill Dimensions
        React.createElement('div', { className: 'cill-dimensions-section' },
          React.createElement('h4', null, 'Dimensions'),
          React.createElement('div', { className: 'cill-dimensions' },
            React.createElement('div', { className: 'cill-dim-field' },
              React.createElement('label', null, 'Cill Length'),
              React.createElement('div', { className: 'input-with-unit' },
                React.createElement('input', {
                  type: 'number',
                  value: cillLength,
                  onChange: (e) => setCillLength(e.target.value),
                  min: 100,
                  max: 5000
                }),
                React.createElement('span', { className: 'unit' }, 'mm')
              )
            ),
            React.createElement('div', { className: 'cill-dim-field' },
              React.createElement('label', null, 'Left Horn'),
              React.createElement('div', { className: 'input-with-unit' },
                React.createElement('input', {
                  type: 'number',
                  value: leftHorn,
                  onChange: (e) => setLeftHorn(e.target.value),
                  min: 0,
                  max: 200
                }),
                React.createElement('span', { className: 'unit' }, 'mm')
              )
            ),
            React.createElement('div', { className: 'cill-dim-field' },
              React.createElement('label', null, 'Right Horn'),
              React.createElement('div', { className: 'input-with-unit' },
                React.createElement('input', {
                  type: 'number',
                  value: rightHorn,
                  onChange: (e) => setRightHorn(e.target.value),
                  min: 0,
                  max: 200
                }),
                React.createElement('span', { className: 'unit' }, 'mm')
              )
            )
          ),
          // Horn info
          React.createElement('p', { className: 'dimension-hint' },
            'Horns are the extensions of the cill beyond the window frame on each side'
          )
        ),
        
        // Cill Preview
        React.createElement('div', { className: 'cill-preview-section' },
          React.createElement('h4', null, 'Preview'),
          React.createElement('div', { className: 'cill-preview' },
            // Simple cill visualization
            React.createElement('svg', {
              width: '280',
              height: '60',
              viewBox: '0 0 280 60'
            },
              // Left horn
              React.createElement('rect', {
                x: 10,
                y: 20,
                width: leftHorn / 5,
                height: 25,
                fill: '#e8e4dc',
                stroke: '#999',
                strokeWidth: '1'
              }),
              // Main cill body
              React.createElement('rect', {
                x: 10 + leftHorn / 5,
                y: 15,
                width: 180,
                height: 30,
                fill: 'linear-gradient(180deg, #f8f6f0 0%, #e8e4dc 100%)',
                stroke: '#999',
                strokeWidth: '1'
              }),
              // Frame indicator
              React.createElement('rect', {
                x: 40 + leftHorn / 5,
                y: 0,
                width: 120,
                height: 20,
                fill: '#f0f0f0',
                stroke: '#ccc',
                strokeWidth: '1',
                strokeDasharray: '4'
              }),
              React.createElement('text', {
                x: 100 + leftHorn / 5,
                y: 12,
                textAnchor: 'middle',
                fontSize: '10',
                fill: '#666'
              }, 'Window Frame'),
              // Right horn
              React.createElement('rect', {
                x: 190 + leftHorn / 5,
                y: 20,
                width: rightHorn / 5,
                height: 25,
                fill: '#e8e4dc',
                stroke: '#999',
                strokeWidth: '1'
              }),
              // Dimension labels
              React.createElement('text', {
                x: 10 + leftHorn / 10,
                y: 55,
                textAnchor: 'middle',
                fontSize: '9',
                fill: '#666'
              }, `${leftHorn}mm`),
              React.createElement('text', {
                x: 190 + leftHorn / 5 + rightHorn / 10,
                y: 55,
                textAnchor: 'middle',
                fontSize: '9',
                fill: '#666'
              }, `${rightHorn}mm`)
            )
          )
        )
      )
    );
  };
  
  const renderAddOnsTab = () => {
    return React.createElement('div', { className: 'addons-options' },
      React.createElement('p', { className: 'addons-intro' },
        'Quickly enable or disable all extras from here'
      ),
      
      React.createElement('div', { className: 'addons-list' },
        // Cill toggle
        React.createElement('div', { className: 'addon-item' },
          React.createElement('div', { className: 'addon-info' },
            React.createElement('span', { className: 'addon-icon' }, '▬'),
            React.createElement('div', { className: 'addon-text' },
              React.createElement('span', { className: 'addon-name' }, 'Cill'),
              React.createElement('span', { className: 'addon-desc' }, 
                cillEnabled ? `${cillType} cill (${cillLength}mm)` : 'Window sill at the bottom'
              )
            )
          ),
          React.createElement(Toggle, {
            checked: cillEnabled,
            onChange: setCillEnabled
          })
        ),
        
        // Head Drip toggle
        React.createElement('div', { className: 'addon-item' },
          React.createElement('div', { className: 'addon-info' },
            React.createElement('span', { className: 'addon-icon' }, '⌃'),
            React.createElement('div', { className: 'addon-text' },
              React.createElement('span', { className: 'addon-name' }, 'Head Drip'),
              React.createElement('span', { className: 'addon-desc' }, 'Weather protection at top of frame')
            )
          ),
          React.createElement(Toggle, {
            checked: headDrip,
            onChange: setHeadDrip
          })
        ),
        
        // Weather Bar toggle
        React.createElement('div', { className: 'addon-item' },
          React.createElement('div', { className: 'addon-info' },
            React.createElement('span', { className: 'addon-icon' }, '▭'),
            React.createElement('div', { className: 'addon-text' },
              React.createElement('span', { className: 'addon-name' }, 'Weather Bar'),
              React.createElement('span', { className: 'addon-desc' }, 'Additional seal at bottom of sash')
            )
          ),
          React.createElement(Toggle, {
            checked: weatherBar,
            onChange: setWeatherBar
          })
        )
      )
    );
  };
  
  const renderHeadDripTab = () => {
    return React.createElement('div', { className: 'head-drip-options' },
      React.createElement('div', { className: 'feature-toggle-section' },
        React.createElement(Toggle, {
          label: headDrip ? 'Head Drip Enabled' : 'No Head Drip',
          checked: headDrip,
          onChange: setHeadDrip
        })
      ),
      
      React.createElement('div', { className: 'feature-description' },
        React.createElement('h4', null, 'What is a Head Drip?'),
        React.createElement('p', null,
          'A head drip is a projecting moulding fitted to the top of a window frame. It helps to direct rainwater away from the window, preventing water ingress and protecting the frame from weather damage.'
        ),
        React.createElement('div', { className: 'feature-benefits' },
          React.createElement('h5', null, 'Benefits:'),
          React.createElement('ul', null,
            React.createElement('li', null, 'Prevents water running down the window'),
            React.createElement('li', null, 'Reduces risk of damp and mould'),
            React.createElement('li', null, 'Protects window frame from weathering'),
            React.createElement('li', null, 'Improves overall weather resistance')
          )
        )
      ),
      
      // Visual representation
      React.createElement('div', { className: 'feature-preview' },
        React.createElement('svg', {
          width: '200',
          height: '80',
          viewBox: '0 0 200 80'
        },
          // Wall
          React.createElement('rect', { x: 0, y: 0, width: 40, height: 80, fill: '#d0c0b0' }),
          // Head drip
          headDrip && React.createElement('path', {
            d: 'M 40 15 L 60 15 L 60 20 L 55 25 L 40 25 Z',
            fill: '#f0f0f0',
            stroke: '#999',
            strokeWidth: '1'
          }),
          // Frame top
          React.createElement('rect', { x: 40, y: 25, width: 150, height: 55, fill: '#f8f6f0', stroke: '#ccc' }),
          // Glass
          React.createElement('rect', { x: 55, y: 35, width: 120, height: 40, fill: '#87ceeb', opacity: 0.6 }),
          // Rain drops
          headDrip && React.createElement('g', { fill: '#4a90d9' },
            React.createElement('circle', { cx: 50, cy: 5, r: 2 }),
            React.createElement('circle', { cx: 55, cy: 10, r: 2 }),
            React.createElement('path', { d: 'M 55 12 L 50 22 L 45 30', stroke: '#4a90d9', fill: 'none', strokeWidth: 1, strokeDasharray: '2' })
          )
        )
      )
    );
  };
  
  const renderWeatherBarTab = () => {
    return React.createElement('div', { className: 'weather-bar-options' },
      React.createElement('div', { className: 'feature-toggle-section' },
        React.createElement(Toggle, {
          label: weatherBar ? 'Weather Bar Enabled' : 'No Weather Bar',
          checked: weatherBar,
          onChange: setWeatherBar
        })
      ),
      
      React.createElement('div', { className: 'feature-description' },
        React.createElement('h4', null, 'What is a Weather Bar?'),
        React.createElement('p', null,
          'A weather bar is a metal or plastic strip fitted to the bottom of the window sash. It creates an additional barrier against wind-driven rain and improves the weather tightness of the window.'
        ),
        React.createElement('div', { className: 'feature-benefits' },
          React.createElement('h5', null, 'Benefits:'),
          React.createElement('ul', null,
            React.createElement('li', null, 'Enhanced weather sealing'),
            React.createElement('li', null, 'Prevents water ingress at sash bottom'),
            React.createElement('li', null, 'Improved wind resistance'),
            React.createElement('li', null, 'Increases window lifespan')
          )
        )
      ),
      
      // Visual representation
      React.createElement('div', { className: 'feature-preview' },
        React.createElement('svg', {
          width: '200',
          height: '80',
          viewBox: '0 0 200 80'
        },
          // Frame
          React.createElement('rect', { x: 10, y: 10, width: 180, height: 50, fill: '#f8f6f0', stroke: '#ccc' }),
          // Glass
          React.createElement('rect', { x: 25, y: 20, width: 150, height: 30, fill: '#87ceeb', opacity: 0.6 }),
          // Sash bottom
          React.createElement('rect', { x: 20, y: 50, width: 160, height: 8, fill: '#f0f0f0', stroke: '#999' }),
          // Weather bar
          weatherBar && React.createElement('rect', {
            x: 20, y: 58, width: 160, height: 4,
            fill: '#666',
            rx: 1
          }),
          // Cill
          React.createElement('rect', { x: 5, y: 65, width: 190, height: 12, fill: '#e8e4dc', stroke: '#999' }),
          // Label
          weatherBar && React.createElement('text', {
            x: 100, y: 75, textAnchor: 'middle', fontSize: '8', fill: '#666'
          }, '← Weather Bar')
        )
      )
    );
  };
  
  return React.createElement(Modal, {
    title: 'Extras & Add-ons',
    isOpen,
    onClose,
    width: '650px'
  },
    React.createElement('div', { className: 'cill-modal extras-modal' },
      React.createElement(Tabs, {
        tabs,
        activeTab,
        onTabChange: setActiveTab
      }),
      
      React.createElement('div', { className: 'extras-tab-content' },
        activeTab === 'CILL' && renderCillTab(),
        activeTab === 'ADD ONS' && renderAddOnsTab(),
        activeTab === 'HEAD DRIP' && renderHeadDripTab(),
        activeTab === 'WEATHER BAR' && renderWeatherBarTab()
      ),
      
      React.createElement('div', { className: 'modal-actions' },
        React.createElement(Button, {
          variant: 'secondary',
          onClick: onClose
        }, 'Cancel'),
        React.createElement(Button, {
          variant: 'success',
          onClick: handleApply
        }, 'Apply Changes')
      )
    )
  );
}

export { FinishModal, CillModal };
