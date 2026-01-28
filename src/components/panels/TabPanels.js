import React from 'react';
import { useWindow } from '../../context/WindowContext.js';
import { Button, Card } from '../common/UIComponents.js';

/**
 * OpenersPanel Component
 * Panel for managing window openers
 */
function OpenersPanel({ onOpenModal }) {
  const { state, actions } = useWindow();
  const { panes, openers } = state;
  
  const openerIcons = {
    'side-hung-left': '◧',
    'side-hung-right': '◨',
    'top-hung': '⬒',
    'dummy': '▢',
    'fixed': '▢',
  };
  
  // Show empty state if no panes exist
  if (!panes || panes.length === 0) {
    return React.createElement('div', { className: 'panel openers-panel' },
      React.createElement('div', { className: 'panel-header' },
        React.createElement('h3', null, 'Window Openers'),
        React.createElement('p', { className: 'panel-subtitle' }, 'Configure how each pane opens')
      ),
      React.createElement('div', { className: 'empty-state' },
        React.createElement('div', { className: 'empty-state-icon' }, '✏️'),
        React.createElement('p', { className: 'empty-state-title' }, 'No Window Drawn Yet'),
        React.createElement('p', { className: 'empty-state-description' }, 
          'Draw a window frame on the canvas to configure openers for each pane'
        )
      )
    );
  }
  
  return React.createElement('div', { className: 'panel openers-panel' },
    React.createElement('div', { className: 'panel-header' },
      React.createElement('h3', null, 'Window Openers'),
      React.createElement('p', { className: 'panel-subtitle' }, 'Configure how each pane opens')
    ),
    
    React.createElement('div', { className: 'extras-list' },
      panes.map((pane) => {
        const opener = openers[pane.id] || { type: 'fixed', name: 'Fixed' };
        return React.createElement('div', {
          key: pane.id,
          className: `extra-item ${opener.type !== 'fixed' ? 'enabled' : 'disabled'}`,
          onClick: () => onOpenModal('opener', { paneId: pane.id })
        },
          React.createElement('div', { className: 'extra-item-icon' },
            React.createElement('span', { className: 'icon' }, 
              openerIcons[opener.type] || '▢'
            )
          ),
          React.createElement('div', { className: 'extra-item-content' },
            React.createElement('div', { className: 'extra-label-row' },
              React.createElement('span', { className: 'extra-label' }, `Pane ${pane.id}`),
              React.createElement('span', { 
                className: `toggle-indicator ${opener.type !== 'fixed' ? 'on' : 'off'}` 
              }, opener.type !== 'fixed' ? 'ACTIVE' : 'FIXED')
            ),
            React.createElement('span', { className: 'extra-description' },
              opener.name || 'Fixed - No opening'
            )
          ),
          React.createElement('button', { className: 'extra-edit-btn' }, '›')
        );
      })
    )
  );
}

/**
 * ProfilePanel Component
 * Panel for window profile settings
 */
function ProfilePanel({ onOpenModal }) {
  const { state, actions } = useWindow();
  
  const profiles = [
    { id: 'flush-casement', name: 'Flush Casement', icon: '▭', description: 'Modern flush sash design' },
    { id: 'sculptured', name: 'Sculptured', icon: '▯', description: 'Traditional sculptured appearance' },
    { id: 'chamfered', name: 'Chamfered', icon: '▱', description: 'Classic chamfered profile' },
  ];
  
  const currentProfile = state.productType.toLowerCase().replace(' ', '-');
  
  const handleProfileSelect = (profile) => {
    actions.setProductInfo({ productType: profile.name });
  };
  
  return React.createElement('div', { className: 'panel profile-panel' },
    React.createElement('div', { className: 'panel-header' },
      React.createElement('h3', null, 'Window Profile'),
      React.createElement('p', { className: 'panel-subtitle' }, 'Select your preferred window profile style')
    ),
    
    React.createElement('div', { className: 'extras-list' },
      profiles.map((profile) => {
        const isSelected = currentProfile.includes(profile.id);
        return React.createElement('div', {
          key: profile.id,
          className: `extra-item ${isSelected ? 'enabled' : 'disabled'}`,
          onClick: () => handleProfileSelect(profile)
        },
          React.createElement('div', { className: 'extra-item-icon' },
            React.createElement('span', { className: 'icon' }, profile.icon)
          ),
          React.createElement('div', { className: 'extra-item-content' },
            React.createElement('div', { className: 'extra-label-row' },
              React.createElement('span', { className: 'extra-label' }, profile.name),
              React.createElement('span', { 
                className: `toggle-indicator ${isSelected ? 'on' : 'off'}` 
              }, isSelected ? 'SELECTED' : 'SELECT')
            ),
            React.createElement('span', { className: 'extra-description' },
              profile.description
            )
          ),
          React.createElement('button', { className: 'extra-edit-btn' }, '›')
        );
      })
    )
  );
}

