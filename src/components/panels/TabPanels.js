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
  const { state } = useWindow();
  
  const profiles = [
    { id: 'flush-casement', name: 'Flush Casement', icon: '▭', description: 'Modern flush sash design' },
    { id: 'sculptured', name: 'Sculptured', icon: '▯', description: 'Traditional sculptured appearance' },
    { id: 'chamfered', name: 'Chamfered', icon: '▱', description: 'Classic chamfered profile' },
  ];
  
  const currentProfile = state.productType.toLowerCase().replace(' ', '-');
  
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
          onClick: () => {}
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
    { id: 'Astragal', name: 'Astragal', icon: '⊞', description: 'Traditional astragal bars' },
    { id: 'Georgian', name: 'Georgian', icon: '⊠', description: 'Classic Georgian style' },
    { id: 'Leaded', name: 'Leaded', icon: '⊡', description: 'Decorative leaded design' },
  ];
  
  const currentType = glazing.type || 'None';
  
  return React.createElement('div', { className: 'panel glazing-panel' },
    React.createElement('div', { className: 'panel-header' },
      React.createElement('h3', null, 'Glazing Bars'),
      React.createElement('p', { className: 'panel-subtitle' }, 'Add decorative glazing bar patterns')
    ),
    
    React.createElement('div', { className: 'extras-list' },
      glazingTypes.map((type) => {
        const isSelected = currentType === type.id;
        return React.createElement('div', {
          key: type.id,
          className: `extra-item ${isSelected ? 'enabled' : 'disabled'}`,
          onClick: () => {
            if (type.id === 'None') {
              actions.setGlazing({ type: null });
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
              isSelected && type.id !== 'None' 
                ? `${glazing.barProfile || 'Standard'} • ${glazing.backToBack ? 'Back to Back' : 'Single Side'}`
                : type.description
            )
          ),
          React.createElement('button', { className: 'extra-edit-btn' }, '›')
        );
      })
    )
  );
}

/**
 * HardwarePanel Component
 * Panel for hardware settings
 */
function HardwarePanel({ onOpenModal }) {
  const { state } = useWindow();
  const { hardware } = state;
  
  const hardwareOptions = [
    { 
      id: 'handle', 
      name: 'Handle Type', 
      icon: '⊶', 
      value: hardware.handleType,
      description: hardware.handleType || 'Connoisseur Antique Black'
    },
    { 
      id: 'ventilation', 
      name: 'Ventilation', 
      icon: '≡', 
      value: hardware.ventilation,
      description: hardware.ventilation || 'None selected'
    },
  ];
  
  return React.createElement('div', { className: 'panel hardware-panel' },
    React.createElement('div', { className: 'panel-header' },
      React.createElement('h3', null, 'Hardware'),
      React.createElement('p', { className: 'panel-subtitle' }, 'Select handles and ventilation options')
    ),
    
    React.createElement('div', { className: 'extras-list' },
      hardwareOptions.map((option) => {
        const hasValue = option.value && option.value !== 'None';
        return React.createElement('div', {
          key: option.id,
          className: `extra-item ${hasValue ? 'enabled' : 'disabled'}`,
          onClick: () => onOpenModal('hardware')
        },
          React.createElement('div', { className: 'extra-item-icon' },
            React.createElement('span', { className: 'icon' }, option.icon)
          ),
          React.createElement('div', { className: 'extra-item-content' },
            React.createElement('div', { className: 'extra-label-row' },
              React.createElement('span', { className: 'extra-label' }, option.name),
              React.createElement('span', { 
                className: `toggle-indicator ${hasValue ? 'on' : 'off'}` 
              }, hasValue ? 'SET' : 'NOT SET')
            ),
            React.createElement('span', { className: 'extra-description' },
              option.description
            )
          ),
          React.createElement('button', { className: 'extra-edit-btn' }, '›')
        );
      })
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
        onClick: () => onOpenModal('cill')
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
        onClick: () => onOpenModal('cill')
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
        onClick: () => onOpenModal('cill')
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
