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
  
  const openerTypes = [
    { id: 'side-hung-left', name: 'Side Hung Left', icon: '◧' },
    { id: 'side-hung-right', name: 'Side Hung Right', icon: '◨' },
    { id: 'top-hung', name: 'Top Hung', icon: '⬒' },
    { id: 'fixed', name: 'Fixed', icon: '▢' },
  ];
  
  return React.createElement('div', { className: 'panel openers-panel' },
    React.createElement('h3', null, 'Window Openers'),
    React.createElement('p', { className: 'panel-description' },
      'Click on a pane in the preview to set its opener type'
    ),
    
    React.createElement('div', { className: 'pane-openers-list' },
      panes.map((pane) =>
        React.createElement('div', {
          key: pane.id,
          className: 'pane-opener-item',
          onClick: () => onOpenModal('opener', { paneId: pane.id })
        },
          React.createElement('span', { className: 'pane-label' }, `Pane ${pane.id}`),
          React.createElement('span', { className: 'opener-type' },
            openers[pane.id]?.name || 'Fixed'
          ),
          React.createElement('button', { className: 'edit-btn' }, '✏️')
        )
      )
    ),
    
    React.createElement('div', { className: 'quick-actions' },
      React.createElement(Button, {
        variant: 'outline',
        onClick: () => {
          panes.forEach(pane => {
            actions.setOpener(pane.id, { type: 'side-hung', hinge: 'left', name: 'Side Hung Left' });
          });
        }
      }, 'All Side Hung'),
      React.createElement(Button, {
        variant: 'outline',
        onClick: () => {
          panes.forEach(pane => {
            actions.setOpener(pane.id, { type: 'top-hung', hinge: 'top', name: 'Top Hung' });
          });
        }
      }, 'All Top Hung')
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
    { id: 'flush-casement', name: 'Flush Casement', description: 'Modern flush sash design' },
    { id: 'sculptured', name: 'Sculptured', description: 'Traditional sculptured appearance' },
    { id: 'chamfered', name: 'Chamfered', description: 'Classic chamfered profile' },
  ];
  
  return React.createElement('div', { className: 'panel profile-panel' },
    React.createElement('h3', null, 'Window Profile'),
    
    React.createElement('div', { className: 'profile-grid' },
      profiles.map((profile) =>
        React.createElement(Card, {
          key: profile.id,
          selected: state.productType.toLowerCase().includes(profile.id.replace('-', ' ')),
          onClick: () => {},
          className: 'profile-card'
        },
          React.createElement('span', { className: 'profile-name' }, profile.name),
          React.createElement('p', { className: 'profile-desc' }, profile.description)
        )
      )
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
  
  return React.createElement('div', { className: 'panel finish-panel' },
    React.createElement('h3', null, 'Finish Options'),
    
    React.createElement('div', { className: 'finish-sections' },
      React.createElement('div', {
        className: 'finish-section',
        onClick: () => onOpenModal('finish', { part: 'frame' })
      },
        React.createElement('span', { className: 'finish-label' }, 'Frame Finish'),
        React.createElement('div', { className: 'finish-preview' },
          React.createElement('div', {
            className: 'finish-swatch',
            style: { backgroundColor: finish.frame.colorHex || '#f8f6f0' }
          }),
          React.createElement('span', null, finish.frame.color)
        ),
        React.createElement('button', { className: 'edit-btn' }, '✏️')
      ),
      
      React.createElement('div', {
        className: 'finish-section',
        onClick: () => onOpenModal('finish', { part: 'sash' })
      },
        React.createElement('span', { className: 'finish-label' }, 'Sash Finish'),
        React.createElement('div', { className: 'finish-preview' },
          React.createElement('div', {
            className: 'finish-swatch',
            style: { backgroundColor: finish.sash.colorHex || '#f8f6f0' }
          }),
          React.createElement('span', null, finish.sash.color)
        ),
        React.createElement('button', { className: 'edit-btn' }, '✏️')
      ),
      
      state.extras.cill.enabled && React.createElement('div', {
        className: 'finish-section',
        onClick: () => onOpenModal('finish', { part: 'cill' })
      },
        React.createElement('span', { className: 'finish-label' }, 'Cill Finish'),
        React.createElement('div', { className: 'finish-preview' },
          React.createElement('div', {
            className: 'finish-swatch',
            style: { backgroundColor: finish.cill?.colorHex || '#f8f6f0' }
          }),
          React.createElement('span', null, finish.cill?.color || 'White Grain')
        ),
        React.createElement('button', { className: 'edit-btn' }, '✏️')
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
  
  return React.createElement('div', { className: 'panel glass-panel' },
    React.createElement('h3', null, 'Glass Options'),
    
    React.createElement('div', { className: 'glass-summary' },
      React.createElement('p', null, `Type: ${defaultGlass.paneType || 'Double Glazed'}`),
      React.createElement('p', null, `Texture: ${defaultGlass.texture || 'Clear'}`),
      React.createElement('p', null, `Spacer: ${defaultGlass.spacerBars || 'Black'}`)
    ),
    
    React.createElement('p', { className: 'panel-description' },
      'Click on a pane to customize its glass'
    ),
    
    React.createElement('div', { className: 'pane-glass-list' },
      panes.map((pane) =>
        React.createElement('div', {
          key: pane.id,
          className: 'pane-glass-item',
          onClick: () => onOpenModal('glass', { paneId: pane.id })
        },
          React.createElement('span', { className: 'pane-label' }, `Pane ${pane.id}`),
          React.createElement('span', { className: 'glass-type' },
            (glass[pane.id] || defaultGlass).texture || 'Clear'
          ),
          React.createElement('button', { className: 'edit-btn' }, '✏️')
        )
      )
    ),
    
    React.createElement(Button, {
      variant: 'primary',
      onClick: () => onOpenModal('glass', { paneId: 'all' })
    }, 'Edit All Glass')
  );
}

/**
 * GlazingPanel Component
 * Panel for glazing bar settings
 */
function GlazingPanel({ onOpenModal }) {
  const { state, actions } = useWindow();
  const { glazing } = state;
  
  const glazingTypes = ['None', 'Astragal', 'Georgian', 'Leaded'];
  
  return React.createElement('div', { className: 'panel glazing-panel' },
    React.createElement('h3', null, 'Glazing Bars'),
    
    React.createElement('div', { className: 'glazing-type-grid' },
      glazingTypes.map((type) =>
        React.createElement(Card, {
          key: type,
          selected: (glazing.type || 'None') === type,
          onClick: () => {
            if (type === 'None') {
              actions.setGlazing({ type: null });
            } else {
              onOpenModal('glazing', { type });
            }
          },
          className: 'glazing-type-card'
        }, type)
      )
    ),
    
    glazing.type && React.createElement('div', { className: 'glazing-details' },
      React.createElement('p', null, `Profile: ${glazing.barProfile}`),
      React.createElement('p', null, `Back to Back: ${glazing.backToBack ? 'Yes' : 'No'}`),
      React.createElement(Button, {
        variant: 'outline',
        onClick: () => onOpenModal('glazing-dimensions')}
      , 'Edit Dimensions')
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
  
  return React.createElement('div', { className: 'panel hardware-panel' },
    React.createElement('h3', null, 'Hardware'),
    
    React.createElement('div', {
      className: 'hardware-section',
      onClick: () => onOpenModal('hardware')
    },
      React.createElement('span', { className: 'hardware-label' }, 'Handle Type'),
      React.createElement('span', { className: 'hardware-value' }, hardware.handleType),
      React.createElement('button', { className: 'edit-btn' }, '✏️')
    ),
    
    React.createElement('div', {
      className: 'hardware-section',
      onClick: () => onOpenModal('hardware')
    },
      React.createElement('span', { className: 'hardware-label' }, 'Ventilation'),
      React.createElement('span', { className: 'hardware-value' },
        hardware.ventilation || 'None'
      ),
      React.createElement('button', { className: 'edit-btn' }, '✏️')
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