/**
 * FinishPanel Component
 * Panel for frame/sash finish settings
 */
function FinishPanel({ onOpenModal }) {
  const { state } = useWindow();
  const { finish } = state;
  
  const finishParts = [
    { id: 'frame', name: 'Frame Finish', icon: '▭', finish: finish.frame },
    { id: 'sash', name: 'Sash Finish', icon: '▢', finish: finish.sash },
  ];
  
  if (state.extras.cill.enabled) {
    finishParts.push({ id: 'cill', name: 'Cill Finish', icon: '▬', finish: finish.cill || { color: 'White Grain' } });
  }
  
  return React.createElement('div', { className: 'panel finish-panel' },
    React.createElement('div', { className: 'panel-header' },
      React.createElement('h3', null, 'Finish Options'),
      React.createElement('p', { className: 'panel-subtitle' }, 'Customize colors and finishes for each component')
    ),
    
    React.createElement('div', { className: 'extras-list' },
      finishParts.map((part) =>
        React.createElement('div', {
          key: part.id,
          className: 'extra-item enabled',
          onClick: () => onOpenModal('finish', { part: part.id })
        },
          React.createElement('div', { className: 'extra-item-icon' },
            React.createElement('span', { className: 'icon' }, part.icon)
          ),
          React.createElement('div', { className: 'extra-item-content' },
            React.createElement('div', { className: 'extra-label-row' },
              React.createElement('span', { className: 'extra-label' }, part.name),
              React.createElement('div', {
                className: 'finish-swatch',
                style: { 
                  backgroundColor: part.finish.colorHex || '#f8f6f0',
                  width: '28px',
                  height: '28px',
                  borderRadius: '6px',
                  border: '2px solid #ddd'
                }
              })
            ),
            React.createElement('span', { className: 'extra-description' },
              `${part.finish.type || 'Foils'} - ${part.finish.color || 'White Grain'}`
            )
          ),
          React.createElement('button', { className: 'extra-edit-btn' }, '›')
        )
      )
    )
  );
}

/**
 * GlassPanel Component
 * Panel for glass settings
 */
function GlassPanel({ onOpenModal }) {
  const { state } = useWindow();
  const { panes, glass } = state;
  const defaultGlass = glass.default || {};
  
  // Show empty state if no panes exist
  if (!panes || panes.length === 0) {
    return React.createElement('div', { className: 'panel glass-panel' },
      React.createElement('div', { className: 'panel-header' },
        React.createElement('h3', null, 'Glass Options'),
        React.createElement('p', { className: 'panel-subtitle' }, 'Configure glass specifications for each pane')
      ),
      React.createElement('div', { className: 'empty-state' },
        React.createElement('div', { className: 'empty-state-icon' }, '✏️'),
        React.createElement('p', { className: 'empty-state-title' }, 'No Window Drawn Yet'),
        React.createElement('p', { className: 'empty-state-description' }, 
          'Draw a window frame on the canvas to configure glass for each pane'
        )
      )
    );
  }
  
  return React.createElement('div', { className: 'panel glass-panel' },
    React.createElement('div', { className: 'panel-header' },
      React.createElement('h3', null, 'Glass Options'),
      React.createElement('p', { className: 'panel-subtitle' }, 'Configure glass specifications for each pane')
    ),
    
    // Default glass settings
    React.createElement('div', { className: 'default-settings-card', style: { 
      background: '#f8f9fa', 
      padding: '12px', 
      borderRadius: '8px', 
      marginBottom: '16px',
      border: '1px solid #e9ecef'
    } },
      React.createElement('div', { style: { fontSize: '12px', color: '#6c757d', marginBottom: '4px' } }, 'Default Glass'),
      React.createElement('div', { style: { fontSize: '14px', fontWeight: '600', color: '#333' } }, 
        `${defaultGlass.paneType || 'Double Glazed'} • ${defaultGlass.texture || 'Clear'}`
      )
    ),
    
    React.createElement('div', { className: 'extras-list' },
      panes.map((pane) => {
        const paneGlass = glass[pane.id] || defaultGlass;
        const hasCustomGlass = glass[pane.id] !== undefined;
        return React.createElement('div', {
          key: pane.id,
          className: `extra-item ${hasCustomGlass ? 'enabled' : 'disabled'}`,
          onClick: () => onOpenModal('glass', { paneId: pane.id })
        },
          React.createElement('div', { className: 'extra-item-icon' },
            React.createElement('span', { className: 'icon' }, '◱')
          ),
          React.createElement('div', { className: 'extra-item-content' },
            React.createElement('div', { className: 'extra-label-row' },
              React.createElement('span', { className: 'extra-label' }, `Pane ${pane.id}`),
              React.createElement('span', { 
                className: `toggle-indicator ${hasCustomGlass ? 'on' : 'off'}` 
              }, hasCustomGlass ? 'CUSTOM' : 'DEFAULT')
            ),
            React.createElement('span', { className: 'extra-description' },
              `${paneGlass.paneType || 'Double Glazed'} • ${paneGlass.texture || 'Clear'} • ${paneGlass.spacerBars || 'Black'} Spacer`
            )
          ),
          React.createElement('button', { className: 'extra-edit-btn' }, '›')
        );
      })
    )
  );
}

/**
 * GlazingPanel Component
 * Panel for glazing bar settings
 */
function GlazingPanel({ onOpenModal }) {
  const { state, actions } = useWindow();
  const { glazing } = state;
  
  const glazingTypes = [
    { id: 'None', name: 'None', icon: '□', description: 'No glazing bars' },
    { id: 'Astragal', name: 'Astragal', icon: '⊞', description: 'Surface-applied bars for traditional look' },
    { id: 'Georgian', name: 'Georgian', icon: '⊠', description: 'Internal muntin bars dividing glass' },
    { id: 'Leaded', name: 'Leaded', icon: '⊡', description: 'Decorative lead strips joining glass' },
  ];
  
  const currentType = glazing.type || 'None';
  
  // Get description for current glazing settings
  const getGlazingDescription = (type) => {
    if (type.id === 'None') return type.description;
    if (currentType !== type.id) return type.description;
    
    const hBars = glazing.horizontalBars || 0;
    const vBars = glazing.verticalBars || 0;
    
    let desc = `${hBars}H × ${vBars}V bars`;
    if (glazing.barProfile) desc += ` • ${glazing.barProfile}`;
    if (type.id === 'Leaded' && glazing.leadColor) {
      desc = `${hBars}H × ${vBars}V • ${glazing.jointType || 'Soldered'}`;
    }
    return desc;
  };
  
  return React.createElement('div', { className: 'panel glazing-panel' },
    React.createElement('div', { className: 'panel-header' },
      React.createElement('h3', null, 'Glazing Bars'),
      React.createElement('p', { className: 'panel-subtitle' }, 'Add decorative glazing bar patterns')
    ),
    
    // Current glazing info card if selected
    currentType !== 'None' && React.createElement('div', { 
      className: 'current-glazing-card',
      style: { 
        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)', 
        padding: '14px', 
        borderRadius: '8px', 
        marginBottom: '16px',
        border: '1px solid #dee2e6'
      }
    },
      React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
        React.createElement('div', null,
          React.createElement('div', { style: { fontSize: '11px', color: '#6c757d', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' } }, 'Current Style'),
          React.createElement('div', { style: { fontSize: '15px', fontWeight: '600', color: '#333' } }, currentType),
          React.createElement('div', { style: { fontSize: '12px', color: '#666', marginTop: '2px' } }, 
            `${glazing.horizontalBars || 0} horizontal • ${glazing.verticalBars || 0} vertical`
          )
        ),
        React.createElement('button', {
          style: {
            background: '#2ecc71',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: '600',
            cursor: 'pointer'
          },
          onClick: () => onOpenModal('glazing', { type: currentType })
        }, 'Edit')
      )
    ),
    
    React.createElement('div', { className: 'extras-list' },
      glazingTypes.map((type) => {
        const isSelected = currentType === type.id;
        return React.createElement('div', {
          key: type.id,
          className: `extra-item ${isSelected ? 'enabled' : 'disabled'}`,
          onClick: () => {
            if (type.id === 'None') {
              actions.setGlazing({ type: null, horizontalBars: 0, verticalBars: 0 });
            } else {
              onOpenModal('glazing', { type: type.id });
            }
          }
        },
          React.createElement('div', { className: 'extra-item-icon' },
            React.createElement('span', { className: 'icon' }, type.icon)
          ),
          React.createElement('div', { className: 'extra-item-content' },
            React.createElement('div', { className: 'extra-label-row' },
              React.createElement('span', { className: 'extra-label' }, type.name),
              React.createElement('span', { 
                className: `toggle-indicator ${isSelected ? 'on' : 'off'}` 
              }, isSelected ? 'ACTIVE' : 'SELECT')
            ),
            React.createElement('span', { className: 'extra-description' },
              getGlazingDescription(type)
            )
          ),
          type.id !== 'None' && React.createElement('button', { className: 'extra-edit-btn' }, '›')
        );
      })
    )
  );
}

/**
 * HardwarePanel Component
 * Panel for hardware settings - consistent layout with other panels
 */
function HardwarePanel({ onOpenModal }) {
  const { state } = useWindow();
  const { hardware } = state;
  
  // Map handle names to colors for preview
  const getHandleColor = (handleName) => {
    if (!handleName) return '#1a1a1a';
    const name = handleName.toLowerCase();
    if (name.includes('chrome')) return '#c0c0c0';
    if (name.includes('gold')) return '#d4af37';
    if (name.includes('graphite')) return '#5a5a5a';
    if (name.includes('satin')) return '#b8b8b8';
    if (name.includes('white')) return '#f5f5f5';
    if (name.includes('gunmetal')) return '#505050';
    return '#1a1a1a'; // black default
  };
  
  const handleColor = getHandleColor(hardware.handleType);
  const hasVentilation = hardware.ventilation && hardware.ventilation !== 'none';
  
  const ventilationNames = {
    'none': 'No Ventilation',
    'trickle-vent': 'Trickle Vent',
    'night-vent': 'Night Vent Restrictor',
    'egress-hinges': 'Egress Hinges'
  };
  
  const ventilationIcons = {
    'none': '✕',
    'trickle-vent': '≡',
    'night-vent': '☾',
    'egress-hinges': '⬚'
  };
  
  return React.createElement('div', { className: 'panel hardware-panel' },
    React.createElement('div', { className: 'panel-header' },
      React.createElement('h3', null, 'Hardware'),
      React.createElement('p', { className: 'panel-subtitle' }, 'Select handles and ventilation options')
    ),
    
    React.createElement('div', { className: 'extras-list' },
      // Handle Type Item
      React.createElement('div', {
        className: 'extra-item enabled',
        onClick: () => onOpenModal('hardware', { tab: 'HANDLES' })
      },
        React.createElement('div', { className: 'extra-item-icon' },
          // Mini handle SVG
          React.createElement('svg', {
            width: '32',
            height: '32',
            viewBox: '0 0 50 50',
            style: { display: 'block' }
          },
            React.createElement('ellipse', { cx: '12', cy: '28', rx: '8', ry: '8', fill: handleColor, stroke: '#333', strokeWidth: '0.5' }),
            React.createElement('path', {
              d: 'M 18 26 Q 28 22, 38 20 Q 44 18, 46 24 Q 47 28, 44 30',
              fill: 'none',
              stroke: handleColor,
              strokeWidth: '4',
              strokeLinecap: 'round'
            }),
            React.createElement('circle', { cx: '43', cy: '28', r: '3', fill: handleColor })
          )
        ),
        React.createElement('div', { className: 'extra-item-content' },
          React.createElement('div', { className: 'extra-label-row' },
            React.createElement('span', { className: 'extra-label' }, 'Handle Type'),
            React.createElement('span', { className: 'toggle-indicator on' }, 'SET')
          ),
          React.createElement('span', { className: 'extra-description' },
            hardware.handleType || 'Connoisseur Antique Black'
          )
        ),
        React.createElement('button', { className: 'extra-edit-btn' }, '›')
      ),
      
      // Ventilation Item
      React.createElement('div', {
        className: `extra-item ${hasVentilation ? 'enabled' : 'disabled'}`,
        onClick: () => onOpenModal('hardware', { tab: 'VENTILATION' })
      },
        React.createElement('div', { className: 'extra-item-icon' },
          React.createElement('span', { className: 'icon' }, 
            ventilationIcons[hardware.ventilation] || '✕'
          )
        ),
        React.createElement('div', { className: 'extra-item-content' },
          React.createElement('div', { className: 'extra-label-row' },
            React.createElement('span', { className: 'extra-label' }, 'Ventilation'),
            React.createElement('span', { 
              className: `toggle-indicator ${hasVentilation ? 'on' : 'off'}` 
            }, hasVentilation ? 'ENABLED' : 'NONE')
          ),
          React.createElement('span', { className: 'extra-description' },
            ventilationNames[hardware.ventilation] || 'No ventilation selected'
          )
        ),
        React.createElement('button', { className: 'extra-edit-btn' }, '›')
      )
    )
  );
}

/**
 * ExtrasPanel Component
 * Panel for extras/add-ons settings
 */
function ExtrasPanel({ onOpenModal }) {
  const { state, actions } = useWindow();
  const { extras } = state;
  
  return React.createElement('div', { className: 'panel extras-panel' },
    React.createElement('div', { className: 'panel-header' },
      React.createElement('h3', null, 'Extras & Add-ons'),
      React.createElement('p', { className: 'panel-subtitle' }, 'Customize your window with additional features')
    ),
    
    React.createElement('div', { className: 'extras-list' },
      // Cill
      React.createElement('div', {
        className: `extra-item ${extras.cill.enabled ? 'enabled' : 'disabled'}`,
        onClick: () => onOpenModal('extras', 'CILL')
      },
        React.createElement('div', { className: 'extra-item-icon' },
          React.createElement('span', { className: 'icon' }, '▬')
        ),
        React.createElement('div', { className: 'extra-item-content' },
          React.createElement('div', { className: 'extra-label-row' },
            React.createElement('span', { className: 'extra-label' }, 'Cill'),
            React.createElement('span', { className: `toggle-indicator ${extras.cill.enabled ? 'on' : 'off'}` },
              extras.cill.enabled ? 'ON' : 'OFF'
            )
          ),
          React.createElement('span', { className: 'extra-description' },
            extras.cill.enabled 
              ? `${extras.cill.type} (${extras.cill.length}mm)` 
              : 'Add a window cill'
          )
        ),
        React.createElement('button', { className: 'extra-edit-btn' }, '›')
      ),
      
      // Head Drip
      React.createElement('div', {
        className: `extra-item ${extras.headDrip ? 'enabled' : 'disabled'}`,
        onClick: () => onOpenModal('extras', 'HEAD DRIP')
      },
        React.createElement('div', { className: 'extra-item-icon' },
          React.createElement('span', { className: 'icon' }, '⌃')
        ),
        React.createElement('div', { className: 'extra-item-content' },
          React.createElement('div', { className: 'extra-label-row' },
            React.createElement('span', { className: 'extra-label' }, 'Head Drip'),
            React.createElement('span', { className: `toggle-indicator ${extras.headDrip ? 'on' : 'off'}` },
              extras.headDrip ? 'ON' : 'OFF'
            )
          ),
          React.createElement('span', { className: 'extra-description' },
            extras.headDrip ? 'Installed' : 'Weather protection at top'
          )
        ),
        React.createElement('button', { className: 'extra-edit-btn' }, '›')
      ),
      
      // Weather Bar
      React.createElement('div', {
        className: `extra-item ${extras.weatherBar ? 'enabled' : 'disabled'}`,
        onClick: () => onOpenModal('extras', 'WEATHER BAR')
      },
        React.createElement('div', { className: 'extra-item-icon' },
          React.createElement('span', { className: 'icon' }, '▭')
        ),
        React.createElement('div', { className: 'extra-item-content' },
          React.createElement('div', { className: 'extra-label-row' },
            React.createElement('span', { className: 'extra-label' }, 'Weather Bar'),
            React.createElement('span', { className: `toggle-indicator ${extras.weatherBar ? 'on' : 'off'}` },
              extras.weatherBar ? 'ON' : 'OFF'
            )
          ),
          React.createElement('span', { className: 'extra-description' },
            extras.weatherBar ? 'Installed' : 'Additional weather seal'
          )
        ),
        React.createElement('button', { className: 'extra-edit-btn' }, '›')
      )
    )
  );
}

export { OpenersPanel, ProfilePanel, FinishPanel, GlassPanel, GlazingPanel, HardwarePanel, ExtrasPanel };
